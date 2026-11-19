import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from "three";

/**
 * Small procedural textures generated once on the client. They add the surface
 * variation that keeps flat PBR materials from looking "CG". Replace with
 * photographic KTX2 textures in public/textures/ when available.
 */
const cache = new Map<string, Texture>();

function make(key: string, size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void, repeat = 1, srgb = true) {
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, size);
  const tex = new CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = 8;
  if (srgb) tex.colorSpace = SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

// Deterministic PRNG so textures are identical between sessions.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/** Speckled aggregate — concrete, gravel, earth. */
export function speckle(key: string, base: string, tones: string[], density = 0.35, size = 512, repeat = 1) {
  return make(`speckle:${key}`, size, (ctx, s) => {
    const r = rng(key.length * 7919 + 13);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    const count = Math.floor(s * s * density * 0.02);
    for (let i = 0; i < count; i++) {
      ctx.globalAlpha = 0.08 + r() * 0.25;
      ctx.fillStyle = tones[Math.floor(r() * tones.length)];
      const d = 1 + r() * 3;
      ctx.fillRect(r() * s, r() * s, d, d);
    }
    // Soft large-scale blotches for tonal variation.
    for (let i = 0; i < 18; i++) {
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = tones[i % tones.length];
      ctx.beginPath();
      ctx.arc(r() * s, r() * s, s * (0.1 + r() * 0.25), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, repeat);
}

/** Photovoltaic module: 6×12 cells, silver busbars, thin frame gap. */
export function pvModules(cols = 2, rows = 6) {
  return make(`pv:${cols}x${rows}`, 1024, (ctx, s) => {
    ctx.fillStyle = "#c9ced4";
    ctx.fillRect(0, 0, s, s);
    const mw = s / cols;
    const mh = s / rows;
    for (let m = 0; m < cols; m++) {
      for (let n = 0; n < rows; n++) {
        const x0 = m * mw + 3;
        const y0 = n * mh + 3;
        const w = mw - 6;
        const h = mh - 6;
        ctx.fillStyle = "#0b1422";
        ctx.fillRect(x0, y0, w, h);
        const cx = 6;
        const cy = 10;
        for (let i = 0; i < cx; i++) {
          for (let j = 0; j < cy; j++) {
            const px = x0 + (i * w) / cx + 1;
            const py = y0 + (j * h) / cy + 1;
            const g = ctx.createLinearGradient(px, py, px + w / cx, py + h / cy);
            g.addColorStop(0, "#14233a");
            g.addColorStop(1, "#0c1726");
            ctx.fillStyle = g;
            ctx.fillRect(px, py, w / cx - 2, h / cy - 2);
          }
        }
        ctx.strokeStyle = "rgba(190,200,215,0.35)";
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(x0 + (i * w) / 4, y0);
          ctx.lineTo(x0 + (i * w) / 4, y0 + h);
          ctx.stroke();
        }
      }
    }
  });
}

/** Warm oak planks. */
export function wood(repeat = 1) {
  return make(`wood:${repeat}`, 512, (ctx, s) => {
    const r = rng(42);
    const plank = s / 8;
    for (let i = 0; i < 8; i++) {
      const tone = 150 + Math.floor(r() * 30);
      ctx.fillStyle = `rgb(${tone + 30},${tone - 5},${tone - 55})`;
      ctx.fillRect(0, i * plank, s, plank);
      for (let g = 0; g < 40; g++) {
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = "#5a3a20";
        ctx.beginPath();
        const y = i * plank + r() * plank;
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(s * 0.3, y + r() * 4 - 2, s * 0.6, y + r() * 4 - 2, s, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#3a2615";
      ctx.fillRect(0, i * plank, s, 1);
      ctx.fillRect(r() * s, i * plank, 1, plank);
      ctx.globalAlpha = 1;
    }
  }, repeat);
}

/** Trapezoidal metal roof / wall sheeting. */
export function corrugated(base = "#9aa1a8", repeat = 1) {
  return make(`corr:${base}:${repeat}`, 256, (ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 16; i++) {
      const x = (i * s) / 16;
      const g = ctx.createLinearGradient(x, 0, x + s / 16, 0);
      g.addColorStop(0, "rgba(255,255,255,0.18)");
      g.addColorStop(0.3, "rgba(0,0,0,0.0)");
      g.addColorStop(0.8, "rgba(0,0,0,0.22)");
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, s / 16, s);
    }
  }, repeat);
}

/** Large-format stone tile with subtle veining. */
export function stone(repeat = 1) {
  return make(`stone:${repeat}`, 512, (ctx, s) => {
    const r = rng(7);
    ctx.fillStyle = "#d9d2c6";
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 26; i++) {
      ctx.globalAlpha = 0.06 + r() * 0.06;
      ctx.strokeStyle = "#8f877a";
      ctx.lineWidth = 0.5 + r() * 1.5;
      ctx.beginPath();
      let x = r() * s;
      let y = r() * s;
      ctx.moveTo(x, y);
      for (let k = 0; k < 6; k++) {
        x += (r() - 0.3) * 90;
        y += (r() - 0.5) * 60;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = "#b5ac9d";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, s / 2, s / 2);
    ctx.strokeRect(s / 2, 0, s / 2, s / 2);
    ctx.strokeRect(0, s / 2, s / 2, s / 2);
    ctx.strokeRect(s / 2, s / 2, s / 2, s / 2);
    ctx.globalAlpha = 1;
  }, repeat);
}
