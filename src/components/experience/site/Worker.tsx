"use client";

import { CapsuleGeometry, CylinderGeometry, SphereGeometry, type Material } from "three";

const torso = new CapsuleGeometry(0.17, 0.42, 4, 10);
const limb = new CapsuleGeometry(0.075, 0.62, 4, 8);
const head = new SphereGeometry(0.13, 16, 12);
const helmet = new SphereGeometry(0.155, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
const brim = new CylinderGeometry(0.19, 0.19, 0.02, 20);

export type WorkerMaterials = { vest: Material; trousers: Material; skin: Material; helmet: Material };

/** Stylised, faceless site worker — scale and life, not a character. */
export function Worker({ M }: { M: WorkerMaterials }) {
  return (
    <group>
      <mesh geometry={limb} material={M.trousers} position={[-0.09, 0.4, 0]} castShadow />
      <mesh geometry={limb} material={M.trousers} position={[0.09, 0.4, 0]} castShadow />
      <mesh geometry={torso} material={M.vest} position={[0, 1.08, 0]} castShadow />
      <mesh geometry={limb} material={M.vest} position={[-0.24, 1.05, 0.04]} rotation={[0.2, 0, 0.12]} scale={[0.85, 0.75, 0.85]} castShadow />
      <mesh geometry={limb} material={M.vest} position={[0.24, 1.05, 0.04]} rotation={[0.2, 0, -0.12]} scale={[0.85, 0.75, 0.85]} castShadow />
      <mesh geometry={head} material={M.skin} position={[0, 1.55, 0]} castShadow />
      <mesh geometry={helmet} material={M.helmet} position={[0, 1.58, 0]} castShadow />
      <mesh geometry={brim} material={M.helmet} position={[0, 1.58, 0.02]} />
    </group>
  );
}

/** Dark interior silhouette (people seen through glazing). */
const body = new CapsuleGeometry(0.2, 1.05, 4, 8);
const skull = new SphereGeometry(0.13, 10, 8);
export function Silhouette({ material }: { material: Material }) {
  return (
    <group>
      <mesh geometry={body} material={material} position={[0, 0.75, 0]} />
      <mesh geometry={skull} material={material} position={[0, 1.6, 0]} />
    </group>
  );
}
