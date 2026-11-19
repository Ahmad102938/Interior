/**
 * ADIDEV brand tokens. CSS custom properties in globals.css mirror these values;
 * this file exists for places CSS cannot reach (Three.js materials, lights, fog).
 */
export const brand = {
  maroon: "#581E2A",
  emerald: "#1D593F",
  navy: "#172C48",
  white: "#FFFFFF",
  gold: "#AF8958",
  ivory: "#F7EFE2",
  paleGold: "#D8C398",
  lightMaroon: "#8D4C58",
  charcoal: "#292B2D",
  slate: "#626D78",
  border: "#E5DED3",
} as const;

export type VerticalKey = "telecom" | "solar" | "civil" | "interiors";

/** Fixed vertical colour mapping — used everywhere a vertical is represented. */
export const verticalTheme: Record<
  VerticalKey,
  { primary: string; secondary: string; accent: string; onPrimary: string }
> = {
  telecom: { primary: brand.navy, secondary: brand.white, accent: brand.gold, onPrimary: brand.white },
  solar: { primary: brand.emerald, secondary: brand.ivory, accent: brand.paleGold, onPrimary: brand.white },
  civil: { primary: brand.charcoal, secondary: brand.white, accent: brand.gold, onPrimary: brand.white },
  interiors: { primary: brand.maroon, secondary: brand.ivory, accent: brand.paleGold, onPrimary: brand.white },
};
