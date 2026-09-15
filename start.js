const { targetFor, unsupportedReason } = require("./app/platforms.js");

module.exports = async (kernel) => {
  const target = targetFor(kernel);
  if (!target) throw new Error(unsupportedReason(kernel));
  return {
    run: [{
      method: "log",
      params: { text: target.requirements },
    }, {
      method: "app.launch",
      params: {
        ...target.identity,
        refresh: true,
        install: target.install,
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
