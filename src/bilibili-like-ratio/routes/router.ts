export const URL_PATTERN = {
  home: new URLPattern("/", "https://www.bilibili.com"),
  section: new URLPattern("/c/*", "https://www.bilibili.com"), // 分区

  search: new URLPattern("/*", "https://search.bilibili.com"),

  // space: new URLPattern("/*", "https://space.bilibili.com"), // up 主页，列表不带 stat 数据

  bangumi: new URLPattern("/bangumi/*", "https://www.bilibili.com"), // 番剧 电影

  video: new URLPattern("/video/*", "https://www.bilibili.com"),
  list: new URLPattern("/list/*", "https://www.bilibili.com"),

  watchlater: new URLPattern("/watchlater/*", "https://www.bilibili.com"),
};
