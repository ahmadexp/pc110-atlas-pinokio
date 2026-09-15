const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const launcher = require("../pinokio.js");
const metadata = require("../pinokio.json");
const start = require("../start.js");
const update = require("../update.js");
const { targetFor, release, downloads, appStore, snapStore } = require("../app/platforms.js");
const root = path.resolve(__dirname, "..");
const mac = { platform: "darwin", arch: "arm64" };
const idle = { running: () => false };

test("metadata declares all three OS families and preserves the schema", () => {
  assert.equal(launcher.version, "3.0");
  assert.equal(launcher.launch_type, "desktop");
  assert.deepEqual(metadata.platform, ["darwin", "win32", "linux"]);
  assert.deepEqual(metadata.arch, ["arm64", "x64"]);
  assert.match(metadata.description, /without QEMU or guest audio/);
  assert.ok(fs.existsSync(path.join(root, metadata.icon)));
});

for (const kernel of [mac, { platform: "win32", arch: "x64" }, { platform: "linux", arch: "x64" }, { platform: "linux", arch: "arm64" }]) {
  test(`${kernel.platform}/${kernel.arch} defaults to launch with a matching installer`, async () => {
    const menu = await launcher.menu(kernel, idle);
    assert.deepEqual(menu.filter(item => item.default).map(item => item.href), ["start.js"]);
    for (const item of menu.filter(item => !item.popout)) {
      assert.ok(fs.existsSync(path.join(root, item.href)), item.href);
    }
    const script = await start(kernel);
    const launch = script.run.find(step => step.method === "app.launch");
    assert.ok(menu.some(item => item.href === launch.params.install && item.popout));
    assert.equal(launch.params.refresh, true);
    assert.equal(launch.params.installTimeout, 600000);
    assert.equal(launch.params.installPollInterval, 5000);
    assert.ok(script.run.every(step => ["app.launch", "log"].includes(step.method)));
    assert.ok(!script.daemon);
    assert.match(script.run.at(-1).params.text, /script status is not emulator status/);
    if (kernel.platform !== "darwin") {
      assert.deepEqual(targetFor(kernel).identity, { app: "PC110 Atlas" });
      assert.match(script.run[0].params.text, /not QEMU/);
    }
  });
}

test("updating does not automatically relaunch the app", async () => {
  const menu = await launcher.menu(mac, { running: file => file === "update.js" });
  assert.deepEqual(menu.filter(item => item.default).map(item => item.href), ["update.js"]);
});

for (const kernel of [
  { platform: "darwin", arch: "x64" },
  { platform: "win32", arch: "arm64" },
  { platform: "win32", arch: "ia32" },
  { platform: "linux", arch: "ia32" },
  { platform: "linux", arch: "arm" },
  { platform: "freebsd", arch: "x64" },
]) {
  test(`${kernel.platform}/${kernel.arch} shows help and refuses direct launch`, async () => {
    const menu = await launcher.menu(kernel, idle);
    assert.ok(!menu.some(item => item.href === "start.js"));
    assert.deepEqual(menu.filter(item => item.default).map(item => item.href), ["README.md"]);
    await assert.rejects(start(kernel), /not available|No published PC110/);
    assert.equal(targetFor(kernel), null);
  });
}

test("native launch uses the exact app identity, not a machine-specific path or shell", async () => {
  const script = await start(mac);
  assert.ok(!script.daemon);
  const launch = script.run.find(step => step.method === "app.launch");
  assert.deepEqual(launch.params, {
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

test("Windows points to the published x64 MSI and preserves Start menu discovery", () => {
  const target = targetFor({ platform: "win32", arch: "x64" });
  assert.equal(target.install, `${downloads}/pc110-atlas-1.0.0-windows-x64.msi`);
  assert.match(target.requirements, /Start menu shortcut/);
  assert.ok(!target.install.includes(appStore));
});

for (const arch of ["x64", "arm64"]) {
  for (const [command, suffix] of [["apt-get", "deb"], ["dnf", "rpm"], ["yum", "rpm"]]) {
    test(`Linux ${arch} selects ${suffix} with ${command}`, () => {
      const target = targetFor({ platform: "linux", arch, which: name => name === command ? `/bin/${name}` : null });
      assert.equal(target.install, `${downloads}/pc110-atlas-1.0.0-linux-${arch}.${suffix}`);
      assert.match(target.requirements, /graphical desktop required/);
    });
  }
}

test("Linux favors native packages before Snap and handles absent package managers", () => {
  const kernel = { platform: "linux", arch: "arm64" };
  assert.equal(targetFor({ ...kernel, which: () => "/bin/tool" }).install, `${downloads}/pc110-atlas-1.0.0-linux-arm64.deb`);
  assert.equal(targetFor({ ...kernel, which: name => name === "snap" ? "/bin/snap" : null }).install, snapStore);
  assert.equal(targetFor({ ...kernel, which: () => null }).install, release);
  assert.equal(targetFor(kernel).install, release);
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
    ".github/workflows/test.yml", ".gitignore", "LICENSE", "README.md", "app/platforms.js", "icon.png", "pinokio.js", "pinokio.json", "start.js", "tests/launcher.test.cjs", "update.js",
  ].sort());
});
