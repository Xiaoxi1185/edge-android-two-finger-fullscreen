# Edge Android Two-Finger Tap Fullscreen

Toggle fullscreen in **Microsoft Edge for Android** by tapping the page with **two fingers** — no floating button, no forced rotation.

> Made with **DeepSeek-V4.1-Flash-1017**.

> 中文说明：[README.zh-CN.md](README.zh-CN.md)

## Why

Edge for Android has no F11-style "full page" fullscreen toggle:

- `Element.requestFullscreen()` must be triggered by a **real user gesture inside the page**. Calling it without one throws `TypeError: Permissions check failed` — extension popups, userscript menus and background scripts cannot pass that check.
- The Tampermonkey popup on Android **does not render** commands registered via `GM_registerMenuCommand` (it only shows "Edit / Report bug / Exclude site / Delete").

Handing the "real tap" to a page gesture is therefore the cheapest approach that does not occupy the screen.

## Install

- **Greasy Fork (recommended)**: <https://greasyfork.org/scripts/607074-edge-android-two-finger-tap-fullscreen>
- **Direct from GitHub (raw)**:
  <https://raw.githubusercontent.com/Xiaoxi1185/edge-android-two-finger-fullscreen/main/edge-android-two-finger-fullscreen.user.js>

Steps:

1. Install a userscript manager in Edge for Android (e.g. [Tampermonkey](https://microsoftedge.microsoft.com/addons)).
2. Open either link above and click install.
3. Or use "Add new script…" in Tampermonkey and paste the whole script.

## Usage

| Action | Result |
|---|---|
| **Tap the page with two fingers** | Enter fullscreen: address bar, bottom toolbar, status bar and navigation bar all hidden |
| **Tap again with two fingers** | Leave fullscreen |

- It is a *tap*: both fingers down and up quickly — not a press-and-hold, not a pinch.
- Thresholds: both fingers move < 18px and the touch lasts < 350ms; anything else is treated as zoom / long-press and ignored.
- To read in landscape, just rotate the phone — the system follows and fullscreen is kept.
- You can also leave fullscreen with the back button or Edge's own exit hint.

## Implementation notes

- Only listens to `touchstart / touchmove / touchend / touchcancel` with `passive: true`. It creates no DOM nodes and injects no styles — **nothing is left on the page**.
- State is recorded in `data-fs-*` attributes on `document.documentElement` (`fsInstalled` / `fsTaps` / `fsResult`) for troubleshooting, which does not affect the page.
- The fullscreen call passes `{ navigationUI: 'hide' }` to avoid leftover navigation UI in some browsers.
- `screen.orientation.lock()` is never used; screen orientation is left to the system.

## Compatibility

Verified on a real device (not just static review):

- Xiaomi 25098PN5AC / Android 17 (SDK 37)
- Microsoft Edge `160.0.4420.0`
- Tampermonkey `5.5.1` (MV3)

The same APIs work in Chrome for Android, Edge stable and Firefox for Android — any browser that implements `Element.requestFullscreen()`.

## Limitations

- A few sites intercept two-finger events for their own zoom/gestures; try another spot or scroll first.
- Fullscreen is browser-level: a site's own fixed navigation bar is part of the page and will not be hidden.

## Changelog

- `3.1` — Removed the automatic landscape lock; screen orientation is fully left to the system.
- `3.0` — Switched to the two-finger tap gesture; removed the floating button.
- `1.0` — Initial version (menu-command prototype).

Changes after `3.1` are documentation and metadata only (multi-language descriptions); the script logic is unchanged.

## Credits

Inspired by [Edge Android 全屏浏览 (可拖动按钮)](https://greasyfork.org/scripts/538073) and its [fixed version](https://greasyfork.org/scripts/589200) on Greasy Fork (both MIT), which call `requestFullscreen` from a floating button. This script moves the trigger to a page gesture so no persistent button is needed.

## License

[MIT](LICENSE)
