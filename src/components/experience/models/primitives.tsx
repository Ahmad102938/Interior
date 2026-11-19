"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  BoxGeometry,
  CylinderGeometry,
  Euler,
  InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";

export type V3 = [number, number, number];
export type Segment = [V3, V3];

const UP = new Vector3(0, 1, 0);

/** Shared unit geometries — scaled per instance. */
export const unitBox = new BoxGeometry(1, 1, 1);
export const unitCylinder = new CylinderGeometry(0.5, 0.5, 1, 24);
export const unitCylinderLow = new CylinderGeometry(0.5, 0.5, 1, 6);

/**
 * Structural members between point pairs, rendered as one InstancedMesh.
 * `thickness` is the cross-section size (box width or cylinder diameter).
 */
export function Members({
  segments,
  thickness,
  material,
  round = false,
  castShadow = true,
}: {
  segments: Segment[];
  thickness: number;
  material: Material;
  round?: boolean;
  castShadow?: boolean;
}) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const a = new Vector3();
    const b = new Vector3();
    const dir = new Vector3();
    const q = new Quaternion();
    const s = new Vector3();
    const m = new Matrix4();
    segments.forEach(([p0, p1], i) => {
      a.set(...p0);
      b.set(...p1);
      dir.subVectors(b, a);
      const len = dir.length();
      q.setFromUnitVectors(UP, dir.normalize());
      s.set(thickness, len, thickness);
      m.compose(a.add(b).multiplyScalar(0.5), q, s);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [segments, thickness]);
  return (
    <instancedMesh
      ref={ref}
      args={[round ? unitCylinderLow : unitBox, material, segments.length]}
      castShadow={castShadow}
      receiveShadow
    />
  );
}

export type BoxItem = { p: V3; s: V3; r?: V3 };

/** Many boxes (or any unit geometry) with individual transforms in one draw call. */
export function BoxInstances({
  items,
  material,
  geometry = unitBox,
  castShadow = true,
  receiveShadow = true,
}: {
  items: BoxItem[];
  material: Material;
  geometry?: BufferGeometry;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new Matrix4();
    const q = new Quaternion();
    const e = new Euler();
    const pos = new Vector3();
    const scl = new Vector3();
    items.forEach((it, i) => {
      e.set(...(it.r ?? [0, 0, 0]));
      q.setFromEuler(e);
      m.compose(pos.set(...it.p), q, scl.set(...it.s));
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);
  return <instancedMesh ref={ref} args={[geometry, material, items.length]} castShadow={castShadow} receiveShadow={receiveShadow} />;
}

/**
 * Square lattice section (telecom tower, crane mast). Tapers linearly from
 * baseHalf to topHalf. Returns leg, horizontal and diagonal member lists.
 */
export function latticeSegments({
  height,
  baseHalf,
  topHalf,
  panels,
  origin = [0, 0, 0],
}: {
  height: number;
  baseHalf: number;
  topHalf: number;
  panels: number;
  origin?: V3;
}) {
  const legs: Segment[] = [];
  const horizontals: Segment[] = [];
  const diagonals: Segment[] = [];
  const corner = (level: number, c: number): V3 => {
    const t = level / panels;
    const h = baseHalf + (topHalf - baseHalf) * t;
    const sx = c === 0 || c === 3 ? -1 : 1;
    const sz = c < 2 ? -1 : 1;
    return [origin[0] + sx * h, origin[1] + t * height, origin[2] + sz * h];
  };
  for (let l = 0; l < panels; l++) {
    for (let c = 0; c < 4; c++) {
      const n = (c + 1) % 4;
      legs.push([corner(l, c), corner(l + 1, c)]);
      horizontals.push([corner(l + 1, c), corner(l + 1, n)]);
      // X-bracing on every face.
      diagonals.push([corner(l, c), corner(l + 1, n)]);
      diagonals.push([corner(l, n), corner(l + 1, c)]);
    }
  }
  for (let c = 0; c < 4; c++) horizontals.push([corner(0, c), corner(0, (c + 1) % 4)]);
  return { legs, horizontals, diagonals, corner };
}

/** Builds a value once per mount (procedural geometry descriptions). */
export function useConst<T>(fn: () => T) {
  return useState(fn)[0];
}
