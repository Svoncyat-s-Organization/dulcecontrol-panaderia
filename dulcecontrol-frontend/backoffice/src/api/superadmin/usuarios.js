import apiClient from '../apiClient';

const BASE_PATH = '/api/admin/tiendas';

const sanitizePayload = (payload) => (
    Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '')
    )
);

export const getUsuariosByTiendaId = async (tiendaId) => {
    const response = await apiClient.get(`${BASE_PATH}/${tiendaId}/seguridad/usuarios`);
    return response.data;
};

export const createUsuario = async (tiendaId, data) => {
    const payload = sanitizePayload({
        rolId: data.rolId,
        sedeIds: data.sedeIds,
        correo: data.correo,
        contrasena: data.contrasena,
        tipoDoc: data.tipoDoc,
        numeroDoc: data.numeroDoc,
        nombres: data.nombres,
        telefono: data.telefono,
        activo: data.activo,
    });
    const response = await apiClient.post(`${BASE_PATH}/${tiendaId}/seguridad/usuarios`, payload);
    return response.data;
};

export const updateUsuario = async (tiendaId, usuarioId, data) => {
    const payload = sanitizePayload({
        rolId: data.rolId,
        sedeIds: data.sedeIds,
        correo: data.correo,
        tipoDoc: data.tipoDoc,
        numeroDoc: data.numeroDoc,
        nombres: data.nombres,
        telefono: data.telefono,
        activo: data.activo,
        nuevaContrasena: data.nuevaContrasena,
    });
    const response = await apiClient.put(`${BASE_PATH}/${tiendaId}/seguridad/usuarios/${usuarioId}`, payload);
    return response.data;
};

export const resetUsuarioPassword = async (tiendaId, usuarioId, data) => {
    const payload = sanitizePayload({
        nuevaContrasena: data.nuevaContrasena,
    });
    const response = await apiClient.post(`${BASE_PATH}/${tiendaId}/seguridad/usuarios/${usuarioId}/reset-password`, payload);
    return response.data;
};

export const deleteUsuario = async (tiendaId, usuarioId) => {
    await apiClient.delete(`${BASE_PATH}/${tiendaId}/seguridad/usuarios/${usuarioId}`);
};
