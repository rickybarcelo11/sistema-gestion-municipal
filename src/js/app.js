import { FormularioSector } from './formularioSector.js';
import { init as initSectores } from './sectores.js';
import { init as initArboles } from './arboles.js';
import { init as initTrabajadores } from './trabajadores.js';
import { init as initInformes } from './informes.js';
import { api } from './api.js';
import DibujoSector from './dibujoSector.js';

console.log("✅ app.js cargado correctamente");

// Variables globales
let map;
let dibujoSector;
let formularioSector;
let sectoresPoda = [];
let sectoresCorte = [];


// Inicializar módulos
initSectores();
initArboles();
initTrabajadores();
initInformes();

// Inicializar formulario de sector
formularioSector = new FormularioSector();

// Manejar el botón de nuevo sector
const botonNuevoSector = document.getElementById('nuevoSector');
if (botonNuevoSector) {
    botonNuevoSector.addEventListener('click', () => {
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

// Inicializar el mapa
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -31.4489, lng: -60.9312 }, // Esperanza, Santa Fe
        zoom: 14,
        mapTypeId: 'roadmap'
    });

    dibujoSector = new DibujoSector(map);

    // Escuchar evento de polígono completado
    document.addEventListener('poligonoCompletado', (e) => {
        const { coordinates, center } = e.detail;
        formularioSector.setCoordenadas(center.lat, center.lng);
        formularioSector.mostrar();

        // Guardar las coordenadas en el formulario
        formularioSector.coordinates = coordinates;
    });

    // Escuchar evento de guardar sector
    document.addEventListener('sectorGuardado', async (event) => {
        try {
            const datosSector = event.detail;

            // Inyectar coordenadas del polígono al sector
            datosSector.coordenadas = formularioSector.coordinates;

            // Primero: guardar en backend
            const response = await api.postSector(datosSector);
            console.log('Sector guardado en backend:', response);

            // Segundo: dibujar el polígono en el mapa
            dibujarSectorEnMapa(datosSector);

            mostrarMensaje('Sector guardado correctamente', 'success');
        } catch (error) {
            mostrarError('Error al guardar el sector: ' + error.message);
        }
    });

    // Escuchar evento de cancelación de sector
    document.addEventListener('sectorCancelado', () => {
        console.log('Creación de sector cancelada');
        const event = new CustomEvent('limpiarDibujo');
        document.dispatchEvent(event);
    });
}

// Función para dibujar el sector en el mapa
function dibujarSectorEnMapa(sector) {
    if (!sector.coordenadas) {
        console.warn("⚠️ No hay coordenadas disponibles para dibujar el sector.");
        return;
    }

    const color = getColorPorEstado(sector.estado);

    const poligono = new google.maps.Polygon({
        paths: sector.coordenadas,
        strokeColor: color.stroke,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color.fill,
        fillOpacity: 0.35,
        map: map
    });

    const tipo = sector.tipoTarea.trim().toLowerCase();
    if (tipo.includes('poda')) {
        sectoresPoda.push(poligono);
    } else if (tipo.includes('corte')) {
        sectoresCorte.push(poligono);
    }
}


// Función para decidir colores según el estado operativo
function getColorPorEstado(estado) {
    switch (estado.toLowerCase()) {
        case 'pendiente':
            return { fill: '#ff4444', stroke: '#cc0000' };
        case 'en progreso':
            return { fill: '#ffbb33', stroke: '#ff8800' };
        case 'completado':
            return { fill: '#00C851', stroke: '#007E33' };
        default:
            return { fill: '#999999', stroke: '#666666' };
    }
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

// Ejecutar carga de Google Maps
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

// Inicializar el mapa cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // No hace falta volver a llamar initMap aquí
});

// Lógica del menú flotante
document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu-flotante');
    const toggleButton = document.getElementById('boton-toggle-menu');

    toggleButton.addEventListener('click', () => {
        menu.classList.toggle('visible');
    });

    // Checkboxes de visibilidad
    const checkboxPoda = document.getElementById('mostrarPoda');
    const checkboxCorte = document.getElementById('mostrarCorte');

    checkboxPoda.addEventListener('change', () => {
        sectoresPoda.forEach(poli => {
            poli.setMap(checkboxPoda.checked ? map : null);
        });
    });

    checkboxCorte.addEventListener('change', () => {
        sectoresCorte.forEach(poli => {
            poli.setMap(checkboxCorte.checked ? map : null);
        });
    });

    // Botón "Nuevo sector"
    const botonNuevoSector = document.getElementById('nuevoSectorBtn');
    if (botonNuevoSector) {
        botonNuevoSector.addEventListener('click', () => {
            const event = new CustomEvent('iniciarDibujoSector');
            document.dispatchEvent(event);
        });
    }
});

