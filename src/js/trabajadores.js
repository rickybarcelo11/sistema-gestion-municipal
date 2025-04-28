import { trabajadores } from './datosTrabajadores.js';

export function init() {
  console.log('✅ Módulo trabajadores cargado');
  renderTrabajadores();
}

function renderTrabajadores() {
  const tbody = document.getElementById('trabajadores-body');
  if (!tbody) {
    console.error('No se encontró el contenedor de trabajadores');
    return;
  }

  tbody.innerHTML = "";

  trabajadores.forEach(trabajador => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${trabajador.id}</td>
      <td>${trabajador.nombre}</td>
      <td>${trabajador.observaciones}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Ejecutar al cargar
init();
