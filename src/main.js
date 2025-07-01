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
      // Inicializar header inmediatamente
      HeaderScroll.init();

      // Todo lo demás igual
      const preloadPromise = StorageService.preloadCriticalImages();
      
      await Promise.all([
        StorageService.loadLogos(),
        StorageService.loadAboutImage(),
        Carousel.initVerticalCarousel(),
        Carousel.initHorizontalCarousel(),
        Categories.render(),
        this.products.renderAllProducts(),
        this.testimonies.render()
      ]);

      await preloadPromise;
      console.log('🚀 App initialized successfully with caching');
    } catch (error) {
      console.error('❌ Error initializing app:', error);
    }
  }
}

// Solo este event listener
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});