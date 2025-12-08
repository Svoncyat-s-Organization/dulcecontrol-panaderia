const cajaBase = (tiendaId, sedeId) => ['cajas', tiendaId ?? null, sedeId ?? null];

export const CAJA_KEYS = {
    base: cajaBase,
    lists: (tiendaId, sedeId) => [...cajaBase(tiendaId, sedeId), 'list'],
    sesiones: (tiendaId, sedeId) => [...cajaBase(tiendaId, sedeId), 'sesiones'],
    sesionActive: (tiendaId, sedeId, usuarioId) => [...cajaBase(tiendaId, sedeId), 'sesion-active', usuarioId ?? null],
    movimientos: (tiendaId, sedeId, sesionId) => [...cajaBase(tiendaId, sedeId), 'movimientos', sesionId ?? null],
    usuarioActual: (tiendaId, correo) => ['cajas', 'usuario-actual', tiendaId ?? null, correo ?? null],
};

export const PEDIDO_KEYS = {
    base: (tiendaId, sedeId) => ['pedidos', tiendaId ?? null, sedeId ?? null],
    lists: (tiendaId, sedeId, filters) => ['pedidos', 'list', tiendaId ?? null, sedeId ?? null, { ...filters }],
    detail: (tiendaId, sedeId, pedidoId) => ['pedidos', 'detail', tiendaId ?? null, sedeId ?? null, pedidoId],
    pagos: (tiendaId, sedeId, pedidoId) => ['pedidos', 'pagos', tiendaId ?? null, sedeId ?? null, pedidoId],
    detalles: (tiendaId, sedeId, pedidoId) => ['pedidos', 'detalles', tiendaId ?? null, sedeId ?? null, pedidoId],
};

export const FACTURACION_KEYS = {
    configuracion: (tiendaId) => ['facturacion', 'configuracion', tiendaId],
    series: (tiendaId, sedeId) => ['facturacion', 'series', tiendaId, sedeId],
};

export const UBIGEO_KEYS = {
    departamentos: () => ['ubigeo', 'departamentos'],
    provincias: (departamentoId) => ['ubigeo', 'provincias', departamentoId ?? null],
    distritos: (provinciaId) => ['ubigeo', 'distritos', provinciaId ?? null],
    rutaDistrito: (distritoId) => ['ubigeo', 'ruta-distrito', distritoId ?? null],
};
