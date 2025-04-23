import DibujoSector from './dibujoSector.js';
import { FormularioSector } from './formularioSector.js';

let map;
let dibujoSector;
let formularioSector;

export function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -31.4489, lng: -60.9311 },
        zoom: 14,
        styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
    });

    // Inicializar el formulario de sector
    formularioSector = new FormularioSector();

    // Inicializar el dibujador de sectores
    dibujoSector = new DibujoSector(map);

    // Escuchar evento de polígono completado
    document.addEventListener('poligonoCompletado', (event) => {
        const { center } = event.detail;
        formularioSector.setCoordenadas(center.lat, center.lng);
        formularioSector.mostrar();
    });

    // Manejar el botón de nuevo sector
    const botonNuevoSector = document.getElementById('nuevoSector');
    if (botonNuevoSector) {
        botonNuevoSector.addEventListener('click', () => {
            dibujoSector.startDrawing();
        });
    }

    console.log("Mapa cargado correctamente");
}

function calculatePolygonCenter(coordinates) {
    let lat = 0;
    let lng = 0;
    coordinates.forEach(point => {
        lat += point.lat;
        lng += point.lng;
    });
    return {
        lat: lat / coordinates.length,
        lng: lng / coordinates.length
    };
} 