import apiClient from '../../../../api/apiClient.js';

const basePath = '/api/integration/decolecta';

export const consultarReniecPorDni = async (dni) => {
    const sanitized = (dni || '').toString().replace(/\D/g, '');
    if (!sanitized) {
        throw new Error('DNI es requerido');
    }
    const { data } = await apiClient.get(`${basePath}/reniec/dni/${sanitized}`);
    return data;
};

export const consultarSunatPorRuc = async (ruc, { full = false } = {}) => {
    const sanitized = (ruc || '').toString().replace(/\D/g, '');
    if (!sanitized) {
        throw new Error('RUC es requerido');
    }
    const suffix = full ? '/full' : '';
    const { data } = await apiClient.get(`${basePath}/sunat/ruc/${sanitized}${suffix}`);
    return data;
};
