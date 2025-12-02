import apiClient from '../../../../api/apiClient.js';

const buildClientesUrl = (tiendaId, suffix = '') => {
    if (!tiendaId) {
        throw new Error('tiendaId es requerido para consultar clientes');
    }
    return `/api/admin/tiendas/${tiendaId}/clientes${suffix}`;
};

const buildDireccionesUrl = (tiendaId, clienteId, suffix = '') => {
    if (!tiendaId || !clienteId) {
        throw new Error('tiendaId y clienteId son requeridos para consultar direcciones');
    }
    return `/api/admin/tiendas/${tiendaId}/clientes/${clienteId}/direcciones${suffix}`;
};

export const getClientes = async (tiendaId) => {
    const { data } = await apiClient.get(buildClientesUrl(tiendaId));
    return data;
};

export const searchClientes = async (tiendaId, query) => {
    const { data } = await apiClient.get(buildClientesUrl(tiendaId, '/buscar'), { params: { q: query } });
    return data;
};

export const getDireccionesCliente = async (tiendaId, clienteId) => {
    const { data } = await apiClient.get(buildDireccionesUrl(tiendaId, clienteId));
    return data;
};

export const createDireccionCliente = async (tiendaId, clienteId, payload) => {
    const { data } = await apiClient.post(buildDireccionesUrl(tiendaId, clienteId), payload);
    return data;
};
