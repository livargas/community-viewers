const fs = require('fs');
const path = require('path');

let data = [];
let currentIndex = 0;

// Cargar los datos del archivo JSON
function loadData() {
  try {
    const filePath = path.join(__dirname, 'data.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(fileData);
    console.log('Datos cargados:', data);
  } catch (err) {
    console.error('Error al cargar los datos:', err);
  }
}

// Función que se ejecuta antes de cada request
function setUserData(requestParams, context, ee, next) {
  if (data.length === 0) {
    loadData();
  }

  if (data.length > 0) {
    // Obtener el siguiente objeto del arreglo
    const userData = data[currentIndex];
    context.vars.userData = userData;

    // Imprimir los datos en la consola para depuración
    console.log('Enviando datos:', JSON.stringify(userData));

    // Incrementar el índice
    currentIndex = (currentIndex + 1) % data.length;
  } else {
    console.error('No hay datos disponibles para enviar');
    context.vars.userData = {}; // Asegurarse de que siempre haya algún dato
  }

  return next();  // Continuar con la ejecución de la request
}

module.exports = {
  setUserData
};
