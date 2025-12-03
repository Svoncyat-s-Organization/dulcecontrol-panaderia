import apiClient from '../../../../api/apiClient.js';

const BASE_URL = '/api/admin/tiendas';

/**
 * Servicio para el Módulo de Facturación
 */
export const facturacionApi = {
    /**
     * Crea un nuevo pedido (Cabecera de venta)
     * @param {number} tiendaId 
     * @param {object} payload 
     */
    crearPedido: async (tiendaId, payload) => {
        const { data } = await apiClient.post(`${BASE_URL}/${tiendaId}/ventas/pedidos`, payload);
        return data;
    },

    /**
     * Agrega un detalle (producto) al pedido
     * @param {number} tiendaId 
     * @param {number} pedidoId 
     * @param {object} payload 
     */
    agregarDetallePedido: async (tiendaId, pedidoId, payload) => {
        const { data } = await apiClient.post(`${BASE_URL}/${tiendaId}/ventas/pedidos/${pedidoId}/detalles`, payload);
        return data;
    },

    /**
     * Crea el comprobante de pago (Factura/Boleta)
     * @param {number} tiendaId 
     * @param {object} payload 
     */
    crearComprobante: async (tiendaId, payload) => {
        const { data } = await apiClient.post(`${BASE_URL}/${tiendaId}/facturacion/comprobantes`, payload);
        return data;
    },

    /**
     * Lista los comprobantes de la tienda con filtros opcionales
     * @param {number} tiendaId 
     * @param {object} filters { fechaInicio, fechaFin, tipo, estado, serieId, clienteNumeroDoc }
     */
    listarComprobantes: async (tiendaId, filters = {}) => {
        const { data } = await apiClient.get(`${BASE_URL}/${tiendaId}/facturacion/comprobantes`, { params: filters });
        return data;
    },

    /**
     * Obtiene el detalle de un comprobante
     * @param {number} tiendaId 
     * @param {number} comprobanteId 
     */
    obtenerComprobante: async (tiendaId, comprobanteId) => {
        const { data } = await apiClient.get(`${BASE_URL}/${tiendaId}/facturacion/comprobantes/${comprobanteId}`);
        return data;
    },

    /**
     * Registra el envío a SUNAT (o simula la validación)
     * @param {number} tiendaId 
     * @param {number} comprobanteId 
     * @param {object} payload { codigoHash, xmlUrl, cdrUrl, pdfUrl }
     */
    registrarEnvioSunat: async (tiendaId, comprobanteId, payload) => {
        const { data } = await apiClient.post(`${BASE_URL}/${tiendaId}/facturacion/comprobantes/${comprobanteId}/enviar-sunat`, payload);
        return data;
    },

    /**
     * Actualiza el estado SUNAT manualmente
     * @param {number} tiendaId 
     * @param {number} comprobanteId 
     * @param {object} payload { estadoSunat, codigoRespuesta, descripcionRespuesta }
     */
    actualizarEstadoSunat: async (tiendaId, comprobanteId, payload) => {
        const { data } = await apiClient.patch(`${BASE_URL}/${tiendaId}/facturacion/comprobantes/${comprobanteId}/estado-sunat`, payload);
        return data;
    },

    /**
     * Lista las series activas de una tienda
     * @param {number} tiendaId 
     */
    listarSeriesActivas: async (tiendaId) => {
        const { data } = await apiClient.get(`${BASE_URL}/${tiendaId}/facturacion/series/activas`);
        return data;
    },

    /**
     * Busca clientes por nombre o documento
     * @param {number} tiendaId 
     * @param {string} query 
     */
    buscarClientes: async (tiendaId, query) => {
        // Asumiendo que existe un endpoint de búsqueda de clientes en el módulo de clientes
        // Si no existe un endpoint de búsqueda específico, se puede usar el listado con filtros
        const { data } = await apiClient.get(`${BASE_URL}/${tiendaId}/clientes/clientes`, {
            params: { busqueda: query }
        });
        return data;
    },

    // --- SERIES Y CORRELATIVOS ---

    listarSeries: async (tiendaId) => {
        const { data } = await apiClient.get(`${BASE_URL}/${tiendaId}/facturacion/series`);
        return data;
    },

    crearSerie: async (tiendaId, payload) => {
        const { data } = await apiClient.post(`${BASE_URL}/${tiendaId}/facturacion/series`, payload);
        return data;
    },

    actualizarSerie: async (tiendaId, serieId, payload) => {
        const { data } = await apiClient.put(`${BASE_URL}/${tiendaId}/facturacion/series/${serieId}`, payload);
        return data;
    },

    eliminarSerie: async (tiendaId, serieId) => {
        await apiClient.delete(`${BASE_URL}/${tiendaId}/facturacion/series/${serieId}`);
    },

    desactivarSerie: async (tiendaId, serieId) => {
        await apiClient.put(`${BASE_URL}/${tiendaId}/facturacion/series/${serieId}/desactivar`);
    },

    activarSerie: async (tiendaId, serieId) => {
        await apiClient.put(`${BASE_URL}/${tiendaId}/facturacion/series/${serieId}/activar`);
    }
};
