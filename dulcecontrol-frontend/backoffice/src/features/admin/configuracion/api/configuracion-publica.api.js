import apiClient from '../../../../api/apiClient';

/**
 * API para gestionar la configuración pública de la tienda
 * (banner, mensaje, horarios, redes sociales, políticas)
 */

export const getConfiguracionPublica = async (tiendaId) => {
  const response = await apiClient.get(`/api/admin/tiendas/${tiendaId}/configuracion/publica`);
  return response.data;
};

export const updateConfiguracionPublica = async (tiendaId, data) => {
  const response = await apiClient.put(`/api/admin/tiendas/${tiendaId}/configuracion/publica`, data);
  return response.data;
};
