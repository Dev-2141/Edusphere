import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { books } from '../data/books';
import { reducedMotion, type Cleanup } from '../motion/tokens';
import { createHardcover } from './book';
import { createStage } from './stage';

gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned "unboxing" scene: a printed mailer box rotates into view, its lid
 * hinges open, and three books plus a bookmark and postcard rise out of it —
 * all scrubbed to scroll (motion.md §7, §22). Notes in the DOM fade in at
 * matching timeline labels.
 */

function boxPrint(outside: boolean) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d')!;
  if (outside) {
    g.fillStyle = '#ff8a3d';
    g.fillRect(0, 0, 512, 512);
    const cols = ['#ff5470', '#c6b4ff', '#3355ff', '#ffcf33', '#fff8ec', '#141115'];
    for (let i = 0; i < 9; i++) {
      g.fillStyle = cols[i % cols.length];
      g.beginPath();
      const cx = (i * 97) % 512, cy = (i * 173) % 512, r = 60 + ((i * 37) % 90);
      for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.2) {
        const rr = r * (1 + 0.22 * Math.sin(a * 3 + i));
        g.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      g.fill();
    }
  } else {
    g.fillStyle = '#fff8ec';
    g.fillRect(0, 0, 512, 512);
    g.fillStyle = '#141115';
    for (let y = 0; y < 512; y += 9)
      for (let x = 0; x < 512; x += 9) {
        const v = Math.sin(x / 70) + Math.cos(y / 55) + Math.sin((x + y) / 90);
        const r = Math.max(0, (v + 1.2) * 1.5);
        g.beginPath();
        g.arc(x + (y % 18 ? 4 : 0), y, r, 0, Math.PI * 2);
        g.fill();
      }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function initMailerBox(section: HTMLElement): Cleanup {
  const host = section.querySelector<HTMLElement>('[data-box-canvas]')!;
  const stage = createStage(host, 30);
  if (!stage) return () => {};
  const { scene, camera, onFrame } = stage;
  camera.position.set(0, 4.5, 16);
  camera.lookAt(0, 0.5, 0);

  const W = 6.2, D = 4.4, H = 1.5, T = 0.08;
  const outMat = new THREE.MeshStandardMaterial({ map: boxPrint(true), roughness: 0.75 });
  const inMat = new THREE.MeshStandardMaterial({ map: boxPrint(false), roughness: 0.9 });
  const edge = new THREE.MeshStandardMaterial({ color: 0xc9a27a, roughness: 1 });
  // Box faces: outside print on +side, halftone print inside
  const wall = (w: number, h: number) => new THREE.Mesh(new THREE.BoxGeometry(w, h, T), [edge, edge, edge, edge, outMat, inMat]);

  const box = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), [edge, edge, inMat, outMat, edge, edge]);
  base.receiveShadow = true;
  box.add(base);
  const front = wall(W, H); front.position.set(0, H / 2, D / 2);
  const backW = wall(W, H); backW.position.set(0, H / 2, -D / 2); backW.rotation.y = Math.PI;
  const left = wall(D, H); left.position.set(-W / 2, H / 2, 0); left.rotation.y = -Math.PI / 2;
  const right = wall(D, H); right.position.set(W / 2, H / 2, 0); right.rotation.y = Math.PI / 2;
  [front, backW, left, right].forEach((m) => ((m.castShadow = true), box.add(m)));

  // Lid hinged on the back top edge, with a front tuck flap
  const lid = new THREE.Group();
  lid.position.set(0, H, -D / 2);
  const lidTop = new THREE.Mesh(new THREE.BoxGeometry(W + 0.06, T, D + 0.04), [edge, edge, outMat, inMat, edge, edge]);
  lidTop.position.z = D / 2;
  lidTop.castShadow = true;
  const flap = new THREE.Mesh(new THREE.BoxGeometry(W - 0.1, H * 0.85, T), [edge, edge, edge, edge, outMat, inMat]);
  flap.position.set(0, -H * 0.42, D + 0.02);
  lid.add(lidTop, flap);
  box.add(lid);

  // Contents
  const contents = new THREE.Group();
  const picks = [books[2], books[4], books[6]].map((b, i) => {
    const { group } = createHardcover(b, { w: 1.7, h: 2.5, d: 0.4 });
    group.rotation.set(-Math.PI / 2, 0, (i - 1) * 0.08);
    group.position.set((i - 1) * 1.85, 0.35, 0.1);
    contents.add(group);
    return group;
  });
  const bookmark = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 2.2), new THREE.MeshStandardMaterial({ color: 0xff5470, roughness: 0.6 }));
  bookmark.position.set(2.4, 0.9, -1);
  const postcard = new THREE.Mesh(new THREE.BoxGeometry(2, 0.02, 1.4), new THREE.MeshStandardMaterial({ color: 0xa8f0d4, roughness: 0.7 }));
  postcard.position.set(-2.1, 0.9, -1.1);
  contents.add(bookmark, postcard);
  box.add(contents);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.15 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.05;
  floor.receiveShadow = true;
  scene.add(box, floor);

  // Scroll timeline (0..1)
  const state = { rotY: -0.9, rotX: 0.35, lift: -2.5, lid: 0, rise: 0, spread: 0 };
  box.rotation.set(state.rotX, state.rotY, 0);

  const notes = [...section.querySelectorAll<HTMLElement>('[data-box-note]')];
  const reduced = reducedMotion();
  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  tl.to(state, { rotY: -0.25, rotX: 0.15, lift: 0, duration: 1 })
    .addLabel('open')
    .to(state, { lid: 1, duration: 1.2, ease: 'power2.inOut' })
    .to(state, { rise: 1, duration: 1, ease: 'power2.out' }, '-=0.3')
    .addLabel('contents')
    .to(state, { spread: 1, rotY: 0.2, duration: 1, ease: 'power1.inOut' })
    .addLabel('end');
  notes.forEach((n) => {
    tl.fromTo(n, { opacity: 0, y: 30, rotate: -6 }, { opacity: 1, y: 0, rotate: Number(n.dataset.tilt ?? -3), duration: 0.35, ease: 'power2.out' }, n.dataset.boxNote || 'open');
  });

  let st: ScrollTrigger | null = null;
  const mm = gsap.matchMedia();
  if (reduced) {
    tl.progress(1);
  } else {
    mm.add('(min-width: 992px)', () => {
      st = ScrollTrigger.create({ trigger: section, start: 'top top', end: '+=260%', pin: true, scrub: 0.8, animation: tl });
      return () => st?.kill();
    });
    mm.add('(max-width: 991px)', () => {
      // Mobile: no pinning — the timeline plays across the section's natural scroll.
      st = ScrollTrigger.create({ trigger: section, start: 'top 70%', end: 'bottom 60%', scrub: 0.8, animation: tl });
      return () => st?.kill();
    });
  }

  onFrame((t) => {
    box.rotation.y = state.rotY + Math.sin(t * 0.4) * 0.02;
    box.rotation.x = state.rotX;
    box.position.y = state.lift + Math.sin(t * 0.8) * 0.05;
    lid.rotation.x = -state.lid * 1.95;
    contents.position.y = state.rise * 1.9;
    picks.forEach((b, i) => {
      b.position.x = (i - 1) * (1.85 + state.spread * 0.9);
      b.position.y = 0.35 + state.spread * (i === 1 ? 1.2 : 0.5);
      b.rotation.x = -Math.PI / 2 + state.spread * (i === 1 ? 1.25 : 0.9);
      b.rotation.z = (i - 1) * (0.08 + state.spread * 0.25);
    });
    bookmark.rotation.y = state.spread * 0.5 + Math.sin(t * 1.2) * 0.04 * state.rise;
    bookmark.position.y = 0.9 + state.spread * 1.8;
    postcard.rotation.z = state.spread * -0.35;
    postcard.position.y = 0.9 + state.spread * 1.4;
  });

  return () => {
    mm.revert();
    tl.kill();
    stage.dispose();
  };
}
