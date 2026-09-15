module.exports = {
  run: [{
    method: "shell.run",
    params: {
      message: "git pull --ff-only",
    },
  }, {
    method: "log",
    params: {
      text: "Launcher updated. PC110 Atlas itself is updated separately through the App Store. Personal media and app settings were not changed by this launcher update.",
    },
  }],
};
