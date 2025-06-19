const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
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

logoRef.getDownloadURL().then(function (url) {
  document.getElementById('header-logo').setAttribute('href', url);
  document.getElementById('header-logo-img').setAttribute('src', url);
  document.getElementById('footer-logo').setAttribute('src', url);
}).catch(function (error) {
  console.log('Error al obtener la URL del logo:', error);
});

aboutImgRef.getDownloadURL().then(function (url) {
  document.getElementById('about-img').setAttribute('src', url);
}).catch(function (error) {
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
    snapshot.forEach((doc, index) => {
      const data = doc.data();
      const categoryName = data.name;
      const imageUrl = data.imageUrl;
      
      const cardDiv = document.createElement('div');
      cardDiv.classList.add(
        'w-full',
        'md:w-1/3',
        'xl:w-1/4',
        'p-6',
        'flex',
        'flex-col',
        'card-animate',
        'opacity-0',
        'transform',
        'scale-75',
        'rotate-12'
      );
      cardDiv.innerHTML = `
        <div class="card-inner transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:rotate-3 rounded-2xl overflow-hidden bg-white cursor-pointer border border-gray-100">
          <div class="overflow-hidden">
            <img class="w-full h-64 object-cover transition-all duration-500 hover:scale-110 hover:brightness-110" 
                 src="${imageUrl}" alt="${categoryName}"/>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between mb-2">
              <p class="font-righteous text-sm text-gray-500">Categoría</p>
              <div class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            </div>
            <h4 class="font-gaegu text-lg font-bold tracking-wide text-gray-800">${categoryName}</h4>
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
    console.error('Error fetching categories from Firestore:', error);
  }
}

const getPaintingsForSaleFromStorage = async () => {
  const paintingsRef = storageRef.child('products/paintings-for-sale');
  const result = await paintingsRef.listAll();
  const imageUrls = [];
  for (let item of result.items) {
    const url = await item.getDownloadURL();
    imageUrls.push(url);
  }
  return imageUrls;
};

const uploadPaintingsToFirestore = async () => {
  const imageUrls = await getPaintingsForSaleFromStorage();
  const paintingsData = [
    { name: "Cuadro de Mandarinas", price: 30.00 },
    { name: "Cuadro de Pera", price: 30.00 },
    { name: "Cuadro de Tomates", price: 10.00 },
    { name: "Cuadro de Pollos", price: 60.00 },
    { name: "Cuadro de Ace", price: 20.00 }
  ];
  const paintingsCollection = firestore.collection('paintings-for-sale');
  for (let i = 0; i < imageUrls.length; i++) {
    const painting = paintingsData[i];
    const paintingObj = {
      name: painting.name,
      price: painting.price,
      imageUrl: imageUrls[i]
    };
    await paintingsCollection.add(paintingObj);
  }
};

const getPaintingsFromFirestore = async () => {
  const paintingsCollection = firestore.collection('paintings-for-sale');
  const snapshot = await paintingsCollection.get();
  const paintings = [];
  snapshot.forEach(doc => {
    paintings.push(doc.data());
  });
  return paintings;
};

const displayPaintings = async () => {
  const paintings = await getPaintingsFromFirestore();
  const container = document.getElementById('paintings-container');
  if (!document.getElementById('image-modal')) {
    createModal();
  }
  paintings.forEach((painting, index) => {
    const paintingElement = document.createElement('div');
    paintingElement.classList.add(
      'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', 'translate-y-8'
    );
    paintingElement.innerHTML = `
      <div class="card-inner transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden bg-white cursor-pointer">
        <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" 
             src="${painting.imageUrl}" 
             alt="${painting.name}" />
        <div class="p-4">
          <div class="flex items-center justify-between">
            <p class="font-righteous text-base text-gray-700 text-justify mt-2">${painting.name}</p>
          </div>
          <p class="font-righteous text-base text-gray-700 text-justify mb-2">$${painting.price.toFixed(2)}</p>
        </div>
      </div>
    `;
    paintingElement.addEventListener('click', () => {
      openModal(painting.imageUrl, painting.name);
    });
    container.appendChild(paintingElement);
    setTimeout(() => {
      paintingElement.classList.remove('opacity-0', 'translate-y-8');
      paintingElement.classList.add('opacity-100', 'translate-y-0');
    }, index * 150);
  });
};

const createModal = () => {
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
  const closeBtn = document.getElementById('close-modal-btn');
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
};

const openModal = (imageUrl, imageName) => {
  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  modalImage.src = imageUrl;
  modalImage.alt = imageName;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  const modal = document.getElementById('image-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

const getChibisFromStorage = async () => {
  const chibisRef = storageRef.child('products/chibis');
  const result = await chibisRef.listAll();
  const imageUrls = [];
  for (let item of result.items) {
    const url = await item.getDownloadURL();
    imageUrls.push(url);
  }
  return imageUrls;
};

const uploadChibisToFirestore = async () => {
  const imageUrls = await getChibisFromStorage();
  const chibisData = [
    { name: "Boceto", price: 2.00 },
    { name: "Blanco y Negro", price: 4.00 },
    { name: "Color Simple", price: 6.00 },
    { name: "Full Color", price: 8.00 }
  ];
  const chibisCollection = firestore.collection('chibis');
  for (let i = 0; i < imageUrls.length; i++) {
    const chibi = chibisData[i];
    const chibiObj = {
      name: chibi.name,
      price: chibi.price,
      imageUrl: imageUrls[i]
    };
    await chibisCollection.add(chibiObj);
  }
};

const getChibisFromFirestore = async () => {
  const chibisCollection = firestore.collection('chibis');
  const snapshot = await chibisCollection.get();
  const chibis = [];
  snapshot.forEach(doc => {
    chibis.push(doc.data());
  });
  return chibis;
};

const displayChibis = async () => {
  const chibis = await getChibisFromFirestore();
  const container = document.getElementById('chibis-container');
  chibis.forEach((chibi, index) => {
    const chibiElement = document.createElement('div');
    chibiElement.classList.add(
      'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', 'translate-y-8'
    );
    chibiElement.innerHTML = `
      <div class="card-inner transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden bg-white cursor-pointer">
        <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" 
             src="${chibi.imageUrl}" 
             alt="${chibi.name}" />
        <div class="p-4">
          <div class="flex items-center justify-between">
            <p class="font-righteous text-base text-gray-700 text-justify mt-2">${chibi.name}</p>
          </div>
          <p class="font-righteous text-base text-gray-700 text-justify mb-2">$${chibi.price.toFixed(2)}</p>
        </div>
      </div>
    `;
    chibiElement.addEventListener('click', () => {
      openModal(chibi.imageUrl, chibi.name);
    });
    container.appendChild(chibiElement);
    setTimeout(() => {
      chibiElement.classList.remove('opacity-0', 'translate-y-8');
      chibiElement.classList.add('opacity-100', 'translate-y-0');
    }, index * 150);
  });
};

const getHeadFromStorage = async () => {
  const headRef = storageRef.child('products/head');
  const result = await headRef.listAll();
  const imageUrls = [];
  for (let item of result.items) {
    const url = await item.getDownloadURL();
    imageUrls.push(url);
  }
  return imageUrls;
};

const uploadHeadToFirestore = async () => {
  const imageUrls = await getHeadFromStorage();
  const headData = [
    { name: "Boceto", price: 5.00 },
    { name: "Blanco y Negro", price: 7.00 },
    { name: "Color Simple", price: 9.00 },
    { name: "Full Color", price: 11.00 }
  ];
  const headCollection = firestore.collection('head');
  for (let i = 0; i < imageUrls.length; i++) {
    const head = headData[i];
    const headObj = {
      name: head.name,
      price: head.price,
      imageUrl: imageUrls[i]
    };
    await headCollection.add(headObj);
  }
};

const getHeadFromFirestore = async () => {
  const headCollection = firestore.collection('head');
  const snapshot = await headCollection.get();
  const heads = [];
  snapshot.forEach(doc => {
    heads.push(doc.data());
  });
  return heads;
};

const displayHead = async () => {
  const heads = await getHeadFromFirestore();
  const container = document.getElementById('head-container');
  heads.forEach((head, index) => {
    const headElement = document.createElement('div');
    headElement.classList.add(
      'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', 'translate-y-8'
    );
    headElement.innerHTML = `
      <div class="card-inner transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden bg-white cursor-pointer">
        <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" 
             src="${head.imageUrl}" 
             alt="${head.name}" />
        <div class="p-4">
          <div class="flex items-center justify-between">
            <p class="font-righteous text-base text-gray-700 text-justify mt-2">${head.name}</p>
          </div>
          <p class="font-righteous text-base text-gray-700 text-justify mb-2">$${head.price.toFixed(2)}</p>
        </div>
      </div>
    `;
    headElement.addEventListener('click', () => {
      openModal(head.imageUrl, head.name);
    });
    container.appendChild(headElement);
    setTimeout(() => {
      headElement.classList.remove('opacity-0', 'translate-y-8');
      headElement.classList.add('opacity-100', 'translate-y-0');
    }, index * 150);
  });
};

const getIconsFromStorage = async () => {
  const iconsRef = storageRef.child('products/icons');
  const result = await iconsRef.listAll();
  const imageUrls = [];
  for (let item of result.items) {
    const url = await item.getDownloadURL();
    imageUrls.push(url);
  }
  return imageUrls;
};

const uploadIconsToFirestore = async () => {
  const imageUrls = await getIconsFromStorage();
  const iconsData = [
    { name: "Icono 1", price: 5.00 },
    { name: "Icono 2", price: 5.00 },
    { name: "Icono 3", price: 5.00 },
    { name: "Icono 4", price: 5.00 }
  ];
  const iconsCollection = firestore.collection('icons');
  for (let i = 0; i < imageUrls.length; i++) {
    const icon = iconsData[i];
    const iconObj = {
      name: icon.name,
      price: icon.price,
      imageUrl: imageUrls[i]
    };

    await iconsCollection.add(iconObj);
  }
};

const getIconsFromFirestore = async () => {
  const iconsCollection = firestore.collection('icons');
  const snapshot = await iconsCollection.get();
  const icons = [];
  snapshot.forEach(doc => {
    icons.push(doc.data());
  });
  return icons;
};

const displayIcons = async () => {
  const icons = await getIconsFromFirestore();
  const container = document.getElementById('icons-container');
  icons.forEach((icon, index) => {
    const iconElement = document.createElement('div');
    iconElement.classList.add(
      'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', 'translate-y-8'
    );
    iconElement.innerHTML = `
      <div class="card-inner transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden bg-white cursor-pointer">
        <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" 
             src="${icon.imageUrl}" 
             alt="${icon.name}" />
        <div class="p-4">
          <div class="flex items-center justify-between">
            <p class="font-righteous text-base text-gray-700 text-justify mt-2">${icon.name}</p>
          </div>
          <p class="font-righteous text-base text-gray-700 text-justify mb-2">$${icon.price.toFixed(2)}</p>
        </div>
      </div>
    `;
    iconElement.addEventListener('click', () => {
      openModal(icon.imageUrl, icon.name);
    });
    container.appendChild(iconElement);
    setTimeout(() => {
      iconElement.classList.remove('opacity-0', 'translate-y-8');
      iconElement.classList.add('opacity-100', 'translate-y-0');
    }, index * 150);
  });
};

const getHalfBodyFromStorage = async () => {
  const halfBodyRef = storageRef.child('products/half-body');
  const result = await halfBodyRef.listAll();
  const imageUrls = [];
  for (let item of result.items) {
    const url = await item.getDownloadURL();
    imageUrls.push(url);
  }
  return imageUrls;
};

const uploadHalfBodyToFirestore = async () => {
  const imageUrls = await getHalfBodyFromStorage();
  const halfBodyData = [
    { name: "Boceto", price: 8.00 },
    { name: "Blanco y Negro", price: 10.00 },
    { name: "Color Simple", price: 12.00 },
    { name: "Full Color", price: 16.00 }
  ];
  const halfBodyCollection = firestore.collection('half-body');
  for (let i = 0; i < imageUrls.length; i++) {
    const halfBody = halfBodyData[i];
    const halfBodyObj = {
      name: halfBody.name,
      price: halfBody.price,
      imageUrl: imageUrls[i]
    };
    await halfBodyCollection.add(halfBodyObj);
  }
};

const getHalfBodyFromFirestore = async () => {
  const halfBodyCollection = firestore.collection('half-body');
  const snapshot = await halfBodyCollection.get();
  const halfBodyItems = [];
  snapshot.forEach(doc => {
    halfBodyItems.push(doc.data());
  });
  return halfBodyItems;
};

const displayHalfBody = async () => {
  const halfBodyItems = await getHalfBodyFromFirestore();
  const container = document.getElementById('half-body-container');
  halfBodyItems.forEach((item, index) => {
    const halfBodyElement = document.createElement('div');
    halfBodyElement.classList.add(
      'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', 'translate-y-8'
    );
    halfBodyElement.innerHTML = `
      <div class="card-inner transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden bg-white cursor-pointer">
        <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" 
             src="${item.imageUrl}" 
             alt="${item.name}" />
        <div class="p-4">
          <div class="flex items-center justify-between">
            <p class="font-righteous text-base text-gray-700 text-justify mt-2">${item.name}</p>
          </div>
          <p class="font-righteous text-base text-gray-700 text-justify mb-2">$${item.price.toFixed(2)}</p>
        </div>
      </div>
    `;
    halfBodyElement.addEventListener('click', () => {
      openModal(item.imageUrl, item.name);
    });
    container.appendChild(halfBodyElement);
    setTimeout(() => {
      halfBodyElement.classList.remove('opacity-0', 'translate-y-8');
      halfBodyElement.classList.add('opacity-100', 'translate-y-0');
    }, index * 150);
  });
};

const getWholeBodyFromStorage = async () => {
  const wholeBodyRef = storageRef.child('products/whole-body');
  const result = await wholeBodyRef.listAll();
  const imageUrls = [];
  for (let item of result.items) {
    const url = await item.getDownloadURL();
    imageUrls.push(url);
  }
  return imageUrls;
};

const uploadWholeBodyToFirestore = async () => {
  const imageUrls = await getWholeBodyFromStorage();
  const wholeBodyData = [
    { name: "Boceto", price: 10.00 },
    { name: "Blanco y Negro", price: 14.00 },
    { name: "Color Simple", price: 17.00 },
    { name: "Full Color", price: 20.00 }
  ];
  const wholeBodyCollection = firestore.collection('whole-body');
  for (let i = 0; i < imageUrls.length; i++) {
    const wholeBody = wholeBodyData[i];
    const wholeBodyObj = {
      name: wholeBody.name,
      price: wholeBody.price,
      imageUrl: imageUrls[i]
    };
    await wholeBodyCollection.add(wholeBodyObj);
  }
};

const getWholeBodyFromFirestore = async () => {
  const wholeBodyCollection = firestore.collection('whole-body');
  const snapshot = await wholeBodyCollection.get();
  const wholeBodyItems = [];
  snapshot.forEach(doc => {
    wholeBodyItems.push(doc.data());
  });
  return wholeBodyItems;
};

const displayWholeBody = async () => {
  const wholeBodyItems = await getWholeBodyFromFirestore();
  const container = document.getElementById('whole-body-container');
  wholeBodyItems.forEach((item, index) => {
    const wholeBodyElement = document.createElement('div');
    wholeBodyElement.classList.add(
      'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', 'translate-y-8'
    );
    wholeBodyElement.innerHTML = `
      <div class="card-inner transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden bg-white cursor-pointer">
        <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" 
             src="${item.imageUrl}" 
             alt="${item.name}" />
        <div class="p-4">
          <div class="flex items-center justify-between">
            <p class="font-righteous text-base text-gray-700 text-justify mt-2">${item.name}</p>
          </div>
          <p class="font-righteous text-base text-gray-700 text-justify mb-2">$${item.price.toFixed(2)}</p>
        </div>
      </div>
    `;
    wholeBodyElement.addEventListener('click', () => {
      openModal(item.imageUrl, item.name);
    });
    container.appendChild(wholeBodyElement);
    setTimeout(() => {
      wholeBodyElement.classList.remove('opacity-0', 'translate-y-8');
      wholeBodyElement.classList.add('opacity-100', 'translate-y-0');
    }, index * 150);
  });
};

const getEmotesFromStorage = async () => {
  const emotesRef = storageRef.child('products/emotes');
  const result = await emotesRef.listAll();
  const imageUrls = [];
  for (let item of result.items) {
    const url = await item.getDownloadURL();
    imageUrls.push(url);
  }
  return imageUrls;
};

const uploadEmotesToFirestore = async () => {
  const imageUrls = await getEmotesFromStorage();
  const emotesData = [
    { name: "Emote 1", price: 2.00 },
    { name: "Emote 2", price: 2.00 },
    { name: "Emote 3", price: 2.00 },
    { name: "Emote 4", price: 2.00 },
    { name: "Emote 5", price: 2.00 },
    { name: "Emote 6", price: 2.00 },
    { name: "Emote 7", price: 2.00 },
    { name: "Emote 8", price: 2.00 },
    { name: "Emote 9", price: 2.00 },
    { name: "Emote 10", price: 2.00 },
    { name: "Emote 11", price: 2.00 },
  ];
  const emotesCollection = firestore.collection('emotes');
  for (let i = 0; i < imageUrls.length; i++) {
    const emote = emotesData[i];
    const emoteObj = {
      name: emote.name,
      price: emote.price,
      imageUrl: imageUrls[i]
    };
    await emotesCollection.add(emoteObj);
  }
};

const getEmotesFromFirestore = async () => {
  const emotesCollection = firestore.collection('emotes');
  const snapshot = await emotesCollection.get();
  const emotesItems = [];
  snapshot.forEach(doc => {
    emotesItems.push(doc.data());
  });
  return emotesItems;
};

const displayEmotes = async () => {
  const emotesItems = await getEmotesFromFirestore();
  const container = document.getElementById('emotes-container');
  emotesItems.forEach((item, index) => {
    const emoteElement = document.createElement('div');
    emoteElement.classList.add(
      'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', 'translate-y-8'
    );
    emoteElement.innerHTML = `
      <div class="card-inner transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden bg-white cursor-pointer">
        <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" 
             src="${item.imageUrl}" 
             alt="${item.name}" />
        <div class="p-4">
          <div class="flex items-center justify-between">
            <p class="font-righteous text-base text-gray-700 text-justify mt-2">${item.name}</p>
          </div>
          <p class="font-righteous text-base text-gray-700 text-justify mb-2">$${item.price.toFixed(2)}</p>
        </div>
      </div>
    `;
    emoteElement.addEventListener('click', () => {
      openModal(item.imageUrl, item.name);
    });
    container.appendChild(emoteElement);
    setTimeout(() => {
      emoteElement.classList.remove('opacity-0', 'translate-y-8');
      emoteElement.classList.add('opacity-100', 'translate-y-0');
    }, index * 150);
  });
};

const getOverlaysFromStorage = async () => {
  const overlaysRef = storageRef.child('products/overwal');
  const result = await overlaysRef.listAll();
  const imageUrls = [];
  for (let item of result.items) {
    const url = await item.getDownloadURL();
    imageUrls.push(url);
  }
  return imageUrls;
};

const uploadOverlaysToFirestore = async () => {
  const imageUrls = await getOverlaysFromStorage();
  const overlaysData = [
    { name: "Overlay 1", price: 1.50 },
    { name: "Overlay 2", price: 1.50 },
    { name: "Overlay 3", price: 1.50 },
    { name: "Overlay 4", price: 1.50 },
    { name: "Overlay 5", price: 1.50 },
  ];
  const overlaysCollection = firestore.collection('overwal');
  for (let i = 0; i < imageUrls.length; i++) {
    const overlay = overlaysData[i];
    const overlayObj = {
      name: overlay.name,
      price: overlay.price,
      imageUrl: imageUrls[i]
    };
    await overlaysCollection.add(overlayObj);
  }
};

const getOverlaysFromFirestore = async () => {
  const overlaysCollection = firestore.collection('overwal');
  const snapshot = await overlaysCollection.get();
  const overlaysItems = [];
  snapshot.forEach(doc => {
    overlaysItems.push(doc.data());
  });
  return overlaysItems;
};

const displayOverlays = async () => {
  const overlaysItems = await getOverlaysFromFirestore();
  const container = document.getElementById('overlays-container');
  overlaysItems.forEach((item, index) => {
    const overlayElement = document.createElement('div');
    overlayElement.classList.add(
      'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', 'translate-y-8'
    );
    overlayElement.innerHTML = `
      <div class="card-inner transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden bg-white cursor-pointer">
        <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" 
             src="${item.imageUrl}" 
             alt="${item.name}" />
        <div class="p-4">
          <div class="flex items-center justify-between">
            <p class="font-righteous text-base text-gray-700 text-justify mt-2">${item.name}</p>
          </div>
          <p class="font-righteous text-base text-gray-700 text-justify mb-2">$${item.price.toFixed(2)}</p>
        </div>
      </div>
    `;
    overlayElement.addEventListener('click', () => {
      openModal(item.imageUrl, item.name);
    });
    container.appendChild(overlayElement);
    setTimeout(() => {
      overlayElement.classList.remove('opacity-0', 'translate-y-8');
      overlayElement.classList.add('opacity-100', 'translate-y-0');
    }, index * 150);
  });
};

const getWallpapersFromStorage = async () => {
  const wallpapersRef = storageRef.child('products/wallpaper');
  const result = await wallpapersRef.listAll();
  const imageUrls = [];
  for (let item of result.items) {
    const url = await item.getDownloadURL();
    imageUrls.push(url);
  }
  return imageUrls;
};

const uploadWallpapersToFirestore = async () => {
  const imageUrls = await getWallpapersFromStorage();
  const wallpapersData = [
    { name: "Fondo 1", price: 60.00 },
    { name: "Fondo 2", price: 30.00 },
    { name: "Fondo 3", price: 30.00 },
    { name: "Fondo 4", price: 60.00 }
  ];
  const wallpapersCollection = firestore.collection('wallpaper');
  for (let i = 0; i < imageUrls.length; i++) {
    const wallpaper = wallpapersData[i];
    const wallpaperObj = {
      name: wallpaper.name,
      price: wallpaper.price,
      imageUrl: imageUrls[i]
    };
    await wallpapersCollection.add(wallpaperObj);
  }
};

const getWallpapersFromFirestore = async () => {
  const wallpapersCollection = firestore.collection('wallpaper');
  const snapshot = await wallpapersCollection.get();
  const wallpapersItems = [];
  snapshot.forEach(doc => {
    wallpapersItems.push(doc.data());
  });
  return wallpapersItems;
};

const displayWallpapers = async () => {
  const wallpapersItems = await getWallpapersFromFirestore();
  const container = document.getElementById('wallpapers-container');
  wallpapersItems.forEach((item, index) => {
    const wallpaperElement = document.createElement('div');
    wallpaperElement.classList.add(
      'w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', 'translate-y-8'
    );
    wallpaperElement.innerHTML = `
      <div class="card-inner transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden bg-white cursor-pointer">
        <img class="w-full h-64 object-cover transition-transform duration-300 hover:scale-110" 
             src="${item.imageUrl}" 
             alt="${item.name}" />
        <div class="p-4">
          <div class="flex items-center justify-between">
            <p class="font-righteous text-base text-gray-700 text-justify mt-2">${item.name}</p>
          </div>
          <p class="font-righteous text-base text-gray-700 text-justify mb-2">$${item.price.toFixed(2)}</p>
        </div>
      </div>
    `;
    wallpaperElement.addEventListener('click', () => {
      openModal(item.imageUrl, item.name);
    });
    container.appendChild(wallpaperElement);
    setTimeout(() => {
      wallpaperElement.classList.remove('opacity-0', 'translate-y-8');
      wallpaperElement.classList.add('opacity-100', 'translate-y-0');
    }, index * 150);
  });
};

const getTestimoniesFromStorage = async () => {
  const testimoniesRef = storageRef.child('testimonies');
  const result = await testimoniesRef.listAll();
  const imageUrls = [];
  for (let item of result.items) {
    const url = await item.getDownloadURL();
    imageUrls.push(url);
  }
  return imageUrls;
};

const uploadTestimoniesToFirestore = async () => {
  const imageUrls = await getTestimoniesFromStorage();
  const testimonyData = [
    { title: "Title 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { title: "Title 2", description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
    { title: "Title 3", description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa." },
    { title: "Title 4", description: "At vero eos et accusamus et iusto odio dignissimos ducimus." },
    { title: "Title 5", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
  ];
  const testimoniesCollection = firestore.collection('testimonies');
  for (let i = 0; i < imageUrls.length; i++) {
    const testimony = testimonyData[i];
    const testimonyObj = {
      title: testimony.title,
      description: testimony.description,
      imageUrl: imageUrls[i],
    };
    await testimoniesCollection.add(testimonyObj);
  }
};

const getTestimoniesFromFirestore = async () => {
  const testimoniesCollection = firestore.collection('testimonies');
  const snapshot = await testimoniesCollection.get();
  const testimoniesItems = [];

  snapshot.forEach(doc => {
    testimoniesItems.push(doc.data());
  });

  return testimoniesItems;
};

const displayTestimonies = async () => {
  const testimoniesItems = await getTestimoniesFromFirestore();
  const container = document.getElementById('testimonies-container');
  testimoniesItems.forEach((item, index) => {
    const testimonyElement = document.createElement('div');
    testimonyElement.classList.add(
      'w-full', 'md:w-1/2', 'xl:w-1/3', 'p-6', 'flex', 'flex-col',
      'card-animate', 'opacity-0', 'transform', '-translate-x-full', 'rotate-y-90'
    );
    testimonyElement.innerHTML = `
      <div class="card-inner transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-rotate-1 rounded-2xl overflow-hidden bg-white cursor-pointer border border-gray-100">
        <div class="overflow-hidden">
          <img class="w-full h-64 object-cover transition-all duration-500 hover:scale-110 hover:sepia" 
               src="${item.imageUrl}" 
               alt="${item.title}"/>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-between mb-3">
            <p class="font-righteous text-sm text-gray-500">Testimonio</p>
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
          <h4 class="font-gaegu text-lg font-bold tracking-wide text-gray-800 mb-3">${item.title}</h4>
          <p class="font-righteous text-sm text-gray-600 text-justify leading-relaxed">${item.description}</p>
        </div>
      </div>
    `;
    testimonyElement.addEventListener('click', () => {
      openModal(item.imageUrl, item.title);
    });
    container.appendChild(testimonyElement);
    setTimeout(() => {
      testimonyElement.classList.remove('opacity-0', '-translate-x-full', 'rotate-y-90');
      testimonyElement.classList.add('opacity-100', 'translate-x-0', 'rotate-y-0');
    }, index * 250);
  });
};

const getSemiRealisticFromStorage = async () => {
  const semiRealisticRef = storageRef.child('products/semi-realistic');
  const result = await semiRealisticRef.listAll();
  const imageUrls = [];
  for (let item of result.items) {
    const url = await item.getDownloadURL();
    imageUrls.push(url);
  }
  return imageUrls;
};

const uploadSemiRealisticToFirestore = async () => {
  const imageUrls = await getSemiRealisticFromStorage();
  const semiRealisticData = [
    { name: "Semi Realista 1", price: 10.00 },
    { name: "Semi Realista 2", price: 20.00 },
    { name: "Semi Realista 3", price: 30.00 }
  ];
  const semiRealisticCollection = firestore.collection('semi-realistic');
  for (let i = 0; i < imageUrls.length; i++) {
    const semiRealistic = semiRealisticData[i];
    const semiRealisticObj = {
      name: semiRealistic.name,
      price: semiRealistic.price,
      imageUrl: imageUrls[i]
    };
    await semiRealisticCollection.add(semiRealisticObj);
  }
};

window.onload = function () {

};