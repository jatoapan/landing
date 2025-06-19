import { storageRef } from '../config/firebase-config.js';

export class StorageService {
  static async loadLogos() {
    try {
      const logoRef = storageRef.child('logo.png');
      const url = await logoRef.getDownloadURL();
      document.getElementById('header-logo').setAttribute('href', url);
      document.getElementById('header-logo-img').setAttribute('src', url);
      document.getElementById('footer-logo').setAttribute('src', url);
    } catch (error) {
      console.error('Error loading logos:', error);
    }
  }

  static async loadAboutImage() {
    try {
      const aboutImgRef = storageRef.child('me.png');
      const url = await aboutImgRef.getDownloadURL();
      document.getElementById('about-img').setAttribute('src', url);
    } catch (error) {
      console.error('Error loading about image:', error);
    }
  }

  static async getProductImages(category) {
    try {
      const categoryRef = storageRef.child(`products/${category}`);
      const result = await categoryRef.listAll();
      return await Promise.all(result.items.map(item => item.getDownloadURL()));
    } catch (error) {
      console.error(`Error getting ${category} images:`, error);
      return [];
    }
  }

  static async getFirstImageUrls() {
    const categories = [
      'chibis', 'emotes', 'half-body', 'head', 'icons', 'one-piece-paintings', 
      'overwal', 'paintings-for-sale', 'semi-realistic', 'wallpaper', 'whole-body'
    ];
    const categoryData = [];
    for (let category of categories) {
      const categoryRef = storageRef.child(`products/${category}`);
      const files = await categoryRef.listAll();
      if (files.items.length > 0) {
        const url = await files.items[0].getDownloadURL();
        categoryData.push({ category, imageUrl: url });
      }
    }
    return categoryData;
  }
}