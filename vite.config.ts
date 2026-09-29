import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

// Multi-page build: every page shares one Barba wrapper and boot script.
export default defineConfig({
  server: { port: 5190, strictPort: true },
  preview: { port: 5191 },
  build: {
    // three.js is the only large chunk; it is lazy-loaded by the home-page scenes.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        home: resolve(root, 'index.html'),
        courses: resolve(root, 'courses.html'),
        course: resolve(root, 'course.html'),
        gifting: resolve(root, 'gifting.html'),
        faq: resolve(root, 'faq.html'),
        login: resolve(root, 'login.html'),
        contact: resolve(root, 'contact.html'),
      },
    },
  },
});
