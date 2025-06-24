import { StorageService } from './assets/js/services/storage-service.js';
import { Carousel } from './assets/js/components/carousel.js';
import { HeaderScroll } from './assets/js/components/header.js';

class TermsApp {
  async init() {
    try {
      // Precargar imágenes críticas
      const preloadPromise = StorageService.preloadCriticalImages();
      
      // Cargar servicios en paralelo
      await Promise.all([
        StorageService.loadLogos(),
        StorageService.loadTermsImages(),
        Carousel.initVerticalCarousel(),
        HeaderScroll.init()
      ]);

      await preloadPromise;
      console.log('🚀 Terms page initialized successfully with caching');
    } catch (error) {
      console.error('❌ Error initializing terms page:', error);
    }
  }
}

window.addEventListener('load', () => {
  const app = new TermsApp();
  app.init();
});