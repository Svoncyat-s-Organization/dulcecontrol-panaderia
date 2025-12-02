import apiClient from '../../../../api/apiClient.js';

export const getSedes = async (tiendaId) => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para listar sedes');
  }
  const { data } = await apiClient.get(`/api/admin/tiendas/${tiendaId}/configuracion/sedes`);
  return data;
};
