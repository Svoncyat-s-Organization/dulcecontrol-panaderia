import apiClient from '../../../../api/apiClient.js';

const USUARIOS_URL = '/api/superadmin/seguridad/usuarios';
const ROLES_URL = '/api/superadmin/seguridad/roles';
const PERMISOS_URL = '/api/superadmin/seguridad/permisos';
const ACTIVIDADES_URL = '/api/superadmin/seguridad/actividades';

// Usuarios Superadmin
export const getSuperadminUsuarios = async () => {
  const { data } = await apiClient.get(USUARIOS_URL);
  return data ?? [];
};

export const getSuperadminUsuario = async (usuarioId) => {
  const { data } = await apiClient.get(`${USUARIOS_URL}/${usuarioId}`);
  return data;
};

export const createSuperadminUsuario = async (payload) => {
  const { data } = await apiClient.post(USUARIOS_URL, payload);
  return data;
};

export const updateSuperadminUsuario = async (usuarioId, payload) => {
  const { data } = await apiClient.put(`${USUARIOS_URL}/${usuarioId}`, payload);
  return data;
};

export const deleteSuperadminUsuario = async (usuarioId) => {
  await apiClient.delete(`${USUARIOS_URL}/${usuarioId}`);
};

// Roles Superadmin
export const getSuperadminRoles = async () => {
  const { data } = await apiClient.get(ROLES_URL);
  return data ?? [];
};

export const getSuperadminRol = async (rolId) => {
  const { data } = await apiClient.get(`${ROLES_URL}/${rolId}`);
  return data;
};

export const createSuperadminRol = async (payload) => {
  const { data } = await apiClient.post(ROLES_URL, payload);
  return data;
};

export const updateSuperadminRol = async (rolId, payload) => {
  const { data } = await apiClient.put(`${ROLES_URL}/${rolId}`, payload);
  return data;
};

export const deleteSuperadminRol = async (rolId) => {
  await apiClient.delete(`${ROLES_URL}/${rolId}`);
};

// Permisos Superadmin
export const getSuperadminPermisos = async () => {
  const { data } = await apiClient.get(PERMISOS_URL);
  return data ?? [];
};

// Actividades
export const getActividadesSuperadmin = async ({ limit = 50 } = {}) => {
  const { data } = await apiClient.get(ACTIVIDADES_URL, { params: { limit } });
  return data ?? [];
};

export const getActividadesPorSuperadmin = async (usuarioId, { limit = 50 } = {}) => {
  const { data } = await apiClient.get(`${ACTIVIDADES_URL}/usuarios/${usuarioId}`, { params: { limit } });
  return data ?? [];
};

export const registrarActividadSuperadmin = async (usuarioId, payload) => {
  const { data } = await apiClient.post(`${ACTIVIDADES_URL}/usuarios/${usuarioId}`, payload);
  return data;
};
