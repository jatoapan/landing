import { storageRef } from '../config/firebase-config.js';

export class StorageService {
  // Cache en memoria para la sesión actual
  static imageCache = new Map();
  static CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

  // Cache persistente en localStorage
  static PERSISTENT_CACHE_KEY = 'kain_images_cache';
  static PERSISTENT_CACHE_VERSION = '1.0';
  static PERSISTENT_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

  static getLocalCache() {
    try {
      const cache = localStorage.getItem(this.PERSISTENT_CACHE_KEY);
      if (!cache) return {};
      
      const parsed = JSON.parse(cache);
      if (parsed.version !== this.PERSISTENT_CACHE_VERSION) {
        localStorage.removeItem(this.PERSISTENT_CACHE_KEY);
        return {};
      }
      
      return parsed.data || {};
    } catch (error) {
      console.error('Error reading persistent cache:', error);
      return {};
    }
  }

  static setLocalCache(data) {
    try {
      const cacheData = {
        version: this.PERSISTENT_CACHE_VERSION,
        data: data,
        lastUpdated: Date.now()
      };
      localStorage.setItem(this.PERSISTENT_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error writing persistent cache:', error);
    }
  }

  static async getImageWithCache(ref, cacheKey) {
    const now = Date.now();

    // 1. Verificar cache en memoria primero
    if (this.imageCache.has(cacheKey)) {
      const cachedData = this.imageCache.get(cacheKey);
      if (now - cachedData.timestamp < this.CACHE_DURATION) {
        console.log(`✅ Memory cache hit: ${cacheKey}`);
        return cachedData.url;
      } else {
        this.imageCache.delete(cacheKey);
      }
    }

    // 2. Verificar cache persistente
    const persistentCache = this.getLocalCache();
    if (persistentCache[cacheKey] && (now - persistentCache[cacheKey].timestamp < this.PERSISTENT_CACHE_DURATION)) {
      console.log(`💾 Persistent cache hit: ${cacheKey}`);
      const url = persistentCache[cacheKey].url;
      
      // Agregar a memoria para acceso rápido
      this.imageCache.set(cacheKey, { url, timestamp: now });
      return url;
    }

    // 3. Obtener de Firebase
    try {
      console.log(`🔄 Loading from Firebase: ${cacheKey}`);
      const url = await ref.getDownloadURL();
      
      // Guardar en ambos caches
      this.imageCache.set(cacheKey, { url, timestamp: now });
      persistentCache[cacheKey] = { url, timestamp: now };
      this.setLocalCache(persistentCache);
      
      return url;
    } catch (error) {
      console.error(`❌ Error loading image ${cacheKey}:`, error);
      throw error;
    }
  }

  static async getProductImages(category) {
    try {
      const cacheKey = `products_${category}`;
      
      // Verificar cache para arrays de imágenes
      if (this.imageCache.has(cacheKey)) {
        const cachedData = this.imageCache.get(cacheKey);
        const now = Date.now();
        if (now - cachedData.timestamp < this.CACHE_DURATION) {
          console.log(`✅ Array cache hit: ${cacheKey}`);
          return cachedData.urls;
        }
      }

      let path;
      if (category === 'bars') {
        path = 'bars'; 
      } else if (category === 'one-piece-paintings') {
        path = 'products/one-piece-paintings'; 
      } else {
        path = `products/${category}`;
      }
      
      const categoryRef = storageRef.child(path);
      const result = await categoryRef.listAll();
      const urls = await Promise.all(result.items.map(item => item.getDownloadURL()));
      
      // Cache del array completo
      this.imageCache.set(cacheKey, {
        urls: urls,
        timestamp: Date.now()
      });
      
      console.log(`🔄 Loaded array from Firebase: ${cacheKey} (${urls.length} items)`);
      return urls;
    } catch (error) {
      console.error(`Error getting ${category} images:`, error);
      return [];
    }
  }

  static async loadLogos() {
    try {
      const logoRef = storageRef.child('logo.png');
      const url = await this.getImageWithCache(logoRef, 'logo');
      
      document.getElementById('header-logo')?.setAttribute('href', url);
      document.getElementById('header-logo-img')?.setAttribute('src', url);
      document.getElementById('footer-logo')?.setAttribute('src', url);
    } catch (error) {
      console.error('Error loading logos:', error);
    }
  }

  static async loadAboutImage() {
    try {
      const aboutImgRef = storageRef.child('me.png');
      const url = await this.getImageWithCache(aboutImgRef, 'about_me');
      
      document.getElementById('about-img')?.setAttribute('src', url);
    } catch (error) {
      console.error('Error loading about image:', error);
    }
  }

  static async loadTermsImages() {
    try {
      const [yesImageUrl, noImageUrl, termsImageUrl] = await Promise.all([
        this.getImageWithCache(storageRef.child('terms/1.png'), 'terms_yes'),
        this.getImageWithCache(storageRef.child('terms/2.png'), 'terms_no'),
        this.getImageWithCache(storageRef.child('terms/3.png'), 'terms_conditions')
      ]);

      document.getElementById('yes-image')?.setAttribute('src', yesImageUrl);
      document.getElementById('no-image')?.setAttribute('src', noImageUrl);
      document.getElementById('thanks-image')?.setAttribute('src', termsImageUrl);
      
      console.log('Terms images loaded successfully');
    } catch (error) {
      console.error('Error loading terms images:', error);
    }
  }

  // Método para precargar imágenes críticas
  static async preloadCriticalImages() {
    const criticalImages = [
      { ref: storageRef.child('logo.png'), key: 'logo' },
      { ref: storageRef.child('me.png'), key: 'about_me' }
    ];

    try {
      await Promise.all(
        criticalImages.map(img => this.getImageWithCache(img.ref, img.key))
      );
      console.log('🚀 Critical images preloaded');
    } catch (error) {
      console.error('Error preloading critical images:', error);
    }
  }

  // Limpiar cache manualmente
  static clearCache() {
    this.imageCache.clear();
    localStorage.removeItem(this.PERSISTENT_CACHE_KEY);
    console.log('🧹 All caches cleared');
  }
}