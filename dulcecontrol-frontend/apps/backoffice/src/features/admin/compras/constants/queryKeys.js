export const INSUMOS_KEYS = {
  all: (tiendaId) => ['compras-insumos', tiendaId],
  lists: (tiendaId, filters = {}) => [
    ...INSUMOS_KEYS.all(tiendaId),
    'list',
    filters,
  ],
  detail: (tiendaId, insumoId) => [
    ...INSUMOS_KEYS.all(tiendaId),
    'detail',
    insumoId,
  ],
};

export const PROVEEDORES_KEYS = {
  all: (tiendaId) => ['compras-proveedores', tiendaId],
  lists: (tiendaId, filters = {}) => [
    ...PROVEEDORES_KEYS.all(tiendaId),
    'list',
    filters,
  ],
  detail: (tiendaId, proveedorId) => [
    ...PROVEEDORES_KEYS.all(tiendaId),
    'detail',
    proveedorId,
  ],
};

export const ORDENES_COMPRA_KEYS = {
  all: (tiendaId) => ['compras-ordenes', tiendaId],
  lists: (tiendaId, filters = {}) => [
    ...ORDENES_COMPRA_KEYS.all(tiendaId),
    'list',
    filters,
  ],
  pendientes: (tiendaId, sedeId = null) => [
    ...ORDENES_COMPRA_KEYS.all(tiendaId),
    'pendientes',
    sedeId,
  ],
  detail: (tiendaId, ordenId) => [
    ...ORDENES_COMPRA_KEYS.all(tiendaId),
    'detail',
    ordenId,
  ],
};

export const SEDES_KEYS = {
  all: (tiendaId) => ['sedes', tiendaId],
  lists: (tiendaId) => [...SEDES_KEYS.all(tiendaId), 'list'],
};
