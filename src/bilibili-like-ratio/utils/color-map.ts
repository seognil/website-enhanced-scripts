/** [0-100] */
const colormap = [
  [0, "hsl(0, 0%, 80%)"], // gray
  [4, "hsl(120, 100%, 80%)"], // green
  [6, "hsl(200, 100%, 70%)"], // blue
  [8, "hsl(300, 100%, 70%)"], // purple
  [10, "hsl(30, 100%, 60%)"], // orange
] as const satisfies [number, string][];

/** [0-1] */
export const ratioColor = (ratio: number) =>
  colormap.find((e, i, a) => {
    return e[0] <= ratio * 100 && ratio * 100 < (a[i + 1]?.[0] ?? Infinity);
  })?.[1];
