import apiClient from '../apiClient';

const BASE_PATH = '/api/superadmin/tiendas';

const sanitizePayload = (payload) => {
    return Object.fromEntries(
        Object.entries(payload)
            .filter(([, value]) => value !== undefined && value !== null && value !== '')
    );
};

export const getTiendas = async () => {
    const response = await apiClient.get(BASE_PATH);
    return response.data;
};

export const getTiendaById = async (id) => {
    const response = await apiClient.get(`${BASE_PATH}/${id}`);
    return response.data;
};

export const createTienda = async (data) => {
    const payload = sanitizePayload({
        slug: data.slug,
        tipoDoc: data.tipoDoc,
        numeroDoc: data.numeroDoc,
        nombreDoc: data.nombreDoc,
        nombreComercial: data.nombreComercial,
        correoContacto: data.correoContacto,
        telefonoContacto: data.telefonoContacto,
        direccionFiscal: data.direccionFiscal,
        ubigeoFiscal: data.ubigeoFiscal,
        contrasena: data.contrasena,
        estado: data.estado,
    });
    const response = await apiClient.post(BASE_PATH, payload);
    return response.data;
};

export const updateTienda = async (id, data) => {
    const payload = sanitizePayload({
        slug: data.slug,
        tipoDoc: data.tipoDoc,
        numeroDoc: data.numeroDoc,
        nombreDoc: data.nombreDoc,
        nombreComercial: data.nombreComercial,
        correoContacto: data.correoContacto,
        telefonoContacto: data.telefonoContacto,
        direccionFiscal: data.direccionFiscal,
        ubigeoFiscal: data.ubigeoFiscal,
        nuevaContrasena: data.nuevaContrasena,
        estado: data.estado,
    });
    const response = await apiClient.put(`${BASE_PATH}/${id}`, payload);
    return response.data;
};

export const deleteTienda = async (id) => {
    await apiClient.delete(`${BASE_PATH}/${id}`);
};
