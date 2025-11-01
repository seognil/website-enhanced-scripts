import { URL_PATTERN } from "../routes/url-pattern";
import { updateVideoData } from "../data/store";
import { fetchHook } from "../utils/net-hook";
import { renderCardRatio } from "../render/cardlist-stat";

// * ================================================================================

if (URL_PATTERN.search.test(location.href)) {
  // * -------------------------------- data

  // * ---------------- preload

  document.addEventListener("DOMContentLoaded", () => {
    // @ts-ignore
    const list = window.__pinia?.searchResponse?.searchAllResponse.result[11].data;

    updateWrap(list, "search ssr");
  });

  // * ---------------- preload

  document.addEventListener("DOMContentLoaded", () => {
    // @ts-ignore
    const list = window.__pinia?.searchTypeResponse?.searchTypeResponse.result;

    updateWrap(list, "search ssr with query");
  });

  // * ---------------- fetch

  fetchHook.add(async (url, response) => {
    if (typeof url !== "string") return;

    if (url.includes("api.bilibili.com") && url.includes("search/all/v2")) {
      const res = await response.json();
      const list = res.data.result?.[11]?.data;

      updateWrap(list, "search fetch all");
    }
  });

  // * ---------------- fetch

  fetchHook.add(async (url, response) => {
    if (typeof url !== "string") return;

    if (url.includes("api.bilibili.com") && url.includes("search/type")) {
      const res = await response.json();
      const list = res.data.result;

      updateWrap(list, "search fetch with query");
    }
  });

  // * -------------------------------- update

  const updateWrap = (list: any[], from: string) => {
    // * ---------------- data

    list
      ?.filter((e) => e.type === "video")
      .forEach((e) => {
        updateVideoData({
          from: from,
          key: e.bvid,

          meta: {
            bvid: e.bvid,
            aid: e.aid,
            title: e.title.replace(/<\/?em.*?>/g, ""),
            author: e.author,
          },
          stat: {
            view: e.play,
            like: e.like,
          },
        });
      });

    // * ---------------- manual render

    /**
     * dom 可能复用，但是新数据可能之后才获取到，所以 fetch 之后再 force render
     * 列表页也不存在下拉刷新，所以干脆手动控制全部渲染动作，不用 observer 实现
     */
    document.querySelectorAll(".bili-video-card").forEach((el) => renderCardRatio(el as HTMLElement, true));
  };
}
