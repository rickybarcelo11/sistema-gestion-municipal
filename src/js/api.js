export const api = {
    async getSectores() {
        console.log('Obteniendo sectores...');
        // Simulación de respuesta
        return [];
    },

    async postSector(data) {
        console.log('Creando nuevo sector:', data);
        // Simulación de respuesta
        return { id: Date.now(), ...data };
    },

    async putSector(id, data) {
        console.log(`Actualizando sector ${id}:`, data);
        // Simulación de respuesta
        return { id, ...data };
    },

    async deleteSector(id) {
        console.log(`Eliminando sector ${id}`);
        // Simulación de respuesta
        return { success: true };
    }
}; 