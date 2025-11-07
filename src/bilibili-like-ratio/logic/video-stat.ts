import { videoInfoStore } from "../data/store";
import { ratioColor } from "./color-map";

// * ================================================================================

export const renderVideoStat = (statEls: HTMLElement[], key: string) => {
  const s = videoInfoStore.get(key);
  if (!s) return;

  statEls

    // * -------------------------------- dom structure

    .map((itemEl) => {
      const spanEl = itemEl.querySelector(".stat-ratio") as HTMLElement;

      if (spanEl) {
        return spanEl;
      } else {
        itemEl.style.width = "auto";
        const shadowEl = itemEl.attachShadow({ mode: "open" });
        shadowEl.appendChild(document.createElement("slot"));

        const spanEl = document.createElement("span");
        spanEl.classList.add("stat-ratio");

        spanEl.style.filter = "brightness(80%)";
        spanEl.style.whiteSpace = "pre-wrap";

        shadowEl.appendChild(spanEl);

        return spanEl;
      }
    })

    // * -------------------------------- update render

    .forEach((spanEl, i) => {
      const ratio = [s.stat.like, s.stat.coin, s.stat.fav, s.stat.share][i] / s.stat.view;
      spanEl.style.color = ratioColor(ratio);
      spanEl.textContent = ` =${(ratio * 100).toFixed(1)}%`;
    });
};
