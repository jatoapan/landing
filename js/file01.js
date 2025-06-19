"use strict";
import { fetchFakerData } from "./functions.js";

const loadData = async () => {
  const url = "https://static.elfsight.com/platform/platform.js";

  try {
    const result = await fetchFakerData(url);

    if (result.success) {
      console.log("Datos obtenidos con éxito:", result.body);
    } else {
      console.error("Error al obtener los datos:", result.error);
    }
  } catch (error) {
    console.error("Ocurrió un error inesperado:", error);
  }
};
