const NEGATIVE_TYPES = new Set(['retiro_efectivo', 'gasto_operativo', 'devolucion']);
const POSITIVE_TYPES = new Set(['venta', 'ingreso_efectivo']);

const normalizeTipoMovimiento = (tipo) => {
    if (!tipo) {
        return '';
    }
    if (typeof tipo === 'string') {
        return tipo.toLowerCase();
    }
    if (typeof tipo === 'object' && 'value' in tipo && typeof tipo.value === 'string') {
        return tipo.value.toLowerCase();
    }
    return String(tipo).toLowerCase();
};

export const getSignedMovimientoAmount = (movimiento) => {
    if (!movimiento) {
        return 0;
    }
    const rawAmount = Number(movimiento.montoCentimos);
    if (Number.isNaN(rawAmount) || rawAmount === 0) {
        return 0;
    }
    const tipo = normalizeTipoMovimiento(movimiento.tipoMovimiento);
    if (NEGATIVE_TYPES.has(tipo)) {
        return -Math.abs(rawAmount);
    }
    if (POSITIVE_TYPES.has(tipo)) {
        return Math.abs(rawAmount);
    }
    return rawAmount;
};

export const sumMovimientosSigned = (movimientos = []) => {
    if (!Array.isArray(movimientos)) {
        return 0;
    }
    return movimientos.reduce((acc, mov) => acc + getSignedMovimientoAmount(mov), 0);
};

export const computeExpectedFinalCentimos = (sesion, movimientos = []) => {
    const base = Number(sesion?.montoInicialCentimos) || 0;
    return base + sumMovimientosSigned(movimientos);
};
