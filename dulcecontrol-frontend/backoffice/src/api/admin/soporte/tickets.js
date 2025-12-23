import apiClient from '../../apiClient';

const BASE_PATH = '/api/superadmin/soporte/tickets';

const sanitize = (payload = {}) => (
  Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== '')
  )
);

export const createTicket = async (tiendaId, data) => {
  if (!tiendaId) {
    throw new Error('No se encontró la tienda activa para crear el ticket.');
  }

  const payload = sanitize({
    tiendaId,
    asunto: data.asunto,
    prioridad: data.prioridad,
  });

  const response = await apiClient.post(BASE_PATH, payload);
  return response.data;
};
