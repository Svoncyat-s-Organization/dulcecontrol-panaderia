import apiClient from '../../../../api/apiClient.js';

const buildPedidosUrl = (tiendaId, suffix = '') => {
    if (!tiendaId) {
        throw new Error('tiendaId es requerido');
    }
    return `/api/admin/tiendas/${tiendaId}/ventas/pedidos${suffix}`;
};

export const getPedidos = async (tiendaId, params = {}) => {
    const { data } = await apiClient.get(buildPedidosUrl(tiendaId), { params });
    return data;
};

export const getPedidoById = async (tiendaId, pedidoId) => {
    const { data } = await apiClient.get(buildPedidosUrl(tiendaId, `/${pedidoId}`));
    return data;
};

export const createPedido = async (tiendaId, payload) => {
    const { data } = await apiClient.post(buildPedidosUrl(tiendaId), payload);
    return data;
};

export const updatePedido = async (tiendaId, pedidoId, payload) => {
    const { data } = await apiClient.put(buildPedidosUrl(tiendaId, `/${pedidoId}`), payload);
    return data;
};

export const deletePedido = async (tiendaId, pedidoId) => {
    const { data } = await apiClient.delete(buildPedidosUrl(tiendaId, `/${pedidoId}`));
    return data;
};

export const addDetallePedido = async (tiendaId, pedidoId, payload) => {
    const { data } = await apiClient.post(buildPedidosUrl(tiendaId, `/${pedidoId}/detalles`), payload);
    return data;
};

export const addPagoPedido = async (tiendaId, pedidoId, payload) => {
    const { data } = await apiClient.post(buildPedidosUrl(tiendaId, `/${pedidoId}/pagos`), payload);
    return data;
};

export const addDireccionPedido = async (tiendaId, pedidoId, payload) => {
    const { data } = await apiClient.post(buildPedidosUrl(tiendaId, `/${pedidoId}/direcciones`), payload);
    return data;
};

export const getDireccionesPedido = async (tiendaId, pedidoId) => {
    const { data } = await apiClient.get(buildPedidosUrl(tiendaId, `/${pedidoId}/direcciones`));
    return data;
};

export const getPagosPedido = async (tiendaId, pedidoId) => {
    const { data } = await apiClient.get(buildPedidosUrl(tiendaId, `/${pedidoId}/pagos`));
    return data;
};

export const getDetallesPedido = async (tiendaId, pedidoId) => {
    const { data } = await apiClient.get(buildPedidosUrl(tiendaId, `/${pedidoId}/detalles`));
    return data;
};
