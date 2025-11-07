# 冲浪扩展 （Bilibili & YouTube）

## 说明

一部分简短的需求，我直接用 JS + JSDoc 来写，用 [User JavaScript and CSS](https://chromewebstore.google.com/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld) 这个插件直接来加载

另一部分功能逐渐变得复杂的代码，已经重构成 模块化 + TS 然后 build 的方式，更加好开发。目前逐渐重构中

后续有空再考虑支持到 Tampermonkey

主要以 Bilibili 和 YouTube 扩展功能为主

## 代码

### Bilibili 点赞率

- [bilibili-stat-ratio](./src/bilibili-like-ratio/)

🚧 TODO，发布到 Tampermonkey

### 全局唯一播放

Bilibili、YouTube，当前播放时自动暂停其他标签

🚧 TODO，目前 BroadcastChannel 仅支持同源站点，后续考虑用 Tampermonkey 实现跨源

### 播放列表进度条

Bilibili、YouTube，显示进度，点击复制总时间

- [bilibili-playlist](./src/bilibili-playlist-pb.js)

![YouTube Playlist Timer](./images/youtube-playlist-timer.png)

🚧 TODO，代码重构

### Bilibili 增强

- [bilibili-enhanced](./src/bilibili-enhanced.js)

override B 站的快捷键（使大部分视频控制键位集中在左手区，以方便单手操作）

- 快捷键
  - `Cmd + Shift + s` 复制当前截图画面
  - `Cmd + Shift + d` 复制视频字幕到剪贴板（以便 ai 解读）
  - `Cmd + Shift + c` 复制干净的视频链接（去除多余小尾巴）
  - `c` 切换字幕显示
  - `b` 软切换弹幕（通过控制图层的 `opacity`，而不是 `display`，这样能保留滚动位置而不是清空）
  - `t` 网页全屏
  - `f` 屏幕全屏
  - `Backspace` 从头播放
  - `Space` 播放暂停
  - `r` 切换单集循环
  - `q`, `ArrowLeft` 倒退 1 秒
  - `e`, `ArrowRight` 前进 1 秒
  - `z` 变速 -0.125
  - `x` 变速 +0.125
  - `v` 切换变速
- 自动化
  - 自动连播行为：如果是列表视频则自动连播，否则单集视频播完暂停

### YouTube 增强

[code](./src/youtube-enhanced.js)

- 新增的快捷键
  - `Cmd + Shift + s` 复制当前截图画面
  - `Cmd + Shift + d` 复制字幕
  - `[`, `]` 切换列表上下集
  - `Backspace` 从头播放
  - `q` 倒退 1 秒
  - `e` 前进 1 秒
  - `z` 变速 -0.125
  - `x` 变速 +0.125
  - `v` 切换变速
- 自动化
  - 初始自动设置高清晰度

### utils

封装了一些工具函数

- [net-hook](./src/utils/net-hook.js)：监听 fetch 和 xhr response
- [dom-observer](./src/utils/dom-observer.js)：封装 querySelector + MutationObserver
- [media-control](./src/utils/media-control.js)：常用音视频元素控制功能
- [progress-bar for playlist](./src/utils/progress-bar.js)：播放列表进度条组件
