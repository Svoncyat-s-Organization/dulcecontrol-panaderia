import apiClient from '../apiClient';

const BASE_PATH = '/api/superadmin/tiendas';

const sanitizePayload = (payload) => (
    Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '')
    )
);

export const getDominiosByTiendaId = async (tiendaId) => {
    const response = await apiClient.get(`${BASE_PATH}/${tiendaId}/dominios`);
    return response.data;
};

export const createDominio = async (tiendaId, data) => {
    const payload = sanitizePayload({
        tipo: data.tipo,
        urlDominio: data.urlDominio,
        urlLogo: data.urlLogo,
        urlFavicon: data.urlFavicon,
        colorPrimario: data.colorPrimario,
        colorSecundario: data.colorSecundario,
    });
    const response = await apiClient.post(`${BASE_PATH}/${tiendaId}/dominios`, payload);
    return response.data;
};

export const updateDominio = async (tiendaId, dominioId, data) => {
    const payload = sanitizePayload({
        tipo: data.tipo,
        urlDominio: data.urlDominio,
        urlLogo: data.urlLogo,
        urlFavicon: data.urlFavicon,
        colorPrimario: data.colorPrimario,
        colorSecundario: data.colorSecundario,
    });
    const response = await apiClient.put(`${BASE_PATH}/${tiendaId}/dominios/${dominioId}`, payload);
    return response.data;
};

export const deleteDominio = async (tiendaId, dominioId) => {
    await apiClient.delete(`${BASE_PATH}/${tiendaId}/dominios/${dominioId}`);
};
