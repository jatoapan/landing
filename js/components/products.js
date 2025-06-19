import { FirestoreService } from '../services/firestore-service.js';

export class Products {
  constructor(modal) {
    this.modal = modal;
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
          <div class="card-inner transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden bg-white cursor-pointer">
            <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" 
                 src="${product.imageUrl}" 
                 alt="${product.name}" />
            <div class="p-4">
              <div class="flex items-center justify-between">
                <p class="font-righteous text-base text-gray-700 text-justify mt-2">${product.name}</p>
              </div>
              <p class="font-righteous text-base text-gray-700 text-justify mb-2">$${product.price.toFixed(2)}</p>
            </div>
          </div>
        `;
        
        productElement.addEventListener('click', () => {
          this.modal.open(product.imageUrl, product.name);
        });
        
        container.appendChild(productElement);
        
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
      { collection: 'emotes', container: 'emotes-container' },
      { collection: 'overwal', container: 'overlays-container' },
      { collection: 'wallpaper', container: 'wallpapers-container' }
    ];

    for (const category of productCategories) {
      await this.renderProductCategory(category.collection, category.container);
    }
  }
}