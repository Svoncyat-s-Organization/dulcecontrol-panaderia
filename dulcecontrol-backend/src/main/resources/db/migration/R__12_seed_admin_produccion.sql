-- ============================================================================
-- R_12: SEED MÓDULO DE PRODUCCIÓN (RECETAS, STOCK IDEAL, CONTEOS, PLANES)
-- ============================================================================

-- =================================
-- RECETAS (Productos con sus Insumos)
-- =================================

-- Las recetas relacionan productos con insumos, asumiendo que ya existen productos básicos

INSERT INTO recetas (tienda_id, producto_id, insumo_id, cantidad_requerida, unidad_medida, notas_preparacion)
SELECT new.tienda_id, new.producto_id, new.insumo_id, new.cantidad_requerida, new.unidad_medida, new.notas_preparacion
FROM (
  -- Receta Pan Francés (Dulce Manjar) - Asumiendo que existe un producto con SKU 'PAN-001'
  SELECT
    p.tienda_id,
    p.id AS producto_id,
    i.id AS insumo_id,
    0.5000 AS cantidad_requerida,
    'kg' AS unidad_medida,
    'Harina panadera para masa base' AS notas_preparacion
  FROM productos p
  INNER JOIN insumos i ON i.tienda_id = p.tienda_id
  WHERE p.sku = 'PAN-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND i.codigo_interno = 'INS-001'
  
  UNION ALL
  
  SELECT
    p.tienda_id,
    p.id AS producto_id,
    i.id AS insumo_id,
    0.0150 AS cantidad_requerida,
    'kg' AS unidad_medida,
    'Sal para mejorar sabor' AS notas_preparacion
  FROM productos p
  INNER JOIN insumos i ON i.tienda_id = p.tienda_id
  WHERE p.sku = 'PAN-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND i.codigo_interno = 'INS-004'
  
  UNION ALL
  
  SELECT
    p.tienda_id,
    p.id AS producto_id,
    i.id AS insumo_id,
    0.0100 AS cantidad_requerida,
    'kg' AS unidad_medida,
    'Levadura seca activa' AS notas_preparacion
  FROM productos p
  INNER JOIN insumos i ON i.tienda_id = p.tienda_id
  WHERE p.sku = 'PAN-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND i.codigo_interno = 'INS-003'
  
  UNION ALL
  
  SELECT
    p.tienda_id,
    p.id AS producto_id,
    i.id AS insumo_id,
    0.3000 AS cantidad_requerida,
    'l' AS unidad_medida,
    'Agua para hidratar masa' AS notas_preparacion
  FROM productos p
  INNER JOIN insumos i ON i.tienda_id = p.tienda_id
  WHERE p.sku = 'PAN-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND i.codigo_interno = 'INS-007'
  
  UNION ALL
  
  -- Receta Torta de Chocolate (Dulce Manjar) - SKU 'TORTA-001'
  SELECT
    p.tienda_id,
    p.id AS producto_id,
    i.id AS insumo_id,
    0.4000 AS cantidad_requerida,
    'kg' AS unidad_medida,
    'Harina para bizcocho' AS notas_preparacion
  FROM productos p
  INNER JOIN insumos i ON i.tienda_id = p.tienda_id
  WHERE p.sku = 'TORTA-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND i.codigo_interno = 'INS-001'
  
  UNION ALL
  
  SELECT
    p.tienda_id,
    p.id AS producto_id,
    i.id AS insumo_id,
    0.3000 AS cantidad_requerida,
    'kg' AS unidad_medida,
    'Azúcar blanca' AS notas_preparacion
  FROM productos p
  INNER JOIN insumos i ON i.tienda_id = p.tienda_id
  WHERE p.sku = 'TORTA-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND i.codigo_interno = 'INS-002'
  
  UNION ALL
  
  SELECT
    p.tienda_id,
    p.id AS producto_id,
    i.id AS insumo_id,
    4.0000 AS cantidad_requerida,
    'unidad' AS unidad_medida,
    'Huevos para el bizcocho' AS notas_preparacion
  FROM productos p
  INNER JOIN insumos i ON i.tienda_id = p.tienda_id
  WHERE p.sku = 'TORTA-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND i.codigo_interno = 'INS-006'
  
  UNION ALL
  
  SELECT
    p.tienda_id,
    p.id AS producto_id,
    i.id AS insumo_id,
    0.2000 AS cantidad_requerida,
    'kg' AS unidad_medida,
    'Chocolate para cobertura' AS notas_preparacion
  FROM productos p
  INNER JOIN insumos i ON i.tienda_id = p.tienda_id
  WHERE p.sku = 'TORTA-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND i.codigo_interno = 'INS-009'
  
  UNION ALL
  
  SELECT
    p.tienda_id,
    p.id AS producto_id,
    i.id AS insumo_id,
    0.1000 AS cantidad_requerida,
    'kg' AS unidad_medida,
    'Mantequilla sin sal' AS notas_preparacion
  FROM productos p
  INNER JOIN insumos i ON i.tienda_id = p.tienda_id
  WHERE p.sku = 'TORTA-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND i.codigo_interno = 'INS-005'
  
  UNION ALL
  
  SELECT
    p.tienda_id,
    p.id AS producto_id,
    i.id AS insumo_id,
    0.2000 AS cantidad_requerida,
    'l' AS unidad_medida,
    'Leche para mezcla' AS notas_preparacion
  FROM productos p
  INNER JOIN insumos i ON i.tienda_id = p.tienda_id
  WHERE p.sku = 'TORTA-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND i.codigo_interno = 'INS-007'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_requerida = VALUES(cantidad_requerida),
  notas_preparacion = VALUES(notas_preparacion);

-- =================================
-- STOCK IDEAL (Productos por Sede)
-- =================================

INSERT INTO stock_ideal (tienda_id, sede_id, producto_id, cantidad_ideal, punto_reposicion)
SELECT new.tienda_id, new.sede_id, new.producto_id, new.cantidad_ideal, new.punto_reposicion
FROM (
  -- Stock Ideal Dulce Manjar - Sede Miraflores
  SELECT
    p.tienda_id,
    s.id AS sede_id,
    p.id AS producto_id,
    100 AS cantidad_ideal,
    30 AS punto_reposicion
  FROM productos p
  INNER JOIN sedes s ON s.tienda_id = p.tienda_id
  WHERE p.sku = 'PAN-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  SELECT
    p.tienda_id,
    s.id AS sede_id,
    p.id AS producto_id,
    20 AS cantidad_ideal,
    5 AS punto_reposicion
  FROM productos p
  INNER JOIN sedes s ON s.tienda_id = p.tienda_id
  WHERE p.sku = 'TORTA-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  -- Stock Ideal Dulce Manjar - Sede San Isidro
  SELECT
    p.tienda_id,
    s.id AS sede_id,
    p.id AS producto_id,
    80 AS cantidad_ideal,
    25 AS punto_reposicion
  FROM productos p
  INNER JOIN sedes s ON s.tienda_id = p.tienda_id
  WHERE p.sku = 'PAN-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-002'
  
  UNION ALL
  
  SELECT
    p.tienda_id,
    s.id AS sede_id,
    p.id AS producto_id,
    15 AS cantidad_ideal,
    5 AS punto_reposicion
  FROM productos p
  INNER JOIN sedes s ON s.tienda_id = p.tienda_id
  WHERE p.sku = 'TORTA-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-002'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_ideal = VALUES(cantidad_ideal),
  punto_reposicion = VALUES(punto_reposicion);

-- =================================
-- CONTEOS DIARIOS
-- =================================

INSERT INTO conteos_diarios (tienda_id, sede_id, fecha_conteo, responsable_id, observaciones)
VALUES
  -- Conteo de ayer - Dulce Manjar Miraflores
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-001'),
    DATE_SUB(CURDATE(), INTERVAL 1 DAY),
    (SELECT id FROM usuarios_tienda WHERE correo = 'panadero@dulcemanjar.pe'),
    'Conteo de cierre del día anterior'
  ),
  -- Conteo de hoy - Dulce Manjar Miraflores
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-001'),
    CURDATE(),
    (SELECT id FROM usuarios_tienda WHERE correo = 'panadero@dulcemanjar.pe'),
    'Conteo diario matutino'
  ),
  -- Conteo de ayer - Dulce Manjar San Isidro
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-002'),
    DATE_SUB(CURDATE(), INTERVAL 1 DAY),
    (SELECT id FROM usuarios_tienda WHERE correo = 'vendedor1@dulcemanjar.pe'),
    'Conteo de cierre del día anterior'
  ),
  -- Conteo de ayer - Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM sedes WHERE codigo_interno = 'PS-001'),
    DATE_SUB(CURDATE(), INTERVAL 1 DAY),
    (SELECT id FROM usuarios_tienda WHERE correo = 'panadero@panaderiasol.pe'),
    'Conteo nocturno'
  )
ON DUPLICATE KEY UPDATE
  observaciones = VALUES(observaciones);

-- =================================
-- DETALLES DE CONTEOS DIARIOS
-- =================================

-- Detalle conteo ayer - Dulce Manjar Miraflores
INSERT INTO detalle_conteo_diario (conteo_id, producto_id, cantidad_fisica, cantidad_sistema)
SELECT new.conteo_id, new.producto_id, new.cantidad_fisica, new.cantidad_sistema
FROM (
  SELECT
    cd.id AS conteo_id,
    p.id AS producto_id,
    85 AS cantidad_fisica,
    90 AS cantidad_sistema
  FROM conteos_diarios cd
  INNER JOIN productos p ON p.tienda_id = cd.tienda_id
  WHERE cd.sede_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND cd.fecha_conteo = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    AND p.sku = 'PAN-001'
  
  UNION ALL
  
  SELECT
    cd.id AS conteo_id,
    p.id AS producto_id,
    18 AS cantidad_fisica,
    18 AS cantidad_sistema
  FROM conteos_diarios cd
  INNER JOIN productos p ON p.tienda_id = cd.tienda_id
  WHERE cd.sede_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND cd.fecha_conteo = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    AND p.sku = 'TORTA-001'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_fisica = VALUES(cantidad_fisica),
  cantidad_sistema = VALUES(cantidad_sistema);

-- Detalle conteo hoy - Dulce Manjar Miraflores
INSERT INTO detalle_conteo_diario (conteo_id, producto_id, cantidad_fisica, cantidad_sistema)
SELECT new.conteo_id, new.producto_id, new.cantidad_fisica, new.cantidad_sistema
FROM (
  SELECT
    cd.id AS conteo_id,
    p.id AS producto_id,
    45 AS cantidad_fisica,
    50 AS cantidad_sistema
  FROM conteos_diarios cd
  INNER JOIN productos p ON p.tienda_id = cd.tienda_id
  WHERE cd.sede_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND cd.fecha_conteo = CURDATE()
    AND p.sku = 'PAN-001'
  
  UNION ALL
  
  SELECT
    cd.id AS conteo_id,
    p.id AS producto_id,
    12 AS cantidad_fisica,
    15 AS cantidad_sistema
  FROM conteos_diarios cd
  INNER JOIN productos p ON p.tienda_id = cd.tienda_id
  WHERE cd.sede_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND cd.fecha_conteo = CURDATE()
    AND p.sku = 'TORTA-001'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_fisica = VALUES(cantidad_fisica),
  cantidad_sistema = VALUES(cantidad_sistema);

-- =================================
-- PLANES DE PRODUCCIÓN
-- =================================

INSERT INTO planes_produccion (
  tienda_id,
  sede_id,
  fecha_produccion,
  estado,
  generado_por,
  confirmado_por,
  hora_inicio_real,
  hora_fin_real,
  notas_maestro
)
VALUES
  -- Plan de ayer - Dulce Manjar Miraflores (Finalizado)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-001'),
    DATE_SUB(CURDATE(), INTERVAL 1 DAY),
    'finalizado',
    (SELECT id FROM usuarios_tienda WHERE correo = 'gerente@dulcemanjar.pe'),
    (SELECT id FROM usuarios_tienda WHERE correo = 'panadero@dulcemanjar.pe'),
    CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 04:00:00'),
    CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 09:30:00'),
    'Producción exitosa. Buena calidad de pan francés.'
  ),
  -- Plan de hoy - Dulce Manjar Miraflores (En proceso)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-001'),
    CURDATE(),
    'en_proceso',
    (SELECT id FROM usuarios_tienda WHERE correo = 'gerente@dulcemanjar.pe'),
    (SELECT id FROM usuarios_tienda WHERE correo = 'panadero@dulcemanjar.pe'),
    CONCAT(CURDATE(), ' 04:30:00'),
    NULL,
    NULL
  ),
  -- Plan de mañana - Dulce Manjar Miraflores (Confirmado)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-001'),
    DATE_ADD(CURDATE(), INTERVAL 1 DAY),
    'confirmado',
    (SELECT id FROM usuarios_tienda WHERE correo = 'gerente@dulcemanjar.pe'),
    (SELECT id FROM usuarios_tienda WHERE correo = 'panadero@dulcemanjar.pe'),
    NULL,
    NULL,
    'Aumentar producción de tortas por pedido especial'
  ),
  -- Plan de ayer - Dulce Manjar San Isidro (Finalizado)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-002'),
    DATE_SUB(CURDATE(), INTERVAL 1 DAY),
    'finalizado',
    (SELECT id FROM usuarios_tienda WHERE correo = 'gerente@dulcemanjar.pe'),
    (SELECT id FROM usuarios_tienda WHERE correo = 'vendedor1@dulcemanjar.pe'),
    CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 05:00:00'),
    CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 10:00:00'),
    'Producción normal'
  ),
  -- Plan de ayer - Panadería El Sol (Finalizado)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM sedes WHERE codigo_interno = 'PS-001'),
    DATE_SUB(CURDATE(), INTERVAL 1 DAY),
    'finalizado',
    (SELECT id FROM usuarios_tienda WHERE correo = 'admin@panaderiasol.pe'),
    (SELECT id FROM usuarios_tienda WHERE correo = 'panadero@panaderiasol.pe'),
    CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 03:30:00'),
    CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 08:00:00'),
    'Todo bien'
  )
ON DUPLICATE KEY UPDATE
  estado = VALUES(estado),
  hora_inicio_real = VALUES(hora_inicio_real),
  hora_fin_real = VALUES(hora_fin_real),
  notas_maestro = VALUES(notas_maestro);

-- =================================
-- DETALLES DE PLANES DE PRODUCCIÓN
-- =================================

-- Detalle plan de ayer - Dulce Manjar Miraflores (Finalizado)
INSERT INTO detalles_plan_produccion (
  plan_id,
  producto_id,
  origen,
  pedido_cliente_id,
  detalle_pedido_id,
  es_personalizado,
  personalizacion_id,
  cantidad_sugerida,
  cantidad_planificada,
  cantidad_producida,
  cantidad_merma,
  estado,
  hora_termino,
  observaciones
)
SELECT new.plan_id, new.producto_id, new.origen, new.pedido_cliente_id, new.detalle_pedido_id, new.es_personalizado, new.personalizacion_id, new.cantidad_sugerida, new.cantidad_planificada, new.cantidad_producida, new.cantidad_merma, new.estado, new.hora_termino, new.observaciones
FROM (
  SELECT
    pp.id AS plan_id,
    p.id AS producto_id,
    'stock_diario' AS origen,
    NULL AS pedido_cliente_id,
    NULL AS detalle_pedido_id,
    FALSE AS es_personalizado,
    NULL AS personalizacion_id,
    100 AS cantidad_sugerida,
    100 AS cantidad_planificada,
    98 AS cantidad_producida,
    2 AS cantidad_merma,
    'terminado' AS estado,
    CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 08:00:00') AS hora_termino,
    'Lote estándar' AS observaciones
  FROM planes_produccion pp
  INNER JOIN productos p ON p.tienda_id = pp.tienda_id
  WHERE pp.sede_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND pp.fecha_produccion = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    AND p.sku = 'PAN-001'
  
  UNION ALL
  
  SELECT
    pp.id AS plan_id,
    p.id AS producto_id,
    'stock_diario' AS origen,
    NULL AS pedido_cliente_id,
    NULL AS detalle_pedido_id,
    FALSE AS es_personalizado,
    NULL AS personalizacion_id,
    20 AS cantidad_sugerida,
    20 AS cantidad_planificada,
    20 AS cantidad_producida,
    0 AS cantidad_merma,
    'terminado' AS estado,
    CONCAT(DATE_SUB(CURDATE(), INTERVAL 1 DAY), ' 09:15:00') AS hora_termino,
    'Excelente calidad' AS observaciones
  FROM planes_produccion pp
  INNER JOIN productos p ON p.tienda_id = pp.tienda_id
  WHERE pp.sede_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND pp.fecha_produccion = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
    AND p.sku = 'TORTA-001'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_producida = VALUES(cantidad_producida),
  cantidad_merma = VALUES(cantidad_merma),
  estado = VALUES(estado),
  hora_termino = VALUES(hora_termino);

-- Detalle plan de hoy - Dulce Manjar Miraflores (En proceso)
INSERT INTO detalles_plan_produccion (
  plan_id,
  producto_id,
  origen,
  pedido_cliente_id,
  detalle_pedido_id,
  es_personalizado,
  personalizacion_id,
  cantidad_sugerida,
  cantidad_planificada,
  cantidad_producida,
  cantidad_merma,
  estado,
  hora_termino,
  observaciones
)
SELECT new.plan_id, new.producto_id, new.origen, new.pedido_cliente_id, new.detalle_pedido_id, new.es_personalizado, new.personalizacion_id, new.cantidad_sugerida, new.cantidad_planificada, new.cantidad_producida, new.cantidad_merma, new.estado, new.hora_termino, new.observaciones
FROM (
  SELECT
    pp.id AS plan_id,
    p.id AS producto_id,
    'stock_diario' AS origen,
    NULL AS pedido_cliente_id,
    NULL AS detalle_pedido_id,
    FALSE AS es_personalizado,
    NULL AS personalizacion_id,
    100 AS cantidad_sugerida,
    100 AS cantidad_planificada,
    50 AS cantidad_producida,
    0 AS cantidad_merma,
    'en_horno' AS estado,
    NULL AS hora_termino,
    'Segunda tanda en horno' AS observaciones
  FROM planes_produccion pp
  INNER JOIN productos p ON p.tienda_id = pp.tienda_id
  WHERE pp.sede_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND pp.fecha_produccion = CURDATE()
    AND p.sku = 'PAN-001'
  
  UNION ALL
  
  SELECT
    pp.id AS plan_id,
    p.id AS producto_id,
    'stock_diario' AS origen,
    NULL AS pedido_cliente_id,
    NULL AS detalle_pedido_id,
    FALSE AS es_personalizado,
    NULL AS personalizacion_id,
    15 AS cantidad_sugerida,
    15 AS cantidad_planificada,
    0 AS cantidad_producida,
    0 AS cantidad_merma,
    'pendiente' AS estado,
    NULL AS hora_termino,
    NULL AS observaciones
  FROM planes_produccion pp
  INNER JOIN productos p ON p.tienda_id = pp.tienda_id
  WHERE pp.sede_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND pp.fecha_produccion = CURDATE()
    AND p.sku = 'TORTA-001'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_producida = VALUES(cantidad_producida),
  cantidad_merma = VALUES(cantidad_merma),
  estado = VALUES(estado);

-- Detalle plan de mañana - Dulce Manjar Miraflores (Confirmado)
INSERT INTO detalles_plan_produccion (
  plan_id,
  producto_id,
  origen,
  pedido_cliente_id,
  detalle_pedido_id,
  es_personalizado,
  personalizacion_id,
  cantidad_sugerida,
  cantidad_planificada,
  cantidad_producida,
  cantidad_merma,
  estado,
  hora_termino,
  observaciones
)
SELECT new.plan_id, new.producto_id, new.origen, new.pedido_cliente_id, new.detalle_pedido_id, new.es_personalizado, new.personalizacion_id, new.cantidad_sugerida, new.cantidad_planificada, new.cantidad_producida, new.cantidad_merma, new.estado, new.hora_termino, new.observaciones
FROM (
  SELECT
    pp.id AS plan_id,
    p.id AS producto_id,
    'stock_diario' AS origen,
    NULL AS pedido_cliente_id,
    NULL AS detalle_pedido_id,
    FALSE AS es_personalizado,
    NULL AS personalizacion_id,
    100 AS cantidad_sugerida,
    100 AS cantidad_planificada,
    0 AS cantidad_producida,
    0 AS cantidad_merma,
    'pendiente' AS estado,
    NULL AS hora_termino,
    NULL AS observaciones
  FROM planes_produccion pp
  INNER JOIN productos p ON p.tienda_id = pp.tienda_id
  WHERE pp.sede_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND pp.fecha_produccion = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    AND p.sku = 'PAN-001'
  
  UNION ALL
  
  SELECT
    pp.id AS plan_id,
    p.id AS producto_id,
    'stock_diario' AS origen,
    NULL AS pedido_cliente_id,
    NULL AS detalle_pedido_id,
    FALSE AS es_personalizado,
    NULL AS personalizacion_id,
    25 AS cantidad_sugerida,
    25 AS cantidad_planificada,
    0 AS cantidad_producida,
    0 AS cantidad_merma,
    'pendiente' AS estado,
    NULL AS hora_termino,
    'Pedido especial - aumentar producción' AS observaciones
  FROM planes_produccion pp
  INNER JOIN productos p ON p.tienda_id = pp.tienda_id
  WHERE pp.sede_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND pp.fecha_produccion = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    AND p.sku = 'TORTA-001'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_planificada = VALUES(cantidad_planificada),
  observaciones = VALUES(observaciones);
