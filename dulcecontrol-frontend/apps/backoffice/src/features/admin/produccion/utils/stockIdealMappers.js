/**
 * Mezcla la lista de productos con la data de stock ideal.
 * Los productos sin configuración aparecen con valores en 0.
 */
export const mergeProductosConStockIdeal = (productos = [], stockIdealData = [], sedeId) => {
  if (!productos.length) return [];
  
  // Crear un mapa de stock ideal por productoId
  const stockMap = new Map();
  stockIdealData.forEach((stock) => {
    if (stock.sedeId === sedeId) {
      stockMap.set(stock.productoId, stock);
    }
  });

  // Mezclar productos con stock ideal
  return productos
    .filter((producto) => producto.activo) // Solo productos activos
    .map((producto) => {
      const stock = stockMap.get(producto.id);
      
      return {
        key: producto.id,
        productoId: producto.id,
        productoNombre: producto.nombre,
        productoSku: producto.sku,
        productoCategoria: producto.categoriaNombre,
        stockId: stock?.id || null,
        cantidadIdeal: stock?.cantidadIdeal ?? 0,
        puntoReposicion: stock?.puntoReposicion ?? 0,
        actualizadoEn: stock?.actualizadoEn || null,
        tieneConfiguracion: Boolean(stock),
      };
    });
};

/**
 * Prepara el payload para crear o actualizar stock ideal
 */
export const prepareStockIdealPayload = (values, sedeId) => {
  return {
    sedeId,
    productoId: values.productoId,
    cantidadIdeal: parseInt(values.cantidadIdeal, 10) || 0,
    puntoReposicion: parseInt(values.puntoReposicion, 10) || 0,
  };
};

/**
 * Valida que la cantidad ideal sea mayor o igual al punto de reposición
 */
export const validateStockIdealRules = (cantidadIdeal, puntoReposicion) => {
  const ideal = parseInt(cantidadIdeal, 10) || 0;
  const punto = parseInt(puntoReposicion, 10) || 0;
  
  if (punto > ideal) {
    return {
      valid: false,
      message: 'El punto de reposición no puede ser mayor que la cantidad ideal',
    };
  }
  
  return { valid: true };
};
