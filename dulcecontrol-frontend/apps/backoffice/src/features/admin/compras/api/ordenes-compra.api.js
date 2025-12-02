import apiClient from '../../../../api/apiClient.js';

const buildOrdenesUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar órdenes de compra');
  }
  return `/api/admin/tiendas/${tiendaId}/compras/ordenes${suffix}`;
};

export const getOrdenes = async (tiendaId, filters = {}) => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para listar órdenes de compra');
  }
  
  const params = {};
  if (filters.estado) params.estado = filters.estado;
  if (filters.sedeId) params.sedeId = filters.sedeId;
  if (filters.proveedorId) params.proveedorId = filters.proveedorId;
  if (filters.fechaInicio) params.fechaInicio = filters.fechaInicio;
  if (filters.fechaFin) params.fechaFin = filters.fechaFin;
  
  const { data } = await apiClient.get(buildOrdenesUrl(tiendaId), { params });
  return data;
};

export const getOrdenesPendientes = async (tiendaId, sedeId = null) => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para listar órdenes pendientes');
  }
  
  const params = {};
  if (sedeId) params.sedeId = sedeId;
  
  const { data } = await apiClient.get(buildOrdenesUrl(tiendaId, '/pendientes'), { params });
  return data;
};

export const getOrdenById = async (tiendaId, ordenId) => {
  if (!tiendaId || !ordenId) {
    throw new Error('tiendaId y ordenId son requeridos');
  }
  const { data } = await apiClient.get(buildOrdenesUrl(tiendaId, `/${ordenId}`));
  return data;
};

export const createOrden = async (tiendaId, payload) => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para crear una orden de compra');
  }
  // El backend requiere tiendaId en el payload
  const { data } = await apiClient.post(buildOrdenesUrl(tiendaId), {
    ...payload,
    tiendaId,
  });
  return data;
};

export const updateOrden = async (tiendaId, ordenId, payload) => {
  if (!tiendaId || !ordenId) {
    throw new Error('tiendaId y ordenId son requeridos para actualizar');
  }
  const { data } = await apiClient.put(buildOrdenesUrl(tiendaId, `/${ordenId}`), payload);
  return data;
};

export const cambiarEstadoOrden = async (tiendaId, ordenId, estado) => {
  if (!tiendaId || !ordenId || !estado) {
    throw new Error('tiendaId, ordenId y estado son requeridos');
  }
  const { data } = await apiClient.patch(
    buildOrdenesUrl(tiendaId, `/${ordenId}/estado`),
    null,
    { params: { estado } }
  );
  return data;
};

export const deleteOrden = async (tiendaId, ordenId) => {
  if (!tiendaId || !ordenId) {
    throw new Error('tiendaId y ordenId son requeridos para eliminar');
  }
  const { data } = await apiClient.delete(buildOrdenesUrl(tiendaId, `/${ordenId}`));
  return data;
};

export const recibirParcial = async (tiendaId, payload) => {
  if (!tiendaId || !payload) {
    throw new Error('tiendaId y payload son requeridos para recepción parcial');
  }
  const { data } = await apiClient.post(buildOrdenesUrl(tiendaId, '/recepcion-parcial'), payload);
  return data;
};

export const recibirTotal = async (tiendaId, ordenId) => {
  if (!tiendaId || !ordenId) {
    throw new Error('tiendaId y ordenId son requeridos para recepción total');
  }
  const { data } = await apiClient.post(buildOrdenesUrl(tiendaId, `/${ordenId}/recepcion-total`));
  return data;
};
