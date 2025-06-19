export class Modal {
  constructor() {
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    if (document.getElementById('image-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden';
    modal.innerHTML = `
      <div class="relative max-w-4xl max-h-full p-4 flex items-center justify-center">
        <img id="modal-image" class="max-w-full max-h-full object-contain mx-auto" />
        <button id="close-modal-btn" class="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75">×</button>
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
    
    if (modal && modalImage) {
      modalImage.src = imageUrl;
      modalImage.alt = imageName;
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