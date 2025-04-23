export default class DibujoSector {
    constructor(map, onPolygonComplete) {
        this.map = map;
        this.onPolygonComplete = onPolygonComplete;
        this.drawingManager = null;
        this.currentPolygon = null;
        this.initializeDrawingManager();
        this.setupEventListeners();
    }

    initializeDrawingManager() {
        this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: null, // Inicialmente no en modo dibujo
            drawingControl: false,
            polygonOptions: {
                fillColor: 'rgba(0, 255, 0, 0.3)',
                fillOpacity: 0.3,
                strokeColor: '#00ff00',
                strokeWeight: 2,
                clickable: false,
                editable: false,
                zIndex: 1
            }
        });

        this.drawingManager.setMap(this.map);

        // Capturar el evento de completar el dibujo
        google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
            if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                this.currentPolygon = event.overlay;
                this.drawingManager.setDrawingMode(null); // Desactivar modo dibujo
                
                // Obtener las coordenadas del polígono
                const path = this.currentPolygon.getPath();
                const coordinates = path.getArray().map(point => ({
                    lat: point.lat(),
                    lng: point.lng()
                }));

                // Calcular el centro del polígono
                const center = this.calculatePolygonCenter(coordinates);

                // Emitir evento con los datos del polígono
                const polygonEvent = new CustomEvent('poligonoCompletado', {
                    detail: {
                        coordinates,
                        center
                    }
                });
                document.dispatchEvent(polygonEvent);
            }
        });
    }

    setupEventListeners() {
        // Escuchar evento para iniciar dibujo
        document.addEventListener('iniciarDibujoSector', () => {
            this.startDrawing();
        });

        // Escuchar evento para limpiar dibujo
        document.addEventListener('limpiarDibujo', () => {
            this.cancelDrawing();
        });
    }

    calculatePolygonCenter(coordinates) {
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

    startDrawing() {
        if (this.currentPolygon) {
            this.cancelDrawing();
        }
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }

    cancelDrawing() {
        if (this.currentPolygon) {
            this.currentPolygon.setMap(null);
            this.currentPolygon = null;
        }
        this.drawingManager.setDrawingMode(null);
    }

    savePolygon(style = {
        fillColor: 'rgba(0, 255, 0, 0.3)',
        fillOpacity: 0.3,
        strokeColor: '#00ff00',
        strokeWeight: 2
    }) {
        if (this.currentPolygon) {
            this.currentPolygon.setOptions(style);
            this.currentPolygon.setEditable(false);
            this.drawingManager.setDrawingMode(null);
            return true;
        }
        return false;
    }
} 