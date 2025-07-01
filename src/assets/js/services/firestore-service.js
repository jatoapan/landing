import { firestore } from '../config/firebase-config.js';

export class FirestoreService {
  static firestoreCache = new Map();
  static CACHE_DURATION = 15 * 60 * 1000; 

  static async getCollection(collectionName) {
    try {

      if (this.firestoreCache.has(collectionName)) {
        const cachedData = this.firestoreCache.get(collectionName);
        const now = Date.now();
        
        if (now - cachedData.timestamp < this.CACHE_DURATION) {
          console.log(`✅ Firestore cache hit: ${collectionName}`);
          return cachedData.data;
        } else {
          this.firestoreCache.delete(collectionName);
        }
      }

      console.log(`🔄 Loading from Firestore: ${collectionName}`);
      const snapshot = await firestore.collection(collectionName).get();
      const items = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
      });

      this.firestoreCache.set(collectionName, {
        data: items,
        timestamp: Date.now()
      });

      return items;
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return [];
    }
  }

  static async addToCollection(collectionName, data) {
    try {
      const docRef = await firestore.collection(collectionName).add(data);
      
      this.firestoreCache.delete(collectionName);
      console.log(`🔄 Cache invalidated for: ${collectionName}`);
      
      return docRef.id;
    } catch (error) {
      console.error(`Error adding to ${collectionName}:`, error);
      throw error;
    }
  }

  static async addTestimony(name, message, rating, imageUrl, location) {
    const testimony = {
      name,
      message,
      rating,
      imageUrl,
      location,
      createdAt: new Date(),
      isApproved: false
    };

    return await this.addToCollection('testimonies', testimony);
  }

  static async getTestimonies() {
    const testimonies = await this.getCollection('testimonies');
    return testimonies.filter(testimony => testimony.isApproved);
  }

  static async getCategories() {
    return await this.getCollection('categories');
  }

  static async getProducts() {
    return await this.getCollection('products');
  }

  static async getChibis() {
    return await this.getCollection('chibis');
  }

  static async getOverwals() {
    return await this.getCollection('overwals');
  }

  static async getIcons() {
    return await this.getCollection('icons');
  }

  static async getEmotes() {
    return await this.getCollection('emotes');
  }

  static async getOnePiecePaintings() {
    return await this.getCollection('one-piece-paintings');
  }

  static clearFirestoreCache() {
    this.firestoreCache.clear();
    console.log('🧹 Firestore cache cleared');
  }
}