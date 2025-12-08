import apiClient from '../../../../api/apiClient.js';

const buildConfiguracionUrl = (tiendaId) => {
    if (!tiendaId) {
        throw new Error('tiendaId es requerido para obtener configuración');
    }
    return `/api/admin/tiendas/${tiendaId}/configuracion`;
};

export const getConfiguracionTienda = async (tiendaId) => {
    const { data } = await apiClient.get(buildConfiguracionUrl(tiendaId));
    return data;
};
