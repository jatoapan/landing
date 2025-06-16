"use strict";

import { saveContact } from "./firebase.js";

let fetchFakerData = (url) => {
  return fetch(url)
    .then((response) => {
      // Verificar si la respuesta es exitosa (status 200-299)
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      // Respuesta exitosa
      return {
        success: true,
        body: data,
      };
    })
    .catch((error) => {
      return {
        success: false,
        error: `Error en la petición: ${error.message}`,
      };
    });
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^.{6,}@.+$/);
};

document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  data.timestamp = new Date().toISOString();

  saveContact(data);
  console.log("Datos a enviar al Firebase:", data);
});

export { fetchFakerData };
