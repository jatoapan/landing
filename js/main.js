import { StorageService } from './services/storage-service.js';
import { Carousel } from './components/carousel.js';
import { Categories } from './components/categories.js';
import { Products } from './components/products.js';
import { Testimonies } from './components/testimonies.js';
import { Modal } from './components/modal.js';

class App {
  constructor() {
    this.modal = new Modal();
    this.products = new Products(this.modal);
    this.testimonies = new Testimonies(this.modal);
  }

  async init() {
    try {
      // Cargar recursos básicos
      await StorageService.loadLogos();
      await StorageService.loadAboutImage();
      
      // Inicializar carruseles
      await Carousel.initVerticalCarousel();
      await Carousel.initHorizontalCarousel();
      
      // Renderizar componentes
      await Categories.render();
      await this.products.renderAllProducts();
      await this.testimonies.render();
      
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }
}

// Inicializar cuando el DOM esté listo
window.addEventListener('load', () => {
  const app = new App();
  app.init();
});