import apiClient from '../../../../api/apiClient.js';

const buildStockIdealUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar stock ideal');
  }
  return `/api/admin/tiendas/${tiendaId}/produccion/stock-ideal${suffix}`;
};

export const getStockIdeal = async (tiendaId, params = {}) => {
  const { data } = await apiClient.get(buildStockIdealUrl(tiendaId), { params });
  return data;
};

export const getStockIdealById = async (tiendaId, stockId) => {
  const { data } = await apiClient.get(buildStockIdealUrl(tiendaId, `/${stockId}`));
  return data;
};

export const postStockIdeal = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildStockIdealUrl(tiendaId), payload);
  return data;
};

export const putStockIdeal = async (tiendaId, stockId, payload) => {
  const { data } = await apiClient.put(buildStockIdealUrl(tiendaId, `/${stockId}`), payload);
  return data;
};

export const deleteStockIdeal = async (tiendaId, stockId) => {
  const { data } = await apiClient.delete(buildStockIdealUrl(tiendaId, `/${stockId}`));
  return data;
};
