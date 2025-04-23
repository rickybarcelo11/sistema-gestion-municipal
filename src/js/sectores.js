import { api } from './api.js';

export function init() {
    console.log("✅ sectores.js inicializado");
    cargarSectores();
    setupEventListeners();
}

function setupEventListeners() {
    // Escuchar eventos de actualización de sectores
    document.addEventListener('sectorGuardado', () => {
        cargarSectores();
    });
}

async function cargarSectores() {
    try {
        const sectores = await api.getSectores();
        mostrarSectores(sectores);
    } catch (error) {
        console.error('Error al cargar sectores:', error);
        mostrarError('No se pudieron cargar los sectores');
    }
}

function mostrarSectores(sectores) {
    const sectoresList = document.getElementById('sectoresList');
    if (!sectoresList) return;

    sectoresList.innerHTML = sectores.map(sector => `
        <div class="sector-card">
            <div class="sector-header">
                <h3>${sector.nombre}</h3>
                <span class="sector-estado ${sector.estado.toLowerCase()}">${sector.estado}</span>
            </div>
            <div class="sector-info">
                <p><strong>Tipo:</strong> ${sector.tipo}</p>
                <p><strong>Ubicación:</strong> ${sector.lat}, ${sector.lng}</p>
                <p><strong>Observaciones:</strong> ${sector.observaciones || 'Sin observaciones'}</p>
            </div>
        </div>
    `).join('');
}

function mostrarError(mensaje) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = mensaje;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
} 