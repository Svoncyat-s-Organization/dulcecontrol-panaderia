import dayjs from 'dayjs';

/**
 * Formatea una fecha para mostrar en UI
 */
export const formatFecha = (fecha) => {
  if (!fecha) return '-';
  return dayjs(fecha).format('DD/MM/YYYY');
};

/**
 * Formatea una hora para mostrar en UI
 */
export const formatHora = (datetime) => {
  if (!datetime) return '-';
  return dayjs(datetime).format('HH:mm');
};

/**
 * Verifica si una fecha es hoy
 */
export const isHoy = (fecha) => {
  if (!fecha) return false;
  return dayjs(fecha).isSame(dayjs(), 'day');
};

/**
 * Verifica si una fecha es mañana
 */
export const isManana = (fecha) => {
  if (!fecha) return false;
  return dayjs(fecha).isSame(dayjs().add(1, 'day'), 'day');
};

/**
 * Verifica si una fecha es ayer
 */
export const isAyer = (fecha) => {
  if (!fecha) return false;
  return dayjs(fecha).isSame(dayjs().subtract(1, 'day'), 'day');
};

/**
 * Obtiene etiqueta relativa de fecha
 */
export const getFechaLabel = (fecha) => {
  if (!fecha) return '';
  if (isHoy(fecha)) return 'Hoy';
  if (isManana(fecha)) return 'Mañana';
  if (isAyer(fecha)) return 'Ayer';
  return formatFecha(fecha);
};

/**
 * Calcula el progreso de producción
 */
export const calcularProgresoPlan = (detalles = []) => {
  if (!detalles.length) return 0;
  
  const terminados = detalles.filter(d => d.estado === 'TERMINADO').length;
  return Math.round((terminados / detalles.length) * 100);
};

/**
 * Agrupa detalles por origen
 */
export const agruparDetallesPorOrigen = (detalles = []) => {
  const stockDiario = detalles.filter(d => d.origen === 'STOCK_DIARIO');
  const pedidosCliente = detalles.filter(d => d.origen === 'PEDIDO_CLIENTE');
  
  return { stockDiario, pedidosCliente };
};

/**
 * Calcula totales de un plan
 */
export const calcularTotalesPlan = (detalles = []) => {
  const totales = detalles.reduce(
    (acc, detalle) => ({
      planificado: acc.planificado + (detalle.cantidadPlanificada || 0),
      producido: acc.producido + (detalle.cantidadProducida || 0),
      merma: acc.merma + (detalle.cantidadMerma || 0),
    }),
    { planificado: 0, producido: 0, merma: 0 }
  );
  
  totales.pendiente = totales.planificado - totales.producido;
  totales.porcentajeMerma = totales.planificado > 0 
    ? Math.round((totales.merma / totales.planificado) * 100) 
    : 0;
  
  return totales;
};

/**
 * Valida que se pueda confirmar un plan
 */
export const validarConfirmacionPlan = (plan) => {
  if (!plan) return { valid: false, message: 'Plan no encontrado' };
  
  if (plan.estado !== 'BORRADOR') {
    return { valid: false, message: 'Solo se pueden confirmar planes en estado BORRADOR' };
  }
  
  if (!plan.detalles || plan.detalles.length === 0) {
    return { valid: false, message: 'El plan no tiene items para producir' };
  }
  
  return { valid: true };
};

/**
 * Valida que se pueda iniciar producción
 */
export const validarInicioPlan = (plan) => {
  if (!plan) return { valid: false, message: 'Plan no encontrado' };
  
  if (plan.estado !== 'CONFIRMADO') {
    return { valid: false, message: 'Solo se pueden iniciar planes CONFIRMADOS' };
  }
  
  return { valid: true };
};

/**
 * Prepara payload para crear conteo diario
 */
export const prepareConteoPayload = (values, sedeId, responsableId) => {
  return {
    sedeId,
    fechaConteo: values.fechaConteo,
    responsableId,
    observaciones: values.observaciones || '',
    detalles: values.detalles || [],
  };
};

/**
 * Prepara payload para actualizar detalle de plan
 */
export const prepareDetalleUpdatePayload = (values) => {
  return {
    cantidadProducida: parseInt(values.cantidadProducida, 10) || 0,
    cantidadMerma: parseInt(values.cantidadMerma, 10) || 0,
    estado: values.estado,
    observaciones: values.observaciones || '',
  };
};
