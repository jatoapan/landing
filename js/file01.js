"use strict";

import { fetchFakerData } from "./functions.js";

() => {
  alert("Bienvenido!");
  console.log("Bienvenida mostrada.");
};

/**
 * Muestra el toast interactivo si existe en el DOM,
 * agregando la clase 'md:block' para hacerlo visible en pantallas medianas o mayores.
 *
 * @function
 * @returns {void} No retorna ningún valor.
 */
const showToast = () => {
  const toast = document.getElementById("toast-interactive");
  if (toast) {
    toast.classList.add("md:block");
  }
};

/**
 * Agrega un evento al botón con id 'demo' para abrir un video de YouTube en una nueva pestaña al hacer clic.
 *
 * @function
 * @returns {void} No retorna ningún valor.
 */
const showVideo = () => {
  const demo = document.getElementById("demo");
  if (demo) {
    demo.addEventListener("click", () => {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
    });
  }
};

const loadData = async () => {
  const url = "https://fakerapi.it/api/v2/texts?_quantity=10&_characters=120";

  try {
    const result = await fetchFakerData(url);

    if (result.success) {
      console.log("Datos obtenidos con éxito:", result.body);
      renderCards(result.body.data);
    } else {
      console.error("Error al obtener los datos:", result.error);
    }
  } catch (error) {
    console.error("Ocurrió un error inesperado:", error);
  }
};

const renderCards = (dataArray) => {
  const container = document.getElementById("skeleton-container");

  if (!container) {
    console.error("Container skeleton-container not found");
    return;
  }

  // Limpiar el contenedor
  container.innerHTML = "";

  // Iterar sobre los primeros 3 elementos
  const firstThree = dataArray.slice(0, 3);

  firstThree.forEach((item) => {
    const cardHTML = `
            <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-lg transition-shadow">
                <div class="w-full h-40 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                    <span class="text-white font-bold text-lg">${
                      item.genre || "Genre"
                    }</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                    ${item.title || "No Title"}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    by ${item.author || "Unknown Author"}
                </p>
                <div class="text-xs text-gray-500 dark:text-gray-500 line-clamp-3">
                    ${
                      item.content
                        ? item.content.substring(0, 100) + "..."
                        : "No content available"
                    }
                </div>
            </div>
        `;

    container.innerHTML += cardHTML;
  });
};

// Ejecutar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, starting data fetch...");
  loadData();
});