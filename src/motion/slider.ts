import gsap from 'gsap';
import { finePointer, reducedMotion, type Cleanup } from './tokens';

/**
 * [data-slider] > [data-slider-track] > [data-slider-item]
 * Drag / swipe / trackpad slider with momentum and a velocity-based card tilt,
 * so the row of books feels like it has weight (motion.md §13 mobile fallback,
 * §18 depth). Optional [data-slider-prev]/[data-slider-next] buttons.
 */
export function initSliders(scope: HTMLElement): Cleanup {
  const offs = [...scope.querySelectorAll<HTMLElement>('[data-slider]')].map((root) => {
    const track = root.querySelector<HTMLElement>('[data-slider-track]')!;
    const items = [...track.querySelectorAll<HTMLElement>('[data-slider-item]')];
    const reduced = reducedMotion();

    let x = 0, target = 0, min = 0, dragging = false, startX = 0, startTarget = 0, lastX = 0, lastT = 0, vel = 0, moved = 0;

    const measure = () => {
      const last = items[items.length - 1];
      const contentW = last.offsetLeft + last.offsetWidth;
      min = Math.min(0, root.clientWidth - contentW - parseFloat(getComputedStyle(track).paddingLeft));
      target = gsap.utils.clamp(min, 0, target);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);

    const tilt = items.map((it) => gsap.quickTo(it, 'rotate', { duration: 0.6, ease: 'power3.out' }));
    const setX = gsap.quickSetter(track, 'x', 'px');

    const tick = () => {
      if (!dragging) {
        target += vel * 0.016;
        vel *= 0.92;
        if (target > 0 || target < min) {
          target += ((target > 0 ? 0 : min) - target) * 0.18;
          vel *= 0.6;
        }
      }
      const prev = x;
      x += (target - x) * (reduced ? 1 : 0.16);
      setX(x);
      if (!reduced) {
        const speed = gsap.utils.clamp(-9, 9, (x - prev) * 0.35);
        items.forEach((it, i) => tilt[i](Number(it.dataset.tilt ?? 0) - speed));
      }
    };
    gsap.ticker.add(tick);

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true; moved = 0;
      startX = lastX = e.clientX; startTarget = target; lastT = performance.now(); vel = 0;
      root.setPointerCapture(e.pointerId);
      root.dataset.dragging = 'true';
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const d = e.clientX - startX;
      moved = Math.max(moved, Math.abs(d));
      let t = startTarget + d;
      if (t > 0) t *= 0.35;
      if (t < min) t = min + (t - min) * 0.35;
      target = t;
      vel = ((e.clientX - lastX) / Math.max(1, now - lastT)) * 1000;
      lastX = e.clientX; lastT = now;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      delete root.dataset.dragging;
    };
    // Swallow clicks that were really drags
    const click = (e: MouseEvent) => moved > 6 && (e.preventDefault(), e.stopPropagation());
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      target = gsap.utils.clamp(min, 0, target - e.deltaX);
    };
    const step = (dir: number) => () => {
      const w = items[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || '0');
      target = gsap.utils.clamp(min, 0, target - dir * w * (finePointer() ? 2 : 1));
      vel = 0;
    };
    const prev = root.parentElement?.querySelector<HTMLElement>('[data-slider-prev]');
    const next = root.parentElement?.querySelector<HTMLElement>('[data-slider-next]');
    const onPrev = step(-1), onNext = step(1);
    prev?.addEventListener('click', onPrev);
    next?.addEventListener('click', onNext);

    // Keyboard: focus moves card into view
    const focus = (e: FocusEvent) => {
      const it = (e.target as HTMLElement).closest<HTMLElement>('[data-slider-item]');
      if (!it) return;
      target = gsap.utils.clamp(min, 0, -it.offsetLeft + root.clientWidth * 0.1);
      root.scrollLeft = 0;
    };

    root.addEventListener('pointerdown', down);
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerup', up);
    root.addEventListener('pointercancel', up);
    root.addEventListener('click', click, true);
    root.addEventListener('wheel', wheel, { passive: false });
    root.addEventListener('focusin', focus);

    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      prev?.removeEventListener('click', onPrev);
      next?.removeEventListener('click', onNext);
      root.removeEventListener('pointerdown', down);
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerup', up);
      root.removeEventListener('pointercancel', up);
      root.removeEventListener('click', click, true);
      root.removeEventListener('wheel', wheel);
      root.removeEventListener('focusin', focus);
    };
  });
  return () => offs.forEach((o) => o());
}
