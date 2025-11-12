-- ============================================================================
-- R_03: SEED TIENDAS (SUPERADMIN)
-- ============================================================================

-- =================================
-- TIENDAS DE PRUEBA
-- =================================

INSERT INTO tiendas (slug, tipo_doc, numero_doc, nombre_doc, nombre_comercial, correo_contacto, telefono_contacto, hash_contrasena, estado)
VALUES
  (
    'dulce-manjar',
    'RUC',
    '20601234567',
    'DULCE MANJAR S.A.C.',
    'Dulce Manjar - Pastelería Artesanal',
    'contacto@dulcemanjar.pe',
    '987654321',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'activa'
  ),
  (
    'panaderia-sol',
    'RUC',
    '20601234568',
    'PANADERIA EL SOL E.I.R.L.',
    'Panadería El Sol',
    'ventas@panaderiasol.pe',
    '987654322',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'activa'
  ),
  (
    'tortas-delicias',
    'RUC',
    '20601234569',
    'DELICIAS GOURMET S.A.C.',
    'Tortas & Delicias',
    'info@tortasdelicias.pe',
    '987654323',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'en_prueba'
  )
AS new
ON DUPLICATE KEY UPDATE
  slug = new.slug,
  nombre_doc = new.nombre_doc,
  nombre_comercial = new.nombre_comercial,
  correo_contacto = new.correo_contacto,
  telefono_contacto = new.telefono_contacto,
  estado = new.estado;

-- =================================
-- SEDES DE LAS TIENDAS
-- =================================

INSERT INTO sedes (tienda_id, codigo_interno, nombre, direccion, telefono, distrito_id, es_principal, activo)
VALUES
  -- Sedes de Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'DM-001',
    'Sede Principal - Miraflores',
    'Av. Larco 1234, Miraflores',
    '987654321',
    (SELECT id FROM ubigeo_distritos WHERE codigo_ubigeo = '150122'), -- Miraflores, Lima
    TRUE,
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'DM-002',
    'Sucursal San Isidro',
    'Av. Conquistadores 567, San Isidro',
    '987654324',
    (SELECT id FROM ubigeo_distritos WHERE codigo_ubigeo = '150131'), -- San Isidro, Lima
    FALSE,
    TRUE
  ),
  -- Sedes de Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'PS-001',
    'Sede Única - Surco',
    'Av. Benavides 2345, Santiago de Surco',
    '987654322',
    (SELECT id FROM ubigeo_distritos WHERE codigo_ubigeo = '150140'), -- Santiago de Surco, Lima
    TRUE,
    TRUE
  ),
  -- Sedes de Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'TD-001',
    'Local Principal - San Borja',
    'Av. Aviación 890, San Borja',
    '987654323',
    (SELECT id FROM ubigeo_distritos WHERE codigo_ubigeo = '150130'), -- San Borja, Lima
    TRUE,
    TRUE
  )
AS new
ON DUPLICATE KEY UPDATE
  codigo_interno = new.codigo_interno,
  nombre = new.nombre,
  direccion = new.direccion,
  telefono = new.telefono,
  distrito_id = new.distrito_id,
  es_principal = new.es_principal,
  activo = new.activo;

-- =================================
-- DOMINIOS DE LAS TIENDAS
-- =================================

INSERT INTO dominios_tienda (tienda_id, tipo, url_dominio, url_logo, url_favicon, color_primario, color_secundario)
VALUES
  -- Dominios de Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'administrativo',
    'admin.dulcemanjar.pe',
    'https://cdn.dulcemanjar.pe/logo-admin.png',
    'https://cdn.dulcemanjar.pe/favicon-admin.ico',
    '#8B4513',
    '#FFE4B5'
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'tienda_virtual',
    'tienda.dulcemanjar.pe',
    'https://cdn.dulcemanjar.pe/logo-tienda.png',
    'https://cdn.dulcemanjar.pe/favicon-tienda.ico',
    '#D2691E',
    '#FFF8DC'
  ),
  -- Dominios de Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'administrativo',
    'admin.panaderiasol.pe',
    'https://cdn.panaderiasol.pe/logo-admin.png',
    'https://cdn.panaderiasol.pe/favicon-admin.ico',
    '#FF8C00',
    '#FFFACD'
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'tienda_virtual',
    'tienda.panaderiasol.pe',
    'https://cdn.panaderiasol.pe/logo-tienda.png',
    'https://cdn.panaderiasol.pe/favicon-tienda.ico',
    '#FFA500',
    '#FFFFE0'
  ),
  -- Dominios de Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'administrativo',
    'admin.tortasdelicias.pe',
    'https://cdn.tortasdelicias.pe/logo-admin.png',
    'https://cdn.tortasdelicias.pe/favicon-admin.ico',
    '#FF1493',
    '#FFF0F5'
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'tienda_virtual',
    'tienda.tortasdelicias.pe',
    'https://cdn.tortasdelicias.pe/logo-tienda.png',
    'https://cdn.tortasdelicias.pe/favicon-tienda.ico',
    '#FF69B4',
    '#FFF5EE'
  )
AS new
ON DUPLICATE KEY UPDATE
  tipo = new.tipo,
  url_dominio = new.url_dominio,
  url_logo = new.url_logo,
  url_favicon = new.url_favicon,
  color_primario = new.color_primario,
  color_secundario = new.color_secundario;