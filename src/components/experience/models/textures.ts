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

/** Concrete block masonry, stretcher bond, with mortar joints. */
export function blocks(repeat = 1) {
  return make(`blocks:${repeat}`, 512, (ctx, s) => {
    const r = rng(91);
    ctx.fillStyle = "#b9b4aa"; // mortar
    ctx.fillRect(0, 0, s, s);
    const rows = 8;
    const bh = s / rows;
    const bw = s / 2;
    for (let i = 0; i < rows; i++) {
      const off = i % 2 ? bw / 2 : 0;
      for (let j = -1; j < 3; j++) {
        const x = j * bw + off;
        const t = 140 + Math.floor(r() * 26);
        ctx.fillStyle = `rgb(${t},${t - 4},${t - 12})`;
        ctx.fillRect(x + 3, i * bh + 3, bw - 6, bh - 6);
        for (let k = 0; k < 60; k++) {
          ctx.globalAlpha = 0.15;
          ctx.fillStyle = r() > 0.5 ? "#6f6a62" : "#d1cbc0";
          ctx.fillRect(x + 3 + r() * (bw - 6), i * bh + 3 + r() * (bh - 6), 2, 2);
        }
        ctx.globalAlpha = 1;
      }
    }
  }, repeat);
}

/**
 * Board-formed architectural concrete: 2.4 m × 1.2 m panels, tie holes,
 * soft tonal variation. One texture tile = 4.8 m × 4.8 m of facade.
 */
export function concretePanels() {
  return make("concrete-panels", 1024, (ctx, s) => {
    const r = rng(1234);
    ctx.fillStyle = "#c9c4bb";
    ctx.fillRect(0, 0, s, s);
    const cols = 2;
    const rows = 4;
    const pw = s / cols;
    const ph = s / rows;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const t = 188 + Math.floor(r() * 22) - 11;
        ctx.fillStyle = `rgb(${t},${t - 4},${t - 10})`;
        ctx.fillRect(i * pw, j * ph, pw, ph);
        // Mottling
        for (let k = 0; k < 220; k++) {
          ctx.globalAlpha = 0.05 + r() * 0.06;
          ctx.fillStyle = r() > 0.5 ? "#8e897f" : "#e2ded6";
          const rad = 2 + r() * 14;
          ctx.beginPath();
          ctx.arc(i * pw + r() * pw, j * ph + r() * ph, rad, 0, Math.PI * 2);
          ctx.fill();
        }
        // Vertical streaks (weathering)
        for (let k = 0; k < 6; k++) {
          ctx.globalAlpha = 0.05;
          ctx.fillStyle = "#7d786f";
          ctx.fillRect(i * pw + r() * pw, j * ph, 1 + r() * 3, ph * (0.4 + r() * 0.6));
        }
        ctx.globalAlpha = 1;
        // Tie holes: 3 × 2 per panel
        for (let a = 0; a < 3; a++) {
          for (let b = 0; b < 2; b++) {
            const x = i * pw + pw * (0.18 + a * 0.32);
            const y = j * ph + ph * (0.28 + b * 0.44);
            ctx.fillStyle = "#77736b";
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#a9a49a";
            ctx.beginPath();
            ctx.arc(x - 1, y - 1, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        // Panel joints
        ctx.fillStyle = "rgba(90,86,80,0.3)";
        ctx.fillRect(i * pw, j * ph, pw, 2);
        ctx.fillRect(i * pw, j * ph, 2, ph);
      }
    }
  });
}

/** Large-format stone paving, 1.2 m modules, dark joints. One tile = 4.8 m. */
export function paving() {
  return make("paving", 512, (ctx, s) => {
    const r = rng(77);
    const n = 4;
    const c = s / n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const t = 96 + Math.floor(r() * 22);
        ctx.fillStyle = `rgb(${t},${t + 2},${t + 6})`;
        ctx.fillRect(i * c, j * c, c, c);
        for (let k = 0; k < 120; k++) {
          ctx.globalAlpha = 0.08;
          ctx.fillStyle = r() > 0.5 ? "#2e3134" : "#8b8f94";
          ctx.fillRect(i * c + r() * c, j * c + r() * c, 2, 2);
        }
        ctx.globalAlpha = 1;
      }
    }
    ctx.strokeStyle = "#1e2124";
    ctx.lineWidth = 3;
    for (let i = 0; i <= n; i++) {
      ctx.beginPath();
      ctx.moveTo(i * c, 0);
      ctx.lineTo(i * c, s);
      ctx.moveTo(0, i * c);
      ctx.lineTo(s, i * c);
      ctx.stroke();
    }
  });
}

/** Distant office windows at night for the city backdrop. */
export function cityWindows() {
  return make("city-windows", 256, (ctx, s) => {
    const r = rng(5);
    ctx.fillStyle = "#0d1522";
    ctx.fillRect(0, 0, s, s);
    const cols = 16;
    const rows = 32;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (r() < 0.38) {
          ctx.fillStyle = r() < 0.7 ? "#f2c98a" : "#c9dcf2";
          ctx.globalAlpha = 0.5 + r() * 0.5;
          ctx.fillRect(i * (s / cols) + 3, j * (s / rows) + 2, s / cols - 6, s / rows - 4);
        }
      }
    }
    ctx.globalAlpha = 1;
  });
}

/** Commercial carpet tiles: 0.5 m tiles, quarter-turned, flecked. One texture = 2 m. */
export function carpet() {
  return make("carpet", 512, (ctx, s) => {
    const r = rng(303);
    const n = 4;
    const c = s / n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const t = 92 + Math.floor(r() * 12);
        ctx.fillStyle = `rgb(${t},${t + 1},${t + 4})`;
        ctx.fillRect(i * c, j * c, c, c);
        // Directional pile stripes, quarter-turned per tile
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = "#8a8f96";
        for (let k = 0; k < 18; k++) {
          ctx.beginPath();
          const o = (k / 18) * c;
          if ((i + j) % 2) {
            ctx.moveTo(i * c + o, j * c);
            ctx.lineTo(i * c + o, j * c + c);
          } else {
            ctx.moveTo(i * c, j * c + o);
            ctx.lineTo(i * c + c, j * c + o);
          }
          ctx.stroke();
        }
        for (let k = 0; k < 260; k++) {
          ctx.globalAlpha = 0.18;
          ctx.fillStyle = r() > 0.5 ? "#2c2f33" : "#9aa0a8";
          ctx.fillRect(i * c + r() * c, j * c + r() * c, 1.5, 1.5);
        }
        ctx.globalAlpha = 1;
      }
    }
  });
}
