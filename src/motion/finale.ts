import gsap from 'gsap';
import { dur, ease, MQ, type Cleanup } from './tokens';

/**
 * Finishing layer of motion, each piece scoped to specific areas:
 *  - image reveals (motion.md §12) — a different style per context:
 *      course thumbnails wipe up, catalogue covers wipe in sideways,
 *      the course player opens with an organic circle.
 *  - [data-depth-blur]  (§23) — supporting copy resolves from a soft blur.
 *  - [data-count]       — numbers count up when they scroll into view.
 *  - [data-particles]   (§24) — a few slow drifting dots behind a section.
 *  - [data-spotlight]   (§16) — a soft light follows the pointer inside the card.
 *  - layered card depth (§18) — cover, title and tags shift by different amounts.
 */
export function initFinale(scope: HTMLElement): Cleanup {
  const mm = gsap.matchMedia();
  const offs: Cleanup[] = [];

  mm.add(MQ.motion, () => {
    // §12 vertical reveal: thumbnail rises behind a mask while the image settles.
    scope.querySelectorAll<HTMLElement>('.course-card__thumb').forEach((el) => {
      const st = { trigger: el, start: 'top 92%' };
      gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 18px)' }, { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: dur.editorial, ease: ease.expressive, scrollTrigger: st });
      gsap.from(el.querySelector('img'), { scale: 1.3, yPercent: 12, duration: dur.cinematic, ease: ease.expressive, scrollTrigger: st });
    });

    // §12 horizontal reveal: catalogue covers wipe in from the spine side.
    scope.querySelectorAll<HTMLElement>('.catalog__grid .book-card__cover').forEach((el, i) => {
      gsap.fromTo(el, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: dur.editorial, delay: (i % 4) * 0.08, ease: ease.inOut, scrollTrigger: { trigger: el, start: 'top 92%' } });
    });

    // §12 organic reveal: the lesson player opens like an iris.
    scope.querySelectorAll<HTMLElement>('[data-player-frame]').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: dur.cinematic, delay: 0.5, ease: ease.expressive, clearProps: 'clipPath' });
    });

    // §23 depth blur: far → near.
    scope.querySelectorAll<HTMLElement>('[data-depth-blur]').forEach((el) => {
      gsap.from(el, { filter: 'blur(6px)', opacity: 0.3, y: 24, duration: dur.editorial, ease: ease.standard, clearProps: 'filter', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    // Count-up numbers.
    scope.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const to = Number(el.dataset.count);
      const n = { v: 0 };
      gsap.to(n, { v: to, duration: dur.cinematic, ease: ease.standard, scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => (el.textContent = String(Math.round(n.v))) });
    });

    // §24 particles: few, slow, behind the content.
    scope.querySelectorAll<HTMLElement>('[data-particles]').forEach((host) => {
      const count = Number(host.dataset.particles || 14);
      const layer = document.createElement('div');
      layer.className = 'particles';
      layer.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        const size = gsap.utils.random(4, 12);
        Object.assign(p.style, { left: `${gsap.utils.random(2, 98)}%`, top: `${gsap.utils.random(4, 96)}%`, width: `${size}px`, height: `${size}px` });
        if (i % 3 === 0) p.style.filter = 'blur(2px)'; // a few "far" dots (§23)
        layer.append(p);
        gsap.to(p, { x: gsap.utils.random(-40, 40), y: gsap.utils.random(-60, 20), opacity: gsap.utils.random(0.25, 0.8), duration: gsap.utils.random(5, 9), ease: ease.soft, yoyo: true, repeat: -1, delay: -gsap.utils.random(0, 6) });
      }
      host.prepend(layer);
      offs.push(() => layer.remove());
    });
  });

  mm.add(`${MQ.motion} and ${MQ.fine}`, () => {
    // §16 spotlight: CSS reads --mx / --my (see .spotlight styles).
    scope.querySelectorAll<HTMLElement>('[data-spotlight], .course-card').forEach((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      el.addEventListener('pointermove', move);
      offs.push(() => el.removeEventListener('pointermove', move));
    });

    // §18 layered depth: each layer follows the pointer by a different amount.
    const layered: [string, [string, number][]][] = [
      ['.course-card', [['.course-card__thumb', 6], ['.course-card__by', 3], ['.t-h3', 2], ['.book-card__tags', 8]]],
      ['.book-card', [['.book-card__cover', 4], ['.book-card__title', 2], ['.book-card__tags', 6]]],
      ['.support-card', [['.support-card__price', 5], ['.support-card__sticker', 10], ['.support-card__perks', 2]]],
    ];
    layered.forEach(([card, layers]) => {
      scope.querySelectorAll<HTMLElement>(card).forEach((el) => {
        const movers = layers.flatMap(([sel, px]) =>
          [...el.querySelectorAll<HTMLElement>(sel)].map((node) => ({ px, x: gsap.quickTo(node, 'x', { duration: dur.standard, ease: ease.standard }), y: gsap.quickTo(node, 'y', { duration: dur.standard, ease: ease.standard }) })),
        );
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
          const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
          movers.forEach((m) => (m.x(nx * m.px), m.y(ny * m.px * 0.6)));
        };
        const leave = () => movers.forEach((m) => (m.x(0), m.y(0)));
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        offs.push(() => (el.removeEventListener('pointermove', move), el.removeEventListener('pointerleave', leave)));
      });
    });
  });

  return () => {
    offs.forEach((o) => o());
    mm.revert();
  };
}
