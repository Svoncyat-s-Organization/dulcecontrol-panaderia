-- ============================================================================
-- R_09: SEED MÓDULO DE COMPRAS (INSUMOS, PROVEEDORES, ÓRDENES DE COMPRA)
-- ============================================================================

-- =================================
-- INSUMOS
-- =================================

INSERT INTO insumos (tienda_id, nombre, codigo_interno, unidad_base, unidad_compra_habitual, factor_conversion, costo_promedio_unitario_centimos, ultimo_precio_compra_centimos, stock_actual_global, stock_minimo_global, activo)
VALUES
  -- Insumos para Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Harina panadera',
    'INS-001',
    'kg',
    'saco',
    50.0000,
    120000,
    120000,
    500.0000,
    100.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Azúcar blanca',
    'INS-002',
    'kg',
    'saco',
    50.0000,
    80000,
    80000,
    300.0000,
    80.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Levadura seca',
    'INS-003',
    'kg',
    'kg',
    1.0000,
    2800000,
    2800000,
    15.0000,
    5.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Sal',
    'INS-004',
    'kg',
    'saco',
    50.0000,
    30000,
    30000,
    150.0000,
    50.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Mantequilla sin sal',
    'INS-005',
    'kg',
    'paquete',
    25.0000,
    2200000,
    2200000,
    80.0000,
    30.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Huevos',
    'INS-006',
    'unidad',
    'paquete',
    30.0000,
    45000,
    45000,
    500.0000,
    120.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Leche fresca',
    'INS-007',
    'l',
    'l',
    1.0000,
    450000,
    450000,
    100.0000,
    30.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Crema de leche',
    'INS-008',
    'l',
    'l',
    1.0000,
    1200000,
    1200000,
    40.0000,
    15.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Chocolate cobertura',
    'INS-009',
    'kg',
    'kg',
    1.0000,
    3500000,
    3500000,
    25.0000,
    10.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Vainilla líquida',
    'INS-010',
    'ml',
    'l',
    1000.0000,
    2500000,
    2500000,
    5000.0000,
    1000.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Esencia de almendra',
    'INS-011',
    'ml',
    'ml',
    1.0000,
    8000,
    8000,
    500.0000,
    100.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Polvo de hornear',
    'INS-012',
    'kg',
    'kg',
    1.0000,
    1800000,
    1800000,
    10.0000,
    5.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Canela en polvo',
    'INS-013',
    'kg',
    'kg',
    1.0000,
    4500000,
    4500000,
    5.0000,
    2.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Pasas',
    'INS-014',
    'kg',
    'kg',
    1.0000,
    1200000,
    1200000,
    20.0000,
    8.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Manjar blanco',
    'INS-015',
    'kg',
    'lata',
    1.0000,
    1500000,
    1500000,
    30.0000,
    10.0000,
    TRUE
  ),
  -- Insumos para Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Harina integral',
    'INS-S001',
    'kg',
    'saco',
    50.0000,
    150000,
    150000,
    200.0000,
    50.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Azúcar rubia',
    'INS-S002',
    'kg',
    'saco',
    50.0000,
    90000,
    90000,
    150.0000,
    40.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Levadura fresca',
    'INS-S003',
    'kg',
    'kg',
    1.0000,
    2000000,
    2000000,
    8.0000,
    3.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Manteca vegetal',
    'INS-S004',
    'kg',
    'paquete',
    20.0000,
    1200000,
    1200000,
    50.0000,
    20.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Leche evaporada',
    'INS-S005',
    'l',
    'lata',
    0.4000,
    550000,
    550000,
    60.0000,
    20.0000,
    TRUE
  ),
  -- Insumos para Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Harina preparada',
    'INS-T001',
    'kg',
    'paquete',
    1.0000,
    280000,
    280000,
    50.0000,
    15.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Azúcar impalpable',
    'INS-T002',
    'kg',
    'kg',
    1.0000,
    120000,
    120000,
    40.0000,
    10.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Fondant',
    'INS-T003',
    'kg',
    'kg',
    1.0000,
    2800000,
    2800000,
    15.0000,
    5.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Colorantes comestibles',
    'INS-T004',
    'ml',
    'ml',
    1.0000,
    15000,
    15000,
    200.0000,
    50.0000,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Chispas de chocolate',
    'INS-T005',
    'kg',
    'kg',
    1.0000,
    1800000,
    1800000,
    10.0000,
    5.0000,
    TRUE
  )
ON DUPLICATE KEY UPDATE
  costo_promedio_unitario_centimos = VALUES(costo_promedio_unitario_centimos),
  ultimo_precio_compra_centimos = VALUES(ultimo_precio_compra_centimos),
  stock_actual_global = VALUES(stock_actual_global),
  stock_minimo_global = VALUES(stock_minimo_global),
  activo = VALUES(activo);

-- =================================
-- PROVEEDORES
-- =================================

INSERT INTO proveedores (tienda_id, nombre_comercial, tipo_doc, numero_doc, razon_social, nombre_contacto, telefono_contacto, email_contacto, es_generico, activo)
VALUES
  -- Proveedores para Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Distribuidora Global SAC',
    'RUC',
    '20501234567',
    'Distribuidora Global Sociedad Anónima Cerrada',
    'Juan Carlos Pérez',
    '945123456',
    'ventas@distribuidoraglobal.pe',
    FALSE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Molino Santa Rosa',
    'RUC',
    '20502345678',
    'Molino Santa Rosa EIRL',
    'María Luisa Torres',
    '954234567',
    'pedidos@molinosantarosa.pe',
    FALSE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Lácteos del Valle',
    'RUC',
    '20503456789',
    'Lácteos del Valle SA',
    'Roberto Silva',
    '963345678',
    'comercial@lacteosdelvalle.pe',
    FALSE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Importadora de Insumos',
    'RUC',
    '20504567890',
    'Importadora de Insumos Gourmet SAC',
    'Ana Patricia Rodríguez',
    '972456789',
    'contacto@importadorainsumos.pe',
    FALSE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Proveedor Genérico',
    'RUC',
    '00000000000',
    'Sin RUC',
    NULL,
    NULL,
    NULL,
    TRUE,
    TRUE
  ),
  -- Proveedores para Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Comercial El Trigal',
    'RUC',
    '20505678901',
    'Comercial El Trigal SAC',
    'Pedro Martínez',
    '981567890',
    'ventas@eltrigal.pe',
    FALSE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Distribuidora Norte',
    'RUC',
    '20506789012',
    'Distribuidora Norte EIRL',
    'Carmen Flores',
    '990678901',
    'pedidos@distribuidoranorte.pe',
    FALSE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Proveedor Genérico',
    'RUC',
    '00000000000',
    'Sin RUC',
    NULL,
    NULL,
    NULL,
    TRUE,
    TRUE
  ),
  -- Proveedores para Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Repostería Premium',
    'RUC',
    '20507890123',
    'Repostería Premium SAC',
    'Luis Alberto Gómez',
    '999789012',
    'ventas@reposteriapremium.pe',
    FALSE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Decorart Perú',
    'RUC',
    '20508901234',
    'Decorart Perú EIRL',
    'Sandra Morales',
    '955890123',
    'pedidos@decorartperu.pe',
    FALSE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Proveedor Genérico',
    'RUC',
    '00000000000',
    'Sin RUC',
    NULL,
    NULL,
    NULL,
    TRUE,
    TRUE
  )
ON DUPLICATE KEY UPDATE
  razon_social = VALUES(razon_social),
  nombre_contacto = VALUES(nombre_contacto),
  telefono_contacto = VALUES(telefono_contacto),
  email_contacto = VALUES(email_contacto),
  es_generico = VALUES(es_generico),
  activo = VALUES(activo);

-- =================================
-- ÓRDENES DE COMPRA
-- =================================

INSERT INTO ordenes_compra (
  tienda_id,
  sede_destino_id,
  proveedor_id,
  fecha_emision,
  fecha_recepcion_esperada,
  fecha_recepcion_real,
  estado,
  moneda,
  total_compra_centimos,
  metodo_pago,
  referencia_pago,
  tipo_comprobante_proveedor,
  serie_comprobante_proveedor,
  numero_comprobante_proveedor,
  observaciones,
  registrado_por
)
VALUES
  -- Orden 1: Dulce Manjar - Miraflores (Recibida)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-001'),
    (SELECT id FROM proveedores WHERE numero_doc = '20501234567' AND tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')),
    DATE_SUB(CURDATE(), INTERVAL 15 DAY),
    DATE_SUB(CURDATE(), INTERVAL 13 DAY),
    DATE_SUB(CURDATE(), INTERVAL 13 DAY),
    'recibida_total',
    'PEN',
    1250000,
    'transferencia',
    'TRANS-20241028-001',
    'factura',
    'F001',
    '00012345',
    'Compra mensual de harina y azúcar',
    (SELECT id FROM usuarios_tienda WHERE correo = 'almacen@dulcemanjar.pe')
  ),
  -- Orden 2: Dulce Manjar - Miraflores (Enviada)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-001'),
    (SELECT id FROM proveedores WHERE numero_doc = '20503456789' AND tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')),
    DATE_SUB(CURDATE(), INTERVAL 3 DAY),
    CURDATE(),
    NULL,
    'enviada',
    'PEN',
    850000,
    'credito',
    NULL,
    'factura',
    'F001',
    '00045678',
    'Pedido de lácteos',
    (SELECT id FROM usuarios_tienda WHERE correo = 'almacen@dulcemanjar.pe')
  ),
  -- Orden 3: Dulce Manjar - San Isidro (Borrador)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE codigo_interno = 'DM-002'),
    (SELECT id FROM proveedores WHERE numero_doc = '20504567890' AND tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')),
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 5 DAY),
    NULL,
    'borrador',
    'PEN',
    650000,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Pedido de chocolate e insumos especiales',
    (SELECT id FROM usuarios_tienda WHERE correo = 'almacen@dulcemanjar.pe')
  ),
  -- Orden 4: Panadería El Sol (Recibida)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM sedes WHERE codigo_interno = 'PS-001'),
    (SELECT id FROM proveedores WHERE numero_doc = '20505678901' AND tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')),
    DATE_SUB(CURDATE(), INTERVAL 10 DAY),
    DATE_SUB(CURDATE(), INTERVAL 8 DAY),
    DATE_SUB(CURDATE(), INTERVAL 8 DAY),
    'recibida_total',
    'PEN',
    780000,
    'efectivo',
    NULL,
    'boleta',
    'B001',
    '00023456',
    'Compra semanal',
    (SELECT id FROM usuarios_tienda WHERE correo = 'admin@panaderiasol.pe')
  ),
  -- Orden 5: Tortas & Delicias (Enviada)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM sedes WHERE codigo_interno = 'TD-001'),
    (SELECT id FROM proveedores WHERE numero_doc = '20507890123' AND tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569')),
    DATE_SUB(CURDATE(), INTERVAL 2 DAY),
    DATE_ADD(CURDATE(), INTERVAL 1 DAY),
    NULL,
    'enviada',
    'PEN',
    420000,
    'transferencia',
    'TRANS-20241110-002',
    'factura',
    'F001',
    '00078901',
    'Pedido de insumos de repostería',
    (SELECT id FROM usuarios_tienda WHERE correo = 'admin@tortasdelicias.pe')
  )
ON DUPLICATE KEY UPDATE
  estado = VALUES(estado),
  fecha_recepcion_real = VALUES(fecha_recepcion_real),
  total_compra_centimos = VALUES(total_compra_centimos);

-- =================================
-- DETALLES DE ÓRDENES DE COMPRA
-- =================================

-- Detalles de Orden 1: Dulce Manjar - Harina y Azúcar
INSERT INTO detalles_orden_compra (orden_compra_id, insumo_id, cantidad_solicitada, unidad_compra, costo_unitario_pactado_centimos, total_linea_centimos, cantidad_recibida, recibido_completo)
SELECT new.orden_compra_id, new.insumo_id, new.cantidad_solicitada, new.unidad_compra, new.costo_unitario_pactado_centimos, new.total_linea_centimos, new.cantidad_recibida, new.recibido_completo
FROM (
  SELECT
    oc.id AS orden_compra_id,
    i.id AS insumo_id,
    5.0000 AS cantidad_solicitada,
    'saco' AS unidad_compra,
    120000 AS costo_unitario_pactado_centimos,
    600000 AS total_linea_centimos,
    5.0000 AS cantidad_recibida,
    TRUE AS recibido_completo
  FROM ordenes_compra oc
  INNER JOIN insumos i ON i.tienda_id = oc.tienda_id
  WHERE oc.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND oc.sede_destino_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND oc.fecha_emision = DATE_SUB(CURDATE(), INTERVAL 15 DAY)
    AND i.codigo_interno = 'INS-001'
  
  UNION ALL
  
  SELECT
    oc.id AS orden_compra_id,
    i.id AS insumo_id,
    4.0000 AS cantidad_solicitada,
    'saco' AS unidad_compra,
    80000 AS costo_unitario_pactado_centimos,
    320000 AS total_linea_centimos,
    4.0000 AS cantidad_recibida,
    TRUE AS recibido_completo
  FROM ordenes_compra oc
  INNER JOIN insumos i ON i.tienda_id = oc.tienda_id
  WHERE oc.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND oc.sede_destino_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND oc.fecha_emision = DATE_SUB(CURDATE(), INTERVAL 15 DAY)
    AND i.codigo_interno = 'INS-002'
  
  UNION ALL
  
  SELECT
    oc.id AS orden_compra_id,
    i.id AS insumo_id,
    10.0000 AS cantidad_solicitada,
    'kg' AS unidad_compra,
    2800000 AS costo_unitario_pactado_centimos,
    280000 AS total_linea_centimos,
    10.0000 AS cantidad_recibida,
    TRUE AS recibido_completo
  FROM ordenes_compra oc
  INNER JOIN insumos i ON i.tienda_id = oc.tienda_id
  WHERE oc.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND oc.sede_destino_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND oc.fecha_emision = DATE_SUB(CURDATE(), INTERVAL 15 DAY)
    AND i.codigo_interno = 'INS-003'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_recibida = VALUES(cantidad_recibida),
  recibido_completo = VALUES(recibido_completo);

-- Detalles de Orden 2: Dulce Manjar - Lácteos
INSERT INTO detalles_orden_compra (orden_compra_id, insumo_id, cantidad_solicitada, unidad_compra, costo_unitario_pactado_centimos, total_linea_centimos, cantidad_recibida, recibido_completo)
SELECT new.orden_compra_id, new.insumo_id, new.cantidad_solicitada, new.unidad_compra, new.costo_unitario_pactado_centimos, new.total_linea_centimos, new.cantidad_recibida, new.recibido_completo
FROM (
  SELECT
    oc.id AS orden_compra_id,
    i.id AS insumo_id,
    100.0000 AS cantidad_solicitada,
    'l' AS unidad_compra,
    450000 AS costo_unitario_pactado_centimos,
    450000 AS total_linea_centimos,
    0.0000 AS cantidad_recibida,
    FALSE AS recibido_completo
  FROM ordenes_compra oc
  INNER JOIN insumos i ON i.tienda_id = oc.tienda_id
  WHERE oc.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND oc.sede_destino_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND oc.fecha_emision = DATE_SUB(CURDATE(), INTERVAL 3 DAY)
    AND i.codigo_interno = 'INS-007'
  
  UNION ALL
  
  SELECT
    oc.id AS orden_compra_id,
    i.id AS insumo_id,
    40.0000 AS cantidad_solicitada,
    'l' AS unidad_compra,
    1200000 AS costo_unitario_pactado_centimos,
    480000 AS total_linea_centimos,
    0.0000 AS cantidad_recibida,
    FALSE AS recibido_completo
  FROM ordenes_compra oc
  INNER JOIN insumos i ON i.tienda_id = oc.tienda_id
  WHERE oc.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND oc.sede_destino_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-001')
    AND oc.fecha_emision = DATE_SUB(CURDATE(), INTERVAL 3 DAY)
    AND i.codigo_interno = 'INS-008'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_recibida = VALUES(cantidad_recibida),
  recibido_completo = VALUES(recibido_completo);

-- Detalles de Orden 3: Dulce Manjar - Chocolate e insumos especiales (Borrador)
INSERT INTO detalles_orden_compra (orden_compra_id, insumo_id, cantidad_solicitada, unidad_compra, costo_unitario_pactado_centimos, total_linea_centimos, cantidad_recibida, recibido_completo)
SELECT new.orden_compra_id, new.insumo_id, new.cantidad_solicitada, new.unidad_compra, new.costo_unitario_pactado_centimos, new.total_linea_centimos, new.cantidad_recibida, new.recibido_completo
FROM (
  SELECT
    oc.id AS orden_compra_id,
    i.id AS insumo_id,
    15.0000 AS cantidad_solicitada,
    'kg' AS unidad_compra,
    3500000 AS costo_unitario_pactado_centimos,
    525000 AS total_linea_centimos,
    0.0000 AS cantidad_recibida,
    FALSE AS recibido_completo
  FROM ordenes_compra oc
  INNER JOIN insumos i ON i.tienda_id = oc.tienda_id
  WHERE oc.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND oc.sede_destino_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-002')
    AND oc.fecha_emision = CURDATE()
    AND i.codigo_interno = 'INS-009'
  
  UNION ALL
  
  SELECT
    oc.id AS orden_compra_id,
    i.id AS insumo_id,
    5.0000 AS cantidad_solicitada,
    'l' AS unidad_compra,
    2500000 AS costo_unitario_pactado_centimos,
    125000 AS total_linea_centimos,
    0.0000 AS cantidad_recibida,
    FALSE AS recibido_completo
  FROM ordenes_compra oc
  INNER JOIN insumos i ON i.tienda_id = oc.tienda_id
  WHERE oc.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND oc.sede_destino_id = (SELECT id FROM sedes WHERE codigo_interno = 'DM-002')
    AND oc.fecha_emision = CURDATE()
    AND i.codigo_interno = 'INS-010'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_recibida = VALUES(cantidad_recibida),
  recibido_completo = VALUES(recibido_completo);

-- Detalles de Orden 4: Panadería El Sol
INSERT INTO detalles_orden_compra (orden_compra_id, insumo_id, cantidad_solicitada, unidad_compra, costo_unitario_pactado_centimos, total_linea_centimos, cantidad_recibida, recibido_completo)
SELECT new.orden_compra_id, new.insumo_id, new.cantidad_solicitada, new.unidad_compra, new.costo_unitario_pactado_centimos, new.total_linea_centimos, new.cantidad_recibida, new.recibido_completo
FROM (
  SELECT
    oc.id AS orden_compra_id,
    i.id AS insumo_id,
    3.0000 AS cantidad_solicitada,
    'saco' AS unidad_compra,
    150000 AS costo_unitario_pactado_centimos,
    450000 AS total_linea_centimos,
    3.0000 AS cantidad_recibida,
    TRUE AS recibido_completo
  FROM ordenes_compra oc
  INNER JOIN insumos i ON i.tienda_id = oc.tienda_id
  WHERE oc.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')
    AND oc.sede_destino_id = (SELECT id FROM sedes WHERE codigo_interno = 'PS-001')
    AND oc.fecha_emision = DATE_SUB(CURDATE(), INTERVAL 10 DAY)
    AND i.codigo_interno = 'INS-S001'
  
  UNION ALL
  
  SELECT
    oc.id AS orden_compra_id,
    i.id AS insumo_id,
    2.0000 AS cantidad_solicitada,
    'saco' AS unidad_compra,
    90000 AS costo_unitario_pactado_centimos,
    180000 AS total_linea_centimos,
    2.0000 AS cantidad_recibida,
    TRUE AS recibido_completo
  FROM ordenes_compra oc
  INNER JOIN insumos i ON i.tienda_id = oc.tienda_id
  WHERE oc.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')
    AND oc.sede_destino_id = (SELECT id FROM sedes WHERE codigo_interno = 'PS-001')
    AND oc.fecha_emision = DATE_SUB(CURDATE(), INTERVAL 10 DAY)
    AND i.codigo_interno = 'INS-S002'
  
  UNION ALL
  
  SELECT
    oc.id AS orden_compra_id,
    i.id AS insumo_id,
    5.0000 AS cantidad_solicitada,
    'kg' AS unidad_compra,
    2000000 AS costo_unitario_pactado_centimos,
    100000 AS total_linea_centimos,
    5.0000 AS cantidad_recibida,
    TRUE AS recibido_completo
  FROM ordenes_compra oc
  INNER JOIN insumos i ON i.tienda_id = oc.tienda_id
  WHERE oc.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')
    AND oc.sede_destino_id = (SELECT id FROM sedes WHERE codigo_interno = 'PS-001')
    AND oc.fecha_emision = DATE_SUB(CURDATE(), INTERVAL 10 DAY)
    AND i.codigo_interno = 'INS-S003'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_recibida = VALUES(cantidad_recibida),
  recibido_completo = VALUES(recibido_completo);

-- Detalles de Orden 5: Tortas & Delicias
INSERT INTO detalles_orden_compra (orden_compra_id, insumo_id, cantidad_solicitada, unidad_compra, costo_unitario_pactado_centimos, total_linea_centimos, cantidad_recibida, recibido_completo)
SELECT new.orden_compra_id, new.insumo_id, new.cantidad_solicitada, new.unidad_compra, new.costo_unitario_pactado_centimos, new.total_linea_centimos, new.cantidad_recibida, new.recibido_completo
FROM (
  SELECT
    oc.id AS orden_compra_id,
    i.id AS insumo_id,
    30.0000 AS cantidad_solicitada,
    'paquete' AS unidad_compra,
    280000 AS costo_unitario_pactado_centimos,
    280000 AS total_linea_centimos,
    0.0000 AS cantidad_recibida,
    FALSE AS recibido_completo
  FROM ordenes_compra oc
  INNER JOIN insumos i ON i.tienda_id = oc.tienda_id
  WHERE oc.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569')
    AND oc.sede_destino_id = (SELECT id FROM sedes WHERE codigo_interno = 'TD-001')
    AND oc.fecha_emision = DATE_SUB(CURDATE(), INTERVAL 2 DAY)
    AND i.codigo_interno = 'INS-T001'
  
  UNION ALL
  
  SELECT
    oc.id AS orden_compra_id,
    i.id AS insumo_id,
    10.0000 AS cantidad_solicitada,
    'kg' AS unidad_compra,
    2800000 AS costo_unitario_pactado_centimos,
    280000 AS total_linea_centimos,
    0.0000 AS cantidad_recibida,
    FALSE AS recibido_completo
  FROM ordenes_compra oc
  INNER JOIN insumos i ON i.tienda_id = oc.tienda_id
  WHERE oc.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569')
    AND oc.sede_destino_id = (SELECT id FROM sedes WHERE codigo_interno = 'TD-001')
    AND oc.fecha_emision = DATE_SUB(CURDATE(), INTERVAL 2 DAY)
    AND i.codigo_interno = 'INS-T003'
) AS new
ON DUPLICATE KEY UPDATE
  cantidad_recibida = VALUES(cantidad_recibida),
  recibido_completo = VALUES(recibido_completo);
