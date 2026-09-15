# PC110 Atlas for Pinokio

Open the native **PC110 Atlas** Mac app from Pinokio. Explore the IBM PC110's
history, hardware and schematics, and emulate it using your own lawfully obtained
firmware and system media. This public repository contains only the launcher,
documentation and icon, not the application source, binary or personal media.

## Requirements

- An **Apple silicon Mac (M1 or later) with macOS 14 or later**.
- **Pinokio 8.2 or later**, with native desktop-app launch support.
- PC110 Atlas, listed as [PC 110 on the App Store](https://apps.apple.com/us/app/pc-110/id6801404183).
  If missing, the launcher offers the App Store installation flow. Availability,
  account sign-in and store confirmations are handled by Apple.
- Network access to download the launcher and, if needed, the app.

Windows, Linux and Intel Macs are **not supported by this launcher**. It does not
install a separate QEMU distribution or compile the application from source.

## Install and launch

1. Open Pinokio, choose **Download from URL**, and paste:
   `https://github.com/ahmadexp/pc110-atlas-pinokio`
2. Open **PC110 Atlas** and select **Open or install PC110 Atlas**.
3. If the app is missing, follow the App Store link and complete installation.
   Pinokio checks for it for up to ten minutes and opens it when detected. If
   installation takes longer, finish installing and run the launcher again.
4. PC110 Atlas opens in its native window, or comes forward if already running.
   Import your own media and choose Run inside the app to start an emulator.

Installation is user-confirmed through the App Store, not an unattended purchase
or a downloaded third-party binary. No hard-coded app path is needed: Pinokio
locates it using its macOS bundle identifier.

The launcher process ends after macOS accepts the open request. That is normal,
even while the native app remains open. Pinokio's script status is not the
emulator's running status. Quit PC110 Atlas through its own application menu.
There is no web UI, readiness URL, remote-control API, or automatic shutdown.

## Updates and removal

- **Update launcher only** pulls this repository using `git pull --ff-only`.
  Conflicting local edits are preserved and may cause Git to stop.
- Update PC110 Atlas itself through the **App Store**. The launcher does not
  update Pinokio, replace the app, alter its signature or disable Gatekeeper.
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
bundle ID `org.opensourcepc110.atlas` and the official App Store URL.

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
exclusions. They do not purchase/install the app or boot a guest. For a real
integration check, run through Pinokio and inspect `logs/api/start.js/latest`
and the native app window. Never commit runtime logs or `ENVIRONMENT`.

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
