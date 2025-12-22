import apiClient from '../apiClient';

const BASE_URL = '/api/v1/admin/perfil';

export const perfilApi = {
  obtenerMiPerfil: async () => {
    const response = await apiClient.get(`${BASE_URL}/me`);
    return response.data;
  },

  actualizarMiPerfil: async (data) => {
    const response = await apiClient.put(`${BASE_URL}/me`, data);
    return response.data;
  },
};
