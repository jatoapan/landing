import { FirestoreService } from '../services/firestore-service.js';

export class Products {
  constructor(modal) {
    this.modal = modal;
    this.lazyObserver = null;
    this.initLazyLoading();
  }

  initLazyLoading() {
    this.lazyObserver = new IntersectionObserver(
      (entries) => this.handleLazyLoad(entries),
      {
        rootMargin: '100px', // Cargar 100px antes de ser visible
        threshold: 0.1
      }
    );
  }

  handleLazyLoad(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const actualSrc = img.dataset.src;
        
        if (actualSrc) {
          img.src = actualSrc;
          img.classList.remove('lazy-loading');
          img.classList.add('lazy-loaded');
          this.lazyObserver.unobserve(img);
        }
      }
    });
  }

  async renderProductCategory(collectionName, containerId) {
    try {
      const products = await FirestoreService.getCollection(collectionName);
      const container = document.getElementById(containerId);
      if (!container) return;

      products.forEach((product, index) => {
        const productElement = document.createElement('div');
        productElement.classList.add(
          'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
          'card-animate', 'opacity-0', 'transform', 'translate-y-8'
        );
        
        productElement.innerHTML = `
          <div class="product-card card-inner transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden cursor-pointer">
            <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110 lazy-loading" 
                 src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%236b7280'%3ECargando...%3C/text%3E%3C/svg%3E"
                 data-src="${product.imageUrl}" 
                 alt="${product.name}" />
            <div class="p-4" style="background: var(--background);">
              <div class="flex items-center justify-between">
                <p class="font-righteous text-base font-bold text-justify mt-2" style="color: var(--primary);">${product.name}</p>
              </div>
              <p class="font-righteous text-base font-bold text-justify mb-2" style="color: var(--accent);">$${product.price.toFixed(2)}</p>
            </div>
          </div>
        `;

        productElement.addEventListener('click', () => {
          this.modal.open(product.imageUrl, product.name);
        });

        container.appendChild(productElement);

        // Observar imagen para lazy loading
        const img = productElement.querySelector('img[data-src]');
        if (img) {
          this.lazyObserver.observe(img);
        }

        setTimeout(() => {
          productElement.classList.remove('opacity-0', 'translate-y-8');
          productElement.classList.add('opacity-100', 'translate-y-0');
        }, index * 150);
      });
    } catch (error) {
      console.error(`Error rendering ${collectionName}:`, error);
    }
  }

  async renderAllProducts() {
    const productCategories = [
      { collection: 'paintings-for-sale', container: 'paintings-container' },
      { collection: 'chibis', container: 'chibis-container' },
      { collection: 'head', container: 'head-container' },
      { collection: 'icons', container: 'icons-container' },
      { collection: 'half-body', container: 'half-body-container' },
      { collection: 'whole-body', container: 'whole-body-container' },
      { collection: 'semi-realistic', container: 'semi-realistic-container' },
      { collection: 'emotes', container: 'emotes-container' },
      { collection: 'overwal', container: 'overlays-container' },
      { collection: 'wallpaper', container: 'wallpapers-container' }
    ];
    for (const category of productCategories) {
      await this.renderProductCategory(category.collection, category.container);
    }
  }
}