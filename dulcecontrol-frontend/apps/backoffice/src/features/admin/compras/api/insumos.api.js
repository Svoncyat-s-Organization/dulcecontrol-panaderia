import apiClient from '../../../../api/apiClient.js';

const buildInsumosUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar insumos');
  }
  return `/api/admin/tiendas/${tiendaId}/compras/insumos${suffix}`;
};

export const getInsumos = async (tiendaId, soloActivos = null, stockBajo = null) => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para listar insumos');
  }
  
  const params = {};
  if (soloActivos !== null) params.soloActivos = soloActivos;
  if (stockBajo !== null) params.stockBajo = stockBajo;
  
  const { data } = await apiClient.get(buildInsumosUrl(tiendaId), { params });
  return data;
};

export const getInsumoById = async (tiendaId, insumoId) => {
  if (!tiendaId || !insumoId) {
    throw new Error('tiendaId e insumoId son requeridos');
  }
  const { data } = await apiClient.get(buildInsumosUrl(tiendaId, `/${insumoId}`));
  return data;
};

export const createInsumo = async (tiendaId, payload) => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para crear un insumo');
  }
  // El backend requiere tiendaId en el payload
  const { data } = await apiClient.post(buildInsumosUrl(tiendaId), {
    ...payload,
    tiendaId,
  });
  return data;
};

export const updateInsumo = async (tiendaId, insumoId, payload) => {
  if (!tiendaId || !insumoId) {
    throw new Error('tiendaId e insumoId son requeridos para actualizar');
  }
  const { data } = await apiClient.put(buildInsumosUrl(tiendaId, `/${insumoId}`), payload);
  return data;
};

export const deleteInsumo = async (tiendaId, insumoId) => {
  if (!tiendaId || !insumoId) {
    throw new Error('tiendaId e insumoId son requeridos para eliminar');
  }
  const { data } = await apiClient.delete(buildInsumosUrl(tiendaId, `/${insumoId}`));
  return data;
};
