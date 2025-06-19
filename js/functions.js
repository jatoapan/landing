"use strict";

import { saveContact } from "./firebase.js";

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

  if (validateEmail) {
    saveContact(data);
    console.log("Datos a enviar al Firebase:", data);
  } else {
    console.error("Email no válido");
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
