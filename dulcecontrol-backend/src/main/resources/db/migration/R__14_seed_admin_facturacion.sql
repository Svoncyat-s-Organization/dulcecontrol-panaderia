-- ============================================================================
-- R__14: SEED MÓDULO DE FACTURACIÓN ADMIN
-- ============================================================================

-- =================================
-- SERIES DE TIENDAS
-- =================================

INSERT INTO tienda_series (
  tienda_id,
  sede_id,
  tipo_comprobante,
  serie,
  correlativo_actual,
  es_electronica,
  activa
)
VALUES
  -- Dulce Manjar - Sede Principal (Miraflores)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND es_principal = TRUE),
    'boleta',
    'B001',
    156,
    TRUE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND es_principal = TRUE),
    'factura',
    'F001',
    89,
    TRUE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND es_principal = TRUE),
    'nota_credito',
    'BC01',
    5,
    TRUE,
    TRUE
  ),
  
  -- Panadería El Sol - Sede Única (Surco)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND es_principal = TRUE),
    'boleta',
    'B001',
    234,
    TRUE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND es_principal = TRUE),
    'factura',
    'F001',
    67,
    TRUE,
    TRUE
  ),
  
  -- Tortas & Delicias - Local Principal (San Borja)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND es_principal = TRUE),
    'boleta',
    'B001',
    312,
    TRUE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM sedes WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND es_principal = TRUE),
    'factura',
    'F001',
    145,
    TRUE,
    TRUE
  )
ON DUPLICATE KEY UPDATE
  correlativo_actual = correlativo_actual,
  activa = activa;

-- =================================
-- COMPROBANTES DE TIENDAS
-- =================================

INSERT INTO tienda_comprobantes (
  tienda_id,
  pedido_id,
  serie_id,
  emisor_razon_social,
  emisor_ruc,
  emisor_direccion,
  cliente_tipo_doc,
  cliente_numero_doc,
  cliente_nombre,
  cliente_direccion,
  tipo_comprobante,
  correlativo,
  fecha_emision,
  moneda,
  total_gravado_centimos,
  total_igv_centimos,
  total_importe_centimos,
  estado_sunat,
  codigo_hash_cpe,
  xml_firmado_url,
  cdr_sunat_url,
  representacion_impresa_url
)
VALUES
  -- Boleta Dulce Manjar - Pedido completado reciente
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0001'),
    (SELECT id FROM tienda_series WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND serie = 'B001'),
    'Dulce Manjar Sociedad Anónima Cerrada',
    '20601234567',
    'Av. Larco 789, Miraflores, Lima',
    'DNI',
    '87654321',
    'MARTINEZ LOPEZ CARMEN ROSA',
    NULL,
    'boleta',
    155,
    DATE_SUB(CURDATE(), INTERVAL 3 DAY),
    'PEN',
    5932,
    1068,
    7000,
    'aceptado',
    'O7HqO+pN3bLG5VU8R4dOe3K1fG9hA==',
    'https://cdn.dulcecontrol.pe/cpe/20601234567-03-B001-00000155.xml',
    'https://cdn.dulcecontrol.pe/cpe/20601234567-03-B001-00000155-CDR.zip',
    'https://cdn.dulcecontrol.pe/cpe/20601234567-03-B001-00000155.pdf'
  ),
  
  -- Factura Dulce Manjar - Pedido empresarial
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM pedidos WHERE codigo_pedido = 'DM-2024-0002'),
    (SELECT id FROM tienda_series WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND serie = 'F001'),
    'Dulce Manjar Sociedad Anónima Cerrada',
    '20601234567',
    'Av. Larco 789, Miraflores, Lima',
    'RUC',
    '20501234567',
    'EVENTOS CORPORATIVOS SAC',
    'Av. República de Panamá 3545, San Isidro, Lima',
    'factura',
    89,
    DATE_SUB(CURDATE(), INTERVAL 2 DAY),
    'PEN',
    38135,
    6865,
    45000,
    'aceptado',
    'R8KpP+qO4cMH6WV9S5eQf4L2gH0iB==',
    'https://cdn.dulcecontrol.pe/cpe/20601234567-01-F001-00000089.xml',
    'https://cdn.dulcecontrol.pe/cpe/20601234567-01-F001-00000089-CDR.zip',
    'https://cdn.dulcecontrol.pe/cpe/20601234567-01-F001-00000089.pdf'
  ),
  
  -- Boleta Panadería El Sol - Pedido en proceso
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM pedidos WHERE codigo_pedido = 'PS-2024-0015'),
    (SELECT id FROM tienda_series WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND serie = 'B001'),
    'Panadería El Sol Empresa Individual de Responsabilidad Limitada',
    '20601234568',
    'Av. Universitaria 456, Los Olivos, Lima',
    'DNI',
    '45678901',
    'RODRIGUEZ PEREZ JUAN CARLOS',
    NULL,
    'boleta',
    234,
    DATE_SUB(CURDATE(), INTERVAL 1 DAY),
    'PEN',
    5085,
    915,
    6000,
    'aceptado',
    'P9LqQ+rP5dNI7XW0T6fRg5M3hI1jC==',
    'https://cdn.dulcecontrol.pe/cpe/20601234568-03-B001-00000234.xml',
    'https://cdn.dulcecontrol.pe/cpe/20601234568-03-B001-00000234-CDR.zip',
    'https://cdn.dulcecontrol.pe/cpe/20601234568-03-B001-00000234.pdf'
  ),
  
  -- Boleta Tortas & Delicias - Pedido online completado
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM pedidos WHERE codigo_pedido = 'TD-2024-0008'),
    (SELECT id FROM tienda_series WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND serie = 'B001'),
    'Tortas & Delicias Sociedad Anónima Cerrada',
    '20601234569',
    'Av. Benavides 321, Santiago de Surco, Lima',
    'DNI',
    '23456789',
    'GARCIA FERNANDEZ MARIA ELENA',
    NULL,
    'boleta',
    312,
    CURDATE(),
    'PEN',
    12712,
    2288,
    15000,
    'pendiente',
    'Q0MrR+sQ6eOJ8YX1U7gSh6N4iJ2kD==',
    'https://cdn.dulcecontrol.pe/cpe/20601234569-03-B001-00000312.xml',
    NULL,
    'https://cdn.dulcecontrol.pe/cpe/20601234569-03-B001-00000312.pdf'
  )
ON DUPLICATE KEY UPDATE
  estado_sunat = estado_sunat,
  cdr_sunat_url = cdr_sunat_url;

