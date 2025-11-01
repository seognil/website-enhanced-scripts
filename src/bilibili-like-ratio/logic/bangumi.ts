import { URL_PATTERN } from "../routes/url-pattern";
import { xhrHook } from "../utils/net-hook";
import { updateVideoData } from "../data/store";
import { renderVideoStat } from "../render/video-stat";

// * ================================================================================

/**
 * movie1
 * https://www.bilibili.com/bangumi/play/ss31885
 * https://www.bilibili.com/bangumi/play/ep309558
 *
 * movie2 single
 * https://www.bilibili.com/bangumi/play/ss25508
 * https://www.bilibili.com/bangumi/play/ep247216
 *
 * movie3 multi
 * https://www.bilibili.com/bangumi/play/ss48548
 * https://www.bilibili.com/bangumi/play/ep1114824
 *
 * anime
 * https://www.bilibili.com/bangumi/play/ss41410
 * https://www.bilibili.com/bangumi/play/ep691614
 */
if (URL_PATTERN.bangumi.test(location.href)) {
  // * -------------------------------- data

  let ss_data: any = {};

  document.addEventListener("DOMContentLoaded", () => {
    // * ---------------- preload ss

    // @ts-ignore
    ss_data = window.__NEXT_DATA__?.props.pageProps.dehydratedState.queries[0].state.data;

    if (ss_data) {
      updateVideoData({
        from: "bangumi ss ssr",
        key: `ss${ss_data.season_id}`,
        meta: {
          season_id: ss_data.season_id,
          season_title: ss_data.season_title,
        },
        stat: {
          view: ss_data.stat.views,
          like: ss_data.stat.likes,
          coin: ss_data.stat.coins,
          fav: ss_data.stat.favorites,
          share: ss_data.stat.share,
        },
      });
    }

    // * ---------------- preload ep meta

    // @ts-ignore
    const ep_data = playurlSSRData?.data.result?.supplement.ogv_episode_info;

    updateVideoData({
      from: "bangumi ep meta ssr",
      key: `ep${ep_data.episode_id}`,
      meta: {
        season_id: ss_data.season_id,
        season_title: ss_data.season_title,
        episode_id: ep_data.episode_id,
        full_title: ep_data.long_title ?? `${ss_data.season_title} | ${ep_data.index_title}`,
      },
      // @ts-ignore
      stat: {},
    });
  });

  // * ---------------- fetch ep meta

  xhrHook.add((xhr) => {
    if (xhr.responseURL.includes("api.bilibili.com") && xhr.responseURL.includes("/playview?")) {
      const res = JSON.parse(xhr.responseText);
      const ep_data = res.data.supplement.ogv_episode_info;
      updateVideoData({
        from: "bangumi ep meta xhr",
        key: `ep${ep_data.episode_id}`,
        meta: {
          season_id: ss_data.season_id,
          season_title: ss_data.season_title,
          episode_id: ep_data.episode_id,
          full_title: ep_data.long_title ?? `${ss_data.season_title} | ${ep_data.index_title}`,
        },
        // @ts-ignore
        stat: {},
      });
    }
  });

  // * ---------------- fetch ep stat

  xhrHook.add(async (xhr) => {
    const url = xhr.responseURL;
    if (url.includes("api.bilibili.com") && url.includes("info?ep_id=")) {
      const res = JSON.parse(xhr.responseText);
      const data = res.data;
      updateVideoData({
        from: "bangumi ep stat xhr",
        key: `ep${data.episode_id}`,
        // @ts-ignore
        meta: {},
        stat: {
          view: data.stat.view,
          like: data.stat.like,
          coin: data.stat.coin,
          fav: data.stat.favorite,
          share: data.stat.share,
        },
      });

      renderWrap(`ep${data.episode_id}`);
    }
  });

  // * -------------------------------- bind navigation

  // @ts-ignore
  window.navigation.addEventListener("navigate", (e) => {
    const epid = e.destination.url.match(/\bep[^/?]+\b/)?.[0];
    renderWrap(epid);
  });

  // * -------------------------------- renderer

  const renderWrap = (epid: string) => {
    const statEls = Array.from(document.querySelector(".toolbar-left").children).slice(0, 4) as HTMLElement[];
    renderVideoStat(statEls, epid);
  };
}
