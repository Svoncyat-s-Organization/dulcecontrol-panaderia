import apiClient from '../../../../api/apiClient.js';

const buildUsuariosUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para gestionar usuarios');
  }
  return `/api/admin/tiendas/${tiendaId}/seguridad/usuarios${suffix}`;
};

const buildRolesUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para gestionar roles');
  }
  return `/api/admin/tiendas/${tiendaId}/seguridad/roles${suffix}`;
};

const PERMISOS_URL = '/api/admin/seguridad/permisos';

// Usuarios
export const getUsuarios = async (tiendaId) => {
  const { data } = await apiClient.get(buildUsuariosUrl(tiendaId));
  return data ?? [];
};

export const getUsuario = async (tiendaId, usuarioId) => {
  const { data } = await apiClient.get(buildUsuariosUrl(tiendaId, `/${usuarioId}`));
  return data;
};

export const createUsuario = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildUsuariosUrl(tiendaId), payload);
  return data;
};

export const updateUsuario = async (tiendaId, usuarioId, payload) => {
  const { data } = await apiClient.put(buildUsuariosUrl(tiendaId, `/${usuarioId}`), payload);
  return data;
};

export const deleteUsuario = async (tiendaId, usuarioId) => {
  await apiClient.delete(buildUsuariosUrl(tiendaId, `/${usuarioId}`));
};

// Roles
export const getRoles = async (tiendaId) => {
  const { data } = await apiClient.get(buildRolesUrl(tiendaId));
  return data ?? [];
};

export const getRol = async (tiendaId, rolId) => {
  const { data } = await apiClient.get(buildRolesUrl(tiendaId, `/${rolId}`));
  return data;
};

export const createRol = async (tiendaId, payload) => {
  const { data } = await apiClient.post(buildRolesUrl(tiendaId), payload);
  return data;
};

export const updateRol = async (tiendaId, rolId, payload) => {
  const { data } = await apiClient.put(buildRolesUrl(tiendaId, `/${rolId}`), payload);
  return data;
};

export const deleteRol = async (tiendaId, rolId) => {
  await apiClient.delete(buildRolesUrl(tiendaId, `/${rolId}`));
};

// Permisos
export const getPermisos = async () => {
  const { data } = await apiClient.get(PERMISOS_URL);
  return data ?? [];
};
