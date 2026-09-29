import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { dur, ease, MQ, stagger, type Cleanup } from './tokens';

gsap.registerPlugin(ScrollTrigger, InertiaPlugin);

/**
 * [data-plop]        — stickers / icons scale in from 0 with a spin, landing with overshoot.
 * [data-scatter]     — a group of cards that fly up from below the fold and land
 *                      "tossed on a table": random tilt, offset, elastic settle.
 * [data-momentum]    — on pointer pass-through, the element is flicked in the direction
 *                      and speed of the cursor, then springs home (InertiaPlugin).
 * [data-float]       — ambient bob with its own phase/amplitude (motion.md §14).
 */
export function initPlayful(scope: HTMLElement): Cleanup {
  const mm = gsap.matchMedia();
  const offs: Cleanup[] = [];

  mm.add(MQ.motion, () => {
    scope.querySelectorAll<HTMLElement>('[data-plop]').forEach((el, i) => {
      gsap.from(el, {
        scale: 0,
        rotate: gsap.utils.random(-30, -12),
        y: '-2.5em',
        duration: 0.9,
        delay: (i % 5) * 0.06,
        ease: ease.elastic,
        scrollTrigger: { trigger: el, start: 'top 92%' },
      });
    });

    scope.querySelectorAll<HTMLElement>('[data-scatter]').forEach((group) => {
      const cards = group.querySelectorAll<HTMLElement>('[data-scatter-item]');
      cards.forEach((c, i) => {
        const tilt = Number(c.dataset.tilt ?? (i % 2 ? 4 : -5));
        gsap.set(c, { rotate: tilt, '--tilt': `${tilt}deg` });
      });
      gsap.from(cards, {
        yPercent: 120,
        rotate: () => gsap.utils.random(-22, 22),
        duration: 1.1,
        ease: ease.elastic,
        stagger: stagger.cards * 1.3,
        scrollTrigger: { trigger: group, start: 'top 80%' },
      });
    });

    scope.querySelectorAll<HTMLElement>('[data-float]').forEach((el, i) => {
      const amp = Number(el.dataset.float || 12);
      gsap.to(el, {
        y: `+=${amp}`,
        rotate: `+=${i % 2 ? 3 : -3}`,
        duration: 2.4 + (i % 4) * 0.7,
        ease: ease.soft,
        yoyo: true,
        repeat: -1,
        delay: i * 0.35,
      });
    });
  });

  mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
    scope.querySelectorAll<HTMLElement>('[data-momentum]').forEach((root) => {
      let px = 0, py = 0, vx = 0, vy = 0, lastT = performance.now();
      const track = (e: PointerEvent) => {
        const now = performance.now();
        const dt = Math.max(16, now - lastT);
        vx = ((e.clientX - px) / dt) * 1000;
        vy = ((e.clientY - py) / dt) * 1000;
        px = e.clientX; py = e.clientY; lastT = now;
      };
      root.addEventListener('pointermove', track);
      const items = root.matches('[data-momentum-item]') ? [root] : [...root.querySelectorAll<HTMLElement>('[data-momentum-item]')];
      const handlers = items.map((item) => {
        const enter = (e: PointerEvent) => {
          const r = item.getBoundingClientRect();
          const ox = e.clientX - (r.left + r.width / 2);
          const oy = e.clientY - (r.top + r.height / 2);
          const torque = gsap.utils.clamp(-40, 40, (ox * vy - oy * vx) * 0.00018);
          gsap.to(item, {
            inertia: {
              x: { velocity: vx * 0.3, end: 0 },
              y: { velocity: vy * 0.3, end: 0 },
              rotation: { velocity: torque * 10, end: Number(item.dataset.tilt ?? 0) },
              duration: { min: 0.6, max: 1.4 },
            },
          });
        };
        item.addEventListener('pointerenter', enter);
        return () => item.removeEventListener('pointerenter', enter);
      });
      offs.push(() => (root.removeEventListener('pointermove', track), handlers.forEach((h) => h())));
    });
  });

  return () => {
    offs.forEach((o) => o());
    mm.revert();
  };
}

/** Big magnetic CTAs (motion.md §17): drift ≤ 6px toward the cursor. */
export function initMagnetic(scope: HTMLElement): Cleanup {
  if (!matchMedia(MQ.fine).matches || matchMedia(MQ.reduced).matches) return () => {};
  const offs = [...scope.querySelectorAll<HTMLElement>('[data-magnetic]')].map((el) => {
    const x = gsap.quickTo(el, 'x', { duration: dur.standard, ease: ease.standard });
    const y = gsap.quickTo(el, 'y', { duration: dur.standard, ease: ease.standard });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x(gsap.utils.clamp(-6, 6, (e.clientX - r.left - r.width / 2) * 0.15));
      y(gsap.utils.clamp(-6, 6, (e.clientY - r.top - r.height / 2) * 0.25));
    };
    const leave = () => (x(0), y(0));
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => (el.removeEventListener('pointermove', move), el.removeEventListener('pointerleave', leave));
  });
  return () => offs.forEach((o) => o());
}
