import apiClient from '../../../../api/apiClient.js';

const buildPaginasStorefrontUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar páginas storefront');
  }
  return `/api/admin/tiendas/${tiendaId}/paginas-storefront${suffix}`;
};

export const getPaginasStorefront = async (tiendaId) => {
  const { data } = await apiClient.get(buildPaginasStorefrontUrl(tiendaId));
  return data;
};

export const searchPaginasStorefront = async (tiendaId, busqueda) => {
  const params = busqueda ? { q: busqueda } : {};
  const { data } = await apiClient.get(buildPaginasStorefrontUrl(tiendaId, '/buscar'), { params });
  return data;
};

export const getPaginaStorefront = async (tiendaId, paginaId) => {
  const { data } = await apiClient.get(buildPaginasStorefrontUrl(tiendaId, `/${paginaId}`));
  return data;
};

export const createPaginaStorefront = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildPaginasStorefrontUrl(tiendaId), payload);
  return data;
};

export const updatePaginaStorefront = async (tiendaId, paginaId, payload) => {
  const { data } = await apiClient.put(buildPaginasStorefrontUrl(tiendaId, `/${paginaId}`), payload);
  return data;
};

export const deletePaginaStorefront = async (tiendaId, paginaId) => {
  const { data } = await apiClient.delete(buildPaginasStorefrontUrl(tiendaId, `/${paginaId}`));
  return data;
};