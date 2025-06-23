import { storageRef } from '../config/firebase-config.js';

export class StorageService {
  static async getProductImages(category) {
    try {
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
      return await Promise.all(result.items.map(item => item.getDownloadURL()));
    } catch (error) {
      console.error(`Error getting ${category} images:`, error);
      return [];
    }
  }

  static async loadLogos() {
    try {
      const logoRef = storageRef.child('logo.png');
      const url = await logoRef.getDownloadURL();
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
      const url = await aboutImgRef.getDownloadURL();
      document.getElementById('about-img')?.setAttribute('src', url);
    } catch (error) {
      console.error('Error loading about image:', error);
    }
  }
}