// ==UserScript==
// @name         Edge Android 双指轻点全屏
// @name:en      Edge Android Two-Finger Tap Fullscreen
// @namespace    https://github.com/Xiaoxi1185/edge-android-two-finger-fullscreen
// @version      3.1
// @description  双指同时轻点页面 = 进入/退出全屏，无悬浮按钮，不改变屏幕方向
// @description:en Toggle fullscreen in Edge for Android by tapping with two fingers. No floating button, no forced rotation.
// @author       Xiaoxi1185
// @license      MIT
// @homepageURL  https://github.com/Xiaoxi1185/edge-android-two-finger-fullscreen
// @supportURL   https://github.com/Xiaoxi1185/edge-android-two-finger-fullscreen/issues
// @downloadURL  https://raw.githubusercontent.com/Xiaoxi1185/edge-android-two-finger-fullscreen/main/edge-android-two-finger-fullscreen.user.js
// @updateURL    https://raw.githubusercontent.com/Xiaoxi1185/edge-android-two-finger-fullscreen/main/edge-android-two-finger-fullscreen.user.js
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==
(function () {
  'use strict';
  var doc = document;
  function mark(k, v) { try { if (doc.documentElement) doc.documentElement.dataset[k] = v; } catch (e) {} }

  if (doc.documentElement && doc.documentElement.dataset.fsInstalled === '1') return;
  mark('fsInstalled', '1');

  var taps = 0, startT = 0, maxTouch = 0, moved = false, sx1 = 0, sy1 = 0, sx2 = 0, sy2 = 0;

  function isFs() { return !!(doc.fullscreenElement || doc.webkitFullscreenElement); }

  function enter() {
    var el = doc.documentElement || doc.body;
    if (!el || !el.requestFullscreen) { mark('fsResult', 'err:no-api'); return; }
    mark('fsResult', 'requested');
    try {
      el.requestFullscreen({ navigationUI: 'hide' }).then(function () {
        mark('fsResult', 'ok');
      }).catch(function (e) {
        mark('fsResult', 'err:' + ((e && e.message) || String(e)));
      });
    } catch (e) {
      mark('fsResult', 'err:' + ((e && e.message) || String(e)));
    }
  }

  function quit() {
    if (isFs()) { try { doc.exitFullscreen().catch(function () {}); } catch (e) {} }
    mark('fsResult', 'exit');
  }

  function toggle() {
    taps++; mark('fsTaps', String(taps));
    if (isFs()) quit(); else enter();
  }

  window.addEventListener('touchstart', function (e) {
    if (e.touches.length === 2 && startT === 0) {
      startT = Date.now(); maxTouch = 2; moved = false;
      sx1 = e.touches[0].clientX; sy1 = e.touches[0].clientY;
      sx2 = e.touches[1].clientX; sy2 = e.touches[1].clientY;
    } else if (e.touches.length > 2) {
      maxTouch = e.touches.length;
    }
  }, { capture: true, passive: true });

  window.addEventListener('touchmove', function (e) {
    if (startT && e.touches.length === 2) {
      var d1 = Math.abs(e.touches[0].clientX - sx1) + Math.abs(e.touches[0].clientY - sy1);
      var d2 = Math.abs(e.touches[1].clientX - sx2) + Math.abs(e.touches[1].clientY - sy2);
      if (d1 > 18 || d2 > 18) moved = true;
    }
  }, { capture: true, passive: true });

  window.addEventListener('touchend', function (e) {
    if (!startT) return;
    if (e.touches.length !== 0) return;
    var dt = Date.now() - startT;
    var ok = (maxTouch === 2 && !moved && dt < 350);
    startT = 0; maxTouch = 0; moved = false;
    if (ok) toggle();
  }, { capture: true, passive: true });

  window.addEventListener('touchcancel', function () {
    startT = 0; maxTouch = 0; moved = false;
  }, { capture: true, passive: true });
})();
