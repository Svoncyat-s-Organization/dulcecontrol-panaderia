-- ============================================================================
-- R__11: SEED MÓDULO DE VENTAS (POS Y STOREFRONT)
-- ============================================================================

-- =================================
-- CAJAS
-- =================================

INSERT INTO cajas (
  tienda_id,
  sede_id,
  nombre,
  activa
)
VALUES
  -- Cajas Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') LIMIT 1),
    'Caja Principal',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') LIMIT 1),
    'Caja Express',
    TRUE
  ),
  
  -- Cajas Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') LIMIT 1),
    'Caja 1',
    TRUE
  ),
  
  -- Cajas Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') LIMIT 1),
    'Caja Principal',
    TRUE
  )
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  activa = VALUES(activa);

-- =================================
-- SESIONES DE CAJA
-- =================================

INSERT INTO sesiones_caja (
  tienda_id,
  caja_id,
  usuario_apertura_id,
  usuario_cierre_id,
  monto_inicial_centimos,
  monto_final_esperado_centimos,
  monto_final_real_centimos,
  fecha_apertura,
  fecha_cierre,
  esta_abierta
)
VALUES
  -- Sesión cerrada de ayer - Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM cajas WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND nombre = 'Caja Principal' LIMIT 1),
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND correo = 'vendedor1@dulcemanjar.pe' LIMIT 1),
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND correo = 'vendedor1@dulcemanjar.pe' LIMIT 1),
    10000,
    45500,
    45300,
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 8 HOUR,
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 20 HOUR,
    FALSE
  ),
  
  -- Sesión abierta de hoy - Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM cajas WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND nombre = 'Caja Principal' LIMIT 1),
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND correo = 'vendedor1@dulcemanjar.pe' LIMIT 1),
    NULL,
    10000,
    NULL,
    NULL,
    CURDATE() + INTERVAL 8 HOUR,
    NULL,
    TRUE
  ),
  
  -- Sesión abierta - Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM cajas WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND nombre = 'Caja 1' LIMIT 1),
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND correo = 'admin@panaderiasol.pe' LIMIT 1),
    NULL,
    5000,
    NULL,
    NULL,
    CURDATE() + INTERVAL 7 HOUR,
    NULL,
    TRUE
  )
ON DUPLICATE KEY UPDATE
  usuario_cierre_id = VALUES(usuario_cierre_id),
  monto_final_esperado_centimos = VALUES(monto_final_esperado_centimos),
  monto_final_real_centimos = VALUES(monto_final_real_centimos),
  fecha_cierre = VALUES(fecha_cierre),
  esta_abierta = VALUES(esta_abierta);

-- =================================
-- PEDIDOS
-- =================================

INSERT INTO pedidos (
  codigo_pedido,
  tienda_id,
  sede_origen_id,
  cliente_id,
  origen,
  sesion_caja_id,
  vendedor_id,
  estado_pedido,
  estado_pago,
  tipo_entrega,
  fecha_entrega_pactada,
  costo_delivery_centimos,
  moneda,
  subtotal_items_centimos,
  descuento_total_centimos,
  impuestos_totales_centimos,
  total_final_centimos,
  monto_pagado_centimos,
  requiere_comprobante,
  tipo_comprobante,
  serie_comprobante,
  numero_comprobante,
  notas_pedido,
  creado_en
)
VALUES
  -- Pedidos POS de ayer (cerrados) - Dulce Manjar
  (
    'DM-2024-0001',
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') LIMIT 1),
    (SELECT id FROM clientes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND nombre_doc = 'Cliente Genérico' LIMIT 1),
    'pos_local',
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = FALSE LIMIT 1),
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND correo = 'vendedor1@dulcemanjar.pe' LIMIT 1),
    'entregado',
    'pagado_total',
    'consumo_local',
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 10 HOUR,
    0,
    'PEN',
    1300,
    0,
    0,
    1300,
    1300,
    TRUE,
    'boleta',
    'B001',
    '00000023',
    NULL,
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 10 HOUR
  ),
  (
    'DM-2024-0002',
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') LIMIT 1),
    (SELECT id FROM clientes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND nombre_doc LIKE 'María%' LIMIT 1),
    'pos_local',
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = FALSE LIMIT 1),
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND correo = 'vendedor1@dulcemanjar.pe' LIMIT 1),
    'entregado',
    'pagado_total',
    'recojo_tienda',
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 14 HOUR,
    0,
    'PEN',
    6500,
    0,
    0,
    6500,
    6500,
    TRUE,
    'boleta',
    'B001',
    '00000024',
    'Torta para cumpleaños - Recoger a las 2pm',
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 11 HOUR
  ),
  (
    'DM-2024-0003',
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') LIMIT 1),
    (SELECT id FROM clientes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND nombre_doc = 'Cliente Genérico' LIMIT 1),
    'pos_local',
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = FALSE LIMIT 1),
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND correo = 'vendedor1@dulcemanjar.pe' LIMIT 1),
    'entregado',
    'pagado_total',
    'consumo_local',
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR,
    0,
    'PEN',
    2550,
    0,
    0,
    2550,
    2550,
    TRUE,
    'boleta',
    'B001',
    '00000025',
    NULL,
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR
  ),

  -- Pedidos de hoy - Dulce Manjar
  (
    'DM-2024-0004',
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') LIMIT 1),
    (SELECT id FROM clientes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND nombre_doc = 'Cliente Genérico' LIMIT 1),
    'pos_local',
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = TRUE LIMIT 1),
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND correo = 'vendedor1@dulcemanjar.pe' LIMIT 1),
    'entregado',
    'pagado_total',
    'consumo_local',
    CURDATE() + INTERVAL 9 HOUR,
    0,
    'PEN',
    1200,
    0,
    0,
    1200,
    1200,
    TRUE,
    'boleta',
    'B001',
    '00000026',
    NULL,
    CURDATE() + INTERVAL 9 HOUR
  ),
  (
    'DM-2024-0005',
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') LIMIT 1),
    (SELECT id FROM clientes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND nombre_doc LIKE 'Carlos%' LIMIT 1),
    'storefront_online',
    NULL,
    NULL,
    'en_preparacion',
    'pagado_total',
    'recojo_tienda',
    CURDATE() + INTERVAL 18 HOUR,
    0,
    'PEN',
    8500,
    0,
    0,
    8500,
    8500,
    TRUE,
    'boleta',
    NULL,
    NULL,
    'Torta Selva Negra para aniversario - Recoger a las 6pm',
    CURDATE() + INTERVAL 10 HOUR + INTERVAL 30 MINUTE
  ),

  -- Pedidos Panadería El Sol
  (
    'PS-2024-0015',
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') LIMIT 1),
    (SELECT id FROM clientes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND nombre_doc = 'Cliente Genérico' LIMIT 1),
    'pos_local',
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND esta_abierta = TRUE LIMIT 1),
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND correo = 'admin@panaderiasol.pe' LIMIT 1),
    'entregado',
    'pagado_total',
    'consumo_local',
    CURDATE() + INTERVAL 8 HOUR,
    0,
    'PEN',
    335,
    0,
    0,
    335,
    335,
    TRUE,
    'boleta',
    'B001',
    '00000102',
    NULL,
    CURDATE() + INTERVAL 8 HOUR + INTERVAL 15 MINUTE
  ),
  (
    'PS-2024-0016',
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') LIMIT 1),
    (SELECT id FROM clientes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND nombre_doc = 'Cliente Genérico' LIMIT 1),
    'pos_local',
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND esta_abierta = TRUE LIMIT 1),
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND correo = 'admin@panaderiasol.pe' LIMIT 1),
    'entregado',
    'pagado_total',
    'consumo_local',
    CURDATE() + INTERVAL 9 HOUR,
    0,
    'PEN',
    750,
    0,
    0,
    750,
    750,
    TRUE,
    'boleta',
    'B001',
    '00000103',
    NULL,
    CURDATE() + INTERVAL 9 HOUR + INTERVAL 45 MINUTE
  ),

  -- Pedido online pendiente - Tortas & Delicias
  (
    'TD-2024-0008',
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') LIMIT 1),
    (SELECT id FROM clientes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND nombre_doc LIKE 'Ana%' LIMIT 1),
    'storefront_online',
    NULL,
    NULL,
    'pendiente_pago',
    'pendiente',
    'recojo_tienda',
    DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 17 HOUR,
    0,
    'PEN',
    12500,
    0,
    0,
    12500,
    0,
    TRUE,
    'boleta',
    NULL,
    NULL,
    'Torta Red Velvet para boda - confirmar decoración',
    CURDATE() + INTERVAL 11 HOUR
  ),
  
  -- Pedido telefónico - Tortas & Delicias
  (
    'TD-2024-0009',
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') LIMIT 1),
    (SELECT id FROM clientes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND nombre_doc LIKE 'Roberto%' LIMIT 1),
    'telefono',
    NULL,
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND correo = 'admin@tortasdelicias.pe' LIMIT 1),
    'pagado',
    'pagado_total',
    'recojo_tienda',
    DATE_ADD(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR,
    0,
    'PEN',
    2800,
    0,
    0,
    2800,
    2800,
    TRUE,
    'boleta',
    NULL,
    NULL,
    'Macarons surtidos - pago por transferencia',
    CURDATE() + INTERVAL 14 HOUR
  )
ON DUPLICATE KEY UPDATE
  estado_pedido = VALUES(estado_pedido),
  estado_pago = VALUES(estado_pago),
  monto_pagado_centimos = VALUES(monto_pagado_centimos),
  notas_pedido = VALUES(notas_pedido);

-- =================================
-- DETALLES DE PEDIDO
-- =================================

INSERT INTO detalles_pedido (
  pedido_id,
  producto_id,
  cantidad,
  precio_unitario_centimos,
  subtotal_linea_centimos,
  notas_item
)
VALUES
  -- Detalles pedido DM-2024-0001
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0001'),
    (SELECT id FROM productos WHERE sku = 'DM-POST-002'),
    2,
    650,
    1300,
    NULL
  ),
  
  -- Detalles pedido DM-2024-0002
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0002'),
    (SELECT id FROM productos WHERE sku = 'DM-TORTA-001'),
    1,
    6500,
    6500,
    'Con dedicatoria: Feliz Cumpleaños Mamá'
  ),
  
  -- Detalles pedido DM-2024-0003
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0003'),
    (SELECT id FROM productos WHERE sku = 'DM-POST-001'),
    2,
    850,
    1700,
    NULL
  ),
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0003'),
    (SELECT id FROM productos WHERE sku = 'DM-POST-002'),
    1,
    650,
    650,
    NULL
  ),
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0003'),
    (SELECT id FROM productos WHERE sku = 'DM-BEB-001'),
    1,
    550,
    550,
    NULL
  ),
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0003'),
    (SELECT id FROM productos WHERE sku = 'DM-BEB-001'),
    1,
    550,
    550,
    NULL
  ),
  
  -- Detalles pedido DM-2024-0004
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0004'),
    (SELECT id FROM productos WHERE sku = 'DM-POST-001'),
    1,
    850,
    850,
    NULL
  ),
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0004'),
    (SELECT id FROM productos WHERE sku = 'DM-POST-002'),
    1,
    650,
    650,
    NULL
  ),
  
  -- Detalles pedido DM-2024-0005 (online)
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0005'),
    (SELECT id FROM productos WHERE sku = 'DM-TORTA-002'),
    1,
    8500,
    8500,
    'Con dedicatoria: Feliz Aniversario Amor'
  ),
  
  -- Detalles pedido PS-2024-0015
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'PS-2024-0015'),
    (SELECT id FROM productos WHERE sku = 'PS-PAN-001'),
    5,
    35,
    175,
    NULL
  ),
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'PS-2024-0015'),
    (SELECT id FROM productos WHERE sku = 'PS-PAN-002'),
    1,
    150,
    150,
    NULL
  ),
  
  -- Detalles pedido PS-2024-0016
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'PS-2024-0016'),
    (SELECT id FROM productos WHERE sku = 'PS-BOC-001'),
    1,
    450,
    450,
    NULL
  ),
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'PS-2024-0016'),
    (SELECT id FROM productos WHERE sku = 'PS-PAN-002'),
    2,
    150,
    300,
    NULL
  ),
  
  -- Detalles pedido TD-2024-0008 (pendiente)
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'TD-2024-0008'),
    (SELECT id FROM productos WHERE sku = 'TD-TORTA-001'),
    1,
    12500,
    12500,
    'Decoración temática boda vintage - enviar fotos referencia'
  ),
  
  -- Detalles pedido TD-2024-0009
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'TD-2024-0009'),
    (SELECT id FROM productos WHERE sku = 'TD-POST-001'),
    1,
    2800,
    2800,
    NULL
  )
ON DUPLICATE KEY UPDATE
  cantidad = VALUES(cantidad),
  precio_unitario_centimos = VALUES(precio_unitario_centimos),
  subtotal_linea_centimos = VALUES(subtotal_linea_centimos),
  notas_item = VALUES(notas_item);

-- =================================
-- PERSONALIZACIONES (solo para items personalizables)
-- =================================

INSERT INTO personalizaciones_item_pedido (
  detalle_pedido_id,
  descripcion_solicitud,
  texto_dedicatoria,
  sabor_masa,
  sabor_relleno,
  fecha_limite_produccion,
  costo_extra_personalizacion_centimos
)
VALUES
  -- Personalización Torta Tres Leches (pedido DM-2024-0002)
  (
    (SELECT dp.id FROM detalles_pedido dp 
     INNER JOIN pedidos p ON p.id = dp.pedido_id 
     WHERE p.codigo_pedido = 'DM-2024-0002' LIMIT 1),
    'Torta tres leches con decoración simple',
    'Feliz Cumpleaños Mamá',
    'vainilla',
    'tres_leches',
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 12 HOUR,
    0
  ),
  
  -- Personalización Torta Selva Negra (pedido DM-2024-0005)
  (
    (SELECT dp.id FROM detalles_pedido dp 
     INNER JOIN pedidos p ON p.id = dp.pedido_id 
     WHERE p.codigo_pedido = 'DM-2024-0005' LIMIT 1),
    'Torta Selva Negra con decoración elegante',
    'Feliz Aniversario Amor',
    'chocolate',
    'crema_chantilly_cereza',
    CURDATE() + INTERVAL 16 HOUR,
    0
  ),
  
  -- Personalización Torta Red Velvet (pedido TD-2024-0008)
  (
    (SELECT dp.id FROM detalles_pedido dp 
     INNER JOIN pedidos p ON p.id = dp.pedido_id 
     WHERE p.codigo_pedido = 'TD-2024-0008' LIMIT 1),
    'Torta Red Velvet Premium con decoración temática boda vintage',
    NULL,
    'red_velvet',
    'queso_crema',
    DATE_ADD(CURDATE(), INTERVAL 2 DAY) + INTERVAL 14 HOUR,
    0
  )
ON DUPLICATE KEY UPDATE
  descripcion_solicitud = VALUES(descripcion_solicitud),
  texto_dedicatoria = VALUES(texto_dedicatoria);

-- =================================
-- PAGOS DE PEDIDOS
-- =================================

INSERT INTO pagos_pedido (
  pedido_id,
  sesion_caja_id,
  monto_pagado_centimos,
  metodo_pago,
  referencia_externa,
  fecha_pago,
  registrado_por
)
VALUES
  -- Pagos de pedidos de ayer - Dulce Manjar
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0001'),
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = FALSE LIMIT 1),
    1300,
    'efectivo',
    NULL,
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 10 HOUR,
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND correo = 'vendedor1@dulcemanjar.pe' LIMIT 1)
  ),
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0002'),
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = FALSE LIMIT 1),
    6500,
    'yape',
    'YAPE-20241111-123456',
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 11 HOUR,
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND correo = 'vendedor1@dulcemanjar.pe' LIMIT 1)
  ),
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0003'),
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = FALSE LIMIT 1),
    2550,
    'efectivo',
    NULL,
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR,
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND correo = 'vendedor1@dulcemanjar.pe' LIMIT 1)
  ),
  
  -- Pagos de hoy - Dulce Manjar
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0004'),
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = TRUE LIMIT 1),
    1200,
    'efectivo',
    NULL,
    CURDATE() + INTERVAL 9 HOUR,
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND correo = 'vendedor1@dulcemanjar.pe' LIMIT 1)
  ),
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0005'),
    NULL,
    8500,
    'pasarela_online',
    'NIUBIZ-20241112-789012',
    CURDATE() + INTERVAL 10 HOUR + INTERVAL 35 MINUTE,
    NULL
  ),
  
  -- Pagos Panadería El Sol
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'PS-2024-0015'),
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND esta_abierta = TRUE LIMIT 1),
    335,
    'efectivo',
    NULL,
    CURDATE() + INTERVAL 8 HOUR + INTERVAL 15 MINUTE,
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND correo = 'admin@panaderiasol.pe' LIMIT 1)
  ),
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'PS-2024-0016'),
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND esta_abierta = TRUE LIMIT 1),
    750,
    'plin',
    'PLIN-20241112-456789',
    CURDATE() + INTERVAL 9 HOUR + INTERVAL 45 MINUTE,
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND correo = 'admin@panaderiasol.pe' LIMIT 1)
  ),
  
  -- Pago Tortas & Delicias (telefónico)
  (
    (SELECT id FROM pedidos WHERE codigo_pedido = 'TD-2024-0009'),
    NULL,
    2800,
    'transferencia',
    'BCP-20241112-001234',
    CURDATE() + INTERVAL 14 HOUR + INTERVAL 10 MINUTE,
    (SELECT id FROM usuarios_tienda WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND correo = 'admin@tortasdelicias.pe' LIMIT 1)
  )
ON DUPLICATE KEY UPDATE
  monto_pagado_centimos = VALUES(monto_pagado_centimos),
  referencia_externa = VALUES(referencia_externa);

-- =================================
-- MOVIMIENTOS DE CAJA
-- =================================

INSERT INTO movimientos_caja (
  sesion_caja_id,
  tipo_movimiento,
  monto_centimos,
  metodo_pago,
  pedido_id,
  concepto,
  creado_en
)
VALUES
  -- Movimientos sesión cerrada de ayer - Dulce Manjar
  (
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = FALSE LIMIT 1),
    'venta',
    1300,
    'efectivo',
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0001'),
    'Venta de 2 alfajores',
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 10 HOUR
  ),
  (
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = FALSE LIMIT 1),
    'venta',
    6500,
    'yape',
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0002'),
    'Venta de torta tres leches personalizada',
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 11 HOUR
  ),
  (
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = FALSE LIMIT 1),
    'gasto_operativo',
    -500,
    'efectivo',
    NULL,
    'Compra de insumos menores',
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 12 HOUR
  ),
  (
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = FALSE LIMIT 1),
    'venta',
    2550,
    'efectivo',
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0003'),
    'Venta de postres y bebidas',
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 16 HOUR
  ),
  (
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = FALSE LIMIT 1),
    'retiro_efectivo',
    -25000,
    'efectivo',
    NULL,
    'Retiro para depósito bancario',
    DATE_SUB(CURDATE(), INTERVAL 1 DAY) + INTERVAL 19 HOUR + INTERVAL 30 MINUTE
  ),
  
  -- Movimientos sesión abierta de hoy - Dulce Manjar
  (
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND esta_abierta = TRUE LIMIT 1),
    'venta',
    1200,
    'efectivo',
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0004'),
    'Venta de postres',
    CURDATE() + INTERVAL 9 HOUR
  ),
  
  -- Movimientos Panadería El Sol
  (
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND esta_abierta = TRUE LIMIT 1),
    'venta',
    335,
    'efectivo',
    (SELECT id FROM pedidos WHERE codigo_pedido = 'PS-2024-0015'),
    'Venta de panes',
    CURDATE() + INTERVAL 8 HOUR + INTERVAL 15 MINUTE
  ),
  (
    (SELECT id FROM sesiones_caja WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND esta_abierta = TRUE LIMIT 1),
    'venta',
    750,
    'plin',
    (SELECT id FROM pedidos WHERE codigo_pedido = 'PS-2024-0016'),
    'Venta de empanada y panes',
    CURDATE() + INTERVAL 9 HOUR + INTERVAL 45 MINUTE
  )
ON DUPLICATE KEY UPDATE
  monto_centimos = VALUES(monto_centimos),
  concepto = VALUES(concepto);
