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
  paintings.forEach(painting => {
    const paintingElement = document.createElement('div');
    paintingElement.classList.add('w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col');
    paintingElement.innerHTML = `
      <a href="#">
        <img class="hover:grow hover:shadow-lg w-full h-auto" src="${painting.imageUrl}" alt="${painting.name}" />
        <div class="pt-3 flex items-center justify-between">
          <p>${painting.name}</p>
          <svg class="h-6 w-6 fill-current text-gray-500 hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
          </svg>
        </div>
        <p class="pt-1 text-gray-900">$${painting.price.toFixed(2)}</p>
      </a>
    `;
    container.appendChild(paintingElement);
  });
};

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
  chibis.forEach(chibi => {
    const chibiElement = document.createElement('div');
    chibiElement.classList.add('w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col');
    chibiElement.innerHTML = `
      <a href="#">
        <img class="hover:grow hover:shadow-lg w-full h-auto" src="${chibi.imageUrl}" alt="${chibi.name}" />
        <div class="pt-3 flex items-center justify-between">
          <p>${chibi.name}</p>
          <svg class="h-6 w-6 fill-current text-gray-500 hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
          </svg>
        </div>
        <p class="pt-1 text-gray-900">$${chibi.price.toFixed(2)}</p>
      </a>
    `;
    container.appendChild(chibiElement);
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
  heads.forEach(head => {
    const headElement = document.createElement('div');
    headElement.classList.add('w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col');
    headElement.innerHTML = `
      <a href="#">
        <img class="hover:grow hover:shadow-lg w-full h-auto" src="${head.imageUrl}" alt="${head.name}" />
        <div class="pt-3 flex items-center justify-between">
          <p>${head.name}</p>
          <svg class="h-6 w-6 fill-current text-gray-500 hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
          </svg>
        </div>
        <p class="pt-1 text-gray-900">$${head.price.toFixed(2)}</p>
      </a>
    `;
    container.appendChild(headElement);
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
  icons.forEach(icon => {
    const iconElement = document.createElement('div');
    iconElement.classList.add('w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col');
    iconElement.innerHTML = `
      <a href="#">
        <img class="hover:grow hover:shadow-lg w-full h-auto" src="${icon.imageUrl}" alt="${icon.name}" />
        <div class="pt-3 flex items-center justify-between">
          <p>${icon.name}</p>
          <svg class="h-6 w-6 fill-current text-gray-500 hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
          </svg>
        </div>
        <p class="pt-1 text-gray-900">$${icon.price.toFixed(2)}</p>
      </a>
    `;
    container.appendChild(iconElement);
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
  halfBodyItems.forEach(item => {
    const halfBodyElement = document.createElement('div');
    halfBodyElement.classList.add('w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col');
    halfBodyElement.innerHTML = `
      <a href="#">
        <img class="hover:grow hover:shadow-lg w-full h-auto" src="${item.imageUrl}" alt="${item.name}" />
        <div class="pt-3 flex items-center justify-between">
          <p>${item.name}</p>
          <svg class="h-6 w-6 fill-current text-gray-500 hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
          </svg>
        </div>
        <p class="pt-1 text-gray-900">$${item.price.toFixed(2)}</p>
      </a>
    `;
    container.appendChild(halfBodyElement);
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
  wholeBodyItems.forEach(item => {
    const wholeBodyElement = document.createElement('div');
    wholeBodyElement.classList.add('w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col');
    wholeBodyElement.innerHTML = `
      <a href="#">
        <img class="hover:grow hover:shadow-lg w-full h-auto" src="${item.imageUrl}" alt="${item.name}" />
        <div class="pt-3 flex items-center justify-between">
          <p>${item.name}</p>
          <svg class="h-6 w-6 fill-current text-gray-500 hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
          </svg>
        </div>
        <p class="pt-1 text-gray-900">$${item.price.toFixed(2)}</p>
      </a>
    `;
    container.appendChild(wholeBodyElement);
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

// Función para mostrar los emotes en el HTML
const displayEmotes = async () => {
  const emotesItems = await getEmotesFromFirestore(); 
  const container = document.getElementById('emotes-container'); 
  emotesItems.forEach(item => {
    const emoteElement = document.createElement('div');
    emoteElement.classList.add('w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col');
    emoteElement.innerHTML = `
      <a href="#">
        <img class="hover:grow hover:shadow-lg w-full h-auto" src="${item.imageUrl}" alt="${item.name}" />
        <div class="pt-3 flex items-center justify-between">
          <p>${item.name}</p>
          <svg class="h-6 w-6 fill-current text-gray-500 hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
          </svg>
        </div>
        <p class="pt-1 text-gray-900">$${item.price.toFixed(2)}</p>
      </a>
    `;
    container.appendChild(emoteElement);
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
  overlaysItems.forEach(item => {
    const overlayElement = document.createElement('div');
    overlayElement.classList.add('w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col');
    overlayElement.innerHTML = `
      <a href="#">
        <img class="hover:grow hover:shadow-lg w-full h-auto" src="${item.imageUrl}" alt="${item.name}" />
        <div class="pt-3 flex items-center justify-between">
          <p>${item.name}</p>
          <svg class="h-6 w-6 fill-current text-gray-500 hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
          </svg>
        </div>
        <p class="pt-1 text-gray-900">$${item.price.toFixed(2)}</p>
      </a>
    `;
    container.appendChild(overlayElement);
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
  wallpapersItems.forEach(item => {
    const wallpaperElement = document.createElement('div');
    wallpaperElement.classList.add('w-full', 'md:w-1/3', 'xl:w-1/4', 'p-6', 'flex', 'flex-col');
    wallpaperElement.innerHTML = `
      <a href="#">
        <img class="hover:grow hover:shadow-lg w-full h-auto" src="${item.imageUrl}" alt="${item.name}" />
        <div class="pt-3 flex items-center justify-between">
          <p>${item.name}</p>
          <svg class="h-6 w-6 fill-current text-gray-500 hover:text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12,4.595c-1.104-1.006-2.512-1.558-3.996-1.558c-1.578,0-3.072,0.623-4.213,1.758c-2.353,2.363-2.352,6.059,0.002,8.412 l7.332,7.332c0.17,0.299,0.498,0.492,0.875,0.492c0.322,0,0.609-0.163,0.792-0.409l7.415-7.415 c2.354-2.354,2.354-6.049-0.002-8.416c-1.137-1.131-2.631-1.754-4.209-1.754C14.513,3.037,13.104,3.589,12,4.595z M18.791,6.205 c1.563,1.571,1.564,4.025,0.002,5.588L12,18.586l-6.793-6.793C3.645,10.23,3.646,7.776,5.205,6.209 c0.76-0.756,1.754-1.172,2.799-1.172s2.035,0.416,2.789,1.17l0.5,0.5c0.391,0.391,1.023,0.391,1.414,0l0.5-0.5 C14.719,4.698,17.281,4.702,18.791,6.205z" />
          </svg>
        </div>
        <p class="pt-1 text-gray-900">$${item.price.toFixed(2)}</p>
      </a>
    `;
    container.appendChild(wallpaperElement);
  });
};

/*
  loadSlidesFirstCarousel();
  loadSlidesSecondCarousel();
  renderCategories();
  displayPaintings();
  displayChibis();
  displayHead();
  displayIcons();
  displayHalfBody();
  displayWholeBody();
  displayEmotes();
  displayOverlays();
  displayWallpapers();
*/

window.onload = function() {
  loadSlidesFirstCarousel();
  loadSlidesSecondCarousel();
  renderCategories();
  displayPaintings();
  displayChibis();
  displayHead();
  displayIcons();
  displayHalfBody();
  displayWholeBody();
  displayEmotes();
  displayOverlays();
  displayWallpapers();
};