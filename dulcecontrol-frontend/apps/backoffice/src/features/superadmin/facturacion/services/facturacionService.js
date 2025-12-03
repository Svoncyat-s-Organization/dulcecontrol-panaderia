import apiClient from '../../../../api/apiClient.js';

const BASE_URL = '/api/superadmin/facturacion';

/**
 * Servicio para el Módulo de Facturación del Superadmin
 */
export const facturacionService = {

    // --- COMPROBANTES ---

    /**
     * Lista los comprobantes de todas las tiendas (o filtrado)
     * @param {object} filters { tiendaId, estadoSunat, tipo }
     */
    listarComprobantes: async (filters = {}) => {
        const { data } = await apiClient.get(`${BASE_URL}/comprobantes`, { params: filters });
        return data;
    },

    /**
     * Obtiene el detalle de un comprobante
     * @param {number} id 
     */
    obtenerComprobante: async (id) => {
        const { data } = await apiClient.get(`${BASE_URL}/comprobantes/${id}`);
        return data;
    },

    /**
     * Lista los detalles (items) de un comprobante
     * @param {number} comprobanteId 
     */
    listarDetallesComprobante: async (comprobanteId) => {
        const { data } = await apiClient.get(`${BASE_URL}/comprobantes/${comprobanteId}/detalles`);
        return data;
    },

    // --- SERIES ---

    /**
     * Lista las series configuradas para el Superadmin
     */
    listarSeries: async () => {
        const { data } = await apiClient.get(`${BASE_URL}/series`);
        return data;
    },

    /**
     * Obtiene una serie por ID
     * @param {number} id 
     */
    obtenerSerie: async (id) => {
        const { data } = await apiClient.get(`${BASE_URL}/series/${id}`);
        return data;
    },

    /**
     * Crea una nueva serie
     * @param {object} payload 
     */
    crearSerie: async (payload) => {
        const { data } = await apiClient.post(`${BASE_URL}/series`, payload);
        return data;
    },

    /**
     * Actualiza una serie existente
     * @param {number} id 
     * @param {object} payload 
     */
    actualizarSerie: async (id, payload) => {
        const { data } = await apiClient.put(`${BASE_URL}/series/${id}`, payload);
        return data;
    },

    /**
     * Elimina una serie
     * @param {number} id 
     */
    eliminarSerie: async (id) => {
        await apiClient.delete(`${BASE_URL}/series/${id}`);
    }
};
