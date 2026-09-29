import gsap from 'gsap';
import { dur, ease, reducedMotion } from './tokens';

/**
 * Page transitions (motion.md §31–32). Short on purpose:
 *   leave  — content drops + fades, curtain rises from the bottom with the moth
 *   enter  — curtain lifts off the top, new content is revealed by the page intro
 */
export function curtainLeave(curtain: HTMLElement, container: HTMLElement) {
  const panel = curtain.querySelector('.curtain__panel');
  const mark = curtain.querySelector('.curtain__mark');
  if (reducedMotion()) return gsap.to(container, { opacity: 0, duration: 0.15 });
  return gsap
    .timeline()
    .set(curtain, { visibility: 'visible' })
    .to(container, { y: -60, opacity: 0.4, duration: dur.standard, ease: 'power2.in' }, 0)
    .fromTo(panel, { yPercent: 100, borderRadius: '50% 50% 0 0 / 30% 30% 0 0' }, { yPercent: 0, borderRadius: '0% 0% 0 0 / 0% 0% 0 0', duration: dur.standard, ease: ease.inOut }, 0)
    .fromTo(mark, { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: dur.standard, ease: ease.pop }, 0.25);
}

export function curtainEnter(curtain: HTMLElement) {
  const panel = curtain.querySelector('.curtain__panel');
  const mark = curtain.querySelector('.curtain__mark');
  if (reducedMotion()) return gsap.set(curtain, { visibility: 'hidden' });
  return gsap
    .timeline()
    .to(mark, { scale: 0, rotate: 40, duration: dur.micro, ease: 'power2.in' })
    .to(panel, { yPercent: -100, borderRadius: '0 0 50% 50% / 0 0 30% 30%', duration: dur.standard, ease: ease.inOut }, '-=0.1')
    .set(curtain, { visibility: 'hidden' });
}
