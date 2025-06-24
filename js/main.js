import { StorageService } from './services/storage-service.js';
import { Carousel } from './components/carousel.js';
import { Categories } from './components/categories.js';
import { Products } from './components/products.js';
import { Testimonies } from './components/testimonies.js';
import { Modal } from './components/modal.js';
import { HeaderScroll } from './components/header.js';

class App {
  constructor() {
    this.modal = new Modal();
    this.products = new Products(this.modal);
    this.testimonies = new Testimonies(this.modal);
  }

  async init() {
    try {
      // Precargar imágenes críticas primero
      const preloadPromise = StorageService.preloadCriticalImages();
      
      // Cargar en paralelo otros servicios no críticos
      const parallelPromises = [
        StorageService.loadLogos(),
        StorageService.loadAboutImage(),
        HeaderScroll.init()
      ];

      // Inicializar carruseles y components
      const componentPromises = [
        Carousel.initVerticalCarousel(),
        Carousel.initHorizontalCarousel(),
        Categories.render(),
        this.products.renderAllProducts(),
        this.testimonies.render()
      ];

      // Ejecutar en fases para optimizar la percepción de velocidad
      await Promise.all(parallelPromises);
      await Promise.all(componentPromises);
      await preloadPromise;

      console.log('🚀 App initialized successfully with caching');
    } catch (error) {
      console.error('❌ Error initializing app:', error);
    }
  }
}

window.addEventListener('load', () => {
  const app = new App();
  app.init();
});