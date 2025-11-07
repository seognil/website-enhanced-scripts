import { URL_PATTERN } from "./router";
import { fetchHook, xhrHook } from "../utils/net-hook";
import { updateVideoData } from "../data/store";
import { renderVideoStat } from "../logic/video-stat";
import { getBvid } from "../logic/get-bvid";

// * ================================================================================

/**
 * up list, multi bvid
 * https://www.bilibili.com/video/BV1W7411F79S
 *
 * up list, single bvid + multi p
 * https://www.bilibili.com/video/BV1hp4y1k7SV?p=2
 *
 * favourite list
 * https://www.bilibili.com/list/ml62693834?oid=973735712&bvid=BV1944y1B7MJ&p=3
 *
 * watchlater list
 * https://www.bilibili.com/list/watchlater?oid=113431445249673&bvid=BV1M4DTYKEfs
 *
 * playall list
 * https://www.bilibili.com/list/35868098
 */
if (URL_PATTERN.video.test(location.href) || URL_PATTERN.list.test(location.href)) {
  // * -------------------------------- data

  // * ---------------- preload

  document.addEventListener("DOMContentLoaded", () => {
    // @ts-ignore
    const data = window.__INITIAL_STATE__?.videoData;

    updateWrap(data, "video ssr");

    renderWrap();
  });

  // * ---------------- fetch

  fetchHook.add(async (url, response) => {
    if (typeof url !== "string") return;

    if (url.includes("api.bilibili.com") && url.includes("/view?bvid=")) {
      const res = await response.json();
      const data = res.data;

      updateWrap(data, "video fetch");

      renderWrap();
    }
  });

  // * -------------------------------- bind navigation

  /** navifation with cache data (without fetch) */
  // @ts-ignore
  window.navigation.addEventListener("navigate", (e) => {
    renderWrap(e.destination.url);
  });

  // * -------------------------------- update

  // * ---------------- data

  const updateWrap = (e: any, from: string) => {
    if (!e) return;

    updateVideoData({
      from: from,
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
  };

  // * ---------------- renderer

  const renderWrap = (url = location.href) => {
    const statEls = Array.from(document.querySelector(".video-toolbar-left-main").children).map((el) => el.querySelector(".video-toolbar-left-item")) as HTMLElement[];

    renderVideoStat(statEls, getBvid(url));
  };
}
