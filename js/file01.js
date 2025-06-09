"use strict";

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

(() => {
  showToast();
  showVideo();
})();
