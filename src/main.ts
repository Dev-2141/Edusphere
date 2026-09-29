import './styles/tokens.css';
import './styles/base.css';
import './styles/chrome.css';
import './styles/sections.css';
import './styles/pages.css';

import barba from '@barba/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initConfetti } from './motion/confetti';
import { initAccordions, initTabs } from './motion/disclosure';
import { initMagnetic, initPlayful } from './motion/playful';
import { initFloatingCta, initNav, initScenes } from './motion/scenes';
import { initSliders } from './motion/slider';
import { getLenis, initSmoothScroll, onScroll, scrollToTop } from './motion/smoothScroll';
import { initText } from './motion/text';
import { dur, ease, reducedMotion, type Cleanup } from './motion/tokens';
import { curtainEnter, curtainLeave } from './motion/transitions';
import { footerHTML, markActive, mountChrome } from './ui/chrome';
import { renderBookGrid, renderBookSlider, renderChoice, renderGenreCovers, renderGenreList, stepArt } from './ui/render';

gsap.registerPlugin(ScrollTrigger);

let cleanups: Cleanup[] = [];

/** Page intro (motion.md §31): background → visual → headline → copy → CTA. */
function playIntro(scope: HTMLElement) {
  const r = reducedMotion();
  const tl = gsap.timeline({ delay: 0.05 });
  const heading = scope.querySelector<HTMLElement & { _intro?: gsap.core.Tween }>('[data-intro][data-split]');
  if (heading?._intro) tl.add(heading._intro.play(), 0.2);
  const rest = scope.querySelectorAll('[data-intro-item]');
  if (rest.length && !r) tl.from(rest, { y: 30, opacity: 0, duration: dur.standard, ease: ease.standard, stagger: 0.1 }, 0.45);
  return tl;
}

/** Books page: animated genre filter. */
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
