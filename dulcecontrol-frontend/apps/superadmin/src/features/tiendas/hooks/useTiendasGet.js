import axios from 'axios';
import {ENDPOINTS, getApiUrl} from "../../../config/api.config.js";

const TENANT_ENDPOINT = `${getApiUrl()}${ENDPOINTS.API_TENANT}`;

/*
* Función de API [GET] que captura las tiendas
* existentes en la base de datos de Dulce Control.
* @param {object} params - Filtros opcionales para la consulta
* @returns {Promise<object>} La respuesta del DTO
*/
const getTiendas = async (params = {}) => {
    // Desestructuramos solo los campos esperados
    const {
        id,
        slug,
        tipoDoc,
        numeroDoc,
        nombreDoc,
        nombreComercial,
        correoContacto,
        telefonoContacto,
        estado,
        creadoEn,
        actualizadoEn
    } = params;

    // Construimos el queryParams filtrando valores undefined/null
    const raw = {
        id,
        slug,
        tipoDoc,
        numeroDoc,
        nombreDoc,
        nombreComercial,
        correoContacto,
        telefonoContacto,
        estado,
        creadoEn,
        actualizadoEn
    };

    const queryParams = Object.keys(raw).reduce((acc, key) => {
        const value = raw[key];
        if (value !== undefined && value !== null && value !== '') acc[key] = value;
        return acc;
    }, {});

    try {
        // Para GET, axios espera los parámetros dentro de la opción `params`
        const response = await axios.get(TENANT_ENDPOINT, { params: queryParams });
        return response.data;
    } catch (error) {
        // Re-lanzamos el error para que el caller lo maneje.
        // Podrías adaptar esto para logging centralizado o mostrar notificaciones.
        throw error;
    }
};

export default getTiendas;

