-- ============================================================================
-- R__05: SEED MÓDULO DE FACTURACIÓN SUPERADMIN
-- ============================================================================

-- =================================
-- SERIES DE COMPROBANTES
-- =================================

INSERT INTO series (
  tipos_comprobante,
  serie,
  ultimo_correlativo,
  activo,
  es_predeterminada
)
VALUES
  ('FACTURA', 'F001', 15, TRUE, TRUE),
  ('BOLETA', 'B001', 8, TRUE, TRUE),
  ('NOTA_CREDITO', 'FC01', 2, TRUE, FALSE),
  ('NOTA_DEBITO', 'FD01', 0, TRUE, FALSE)
ON DUPLICATE KEY UPDATE
  ultimo_correlativo = VALUES(ultimo_correlativo),
  activo = VALUES(activo),
  es_predeterminada = VALUES(es_predeterminada);

-- =================================
-- COMPROBANTES DE SUSCRIPCIONES
-- =================================

INSERT INTO comprobantes (
  referencia_id,
  tienda_id,
  suscripcion_id,
  serie_id,
  estado_pago,
  tipos_comprobante,
  correlativo,
  fecha_emision,
  cliente_tipo_doc,
  cliente_num_doc,
  cliente_nombre_doc,
  cliente_direccion,
  moneda,
  total_gravado_centimos,
  total_igv_centimos,
  total_importe_centimos,
  estados_sunat,
  url_pdf
)
VALUES
  -- Factura Dulce Manjar (RUC 20601234567) - Suscripción Profesional
  (
    NULL,
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM suscripciones WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') LIMIT 1),
    (SELECT id FROM series WHERE serie = 'F001'),
    'PAGADO',
    'FACTURA',
    13,
    DATE_SUB(CURDATE(), INTERVAL 15 DAY),
    'RUC',
    '20601234567',
    'Dulce Manjar Sociedad Anónima Cerrada',
    'Av. Larco 789, Miraflores, Lima',
    'PEN',
    12712,
    2288,
    15000,
    'ACEPTADO',
    'https://cdn.dulcecontrol.pe/facturas/F001-00000013.pdf'
  ),
  -- Factura Panadería El Sol (RUC 20601234568) - Suscripción Básico
  (
    NULL,
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM suscripciones WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') LIMIT 1),
    (SELECT id FROM series WHERE serie = 'F001'),
    'PAGADO',
    'FACTURA',
    14,
    DATE_SUB(CURDATE(), INTERVAL 10 DAY),
    'RUC',
    '20601234568',
    'Panadería El Sol Empresa Individual de Responsabilidad Limitada',
    'Av. Universitaria 456, Los Olivos, Lima',
    'PEN',
    8475,
    1525,
    10000,
    'ACEPTADO',
    'https://cdn.dulcecontrol.pe/facturas/F001-00000014.pdf'
  ),
  -- Factura Tortas & Delicias (RUC 20601234569) - Suscripción Premium
  (
    NULL,
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM suscripciones WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') LIMIT 1),
    (SELECT id FROM series WHERE serie = 'F001'),
    'PAGADO',
    'FACTURA',
    15,
    DATE_SUB(CURDATE(), INTERVAL 5 DAY),
    'RUC',
    '20601234569',
    'Tortas & Delicias Sociedad Anónima Cerrada',
    'Av. Benavides 321, Santiago de Surco, Lima',
    'PEN',
    16950,
    3050,
    20000,
    'ACEPTADO',
    'https://cdn.dulcecontrol.pe/facturas/F001-00000015.pdf'
  )
ON DUPLICATE KEY UPDATE
  estado_pago = VALUES(estado_pago),
  estados_sunat = VALUES(estados_sunat);

-- =================================
-- DETALLES DE COMPROBANTES
-- =================================

INSERT INTO detalles_comprobante (
  comprobante_id,
  descripcion,
  cantidad,
  valor_unitario_centimos,
  precio_unitario_centimos,
  igv_item_centimos,
  total_item_centimos
)
VALUES
  -- Detalle Dulce Manjar - Plan Profesional
  (
    (SELECT id FROM comprobantes WHERE tipos_comprobante = 'FACTURA' AND correlativo = 13),
    'Suscripción Plan Profesional - Mes de Noviembre 2024',
    1,
    12712,
    15000,
    2288,
    15000
  ),
  -- Detalle Panadería El Sol - Plan Básico
  (
    (SELECT id FROM comprobantes WHERE tipos_comprobante = 'FACTURA' AND correlativo = 14),
    'Suscripción Plan Básico - Mes de Noviembre 2024',
    1,
    8475,
    10000,
    1525,
    10000
  ),
  -- Detalle Tortas & Delicias - Plan Premium
  (
    (SELECT id FROM comprobantes WHERE tipos_comprobante = 'FACTURA' AND correlativo = 15),
    'Suscripción Plan Premium - Mes de Noviembre 2024',
    1,
    16950,
    20000,
    3050,
    20000
  )
ON DUPLICATE KEY UPDATE
  descripcion = VALUES(descripcion);

-- =================================
-- TRANSACCIONES DE PAGO
-- =================================

INSERT INTO transacciones_pago (
  tienda_id,
  comprobante_id,
  pasarela,
  id_transaccion_pasarela,
  monto_centimos,
  moneda,
  estado,
  metadata_pasarela,
  creado_en
)
VALUES
  -- Pago Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM comprobantes WHERE tipos_comprobante = 'FACTURA' AND correlativo = 13),
    'niubiz',
    'NIUBIZ-20241028-567890',
    15000,
    'PEN',
    'EXITOSO',
    JSON_OBJECT(
      'tarjeta_marca', 'Visa',
      'tarjeta_ultimos4', '4532',
      'codigo_autorizacion', '123456',
      'cuotas', 1
    ),
    DATE_SUB(CURDATE(), INTERVAL 15 DAY) + INTERVAL 10 HOUR
  ),
  -- Pago Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM comprobantes WHERE tipos_comprobante = 'FACTURA' AND correlativo = 14),
    'niubiz',
    'NIUBIZ-20241102-234567',
    10000,
    'PEN',
    'EXITOSO',
    JSON_OBJECT(
      'tarjeta_marca', 'Mastercard',
      'tarjeta_ultimos4', '5412',
      'codigo_autorizacion', '789012',
      'cuotas', 1
    ),
    DATE_SUB(CURDATE(), INTERVAL 10 DAY) + INTERVAL 14 HOUR
  ),
  -- Pago Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM comprobantes WHERE tipos_comprobante = 'FACTURA' AND correlativo = 15),
    'niubiz',
    'NIUBIZ-20241107-890123',
    20000,
    'PEN',
    'EXITOSO',
    JSON_OBJECT(
      'tarjeta_marca', 'Visa',
      'tarjeta_ultimos4', '4916',
      'codigo_autorizacion', '345678',
      'cuotas', 1
    ),
    DATE_SUB(CURDATE(), INTERVAL 5 DAY) + INTERVAL 11 HOUR
  )
ON DUPLICATE KEY UPDATE
  estado = VALUES(estado);
