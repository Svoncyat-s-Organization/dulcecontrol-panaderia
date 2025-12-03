// Estados del plan de producción
export const ESTADO_PLAN = {
  BORRADOR: 'BORRADOR',
  CONFIRMADO: 'CONFIRMADO',
  EN_PROCESO: 'EN_PROCESO',
  FINALIZADO: 'FINALIZADO',
  CANCELADO: 'CANCELADO',
};

export const ESTADO_PLAN_CONFIG = {
  [ESTADO_PLAN.BORRADOR]: {
    label: 'Borrador',
    color: 'default',
    description: 'Plan generado, pendiente de revisión',
  },
  [ESTADO_PLAN.CONFIRMADO]: {
    label: 'Confirmado',
    color: 'blue',
    description: 'Plan aprobado, listo para producir',
  },
  [ESTADO_PLAN.EN_PROCESO]: {
    label: 'En Proceso',
    color: 'processing',
    description: 'Producción en curso',
  },
  [ESTADO_PLAN.FINALIZADO]: {
    label: 'Finalizado',
    color: 'success',
    description: 'Producción completada',
  },
  [ESTADO_PLAN.CANCELADO]: {
    label: 'Cancelado',
    color: 'error',
    description: 'Plan cancelado',
  },
};

// Estados de items de producción
export const ESTADO_ITEM = {
  PENDIENTE: 'PENDIENTE',
  EN_HORNO: 'EN_HORNO',
  TERMINADO: 'TERMINADO',
  MERMA: 'MERMA',
};

export const ESTADO_ITEM_CONFIG = {
  [ESTADO_ITEM.PENDIENTE]: {
    label: 'Pendiente',
    color: 'default',
  },
  [ESTADO_ITEM.EN_HORNO]: {
    label: 'En Horno',
    color: 'processing',
  },
  [ESTADO_ITEM.TERMINADO]: {
    label: 'Terminado',
    color: 'success',
  },
  [ESTADO_ITEM.MERMA]: {
    label: 'Merma',
    color: 'error',
  },
};

// Origen de items de producción
export const ORIGEN_ITEM = {
  STOCK_DIARIO: 'STOCK_DIARIO',
  PEDIDO_CLIENTE: 'PEDIDO_CLIENTE',
};

export const ORIGEN_ITEM_CONFIG = {
  [ORIGEN_ITEM.STOCK_DIARIO]: {
    label: 'Stock Diario',
    color: 'blue',
    icon: '📦',
  },
  [ORIGEN_ITEM.PEDIDO_CLIENTE]: {
    label: 'Pedido Cliente',
    color: 'orange',
    icon: '🎂',
  },
};
