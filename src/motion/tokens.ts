import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

// motion.md §26–27 — one clock for the whole site.
export const dur = {
  fast: 0.2,
  micro: 0.3,
  standard: 0.55,
  editorial: 0.85,
  cinematic: 1.3,
} as const;

// Custom curves: "snap" = quick anticipation then long settle,
// "pop" = playful overshoot used for plop-ins and tilted cards.
CustomEase.create('snap', 'M0,0 C0.14,0 0.18,0.72 0.32,0.9 0.46,1.02 0.62,1 1,1');
CustomEase.create('pop', 'M0,0 C0.2,0 0.25,1.25 0.5,1.08 0.7,0.96 0.82,1 1,1');

export const ease = {
  standard: 'power3.out',
  expressive: 'expo.out',
  snap: 'snap',
  pop: 'pop',
  elastic: 'elastic.out(1, 0.72)',
  soft: 'sine.inOut',
  inOut: 'power3.inOut',
} as const;

export const stagger = { cards: 0.07, lines: 0.09, words: 0.04, chars: 0.018 } as const;

export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 992px)',
  mobile: '(max-width: 991px)',
  fine: '(hover: hover) and (pointer: fine)',
} as const;

export const reducedMotion = () => matchMedia(MQ.reduced).matches;
export const finePointer = () => matchMedia(MQ.fine).matches;

export type Cleanup = () => void;
