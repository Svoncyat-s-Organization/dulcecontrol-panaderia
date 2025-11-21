import apiClient from '../../../../api/apiClient.js';

const buildInventarioProductosUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar inventario de productos');
  }
  return `/api/admin/tiendas/${tiendaId}/inventario/productos${suffix}`;
};

export const getInventarioProductos = async (tiendaId, params = {}) => {
  const { data } = await apiClient.get(buildInventarioProductosUrl(tiendaId), {
    params,
  });
  return data;
};

export const updateInventarioProducto = async (tiendaId, inventarioId, payload) => {
  const { data } = await apiClient.put(
    buildInventarioProductosUrl(tiendaId, `/${inventarioId}`),
    payload
  );
  return data;
};
