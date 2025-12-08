import apiClient from '../../../../api/apiClient.js';

const buildTableroUrl = (tiendaId) => {
    if (!tiendaId) {
        throw new Error('tiendaId es requerido');
    }
    return `/api/admin/tiendas/${tiendaId}/tablero`;
};

export const getEstadisticasTablero = async (tiendaId, sedeId = null) => {
    const params = sedeId ? { sedeId } : {};
    const { data } = await apiClient.get(`${buildTableroUrl(tiendaId)}/estadisticas`, { params });
    return data;
};
