import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Shared WebGL stage: renderer, camera, physically based lighting
 * (ambient + key + fill + rim, motion.md §15), resize handling, and an
 * IntersectionObserver so the render loop only runs while on screen (§28).
 */
export interface Stage {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  onFrame: (fn: (t: number, dt: number) => void) => void;
  dispose: () => void;
}

export function createStage(host: HTMLElement, fov = 30): Stage | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    host.dataset.webgl = 'off'; // CSS fallback kicks in
    return null;
  }
  const mobile = matchMedia('(max-width: 991px)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xfff3e0, 2.2);
  key.position.set(5, 8, 7);
  key.castShadow = !mobile;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 6;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc6d4ff, 0.7);
  fill.position.set(-6, -2, 5);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 1.2);
  rim.position.set(-3, 5, -6);
  scene.add(rim);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const frames: ((t: number, dt: number) => void)[] = [];
  let visible = false, raf = 0, last = performance.now();
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    frames.forEach((f) => f(now / 1000, dt));
    renderer.render(scene, camera);
  };
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !visible) {
      visible = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    } else if (!e.isIntersecting && visible) {
      visible = false;
      cancelAnimationFrame(raf);
    }
  });
  io.observe(host);

  return {
    scene,
    camera,
    renderer,
    onFrame: (fn) => frames.push(fn),
    dispose: () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        mats.forEach((mat) => {
          Object.values(mat).forEach((v) => v instanceof THREE.Texture && v.dispose());
          mat.dispose();
        });
      });
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
