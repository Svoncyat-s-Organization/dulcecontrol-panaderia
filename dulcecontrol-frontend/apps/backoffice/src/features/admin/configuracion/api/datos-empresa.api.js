import apiClient from '../../../../api/apiClient.js';

/**
 * Obtiene los datos de empresa (identidad fiscal) de una tienda
 * @param {number} tiendaId - ID de la tienda
 * @returns {Promise<Object>} Datos de empresa
 */
export const getDatosEmpresa = async (tiendaId) => {
  const { data } = await apiClient.get(`/api/admin/tiendas/${tiendaId}/configuracion/datos-empresa`);
  return data;
};

/**
 * Actualiza los datos de empresa (identidad fiscal) de una tienda
 * @param {number} tiendaId - ID de la tienda
 * @param {Object} payload - Datos a actualizar
 * @returns {Promise<Object>} Datos actualizados
 */
export const updateDatosEmpresa = async (tiendaId, payload) => {
  const { data } = await apiClient.put(`/api/admin/tiendas/${tiendaId}/configuracion/datos-empresa`, payload);
  return data;
};
