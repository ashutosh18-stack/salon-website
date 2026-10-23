import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
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
