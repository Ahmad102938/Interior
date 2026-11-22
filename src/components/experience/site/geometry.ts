import { BoxGeometry } from "three";

/**
 * Box whose UVs are scaled to world size, so a facade texture keeps a true
 * scale on every face (`tile` metres per texture repeat).
 */
export function worldBox(w: number, h: number, d: number, tile = 4.8) {
  const g = new BoxGeometry(w, h, d);
  const uv = g.attributes.uv;
  // Face order: +x, −x, +y, −y, +z, −z — 4 vertices each.
  const dims: [number, number][] = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ];
  for (let f = 0; f < 6; f++) {
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v;
      uv.setXY(i, (uv.getX(i) * dims[f][0]) / tile, (uv.getY(i) * dims[f][1]) / tile);
    }
  }
  uv.needsUpdate = true;
  return g;
}
