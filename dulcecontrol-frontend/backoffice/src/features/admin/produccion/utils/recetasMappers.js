import { UNIDADES_MEDIDA_CONFIG } from '../constants/recetasConstants.js';

/**
 * Formatea la cantidad con su unidad de medida
 * @param {number} cantidad
 * @param {string} unidadMedida
 * @returns {string}
 */
export const formatCantidadConUnidad = (cantidad, unidadMedida) => {
  if (!cantidad || !unidadMedida) return '-';
  
  const config = UNIDADES_MEDIDA_CONFIG[unidadMedida];
  const abbreviation = config?.abbreviation || unidadMedida.toLowerCase();
  
  // Formatear número: si es entero, sin decimales; si no, máximo 4 decimales
  const cantidadStr = Number.isInteger(cantidad) 
    ? cantidad.toString() 
    : parseFloat(cantidad).toFixed(4).replace(/\.?0+$/, '');
  
  return `${cantidadStr} ${abbreviation}`;
};

/**
 * Prepara el payload para crear/actualizar receta
 * @param {Object} values - Valores del formulario
 * @returns {Object}
 */
export const prepareRecetaPayload = (values) => {
  return {
    productoId: values.productoId,
    insumoId: values.insumoId,
    cantidadRequerida: parseFloat(values.cantidadRequerida),
    unidadMedida: values.unidadMedida,
    notasPreparacion: values.notasPreparacion?.trim() || null,
  };
};

/**
 * Valida que la cantidad sea mayor a 0
 * @param {number} cantidad
 * @returns {boolean}
 */
export const validateCantidad = (cantidad) => {
  return cantidad && cantidad > 0;
};

/**
 * Agrupa recetas por producto
 * @param {Array} recetas
 * @returns {Object} - Map de productoId -> array de recetas
 */
export const groupRecetasByProducto = (recetas) => {
  return recetas.reduce((acc, receta) => {
    const key = receta.productoId;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(receta);
    return acc;
  }, {});
};

/**
 * Calcula el costo total de una receta basado en los costos de insumos
 * (Para feature futura cuando tengamos costos de insumos)
 * @param {Array} insumosReceta - Array de {cantidadRequerida, costoUnitario}
 * @returns {number}
 */
export const calcularCostoReceta = (insumosReceta) => {
  return insumosReceta.reduce((total, item) => {
    return total + (item.cantidadRequerida * (item.costoUnitario || 0));
  }, 0);
};
