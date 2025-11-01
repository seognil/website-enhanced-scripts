import { updateVideoData } from "../data/store";
import { URL_PATTERN } from "./router";
import { fetchHook } from "../utils/net-hook";
import { renderCardRatio } from "../logic/cardlist-stat";

// * ================================================================================

if (URL_PATTERN.watchlater.test(location.href)) {
  // * ------------------------------------------------ data

  fetchHook.add(async (url, response) => {
    if (typeof url !== "string") return;

    if (url.includes("api.bilibili.com") && url.includes("history/toview/web")) {
      const res = await response.json();
      const list = res.data.list;

      list
        ?.filter((e) => e.bvid)
        .forEach((e) => {
          updateVideoData({
            from: "watchlater fetch",
            key: e.bvid,

            meta: {
              bvid: e.bvid,
              aid: e.aid,
              cid: e.cid,
              title: e.title,
              author: e.owner.name,
            },

            stat: {
              view: e.stat.view,
              like: e.stat.like,
              coin: e.stat.coin,
              fav: e.stat.favorite,
              share: e.stat.share,
            },
          });
        });

      // * manual update
      document.querySelectorAll(".bili-video-card").forEach((el) => renderCardRatio(el as HTMLElement));
    }
  });

  // // * ------------------------------------------------ bind auto render

  // document.addEventListener("DOMContentLoaded", () => {
  //   domObserverAll(".bili-video-card", (el) => renderCardRatio(el));
  // });
}
