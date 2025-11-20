export const INVENTARIO_PRODUCTO_KEYS = {
  all: (tiendaId) => ['inventario-productos', tiendaId],
  lists: (tiendaId, sedeId) => [
    ...INVENTARIO_PRODUCTO_KEYS.all(tiendaId),
    { sedeId: sedeId ?? null },
  ],
  detail: (tiendaId, inventarioId) => [
    ...INVENTARIO_PRODUCTO_KEYS.all(tiendaId),
    'detail',
    inventarioId,
  ],
};

export const INVENTARIO_INSUMO_KEYS = {
  all: (tiendaId) => ['inventario-insumos', tiendaId],
  lists: (tiendaId, sedeId) => [
    ...INVENTARIO_INSUMO_KEYS.all(tiendaId),
    { sedeId: sedeId ?? null },
  ],
  detail: (tiendaId, inventarioId) => [
    ...INVENTARIO_INSUMO_KEYS.all(tiendaId),
    'detail',
    inventarioId,
  ],
};

export const INVENTARIO_MOVIMIENTO_KEYS = {
  productos: {
    all: (tiendaId) => ['inventario-movimientos-productos', tiendaId],
    lists: (tiendaId, sedeId) => [
      ...INVENTARIO_MOVIMIENTO_KEYS.productos.all(tiendaId),
      { sedeId: sedeId ?? null },
    ],
  },
  insumos: {
    all: (tiendaId) => ['inventario-movimientos-insumos', tiendaId],
    lists: (tiendaId, sedeId) => [
      ...INVENTARIO_MOVIMIENTO_KEYS.insumos.all(tiendaId),
      { sedeId: sedeId ?? null },
    ],
  },
};
