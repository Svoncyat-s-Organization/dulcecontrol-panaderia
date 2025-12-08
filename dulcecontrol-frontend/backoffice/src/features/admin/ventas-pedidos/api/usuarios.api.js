import apiClient from '../../../../api/apiClient.js';

const buildUsuariosUrl = (tiendaId, suffix = '') => {
    if (!tiendaId) {
        throw new Error('tiendaId es requerido');
    }
    return `/api/admin/tiendas/${tiendaId}/seguridad/usuarios${suffix}`;
};

export const getUsuariosAdmin = async (tiendaId) => {
    const { data } = await apiClient.get(buildUsuariosUrl(tiendaId));
    return data;
};

export const getUsuarioAdminById = async (tiendaId, usuarioId) => {
    if (!usuarioId) {
        throw new Error('usuarioId es requerido');
    }
    const { data } = await apiClient.get(buildUsuariosUrl(tiendaId, `/${usuarioId}`));
    return data;
};
