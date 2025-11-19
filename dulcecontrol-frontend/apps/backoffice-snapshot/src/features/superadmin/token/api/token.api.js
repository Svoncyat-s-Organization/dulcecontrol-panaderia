import axios from 'axios';
import { getApiUrl, ENDPOINTS} from "../../../../config/api.config.js";

const LOGIN_ENDPOINT = `${getApiUrl()}${ENDPOINTS.DEV_TOKEN_LOGIN}`;
const REGISTER_ENDPOINT = `${getApiUrl()}${ENDPOINTS.DEV_TOKEN_REGISTER}`;

/**
 * Realiza el login de un desarrollador para obtener un token de acceso.
 * @param {string} correo - Correo del desarrollador.
 * @param {string} contrasena - Contraseña del desarrollador.
 * @returns {Promise<string>} - Promesa que resuelve con el token de acceso.
 */
export const postLogin = async (formData) => {
    const payload = {
        correo: formData.correo,
        contrasena: formData.contrasena
    };
    const response = await axios.post(LOGIN_ENDPOINT, payload);
    return response.data;
}

/**
 * Realiza el registro de un nuevo desarrollador y obtiene un token de acceso.
 * @param {string} nombreCompleto - Nombres y apellidos del desarrollador.
 * @param {string} correo - Correo del desarrollador.
 * @param {string} contrasena - Contraseña del desarrollador.
 * @returns {Promise<string>} - Promesa que resuelve con el token de acceso.
 */
export const postRegister = async (formData) => {
    const payload = {
        nombreCompleto: formData.nombreCompleto,
        correo: formData.correo,
        contrasena: formData.contrasena
    };
    const response = await axios.post(REGISTER_ENDPOINT, payload);
    return response.data;
}