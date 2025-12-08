import apiClient from '../../../../api/apiClient.js';

/**
 * Obtiene las sedes asignadas al usuario de una tienda
 * @param {number} tiendaId - ID de la tienda
 * @returns {Promise<Array>} Lista de sedes
 */
export const getSedesAsignadas = async (tiendaId) => {
  const { data } = await apiClient.get(`/api/admin/tiendas/${tiendaId}/configuracion/sedes`);
  return data;
};

/**
 * Obtiene todas las sedes de una tienda (para configuración)
 * @param {number} tiendaId - ID de la tienda
 * @returns {Promise<Array>} Lista de sedes
 */
export const getSedes = async (tiendaId) => {
  const { data } = await apiClient.get(`/api/admin/tiendas/${tiendaId}/configuracion/sedes`);
  return data;
};

/**
 * Obtiene una sede específica
 * @param {number} tiendaId - ID de la tienda
 * @param {number} sedeId - ID de la sede
 * @returns {Promise<Object>} Datos de la sede
 */
export const getSede = async (tiendaId, sedeId) => {
  const { data } = await apiClient.get(`/api/admin/tiendas/${tiendaId}/configuracion/sedes/${sedeId}`);
  return data;
};

/**
 * Crea una nueva sede
 * @param {number} tiendaId - ID de la tienda
 * @param {Object} payload - Datos de la sede
 * @returns {Promise<Object>} Sede creada
 */
export const createSede = async (tiendaId, payload) => {
  const { data } = await apiClient.post(`/api/admin/tiendas/${tiendaId}/configuracion/sedes`, payload);
  return data;
};

/**
 * Actualiza una sede existente
 * @param {number} tiendaId - ID de la tienda
 * @param {number} sedeId - ID de la sede
 * @param {Object} payload - Datos a actualizar
 * @returns {Promise<Object>} Sede actualizada
 */
export const updateSede = async (tiendaId, sedeId, payload) => {
  const { data } = await apiClient.put(`/api/admin/tiendas/${tiendaId}/configuracion/sedes/${sedeId}`, payload);
  return data;
};

/**
 * Elimina una sede permanentemente
 * @param {number} tiendaId - ID de la tienda
 * @param {number} sedeId - ID de la sede
 * @returns {Promise<void>}
 */
export const deleteSede = async (tiendaId, sedeId) => {
  await apiClient.delete(`/api/admin/tiendas/${tiendaId}/configuracion/sedes/${sedeId}`);
};

/**
 * Desactiva una sede (soft delete)
 * @param {number} tiendaId - ID de la tienda
 * @param {number} sedeId - ID de la sede
 * @returns {Promise<void>}
 */
export const desactivarSede = async (tiendaId, sedeId) => {
  await apiClient.put(`/api/admin/tiendas/${tiendaId}/configuracion/sedes/${sedeId}/desactivar`);
};
