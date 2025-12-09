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
    'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
    'cake',
    TRUE,
    1
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Pasteles y Postres',
    'pasteles-postres',
    'Delicias individuales perfectas para compartir o disfrutar solo.',
    'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg',
    'cupcake',
    TRUE,
    2
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Panes Especiales',
    'panes-especiales',
    'Pan fresco horneado diariamente con ingredientes premium.',
    'https://images.pexels.com/photos/1871024/pexels-photo-1871024.jpeg',
    'bread-slice',
    TRUE,
    3
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Bebidas',
    'bebidas',
    'Café, jugos naturales y bebidas calientes para acompañar tus dulces.',
    'https://images.pexels.com/photos/1710023/pexels-photo-1710023.jpeg',
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
    'https://images.pexels.com/photos/1871024/pexels-photo-1871024.jpeg',
    'bread-slice',
    TRUE,
    1
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Tortas Caseras',
    'tortas-caseras',
    'Tortas con el sabor tradicional de casa.',
    'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
    'cake',
    TRUE,
    2
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Bocaditos',
    'bocaditos',
    'Pequeños placeres para cualquier momento del día.',
    'https://images.pexels.com/photos/298217/pexels-photo-298217.jpeg',
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
    'https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg',
    'cake',
    TRUE,
    1
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Postres Gourmet',
    'postres-gourmet',
    'Postres de autor con presentación impecable.',
    'https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg',
    'ice-cream',
    TRUE,
    2
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Panadería Artesanal',
    'panaderia-artesanal',
    'Panes con masa madre y fermentación lenta.',
    'https://images.pexels.com/photos/1871024/pexels-photo-1871024.jpeg',
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
    'https://plazavea.vteximg.com.br/arquivos/ids/518741-1000-1000/20196885.jpg',
    JSON_ARRAY(
      'https://gourmet.iprospect.cl/wp-content/uploads/2016/09/Torta-3-leches.jpg',
      'https://images.pexels.com/photos/32590852/pexels-photo-32590852.jpeg'
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
    'https://res.cloudinary.com/riqra/image/upload/v1752091349/sellers/tortas-gaby/products/o9x40s694cz3gm1l32vj.png',
    JSON_ARRAY(
      'https://www.recetasnestle.cl/sites/default/files/srh_recipes/797bcc63bf54837e035b42a9936598d2.jpg'
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
    'https://es.cravingsjournal.com/wp-content/uploads/2018/07/suspiro-de-limen%CC%83a-1.jpg',
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
    'https://media.ambito.com/p/268818fc874fb8b067c66b9f025e7fab/adjuntos/239/imagenes/041/041/0041041868/730x0/smart/alfajores-morgana-3jpg.jpg',
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
    'https://elikaeskola.com/wp-content/uploads/1.jpg',
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
    'https://excelso77.com/wp-content/uploads/2024/05/por-que-el-cafe-americano-se-llama-asi-te-lo-contamos.webp',
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
    'https://img-global.cpcdn.com/recipes/403023df5ce8e8ea/680x781f0.5_0.50125_1.0q80/pan-frances-peruano-foto-principal.jpg',
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
    'https://silvanapastrychef.wordpress.com/wp-content/uploads/2021/03/unnamed-4.jpg',
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
    'https://cdn0.recetasgratis.net/es/posts/2/5/2/torta_de_chocolate_casera_45252_orig.jpg',
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
    'https://cdn0.recetasgratis.net/es/posts/4/0/6/empanadas_de_pollo_peruanas_76604_orig.jpg',
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
    'https://www.infobae.com/new-resizer/DGoMOTuyK29Gwu_0GG0rzZg4VGk=/arc-anglerfish-arc2-prod-infobae/public/52E6H6YM2NHAHHAR6S7SL47SEM.jpg',
    JSON_ARRAY(
      'https://i0.wp.com/www.pasionthermomix.co/wp-content/uploads/2022/10/0001005216LosMejoresPostresDelMundoEp007RedVelvetCake3.jpg?fit=1600%2C900&ssl=1',
      'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/e5f2ceaf-5530-46e8-908e-ea9586a03bf9/Derivates/e7f68f7a-23c5-4803-a26e-b9d23aa8802f.jpg',
      'https://i0.wp.com/sarasellos.com/wp-content/uploads/2025/01/mini-cake-red-velvet-4.jpg?resize=683%2C1024&ssl=1'
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
    'https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/45fae8a0529af6bde82db0195a3fec0b.jpg',
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
    'https://lamorapasteleria.com/cdn/shop/files/60_480x480.jpg?v=1717606177',
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
    'https://int.360cookware.com/cdn/shop/articles/20230605140332-20230104201122-sourdough-bread.webp?v=1690464286',
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
