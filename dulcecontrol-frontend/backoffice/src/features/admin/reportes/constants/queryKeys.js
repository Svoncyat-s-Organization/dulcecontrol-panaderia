const REPORTES_KEY_ROOT = ['admin-reportes'];

const buildFilterKey = (filters) => {
  if (!filters) {
    return 'default';
  }
  const parts = [
    filters.startDate || 'start',
    filters.endDate || 'end',
    filters.sedeId || 'sede',
    filters.canal || 'canal',
  ];
  return parts.join('|');
};

export const REPORTES_KEYS = {
  base: [...REPORTES_KEY_ROOT],
  pedidos: (tiendaId, filters) => [...REPORTES_KEY_ROOT, 'pedidos', tiendaId ?? 'unknown', buildFilterKey(filters)],
  productos: (tiendaId) => [...REPORTES_KEY_ROOT, 'productos', tiendaId ?? 'unknown'],
  categorias: (tiendaId) => [...REPORTES_KEY_ROOT, 'categorias', tiendaId ?? 'unknown'],
  clientes: (tiendaId) => [...REPORTES_KEY_ROOT, 'clientes', tiendaId ?? 'unknown'],
};

export default REPORTES_KEYS;
