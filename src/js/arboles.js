import { arboles } from './datosArboles.js';

export function init() {
  console.log('✅ Módulo árboles cargado');
  renderArboles();
}

function renderArboles() {
  const tbody = document.getElementById('arboles-body');
  if (!tbody) {
    console.error('No se encontró el contenedor de árboles');
    return;
  }

  tbody.innerHTML = "";

  arboles.forEach(arbol => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${arbol.id}</td>
      <td>${arbol.especie}</td>
      <td>${arbol.ubicacion}</td>
      <td>${arbol.observaciones}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Ejecutar al cargar
init();
