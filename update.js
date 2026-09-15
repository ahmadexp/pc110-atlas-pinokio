module.exports = {
  run: [{
    method: "shell.run",
    params: {
      message: "git pull --ff-only",
    },
  }, {
    method: "log",
    params: {
      text: "Launcher updated. Update PC110 Atlas separately through the Mac App Store, your Linux package manager, or the public Windows/Linux installers. This action does not update or reset the app or its personal media.",
    },
  }],
};
