import apiClient from '../../../../api/apiClient.js';

const buildTransferenciasUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar transferencias');
  }
  return `/api/admin/tiendas/${tiendaId}/inventario/transferencias${suffix}`;
};

export const getTransferencias = async (tiendaId) => {
  const { data } = await apiClient.get(buildTransferenciasUrl(tiendaId));
  return data;
};

export const getTransferenciasPorEstado = async (tiendaId, estado) => {
  if (!estado) {
    return getTransferencias(tiendaId);
  }
  const { data } = await apiClient.get(buildTransferenciasUrl(tiendaId, `/estado/${estado}`));
  return data;
};

export const getTransferenciaById = async (tiendaId, transferenciaId) => {
  const { data } = await apiClient.get(buildTransferenciasUrl(tiendaId, `/${transferenciaId}`));
  return data;
};

export const createTransferencia = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildTransferenciasUrl(tiendaId), payload);
  return data;
};

export const updateTransferencia = async (tiendaId, transferenciaId, payload) => {
  const { data } = await apiClient.put(buildTransferenciasUrl(tiendaId, `/${transferenciaId}`), payload);
  return data;
};

export const cambiarEstadoTransferencia = async (tiendaId, transferenciaId, nuevoEstado) => {
  const { data } = await apiClient.patch(
    buildTransferenciasUrl(tiendaId, `/${transferenciaId}/estado`),
    null,
    { params: { nuevoEstado } }
  );
  return data;
};

export const recibirTransferencia = async (tiendaId, transferenciaId, payload) => {
  const { data } = await apiClient.patch(
    buildTransferenciasUrl(tiendaId, `/${transferenciaId}/recibir`),
    payload
  );
  return data;
};

export const deleteTransferencia = async (tiendaId, transferenciaId) => {
  await apiClient.delete(buildTransferenciasUrl(tiendaId, `/${transferenciaId}`));
};
