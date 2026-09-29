import gsap from 'gsap';
import { dur, ease, reducedMotion } from '../motion/tokens';

// Shared chrome injected once (outside the Barba container so it persists
// across page transitions): nav, mobile menu, floating CTA, transition curtain.

export const arrow = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const btn = (label: string, href: string, tone = '', attrs = '') =>
  `<a class="btn ${tone}" href="${href}" ${attrs}><span class="btn__label">${label}</span><span class="btn__icon">${arrow}</span></a>`;

// Original brand mark: a moth whose wings are two open book pages.
export const mothMark = `<svg class="moth" viewBox="0 0 64 64" aria-hidden="true"><g fill="currentColor"><path d="M31 18c-6-9-20-12-26-6-5 6 0 18 9 21-6 3-8 12-2 16 6 4 14-2 19-12z"/><path d="M33 18c6-9 20-12 26-6 5 6 0 18-9 21 6 3 8 12 2 16-6 4-14-2-19-12z"/><rect x="30" y="16" width="4" height="30" rx="2"/><path d="M31 17c-2-5-6-8-9-9M33 17c2-5 6-8 9-9" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></g><g fill="var(--wing, #fff8ec)" opacity=".9"><path d="M28 22c-5-5-13-6-17-3"/><path d="M13 22h12M12 26h14M16 30h11" stroke="var(--wing, #fff8ec)" stroke-width="1.4" stroke-linecap="round"/><path d="M39 22h12M38 26h14M37 30h11" stroke="var(--wing, #fff8ec)" stroke-width="1.4" stroke-linecap="round"/></g></svg>`;

const logo = `<a class="logo" href="/" aria-label="Edusphere Book Club — home">${mothMark}<span class="logo__word">Edusphere</span><span class="logo__club">Book<br/>Club</span></a>`;

const links = [
  ['All Books', '/books.html'],
  ['Gifting', '/gifting.html'],
  ['FAQ', '/faq.html'],
];

export function mountChrome() {
  const nav = document.createElement('header');
  nav.className = 'nav';
  nav.innerHTML = `
    ${logo}
    <nav class="nav__center" aria-label="Main">
      ${links.map(([l, h]) => `<a class="pill" href="${h}">${l}</a>`).join('')}
      ${btn('Log-in / Join', '/login.html', 'btn--sun btn--sm')}
    </nav>
    <div class="nav__right">
      <a class="pill pill--round" href="/contact.html" aria-label="About us &amp; contact" title="About us &amp; contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
      <button class="nav__burger" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span></button>
    </div>`;

  const menu = document.createElement('div');
  menu.className = 'menu';
  menu.id = 'menu';
  menu.hidden = true;
  menu.innerHTML = `
    <nav class="menu__inner" aria-label="Mobile">
      ${[['Home', '/'], ...links, ['About & Contact', '/contact.html'], ['Log-in / Join', '/login.html']].map(([l, h]) => `<a class="menu__link" href="${h}">${l}</a>`).join('')}
      <p class="t-hand menu__note">new books every full moon</p>
    </nav>`;

  const cta = document.createElement('div');
  cta.className = 'floating-cta';
  cta.dataset.floatingCta = '';
  cta.innerHTML = btn('Join the club', '/login.html', '', 'data-magnetic');

  const curtain = document.createElement('div');
  curtain.className = 'curtain';
  curtain.setAttribute('aria-hidden', 'true');
  curtain.innerHTML = `<div class="curtain__panel"></div><div class="curtain__mark">${mothMark}</div>`;

  document.body.prepend(nav, menu);
  document.body.append(cta, curtain);

  // Mobile menu
  const burger = nav.querySelector<HTMLButtonElement>('.nav__burger')!;
  const setMenu = (open: boolean) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.documentElement.dataset.menu = open ? 'open' : 'closed';
    const items = menu.querySelectorAll('.menu__link, .menu__note');
    const r = reducedMotion();
    gsap.killTweensOf([menu, items]);
    if (open) {
      menu.hidden = false;
      gsap.fromTo(menu, { clipPath: 'circle(0% at 92% 4%)' }, { clipPath: 'circle(150% at 92% 4%)', duration: r ? 0 : dur.editorial, ease: ease.inOut });
      gsap.fromTo(items, { yPercent: 80, rotate: 6, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: r ? 0 : dur.standard, stagger: 0.05, delay: r ? 0 : 0.2, ease: ease.pop });
    } else {
      gsap.to(menu, { clipPath: 'circle(0% at 92% 4%)', duration: r ? 0 : dur.standard, ease: ease.inOut, onComplete: () => (menu.hidden = true) });
    }
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true' && setMenu(false));

  return { nav, closeMenu: () => burger.getAttribute('aria-expanded') === 'true' && setMenu(false), curtain };
}

export function markActive(path: string) {
  document.querySelectorAll<HTMLAnchorElement>('.nav a, .menu a').forEach((a) => {
    const on = new URL(a.href).pathname.replace(/index\.html$/, '') === path.replace(/index\.html$/, '');
    if (on) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

export function footerHTML() {
  return `
  <footer class="footer" data-footer-reveal>
    <div class="footer__inner" data-footer-inner>
      <div class="footer__top">
        <div class="footer__signup">
          <p class="t-hand">letters from Edusphere, once a month</p>
          <form class="footer__form" onsubmit="event.preventDefault(); this.querySelector('output').textContent='Thanks! (demo — nothing was sent)';">
            <label class="sr-only" for="news-email">Email address</label>
            <input id="news-email" type="email" placeholder="you@example.com" required />
            <button class="btn btn--sun btn--sm" type="submit"><span class="btn__label">Subscribe</span><span class="btn__icon">${arrow}</span></button>
            <output class="footer__out" aria-live="polite"></output>
          </form>
        </div>
        <nav class="footer__links" aria-label="Footer">
          <div><p class="footer__h">Club</p><a href="/books.html">All books</a><a href="/gifting.html">Gifting</a><a href="/faq.html">FAQ</a><a href="/contact.html">About &amp; contact</a></div>
          <div><p class="footer__h">Account</p><a href="/login.html">Log in</a><a href="/login.html">Join</a></div>
          <div><p class="footer__h">Small print</p><a href="#">Terms (placeholder)</a><a href="#">Privacy (placeholder)</a></div>
        </nav>
      </div>
      <div class="footer__mark" data-footer-mark aria-hidden="true">${mothMark}<span>Edusphere</span></div>
      <p class="footer__legal">© 2026 Edusphere Book Club — a fictional brand built as a motion-design study. All books and authors are invented.</p>
    </div>
  </footer>`;
}
