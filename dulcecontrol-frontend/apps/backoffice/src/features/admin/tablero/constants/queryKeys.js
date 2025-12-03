export const TABLERO_KEYS = {
    all: ['tablero'],
    estadisticas: (tiendaId, sedeId) => [...TABLERO_KEYS.all, 'estadisticas', tiendaId, sedeId],
};
