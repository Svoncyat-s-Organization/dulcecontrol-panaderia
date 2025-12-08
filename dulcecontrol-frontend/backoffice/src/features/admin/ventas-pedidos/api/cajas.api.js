import apiClient from '../../../../api/apiClient.js';

const buildCajasUrl = (tiendaId, suffix = '') => {
    if (!tiendaId) {
        throw new Error('tiendaId es requerido');
    }
    return `/api/admin/tiendas/${tiendaId}/ventas/cajas${suffix}`;
};

const buildSesionesUrl = (tiendaId, suffix = '') => {
    if (!tiendaId) {
        throw new Error('tiendaId es requerido');
    }
    return `/api/admin/tiendas/${tiendaId}/ventas/sesiones-caja${suffix}`;
};

export const getCajas = async (tiendaId) => {
    const { data } = await apiClient.get(buildCajasUrl(tiendaId));
    return data;
};

export const createCaja = async (tiendaId, payload) => {
    const { data } = await apiClient.post(buildCajasUrl(tiendaId), payload);
    return data;
};

export const updateCaja = async (tiendaId, cajaId, payload) => {
    const { data } = await apiClient.put(buildCajasUrl(tiendaId, `/${cajaId}`), payload);
    return data;
};

export const deleteCaja = async (tiendaId, cajaId) => {
    const { data } = await apiClient.delete(buildCajasUrl(tiendaId, `/${cajaId}`));
    return data;
};

export const getSesionesCaja = async (tiendaId, params = {}) => {
    const { data } = await apiClient.get(buildSesionesUrl(tiendaId), { params });
    return data;
};

export const getSesionCajaById = async (tiendaId, sesionId) => {
    const { data } = await apiClient.get(buildSesionesUrl(tiendaId, `/${sesionId}`));
    return data;
};

export const abrirCaja = async (tiendaId, payload) => {
    // payload: { cajaId, usuarioAperturaId, montoInicialCentimos }
    const apiPayload = {
        cajaId: payload.cajaId,
        usuarioAperturaId: payload.usuarioAperturaId,
        montoInicialCentimos: payload.montoInicialCentimos,
        montoFinalEsperadoCentimos: payload.montoFinalEsperadoCentimos,
        fechaApertura: payload.fechaApertura,
        estaAbierta: payload.estaAbierta ?? true,
    };
    const { data } = await apiClient.post(buildSesionesUrl(tiendaId), apiPayload);
    return data;
};

export const cerrarCaja = async (tiendaId, sesionId, payload) => {
    // payload: { cajaId, usuarioCierreId, montoFinalRealCentimos }
    const apiPayload = {
        cajaId: payload.cajaId,
        usuarioCierreId: payload.usuarioCierreId,
        montoFinalRealCentimos: payload.montoFinalRealCentimos,
        montoFinalEsperadoCentimos: payload.montoFinalEsperadoCentimos,
        fechaCierre: payload.fechaCierre ?? new Date().toISOString(),
        estaAbierta: false,
    };
    const { data } = await apiClient.put(buildSesionesUrl(tiendaId, `/${sesionId}`), apiPayload);
    return data;
};

export const getMovimientosCaja = async (tiendaId, sesionId) => {
    const { data } = await apiClient.get(buildSesionesUrl(tiendaId, `/${sesionId}/movimientos`));
    return data;
};

export const registrarMovimientoCaja = async (tiendaId, sesionId, payload) => {
    const { data } = await apiClient.post(buildSesionesUrl(tiendaId, `/${sesionId}/movimientos`), payload);
    return data;
};
