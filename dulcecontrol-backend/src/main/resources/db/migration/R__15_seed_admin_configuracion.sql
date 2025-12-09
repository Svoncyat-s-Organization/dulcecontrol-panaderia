-- ============================================================================
-- R_15: SEED MÓDULO DE CONFIGURACIÓN Y CMS
-- ============================================================================

-- =================================
-- CONFIGURACIÓN DE TIENDAS
-- =================================

INSERT INTO configuracion_tienda (
  tienda_id,
  ruc,
  razon_social,
  direccion_fiscal,
  ubigeo_fiscal,
  usuario_sunat_sol,
  clave_sunat_sol_encriptada,
  certificado_digital_url,
  modo_sunat,
  tasa_igv,
  api_key_yape,
  api_key_plin,
  merchant_id_niubiz,
  slogan_tienda,
  banner_principal_url,
  mensaje_bienvenida,
  horario_atencion,
  redes_sociales,
  email_notificaciones,
  telegram_bot_token,
  telegram_chat_id
)
VALUES
  -- Configuración Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    '20601234567',
    'Dulce Manjar Sociedad Anónima Cerrada',
    'Av. Larco 789, Miraflores, Lima',
    (SELECT d.codigo_ubigeo FROM ubigeo_distritos d 
     INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id 
     INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id 
     WHERE d.nombre = 'MIRAFLORES' AND p.nombre = 'LIMA' AND dep.nombre = 'LIMA'),
    'MODDATOS',
    'AES256:encrypted_password_here_dm',
    'https://cdn.dulcemanjar.pe/certificados/certificado-digital.pfx',
    'pruebas',
    18.00,
    'yape_api_key_dulcemanjar_prod',
    'plin_api_key_dulcemanjar_prod',
    'merchant_niubiz_456789123',
    'Dulces Momentos',
    'https://images.unsplash.com/photo-1587241321921-91a834d6d191?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFrZXJ5JTIwY2FmZXxlbnwwfHwwfHx8MA%3D%3D',
    '¡Bienvenidos a Dulce Manjar! La mejor repostería artesanal de Lima. Hacemos tus momentos especiales aún más dulces.',
    JSON_OBJECT(
      'lunes', JSON_OBJECT('abierto', true, 'horario', '07:00 - 21:00'),
      'martes', JSON_OBJECT('abierto', true, 'horario', '07:00 - 21:00'),
      'miercoles', JSON_OBJECT('abierto', true, 'horario', '07:00 - 21:00'),
      'jueves', JSON_OBJECT('abierto', true, 'horario', '07:00 - 21:00'),
      'viernes', JSON_OBJECT('abierto', true, 'horario', '07:00 - 22:00'),
      'sabado', JSON_OBJECT('abierto', true, 'horario', '08:00 - 22:00'),
      'domingo', JSON_OBJECT('abierto', true, 'horario', '08:00 - 20:00')
    ),
    JSON_OBJECT(
      'facebook', 'https://facebook.com/dulcemanjar',
      'instagram', 'https://instagram.com/dulcemanjar_oficial',
      'tiktok', 'https://tiktok.com/@dulcemanjar',
      'whatsapp', '+51987654321'
    ),
    'pedidos@dulcemanjar.pe',
    'bot_token_telegram_dulcemanjar_123456',
    'chat_id_telegram_dm_789012'
  ),
  -- Configuración Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    '20601234568',
    'Panadería El Sol Empresa Individual de Responsabilidad Limitada',
    'Av. Universitaria 456, Los Olivos, Lima',
    (SELECT d.codigo_ubigeo FROM ubigeo_distritos d 
     INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id 
     INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id 
     WHERE d.nombre = 'LOS OLIVOS' AND p.nombre = 'LIMA' AND dep.nombre = 'LIMA'),
    'MODDATOS',
    'AES256:encrypted_password_here_ps',
    NULL,
    'pruebas',
    18.00,
    NULL,
    NULL,
    NULL,
    'Pan Fresco Diario',
    'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFrZXJ5fGVufDB8fDB8fHww',
    'Panadería El Sol - Pan fresco todos los días desde 1995. Calidad y tradición en cada bocado.',
    JSON_OBJECT(
      'lunes', JSON_OBJECT('abierto', true, 'horario', '06:00 - 20:00'),
      'martes', JSON_OBJECT('abierto', true, 'horario', '06:00 - 20:00'),
      'miercoles', JSON_OBJECT('abierto', true, 'horario', '06:00 - 20:00'),
      'jueves', JSON_OBJECT('abierto', true, 'horario', '06:00 - 20:00'),
      'viernes', JSON_OBJECT('abierto', true, 'horario', '06:00 - 20:00'),
      'sabado', JSON_OBJECT('abierto', true, 'horario', '06:00 - 21:00'),
      'domingo', JSON_OBJECT('abierto', true, 'horario', '07:00 - 19:00')
    ),
    JSON_OBJECT(
      'facebook', 'https://facebook.com/panaderiasol',
      'instagram', 'https://instagram.com/panaderia_elsol',
      'whatsapp', '+51945123456'
    ),
    'contacto@panaderiasol.pe',
    NULL,
    NULL
  ),
  -- Configuración Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    '20601234569',
    'Tortas & Delicias Sociedad Anónima Cerrada',
    'Av. Benavides 321, Santiago de Surco, Lima',
    (SELECT d.codigo_ubigeo FROM ubigeo_distritos d 
     INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id 
     INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id 
     WHERE d.nombre = 'SANTIAGO DE SURCO' AND p.nombre = 'LIMA' AND dep.nombre = 'LIMA'),
    'MODDATOS',
    'AES256:encrypted_password_here_td',
    'https://cdn.tortasydelicias.pe/certificados/cert-digital.p12',
    'pruebas',
    18.00,
    'yape_api_key_tortasdelicias',
    'plin_api_key_tortasdelicias',
    'merchant_niubiz_987654321',
    'Celebra con Sabor',
    'https://wallpapers.com/images/hd/shot-of-bakery-bread-x4bgj6adcoqjiohh.jpg',
    'Bienvenido a Tortas & Delicias. Creamos las tortas más hermosas y deliciosas para tus celebraciones especiales. ¡Hacemos realidad tus sueños más dulces!',
    JSON_OBJECT(
      'lunes', JSON_OBJECT('abierto', false, 'horario', 'Cerrado'),
      'martes', JSON_OBJECT('abierto', true, 'horario', '09:00 - 19:00'),
      'miercoles', JSON_OBJECT('abierto', true, 'horario', '09:00 - 19:00'),
      'jueves', JSON_OBJECT('abierto', true, 'horario', '09:00 - 19:00'),
      'viernes', JSON_OBJECT('abierto', true, 'horario', '09:00 - 20:00'),
      'sabado', JSON_OBJECT('abierto', true, 'horario', '09:00 - 20:00'),
      'domingo', JSON_OBJECT('abierto', true, 'horario', '10:00 - 18:00')
    ),
    JSON_OBJECT(
      'facebook', 'https://facebook.com/tortasydelicias',
      'instagram', 'https://instagram.com/tortas_delicias_oficial',
      'tiktok', 'https://tiktok.com/@tortasydelicias',
      'pinterest', 'https://pinterest.com/tortasydelicias',
      'whatsapp', '+51962345678'
    ),
    'ventas@tortasydelicias.pe',
    'bot_token_telegram_td_654321',
    'chat_id_telegram_td_321098'
  )
ON DUPLICATE KEY UPDATE
  ruc = VALUES(ruc),
  razon_social = VALUES(razon_social),
  direccion_fiscal = VALUES(direccion_fiscal),
  ubigeo_fiscal = VALUES(ubigeo_fiscal),
  usuario_sunat_sol = VALUES(usuario_sunat_sol),
  clave_sunat_sol_encriptada = VALUES(clave_sunat_sol_encriptada),
  certificado_digital_url = VALUES(certificado_digital_url),
  modo_sunat = VALUES(modo_sunat),
  tasa_igv = VALUES(tasa_igv),
  api_key_yape = VALUES(api_key_yape),
  api_key_plin = VALUES(api_key_plin),
  merchant_id_niubiz = VALUES(merchant_id_niubiz),
  banner_principal_url = VALUES(banner_principal_url),
  mensaje_bienvenida = VALUES(mensaje_bienvenida),
  horario_atencion = VALUES(horario_atencion),
  redes_sociales = VALUES(redes_sociales),
  email_notificaciones = VALUES(email_notificaciones),
  telegram_bot_token = VALUES(telegram_bot_token),
  telegram_chat_id = VALUES(telegram_chat_id);

-- =================================
-- PÁGINAS STOREFRONT (CMS)
-- =================================
-- IMPORTANTE: El storefront tiene diseño FIJO. Solo existen estas páginas reales:
--   - HomePage (/) - Consume secciones JSON configurables
--   - AboutPage (/sobre-nosotros) - Consume home-seccion-about
--   - ContactPage (/contactanos) - Consume home-seccion-contact
--   - ProductsPage, CategoryPage, CustomOrderPage, etc. (funcionales, no CMS)
--
-- NO existen páginas institucionales como FAQ, Términos, Privacidad, Galería, etc.
-- Este CMS solo gestiona las 4 secciones JSON de HomePage que SÍ existen.

INSERT INTO paginas_storefront (tienda_id, slug, titulo, contenido, meta_descripcion, tipo_contenido, orden_menu, visible_en_menu, activa)
VALUES
  -- Sección 1: Productos Destacados (aparece en HomePage)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'home-seccion-destacados',
    'Los Favoritos del Barrio',
    '{"subtitulo": "Estos son los postres que todos están pidiendo. ¡No te quedes sin probarlos!"}',
    NULL,
    'JSON',
    0,
    FALSE,
    TRUE
  ),
  -- Sección 2: Tortas Personalizadas (aparece en HomePage)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'home-seccion-personalizada',
    '¿Tienes una idea única?',
    '{"titulo_destacado": "¡La hacemos realidad!", "descripcion": "Sube una foto de referencia, elige tus sabores favoritos y nosotros nos encargamos del resto. Perfecto para cumpleaños y eventos especiales.", "texto_boton": "Cotizar Ahora", "enlace_boton": "/custom-order", "imagen_1": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=500", "imagen_2": "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&q=80&w=500"}',
    NULL,
    'JSON',
    0,
    FALSE,
    TRUE
  ),
  -- Sección 3: About/Historia (consumida por AboutPage y HomePage)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'home-seccion-about',
    'Nuestra Historia',
    '{"descripcion": "Dulce Manjar nació en 2010 con un sueño: llevar los mejores sabores de la repostería peruana a cada hogar limeño.", "valores": ["Calidad en cada bocado", "Ingredientes seleccionados", "Recetas tradicionales", "Atención personalizada"]}',
    NULL,
    'JSON',
    0,
    FALSE,
    TRUE
  ),
  -- Sección 4: Contacto (consumida por ContactPage)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'home-seccion-contact',
    'Visítanos',
    '{"direccion": "Av. Larco 789, Miraflores", "telefono": "+51 987 654 321", "email": "pedidos@dulcemanjar.pe"}',
    NULL,
    'JSON',
    0,
    FALSE,
    TRUE
  )
ON DUPLICATE KEY UPDATE
  titulo = VALUES(titulo),
  contenido = VALUES(contenido),
  meta_descripcion = VALUES(meta_descripcion),
  tipo_contenido = VALUES(tipo_contenido),
  orden_menu = VALUES(orden_menu),
  visible_en_menu = VALUES(visible_en_menu),
  activa = VALUES(activa);
