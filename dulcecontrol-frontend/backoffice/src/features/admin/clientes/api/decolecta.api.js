import apiClient from '../../../../api/apiClient.js';

/**
 * Consulta información de una persona por DNI en RENIEC
 */
export const consultarDni = async (dni) => {
  if (!dni || !/^\d{8}$/.test(dni)) {
    throw new Error('DNI debe tener exactamente 8 dígitos');
  }
  const { data } = await apiClient.get(`/api/integration/decolecta/reniec/dni/${dni}`);
  return data;
};

/**
 * Consulta información básica de una empresa por RUC en SUNAT
 */
export const consultarRuc = async (ruc) => {
  if (!ruc || !/^\d{11}$/.test(ruc)) {
    throw new Error('RUC debe tener exactamente 11 dígitos');
  }
  const { data } = await apiClient.get(`/api/integration/decolecta/sunat/ruc/${ruc}`);
  return data;
};

/**
 * Consulta información completa de una empresa por RUC en SUNAT
 */
export const consultarRucCompleto = async (ruc) => {
  if (!ruc || !/^\d{11}$/.test(ruc)) {
    throw new Error('RUC debe tener exactamente 11 dígitos');
  }
  const { data } = await apiClient.get(`/api/integration/decolecta/sunat/ruc/${ruc}/full`);
  return data;
};
