import apiClient from '../../../../api/apiClient.js';

const buildSedesUrl = (tiendaId) => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para listar sedes');
  }
  return `/api/admin/tiendas/${tiendaId}/configuracion/sedes`;
};

export const getSedesAsignadas = async (tiendaId) => {
  const { data } = await apiClient.get(buildSedesUrl(tiendaId));
  return data;
};
