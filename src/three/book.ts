import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { Book } from '../data/books';
import { paintCover } from '../data/covers';

/**
 * Procedural hardcover: two boards, a rounded spine and an inset page block
 * with ruled page edges. Returns a Group whose origin sits at the spine, so the
 * front board can hinge open (motion.md §5 "book opening").
 */
export interface Hardcover {
  group: THREE.Group;
  front: THREE.Group; // hinge for the opening effect
}

let pageTex: THREE.CanvasTexture | null = null;
function pageEdgeTexture() {
  if (pageTex) return pageTex;
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#f7f0e1';
  ctx.fillRect(0, 0, 64, 256);
  for (let y = 0; y < 256; y += 2) {
    ctx.fillStyle = `rgba(120,100,70,${0.08 + Math.random() * 0.12})`;
    ctx.fillRect(0, y, 64, 1);
  }
  pageTex = new THREE.CanvasTexture(c);
  pageTex.colorSpace = THREE.SRGBColorSpace;
  return pageTex;
}

export function createHardcover(book: Book, { w = 2.4, h = 3.6, d = 0.55 } = {}): Hardcover {
  const board = 0.07;
  const coverTex = new THREE.CanvasTexture(paintCover(book, 512, 768));
  coverTex.colorSpace = THREE.SRGBColorSpace;
  coverTex.anisotropy = 8;

  const clothColor = new THREE.Color(book.cover.bg);
  const cloth = new THREE.MeshPhysicalMaterial({ color: clothColor, roughness: 0.62, sheen: 0.6, sheenRoughness: 0.8, sheenColor: clothColor.clone().offsetHSL(0, 0, 0.2) });
  const coverMat = new THREE.MeshPhysicalMaterial({ map: coverTex, roughness: 0.45, clearcoat: 0.25, clearcoatRoughness: 0.5 });
  const pages = new THREE.MeshStandardMaterial({ map: pageEdgeTexture(), roughness: 0.9 });
  const pagesTop = new THREE.MeshStandardMaterial({ color: 0xf7f0e1, roughness: 0.95 });

  const group = new THREE.Group();

  // Back board
  const back = new THREE.Mesh(new RoundedBoxGeometry(w, h, board, 2, 0.02), cloth);
  back.position.set(w / 2, 0, -d / 2 + board / 2);
  back.castShadow = true;
  group.add(back);

  // Front board on a hinge at the spine
  const front = new THREE.Group();
  front.position.set(0, 0, d / 2 - board / 2);
  const frontMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, board), [cloth, cloth, cloth, cloth, coverMat, cloth]);
  frontMesh.position.x = w / 2;
  frontMesh.castShadow = true;
  front.add(frontMesh);
  group.add(front);

  // Spine: half-cylinder
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(d / 2, d / 2, h, 24, 1, false, Math.PI, Math.PI), cloth);
  spine.castShadow = true;
  group.add(spine);

  // Page block, inset from the boards
  const inset = 0.08;
  const block = new THREE.Mesh(new THREE.BoxGeometry(w - inset, h - inset * 2, d - board * 2), [pages, cloth, pagesTop, pagesTop, pagesTop, pagesTop]);
  block.position.set((w - inset) / 2 + 0.02, 0, 0);
  block.castShadow = true;
  block.receiveShadow = true;
  group.add(block);

  // Centre the group on the book, not the spine
  const pivot = new THREE.Group();
  group.position.x = -w / 2;
  pivot.add(group);

  return { group: pivot, front };
}
