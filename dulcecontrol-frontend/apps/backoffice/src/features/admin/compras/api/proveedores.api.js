import apiClient from '../../../../api/apiClient.js';

const buildProveedoresUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar proveedores');
  }
  return `/api/admin/tiendas/${tiendaId}/compras/proveedores${suffix}`;
};

export const getProveedores = async (tiendaId, soloActivos = null) => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para listar proveedores');
  }
  
  const params = {};
  if (soloActivos !== null) params.soloActivos = soloActivos;
  
  const { data } = await apiClient.get(buildProveedoresUrl(tiendaId), { params });
  return data;
};

export const getProveedorById = async (tiendaId, proveedorId) => {
  if (!tiendaId || !proveedorId) {
    throw new Error('tiendaId y proveedorId son requeridos');
  }
  const { data } = await apiClient.get(buildProveedoresUrl(tiendaId, `/${proveedorId}`));
  return data;
};

export const createProveedor = async (tiendaId, payload) => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para crear un proveedor');
  }
  // El backend requiere tiendaId en el payload como número
  const finalPayload = {
    ...payload,
    tiendaId: Number(tiendaId),
  };
  
  const { data } = await apiClient.post(buildProveedoresUrl(tiendaId), finalPayload);
  return data;
};

export const updateProveedor = async (tiendaId, proveedorId, payload) => {
  if (!tiendaId || !proveedorId) {
    throw new Error('tiendaId y proveedorId son requeridos para actualizar');
  }
  const { data } = await apiClient.put(buildProveedoresUrl(tiendaId, `/${proveedorId}`), payload);
  return data;
};

export const deleteProveedor = async (tiendaId, proveedorId) => {
  if (!tiendaId || !proveedorId) {
    throw new Error('tiendaId y proveedorId son requeridos para eliminar');
  }
  const { data } = await apiClient.delete(buildProveedoresUrl(tiendaId, `/${proveedorId}`));
  return data;
};
