-- =============================================================================
-- DULCE CONTROL - V9: Vistas de Reporte y Optimizaciones
-- Fecha: 2025-10-08
-- Descripción: Vistas para reportes y análisis de negocio
-- =============================================================================

SET search_path = dulce_control, public;

-- =============================================================================
-- 1. VISTA: Resumen de pagos por venta
-- =============================================================================
CREATE OR REPLACE VIEW vw_resumen_venta_pago AS
SELECT 
  v.id AS venta_id,
  v.fecha,
  v.sede_id,
  v.estado,
  v.subtotal,
  v.impuesto,
  v.total,
  COALESCE(SUM(pv.monto) FILTER (WHERE pv.metodo_pago = 'efectivo'), 0) AS efectivo,
  COALESCE(SUM(pv.monto) FILTER (WHERE pv.metodo_pago = 'yape'), 0) AS yape,
  COALESCE(SUM(pv.monto) FILTER (WHERE pv.metodo_pago = 'plin'), 0) AS plin,
  COALESCE(SUM(pv.monto) FILTER (WHERE pv.metodo_pago = 'tarjeta'), 0) AS tarjeta,
  COALESCE(SUM(pv.monto), 0) AS total_pagado
FROM venta v
LEFT JOIN pago_venta pv ON pv.venta_id = v.id
GROUP BY v.id, v.fecha, v.sede_id, v.estado, v.subtotal, v.impuesto, v.total;

COMMENT ON VIEW vw_resumen_venta_pago IS 
'Resumen de ventas con desglose de métodos de pago';

-- =============================================================================
-- 2. VISTA: Totales y saldo de pedidos
-- =============================================================================
CREATE OR REPLACE VIEW vw_pedido_totales AS
SELECT 
  p.id AS pedido_id,
  p.sede_id,
  p.cliente_id,
  p.estado,
  p.fecha_creacion,
  p.fecha_entrega,
  COALESCE(SUM(pi.subtotal), 0) AS total_pedido,
  COALESCE(pe.costo_envio, 0) AS costo_envio,
  COALESCE(SUM(pi.subtotal), 0) + COALESCE(pe.costo_envio, 0) AS total_con_envio,
  COALESCE(SUM(pp.monto), 0) AS total_pagado,
  (COALESCE(SUM(pi.subtotal), 0) + COALESCE(pe.costo_envio, 0)) - COALESCE(SUM(pp.monto), 0) AS saldo_pendiente
FROM pedido p
LEFT JOIN pedido_item pi ON pi.pedido_id = p.id
LEFT JOIN pago_pedido pp ON pp.pedido_id = p.id
LEFT JOIN pedido_entrega pe ON pe.pedido_id = p.id
GROUP BY p.id, p.sede_id, p.cliente_id, p.estado, p.fecha_creacion, p.fecha_entrega, pe.costo_envio;

COMMENT ON VIEW vw_pedido_totales IS 
'Resumen de pedidos con totales, pagos y saldo pendiente';

-- =============================================================================
-- 3. VISTA: Progreso de planes de producción
-- =============================================================================
CREATE OR REPLACE VIEW vw_plan_produccion_progreso AS
SELECT 
  pl.id AS plan_id,
  pl.sede_id,
  pl.fecha,
  pl.confirmado,
  COUNT(ppi.id) AS total_productos,
  COUNT(ppi.id) FILTER (WHERE ppi.completado = TRUE) AS productos_completados,
  COUNT(ppi.id) FILTER (WHERE ppi.completado = FALSE) AS productos_pendientes,
  CASE 
    WHEN COUNT(ppi.id) = 0 THEN 0
    ELSE ROUND((COUNT(ppi.id) FILTER (WHERE ppi.completado = TRUE)::NUMERIC / COUNT(ppi.id)::NUMERIC) * 100, 2)
  END AS porcentaje_completado,
  SUM(ppi.cantidad_objetivo) AS cantidad_objetivo_total,
  SUM(ppi.cantidad_completada) AS cantidad_completada_total
FROM plan_produccion pl
LEFT JOIN plan_produccion_item ppi ON ppi.plan_id = pl.id
GROUP BY pl.id, pl.sede_id, pl.fecha, pl.confirmado;

COMMENT ON VIEW vw_plan_produccion_progreso IS 
'Resumen del progreso de planes de producción por día';

-- =============================================================================
-- 4. VISTA: Inventario con alertas de stock bajo
-- =============================================================================
CREATE OR REPLACE VIEW vw_inventario_alertas AS
SELECT 
  ip.sede_id,
  s.nombre AS sede_nombre,
  ip.producto_id,
  p.codigo AS producto_codigo,
  p.nombre AS producto_nombre,
  ip.stock_actual,
  ip.stock_minimo,
  ic.stock_ideal,
  CASE 
    WHEN ip.stock_actual <= ip.stock_minimo THEN 'CRÍTICO'
    WHEN ip.stock_actual <= (ip.stock_minimo * 1.5) THEN 'BAJO'
    WHEN ic.stock_ideal IS NOT NULL AND ip.stock_actual < ic.stock_ideal THEN 'REABASTECER'
    ELSE 'OK'
  END AS estado_stock,
  CASE 
    WHEN ic.stock_ideal IS NOT NULL THEN ic.stock_ideal - ip.stock_actual
    ELSE NULL
  END AS cantidad_sugerida_producir
FROM inventario_producto ip
INNER JOIN producto p ON p.id = ip.producto_id
INNER JOIN sede s ON s.id = ip.sede_id
LEFT JOIN inventario_config ic ON ic.sede_id = ip.sede_id AND ic.producto_id = ip.producto_id
WHERE p.activo = TRUE;

COMMENT ON VIEW vw_inventario_alertas IS 
'Inventario con alertas de stock bajo y sugerencias de producción';

-- =============================================================================
-- 5. VISTA: Resumen de ventas diarias por sede
-- =============================================================================
CREATE OR REPLACE VIEW vw_ventas_diarias AS
SELECT 
  v.sede_id,
  s.nombre AS sede_nombre,
  DATE(v.fecha) AS fecha,
  COUNT(v.id) AS total_ventas,
  COUNT(v.id) FILTER (WHERE v.estado = 'emitida') AS ventas_emitidas,
  COUNT(v.id) FILTER (WHERE v.estado = 'anulada') AS ventas_anuladas,
  COALESCE(SUM(v.total) FILTER (WHERE v.estado = 'emitida'), 0) AS total_ingresos,
  COALESCE(AVG(v.total) FILTER (WHERE v.estado = 'emitida'), 0) AS ticket_promedio
FROM venta v
INNER JOIN sede s ON s.id = v.sede_id
GROUP BY v.sede_id, s.nombre, DATE(v.fecha);

COMMENT ON VIEW vw_ventas_diarias IS 
'Resumen de ventas diarias por sede con métricas clave';

-- =============================================================================
-- 6. VISTA: Top productos más vendidos
-- =============================================================================
CREATE OR REPLACE VIEW vw_productos_top_ventas AS
SELECT 
  p.id AS producto_id,
  p.codigo,
  p.nombre,
  p.categoria_id,
  c.nombre AS categoria_nombre,
  SUM(vi.cantidad) AS cantidad_total_vendida,
  COUNT(DISTINCT vi.venta_id) AS numero_ventas,
  SUM(vi.total_item) AS ingresos_totales,
  AVG(vi.precio_unitario) AS precio_promedio
FROM venta_item vi
INNER JOIN producto p ON p.id = vi.producto_id
INNER JOIN venta v ON v.id = vi.venta_id
LEFT JOIN categoria_producto c ON c.id = p.categoria_id
WHERE v.estado = 'emitida'
  AND v.fecha >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.id, p.codigo, p.nombre, p.categoria_id, c.nombre
ORDER BY cantidad_total_vendida DESC;

COMMENT ON VIEW vw_productos_top_ventas IS 
'Productos más vendidos en los últimos 30 días';

-- =============================================================================
-- ÍNDICES ADICIONALES DE OPTIMIZACIÓN
-- =============================================================================

-- Optimizar búsquedas de ventas por rango de fechas
CREATE INDEX IF NOT EXISTS idx_venta_fecha_estado 
ON venta(fecha, estado) WHERE estado = 'emitida';

-- Optimizar búsquedas de pedidos por estado y fecha de entrega
CREATE INDEX IF NOT EXISTS idx_pedido_estado_entrega 
ON pedido(estado, fecha_entrega) WHERE estado NOT IN ('entregado', 'anulado');

-- Optimizar consultas de inventario bajo
CREATE INDEX IF NOT EXISTS idx_inventario_stock_critico 
ON inventario_producto(sede_id, producto_id) 
WHERE stock_actual <= stock_minimo;
