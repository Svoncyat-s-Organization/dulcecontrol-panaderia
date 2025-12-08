import apiClient from '../../../../api/apiClient.js';

const buildClientesUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar clientes');
  }
  return `/api/admin/tiendas/${tiendaId}/clientes${suffix}`;
};

export const getClientes = async (tiendaId) => {
  const { data } = await apiClient.get(buildClientesUrl(tiendaId));
  return data;
};

export const searchClientes = async (tiendaId, busqueda) => {
  const params = busqueda ? { q: busqueda } : {};
  const { data } = await apiClient.get(buildClientesUrl(tiendaId, '/buscar'), { params });
  return data;
};

export const getCliente = async (tiendaId, clienteId) => {
  const { data } = await apiClient.get(buildClientesUrl(tiendaId, `/${clienteId}`));
  return data;
};

export const createCliente = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildClientesUrl(tiendaId), payload);
  return data;
};

export const updateCliente = async (tiendaId, clienteId, payload) => {
  const { data } = await apiClient.put(buildClientesUrl(tiendaId, `/${clienteId}`), payload);
  return data;
};

export const deleteCliente = async (tiendaId, clienteId) => {
  const { data } = await apiClient.delete(buildClientesUrl(tiendaId, `/${clienteId}`));
  return data;
};