import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { books } from '../data/books';
import { finePointer, reducedMotion, type Cleanup } from '../motion/tokens';
import { createHardcover } from './book';
import { createStage } from './stage';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero world (motion.md §3, §14, §22): a few hardcovers tumbling slowly in
 * depth layers around the headline. Each book has its own float personality,
 * the whole scene leans toward the pointer, and scrolling scatters the books
 * outward and spins them as the hero leaves — the "hero" book travels furthest.
 */
export function initHeroBooks(host: HTMLElement): Cleanup {
  const stage = createStage(host, 28);
  if (!stage) return () => {};
  const { scene, camera, onFrame } = stage;
  const mobile = matchMedia('(max-width: 991px)').matches;
  const reduced = reducedMotion();

  // [book, position, base rotation, scale, float amp, float speed]
  const layout: [number, THREE.Vector3, THREE.Euler, number, number, number][] = [
    [0, new THREE.Vector3(4.6, -0.3, 0.5), new THREE.Euler(0.15, -0.55, -0.55), 1.25, 0.25, 0.55], // hero book
    [1, new THREE.Vector3(0.6, 5.9, -4), new THREE.Euler(0.5, 0.4, 0.9), 0.85, 0.18, 0.4],
    [3, new THREE.Vector3(-1.2, -6.2, -1.2), new THREE.Euler(-0.3, 0.3, 0.6), 1.0, 0.2, 0.47],
    [5, new THREE.Vector3(7.6, 5.2, -5), new THREE.Euler(0.2, -0.8, 0.25), 0.8, 0.15, 0.35],
  ];
  const used = mobile ? layout.slice(0, 2) : layout;
  if (mobile) {
    used[0][1].set(1.6, -3.8, 0);
    used[0][3] = 0.95;
    used[1][1].set(-2.4, 5.6, -3);
  }

  const world = new THREE.Group();
  scene.add(world);

  const items = used.map(([bi, pos, rot, s, amp, speed], i) => {
    const { group } = createHardcover(books[bi]);
    group.position.copy(pos);
    group.rotation.copy(rot);
    group.scale.setScalar(s);
    world.add(group);
    return { group, base: pos.clone(), rot: rot.clone(), amp, speed, phase: i * 1.7, scatter: new THREE.Vector3(), spin: 0 };
  });

  // Soft contact shadow catcher under the hero book
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.12 }));
  shadow.position.z = -2.5;
  shadow.receiveShadow = true;
  scene.add(shadow);

  // Pointer lean (smoothed)
  const lean = { x: 0, y: 0 };
  const leanTo = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    leanTo.x = (e.clientX / innerWidth - 0.5) * 2;
    leanTo.y = (e.clientY / innerHeight - 0.5) * 2;
  };
  if (finePointer() && !reduced) addEventListener('pointermove', onMove);

  // Scroll: books scatter + spin as the hero scrolls away
  const progress = { p: 0 };
  const st = reduced
    ? null
    : ScrollTrigger.create({
        trigger: host.closest('section')!,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => (progress.p = self.progress),
      });

  // Intro: books drop in from above with a tumble
  items.forEach((it, i) => {
    it.group.position.y += reduced ? 0 : 12;
    gsap.to(it.group.position, { y: it.base.y, duration: reduced ? 0 : 1.6, delay: 0.25 + i * 0.12, ease: 'expo.out' });
    gsap.from(it.group.rotation, { x: `+=${reduced ? 0 : 2}`, z: `-=${reduced ? 0 : 1.2}`, duration: reduced ? 0 : 1.8, delay: 0.25 + i * 0.12, ease: 'expo.out' });
  });

  let intro = true;
  gsap.delayedCall(2.2, () => (intro = false));

  onFrame((t) => {
    lean.x += (leanTo.x - lean.x) * 0.05;
    lean.y += (leanTo.y - lean.y) * 0.05;
    world.rotation.y = lean.x * 0.12;
    world.rotation.x = lean.y * 0.08;
    camera.position.x = lean.x * 0.4;
    camera.position.y = -lean.y * 0.3;
    camera.lookAt(0, 0, 0);

    const p = progress.p;
    items.forEach((it, i) => {
      if (reduced) return;
      const f = Math.sin(t * it.speed + it.phase);
      const g = Math.cos(t * it.speed * 0.8 + it.phase);
      if (!intro) it.group.position.y = it.base.y + f * it.amp - p * (i === 0 ? 9 : 5 + i * 1.5);
      it.group.position.x = it.base.x + g * it.amp * 0.6 + p * (it.base.x > 0 ? 3 : -3) * (i === 0 ? 0.3 : 1);
      it.group.rotation.x = it.rot.x + f * 0.06 + p * (i === 0 ? 1.4 : 0.8);
      it.group.rotation.y = it.rot.y + t * 0.05 * (i % 2 ? -1 : 1) + p * (i === 0 ? -2.2 : 1.2);
      it.group.rotation.z = it.rot.z + g * 0.05;
    });
  });

  return () => {
    removeEventListener('pointermove', onMove);
    st?.kill();
    stage.dispose();
  };
}
