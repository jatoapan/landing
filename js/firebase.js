import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js';
import { getDatabase, ref, push, set, get, child } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js';

// js/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, get } from 'firebase/database';

// Configuración usando variables de entorno definidas en .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * Guarda un voto en la colección "votes"
 * @param {string} productID - El ID del producto votado
 * @returns {Promise<{message: string}>}
 */
export function saveVote(productID) {
  const votesRef = ref(database, 'votes'); // Referencia a la colección 'votes'
  const newVoteRef = push(votesRef);       // Nueva referencia para un voto de usuario

  const voteData = {
    productID: productID,
    date: new Date().toISOString()
  };

  // Guardar el voto en la base de datos
  return set(newVoteRef, voteData)
    .then(() => {
      return { message: '✅ Voto guardado correctamente' };
    })
    .catch((error) => {
      return { message: `❌ Error al guardar el voto: ${error.message}` };
    });
}

/**
 * Obtiene todos los votos de la colección "votes"
 * @returns {Promise<object|null>} - Los votos guardados o null si no hay datos
 */
export async function getVotes() {
  const votesRef = ref(database, 'votes'); // Referencia a la colección 'votes'

  try {
    const snapshot = await get(votesRef);  // Obtener los datos de la colección
    if (snapshot.exists()) {
      return snapshot.val();  // Devolver los datos si existen
    } else {
      return null;  // Si no hay datos, devolver null
    }
  } catch (error) {
    console.error('Error al obtener los votos:', error);
    return null;
  }
}
