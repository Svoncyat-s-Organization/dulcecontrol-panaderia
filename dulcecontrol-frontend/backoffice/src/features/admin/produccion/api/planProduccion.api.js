import apiClient from '../../../../api/apiClient.js';

const buildPlanProduccionUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar planes de producción');
  }
  return `/api/admin/tiendas/${tiendaId}/produccion/planes-produccion${suffix}`;
};

const buildConteoDiarioUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar conteos diarios');
  }
  return `/api/admin/tiendas/${tiendaId}/produccion/conteos-diarios${suffix}`;
};

// ============ PLANES DE PRODUCCIÓN ============

export const getPlanesProduccion = async (tiendaId, params = {}) => {
  const { data } = await apiClient.get(buildPlanProduccionUrl(tiendaId), { params });
  return data;
};

export const getPlanByFecha = async (tiendaId, fecha, sedeId) => {
  const { data } = await apiClient.get(
    buildPlanProduccionUrl(tiendaId, `/${fecha}/detalles`),
    { params: { sedeId } }
  );
  return data;
};

export const postPlanProduccion = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildPlanProduccionUrl(tiendaId), payload);
  return data;
};

export const patchPlanProduccion = async (tiendaId, planId, payload) => {
  const { data } = await apiClient.patch(buildPlanProduccionUrl(tiendaId, `/${planId}`), payload);
  return data;
};

export const patchDetallePlan = async (tiendaId, detalleId, payload) => {
  const { data } = await apiClient.patch(
    buildPlanProduccionUrl(tiendaId, `/detalles/${detalleId}`),
    payload
  );
  return data;
};

// ============ CONTEOS DIARIOS ============

export const getConteosDiarios = async (tiendaId, params = {}) => {
  const { data } = await apiClient.get(buildConteoDiarioUrl(tiendaId), { params });
  return data;
};

export const getConteoByFecha = async (tiendaId, fecha, sedeId) => {
  const { data } = await apiClient.get(
    buildConteoDiarioUrl(tiendaId, `/${fecha}`),
    { params: { sedeId } }
  );
  return data;
};

export const postConteoDiario = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildConteoDiarioUrl(tiendaId), payload);
  return data;
};
