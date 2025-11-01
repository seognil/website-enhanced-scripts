// * -------------------------------- store value

export interface VideoData {
  // * ---------------- internal

  /** 数据来源（调试用） */
  from: string;

  /** 数据获取时间 */
  updateAt?: string | Date;

  /** Map 索引 key */
  key: string;

  // * ---------------- bili data

  meta: BangumiMeta | VideoMeta;

  stat: Stat;
}

// * -------------------------------- bangumi

interface BangumiMeta {
  /** 番剧 电影 id */
  season_id: number;

  /** 总标题 */
  season_title: string;

  /** 分集 id */
  episode_id?: number;

  /** 整合标题 */
  full_title?: string;
}

// * -------------------------------- normal video

interface VideoMeta {
  /** 稿件 id */
  bvid: string;

  /** 稿件 id （老 avid） */
  aid?: string;

  /** 唯一视频 id */
  cid?: number;

  /** 视频标题 */
  title: string;

  /** 作者名字 */
  author: string;
}

// * -------------------------------- stat

interface Stat {
  /** 浏览量 */
  view: number;
  /** 点赞 */
  like: number;
  /** 投币 */
  coin?: number;
  /** 收藏 */
  fav?: number;
  /** 转发 */
  share?: number;
}
