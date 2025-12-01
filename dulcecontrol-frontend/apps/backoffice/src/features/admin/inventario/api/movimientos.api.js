import apiClient from '../../../../api/apiClient.js';

const buildMovimientosUrl = (tiendaId, resource) => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar movimientos');
  }
  return `/api/admin/tiendas/${tiendaId}/inventario/movimientos/${resource}`;
};

export const getMovimientosProductos = async (tiendaId, sedeId) => {
  if (!tiendaId || !sedeId) {
    throw new Error('tiendaId y sedeId son requeridos para listar movimientos de productos');
  }
  const { data } = await apiClient.get(
    `${buildMovimientosUrl(tiendaId, 'productos')}/sede/${sedeId}`
  );
  return data;
};

export const getMovimientosInsumos = async (tiendaId, sedeId) => {
  if (!tiendaId || !sedeId) {
    throw new Error('tiendaId y sedeId son requeridos para listar movimientos de insumos');
  }
  const { data } = await apiClient.get(
    `${buildMovimientosUrl(tiendaId, 'insumos')}/sede/${sedeId}`
  );
  return data;
};

export const crearMovimientoInventarioProducto = async (tiendaId, payload) => {
  const { data } = await apiClient.post(
    buildMovimientosUrl(tiendaId, 'productos'),
    payload
  );
  return data;
};
