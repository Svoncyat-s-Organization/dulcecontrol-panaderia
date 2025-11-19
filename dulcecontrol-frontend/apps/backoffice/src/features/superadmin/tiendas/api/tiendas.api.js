import axios from 'axios';
import {ENDPOINTS, getApiUrl} from "../../../../config/api.config.js";

const ADMIN_ENDPOINT = `${getApiUrl()}${ENDPOINTS.API_ADMIN}`;

/**
* Función para OBTENER la lista de tiendas (con filtros)
*
* @param {object} queryParams - un objeto de filtros (ej. { estado: 'ACTIVO', page: 1 })
* @returns {Promise<object>} La respuesta de DTO del backend
* */
export const getTiendas = async (queryParams = {}) => {
    try {
        const response = await axios.get(ADMIN_ENDPOINT, {params: queryParams});
        return response.data;
    } catch (error) {
        console.error('Error al obtener tiendas', error);
        throw error;
    }
}

/**
 * Función para CREAR una nueva tienda manualmente
 *
 * @param {object} payload - El objeto de la tienda a crear
 * @returns {Promise<object>} La nueva tienda creada en el backend
 **/
export const postTienda = async (payload) => {
    try {
        const response = await axios.post(ADMIN_ENDPOINT, payload);
        return response.data;
    } catch (error) {
        console.error('Error al crear tienda', error);
        throw error;
    }
}

/**
 * Función para OBTENER una tienda por ID
 *
 * @param {string | number} tiendaID - el ID de la tienda a buscar
 * @returns {Promise<object>} Los datos de esa tienda en específico
 */
export const getTiendaById = async (tiendaId) => {
    try {
        const url = `${ADMIN_ENDPOINT}/${tiendaId}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener tienda con ID: ${tiendaId}`, error);
        throw error;
    }
}

/**
 * Función para ACTUALIZAR una tienda existente
 *
 * @param {string | number} tiendaId - El ID de la tienda a actualizar
 * @param {object} payload - El objeto con los campos a actualizar
 * @returns {Promise<object>} La tienda actualizada
 */
export const putTienda = async (tiendaId, payload) => {
    try {
        const url = `${ADMIN_ENDPOINT}/${tiendaId}`;
        const response = await axios.put(url, payload);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar tienda con ID: ${tiendaId}`, error);
        throw error;
    }
}

/**
 * Función para ELIMINAR una tienda existente
 *
 * @param {string | number} tiendaId - El ID de la tienda a eliminar
 * @returns {Promise<object>} La respuesta del backend (puede ser vacía)
 */
export const deleteTienda = async (tiendaId) => {
    try {
        const url = `${ADMIN_ENDPOINT}/${tiendaId}`;
        const response = await axios.delete(url);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar tienda con ID: ${tiendaId}`, error);
        throw error;
    }
}
