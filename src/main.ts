import './styles/tokens.css';
import './styles/base.css';
import './styles/chrome.css';
import './styles/sections.css';
import './styles/pages.css';

import barba from '@barba/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { burst, initConfetti } from './motion/confetti';
import { initAccordions, initTabs } from './motion/disclosure';
import { initFinale } from './motion/finale';
import { initMagnetic, initPlayful } from './motion/playful';
import { initFloatingCta, initNav, initScenes } from './motion/scenes';
import { initSliders } from './motion/slider';
import { getLenis, initSmoothScroll, onScroll, scrollToTop } from './motion/smoothScroll';
import { initText } from './motion/text';
import { dur, ease, reducedMotion, type Cleanup } from './motion/tokens';
import { curtainEnter, curtainLeave } from './motion/transitions';
import { footerHTML, markActive, mountChrome, setSupporter } from './ui/chrome';
import { embedURL, renderBookGrid, renderBookSlider, renderChoice, renderCoursePage, renderCourseTracks, renderGenreCovers, renderGenreList, renderSupportPlan, stepArt, watchURL } from './ui/render';

gsap.registerPlugin(ScrollTrigger);

let cleanups: Cleanup[] = [];

/** Page intro (motion.md §31): background → visual → headline → copy → CTA. */
function playIntro(scope: HTMLElement) {
  const r = reducedMotion();
  const tl = gsap.timeline({ delay: 0.05 });
  const heading = scope.querySelector<HTMLElement & { _intro?: gsap.core.Tween }>('[data-intro][data-split]');
  if (heading?._intro) tl.add(heading._intro.play(), 0.2);
  heading?.setAttribute('data-intro-played', '');
  const rest = scope.querySelectorAll('[data-intro-item]');
  if (rest.length && !r) tl.from(rest, { y: 30, opacity: 0, duration: dur.standard, ease: ease.standard, stagger: 0.1 }, 0.45);
  return tl;
}

/** Courses page: animated subject filter. */
function initFilter(scope: HTMLElement): Cleanup {
  const bar = scope.querySelector<HTMLElement>('[data-filter]');
  if (!bar) return () => {};
  const items = [...scope.querySelectorAll<HTMLElement>('[data-filter-item]')];
  const apply = (genre: string) => {
    bar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === genre)));
    const show = items.filter((it) => genre === 'All' || it.dataset.genres!.split('|').some((g) => genre.startsWith(g) || g.startsWith(genre)));
    const hide = items.filter((it) => !show.includes(it));
    const r = reducedMotion();
    gsap.to(hide, { scale: 0.8, opacity: 0, rotate: 6, duration: r ? 0 : 0.25, ease: 'power2.in', onComplete: () => hide.forEach((h) => (h.hidden = true)) });
    show.forEach((s) => (s.hidden = false));
    gsap.fromTo(show, { scale: 0.85, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, rotate: (_i, el: HTMLElement) => Number(el.dataset.tilt ?? 0), duration: r ? 0 : 0.6, delay: r ? 0 : 0.2, stagger: 0.05, ease: ease.pop, onComplete: () => ScrollTrigger.refresh() });
  };
  const click = (e: Event) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-value]');
    if (b) apply(b.dataset.value!);
  };
  bar.addEventListener('click', click);
  const q = new URLSearchParams(location.search).get('genre');
  if (q) requestAnimationFrame(() => apply(q));
  return () => bar.removeEventListener('click', click);
}

/** Course page: swap YouTube lessons in the player and remember what was watched. */
function initPlayer(scope: HTMLElement): Cleanup {
  const root = scope.querySelector<HTMLElement>('[data-player]');
  if (!root) return () => {};
  const key = 'edusphere:watched';
  const read = (): string[] => {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  };
  const watched = new Set(read());
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-lesson]')];
  const frame = root.querySelector<HTMLElement>('[data-player-frame]')!;
  const iframe = root.querySelector<HTMLIFrameElement>('[data-player-iframe]')!;
  const bar = root.querySelector<HTMLElement>('[data-player-bar]')!;

  const badge = root.querySelector<HTMLElement>('[data-player-complete]')!;
  let complete = false;
  const paint = (celebrate = false) => {
    const done = buttons.filter((b) => watched.has(b.dataset.lesson!)).length;
    buttons.forEach((b) => b.toggleAttribute('data-watched', watched.has(b.dataset.lesson!)));
    root.querySelector('[data-player-progress]')!.textContent = `${done} / ${buttons.length}`;
    gsap.to(bar, { scaleX: done / buttons.length, duration: reducedMotion() ? 0 : dur.standard, ease: ease.pop });
    const now = done === buttons.length;
    if (now && !complete) {
      badge.hidden = false;
      if (celebrate) {
        burst(bar, ['🎓', '✨', '⭐', '📚']);
        if (!reducedMotion()) gsap.fromTo(badge, { scale: 0, rotate: -30 }, { scale: 1, rotate: -4, duration: dur.editorial, ease: ease.elastic });
      }
    }
    complete = now;
  };
  const play = (btn: HTMLButtonElement) => {
    const id = btn.dataset.lesson!;
    buttons.forEach((b) => (b === btn ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')));
    iframe.src = embedURL(id, true);
    iframe.title = btn.dataset.title!;
    root.querySelector('[data-player-title]')!.textContent = btn.dataset.title!;
    root.querySelector('[data-player-channel]')!.textContent = `by ${btn.dataset.channel}`;
    root.querySelector<HTMLAnchorElement>('[data-player-source]')!.href = watchURL(id);
    watched.add(id);
    try {
      localStorage.setItem(key, JSON.stringify([...watched]));
    } catch {}
    paint(true);
    if (!reducedMotion()) gsap.fromTo(frame, { scale: 0.96, rotate: -1.5 }, { scale: 1, rotate: 0, duration: dur.standard, ease: ease.pop });
  };
  const click = (e: Event) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-lesson]');
    if (b) play(b);
  };
  root.addEventListener('click', click);
  paint();
  return () => root.removeEventListener('click', click);
}

/** Mock ₹10/month developer-support plan. No payment: state lives in this browser only. */
function initSupport(scope: HTMLElement): Cleanup {
  const offs = [...scope.querySelectorAll<HTMLElement>('[data-support]')].map((card) => {
    const btn = card.querySelector<HTMLButtonElement>('[data-support-toggle]')!;
    const label = btn.querySelector<HTMLElement>('.btn__label')!;
    const status = card.querySelector<HTMLElement>('[data-support-status]')!;
    const key = 'edusphere:supporter';
    const since = () => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    };
    const paint = () => {
      const d = since();
      card.toggleAttribute('data-active', !!d);
      btn.classList.toggle('btn--cream', !!d);
      label.textContent = d ? 'Cancel support (demo)' : 'Support for ₹10 / month';
      status.textContent = d ? `You’re a supporter since ${new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}. Thank you! (demo: nothing was charged)` : '';
      setSupporter(!!d);
    };
    const click = () => {
      if (btn.disabled) return;
      if (since()) {
        try {
          localStorage.removeItem(key);
        } catch {}
        paint();
        return;
      }
      // Fake "processing" beat so the confirmation feels like a real checkout.
      btn.disabled = true;
      label.textContent = 'Setting up…';
      gsap.delayedCall(reducedMotion() ? 0 : 0.9, () => {
        try {
          localStorage.setItem(key, new Date().toISOString());
        } catch {}
        btn.disabled = false;
        paint();
        burst(btn, ['💛', '☕', '✨', '🎉']);
        if (!reducedMotion()) {
          gsap.fromTo(card.querySelector('.support-card__badge'), { scale: 0, rotate: 40 }, { scale: 1, rotate: 8, duration: dur.editorial, ease: ease.elastic, clearProps: 'transform' });
          gsap.fromTo(status, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: dur.micro });
        }
      });
    };
    btn.addEventListener('click', click);
    paint();
    return () => btn.removeEventListener('click', click);
  });
  return () => offs.forEach((o) => o());
}

function initLogin(scope: HTMLElement): Cleanup {
  const form = scope.querySelector<HTMLFormElement>('[data-login]');
  if (!form) return () => {};
  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    const out = form.querySelector<HTMLElement>('[data-login-status]')!;
    const email = String(new FormData(form).get('email') || '');
    out.textContent = email.includes('@') ? `Demo only — no account system is connected yet. (${email})` : 'Please enter a valid email address.';
    gsap.fromTo(out, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: dur.micro });
  };
  form.addEventListener('submit', submit);
  return () => form.removeEventListener('submit', submit);
}

function initContact(scope: HTMLElement): Cleanup {
  const form = scope.querySelector<HTMLFormElement>('[data-contact]');
  if (!form) return () => {};
  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    const out = form.querySelector<HTMLElement>('[data-contact-status]')!;
    const data = new FormData(form);
    const ok = String(data.get('name') || '').trim() && String(data.get('email') || '').includes('@') && String(data.get('message') || '').trim();
    out.textContent = ok ? 'Thanks! (demo — nothing was sent)' : 'Please fill in your name, a valid email and a message.';
    if (ok) form.reset();
    gsap.fromTo(out, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: dur.micro });
  };
  form.addEventListener('submit', submit);
  return () => form.removeEventListener('submit', submit);
}

async function initPage(container: HTMLElement) {
  const ns = container.dataset.barbaNamespace;
  markActive(location.pathname);

  // Content that depends on web fonts (canvas covers) waits for them.
  await document.fonts.ready;

  const slider = container.querySelector<HTMLElement>('[data-render="slider"]');
  if (slider) renderBookSlider(slider);
  const grid = container.querySelector<HTMLElement>('[data-render="grid"]');
  if (grid) renderBookGrid(grid);
  const tracks = container.querySelector<HTMLElement>('[data-render="tracks"]');
  if (tracks) renderCourseTracks(tracks);
  const course = container.querySelector<HTMLElement>('[data-render="course"]');
  if (course) renderCoursePage(course, new URLSearchParams(location.search).get('id'));
  container.querySelectorAll<HTMLElement>('[data-render="support-plan"]').forEach(renderSupportPlan);
  const gl = container.querySelector<HTMLElement>('[data-render="genres"]');
  if (gl) renderGenreList(gl);
  const gc = container.querySelector<HTMLElement>('[data-render="genre-covers"]');
  if (gc) renderGenreCovers(gc);
  const ch = container.querySelector<HTMLElement>('[data-render="choice"]');
  if (ch) renderChoice(ch);
  container.querySelectorAll<HTMLElement>('[data-step-art]').forEach((el) => (el.innerHTML = stepArt[el.dataset.stepArt as keyof typeof stepArt]));
  const foot = container.querySelector<HTMLElement>('[data-footer-slot]');
  if (foot) foot.outerHTML = footerHTML();

  cleanups = [
    initText(container),
    initPlayful(container),
    initMagnetic(document.body),
    initScenes(container),
    initSliders(container),
    initAccordions(container),
    initTabs(container),
    initConfetti(container),
    initFilter(container),
    initPlayer(container),
    initSupport(container),
    initFinale(container),
    initLogin(container),
    initContact(container),
    initFloatingCta(container),
  ];

  // WebGL scenes are code-split and only loaded on pages that use them.
  const hero = container.querySelector<HTMLElement>('[data-hero-canvas]');
  if (hero) {
    const { initHeroBooks } = await import('./three/heroBooks');
    cleanups.push(initHeroBooks(hero));
  }
  const box = container.querySelector<HTMLElement>('[data-box-scene]');
  if (box) {
    const { initMailerBox } = await import('./three/mailerBox');
    cleanups.push(initMailerBox(box));
  }

  document.documentElement.dataset.page = ns ?? '';
  ScrollTrigger.refresh();
  playIntro(container);

  // Deep links such as /courses.html#data-science land on that course track.
  const hash = decodeURIComponent(location.hash.slice(1));
  const target = hash ? container.querySelector<HTMLElement>(`#${CSS.escape(hash)}`) : null;
  // Wait for the intro and ScrollTrigger refresh to settle; the track's scroll-margin clears the nav.
  if (target) setTimeout(() => target.scrollIntoView(), 700);
}

function destroyPage() {
  cleanups.forEach((c) => c());
  cleanups = [];
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

// ---- Boot -------------------------------------------------------------------
const { nav, closeMenu, curtain } = mountChrome();
initSmoothScroll();
initNav(nav, onScroll);

barba.init({
  preventRunning: true,
  prevent: ({ href }) => href.includes('#') && new URL(href).pathname === location.pathname,
  transitions: [
    {
      name: 'curtain',
      once: ({ next }) => initPage(next.container),
      leave: async ({ current }) => {
        closeMenu();
        getLenis()?.stop();
        await curtainLeave(curtain, current.container);
      },
      beforeEnter: ({ current }) => {
        destroyPage();
        current.container.remove();
        scrollToTop();
      },
      enter: async ({ next }) => {
        await initPage(next.container);
        getLenis()?.start();
        await curtainEnter(curtain);
      },
    },
  ],
});
