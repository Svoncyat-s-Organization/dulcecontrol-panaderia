export const MOVEMENT_TYPES = {
    ALTA: 'ALTA',
    RENOVACION: 'RENOVACION',
    UPGRADE: 'UPGRADE',
    DOWNGRADE: 'DOWNGRADE',
    CANCELACION: 'CANCELACION',
    REACTIVACION: 'REACTIVACION',
};

export const MOVEMENT_TYPE_LABELS = {
    [MOVEMENT_TYPES.ALTA]: 'Alta',
    [MOVEMENT_TYPES.RENOVACION]: 'Renovación',
    [MOVEMENT_TYPES.UPGRADE]: 'Upgrade',
    [MOVEMENT_TYPES.DOWNGRADE]: 'Downgrade',
    [MOVEMENT_TYPES.CANCELACION]: 'Cancelación',
    [MOVEMENT_TYPES.REACTIVACION]: 'Reactivación',
};

export const MOVEMENT_TYPE_COLORS = {
    [MOVEMENT_TYPES.ALTA]: 'green',
    [MOVEMENT_TYPES.RENOVACION]: 'blue',
    [MOVEMENT_TYPES.UPGRADE]: 'cyan',
    [MOVEMENT_TYPES.DOWNGRADE]: 'orange',
    [MOVEMENT_TYPES.CANCELACION]: 'red',
    [MOVEMENT_TYPES.REACTIVACION]: 'purple',
};

export const getMovementTag = (tipoMovimiento) => ({
    label: MOVEMENT_TYPE_LABELS[tipoMovimiento] || tipoMovimiento,
    color: MOVEMENT_TYPE_COLORS[tipoMovimiento] || 'default',
});
