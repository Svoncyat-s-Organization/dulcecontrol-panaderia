import apiClient from '../../../../api/apiClient.js';

const buildRecetasUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar recetas');
  }
  return `/api/admin/tiendas/${tiendaId}/produccion/recetas${suffix}`;
};

// ============ RECETAS ============

export const getRecetas = async (tiendaId) => {
  const { data } = await apiClient.get(buildRecetasUrl(tiendaId));
  return data;
};

export const getRecetaById = async (tiendaId, recetaId) => {
  const { data } = await apiClient.get(buildRecetasUrl(tiendaId, `/${recetaId}`));
  return data;
};

export const postReceta = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildRecetasUrl(tiendaId), payload);
  return data;
};

export const putReceta = async (tiendaId, recetaId, payload) => {
  const { data } = await apiClient.put(buildRecetasUrl(tiendaId, `/${recetaId}`), payload);
  return data;
};

export const deleteReceta = async (tiendaId, recetaId) => {
  const { data } = await apiClient.delete(buildRecetasUrl(tiendaId, `/${recetaId}`));
  return data;
};
