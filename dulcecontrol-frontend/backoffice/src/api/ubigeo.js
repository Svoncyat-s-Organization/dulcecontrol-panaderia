import apiClient from './apiClient.js';

const BASE_URL = '/api/ubigeo';

export const getDepartamentos = async () => {
    const { data } = await apiClient.get(`${BASE_URL}/departamentos`);
    return data;
};

export const getProvinciasByDepartamento = async (departamentoId) => {
    if (!departamentoId) {
        return [];
    }
    const { data } = await apiClient.get(`${BASE_URL}/departamentos/${departamentoId}/provincias`);
    return data;
};

export const getDistritosByProvincia = async (provinciaId) => {
    if (!provinciaId) {
        return [];
    }
    const { data } = await apiClient.get(`${BASE_URL}/provincias/${provinciaId}/distritos`);
    return data;
};

export const getDistrito = async (distritoId) => {
    if (!distritoId) {
        return null;
    }
    const { data } = await apiClient.get(`${BASE_URL}/distritos/${distritoId}`);
    return data;
};

export const getProvincia = async (provinciaId) => {
    if (!provinciaId) {
        return null;
    }
    const { data } = await apiClient.get(`${BASE_URL}/provincias/${provinciaId}`);
    return data;
};
