export const STOCK_IDEAL_KEYS = {
  all: ['stock-ideal'],
  lists: (tiendaId, sedeId) => [...STOCK_IDEAL_KEYS.all, 'list', tiendaId, sedeId].filter(Boolean),
  detail: (tiendaId, stockId) => [...STOCK_IDEAL_KEYS.all, 'detail', tiendaId, stockId],
};

export const RECETA_KEYS = {
  all: ['recetas'],
  lists: (tiendaId) => [...RECETA_KEYS.all, 'list', tiendaId],
  detail: (tiendaId, recetaId) => [...RECETA_KEYS.all, 'detail', tiendaId, recetaId],
};

export const PLAN_PRODUCCION_KEYS = {
  all: ['planes-produccion'],
  lists: (tiendaId, sedeId) => [...PLAN_PRODUCCION_KEYS.all, 'list', tiendaId, sedeId].filter(Boolean),
  detail: (tiendaId, fecha, sedeId) => [...PLAN_PRODUCCION_KEYS.all, 'detail', tiendaId, fecha, sedeId].filter(Boolean),
};

export const CONTEO_DIARIO_KEYS = {
  all: ['conteos-diarios'],
  lists: (tiendaId, sedeId) => [...CONTEO_DIARIO_KEYS.all, 'list', tiendaId, sedeId].filter(Boolean),
  detail: (tiendaId, fecha, sedeId) => [...CONTEO_DIARIO_KEYS.all, 'detail', tiendaId, fecha, sedeId].filter(Boolean),
};
