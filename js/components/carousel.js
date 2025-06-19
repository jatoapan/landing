import { StorageService } from '../services/storage-service.js';

export class Carousel {
  static async initVerticalCarousel() {
    try {
      const imageUrls = await StorageService.getProductImages('bars');
      const swiperWrapper = document.getElementById('swiper-wrapper');
      
      if (swiperWrapper) {
        swiperWrapper.innerHTML = '';
        
        imageUrls.forEach((url, index) => {
          const slideDiv = document.createElement('div');
          slideDiv.classList.add('swiper-slide');
          const slideContent = `
            <div class="bg-indigo-50 rounded-2xl h-96 flex justify-center items-center">
              <img src="${url}" alt="Slide ${index + 1}" class="w-full h-full object-cover object-center rounded-2xl" />
            </div>
          `;
          slideDiv.innerHTML = slideContent;
          swiperWrapper.appendChild(slideDiv);
        });

        new Swiper(".vertical-slide-carousel", {
          loop: imageUrls.length > 2, // ← ESTE ES EL CAMBIO CLAVE
          direction: "vertical",
          mousewheelControl: true,
          mousewheel: {
            releaseOnEdges: true,
          },
          spaceBetween: 30,
          grabCursor: true,
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          autoplay: {
            delay: 2500,
            disableOnInteraction: false,
          },
        });
      } else {
        console.error("No se encontró el contenedor para el primer carrusel.");
      }
    } catch (error) {
      console.error("Error al cargar las imágenes del primer carrusel:", error);
    }
  }

  static async initHorizontalCarousel() {
    try {
      const result = await StorageService.getProductImages('one-piece-paintings');
      const videoFiles = result.filter(url => url.includes('.mp4'));
      const swiperWrapper = document.getElementById('swiper-wrapper-2');
      
      if (swiperWrapper) {
        swiperWrapper.innerHTML = '';
        
        videoFiles.forEach((videoUrl, index) => {
          const slideDiv = document.createElement('div');
          slideDiv.classList.add('swiper-slide');
          slideDiv.innerHTML = `
            <div class="bg-indigo-50 rounded-2xl aspect-square flex justify-center items-center">
              <video class="h-full w-full object-cover rounded-2xl" autoplay loop muted style="pointer-events: none">
                <source src="${videoUrl}" type="video/mp4" />
              </video>
            </div>
          `;
          swiperWrapper.appendChild(slideDiv);
        });

        const secondCarouselSwiper = new Swiper(".centered-slide-carousel", {
          centeredSlides: true,
          paginationClickable: true,
          loop: videoFiles.length > 1, // Ya estaba bien
          spaceBetween: 30,
          slideToClickedSlide: true,
          pagination: {
            el: ".centered-slide-carousel .swiper-pagination",
            clickable: true,
          },
          mousewheel: {
            releaseOnEdges: true,
            enabled: true,
          },
          autoplay: {
            delay: 2500,
            disableOnInteraction: false,
          },
          breakpoints: {
            1280: { slidesPerView: 4, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 10 },
            640: { slidesPerView: 1, spaceBetween: 5 },
          },
          observer: true,
          observeParents: true,
        });
        secondCarouselSwiper.update();
      } else {
        console.error("No se encontró el contenedor para el segundo carrusel.");
      }
    } catch (error) {
      console.error("Error al cargar los videos del segundo carrusel:", error);
    }
  }
}