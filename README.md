# PC110 Atlas for Pinokio

Open **PC110 Atlas** on macOS, Windows and Linux from Pinokio. Explore the IBM PC110's
history, hardware and schematics, and emulate it using your own lawfully obtained
firmware and system media. This public repository contains only the launcher,
documentation and icon, not the application source, binary or personal media.

## Requirements

- **Pinokio 8.2 or later**, with native desktop-app launch support.
- Network access to download the launcher and, if needed, the app.
- A graphical desktop and one of the supported combinations below.

| Platform | Architecture | Application and installation |
| --- | --- | --- |
| macOS 14+ | Apple silicon (M1 or later) | Native Mac App Store edition; [PC 110](https://apps.apple.com/us/app/pc-110/id6801404183) |
| macOS 12+ | Intel x64 | Portable desktop 1.0.0; signed and notarized [Intel Mac DMG](https://github.com/ahmadexp/homebrew-pc110-atlas/releases/download/desktop-v1.0.0/pc110-atlas-1.0.0-macos-x64.dmg) |
| Windows 10+ | x64 | Portable desktop 1.0.0; public MSI, with Start menu shortcut enabled |
| Linux desktop | x64 or ARM64 | Portable desktop 1.0.0; architecture-specific DEB/RPM or Snap |

The launcher covers the three operating-system families supported by Pinokio,
not every architecture or Linux distribution. Linux DEBs target **Ubuntu 24.04
or compatible systems**. RPMs need compatible libraries (including glibc 2.34+
and graphics/font libraries); package managers resolve declared dependencies.
A desktop session with working graphics is required, not a headless server.

Native Windows ARM64 and 32-bit packages are unavailable. The launcher rejects these combinations instead
of offering a package for the wrong platform.

### Emulator capabilities differ by edition

The published **Intel Mac/Windows/Linux 1.0.0 packages use the portable PC110 core, not
QEMU, and do not include guest audio**. They include the Atlas hardware library,
schematics, history and media import. The native Mac App Store app is a separate
edition. Adding these launch paths does not port QEMU/audio or guarantee that
every Windows 95 or PersonaWare image will run. No firmware or system media is
included. See the [public release notes](https://github.com/ahmadexp/homebrew-pc110-atlas/releases/tag/desktop-v1.0.0).

## Install and launch

1. Open Pinokio, choose **Download from URL**, and paste:
   `https://github.com/ahmadexp/pc110-atlas-pinokio`
2. Open **PC110 Atlas** and select **Open or install PC110 Atlas**.
3. If the app is missing, follow the platform-specific link and complete installation.
   Pinokio checks for it for up to ten minutes and opens it when detected. If
   installation takes longer, finish installing and run the launcher again.
4. PC110 Atlas opens in its native window, or comes forward if already running.
   Import your own media and choose Run inside the app to start an emulator.

Installation is user-confirmed through the App Store or the operating system's
package installer. Pinokio opens a link and waits for detection; it does not
silently install packages or approve elevation prompts. macOS uses the bundle
identifier, while Windows/Linux use the registered application name.

On Intel Macs, open the downloaded DMG and drag **PC110 Atlas** into
**Applications**. This is the portable desktop edition, not the Apple silicon
Mac App Store app. The DMG is Developer ID signed and Apple notarized. Do not
disable Gatekeeper. If another edition is already installed, keep both instead
of replacing it; the launcher selects the portable edition by its own bundle ID.

On Windows, run the downloaded MSI and leave its **Start menu shortcut enabled**.
Approve the normal installation prompts yourself. The release also offers an
EXE installer. This launcher does not bypass SmartScreen or signature warnings;
verify the download's source and checksum before deciding to proceed.

On Linux, Pinokio selects a DEB when `apt-get` is present, an RPM for `dnf`/`yum`,
or the Snap Store when only `snap` is detected. Otherwise it opens the release
page. Install with your graphical software manager. If it has no package-file
handler, use one of these examples from the directory containing the download
(replace `x64` with `arm64` for ARM64):

```sh
sudo apt install ./pc110-atlas-1.0.0-linux-x64.deb
# Or, on a compatible RPM distribution:
sudo dnf install ./pc110-atlas-1.0.0-linux-x64.rpm
# Or, on a distribution with snapd:
sudo snap install pc110-atlas
```

Use a package manager, not archive extraction, so dependencies and desktop
shortcuts are installed. If an installed Snap is not detected, sign out and
back in to refresh desktop application paths, then retry. Systems without a
compatible package manager or libraries are not guaranteed to work.

Intel Mac/Windows/Linux download links are pinned to the public **desktop-v1.0.0** release.
Compare downloads with its **SHA256SUMS** before installation. In PowerShell use
`Get-FileHash` with `-Algorithm SHA256`; on Linux use `sha256sum`; on macOS use
`shasum -a 256`. The launcher
does not itself download or verify the package bytes. No private-repository
access, separately installed Java, or source compilation is required.

The launcher process ends after the operating system accepts the open request. That is normal,
even while the native app remains open. Pinokio's script status is not the
emulator's running status. Quit PC110 Atlas through its own application menu.
There is no web UI, readiness URL, remote-control API, or automatic shutdown.

## Updates and removal

- **Update launcher only** pulls this repository using `git pull --ff-only`.
  Conflicting local edits are preserved and may cause Git to stop.
- Update PC110 Atlas through the **Mac App Store**, your Linux package manager,
  or the public Intel Mac/Windows/Linux installers. Portable package links stay pinned
  until this launcher adopts a newer release. The launcher does not update
  Pinokio, replace the app, alter signatures or disable security checks.
- There are no local app dependencies to reset. To reinstall this launcher,
  remove its entry in Pinokio and download the repository again.
- Removing the launcher does **not** uninstall the app or delete its media.
  Manage media inside the app. Back up valuable disk images before running
  guest software that may write to them.

## Data and safety

- Your existing app version, settings and private media vault remain in use.
- No BIOS, ROM, PersonaWare, DOS or Windows files are bundled, copied or uploaded.
- The launcher does not automatically start, stop or reset a guest.
- The launcher has no analytics or telemetry of its own. Pinokio, GitHub and
  the App Store have their own network behavior and privacy policies.
- Do not attach private media, credentials or unredacted logs to public issues.

## Programmatic use and API limits

Pinokio's command-line interface can download and invoke the launcher:

```sh
pterm download https://github.com/ahmadexp/pc110-atlas-pinokio
pterm run pc110-atlas-pinokio --default start.js
```

Use the returned local name or canonical reference if Pinokio chooses a different
folder name. The launcher calls Pinokio's documented `app.launch` API with
bundle ID `org.opensourcepc110.atlas` on Apple silicon Macs,
`org.opensourcepc110.atlas.desktop` on Intel Macs, and application name `PC110 Atlas`
on Windows/Linux. `app/platforms.js` maps supported OS/architecture pairs to
their public install links and Linux package formats.

This launcher exposes **no HTTP API or guest-control API**. There are no
JavaScript, Python or curl endpoints for keyboard input, screenshots, audio or
guest boot. Operate those features through the native application's UI.
Do not interpret a successful launch as proof that QEMU or a guest has booted.

## Development and checks

Run the dependency-free contract tests with Node.js 20 or later:

```sh
node --test tests/launcher.test.cjs
```

Tests cover platform restrictions, default menus, native launch parameters,
missing-app installation configuration, launcher-only updates and publication
exclusions. GitHub Actions runs these contract tests on Apple silicon and Intel macOS, Windows, Linux x64
and Linux ARM64. They do not install the app or boot a guest. For a real
integration check, run through Pinokio and inspect `logs/api/start.js/latest`
and the native app window. Never commit runtime logs or `ENVIRONMENT`.

The Mac launch has been exercised through Pinokio 8.2.0 on an Apple silicon Mac.
Both Mac DMGs have prior native CI packaging tests and local signed-launcher
tests on Apple silicon, with the x64 build run through Rosetta. The underlying
Windows and Linux packages have prior native installation and
launcher smoke tests recorded in the public release. End-to-end **Pinokio GUI
installation and launch on Intel Mac/Windows/Linux remain unverified**; contract tests
are not a substitute for those checks.

## Public distribution

Open the [PC110 Atlas listing on Pinokio](https://pinokio.co/apps/github-com-ahmadexp-pc110-atlas-pinokio)
and choose **Install**, or use Download from URL as described above.

This is a community launcher, not a claim of Pinokio verification or featured
placement. Anyone can install it using the GitHub URL. The repository uses the
`pinokio` topic for community discovery. Directory indexing and featured
placement are controlled by Pinokio.

Report launcher problems in [GitHub Issues](https://github.com/ahmadexp/pc110-atlas-pinokio/issues),
including your macOS and Pinokio versions but no private media.

## License and trademarks

Launcher scripts and documentation are MIT licensed; see [LICENSE](LICENSE).
Application artwork, the application and third-party materials retain their
existing terms. The launcher license does not grant rights to firmware or
operating-system images. IBM, PC110, PersonaWare and other names remain their
owners' property. This independent preservation project is not affiliated with
or endorsed by IBM, Apple or Pinokio.
