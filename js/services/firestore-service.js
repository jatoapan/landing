import { firestore } from '../config/firebase-config.js';

export class FirestoreService {
  static async getCollection(collectionName) {
    try {
      const snapshot = await firestore.collection(collectionName).get();
      const items = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
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
      return docRef.id;
    } catch (error) {
      console.error(`Error adding to ${collectionName}:`, error);
      throw error;
    }
  }

  static async uploadCategories() {
    try {
      const StorageService = await import('../services/storage-service.js');
      const categoriesData = await StorageService.StorageService.getFirstImageUrls();
      const categories = [
        'Chibi', 'Emote', 'Medio Cuerpo', 'Cabeza', 'Icono', 'One Piece', 
        'Overwal', 'En Venta', 'Semi Realista', 'Fondo de Pantalla', 'Cuerpo Completo'
      ];
      for (let i = 0; i < categoriesData.length; i++) {
        const data = categoriesData[i];
        const categoryName = categories[i];
        if (data.imageUrl) {
          await this.addToCollection('categories', {
            name: categoryName,
            imageUrl: data.imageUrl
          });
        }
      }
    } catch (error) {
      console.error('Error uploading categories:', error);
    }
  }
}