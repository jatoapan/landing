"use strict";
/*
(() => {
    alert("¡Bienvenido a la página!");
    console.log("Mensaje de bienvenida mostrado.");
})();*/

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
        //A partir del tamano de md
        // classList es atributo de section
    }
};

const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

(() => {
    showToast();
    showVideo();
})();

import { saveVote } from './firebase.js';

function enableForm() {
  const form = document.getElementById('form_voting');
  if (!form) {
    console.warn("Formulario con id 'form_voting' no encontrado.");
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const input = document.getElementById('select_product');
    if (!input) {
      console.warn("Campo con id 'select_product' no encontrado.");
      return;
    }

    const productID = input.value.trim();
    if (productID === '') {
      alert("Por favor selecciona o escribe un producto.");
      return;
    }

    // Guardar el voto
    saveVote(productID).then(result => {
      console.log(result.message);
      alert(result.message);
      form.reset(); // Limpia el formulario después de enviar
    });
  });
}

// Autoejecución
enableForm();