import { sectores } from './datosSectores.js';

function setupEventListeners() {
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      renderSectores(button.dataset.type);
    });
  });
}

function renderSectores(tipo) {
  const sectoresList = document.getElementById('sectores-list');
  if (!sectoresList) {
    console.error('No se encontró el contenedor de sectores');
    return;
  }
  
  sectoresList.innerHTML = "";
  sectores
    .filter(sector => sector.tipo === tipo)
    .forEach(sector => {
      const card = document.createElement('div');
      card.className = "card";
      card.innerHTML = `
        <h3>${sector.nombre}</h3>
        <p>Tipo de tarea: ${sector.tipo === 'poda' ? 'Poda' : 'Corte de pasto'}</p>
      `;
      sectoresList.appendChild(card);
    });
}

export function init() {
  console.log("✅ sectores.js inicializado");
  setupEventListeners();
  renderSectores('poda');
}

// Llamar la inicialización inmediatamente
init();
