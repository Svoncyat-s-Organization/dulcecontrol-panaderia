import apiClient from '../apiClient';

const BASE_PATH = '/api/superadmin/tiendas';

const sanitizePayload = (payload) => (
    Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '')
    )
);

export const getSedesByTiendaId = async (tiendaId) => {
    const response = await apiClient.get(`${BASE_PATH}/${tiendaId}/sedes`);
    return response.data;
};

export const getSedeById = async (tiendaId, sedeId) => {
    const response = await apiClient.get(`${BASE_PATH}/${tiendaId}/sedes/${sedeId}`);
    return response.data;
};

export const createSede = async (tiendaId, data) => {
    const payload = sanitizePayload({
        codigoInterno: data.codigoInterno,
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono,
        distritoId: data.distritoId,
        esPrincipal: data.esPrincipal,
    });
    const response = await apiClient.post(`${BASE_PATH}/${tiendaId}/sedes`, payload);
    return response.data;
};

export const updateSede = async (tiendaId, sedeId, data) => {
    const payload = sanitizePayload({
        codigoInterno: data.codigoInterno,
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono,
        distritoId: data.distritoId,
        esPrincipal: data.esPrincipal,
        activo: data.activo,
    });
    const response = await apiClient.put(`${BASE_PATH}/${tiendaId}/sedes/${sedeId}`, payload);
    return response.data;
};

export const deleteSede = async (tiendaId, sedeId) => {
    await apiClient.delete(`${BASE_PATH}/${tiendaId}/sedes/${sedeId}`);
};
