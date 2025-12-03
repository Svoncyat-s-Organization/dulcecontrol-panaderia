export const CAJA_KEYS = {
    all: ['cajas'],
    lists: (tiendaId) => ['cajas', 'list', tiendaId],
    sesiones: (tiendaId) => ['cajas', 'sesiones', tiendaId],
    sesionActive: (tiendaId, usuarioId) => ['cajas', 'sesion-active', tiendaId, usuarioId],
    movimientos: (tiendaId, sesionId) => ['cajas', 'movimientos', tiendaId, sesionId],
    usuarioActual: (tiendaId, correo) => ['cajas', 'usuario-actual', tiendaId, correo],
};

export const PEDIDO_KEYS = {
    all: ['pedidos'],
    lists: (tiendaId, filters) => ['pedidos', 'list', tiendaId, { ...filters }],
    detail: (tiendaId, pedidoId) => ['pedidos', 'detail', tiendaId, pedidoId],
    pagos: (tiendaId, pedidoId) => ['pedidos', 'pagos', tiendaId, pedidoId],
    detalles: (tiendaId, pedidoId) => ['pedidos', 'detalles', tiendaId, pedidoId],
};

export const FACTURACION_KEYS = {
    configuracion: (tiendaId) => ['facturacion', 'configuracion', tiendaId],
    series: (tiendaId, sedeId) => ['facturacion', 'series', tiendaId, sedeId],
};
