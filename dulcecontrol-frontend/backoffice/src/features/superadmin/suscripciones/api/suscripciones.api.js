import apiClient from '../../../../api/apiClient.js';

// ============================================
// PLANES
// ============================================

/**
 * Obtener todos los planes
 * @param {object} params - Parámetros de filtro opcionales
 * @returns {Promise<Array>}
 */
export const getPlanes = async (params = {}) => {
    const { data } = await apiClient.get('/api/superadmin/suscripciones/planes', { params });
    return data;
};

/**
 * Crear un nuevo plan
 * @param {object} payload - Datos del plan
 * @returns {Promise<object>}
 */
export const createPlan = async (payload) => {
    const { data } = await apiClient.post('/api/superadmin/suscripciones/planes', payload);
    return data;
};

/**
 * Actualizar un plan existente
 * @param {number} id - ID del plan
 * @param {object} payload - Datos a actualizar
 * @returns {Promise<object>}
 */
export const updatePlan = async (id, payload) => {
    const { data } = await apiClient.put(`/api/superadmin/suscripciones/planes/${id}`, payload);
    return data;
};

// ============================================
// SUSCRIPCIONES
// ============================================

/**
 * Obtener todas las suscripciones
 * @param {object} params - Parámetros de filtro (estado, fecha_fin, etc.)
 * @returns {Promise<Array>}
 */
export const getSuscripciones = async (params = {}) => {
    const { data } = await apiClient.get('/api/superadmin/suscripciones', { params });
    return data;
};

/**
 * Crear una nueva suscripción
 * @param {object} payload - Datos de la suscripción
 * @returns {Promise<object>}
 */
export const createSuscripcion = async (payload) => {
    const { data } = await apiClient.post('/api/superadmin/suscripciones', payload);
    return data;
};

/**
 * Actualizar una suscripción existente
 * @param {number} id - ID de la suscripción
 * @param {object} payload - Datos a actualizar
 * @returns {Promise<object>}
 */
export const updateSuscripcion = async (id, payload) => {
    const { data } = await apiClient.put(`/api/superadmin/suscripciones/${id}`, payload);
    return data;
};

// ============================================
// HISTORIAL
// ============================================

/**
 * Obtener historial de una suscripción
 * @param {number} suscripcionId - ID de la suscripción
 * @returns {Promise<Array>}
 */
export const getHistorialBySuscripcion = async (suscripcionId) => {
    const { data } = await apiClient.get(`/api/superadmin/suscripciones/${suscripcionId}/historial`);
    return data;
};
