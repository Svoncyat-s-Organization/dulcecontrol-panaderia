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

const ordenesBaseKey = (tiendaId, sedeId = null) => ['compras-ordenes', tiendaId ?? null, sedeId ?? null];

export const ORDENES_COMPRA_KEYS = {
  all: (tiendaId, sedeId = null) => ordenesBaseKey(tiendaId, sedeId),
  lists: (tiendaId, sedeId = null, filters = {}) => [
    ...ordenesBaseKey(tiendaId, sedeId),
    'list',
    filters,
  ],
  pendientes: (tiendaId, sedeId = null) => [
    ...ordenesBaseKey(tiendaId, sedeId),
    'pendientes',
  ],
  detail: (tiendaId, sedeId = null, ordenId) => [
    ...ordenesBaseKey(tiendaId, sedeId),
    'detail',
    ordenId,
  ],
};

export const SEDES_KEYS = {
  all: (tiendaId) => ['sedes', tiendaId],
  lists: (tiendaId) => [...SEDES_KEYS.all(tiendaId), 'list'],
};
