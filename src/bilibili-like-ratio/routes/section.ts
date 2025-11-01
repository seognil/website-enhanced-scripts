import { URL_PATTERN } from "./router";
import { updateVideoData } from "../data/store";
import { fetchHook } from "../utils/net-hook";
import { renderCardRatio } from "../logic/cardlist-stat";

// * ================================================================================

if (URL_PATTERN.home.test(location.href) || URL_PATTERN.section.test(location.href)) {
  // * -------------------------------- data

  // * ----------------  preload

  document.addEventListener("DOMContentLoaded", () => {
    // @ts-ignore
    const list = window.__pinia?.feed?.data.recommend.item;

    updateWrap(list, "home ssr");
  });

  // * ----------------  fetch

  fetchHook.add(async (url, response) => {
    if (typeof url !== "string") return;

    if (url.includes("api.bilibili.com") && url.includes("feed/rcmd?")) {
      const res = await response.json();
      const list = res.data.item || res.data.archives;

      updateWrap(list, "rcmd fetch");
    }
  });

  // * -------------------------------- update

  const updateWrap = (list: any[], from: string) => {
    list
      ?.filter((e) => e.bvid)
      .forEach((e) => {
        updateVideoData({
          from: from,
          key: e.bvid,

          meta: {
            bvid: e.bvid,
            cid: e.cid,
            title: e.title,
            author:
              /** home */
              e.owner?.name ??
              /** section */
              e.auther?.name,
          },

          stat: {
            view: e.stat.view,
            like: e.stat.like,
          },
        });
      });
  };

  // * -------------------------------- bind auto render

  document.addEventListener("DOMContentLoaded", () => {
    domObserverAll(".bili-video-card", (el) => renderCardRatio(el));
  });
}
