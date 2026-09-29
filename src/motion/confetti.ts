import gsap from 'gsap';
import { reducedMotion, type Cleanup } from './tokens';

/**
 * [data-confetti="📚,✨,🎁"] — a celebratory burst of emoji that arc out of the
 * element and tumble down under gravity. Triggered on click (and on first hover
 * for pointer devices). Pure transforms, removed from the DOM when done.
 */
/** Fire one burst of glyphs from the centre of `el`. Also used directly by code. */
export function burst(el: HTMLElement, glyphs: string[]) {
  if (reducedMotion()) return;
  const r = el.getBoundingClientRect();
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  document.body.append(layer);
  const n = 26;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.textContent = glyphs[i % glyphs.length];
    s.style.left = `${r.left + r.width / 2}px`;
    s.style.top = `${r.top + r.height / 2}px`;
    s.style.fontSize = `${gsap.utils.random(18, 38)}px`;
    layer.append(s);
    const angle = gsap.utils.random(-160, -20) * (Math.PI / 180);
    const v = gsap.utils.random(380, 820);
    // Ballistic arc: tween a clock, derive position from launch angle + gravity.
    const clock = { t: 0 };
    const spin = i % 2 ? 1 : -1;
    gsap.to(clock, {
      t: gsap.utils.random(1.4, 2.2),
      duration: gsap.utils.random(1.4, 2.2),
      ease: 'none',
      onUpdate: () => {
        const { t } = clock;
        gsap.set(s, {
          x: Math.cos(angle) * v * t,
          y: Math.sin(angle) * v * t + 0.5 * 1400 * t * t,
          rotate: t * 360 * spin,
          opacity: 1 - Math.max(0, t - 1.2),
        });
      },
    });
  }
  gsap.delayedCall(2.3, () => layer.remove());
}

export function initConfetti(scope: HTMLElement): Cleanup {
  const offs = [...scope.querySelectorAll<HTMLElement>('[data-confetti]')].map((el) => {
    const glyphs = (el.dataset.confetti || '📚,✨').split(',');
    let hovered = false;
    const fire = () => burst(el, glyphs);
    const onEnter = () => !hovered && ((hovered = true), fire());
    el.addEventListener('click', fire);
    el.addEventListener('pointerenter', onEnter);
    return () => (el.removeEventListener('click', fire), el.removeEventListener('pointerenter', onEnter));
  });
  return () => offs.forEach((o) => o());
}
