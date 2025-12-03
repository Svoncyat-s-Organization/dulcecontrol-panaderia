import apiClient from '../apiClient';

const BASE_PATH = '/api/admin/tiendas';

export const getRolesByTiendaId = async (tiendaId) => {
    const response = await apiClient.get(`${BASE_PATH}/${tiendaId}/seguridad/roles`);
    return response.data;
};
