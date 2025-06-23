import { FirestoreService } from '../services/firestore-service.js';

export class Testimonies {
  constructor(modal) {
    this.modal = modal;
  }

  async render() {
    try {
      const testimonies = await FirestoreService.getCollection('testimonies');
      const container = document.getElementById('testimonies-container');
      if (!container) return;

      testimonies.forEach((testimony, index) => {
        const testimonyElement = document.createElement('div');
        testimonyElement.classList.add(
          'w-full', 'md:w-1/2', 'xl:w-1/3', 'p-6', 'flex', 'flex-col',
          'card-animate', 'opacity-0', 'transform', '-translate-x-full', 'rotate-y-90'
        );
        testimonyElement.innerHTML = `
          <div class="card-inner transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-rotate-1 rounded-2xl overflow-hidden cursor-pointer" style="background: var(--bridal-heath); border: 1px solid var(--chrome-white);">
            <div class="overflow-hidden">
              <img class="w-full h-64 object-cover transition-all duration-500 hover:scale-110 hover:sepia" 
                   src="${testimony.imageUrl}" 
                   alt="${testimony.title}"/>
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-3">
                <p class="font-righteous text-sm" style="color: var(--pigeon-post);">Testimonio</p>
                <div class="flex space-x-1">
                  <div class="w-2 h-2 rounded-full bounce-colors"></div>
                  <div class="w-2 h-2 rounded-full bounce-colors" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 rounded-full bounce-colors" style="animation-delay: 0.2s"></div>
                </div>
              </div>
              <h4 class="font-gaegu text-lg font-bold tracking-wide mb-3" style="color: var(--slate-gray-dark);">${testimony.title}</h4>
              <p class="font-righteous text-sm text-justify leading-relaxed" style="color: var(--pigeon-post-light);">${testimony.description}</p>
            </div>
          </div>
        `;
        testimonyElement.addEventListener('click', () => {
          this.modal.open(testimony.imageUrl, testimony.title);
        });
        container.appendChild(testimonyElement);
        setTimeout(() => {
          testimonyElement.classList.remove('opacity-0', '-translate-x-full', 'rotate-y-90');
          testimonyElement.classList.add('opacity-100', 'translate-x-0', 'rotate-y-0');
        }, index * 250);
      });
    } catch (error) {
      console.error('Error rendering testimonies:', error);
    }
  }
}