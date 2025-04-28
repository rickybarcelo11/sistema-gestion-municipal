export function init() {
    console.log('Módulo informes cargado');
} 

export const informes = {
    tareasRealizadas: 50,
    tareasAsignadas: 100,
    efectividadMensual: 80,
    tareasPorMes: {
      Enero: 25,
      Febrero: 30,
      Marzo: 45,
      Abril: 50
    },
    historialActividades: [
      { fecha: "2025-04-01", actividad: "Poda de árboles", sector: "Sector Norte" },
      { fecha: "2025-04-05", actividad: "Corte de pasto", sector: "Sector Sur" },
      { fecha: "2025-04-10", actividad: "Poda de ramas peligrosas", sector: "Sector Este" }
    ]
  };
  