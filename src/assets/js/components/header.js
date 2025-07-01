export class HeaderScroll {
  static cachedHeader = null;
  static lastHeight = 0;
  static isUpdating = false;

  static init() {
    // Cache del header una sola vez
    this.cachedHeader = document.querySelector('header');
    
    if (!this.cachedHeader) {
      console.error('Header element not found');
      return;
    }

    // Debounce para evitar ejecuciones excesivas
    const debouncedUpdate = this.debounce(() => {
      this.updateScrollPadding();
    }, 100);

    const resizeObserver = new ResizeObserver(debouncedUpdate);
    resizeObserver.observe(this.cachedHeader);
    this.updateScrollPadding();

    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', () => {
      setTimeout(debouncedUpdate, 300);
    });
  }

  static updateScrollPadding() {
    // Evitar múltiples actualizaciones simultáneas
    if (this.isUpdating || !this.cachedHeader) return;
    
    this.isUpdating = true;

    // Usar requestAnimationFrame para mejor rendimiento
    requestAnimationFrame(() => {
      const headerHeight = this.cachedHeader.offsetHeight;
      
      // Solo actualizar si cambió la altura
      if (headerHeight === this.lastHeight) {
        this.isUpdating = false;
        return;
      }

      this.lastHeight = headerHeight;
      const additionalPadding = 80;
      const totalPadding = headerHeight + additionalPadding;
      document.documentElement.style.scrollPaddingTop = `${totalPadding}px`;
      console.log(`Scroll padding updated: ${totalPadding}px (Header: ${headerHeight}px + ${additionalPadding}px)`);
      
      this.isUpdating = false;
    });
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}