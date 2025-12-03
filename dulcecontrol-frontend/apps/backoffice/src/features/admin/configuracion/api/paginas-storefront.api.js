import apiClient from '../../../../api/apiClient';

/**
 * API para gestionar las páginas del storefront (CMS)
 */

export const getPaginasStorefront = async (tiendaId) => {
  const response = await apiClient.get(`/api/admin/tiendas/${tiendaId}/paginas-storefront`);
  return response.data;
};

export const getPaginaStorefront = async (tiendaId, paginaId) => {
  const response = await apiClient.get(`/api/admin/tiendas/${tiendaId}/paginas-storefront/${paginaId}`);
  return response.data;
};

export const createPaginaStorefront = async (tiendaId, data) => {
  const response = await apiClient.post(`/api/admin/tiendas/${tiendaId}/paginas-storefront`, data);
  return response.data;
};

export const updatePaginaStorefront = async (tiendaId, paginaId, data) => {
  const response = await apiClient.put(`/api/admin/tiendas/${tiendaId}/paginas-storefront/${paginaId}`, data);
  return response.data;
};

export const deletePaginaStorefront = async (tiendaId, paginaId) => {
  await apiClient.delete(`/api/admin/tiendas/${tiendaId}/paginas-storefront/${paginaId}`);
};

export const searchPaginasStorefront = async (tiendaId, query) => {
  const response = await apiClient.get(`/api/admin/tiendas/${tiendaId}/paginas-storefront/buscar`, {
    params: { q: query }
  });
  return response.data;
};
