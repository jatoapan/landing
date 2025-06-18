const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();

const logoRef = storageRef.child('logo.png');
const barsRef = storageRef.child('bars');
const aboutImgRef = storageRef.child('me.png');
const videosRef = storageRef.child('products/one-piece-paintings');

async function getFirstImageUrls() {
  const categories = [
    'chibis', 'emotes', 'half-body', 'head', 'icons', 'one-piece-paintings', 'overwal', 'paintings-for-sale', 'semi-realistic', 'wallpaper', 'whole-body'
  ];
  const categoryData = [];
  for (let category of categories) {
    const categoryRef = storageRef.child(`products/${category}`);
    const files = await categoryRef.listAll();
    if (files.items.length > 0) {
      const firstImageRef = files.items[0];
      const url = await firstImageRef.getDownloadURL();
      console.log(`URL for ${category}: ${url}`);
      categoryData.push({
        category: category,
        imageUrl: url
      });
    } else {
      console.log(`No images in ${category} folder`);
    }
  }
  return categoryData;
}

async function uploadCategoriesToFirestore() {
  try {
    const categoriesData = await getFirstImageUrls();
    const categories = [
        'Chibi', 'Emote', 'Medio Cuerpo', 'Cabeza', 'Icono', 'One Piece', 'Overwal', 'En Venta', 'Semi Realista', 'Fondo de Pantalla', 'Cuerpo Completo'
    ];
    for (let i = 0; i < categoriesData.length; i++) {
      const data = categoriesData[i];
      const categoryName = categories[i];
      if (data.imageUrl) {
        const categoryRef = firestore.collection('categories').doc();
        await categoryRef.set({
          name: categoryName,
          imageUrl: data.imageUrl
        });
      } else {
        console.log(`No URL for category: ${categoryName}`);
      }
    }
    console.log('Categories uploaded successfully');
  } catch (error) {
    console.error('Error uploading categories to Firestore:', error);
  }
}

logoRef.getDownloadURL().then(function(url) {
  document.getElementById('header-logo').setAttribute('href', url);
  document.getElementById('header-logo-img').setAttribute('src', url);
}).catch(function(error) {
  console.log('Error al obtener la URL del logo:', error);
});

aboutImgRef.getDownloadURL().then(function(url) {
  document.getElementById('about-img').setAttribute('src', url);
}).catch(function(error) {
  console.log('Error al obtener la URL de la imagen de "me.png":', error);
});

async function loadSlidesFirstCarousel() {
  try {
    const result = await barsRef.listAll();
    const imageUrls = await Promise.all(result.items.map(item => item.getDownloadURL()));
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
        loop: true,
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

async function loadSlidesSecondCarousel() {
  try {
    const result = await videosRef.listAll();
    const videoFiles = result.items.filter(item => item.name.endsWith('.mp4'));
    const swiperWrapper = document.getElementById('swiper-wrapper-2');
    if (swiperWrapper) {
      swiperWrapper.innerHTML = '';
      await Promise.all(videoFiles.map(async (file, index) => {
        const videoUrl = await file.getDownloadURL();
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
      }));
        var secondCarouselSwiper = new Swiper(".centered-slide-carousel", {
        centeredSlides: true,
        paginationClickable: true, 
        loop: videoFiles.length > 1, 
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

async function renderCategories() {
  try {
    const snapshot = await firestore.collection('categories').get(); 
    const container = document.getElementById('category-cards');
    snapshot.forEach(doc => {
      const data = doc.data();
      const categoryName = data.name;
      const imageUrl = data.imageUrl;

      const cardDiv = document.createElement('div');
      cardDiv.classList.add('w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col');
      
      cardDiv.innerHTML = `
        <a href="#">
          <img class="hover:grow hover:shadow-lg w-full h-auto" src="${imageUrl}" alt="${categoryName}">
          <div class="pt-3 flex items-center justify-between">
            <p class="">Categoría</p>
          </div>
          <h2 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">${categoryName}</h2>
        </a>
      `;
      container.appendChild(cardDiv); 
    });
    console.log('Categories rendered successfully');
  } catch (error) {
    console.error('Error fetching categories from Firestore:', error);
  }
}

window.onload = function() {
  loadSlidesFirstCarousel();  
  renderCategories();   
  loadSlidesSecondCarousel(); 
};