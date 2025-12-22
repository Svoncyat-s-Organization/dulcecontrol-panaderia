import apiClient from '../../../../api/apiClient.js';

const buildInventarioProductosUrl = (tiendaId, suffix = '') => {
  if (!tiendaId) {
    throw new Error('tiendaId es requerido para consultar inventario de productos');
  }
  return `/api/admin/tiendas/${tiendaId}/inventario/productos${suffix}`;
};

export const getInventarioProductos = async (tiendaId, params = {}) => {
  const { data } = await apiClient.get(buildInventarioProductosUrl(tiendaId), {
    params,
  });
  return data;
};

export const getInventarioProductosPorSede = async (tiendaId, sedeId) => {
  if (!sedeId) {
    throw new Error('sedeId es requerido para consultar inventario por sede');
  }
  const { data } = await apiClient.get(
    buildInventarioProductosUrl(tiendaId, `/sede/${sedeId}`)
  );
  return data;
};

export const getInventarioProductoPorSedeYProducto = async (
  tiendaId,
  sedeId,
  productoId
) => {
  const inventarios = await getInventarioProductosPorSede(tiendaId, sedeId);
  return inventarios.find(
    (registro) => String(registro.productoId) === String(productoId)
  );
};

export const updateInventarioProducto = async (tiendaId, inventarioId, payload) => {
  const { data } = await apiClient.put(
    buildInventarioProductosUrl(tiendaId, `/${inventarioId}`),
    payload
  );
  return data;
};

export const updateUbicacionInventarioProducto = async (tiendaId, inventarioId, ubicacionFisica) => {
  const { data } = await apiClient.patch(
    buildInventarioProductosUrl(tiendaId, `/${inventarioId}/ubicacion`),
    { ubicacionFisica }
  );
  return data;
};
