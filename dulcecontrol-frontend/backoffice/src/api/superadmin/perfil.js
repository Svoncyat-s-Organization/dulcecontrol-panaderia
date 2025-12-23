import apiClient from '../apiClient';

const BASE_URL = '/api/v1/superadmin/perfil';

export const perfilSuperadminApi = {
  obtenerMiPerfil: async () => {
    const response = await apiClient.get(`${BASE_URL}/me`);
    return response.data;
  },

  actualizarMiPerfil: async (data) => {
    const response = await apiClient.put(`${BASE_URL}/me`, data);
    return response.data;
  },
};
