import { FirestoreService } from '../services/firestore-service.js';

export class Categories {
  static async render() {
    try {
      const categories = await FirestoreService.getCollection('categories');
      const container = document.getElementById('category-cards');
      
      if (!container) return;

      categories.forEach((category, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add(
          'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
          'card-animate', 'opacity-0', 'transform', 'scale-75', 'rotate-12'
        );
        
        cardDiv.innerHTML = `
          <div class="card-inner transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:rotate-3 rounded-2xl overflow-hidden bg-white cursor-pointer border border-gray-100">
            <div class="overflow-hidden">
              <img class="w-full h-64 object-cover transition-all duration-500 hover:scale-110 hover:brightness-110" 
                   src="${category.imageUrl}" alt="${category.name}"/>
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <p class="font-righteous text-sm text-gray-500">Categoría</p>
                <div class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              </div>
              <h4 class="font-gaegu text-lg font-bold tracking-wide text-gray-800">${category.name}</h4>
            </div>
          </div>
        `;
        
        container.appendChild(cardDiv);
        
        setTimeout(() => {
          cardDiv.classList.remove('opacity-0', 'scale-75', 'rotate-12');
          cardDiv.classList.add('opacity-100', 'scale-100', 'rotate-0');
        }, index * 200);
      });
    } catch (error) {
      console.error('Error rendering categories:', error);
    }
  }
}