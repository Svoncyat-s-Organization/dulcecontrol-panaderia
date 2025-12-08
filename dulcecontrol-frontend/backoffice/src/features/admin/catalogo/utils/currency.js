const formatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
});

export const formatPen = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 'S/. 0.00';
  }
  return formatter.format(Number(value));
};
