import apiClient from '../../../../api/apiClient.js';

const buildProductosUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar productos');
  }
  return `/api/admin/tiendas/${tiendaId}/catalogo/productos${suffix}`;
};

export const getProductos = async (tiendaId, params = {}) => {
  const { data } = await apiClient.get(buildProductosUrl(tiendaId), { params });
  return data;
};

export const getProductoById = async (tiendaId, productoId) => {
  const { data } = await apiClient.get(buildProductosUrl(tiendaId, `/${productoId}`));
  return data;
};

export const postProducto = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildProductosUrl(tiendaId), payload);
  return data;
};

export const putProducto = async (tiendaId, productoId, payload) => {
  const { data } = await apiClient.put(buildProductosUrl(tiendaId, `/${productoId}`), payload);
  return data;
};

export const deleteProducto = async (tiendaId, productoId) => {
  const { data } = await apiClient.delete(buildProductosUrl(tiendaId, `/${productoId}`));
  return data;
};
