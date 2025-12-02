import apiClient from '../../../../api/apiClient.js';

const buildProduccionUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para operar en producción');
  }
  return `/api/admin/tiendas/${tiendaId}/produccion${suffix}`;
};

const buildStockIdealUrl = (tiendaId, suffix = '') => buildProduccionUrl(tiendaId, `/stock-ideal${suffix}`);
const buildRecetasUrl = (tiendaId, suffix = '') => buildProduccionUrl(tiendaId, `/recetas${suffix}`);
const buildConteosUrl = (tiendaId, suffix = '') => buildProduccionUrl(tiendaId, `/conteos-diarios${suffix}`);
const buildPlanesUrl = (tiendaId, suffix = '') => buildProduccionUrl(tiendaId, `/planes-produccion${suffix}`);

export const getStockIdeal = async (tiendaId, { sedeId, search } = {}) => {
  const params = {};
  if (sedeId) params.sedeId = sedeId;
  if (search) params.search = search;
  const { data } = await apiClient.get(buildStockIdealUrl(tiendaId), { params });
  return data;
};

export const createStockIdeal = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildStockIdealUrl(tiendaId), payload);
  return data;
};

export const updateStockIdeal = async (tiendaId, stockId, payload) => {
  if (!stockId) {
    throw new Error('stockId es requerido para actualizar');
  }
  const { data } = await apiClient.put(buildStockIdealUrl(tiendaId, `/${stockId}`), payload);
  return data;
};

export const deleteStockIdeal = async (tiendaId, stockId) => {
  if (!stockId) {
    throw new Error('stockId es requerido para eliminar');
  }
  await apiClient.delete(buildStockIdealUrl(tiendaId, `/${stockId}`));
};

export const getRecetas = async (tiendaId, { productoId } = {}) => {
  const params = {};
  if (productoId) params.productoId = productoId;
  const { data } = await apiClient.get(buildRecetasUrl(tiendaId), { params });
  return data;
};

export const createReceta = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildRecetasUrl(tiendaId), payload);
  return data;
};

export const updateReceta = async (tiendaId, recetaId, payload) => {
  if (!recetaId) {
    throw new Error('recetaId es requerido para actualizar');
  }
  const { data } = await apiClient.put(buildRecetasUrl(tiendaId, `/${recetaId}`), payload);
  return data;
};

export const deleteReceta = async (tiendaId, recetaId) => {
  if (!recetaId) {
    throw new Error('recetaId es requerido para eliminar');
  }
  await apiClient.delete(buildRecetasUrl(tiendaId, `/${recetaId}`));
};

export const getConteoDiario = async (tiendaId, { fecha, sedeId } = {}) => {
  const params = {};
  if (fecha) params.fecha = fecha;
  if (sedeId) params.sedeId = sedeId;
  const { data } = await apiClient.get(buildConteosUrl(tiendaId), { params });
  return data;
};

export const createConteoDiario = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildConteosUrl(tiendaId), payload);
  return data;
};

export const generatePlanProduccion = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildPlanesUrl(tiendaId), payload);
  return data;
};

export const getPlanChecklist = async (tiendaId, { fecha, sedeId } = {}) => {
  if (!fecha) {
    throw new Error('fecha es requerida para obtener el plan');
  }
  const params = {};
  if (sedeId) params.sedeId = sedeId;
  const { data } = await apiClient.get(buildPlanesUrl(tiendaId, `/${fecha}/detalles`), { params });
  return data;
};

export const updatePlanDetalle = async (tiendaId, detalleId, payload) => {
  if (!detalleId) {
    throw new Error('detalleId es requerido para actualizar');
  }
  const { data } = await apiClient.patch(buildPlanesUrl(tiendaId, `/detalles/${detalleId}`), payload);
  return data;
};

export const updatePlanEstado = async (tiendaId, planId, payload) => {
  if (!planId) {
    throw new Error('planId es requerido para actualizar el estado');
  }
  const { data } = await apiClient.patch(buildPlanesUrl(tiendaId, `/${planId}`), payload);
  return data;
};
