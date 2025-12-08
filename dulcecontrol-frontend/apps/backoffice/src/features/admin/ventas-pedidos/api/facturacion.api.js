import apiClient from '../../../../api/apiClient.js';

const buildSeriesUrl = (tiendaId, suffix = '') => {
    if (!tiendaId) {
        throw new Error('tiendaId es requerido para facturación');
    }
    return `/api/admin/tiendas/${tiendaId}/facturacion/series${suffix}`;
};

const buildComprobantesUrl = (tiendaId, suffix = '') => {
    if (!tiendaId) {
        throw new Error('tiendaId es requerido para comprobantes');
    }
    return `/api/admin/tiendas/${tiendaId}/facturacion/comprobantes${suffix}`;
};

export const getSeriesPorSede = async (tiendaId, sedeId) => {
    if (!sedeId) {
        throw new Error('sedeId es requerido para listar series');
    }
    const { data } = await apiClient.get(buildSeriesUrl(tiendaId, `/sede/${sedeId}`));
    return data;
};

export const createComprobante = async (tiendaId, payload) => {
    const { data } = await apiClient.post(buildComprobantesUrl(tiendaId), payload);
    return data;
};

export const incrementarCorrelativoSerie = async (tiendaId, serieId) => {
    if (!serieId) {
        throw new Error('serieId es requerido para incrementar correlativo');
    }
    const { data } = await apiClient.post(buildSeriesUrl(tiendaId, `/${serieId}/incrementar-correlativo`));
    return data;
};
