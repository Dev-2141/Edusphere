import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dur, ease, reducedMotion, type Cleanup } from './tokens';

/**
 * Accordion (motion.md §20): height 0 → auto + opacity, "+" rotates 45°.
 * Markup: [data-accordion] > .faq-item > button[data-accordion-toggle] + [data-accordion-panel]
 */
export function initAccordions(scope: HTMLElement): Cleanup {
  const offs = [...scope.querySelectorAll<HTMLElement>('[data-accordion]')].map((root) => {
    const single = root.dataset.accordion === 'single';
    const onClick = (e: Event) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-accordion-toggle]');
      if (!btn || !root.contains(btn)) return;
      const open = btn.getAttribute('aria-expanded') !== 'true';
      if (single && open) {
        root.querySelectorAll<HTMLButtonElement>('[data-accordion-toggle][aria-expanded="true"]').forEach((b) => b !== btn && toggle(b, false));
      }
      toggle(btn, open);
    };
    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  });

  function toggle(btn: HTMLButtonElement, open: boolean) {
    const panel = document.getElementById(btn.getAttribute('aria-controls')!)!;
    const icon = btn.querySelector('.faq-item__icon');
    btn.setAttribute('aria-expanded', String(open));
    const d = reducedMotion() ? 0.01 : dur.standard;
    gsap.killTweensOf([panel, icon]);
    if (open) {
      panel.hidden = false;
      gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: d, ease: ease.inOut, onComplete: () => ScrollTrigger.refresh() });
      gsap.fromTo(panel.firstElementChild, { y: 14 }, { y: 0, duration: d, ease: ease.standard });
    } else {
      gsap.to(panel, { height: 0, opacity: 0, duration: d * 0.8, ease: ease.inOut, onComplete: () => ((panel.hidden = true), ScrollTrigger.refresh()) });
    }
    gsap.to(icon, { rotate: open ? 45 : 0, duration: d, ease: ease.pop });
  }

  return () => offs.forEach((o) => o());
}

/**
 * Tabs with roving focus and an animated swap of the active panel.
 * Markup: [data-tabs] > [role=tablist] > [role=tab] ; [role=tabpanel]
 */
export function initTabs(scope: HTMLElement): Cleanup {
  const offs = [...scope.querySelectorAll<HTMLElement>('[data-tabs]')].map((root) => {
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role=tab]')];
    const indicator = root.querySelector<HTMLElement>('[data-tabs-indicator]');

    const moveIndicator = (tab: HTMLElement, instant = false) => {
      if (!indicator) return;
      gsap.to(indicator, { x: tab.offsetLeft, width: tab.offsetWidth, duration: instant ? 0 : dur.standard, ease: ease.pop });
    };

    const select = (tab: HTMLButtonElement, focus = true) => {
      const current = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
      if (current === tab) return;
      const outPanel = current && document.getElementById(current.getAttribute('aria-controls')!);
      const inPanel = document.getElementById(tab.getAttribute('aria-controls')!)!;
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
      });
      if (focus) tab.focus();
      moveIndicator(tab);
      const d = reducedMotion() ? 0.01 : 1;
      const tl = gsap.timeline();
      if (outPanel) {
        tl.to(outPanel.querySelectorAll('[data-tab-anim]'), { y: -30, opacity: 0, rotate: -4, duration: 0.25 * d, stagger: 0.04, ease: 'power2.in' })
          .add(() => (outPanel.hidden = true));
      }
      tl.add(() => (inPanel.hidden = false)).fromTo(
        inPanel.querySelectorAll('[data-tab-anim]'),
        { y: 40, opacity: 0, rotate: 5 },
        { y: 0, opacity: 1, rotate: (_i, el: HTMLElement) => Number(el.dataset.tilt ?? 0), duration: 0.7 * d, stagger: 0.06, ease: ease.pop },
      );
    };

    const onClick = (e: Event) => {
      const tab = (e.target as HTMLElement).closest<HTMLButtonElement>('[role=tab]');
      if (tab) select(tab);
    };
    const onKey = (e: KeyboardEvent) => {
      const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
      if (i < 0) return;
      const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
      if (n === null) return;
      e.preventDefault();
      select(tabs[(n + tabs.length) % tabs.length]);
    };
    root.addEventListener('click', onClick);
    root.addEventListener('keydown', onKey);
    const active = tabs.find((t) => t.getAttribute('aria-selected') === 'true') ?? tabs[0];
    requestAnimationFrame(() => moveIndicator(active, true));
    const onResize = () => moveIndicator(tabs.find((t) => t.getAttribute('aria-selected') === 'true')!, true);
    addEventListener('resize', onResize);
    return () => {
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKey);
      removeEventListener('resize', onResize);
    };
  });
  return () => offs.forEach((o) => o());
}
