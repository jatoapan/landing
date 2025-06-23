import { FirestoreService } from '../services/firestore-service.js';

export class Categories {
  static async render() {
    try {
      const categories = await FirestoreService.getCollection('categories');
      const container = document.getElementById('category-cards');
      if (!container) return;
      const categoryToSection = {
        'Chibi': 'chibis-container',
        'Emote': 'emotes-container',
        'Medio Cuerpo': 'half-body-container',
        'Cabeza': 'head-container',
        'Icono': 'icons-container',
        'One Piece': 'swiper-wrapper-2',
        'Overwal': 'overlays-container',
        'En Venta': 'paintings-container',
        'Semi Realista': 'semi-realistic-container',
        'Fondo de Pantalla': 'wallpapers-container',
        'Cuerpo Completo': 'whole-body-container'
      };
      categories.forEach((category, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add(
          'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
          'card-animate', 'opacity-0', 'transform', 'scale-75', 'rotate-12'
        );
        cardDiv.innerHTML = `
          <div class="category-card card-inner transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:rotate-2 rounded-2xl overflow-hidden cursor-pointer">
            <div class="overflow-hidden">
              <img class="w-full h-64 object-cover transition-all duration-500 hover:scale-110 hover:brightness-110" 
                   src="${category.imageUrl}" alt="${category.name}"/>
            </div>
            <div class="p-6" style="background: var(--bridal-heath);">
              <div class="flex items-center justify-between mb-2">
                <p class="font-righteous text-sm" style="color: var(--pigeon-post);">Categoría</p>
                <div class="w-2 h-2 rounded-full pulse-green"></div>
              </div>
              <h4 class="font-gaegu text-lg font-bold tracking-wide" style="color: var(--slate-gray-dark);">${category.name}</h4>
              <p class="font-righteous text-xs mt-2 opacity-75" style="color: var(--pigeon-post-light);">Click para ver productos →</p>
            </div>
          </div>
        `;
        // ...existing code...
        cardDiv.addEventListener('click', () => {
          const sectionId = categoryToSection[category.name];
          if (sectionId) {
            const targetElement = document.getElementById(sectionId);
            if (targetElement) {
              const navbarHeight = 120;
              const elementPosition = targetElement.offsetTop - navbarHeight;
              
              window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
              });
              targetElement.style.transition = 'all 0.3s ease';
              targetElement.style.transform = 'scale(1.02)';
              targetElement.style.boxShadow = '0 0 20px rgba(183, 211, 172, 0.4)';
              targetElement.style.backgroundColor = 'var(--bridal-heath)';
              targetElement.style.borderRadius = '0.5rem';
              setTimeout(() => {
                targetElement.style.transform = '';
                targetElement.style.boxShadow = '';
                targetElement.style.backgroundColor = '';
                targetElement.style.borderRadius = '';
              }, 1000);
            }
          }
        });
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