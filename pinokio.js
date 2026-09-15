const metadata = require("./pinokio.json");

module.exports = {
  version: "3.0",
  ...metadata,
  launch_type: "desktop",
  menu: async (kernel, info) => {
    const supported = kernel.platform === "darwin" && kernel.arch === "arm64";
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
        text: supported ? "Setup and help" : "Requires an Apple silicon Mac",
        href: "README.md",
        ...(!supported ? { default: true } : {}),
      },
      {
        icon: "fa-solid fa-rotate-right",
        text: updating ? "Updating launcher..." : "Update launcher only",
        href: "update.js",
        ...(updating && supported ? { default: true } : {}),
      },
      {
        icon: "fa-brands fa-app-store",
        text: "PC110 Atlas on the App Store",
        href: "https://apps.apple.com/us/app/pc-110/id6801404183",
        popout: true,
      },
      {
        icon: "fa-brands fa-github",
        text: "Source and support",
        href: "https://github.com/ahmadexp/pc110-atlas-pinokio",
        popout: true,
      },
    ];
  },
};
