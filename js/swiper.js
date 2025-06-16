var swiper1 = new Swiper(".vertical-slide-carousel-1", {
  loop: true,
  direction: "vertical",
  mousewheelControl: true,
  mousewheel: {
    releaseOnEdges: true,
  },
  spaceBetween: 30,
  grabCursor: true,
  pagination: {
    el: ".vertical-slide-carousel-1 .swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
});
var swiper = new Swiper(".centered-slide-carousel", {
  centeredSlides: true,
  paginationClickable: true,
  loop: true,
  spaceBetween: 30,
  slideToClickedSlide: true,
  pagination: {
    el: ".centered-slide-carousel .swiper-pagination",
    clickable: true,
  },
  mousewheelControl: true,
  mousewheel: {
    releaseOnEdges: true,
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    1280: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    640: {
      slidesPerView: 1,
      spaceBetween: 5,
    },
  },
});
