-- ============================================================================
-- R_13: SEED MÓDULO DE INVENTARIO (INVENTARIOS, TRANSFERENCIAS, MOVIMIENTOS)
-- Updated: 2025-11-12 - Fixed enum values to match Java enums
-- ============================================================================

-- =================================
-- INVENTARIO DE INSUMOS POR SEDE
-- =================================

INSERT INTO inventario_insumos_sedes (tienda_id, sede_id, insumo_id, cantidad_actual, ubicacion_fisica)
SELECT new.tienda_id, new.sede_id, new.insumo_id, new.cantidad_actual, new.ubicacion_fisica
FROM (
  -- Inventario Dulce Manjar - Sede Miraflores
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    250.0000 AS cantidad_actual,
    'Almacén Principal - Estante A1' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-001' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    150.0000 AS cantidad_actual,
    'Almacén Principal - Estante A2' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-002' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    8.0000 AS cantidad_actual,
    'Refrigerador 1' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-003' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    75.0000 AS cantidad_actual,
    'Almacén Principal - Estante B1' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-004' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    40.0000 AS cantidad_actual,
    'Refrigerador 2' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-005' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    250.0000 AS cantidad_actual,
    'Refrigerador 3' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-006' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    50.0000 AS cantidad_actual,
    'Refrigerador 1' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-007' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    20.0000 AS cantidad_actual,
    'Refrigerador 2' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-008' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    12.0000 AS cantidad_actual,
    'Almacén Principal - Estante C1' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-009' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    2500.0000 AS cantidad_actual,
    'Almacén Principal - Estante C2' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-010' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  -- Inventario Dulce Manjar - Sede San Isidro
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    200.0000 AS cantidad_actual,
    'Almacén' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-001' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-002'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    120.0000 AS cantidad_actual,
    'Almacén' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-002' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-002'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    5.0000 AS cantidad_actual,
    'Refrigerador' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-003' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-002'
  
  UNION ALL
  
  -- Inventario Panadería El Sol
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    100.0000 AS cantidad_actual,
    'Almacén' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-S001' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')
    AND s.codigo_interno = 'PS-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    75.0000 AS cantidad_actual,
    'Almacén' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-S002' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')
    AND s.codigo_interno = 'PS-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    4.0000 AS cantidad_actual,
    'Refrigerador' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-S003' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')
    AND s.codigo_interno = 'PS-001'
  
  UNION ALL
  
  -- Inventario Tortas & Delicias
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    25.0000 AS cantidad_actual,
    'Almacén Principal' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-T001' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569')
    AND s.codigo_interno = 'TD-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    20.0000 AS cantidad_actual,
    'Almacén Principal' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-T002' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569')
    AND s.codigo_interno = 'TD-001'
  
  UNION ALL
  
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    8.0000 AS cantidad_actual,
    'Refrigerador' AS ubicacion_fisica
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  WHERE i.codigo_interno = 'INS-T003' AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569')
    AND s.codigo_interno = 'TD-001'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_actual = new.cantidad_actual,
  ubicacion_fisica = new.ubicacion_fisica;

-- =================================
-- INVENTARIO DE PRODUCTOS POR SEDE
-- =================================

INSERT INTO inventario_productos (tienda_id, sede_id, producto_id, cantidad_actual, ubicacion_fisica)
SELECT new.tienda_id, new.sede_id, new.producto_id, new.cantidad_actual, new.ubicacion_fisica
FROM (
  -- Inventario Dulce Manjar - Sede Miraflores
  SELECT
    p.tienda_id,
    s.id AS sede_id,
    p.id AS producto_id,
    45 AS cantidad_actual,
    'Vitrina 1' AS ubicacion_fisica
  FROM productos p
  INNER JOIN sedes s ON s.tienda_id = p.tienda_id
  WHERE p.sku = 'PAN-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  SELECT
    p.tienda_id,
    s.id AS sede_id,
    p.id AS producto_id,
    12 AS cantidad_actual,
    'Vitrina Refrigerada' AS ubicacion_fisica
  FROM productos p
  INNER JOIN sedes s ON s.tienda_id = p.tienda_id
  WHERE p.sku = 'TORTA-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  -- Inventario Dulce Manjar - Sede San Isidro
  SELECT
    p.tienda_id,
    s.id AS sede_id,
    p.id AS producto_id,
    35 AS cantidad_actual,
    'Vitrina Principal' AS ubicacion_fisica
  FROM productos p
  INNER JOIN sedes s ON s.tienda_id = p.tienda_id
  WHERE p.sku = 'PAN-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-002'
  
  UNION ALL
  
  SELECT
    p.tienda_id,
    s.id AS sede_id,
    p.id AS producto_id,
    8 AS cantidad_actual,
    'Vitrina Refrigerada' AS ubicacion_fisica
  FROM productos p
  INNER JOIN sedes s ON s.tienda_id = p.tienda_id
  WHERE p.sku = 'TORTA-001' AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-002'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_actual = new.cantidad_actual,
  ubicacion_fisica = new.ubicacion_fisica;

-- =================================
-- TRANSFERENCIAS DE INVENTARIO
-- =================================

INSERT INTO transferencias_inventario (
  tienda_id,
  sede_origen_id,
  sede_destino_id,
  estado,
  solicitado_por,
  autorizado_por,
  recibido_por,
  fecha_solicitud,
  fecha_envio,
  fecha_recepcion,
  observaciones
)
VALUES
  -- Transferencia completada - Dulce Manjar: Miraflores -> San Isidro
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-001'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-002'),
    'recibido',
    (SELECT id FROM usuarios_tienda WHERE correo = 'vendedor1@dulcemanjar.pe'),
    (SELECT id FROM usuarios_tienda WHERE correo = 'gerente@dulcemanjar.pe'),
    (SELECT id FROM usuarios_tienda WHERE correo = 'vendedor1@dulcemanjar.pe'),
    DATE_SUB(NOW(), INTERVAL 5 DAY),
    DATE_SUB(NOW(), INTERVAL 4 DAY),
    DATE_SUB(NOW(), INTERVAL 4 DAY),
    'Transferencia de insumos por stock bajo en San Isidro'
  ),
  -- Transferencia en tránsito - Dulce Manjar: Miraflores -> San Isidro
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-001'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-002'),
    'en_transito',
    (SELECT id FROM usuarios_tienda WHERE correo = 'vendedor1@dulcemanjar.pe'),
    (SELECT id FROM usuarios_tienda WHERE correo = 'gerente@dulcemanjar.pe'),
    NULL,
    DATE_SUB(NOW(), INTERVAL 1 DAY),
    NOW(),
    NULL,
    'Reposición de chocolate y vainilla'
  ),
  -- Transferencia pendiente - Dulce Manjar: Miraflores -> San Isidro
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-001'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-002'),
    'pendiente',
    (SELECT id FROM usuarios_tienda WHERE correo = 'vendedor1@dulcemanjar.pe'),
    NULL,
    NULL,
    NOW(),
    NULL,
    NULL,
    'Solicitud de transferencia de productos terminados'
  )
AS new
ON DUPLICATE KEY UPDATE
  estado = new.estado,
  fecha_envio = new.fecha_envio,
  fecha_recepcion = new.fecha_recepcion;

-- =================================
-- ITEMS DE TRANSFERENCIAS
-- =================================

-- Items de Transferencia 1 (Completada)
INSERT INTO items_transferencia (transferencia_id, insumo_id, producto_id, cantidad_enviada, cantidad_recibida)
SELECT new.transferencia_id, new.insumo_id, new.producto_id, new.cantidad_enviada, new.cantidad_recibida
FROM (
  SELECT
    t.id AS transferencia_id,
    i.id AS insumo_id,
    NULL AS producto_id,
    50.0000 AS cantidad_enviada,
    50.0000 AS cantidad_recibida
  FROM transferencias_inventario t
  INNER JOIN insumos i ON i.tienda_id = t.tienda_id
  WHERE t.estado = 'recibido'
    AND t.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND t.fecha_solicitud = DATE_SUB(NOW(), INTERVAL 5 DAY)
    AND i.codigo_interno = 'INS-001'
  
  UNION ALL
  
  SELECT
    t.id AS transferencia_id,
    i.id AS insumo_id,
    NULL AS producto_id,
    30.0000 AS cantidad_enviada,
    30.0000 AS cantidad_recibida
  FROM transferencias_inventario t
  INNER JOIN insumos i ON i.tienda_id = t.tienda_id
  WHERE t.estado = 'recibido'
    AND t.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND t.fecha_solicitud = DATE_SUB(NOW(), INTERVAL 5 DAY)
    AND i.codigo_interno = 'INS-002'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_recibida = new.cantidad_recibida;

-- Items de Transferencia 2 (En tránsito)
INSERT INTO items_transferencia (transferencia_id, insumo_id, producto_id, cantidad_enviada, cantidad_recibida)
SELECT new.transferencia_id, new.insumo_id, new.producto_id, new.cantidad_enviada, new.cantidad_recibida
FROM (
  SELECT
    t.id AS transferencia_id,
    i.id AS insumo_id,
    NULL AS producto_id,
    10.0000 AS cantidad_enviada,
    NULL AS cantidad_recibida
  FROM transferencias_inventario t
  INNER JOIN insumos i ON i.tienda_id = t.tienda_id
  WHERE t.estado = 'en_transito'
    AND t.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND t.fecha_solicitud = DATE_SUB(NOW(), INTERVAL 1 DAY)
    AND i.codigo_interno = 'INS-009'
  
  UNION ALL
  
  SELECT
    t.id AS transferencia_id,
    i.id AS insumo_id,
    NULL AS producto_id,
    1000.0000 AS cantidad_enviada,
    NULL AS cantidad_recibida
  FROM transferencias_inventario t
  INNER JOIN insumos i ON i.tienda_id = t.tienda_id
  WHERE t.estado = 'en_transito'
    AND t.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND t.fecha_solicitud = DATE_SUB(NOW(), INTERVAL 1 DAY)
    AND i.codigo_interno = 'INS-010'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_enviada = new.cantidad_enviada;

-- Items de Transferencia 3 (Pendiente - Productos)
INSERT INTO items_transferencia (transferencia_id, insumo_id, producto_id, cantidad_enviada, cantidad_recibida)
SELECT new.transferencia_id, new.insumo_id, new.producto_id, new.cantidad_enviada, new.cantidad_recibida
FROM (
  SELECT
    t.id AS transferencia_id,
    NULL AS insumo_id,
    p.id AS producto_id,
    15.0000 AS cantidad_enviada,
    NULL AS cantidad_recibida
  FROM transferencias_inventario t
  INNER JOIN productos p ON p.tienda_id = t.tienda_id
  WHERE t.estado = 'pendiente'
    AND t.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND t.fecha_solicitud >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    AND p.sku = 'PAN-001'
  
  UNION ALL
  
  SELECT
    t.id AS transferencia_id,
    NULL AS insumo_id,
    p.id AS producto_id,
    5.0000 AS cantidad_enviada,
    NULL AS cantidad_recibida
  FROM transferencias_inventario t
  INNER JOIN productos p ON p.tienda_id = t.tienda_id
  WHERE t.estado = 'pendiente'
    AND t.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND t.fecha_solicitud >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
    AND p.sku = 'TORTA-001'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_enviada = new.cantidad_enviada;

-- =================================
-- MOVIMIENTOS DE INVENTARIO INSUMOS
-- =================================

INSERT INTO movimientos_inventario_insumos (
  tienda_id,
  sede_id,
  insumo_id,
  tipo_movimiento,
  cantidad,
  cantidad_anterior,
  cantidad_posterior,
  orden_compra_id,
  plan_produccion_id,
  transferencia_id,
  motivo,
  responsable_id
)
SELECT new.tienda_id, new.sede_id, new.insumo_id, new.tipo_movimiento, new.cantidad, new.cantidad_anterior, new.cantidad_posterior, new.orden_compra_id, new.plan_produccion_id, new.transferencia_id, new.motivo, new.responsable_id
FROM (
  -- Entrada por compra - Harina
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    'entrada' AS tipo_movimiento,
    250.0000 AS cantidad,
    0.0000 AS cantidad_anterior,
    250.0000 AS cantidad_posterior,
    oc.id AS orden_compra_id,
    NULL AS plan_produccion_id,
    NULL AS transferencia_id,
    'Recepción de orden de compra' AS motivo,
    (SELECT id FROM usuarios_tienda WHERE correo = 'almacen@dulcemanjar.pe') AS responsable_id
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  INNER JOIN ordenes_compra oc ON oc.tienda_id = i.tienda_id AND oc.sede_destino_id = s.id
  WHERE i.codigo_interno = 'INS-001'
    AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
    AND oc.fecha_emision = DATE_SUB(CURDATE(), INTERVAL 15 DAY)
  
  UNION ALL
  
  -- Salida por producción - Harina
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    'salida' AS tipo_movimiento,
    50.0000 AS cantidad,
    250.0000 AS cantidad_anterior,
    200.0000 AS cantidad_posterior,
    NULL AS orden_compra_id,
    pp.id AS plan_produccion_id,
    NULL AS transferencia_id,
    'Consumo en producción' AS motivo,
    (SELECT id FROM usuarios_tienda WHERE correo = 'panadero@dulcemanjar.pe') AS responsable_id
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  INNER JOIN planes_produccion pp ON pp.tienda_id = i.tienda_id AND pp.sede_id = s.id
  WHERE i.codigo_interno = 'INS-001'
    AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
    AND pp.fecha_produccion = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  
  UNION ALL
  
  -- Salida por transferencia - Harina
  SELECT
    i.tienda_id,
    s.id AS sede_id,
    i.id AS insumo_id,
    'transferencia' AS tipo_movimiento,
    50.0000 AS cantidad,
    200.0000 AS cantidad_anterior,
    150.0000 AS cantidad_posterior,
    NULL AS orden_compra_id,
    NULL AS plan_produccion_id,
    t.id AS transferencia_id,
    'Transferencia a San Isidro' AS motivo,
    (SELECT id FROM usuarios_tienda WHERE correo = 'almacen@dulcemanjar.pe') AS responsable_id
  FROM insumos i
  INNER JOIN sedes s ON s.tienda_id = i.tienda_id
  INNER JOIN transferencias_inventario t ON t.tienda_id = i.tienda_id AND t.sede_origen_id = s.id
  WHERE i.codigo_interno = 'INS-001'
    AND i.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
    AND t.estado = 'recibido'
    AND t.fecha_solicitud = DATE_SUB(NOW(), INTERVAL 5 DAY)
) AS new
ON DUPLICATE KEY UPDATE
  cantidad = new.cantidad,
  cantidad_anterior = new.cantidad_anterior,
  cantidad_posterior = new.cantidad_posterior;

-- =================================
-- MOVIMIENTOS DE INVENTARIO PRODUCTOS
-- =================================

INSERT INTO movimientos_inventario_productos (
  tienda_id,
  sede_id,
  producto_id,
  tipo_movimiento,
  cantidad,
  cantidad_anterior,
  cantidad_posterior,
  pedido_id,
  plan_produccion_id,
  motivo,
  responsable_id
)
SELECT new.tienda_id, new.sede_id, new.producto_id, new.tipo_movimiento, new.cantidad, new.cantidad_anterior, new.cantidad_posterior, new.pedido_id, new.plan_produccion_id, new.motivo, new.responsable_id
FROM (
  -- Entrada por producción - Pan Francés
  SELECT
    p.tienda_id,
    s.id AS sede_id,
    p.id AS producto_id,
    'entrada' AS tipo_movimiento,
    98 AS cantidad,
    0 AS cantidad_anterior,
    98 AS cantidad_posterior,
    NULL AS pedido_id,
    pp.id AS plan_produccion_id,
    'produccion' AS motivo,
    (SELECT id FROM usuarios_tienda WHERE correo = 'panadero@dulcemanjar.pe') AS responsable_id
  FROM productos p
  INNER JOIN sedes s ON s.tienda_id = p.tienda_id
  INNER JOIN planes_produccion pp ON pp.tienda_id = p.tienda_id AND pp.sede_id = s.id
  WHERE p.sku = 'PAN-001'
    AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
    AND pp.fecha_produccion = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  
  UNION ALL
  
  -- Salida por venta - Pan Francés
  SELECT
    p.tienda_id,
    s.id AS sede_id,
    p.id AS producto_id,
    'salida' AS tipo_movimiento,
    40 AS cantidad,
    98 AS cantidad_anterior,
    58 AS cantidad_posterior,
    NULL AS pedido_id,
    NULL AS plan_produccion_id,
    'venta' AS motivo,
    (SELECT id FROM usuarios_tienda WHERE correo = 'vendedor1@dulcemanjar.pe') AS responsable_id
  FROM productos p
  INNER JOIN sedes s ON s.tienda_id = p.tienda_id
  WHERE p.sku = 'PAN-001'
    AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
  
  UNION ALL
  
  -- Merma - Pan Francés
  SELECT
    p.tienda_id,
    s.id AS sede_id,
    p.id AS producto_id,
    'salida' AS tipo_movimiento,
    2 AS cantidad,
    0 AS cantidad_anterior,
    -2 AS cantidad_posterior,
    NULL AS pedido_id,
    pp.id AS plan_produccion_id,
    'merma' AS motivo,
    (SELECT id FROM usuarios_tienda WHERE correo = 'panadero@dulcemanjar.pe') AS responsable_id
  FROM productos p
  INNER JOIN sedes s ON s.tienda_id = p.tienda_id
  INNER JOIN planes_produccion pp ON pp.tienda_id = p.tienda_id AND pp.sede_id = s.id
  WHERE p.sku = 'PAN-001'
    AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
    AND pp.fecha_produccion = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
  
  UNION ALL
  
  -- Entrada por producción - Torta
  SELECT
    p.tienda_id,
    s.id AS sede_id,
    p.id AS producto_id,
    'entrada' AS tipo_movimiento,
    20 AS cantidad,
    0 AS cantidad_anterior,
    20 AS cantidad_posterior,
    NULL AS pedido_id,
    pp.id AS plan_produccion_id,
    'produccion' AS motivo,
    (SELECT id FROM usuarios_tienda WHERE correo = 'panadero@dulcemanjar.pe') AS responsable_id
  FROM productos p
  INNER JOIN sedes s ON s.tienda_id = p.tienda_id
  INNER JOIN planes_produccion pp ON pp.tienda_id = p.tienda_id AND pp.sede_id = s.id
  WHERE p.sku = 'TORTA-001'
    AND p.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
    AND pp.fecha_produccion = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
) AS new
ON DUPLICATE KEY UPDATE
  cantidad = new.cantidad,
  cantidad_anterior = new.cantidad_anterior,
  cantidad_posterior = new.cantidad_posterior;
