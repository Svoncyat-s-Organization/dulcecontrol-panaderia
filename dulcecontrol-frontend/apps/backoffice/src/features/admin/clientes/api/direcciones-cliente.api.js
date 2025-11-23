import apiClient from '../../../../api/apiClient.js';

const buildDireccionesUrl = (tiendaId, clienteId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar direcciones');
  }
  if (!clienteId) {
    throw new Error('clienteId es requerido para consultar direcciones');
  }
  return `/api/admin/tiendas/${tiendaId}/clientes/${clienteId}/direcciones${suffix}`;
};

export const getDireccionesCliente = async (tiendaId, clienteId) => {
  const { data } = await apiClient.get(buildDireccionesUrl(tiendaId, clienteId));
  return data;
};

export const getDireccionCliente = async (tiendaId, clienteId, direccionId) => {
  const { data } = await apiClient.get(buildDireccionesUrl(tiendaId, clienteId, `/${direccionId}`));
  return data;
};

export const createDireccionCliente = async (tiendaId, clienteId, payload) => {
  const { data } = await apiClient.post(buildDireccionesUrl(tiendaId, clienteId), payload);
  return data;
};

export const updateDireccionCliente = async (tiendaId, clienteId, direccionId, payload) => {
  const { data } = await apiClient.put(buildDireccionesUrl(tiendaId, clienteId, `/${direccionId}`), payload);
  return data;
};

export const deleteDireccionCliente = async (tiendaId, clienteId, direccionId) => {
  const { data } = await apiClient.delete(buildDireccionesUrl(tiendaId, clienteId, `/${direccionId}`));
  return data;
};