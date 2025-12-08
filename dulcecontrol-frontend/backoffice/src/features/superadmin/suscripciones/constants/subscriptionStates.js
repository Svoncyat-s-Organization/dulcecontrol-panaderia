export const SUBSCRIPTION_STATES = {
    EN_PRUEBA: 'EN_PRUEBA',
    ACTIVA: 'ACTIVA',
    VENCIDA: 'VENCIDA',
    CANCELADA: 'CANCELADA',
};

export const SUBSCRIPTION_STATE_LABELS = {
    [SUBSCRIPTION_STATES.EN_PRUEBA]: 'En Prueba',
    [SUBSCRIPTION_STATES.ACTIVA]: 'Activa',
    [SUBSCRIPTION_STATES.VENCIDA]: 'Vencida',
    [SUBSCRIPTION_STATES.CANCELADA]: 'Cancelada',
};

export const SUBSCRIPTION_STATE_COLORS = {
    [SUBSCRIPTION_STATES.EN_PRUEBA]: 'blue',
    [SUBSCRIPTION_STATES.ACTIVA]: 'green',
    [SUBSCRIPTION_STATES.VENCIDA]: 'orange',
    [SUBSCRIPTION_STATES.CANCELADA]: 'red',
};

export const getStateTag = (estado) => ({
    label: SUBSCRIPTION_STATE_LABELS[estado] || estado,
    color: SUBSCRIPTION_STATE_COLORS[estado] || 'default',
});
