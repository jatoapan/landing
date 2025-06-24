export class HeaderScroll {
  static init() {
    const header = document.querySelector('header');
    
    if (!header) {
      console.error('Header element not found');
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      HeaderScroll.updateScrollPadding();
    });

    resizeObserver.observe(header);
    HeaderScroll.updateScrollPadding();

    window.addEventListener('resize', HeaderScroll.updateScrollPadding);
    window.addEventListener('orientationchange', () => {
      setTimeout(HeaderScroll.updateScrollPadding, 300);
    });
  }

  static updateScrollPadding() {
    const header = document.querySelector('header');
    
    if (header) {
      const headerHeight = header.offsetHeight;
      const additionalPadding = 80;
      const totalPadding = headerHeight + additionalPadding;
      document.documentElement.style.scrollPaddingTop = `${totalPadding}px`;
      console.log(`Scroll padding updated: ${totalPadding}px (Header: ${headerHeight}px + ${additionalPadding}px)`);
    }
  }
}