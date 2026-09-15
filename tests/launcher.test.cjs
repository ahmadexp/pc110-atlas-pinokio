const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const launcher = require("../pinokio.js");
const metadata = require("../pinokio.json");
const start = require("../start.js");
const update = require("../update.js");
const root = path.resolve(__dirname, "..");
const mac = { platform: "darwin", arch: "arm64" };
const idle = { running: () => false };

test("metadata declares Mac-only requirements and preserves the schema", () => {
  assert.equal(launcher.version, "3.0");
  assert.equal(launcher.launch_type, "desktop");
  assert.deepEqual(metadata.platform, ["darwin"]);
  assert.deepEqual(metadata.arch, ["arm64"]);
  assert.match(metadata.description, /macOS 14/);
  assert.ok(fs.existsSync(path.join(root, metadata.icon)));
});

test("supported Macs default to opening or installing the app", async () => {
  const menu = await launcher.menu(mac, idle);
  assert.deepEqual(menu.filter(item => item.default).map(item => item.href), ["start.js"]);
  for (const item of menu.filter(item => !item.popout)) {
    assert.ok(fs.existsSync(path.join(root, item.href)), item.href);
  }
});

test("updating does not automatically relaunch the app", async () => {
  const menu = await launcher.menu(mac, { running: file => file === "update.js" });
  assert.deepEqual(menu.filter(item => item.default).map(item => item.href), ["update.js"]);
});

for (const kernel of [
  { platform: "darwin", arch: "x64" },
  { platform: "win32", arch: "x64" },
  { platform: "linux", arch: "arm64" },
]) {
  test(`${kernel.platform}/${kernel.arch} shows help and refuses direct launch`, async () => {
    const menu = await launcher.menu(kernel, idle);
    assert.ok(!menu.some(item => item.href === "start.js"));
    assert.deepEqual(menu.filter(item => item.default).map(item => item.href), ["README.md"]);
    await assert.rejects(start(kernel), /requires an Apple silicon Mac/);
  });
}

test("native launch uses the exact app identity, not a machine-specific path or shell", async () => {
  const script = await start(mac);
  assert.ok(!script.daemon);
  assert.equal(script.run[0].method, "app.launch");
  assert.deepEqual(script.run[0].params, {
    id: "org.opensourcepc110.atlas",
    refresh: true,
    install: "https://apps.apple.com/us/app/pc-110/id6801404183",
    installTimeout: 600000,
    installPollInterval: 5000,
  });
  assert.ok(script.run.every(step => ["app.launch", "log"].includes(step.method)));
  assert.ok(!JSON.stringify(script).includes("/Applications/"));
  assert.match(script.run.at(-1).params.text, /script status is not emulator status/);
});

test("updates are fast-forward only and do not target the app or personal media", () => {
  const commands = update.run.filter(step => step.method === "shell.run");
  assert.deepEqual(commands.map(step => step.params), [{ message: "git pull --ff-only" }]);
  assert.ok(!fs.existsSync(path.join(root, "reset.js")));
  assert.ok(!fs.existsSync(path.join(root, "stop.js")));
});

test("public allowlist excludes private/generated material", () => {
  const probe = spawnSync("git", ["check-ignore", "--no-index", "--stdin"], {
    cwd: root,
    input: ["ENVIRONMENT", "logs/api/start.js/latest", ".env", "media/disk.img", "app/source.swift", "launch.js"].join("\n") + "\n",
    encoding: "utf8",
  });
  assert.equal(probe.status, 0, probe.stderr);
  assert.equal(probe.stdout.trim().split("\n").length, 6);
  const files = spawnSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8" });
  assert.equal(files.status, 0, files.stderr);
  assert.deepEqual(files.stdout.trim().split("\n").sort(), [
    ".gitignore", "LICENSE", "README.md", "icon.png", "pinokio.js", "pinokio.json", "start.js", "tests/launcher.test.cjs", "update.js",
  ].sort());
});
