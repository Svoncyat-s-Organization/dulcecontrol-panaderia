import apiClient from '../../../../api/apiClient.js';

const buildConfiguracionUrl = (tiendaId) => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar configuración');
  }
  return `/api/admin/tiendas/${tiendaId}/configuracion`;
};

export const getConfiguracionTienda = async (tiendaId) => {
  const { data } = await apiClient.get(buildConfiguracionUrl(tiendaId));
  return data;
};

export const updateConfiguracionTienda = async (tiendaId, payload) => {
  const { data } = await apiClient.put(buildConfiguracionUrl(tiendaId), payload);
  return data;
};