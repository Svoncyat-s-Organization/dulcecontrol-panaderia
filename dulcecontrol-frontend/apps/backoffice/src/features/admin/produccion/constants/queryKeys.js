const baseKey = (tiendaId) => ['admin-produccion', tiendaId ?? null];

export const PRODUCTION_KEYS = {
  stockIdeal: (tiendaId, sedeId = null) => [...baseKey(tiendaId), 'stock-ideal', sedeId ?? null],
  recetas: (tiendaId) => [...baseKey(tiendaId), 'recetas'],
  productos: (tiendaId) => [...baseKey(tiendaId), 'productos'],
  insumos: (tiendaId) => [...baseKey(tiendaId), 'insumos'],
  conteos: (tiendaId, sedeId = null) => [...baseKey(tiendaId), 'conteos', sedeId ?? null],
  planChecklist: (tiendaId, sedeId = null, fecha = null) => [
    ...baseKey(tiendaId),
    'planificacion',
    sedeId ?? null,
    fecha ?? null,
  ],
};
