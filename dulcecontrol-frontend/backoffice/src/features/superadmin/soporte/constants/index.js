export const ESTADO_TICKET_META = {
    abierto: { label: 'Abierto', color: 'processing' },
    pendiente_cliente: { label: 'Pendiente del cliente', color: 'warning' },
    resuelto: { label: 'Resuelto', color: 'success' },
    cerrado: { label: 'Cerrado', color: 'default' },
};

export const PRIORIDAD_TICKET_META = {
    baja: { label: 'Baja', color: 'green' },
    media: { label: 'Media', color: 'blue' },
    alta: { label: 'Alta', color: 'orange' },
    critica: { label: 'Crítica', color: 'red' },
};

export const TIPO_REMITENTE_META = {
    superadmin: { label: 'Equipo Superadmin' },
    tienda: { label: 'Tienda' },
    sistema: { label: 'Sistema' },
};

export const ESTADO_TICKET_OPTIONS = Object.entries(ESTADO_TICKET_META).map(([value, meta]) => ({
    value,
    label: meta.label,
}));

export const PRIORIDAD_TICKET_OPTIONS = Object.entries(PRIORIDAD_TICKET_META).map(([value, meta]) => ({
    value,
    label: meta.label,
}));

export const TIPO_REMITENTE_OPTIONS = Object.entries(TIPO_REMITENTE_META).map(([value, meta]) => ({
    value,
    label: meta.label,
}));
