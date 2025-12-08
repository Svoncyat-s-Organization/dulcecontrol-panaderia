import apiClient from '../../../../api/apiClient.js';

export const getEstadisticasTableroSuperadmin = async () => {
    const { data } = await apiClient.get('/api/superadmin/tablero/estadisticas');
    return data;
};
