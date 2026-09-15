module.exports = async (kernel) => {
  if (kernel.platform !== "darwin" || kernel.arch !== "arm64") {
    throw new Error("This launcher requires an Apple silicon Mac with macOS 14 or later. Windows, Linux and Intel Macs are not supported by this launcher.");
  }
  return {
    run: [{
      method: "app.launch",
      params: {
        id: "org.opensourcepc110.atlas",
        refresh: true,
        install: "https://apps.apple.com/us/app/pc-110/id6801404183",
        installTimeout: 600000,
        installPollInterval: 5000,
      },
    }, {
      method: "log",
      params: { json2: "{{input}}" },
    }, {
      method: "log",
      params: {
        text: "PC110 Atlas opened in its native desktop window. This launcher has finished; the app continues independently. Use the app to import your own media and start a guest. Quit the app through its own menu. There is no web UI or guest-control API, and Pinokio script status is not emulator status.",
      },
    }],
  };
};
