import { FormularioSector } from './formularioSector.js';
import { init as initSectores } from './sectores.js';
import { init as initArboles } from './arboles.js';
import { init as initTrabajadores } from './trabajadores.js';
import { init as initInformes } from './informes.js';
import { api } from './api.js';
import { initMap } from './mapa.js';
import DibujoSector from './dibujoSector.js';

console.log("✅ app.js cargado correctamente");

// Inicializar módulos
initSectores();
initArboles();
initTrabajadores();
initInformes();

// Inicializar formulario de sector
const formularioSector = new FormularioSector();

// Manejar el botón de nuevo sector
const botonNuevoSector = document.getElementById('nuevoSector');
if (botonNuevoSector) {
    botonNuevoSector.addEventListener('click', () => {
        // Emitir evento para iniciar el dibujo
        const event = new CustomEvent('iniciarDibujoSector');
        document.dispatchEvent(event);
    });
}

// Función para mostrar errores
function mostrarError(mensaje) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = mensaje;
        errorDiv.style.display = 'block';
    }
    console.error(mensaje);
}

// Cargar Google Maps
function loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=drawing&callback=initMap`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
        mostrarError("❌ Error al cargar la API de Google Maps. Verifica tu conexión a internet.");
    };

    document.head.appendChild(script);
    window.initMap = initMap;
}

// Inicializar la aplicación
try {
    loadGoogleMapsScript();
} catch (error) {
    mostrarError("❌ Error al inicializar la aplicación: " + error.message);
}

// Actualizar estado
const status = document.getElementById('status');
if (status) {
    status.innerText = "✅ app.js está activo";
} else {
    console.error("❌ No se encontró el elemento #status");
}

// Manejar eventos del formulario
document.addEventListener('sectorGuardado', async (event) => {
    try {
        const response = await api.postSector(event.detail);
        console.log('Sector guardado:', response);
        mostrarMensaje('Sector guardado correctamente', 'success');
    } catch (error) {
        mostrarError('Error al guardar el sector: ' + error.message);
    }
});

document.addEventListener('sectorCancelado', () => {
    console.log('Creación de sector cancelada');
    // Limpiar el dibujo del mapa
    const event = new CustomEvent('limpiarDibujo');
    document.dispatchEvent(event);
});

// Función para mostrar mensajes de éxito
function mostrarMensaje(mensaje, tipo = 'success') {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.position = 'fixed';
    mensajeDiv.style.top = '20px';
    mensajeDiv.style.right = '20px';
    mensajeDiv.style.padding = '15px 25px';
    mensajeDiv.style.borderRadius = '8px';
    mensajeDiv.style.backgroundColor = tipo === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)';
    mensajeDiv.style.color = 'white';
    mensajeDiv.style.zIndex = '1000';
    mensajeDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.style.opacity = '0';
        mensajeDiv.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 500);
    }, 3000);
}

// Inicializar el mapa cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initMap();
});
