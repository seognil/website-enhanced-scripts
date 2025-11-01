import { nowdate } from "../utils/date";
import { dbPutItem } from "../utils/indexeddb";
import { VideoData } from "./type";

export const videoInfoStore = new Map<string, VideoData>();

export const updateVideoData = (data: VideoData) => {
  // * ---------------- merge data

  const prev = videoInfoStore.get(data.key) as VideoData | undefined;

  const next = {
    updateAt: nowdate(),
    ...data,
    meta: { ...(prev?.meta ?? {}), ...data.meta },
    stat: { ...(prev?.stat ?? {}), ...data.stat },
  };

  // * ---------------- update

  videoInfoStore.set(data.key, next);

  // ! ---------------- debug

  console.info("[bili video stat]", next);

  // * analysis
  dbPutItem("bilibili-videos", "stat", data.key, next);
};
