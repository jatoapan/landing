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
      await StorageService.loadLogos();
      await StorageService.loadAboutImage();
      await Carousel.initVerticalCarousel();
      await Carousel.initHorizontalCarousel();
      await Categories.render();
      await this.products.renderAllProducts();
      await this.testimonies.render();
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }
}

window.addEventListener('load', () => {
  const app = new App();
  app.init();
});