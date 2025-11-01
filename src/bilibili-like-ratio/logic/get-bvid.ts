export const getBvid = (url: string) => new URL(url).searchParams.get("bvid") ?? url.match(/\bBV[^/?]+\b/)?.[0];
