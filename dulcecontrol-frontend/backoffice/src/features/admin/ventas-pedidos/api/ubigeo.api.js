import apiClient from '../../../../api/apiClient.js';

const BASE_URL = '/api/admin/ubigeo';

export const getUbigeoDepartamentos = async () => {
    const { data } = await apiClient.get(`${BASE_URL}/departamentos`);
    return data;
};

export const getUbigeoProvincias = async (departamentoId) => {
    if (!departamentoId) {
        return [];
    }
    const { data } = await apiClient.get(`${BASE_URL}/departamentos/${departamentoId}/provincias`);
    return data;
};

export const getUbigeoDistritos = async (provinciaId) => {
    if (!provinciaId) {
        return [];
    }
    const { data } = await apiClient.get(`${BASE_URL}/provincias/${provinciaId}/distritos`);
    return data;
};

export const getUbigeoRutaPorDistrito = async (distritoId) => {
    if (!distritoId) {
        return null;
    }
    const { data } = await apiClient.get(`${BASE_URL}/distritos/${distritoId}/ruta`);
    return data;
};
