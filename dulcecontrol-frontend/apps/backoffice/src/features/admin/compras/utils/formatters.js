export const formatCurrency = (centimos) => {
  if (centimos === null || centimos === undefined) return 'S/ 0.00';
  const amount = Number(centimos) / 100;
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/D';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/D';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const DECIMAL_UNITS = ['KG', 'G', 'L', 'ML'];

const needsDecimals = (unidad) => {
  return DECIMAL_UNITS.includes((unidad ?? '').toUpperCase());
};

export const formatQuantity = (cantidad, unidad) => {
  const rawValue = Number(cantidad ?? 0);
  const precision = needsDecimals(unidad) ? 2 : 0;
  const formatted = Number.isFinite(rawValue)
    ? rawValue.toLocaleString('es-PE', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      })
    : '0';
  return `${formatted} ${unidad ?? ''}`.trim();
};

export const centimosToDecimal = (centimos) => {
  return Number(centimos ?? 0) / 100;
};

export const decimalToCentimos = (decimal) => {
  return Math.round(Number(decimal ?? 0) * 100);
};
