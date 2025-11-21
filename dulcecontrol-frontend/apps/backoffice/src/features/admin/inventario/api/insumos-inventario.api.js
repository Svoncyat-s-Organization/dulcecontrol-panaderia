import apiClient from '../../../../api/apiClient.js';

const buildInventarioInsumosUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar inventario de insumos');
  }
  return `/api/admin/tiendas/${tiendaId}/inventario/insumos${suffix}`;
};

export const getInventarioInsumos = async (tiendaId, sedeId) => {
  if (!tiendaId || !sedeId) {
    throw new Error('tiendaId y sedeId son requeridos para listar insumos');
  }
  const { data } = await apiClient.get(
    buildInventarioInsumosUrl(tiendaId, `/sede/${sedeId}`)
  );
  return data;
};

export const updateInventarioInsumo = async (tiendaId, inventarioId, payload) => {
  if (!tiendaId || !inventarioId) {
    throw new Error('tiendaId e inventarioId son requeridos para actualizar insumos');
  }
  const { data } = await apiClient.put(
    buildInventarioInsumosUrl(tiendaId, `/${inventarioId}`),
    payload
  );
  return data;
};
