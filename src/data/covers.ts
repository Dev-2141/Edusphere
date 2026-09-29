import type { Book } from './books';

// Procedural cover painter. Used both for DOM <img> covers (data URL)
// and as Three.js textures, so the 3D books and 2D cards match.

const cache = new Map<string, HTMLCanvasElement>();

function rng(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507)), (h >>> 0) / 4294967296);
}

function motif(ctx: CanvasRenderingContext2D, b: Book, w: number, h: number) {
  const { accent, fg, bg } = b.cover;
  const r = rng(b.id);
  ctx.save();
  switch (b.cover.motif) {
    case 'rings':
      ctx.strokeStyle = accent;
      for (let i = 0; i < 9; i++) {
        ctx.lineWidth = 10 - i * 0.6;
        ctx.beginPath();
        ctx.arc(w * 0.62, h * 0.38, 30 + i * 26, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    case 'stripes':
      ctx.fillStyle = accent;
      for (let i = -4; i < 14; i++) {
        ctx.save();
        ctx.translate(i * 44, 0);
        ctx.rotate(-0.35);
        ctx.fillRect(0, -40, 16, h * 1.6);
        ctx.restore();
      }
      ctx.fillStyle = bg;
      ctx.fillRect(28, h * 0.54, w - 56, h * 0.4);
      break;
    case 'moon':
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(w * 0.56, h * 0.32, w * 0.26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(w * 0.66, h * 0.27, w * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.globalAlpha = 0.35;
      for (let i = 0; i < 6; i++) ctx.fillRect(w * 0.1 + i * 58, h * 0.52, 30, h * 0.12 + r() * 60);
      break;
    case 'grid':
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 2;
      for (let x = 0; x <= w; x += 32) (ctx.beginPath(), ctx.moveTo(x, 0), ctx.lineTo(x, h * 0.62), ctx.stroke());
      for (let y = 0; y <= h * 0.62; y += 32) (ctx.beginPath(), ctx.moveTo(0, y), ctx.lineTo(w, y), ctx.stroke());
      ctx.globalAlpha = 1;
      ctx.fillStyle = accent;
      for (let i = 0; i < 14; i++) ctx.fillRect(Math.floor(r() * 12) * 32 + 2, Math.floor(r() * 11) * 32 + 2, 28, 28);
      break;
    case 'wave':
      ctx.fillStyle = accent;
      for (let k = 0; k < 4; k++) {
        ctx.globalAlpha = 1 - k * 0.2;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.2 + k * 60);
        for (let x = 0; x <= w; x += 8) ctx.lineTo(x, h * 0.2 + k * 60 + Math.sin(x / 38 + k) * 18);
        ctx.lineTo(w, h * 0.2 + k * 60 + 22);
        for (let x = w; x >= 0; x -= 8) ctx.lineTo(x, h * 0.2 + k * 60 + 22 + Math.sin(x / 38 + k) * 18);
        ctx.fill();
      }
      break;
    case 'drops':
      for (let i = 0; i < 26; i++) {
        ctx.fillStyle = i % 3 ? accent : fg;
        ctx.beginPath();
        ctx.arc(r() * w, r() * h * 0.6, 8 + r() * 26, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case 'stars':
      ctx.fillStyle = fg;
      for (let i = 0; i < 40; i++) {
        const x = r() * w, y = r() * h * 0.6, s = 3 + r() * 9;
        ctx.beginPath();
        for (let p = 0; p < 8; p++) {
          const a = (p / 8) * Math.PI * 2, rr = p % 2 ? s * 0.4 : s;
          ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
        }
        ctx.fill();
      }
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(w * 0.3, h * 0.3, w * 0.18, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'arch':
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(w * 0.18, h * 0.62);
      ctx.lineTo(w * 0.18, h * 0.3);
      ctx.arc(w * 0.5, h * 0.3, w * 0.32, Math.PI, 0);
      ctx.lineTo(w * 0.82, h * 0.62);
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.3, w * 0.12, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
  ctx.restore();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxW && line) (lines.push(line), (line = w));
    else line = t;
  }
  lines.push(line);
  return lines;
}

export function paintCover(b: Book, w = 420, h = 630): HTMLCanvasElement {
  const key = `${b.id}:${w}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = b.cover.bg;
  ctx.fillRect(0, 0, w, h);
  motif(ctx, b, w, h);

  // Title block
  ctx.fillStyle = b.cover.fg;
  ctx.textBaseline = 'alphabetic';
  let size = w * 0.15;
  ctx.font = `800 ${size}px "Bricolage Grotesque", "Arial Black", sans-serif`;
  let lines = wrap(ctx, b.title, w - 56);
  if (lines.length > 3) {
    size *= 0.8;
    ctx.font = `800 ${size}px "Bricolage Grotesque", "Arial Black", sans-serif`;
    lines = wrap(ctx, b.title, w - 56);
  }
  const top = h - 70 - lines.length * size * 0.92;
  lines.forEach((l, i) => ctx.fillText(l, 28, top + (i + 1) * size * 0.92));
  // Topic line: shrink to fit the cover width
  const meta = b.author.toUpperCase();
  let metaSize = w * 0.05;
  ctx.font = `600 ${metaSize}px "DM Sans", sans-serif`;
  const fit = (w - 56) / ctx.measureText(meta).width;
  if (fit < 1) {
    metaSize *= fit;
    ctx.font = `600 ${metaSize}px "DM Sans", sans-serif`;
  }
  ctx.globalAlpha = 0.85;
  ctx.fillText(meta, 28, h - 34);

  // Paper grain
  ctx.globalAlpha = 0.07;
  const r = rng(b.id + 'g');
  for (let i = 0; i < 1800; i++) {
    ctx.fillStyle = r() > 0.5 ? '#000' : '#fff';
    ctx.fillRect(r() * w, r() * h, 1.4, 1.4);
  }
  ctx.globalAlpha = 1;

  cache.set(key, c);
  return c;
}

export const coverURL = (b: Book) => paintCover(b).toDataURL('image/jpeg', 0.86);
