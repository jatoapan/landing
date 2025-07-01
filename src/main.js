import { StorageService } from './assets/js/services/storage-service.js';
import { Carousel } from './assets/js/components/carousel.js';
import { Categories } from './assets/js/components/categories.js';
import { Products } from './assets/js/components/products.js';
import { Testimonies } from './assets/js/components/testimonies.js';
import { Modal } from './assets/js/components/modal.js';
import { HeaderScroll } from './assets/js/components/header.js';
import { ContactForm } from './assets/js/components/contact-form.js';

class App {
  constructor() {
    this.modal = new Modal();
    this.products = new Products(this.modal);
    this.testimonies = new Testimonies(this.modal);
    this.contactForm = new ContactForm();
  }

  async init() {
    try {
      const preloadPromise = StorageService.preloadCriticalImages();
      
      const parallelPromises = [
        StorageService.loadLogos(),
        StorageService.loadAboutImage(),
        HeaderScroll.init()
      ];

      const componentPromises = [
        Carousel.initVerticalCarousel(),
        Carousel.initHorizontalCarousel(),
        Categories.render(),
        this.products.renderAllProducts(),
        this.testimonies.render()
      ];

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