import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';

function copyStaticFolders() {
  return {
    name: 'copy-static-folders',
    closeBundle() {
      const folders = ['ezgif-2c89d6df11669799-jpg', 'images', 'men image', 'menstyles', 'fonts'];
      for (const folder of folders) {
        const src = resolve(import.meta.dirname, folder);
        const dest = resolve(import.meta.dirname, 'dist', folder);
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true });
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [copyStaticFolders()],
  server: {
    port: 5180,
    open: false
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        women: resolve(import.meta.dirname, 'women.html'),
        men: resolve(import.meta.dirname, 'men.html'),
        products: resolve(import.meta.dirname, 'products.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        contact: resolve(import.meta.dirname, 'contact.html'),
        booking: resolve(import.meta.dirname, 'booking.html'),
        services: resolve(import.meta.dirname, 'services.html'),
        lookbook: resolve(import.meta.dirname, 'lookbook.html'),
        story: resolve(import.meta.dirname, 'story.html'),
        artisans: resolve(import.meta.dirname, 'artisans.html'),
      }
    }
  }
});

