export class Modal {
  constructor() {
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    if (document.getElementById('image-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.className = 'fixed inset-0 flex items-center justify-center z-50 hidden';
    modal.style.background = 'rgba(112, 128, 144, 0.9)'; // primary con transparencia
    modal.innerHTML = `
      <div class="relative max-w-4xl max-h-full p-4 flex items-center justify-center">
        <div class="relative rounded-2xl overflow-hidden" 
             style="background: var(--background); border: 2px solid var(--neutral); box-shadow: 0 25px 50px rgba(112, 128, 144, 0.3);">
          <img id="modal-image" class="max-w-full max-h-full object-contain mx-auto" />
          
          <div class="absolute bottom-0 left-0 right-0 p-4 backdrop-blur-sm" 
               style="background: linear-gradient(to top, rgba(255, 250, 244, 0.95), transparent);">
            <h3 id="modal-title" class="font-gaegu text-lg font-bold mb-2" style="color: var(--primary);"></h3>
            <p class="font-righteous text-xs" style="color: var(--secondary);">Click fuera para cerrar</p>
          </div>
        </div>
        
        <button id="close-modal-btn" class="absolute top-2 right-2 text-2xl rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-90" 
                style="color: var(--background); background: var(--accent); box-shadow: 0 4px 15px rgba(183, 211, 172, 0.4);"
                onmouseover="this.style.background='var(--primary)'; this.style.boxShadow='0 6px 20px rgba(112, 128, 144, 0.4)'"
                onmouseout="this.style.background='var(--accent)'; this.style.boxShadow='0 4px 15px rgba(183, 211, 172, 0.4)'">×</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  bindEvents() {
    const closeBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('image-modal');
    closeBtn?.addEventListener('click', () => this.close());
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  open(imageUrl, imageName) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    if (modal && modalImage) {
      modalImage.src = imageUrl;
      modalImage.alt = imageName;
      modalTitle.textContent = imageName;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    const modal = document.getElementById('image-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }
}