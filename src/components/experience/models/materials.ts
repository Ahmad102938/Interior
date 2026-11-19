import { Color, DoubleSide, MeshPhysicalMaterial, MeshStandardMaterial } from "three";
import { brand } from "@/config/theme";
import { corrugated, pvModules, speckle, stone, wood } from "./textures";

/**
 * One shared PBR material library for all four environments — the main lever
 * for making them read as a single visualisation. Real-world material identity
 * first (galvanised steel stays steel); brand colour only as restrained accents.
 * Created lazily on the client, reused everywhere, disposed with the canvas.
 */
function build() {
  const concreteMap = speckle("concrete", "#9c9a94", ["#6f6d68", "#b8b5ae", "#85827b"], 0.5, 512, 2);
  const groundMap = speckle("ground", "#3a3c3d", ["#2a2c2d", "#4a4b4b", "#55524b"], 0.6, 512, 1);
  groundMap.repeat.set(60, 12);
  const gravelMap = speckle("gravel", "#7b7870", ["#5b5953", "#9d998f", "#6d6a62"], 1.2, 256, 1);
  gravelMap.repeat.set(6, 6);
  const earthMap = speckle("earth", "#6d6250", ["#5a5040", "#857a63", "#4f5a3a"], 0.9, 512, 1);
  earthMap.repeat.set(10, 10);

  return {
    galvanised: new MeshStandardMaterial({ color: "#a9afb4", metalness: 0.85, roughness: 0.42, envMapIntensity: 1.1 }),
    steelDark: new MeshStandardMaterial({ color: "#5d6368", metalness: 0.8, roughness: 0.5 }),
    structuralSteel: new MeshStandardMaterial({ color: "#6b7176", metalness: 0.7, roughness: 0.55 }),
    primedSteel: new MeshStandardMaterial({ color: "#8a5a45", metalness: 0.45, roughness: 0.65 }),
    aluminium: new MeshStandardMaterial({ color: "#c4c9ce", metalness: 0.9, roughness: 0.3 }),
    antennaPanel: new MeshStandardMaterial({ color: "#dfe2e4", metalness: 0.05, roughness: 0.55 }),
    dish: new MeshStandardMaterial({ color: "#e6e8e9", metalness: 0.1, roughness: 0.4, side: DoubleSide }),
    cabinet: new MeshStandardMaterial({ color: "#c9ccce", metalness: 0.35, roughness: 0.5 }),
    concrete: new MeshStandardMaterial({ map: concreteMap, color: "#d4d0c8", roughness: 0.92, metalness: 0 }),
    concreteDark: new MeshStandardMaterial({ map: concreteMap, color: "#8d8a84", roughness: 0.95 }),
    ground: new MeshStandardMaterial({ map: groundMap, color: "#8a8b8c", roughness: 1, metalness: 0 }),
    gravel: new MeshStandardMaterial({ map: gravelMap, roughness: 1 }),
    earth: new MeshStandardMaterial({ map: earthMap, roughness: 1 }),
    pv: new MeshPhysicalMaterial({
      map: pvModules(),
      metalness: 0.2,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.3,
    }),
    roofSheet: new MeshStandardMaterial({ map: corrugated("#a3a9ae", 1), metalness: 0.6, roughness: 0.45, side: DoubleSide }),
    wallSheet: new MeshStandardMaterial({ map: corrugated("#c4c6c4", 1), metalness: 0.4, roughness: 0.5, side: DoubleSide }),
    rebar: new MeshStandardMaterial({ color: "#6e4a36", metalness: 0.6, roughness: 0.7 }),
    craneYellow: new MeshStandardMaterial({ color: "#b8953e", metalness: 0.5, roughness: 0.5 }),
    glass: new MeshPhysicalMaterial({
      color: "#dfe9ec",
      metalness: 0,
      roughness: 0.05,
      transparent: true,
      opacity: 0.16,
      envMapIntensity: 1.5,
      side: DoubleSide,
      depthWrite: false,
    }),
    mullion: new MeshStandardMaterial({ color: "#2b2d30", metalness: 0.7, roughness: 0.35 }),
    oak: new MeshStandardMaterial({ map: wood(1), roughness: 0.55, metalness: 0 }),
    oakFloor: new MeshStandardMaterial({ map: wood(6), roughness: 0.45, metalness: 0 }),
    stone: new MeshStandardMaterial({ map: stone(1), roughness: 0.35, metalness: 0 }),
    stoneFloor: new MeshStandardMaterial({ map: stone(5), roughness: 0.3, metalness: 0 }),
    plaster: new MeshStandardMaterial({ color: "#efe7da", roughness: 0.9 }),
    ceiling: new MeshStandardMaterial({ color: "#e9e4dc", roughness: 0.95 }),
    upholstery: new MeshStandardMaterial({ color: "#8f8a83", roughness: 0.95 }),
    upholsteryDark: new MeshStandardMaterial({ color: "#3b3a3a", roughness: 0.9 }),
    maroonAccent: new MeshStandardMaterial({ color: brand.maroon, roughness: 0.8 }),
    maroonFabric: new MeshStandardMaterial({ color: "#6b2a37", roughness: 0.95 }),
    blackMetal: new MeshStandardMaterial({ color: "#1d1e20", metalness: 0.6, roughness: 0.4 }),
    foliage: new MeshStandardMaterial({ color: "#2f4a2f", roughness: 0.9, flatShading: true }),
    planter: new MeshStandardMaterial({ color: "#3c3b39", roughness: 0.7 }),
    lightPanel: new MeshStandardMaterial({ color: "#fff6e8", emissive: new Color("#ffe9c9"), emissiveIntensity: 2.2 }),
    goldTrim: new MeshStandardMaterial({ color: brand.gold, metalness: 0.9, roughness: 0.3 }),
    goldGuide: new MeshStandardMaterial({ color: brand.gold, emissive: new Color(brand.gold), emissiveIntensity: 0.9, roughness: 0.4 }),
    aviationLight: new MeshStandardMaterial({ color: "#7a1010", emissive: new Color("#ff2a1a"), emissiveIntensity: 3 }),
    rubber: new MeshStandardMaterial({ color: "#1c1c1c", roughness: 0.9 }),
    fence: new MeshStandardMaterial({ color: "#9aa0a4", metalness: 0.7, roughness: 0.5, transparent: true, opacity: 0.35, side: DoubleSide, depthWrite: false }),
  };
}

export type MaterialLibrary = ReturnType<typeof build>;

let library: MaterialLibrary | null = null;

export function getMaterials(): MaterialLibrary {
  if (!library) library = build();
  return library;
}

export function disposeMaterials() {
  if (!library) return;
  for (const m of Object.values(library)) {
    const map = (m as MeshStandardMaterial).map;
    map?.dispose();
    m.dispose();
  }
  library = null;
}
