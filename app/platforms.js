const release = "https://github.com/ahmadexp/homebrew-pc110-atlas/releases/tag/desktop-v1.0.0";
const downloads = "https://github.com/ahmadexp/homebrew-pc110-atlas/releases/download/desktop-v1.0.0";
const appStore = "https://apps.apple.com/us/app/pc-110/id6801404183";
const snapStore = "https://snapcraft.io/pc110-atlas";
const portableNotice = "The Intel Mac, Windows and Linux 1.0.0 packages use the portable PC110 core, not QEMU, and do not include guest audio. Bring your own lawfully obtained firmware and raw disk images.";

function targetFor(kernel) {
  const { platform, arch } = kernel;
  if (platform === "darwin" && arch === "arm64") {
    return {
      identity: { id: "org.opensourcepc110.atlas" },
      install: appStore,
      installLabel: "Mac App Store",
      requirements: "Apple silicon Mac, macOS 14 or later. Complete App Store installation if prompted.",
    };
  }
  if (platform === "darwin" && arch === "x64") {
    return {
      identity: { id: "org.opensourcepc110.atlas.desktop" },
      install: `${downloads}/pc110-atlas-1.0.0-macos-x64.dmg`,
      installLabel: "Intel Mac installer",
      requirements: `Intel Mac, macOS 12 or later. Open the signed and notarized DMG and drag PC110 Atlas into Applications. Keep any different edition already installed instead of replacing it. ${portableNotice}`,
    };
  }
  if (platform === "win32" && arch === "x64") {
    return {
      identity: { app: "PC110 Atlas" },
      install: `${downloads}/pc110-atlas-1.0.0-windows-x64.msi`,
      installLabel: "Windows x64 installer",
      requirements: `Windows 10 or later, x64. Run the MSI installer and approve Windows installation prompts. Keep the Start menu shortcut enabled so Pinokio can find the app. ${portableNotice}`,
    };
  }
  if (platform === "linux" && ["x64", "arm64"].includes(arch)) {
    const has = command => Boolean(kernel.which && kernel.which(command));
    let format;
    if (has("apt-get")) format = "deb";
    else if (has("dnf") || has("yum")) format = "rpm";
    const useSnap = !format && has("snap");
    return {
      identity: { app: "PC110 Atlas" },
      install: format ? `${downloads}/pc110-atlas-1.0.0-linux-${arch}.${format}` : useSnap ? snapStore : release,
      installLabel: format ? `Linux ${arch} ${format.toUpperCase()} installer` : useSnap ? "Linux Snap Store" : "Linux downloads and requirements",
      requirements: `Linux ${arch}, graphical desktop required. DEB packages target Ubuntu 24.04 or compatible systems; RPM packages require compatible system libraries. Install using your distribution's software installer or the commands in Setup and help. ${portableNotice}`,
    };
  }
  return null;
}

function unsupportedReason(kernel) {
  return `No published PC110 Atlas package is supported by this launcher on ${kernel.platform}/${kernel.arch}. Supported targets are macOS x64/arm64, Windows x64, and Linux x64/arm64. A native Windows ARM64 package and 32-bit packages are not available.`;
}

module.exports = { targetFor, unsupportedReason, release, downloads, appStore, snapStore, portableNotice };
