import apiClient from '../../apiClient';

const BASE_PATH = '/api/superadmin/soporte/tickets';

const sanitize = (payload = {}) => Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '')
);

export const getTickets = async ({ tiendaId, estado, prioridad } = {}) => {
    const params = sanitize({ tiendaId, estado, prioridad });
    const response = await apiClient.get(BASE_PATH, { params });
    return response.data;
};

export const getTicketById = async (ticketId) => {
    const response = await apiClient.get(`${BASE_PATH}/${ticketId}`);
    return response.data;
};

export const createTicket = async (data) => {
    const payload = sanitize({
        tiendaId: data.tiendaId,
        asignadoAId: data.asignadoAId,
        asunto: data.asunto,
        prioridad: data.prioridad,
    });
    const response = await apiClient.post(BASE_PATH, payload);
    return response.data;
};

export const updateTicket = async (ticketId, data) => {
    const payload = sanitize({
        asignadoAId: data.asignadoAId,
        prioridad: data.prioridad,
        estado: data.estado,
    });
    const response = await apiClient.put(`${BASE_PATH}/${ticketId}`, payload);
    return response.data;
};

export const deleteTicket = async (ticketId) => {
    await apiClient.delete(`${BASE_PATH}/${ticketId}`);
};
