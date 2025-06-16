import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

var firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const saveContact = async (contact) => {
  try {
    const contactRef = ref(database, "contact");
    const newContactRef = push(contactRef);

    const dataContact = {
      ...contact,
      timestamp: new Date().toISOString(),
    };

    await set(newContactRef, dataContact);

    return {
      success: true,
      body: dataContact,
    };
  } catch (error) {
    return {
      success: false,
      error: `Error al conectar a Firebase: ${error.message}`,
    };
  }
};

export { saveContact };
