# 3D asset sources (motion.md §2, §34)

No external models or textures are used. Every 3D object is built in code, so
there is no third-party licence to track.

| Asset | Source | Creator | License | Notes |
|---|---|---|---|---|
| Hardcover book (boards, rounded spine, page block, hinge) | `src/three/book.ts` | this project | project-owned | Covers painted at runtime by `src/data/covers.ts`; page-edge texture generated on a canvas |
| Printed mailer box with hinged lid and tuck flap | `src/three/mailerBox.ts` | this project | project-owned | Outside print and inside halftone generated on canvases |
| Bookmark / postcard props | `src/three/mailerBox.ts` | this project | project-owned | Simple PBR boxes |
| Environment lighting | `three/examples/jsm/environments/RoomEnvironment` | three.js authors | MIT | Used for PBR reflections only |
| Rounded box geometry | `three/examples/jsm/geometries/RoundedBoxGeometry` | three.js authors | MIT | |

Performance: shared WebGL stage, DPR capped (1.5 mobile / 2 desktop), shadows
disabled on mobile, render loop paused off-screen via IntersectionObserver,
three.js lazy-loaded only on pages that contain a scene.
