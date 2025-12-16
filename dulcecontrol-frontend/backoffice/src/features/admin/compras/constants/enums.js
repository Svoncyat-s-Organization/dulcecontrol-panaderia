export const UNIDADES_MEDIDA = {
  unidad: 'Unidad',
  kg: 'Kg',
  g: 'g',
  l: 'L',
  ml: 'ml',
  paquete: 'Paquete',
  saco: 'Saco',
  lata: 'Lata',
};

export const TIPO_DOCUMENTO = {
  DNI: 'DNI',
  RUC: 'RUC',
};

export const ESTADO_ORDEN_COMPRA = {
  BORRADOR: 'Borrador',
  ENVIADA: 'Enviada',
  RECIBIDA_PARCIAL: 'Recibida Parcial',
  RECIBIDA_TOTAL: 'Recibida Total',
  CANCELADA: 'Cancelada',
};

export const ESTADO_ORDEN_COMPRA_VALUES = {
  BORRADOR: 'borrador',
  ENVIADA: 'enviada',
  RECIBIDA_PARCIAL: 'recibida_parcial',
  RECIBIDA_TOTAL: 'recibida_total',
  CANCELADA: 'cancelada',
};

export const METODO_PAGO = {
  efectivo: 'Efectivo',
  credito: 'Crédito',
};

export const TIPO_COMPROBANTE = {
  factura: 'Factura',
  boleta: 'Boleta',
  nota_credito: 'Nota de Crédito',
  nota_debito: 'Nota de Débito',
};

export const getEstadoColor = (estado) => {
  const colorMap = {
    borrador: 'default',
    enviada: 'processing',
    recibida_parcial: 'warning',
    recibida_total: 'success',
    cancelada: 'error',
  };
  return colorMap[estado] || 'default';
};
