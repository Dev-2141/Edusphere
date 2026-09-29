import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dur, ease, MQ, type Cleanup } from './tokens';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven section choreography.
 *  - [data-blobs]          : layered background shapes, each drifting at its own
 *                            parallax rate + slow breathing (motion.md §8, §14).
 *  - [data-genre-list]     : giant genre words; the one nearest the viewport centre
 *                            is full size/opacity, others recede (scroll emphasis).
 *  - [data-panel-grow]     : rounded panel scales from inset to full as it enters.
 *  - [data-footer-reveal]  : footer content slides up from under the previous section.
 *  - [data-parallax="n"]   : generic y-parallax, n = speed factor.
 */
export function initScenes(scope: HTMLElement): Cleanup {
  const mm = gsap.matchMedia();

  mm.add(MQ.motion, () => {
    scope.querySelectorAll<HTMLElement>('[data-blobs]').forEach((wrap) => {
      wrap.querySelectorAll<SVGElement>('[data-blob]').forEach((blob, i) => {
        const speed = Number(blob.dataset.blob || 0.2);
        gsap.to(blob, {
          yPercent: -30 * speed * 3,
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to(blob, {
          scale: 1.06 + i * 0.02,
          rotate: i % 2 ? 3 : -3,
          transformOrigin: '50% 50%',
          duration: 5 + i * 1.7,
          ease: ease.soft,
          yoyo: true,
          repeat: -1,
        });
      });
    });

    scope.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const f = Number(el.dataset.parallax || 0.2);
      gsap.fromTo(el, { yPercent: 30 * f }, {
        yPercent: -30 * f,
        ease: 'none',
        scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    scope.querySelectorAll<HTMLElement>('[data-panel-grow]').forEach((panel) => {
      gsap.fromTo(panel, { scale: 0.92, borderRadius: '120px' }, {
        scale: 1,
        borderRadius: getComputedStyle(panel).borderRadius,
        ease: 'none',
        scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top 35%', scrub: 0.4 },
      });
    });

    scope.querySelectorAll<HTMLElement>('[data-footer-reveal]').forEach((foot) => {
      const inner = foot.querySelector('[data-footer-inner]');
      const mark = foot.querySelector('[data-footer-mark]');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: foot, start: 'clamp(top bottom)', end: 'clamp(bottom bottom)', scrub: 0.3 },
      });
      if (inner) tl.fromTo(inner, { yPercent: -35 }, { yPercent: 0, ease: 'none' }, 0);
      if (mark) tl.fromTo(mark, { yPercent: 60, scale: 0.9 }, { yPercent: 0, scale: 1, ease: 'none' }, 0);
    });
  });

  // Genre emphasis runs even for reduced motion (it is a state, not movement),
  // but without scale changes.
  const tickers: (() => void)[] = [];
  scope.querySelectorAll<HTMLElement>('[data-genre-list]').forEach((list) => {
    const words = [...list.querySelectorAll<HTMLElement>('[data-genre]')];
    const reduce = matchMedia(MQ.reduced).matches;
    const setters = words.map((w) => ({
      o: gsap.quickTo(w, 'opacity', { duration: 0.35, ease: 'power2.out' }),
      s: gsap.quickTo(w, 'scale', { duration: 0.5, ease: 'power3.out' }),
    }));
    // Runs on the ticker only while the list is on screen (motion.md §28).
    const tick = () => {
      const mid = innerHeight / 2;
      words.forEach((w, i) => {
        const r = w.getBoundingClientRect();
        const k = 1 - Math.min(1, Math.abs(r.top + r.height / 2 - mid) / (innerHeight * 0.42));
        setters[i].o(0.28 + k * 0.72);
        if (!reduce) setters[i].s(0.86 + k * 0.14);
      });
    };
    let on = false;
    const toggle = (active: boolean) => {
      if (active === on) return;
      on = active;
      if (active) gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    };
    const io = new IntersectionObserver(([e]) => toggle(e.isIntersecting));
    io.observe(list);
    tickers.push(() => (io.disconnect(), toggle(false)));
  });

  return () => {
    tickers.forEach((t) => t());
    mm.revert();
  };
}

/** Nav: pill bar compacts after 50px, hides on scroll-down, returns on scroll-up. */
export function initNav(nav: HTMLElement, onScroll: (cb: (y: number, dir: 1 | -1) => void) => void) {
  let hidden = false;
  const menuOpen = () => document.documentElement.dataset.menu === 'open';
  onScroll((y, dir) => {
    nav.dataset.scrolled = String(y > 50);
    const hide = y > innerHeight * 0.6 && dir === 1 && !menuOpen();
    if (hide !== hidden) {
      hidden = hide;
      gsap.to(nav, { yPercent: hide ? -130 : 0, duration: dur.standard, ease: hide ? 'power2.in' : ease.pop });
    }
  });
}

/** Floating sign-up CTA: rides along, then tucks away when the footer arrives. */
export function initFloatingCta(scope: HTMLElement): Cleanup {
  const cta = document.querySelector<HTMLElement>('[data-floating-cta]');
  const foot = scope.querySelector<HTMLElement>('[data-footer-reveal]');
  if (!cta || !foot) return () => {};
  const st = ScrollTrigger.create({
    trigger: scope,
    start: () => `top+=${innerHeight * 0.7} top`,
    end: 'max',
    onUpdate: (self) => {
      const footTop = foot.getBoundingClientRect().top;
      const show = self.progress > 0 && footTop > innerHeight * 0.85;
      if (cta.dataset.show !== String(show)) {
        cta.dataset.show = String(show);
        gsap.to(cta, { y: show ? 0 : 160, rotate: show ? -3 : 8, duration: dur.editorial, ease: show ? ease.pop : 'power3.in' });
      }
    },
  });
  gsap.set(cta, { y: 160 });
  return () => st.kill();
}
