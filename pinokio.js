const metadata = require("./pinokio.json");
const { targetFor } = require("./app/platforms.js");

module.exports = {
  version: "3.0",
  ...metadata,
  launch_type: "desktop",
  menu: async (kernel, info) => {
    const target = targetFor(kernel);
    const supported = Boolean(target);
    const updating = info.running("update.js");
    return [
      ...(supported ? [{
        icon: "fa-solid fa-laptop",
        text: "Open or install PC110 Atlas",
        href: "start.js",
        default: !updating,
      }] : []),
      {
        icon: "fa-solid fa-book",
        text: supported ? "Setup and help" : "Platform requirements and availability",
        href: "README.md",
        ...(!supported ? { default: true } : {}),
      },
      {
        icon: "fa-solid fa-rotate-right",
        text: updating ? "Updating launcher..." : "Update launcher only",
        href: "update.js",
        ...(updating && supported ? { default: true } : {}),
      },
      ...(target ? [{
        icon: kernel.platform === "darwin" ? "fa-brands fa-app-store" : "fa-solid fa-download",
        text: target.installLabel,
        href: target.install,
        popout: true,
      }] : []),
      {
        icon: "fa-brands fa-github",
        text: "Source and support",
        href: "https://github.com/ahmadexp/pc110-atlas-pinokio",
        popout: true,
      },
    ];
  },
};
