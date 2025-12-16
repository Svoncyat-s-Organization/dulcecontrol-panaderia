import apiClient from '../../../../api/apiClient.js';

const buildPagosUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar pagos');
  }
  return `/api/admin/tiendas/${tiendaId}/compras/pagos${suffix}`;
};

export const registrarPago = async (tiendaId, pagoData) => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para registrar pago');
  }
  const { data } = await apiClient.post(buildPagosUrl(tiendaId), pagoData);
  return data;
};

export const obtenerHistorialPagos = async (tiendaId, ordenCompraId) => {
  if (!tiendaId || !ordenCompraId) {
    throw new Error('tiendaId y ordenCompraId son requeridos para obtener historial de pagos');
  }
  const { data } = await apiClient.get(buildPagosUrl(tiendaId, `/orden/${ordenCompraId}`));
  return data;
};

export const obtenerPagoPorId = async (tiendaId, pagoId) => {
  if (!tiendaId || !pagoId) {
    throw new Error('tiendaId y pagoId son requeridos para obtener el pago');
  }
  const { data } = await apiClient.get(buildPagosUrl(tiendaId, `/${pagoId}`));
  return data;
};
