import apiClient from '../../../../api/apiClient';

export const facturacionApi = {
    // --- Comprobantes ---
    listarComprobantes: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.tiendaId) params.append('tiendaId', filters.tiendaId);
        if (filters.estadoSunat) params.append('estadoSunat', filters.estadoSunat);
        if (filters.tipo) params.append('tipo', filters.tipo);

        const response = await apiClient.get(`/api/superadmin/facturacion/comprobantes?${params.toString()}`);
        return response.data;
    },

    obtenerComprobante: async (id) => {
        const response = await apiClient.get(`/api/superadmin/facturacion/comprobantes/${id}`);
        return response.data;
    },

    listarDetallesComprobante: async (id) => {
        const response = await apiClient.get(`/api/superadmin/facturacion/comprobantes/${id}/detalles`);
        return response.data;
    },

    // --- Series ---
    listarSeries: async () => {
        const response = await apiClient.get('/api/superadmin/facturacion/series');
        return response.data;
    },

    obtenerSerie: async (id) => {
        const response = await apiClient.get(`/api/superadmin/facturacion/series/${id}`);
        return response.data;
    },

    crearSerie: async (payload) => {
        const response = await apiClient.post('/api/superadmin/facturacion/series', payload);
        return response.data;
    },

    actualizarSerie: async (id, payload) => {
        const response = await apiClient.put(`/api/superadmin/facturacion/series/${id}`, payload);
        return response.data;
    },

    eliminarSerie: async (id) => {
        await apiClient.delete(`/api/superadmin/facturacion/series/${id}`);
    },

    // --- Métodos de Pago ---
    listarMetodosPago: async () => {
        const response = await apiClient.get('/api/superadmin/facturacion/metodos-pago');
        return response.data;
    },

    crearMetodoPago: async (payload) => {
        const response = await apiClient.post('/api/superadmin/facturacion/metodos-pago', payload);
        return response.data;
    },

    actualizarMetodoPago: async (id, payload) => {
        const response = await apiClient.put(`/api/superadmin/facturacion/metodos-pago/${id}`, payload);
        return response.data;
    },

    eliminarMetodoPago: async (id) => {
        await apiClient.delete(`/api/superadmin/facturacion/metodos-pago/${id}`);
    }
};
