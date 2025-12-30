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
    filters.cajaId || 'caja',
  ];
  return parts.join('|');
};

export const REPORTES_KEYS = {
  base: [...REPORTES_KEY_ROOT],
  pedidos: (tiendaId, filters) => [...REPORTES_KEY_ROOT, 'pedidos', tiendaId ?? 'unknown', buildFilterKey(filters)],
  productos: (tiendaId) => [...REPORTES_KEY_ROOT, 'productos', tiendaId ?? 'unknown'],
  categorias: (tiendaId) => [...REPORTES_KEY_ROOT, 'categorias', tiendaId ?? 'unknown'],
  clientes: (tiendaId) => [...REPORTES_KEY_ROOT, 'clientes', tiendaId ?? 'unknown'],
  sesionesCaja: (tiendaId) => [...REPORTES_KEY_ROOT, 'sesiones-caja', tiendaId ?? 'unknown'],
  cajas: (tiendaId) => [...REPORTES_KEY_ROOT, 'cajas', tiendaId ?? 'unknown'],
  movimientos: (tiendaId, filtroSesiones) => [
    ...REPORTES_KEY_ROOT,
    'movimientos-caja',
    tiendaId ?? 'unknown',
    Array.isArray(filtroSesiones) && filtroSesiones.length > 0
      ? filtroSesiones.join(',')
      : 'sin-sesiones',
  ],
};

export default REPORTES_KEYS;
