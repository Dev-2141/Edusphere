import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { dur, ease, MQ, stagger, type Cleanup } from './tokens';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

/**
 * [data-split="lines"]  — masked line rise (motion.md §11), used on big headings.
 * [data-split="words"]  — word pop with slight rotation, used on secondary headings.
 * [data-hand]           — handwritten notes: characters "ink in" one by one with a
 *                         tilt, then an optional [data-hand-scribble] path is drawn.
 * [data-reveal]         — generic paragraph / block fade-rise.
 * Elements with [data-intro] are driven by the page-load timeline instead of scroll.
 */
export function initText(scope: HTMLElement): Cleanup {
  const mm = gsap.matchMedia();

  mm.add(MQ.motion, () => {
    scope.querySelectorAll<HTMLElement>('[data-split="lines"]').forEach((el) => {
      const split = SplitText.create(el, { type: 'lines,words', mask: 'lines', linesClass: 'split-line', autoSplit: true,
        onSplit: (self) => {
          const tw = gsap.from(self.words, {
            yPercent: 110,
            rotate: 4,
            duration: dur.editorial,
            ease: ease.expressive,
            stagger: stagger.words,
            paused: el.hasAttribute('data-intro'),
            scrollTrigger: el.hasAttribute('data-intro') ? undefined : { trigger: el, start: 'top 85%' },
          });
          if (el.hasAttribute('data-intro')) (el as HTMLElement & { _intro?: gsap.core.Tween })._intro = tw;
          return tw;
        },
      });
      void split;
    });

    scope.querySelectorAll<HTMLElement>('[data-split="words"]').forEach((el) => {
      const split = SplitText.create(el, { type: 'words' });
      gsap.from(split.words, {
        y: '0.6em',
        rotate: () => gsap.utils.random(-8, 8),
        opacity: 0,
        duration: dur.standard,
        ease: ease.pop,
        stagger: stagger.words,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    scope.querySelectorAll<HTMLElement>('[data-hand]').forEach((el) => {
      const split = SplitText.create(el, { type: 'words,chars', charsClass: 'split-char' });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 92%' } });
      tl.from(split.chars, {
        opacity: 0,
        y: '0.35em',
        x: '-0.15em',
        rotate: 18,
        scale: 0.6,
        duration: 0.35,
        ease: 'back.out(2.2)',
        stagger: stagger.chars,
      });
      const scribble = el.parentElement?.querySelector<SVGPathElement>('[data-hand-scribble] path');
      if (scribble) tl.from(scribble, { drawSVG: '0%', duration: 0.6, ease: 'power2.inOut' }, '-=0.15');
    });

    scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        y: 36,
        opacity: 0,
        duration: dur.standard,
        ease: ease.standard,
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });
  });

  return () => mm.revert();
}
