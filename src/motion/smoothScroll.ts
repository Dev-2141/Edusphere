import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { reducedMotion } from './tokens';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

// Lenis drives the scroll, GSAP's ticker drives Lenis, ScrollTrigger listens.
export function initSmoothScroll() {
  if (reducedMotion()) return null;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

export function onScroll(cb: (y: number, dir: 1 | -1) => void) {
  let last = window.scrollY;
  const handler = () => {
    const y = window.scrollY;
    cb(y, y >= last ? 1 : -1);
    last = y;
  };
  if (lenis) lenis.on('scroll', handler);
  else addEventListener('scroll', handler, { passive: true });
  handler();
}
