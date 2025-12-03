import apiClient from '../../../../api/apiClient';

/**
 * API para gestionar el branding de la tienda (logo, favicon, colores)
 */

export const getBranding = async (tiendaId) => {
  const response = await apiClient.get(`/api/admin/tiendas/${tiendaId}/configuracion/branding`);
  return response.data;
};

export const updateBranding = async (tiendaId, data) => {
  const response = await apiClient.put(`/api/admin/tiendas/${tiendaId}/configuracion/branding`, data);
  return response.data;
};
