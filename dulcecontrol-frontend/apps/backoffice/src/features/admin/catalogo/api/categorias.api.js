import apiClient from '../../../../api/apiClient.js';

const buildCategoriasUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar categorías');
  }
  return `/api/admin/tiendas/${tiendaId}/catalogo/categorias${suffix}`;
};

export const getCategorias = async (tiendaId) => {
  const { data } = await apiClient.get(buildCategoriasUrl(tiendaId));
  return data;
};

export const createCategoria = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildCategoriasUrl(tiendaId), payload);
  return data;
};

export const updateCategoria = async (tiendaId, categoriaId, payload) => {
  const { data } = await apiClient.put(buildCategoriasUrl(tiendaId, `/${categoriaId}`), payload);
  return data;
};

export const deleteCategoria = async (tiendaId, categoriaId) => {
  const { data } = await apiClient.delete(buildCategoriasUrl(tiendaId, `/${categoriaId}`));
  return data;
};
