# Edge Android 双指轻点全屏

在 **Android 版 Edge（含 Edge Canary）** 上，用 **双指同时轻点页面** 来切换全屏——不需要悬浮按钮，也不改动屏幕方向。

> Toggle fullscreen in Edge for Android by tapping the page with two fingers. No floating button, no forced rotation.

## 为什么需要它

Android 版 Edge 没有类似桌面端 F11 的"整页全屏"开关。网页里的悬浮按钮方案虽然能全屏，但按钮长期挡在内容上；而"从扩展面板点一下"技术上不可行：

- `Element.requestFullscreen()` 必须由**页面内的真实用户手势**触发。无手势调用会直接抛 `TypeError: Permissions check failed`，扩展面板、油猴菜单、后台脚本代点都过不了这道检查。
- Android 版篡改猴的弹出面板**不渲染** `GM_registerMenuCommand` 注册的命令（实测只有"编辑 / 报告 Bug / 排除本站 / 删除"）。

所以把"真实点击"交给页面手势，是最省事、又不占屏幕的做法。

## 安装

- **Greasy Fork（推荐）**：<https://greasyfork.org/zh-CN/scripts/607067>
- **直接装 GitHub 版本（raw）**：
  <https://raw.githubusercontent.com/Xiaoxi1185/edge-android-two-finger-fullscreen/main/edge-android-two-finger-fullscreen.user.js>

步骤：

1. 在 Edge for Android 中安装用户脚本管理器（推荐 [Tampermonkey 篡改猴](https://microsoftedge.microsoft.com/addons)）。
2. 打开上面任一链接点击安装。
3. 或在篡改猴里「添加新脚本…」，把脚本内容整段粘贴进去并保存。

## 用法

| 操作 | 效果 |
|---|---|
| **两根手指同时轻点**页面 | 进入全屏：地址栏、底部工具栏、状态栏、导航栏全部隐藏 |
| **再双指轻点** | 退出全屏 |

- 是"轻点"：两指快速点一下就抬起，别按住不动，也别捏合缩放。
- 判定阈值：两指位移均 < 18px、按下时长 < 350ms；超过则视为缩放/长按，不触发。
- 全屏后想把屏幕转过来，直接转手机即可，系统会自动跟随，全屏状态保持。
- 退出全屏也可以按返回键，或用 Edge 自带的退出提示。

## 实现要点

- 只监听 `touchstart / touchmove / touchend / touchcancel`（`passive: true`），不注册任何 DOM 元素、不注入样式，**页面上不留下任何痕迹**。
- 通过 `document.documentElement` 的 `data-fs-*` 属性记录状态（`fsInstalled` / `fsTaps` / `fsResult`），便于排查，不影响页面。
- 全屏调用带 `{ navigationUI: 'hide' }`，避免部分浏览器残留导航 UI。
- 不使用 `screen.orientation.lock()`，不干预屏幕方向。

## 兼容性

在以下环境实测通过（真机验证，非仅静态检查）：

- Xiaomi 25098PN5AC / Android 17 (SDK 37) / KernelSU root
- Microsoft Edge Canary `160.0.4420.0`
- 篡改猴 `5.5.1`（MV3）

同一套 API 在 Chrome for Android、Edge 稳定版、Firefox for Android 上同样可用；只要浏览器支持 `Element.requestFullscreen()` 即可。

## 局限

- 极少数自身拦截双指事件（做自定义缩放/手势）的站点可能触发不了，换个位置或先滚动一下再点。
- 全屏是浏览器层面的全屏，页面若自带固定定位的导航栏，那是网页自己的元素，不会被隐藏。

## 更新日志

- `3.2` — 仅元数据调整：Greasy Fork 侧附加信息改用 Markdown 解析（脚本逻辑未变）。
- `3.1` — 移除自动横屏锁定，屏幕方向完全交给系统。
- `3.0` — 改为双指轻点手势，去掉悬浮按钮。
- `1.0` — 初版（菜单命令原型）。

## 致谢

思路参考了 Greasy Fork 上的 [Edge Android 全屏浏览 (可拖动按钮)](https://greasyfork.org/zh-CN/scripts/538073) 及其 [修复版](https://greasyfork.org/zh-CN/scripts/589200)（均为 MIT）：它们用悬浮按钮调用 `requestFullscreen`，本脚本改用页面手势以移除常驻按钮。

## 许可证

[MIT](LICENSE)
