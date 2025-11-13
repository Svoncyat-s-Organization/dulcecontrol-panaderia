-- ============================================================================
-- R__08: SEED MÓDULO DE CATÁLOGO (CATEGORÍAS Y PRODUCTOS)
-- ============================================================================

-- =================================
-- CATEGORÍAS
-- =================================

INSERT INTO categorias (
  tienda_id,
  nombre,
  slug,
  descripcion,
  url_imagen,
  icono,
  activa,
  orden_visual
)
VALUES
  -- Categorías Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Tortas',
    'tortas',
    'Tortas artesanales para toda ocasión. Personalizables con tu dedicatoria especial.',
    'https://cdn.dulcemanjar.pe/categorias/tortas.jpg',
    'cake',
    TRUE,
    1
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Pasteles y Postres',
    'pasteles-postres',
    'Delicias individuales perfectas para compartir o disfrutar solo.',
    'https://cdn.dulcemanjar.pe/categorias/pasteles.jpg',
    'cupcake',
    TRUE,
    2
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Panes Especiales',
    'panes-especiales',
    'Pan fresco horneado diariamente con ingredientes premium.',
    'https://cdn.dulcemanjar.pe/categorias/panes.jpg',
    'bread-slice',
    TRUE,
    3
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Bebidas',
    'bebidas',
    'Café, jugos naturales y bebidas calientes para acompañar tus dulces.',
    'https://cdn.dulcemanjar.pe/categorias/bebidas.jpg',
    'coffee',
    TRUE,
    4
  ),
  
  -- Categorías Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Panes del Día',
    'panes-del-dia',
    'Pan fresco todos los días. ¡Calentito como el sol!',
    'https://cdn.panaderia-elsol.pe/categorias/panes.jpg',
    'bread-slice',
    TRUE,
    1
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Tortas Caseras',
    'tortas-caseras',
    'Tortas con el sabor tradicional de casa.',
    'https://cdn.panaderia-elsol.pe/categorias/tortas.jpg',
    'cake',
    TRUE,
    2
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Bocaditos',
    'bocaditos',
    'Pequeños placeres para cualquier momento del día.',
    'https://cdn.panaderia-elsol.pe/categorias/bocaditos.jpg',
    'cookie',
    TRUE,
    3
  ),
  
  -- Categorías Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Tortas Premium',
    'tortas-premium',
    'Creaciones exclusivas con ingredientes importados de primera calidad.',
    'https://cdn.tortasydelicias.pe/categorias/tortas-premium.jpg',
    'cake',
    TRUE,
    1
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Postres Gourmet',
    'postres-gourmet',
    'Postres de autor con presentación impecable.',
    'https://cdn.tortasydelicias.pe/categorias/postres.jpg',
    'ice-cream',
    TRUE,
    2
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Panadería Artesanal',
    'panaderia-artesanal',
    'Panes con masa madre y fermentación lenta.',
    'https://cdn.tortasydelicias.pe/categorias/panaderia.jpg',
    'bread-slice',
    TRUE,
    3
  )
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  descripcion = VALUES(descripcion),
  url_imagen = VALUES(url_imagen),
  icono = VALUES(icono),
  activa = VALUES(activa),
  orden_visual = VALUES(orden_visual);

-- =================================
-- PRODUCTOS
-- =================================

INSERT INTO productos (
  tienda_id,
  categoria_id,
  nombre,
  slug,
  sku,
  descripcion,
  tipo,
  es_personalizable,
  precio_base_centimos,
  precio_oferta_centimos,
  visible_en_pos,
  visible_en_storefront,
  destacado_storefront,
  url_imagen_principal,
  imagenes_galeria,
  atributos,
  activo
)
VALUES
  -- Productos Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND slug = 'tortas' LIMIT 1),
    'Torta Tres Leches Clásica',
    'torta-tres-leches-clasica',
    'DM-TORTA-001',
    'Deliciosa torta tres leches con merengue italiano. Tamaño mediano (8-10 porciones). Se puede personalizar con dedicatoria.',
    'producto_terminado',
    TRUE,
    6500,
    NULL,
    TRUE,
    TRUE,
    TRUE,
    'https://cdn.dulcemanjar.pe/productos/tres-leches.jpg',
    JSON_ARRAY(
      'https://cdn.dulcemanjar.pe/productos/tres-leches-1.jpg',
      'https://cdn.dulcemanjar.pe/productos/tres-leches-2.jpg'
    ),
    JSON_OBJECT(
      'porciones', '8-10',
      'peso_kg', 1.2,
      'tiempo_anticipacion', '24 horas',
      'alérgenos', JSON_ARRAY('leche', 'huevo', 'gluten')
    ),
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND slug = 'tortas' LIMIT 1),
    'Torta Selva Negra',
    'torta-selva-negra',
    'DM-TORTA-002',
    'Bizcocho de chocolate con cerezas y crema chantilly. Tamaño grande (12-15 porciones).',
    'producto_terminado',
    TRUE,
    8500,
    NULL,
    TRUE,
    TRUE,
    TRUE,
    'https://cdn.dulcemanjar.pe/productos/selva-negra.jpg',
    JSON_ARRAY(
      'https://cdn.dulcemanjar.pe/productos/selva-negra-1.jpg'
    ),
    JSON_OBJECT(
      'porciones', '12-15',
      'peso_kg', 1.8,
      'tiempo_anticipacion', '48 horas',
      'alérgenos', JSON_ARRAY('leche', 'huevo', 'gluten')
    ),
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND slug = 'pasteles-postres' LIMIT 1),
    'Suspiro Limeño',
    'suspiro-limeno',
    'DM-POST-001',
    'Postre tradicional peruano con manjar blanco y merengue. Porción individual.',
    'producto_terminado',
    FALSE,
    950,
    850,
    TRUE,
    TRUE,
    FALSE,
    'https://cdn.dulcemanjar.pe/productos/suspiro.jpg',
    JSON_ARRAY(),
    JSON_OBJECT(
      'porciones', '1',
      'alérgenos', JSON_ARRAY('leche', 'huevo')
    ),
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND slug = 'pasteles-postres' LIMIT 1),
    'Alfajor Triple Relleno',
    'alfajor-triple-relleno',
    'DM-POST-002',
    'Alfajor artesanal con tres capas de manjar blanco, bañado en chocolate.',
    'producto_terminado',
    FALSE,
    650,
    NULL,
    TRUE,
    TRUE,
    TRUE,
    'https://cdn.dulcemanjar.pe/productos/alfajor.jpg',
    JSON_ARRAY(),
    JSON_OBJECT(
      'porciones', '1',
      'alérgenos', JSON_ARRAY('leche', 'gluten', 'frutos_secos')
    ),
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND slug = 'panes-especiales' LIMIT 1),
    'Pan Integral con Semillas',
    'pan-integral-semillas',
    'DM-PAN-001',
    'Pan integral con chía, linaza y ajonjolí. Ideal para una alimentación saludable.',
    'producto_terminado',
    FALSE,
    850,
    NULL,
    TRUE,
    TRUE,
    FALSE,
    'https://cdn.dulcemanjar.pe/productos/pan-integral.jpg',
    JSON_ARRAY(),
    JSON_OBJECT(
      'peso_kg', 0.5,
      'alérgenos', JSON_ARRAY('gluten', 'semillas')
    ),
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND slug = 'bebidas' LIMIT 1),
    'Café Americano',
    'cafe-americano',
    'DM-BEB-001',
    'Café 100% peruano, tueste medio. Tamaño regular.',
    'producto_terminado',
    FALSE,
    550,
    NULL,
    TRUE,
    FALSE,
    FALSE,
    'https://cdn.dulcemanjar.pe/productos/cafe.jpg',
    JSON_ARRAY(),
    JSON_OBJECT(
      'tamaño_ml', 250
    ),
    TRUE
  ),

  -- Productos Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND slug = 'panes-del-dia' LIMIT 1),
    'Pan Francés Tradicional',
    'pan-frances-tradicional',
    'PS-PAN-001',
    'El clásico pan francés de todos los días. Crujiente por fuera, suave por dentro.',
    'producto_terminado',
    FALSE,
    35,
    NULL,
    TRUE,
    TRUE,
    TRUE,
    'https://cdn.panaderia-elsol.pe/productos/pan-frances.jpg',
    JSON_ARRAY(),
    JSON_OBJECT(
      'peso_kg', 0.05,
      'alérgenos', JSON_ARRAY('gluten')
    ),
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND slug = 'panes-del-dia' LIMIT 1),
    'Pan de Yema',
    'pan-de-yema',
    'PS-PAN-002',
    'Pan dulce suave y esponjoso, perfecto para el desayuno.',
    'producto_terminado',
    FALSE,
    150,
    NULL,
    TRUE,
    TRUE,
    FALSE,
    'https://cdn.panaderia-elsol.pe/productos/pan-yema.jpg',
    JSON_ARRAY(),
    JSON_OBJECT(
      'peso_kg', 0.08,
      'alérgenos', JSON_ARRAY('gluten', 'huevo', 'leche')
    ),
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND slug = 'tortas-caseras' LIMIT 1),
    'Torta de Chocolate Casera',
    'torta-chocolate-casera',
    'PS-TORTA-001',
    'Torta de chocolate con cobertura de chocolate. Tamaño familiar (10-12 porciones).',
    'producto_terminado',
    TRUE,
    4500,
    4000,
    TRUE,
    TRUE,
    TRUE,
    'https://cdn.panaderia-elsol.pe/productos/torta-chocolate.jpg',
    JSON_ARRAY(),
    JSON_OBJECT(
      'porciones', '10-12',
      'peso_kg', 1.5,
      'tiempo_anticipacion', '24 horas',
      'alérgenos', JSON_ARRAY('gluten', 'huevo', 'leche')
    ),
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND slug = 'bocaditos' LIMIT 1),
    'Empanada de Pollo',
    'empanada-pollo',
    'PS-BOC-001',
    'Empanada horneada rellena de pollo con especias.',
    'producto_terminado',
    FALSE,
    450,
    NULL,
    TRUE,
    TRUE,
    FALSE,
    'https://cdn.panaderia-elsol.pe/productos/empanada.jpg',
    JSON_ARRAY(),
    JSON_OBJECT(
      'peso_kg', 0.15,
      'alérgenos', JSON_ARRAY('gluten')
    ),
    TRUE
  ),

  -- Productos Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND slug = 'tortas-premium' LIMIT 1),
    'Torta Red Velvet Premium',
    'torta-red-velvet-premium',
    'TD-TORTA-001',
    'Torta red velvet con frosting de queso crema Philadelphia y decoración premium. Tamaño grande (15-20 porciones).',
    'producto_terminado',
    TRUE,
    12500,
    NULL,
    TRUE,
    TRUE,
    TRUE,
    'https://cdn.tortasydelicias.pe/productos/red-velvet.jpg',
    JSON_ARRAY(
      'https://cdn.tortasydelicias.pe/productos/red-velvet-1.jpg',
      'https://cdn.tortasydelicias.pe/productos/red-velvet-2.jpg',
      'https://cdn.tortasydelicias.pe/productos/red-velvet-3.jpg'
    ),
    JSON_OBJECT(
      'porciones', '15-20',
      'peso_kg', 2.5,
      'tiempo_anticipacion', '72 horas',
      'alérgenos', JSON_ARRAY('gluten', 'huevo', 'leche'),
      'ingredientes_premium', JSON_ARRAY('queso_crema_philadelphia', 'chocolate_belga', 'vainilla_madagascar')
    ),
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND slug = 'tortas-premium' LIMIT 1),
    'Torta Ópera',
    'torta-opera',
    'TD-TORTA-002',
    'Clásico francés con capas de bizcocho de almendras, ganache de chocolate y crema de café. Tamaño mediano (8-10 porciones).',
    'producto_terminado',
    FALSE,
    9500,
    NULL,
    TRUE,
    TRUE,
    TRUE,
    'https://cdn.tortasydelicias.pe/productos/opera.jpg',
    JSON_ARRAY(),
    JSON_OBJECT(
      'porciones', '8-10',
      'peso_kg', 1.2,
      'tiempo_anticipacion', '48 horas',
      'alérgenos', JSON_ARRAY('gluten', 'huevo', 'leche', 'frutos_secos'),
      'ingredientes_premium', JSON_ARRAY('chocolate_valrhona', 'almendras_marcona', 'cafe_arábica')
    ),
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND slug = 'postres-gourmet' LIMIT 1),
    'Macarons Surtidos (6 unidades)',
    'macarons-surtidos-6',
    'TD-POST-001',
    'Caja con 6 macarons artesanales de sabores variados: pistacho, frambuesa, chocolate, vainilla, limón y rosa.',
    'producto_terminado',
    FALSE,
    2800,
    NULL,
    TRUE,
    TRUE,
    TRUE,
    'https://cdn.tortasydelicias.pe/productos/macarons.jpg',
    JSON_ARRAY(),
    JSON_OBJECT(
      'unidades', 6,
      'alérgenos', JSON_ARRAY('almendras', 'huevo', 'leche')
    ),
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM categorias WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND slug = 'panaderia-artesanal' LIMIT 1),
    'Pan de Masa Madre Clásico',
    'pan-masa-madre-clasico',
    'TD-PAN-001',
    'Pan artesanal con masa madre de 30 horas de fermentación. Corteza crujiente y miga alveolada.',
    'producto_terminado',
    FALSE,
    1850,
    NULL,
    TRUE,
    TRUE,
    FALSE,
    'https://cdn.tortasydelicias.pe/productos/masa-madre.jpg',
    JSON_ARRAY(),
    JSON_OBJECT(
      'peso_kg', 0.8,
      'tiempo_fermentacion_horas', 30,
      'alérgenos', JSON_ARRAY('gluten')
    ),
    TRUE
  )
ON DUPLICATE KEY UPDATE
  categoria_id = VALUES(categoria_id),
  nombre = VALUES(nombre),
  descripcion = VALUES(descripcion),
  tipo = VALUES(tipo),
  es_personalizable = VALUES(es_personalizable),
  precio_base_centimos = VALUES(precio_base_centimos),
  precio_oferta_centimos = VALUES(precio_oferta_centimos),
  visible_en_pos = VALUES(visible_en_pos),
  visible_en_storefront = VALUES(visible_en_storefront),
  destacado_storefront = VALUES(destacado_storefront),
  url_imagen_principal = VALUES(url_imagen_principal),
  imagenes_galeria = VALUES(imagenes_galeria),
  atributos = VALUES(atributos),
  activo = VALUES(activo);
