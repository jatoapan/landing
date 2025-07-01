import { database } from '../config/firebase-config.js';

export class FirebaseService {
  static async saveContactMessage(messageData) {
    try {
      console.log('🔄 Intentando guardar mensaje...', messageData);
      
      const messagesRef = database.ref('contact_messages');
      const newMessageRef = messagesRef.push();
      
      const dataToSave = {
        ...messageData,
        timestamp: Date.now(),
        status: 'new',
        id: newMessageRef.key
      };
      
      await newMessageRef.set(dataToSave);
      
      console.log('✅ Mensaje guardado en Firebase Realtime Database con ID:', newMessageRef.key);
      return { success: true, id: newMessageRef.key };
    } catch (error) {
      console.error('❌ Error guardando mensaje:', error);
      throw error;
    }
  }
}