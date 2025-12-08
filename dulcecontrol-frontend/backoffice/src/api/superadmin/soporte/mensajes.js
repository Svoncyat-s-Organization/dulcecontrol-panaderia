import apiClient from '../../apiClient';

const BASE_PATH = '/api/superadmin/soporte/mensajes';

const sanitize = (payload = {}) => Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '')
);

export const getMessages = async ({ ticketId } = {}) => {
    const params = sanitize({ ticketId });
    const response = await apiClient.get(BASE_PATH, { params });
    return response.data;
};

export const getMessagesByTicket = async (ticketId) => {
    const response = await apiClient.get(`/api/superadmin/soporte/tickets/${ticketId}/mensajes`);
    return response.data;
};

export const getMessageById = async (mensajeId) => {
    const response = await apiClient.get(`${BASE_PATH}/${mensajeId}`);
    return response.data;
};

export const createMessage = async (data) => {
    const payload = sanitize({
        ticketId: data.ticketId,
        tipoRemitente: data.tipoRemitente,
        autorAdminId: data.autorAdminId,
        mensaje: data.mensaje,
        esNotaInterna: data.esNotaInterna,
    });
    const response = await apiClient.post(BASE_PATH, payload);
    return response.data;
};

export const updateMessage = async (mensajeId, data) => {
    const payload = sanitize({
        mensaje: data.mensaje,
        esNotaInterna: data.esNotaInterna,
    });
    const response = await apiClient.put(`${BASE_PATH}/${mensajeId}`, payload);
    return response.data;
};

export const deleteMessage = async (mensajeId) => {
    await apiClient.delete(`${BASE_PATH}/${mensajeId}`);
};
