-- ============================================================================
-- R__04: SEED AUXILIAR - TIENDA DE DEMOSTRACIÓN
-- ============================================================================
-- Este archivo crea una tienda completa con sedes, usuarios, productos
-- y categorías para fines de desarrollo y pruebas.
-- Al ser repeteable (R__), se ejecuta cada vez que cambia.
-- Usa INSERT...ON DUPLICATE KEY UPDATE para ser idempotente.
-- ============================================================================

-- =================================
-- PLAN DE SUSCRIPCIÓN
-- =================================

INSERT INTO planes (
    codigo,
    nombre,
    descripcion,
    precio_mensual_centimos,
    precio_anual_centimos,
    moneda,
    limites,
    activo,
    creado_en
)
VALUES (
    'DEMO_GRATIS',
    'Plan Demo Gratis',
    'Plan completo para demostración con todas las características habilitadas',
    0, -- Gratis
    0, -- Gratis
    'PEN',
    JSON_OBJECT(
        'max_usuarios', 999,
        'max_sedes', 999,
        'max_productos', 999,
        'max_transacciones_mes', 999999
    ),
    TRUE,
    CURRENT_TIMESTAMP
)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    limites = VALUES(limites),
    activo = VALUES(activo);

-- =================================
-- TIENDA DEMO
-- =================================

INSERT INTO tiendas (
    slug,
    tipo_doc,
    numero_doc,
    nombre_doc,
    nombre_comercial,
    correo_contacto,
    telefono_contacto,
    hash_contrasena,
    estado,
    creado_en
)
VALUES (
    'demo-panaderia',
    'RUC',
    '10000000001', -- RUC claramente inválido para demo
    'PANADERIA Y PASTELERIA DEMO S.A.C.',
    'Panadería Demo',
    'demo.tienda@example.local',
    '987654321',
    '$2a$12$Oq8FdZHwWJNEi0LleTdJNeKr/yFTTD42IzFoOIfkrvPN1Sq/ICxlm', -- contraseña: clave123
    'ACTIVA',
    CURRENT_TIMESTAMP
)
ON DUPLICATE KEY UPDATE
    nombre_doc = VALUES(nombre_doc),
    nombre_comercial = VALUES(nombre_comercial),
    correo_contacto = VALUES(correo_contacto),
    telefono_contacto = VALUES(telefono_contacto),
    estado = VALUES(estado);

-- Obtener IDs creados
SET @demo_tienda_id = (SELECT id FROM tiendas WHERE slug = 'demo-panaderia' LIMIT 1);
SET @demo_plan_id = (SELECT id FROM planes WHERE codigo = 'DEMO_GRATIS' LIMIT 1);

-- =================================
-- SUSCRIPCIÓN DE LA TIENDA
-- =================================

INSERT INTO suscripciones (
    tienda_id,
    plan_id,
    ciclo,
    precio_pactado_centimos,
    fecha_inicio,
    fecha_fin,
    estado,
    autorenovar,
    creado_en
)
SELECT
    @demo_tienda_id,
    @demo_plan_id,
    'ANUAL',
    0,
    CURRENT_TIMESTAMP,
    DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 YEAR),
    'ACTIVA',
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM suscripciones 
    WHERE tienda_id = @demo_tienda_id 
    AND plan_id = @demo_plan_id
);

-- Obtener ID de suscripción
SET @demo_suscripcion_id = (SELECT id FROM suscripciones WHERE tienda_id = @demo_tienda_id AND plan_id = @demo_plan_id LIMIT 1);

-- Registrar historial de alta de suscripción (solo si no existe)
INSERT INTO historial_suscripciones (
    suscripcion_id,
    plan_anterior_id,
    plan_nuevo_id,
    tipo_movimiento,
    precio_anterior_centimos,
    precio_nuevo_centimos,
    fecha_movimiento
)
SELECT
    @demo_suscripcion_id,
    NULL,
    @demo_plan_id,
    'ALTA',
    NULL,
    0,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM historial_suscripciones 
    WHERE suscripcion_id = @demo_suscripcion_id 
    AND tipo_movimiento = 'ALTA'
);

-- =================================
-- SEDES
-- =================================

-- Sede Principal
INSERT INTO sedes (
    tienda_id,
    codigo_interno,
    nombre,
    direccion,
    telefono,
    distrito_id,
    es_principal,
    activo,
    creado_en
)
SELECT
    @demo_tienda_id,
    'DEMO-PRINCIPAL',
    'Sede Principal Centro',
    'Av. Lima 123, Centro de Lima',
    '987654321',
    (SELECT id FROM ubigeo_distritos WHERE nombre = 'LIMA' LIMIT 1),
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM sedes 
    WHERE tienda_id = @demo_tienda_id 
    AND codigo_interno = 'DEMO-PRINCIPAL'
)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    direccion = VALUES(direccion),
    telefono = VALUES(telefono),
    es_principal = VALUES(es_principal),
    activo = VALUES(activo);

-- Sede Norte
INSERT INTO sedes (
    tienda_id,
    codigo_interno,
    nombre,
    direccion,
    telefono,
    distrito_id,
    es_principal,
    activo,
    creado_en
)
SELECT
    @demo_tienda_id,
    'DEMO-NORTE',
    'Sede Norte San Martin',
    'Av. Alfredo Mendiola 456, San Martin de Porres',
    '987654322',
    (SELECT id FROM ubigeo_distritos WHERE nombre = 'SAN MARTIN DE PORRES' LIMIT 1),
    FALSE,
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM sedes 
    WHERE tienda_id = @demo_tienda_id 
    AND codigo_interno = 'DEMO-NORTE'
)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    direccion = VALUES(direccion),
    telefono = VALUES(telefono),
    activo = VALUES(activo);

-- Obtener IDs de sedes
SET @demo_sede_principal_id = (SELECT id FROM sedes WHERE tienda_id = @demo_tienda_id AND codigo_interno = 'DEMO-PRINCIPAL' LIMIT 1);
SET @demo_sede_norte_id = (SELECT id FROM sedes WHERE tienda_id = @demo_tienda_id AND codigo_interno = 'DEMO-NORTE' LIMIT 1);

-- =================================
-- ROL ADMINISTRADOR
-- =================================

INSERT INTO roles (
    tienda_id,
    nombre,
    descripcion,
    es_sistema,
    creado_en
)
SELECT
    @demo_tienda_id,
    'Administrador',
    'Rol con todos los permisos del sistema',
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM roles 
    WHERE tienda_id = @demo_tienda_id 
    AND nombre = 'Administrador'
)
ON DUPLICATE KEY UPDATE
    descripcion = VALUES(descripcion);

-- Obtener ID del rol
SET @demo_rol_admin_id = (SELECT id FROM roles WHERE tienda_id = @demo_tienda_id AND nombre = 'Administrador' LIMIT 1);

-- Asignar todos los permisos al rol Administrador
INSERT IGNORE INTO roles_permisos (rol_id, permiso_id)
SELECT @demo_rol_admin_id, id FROM permisos;

-- =================================
-- USUARIO ADMINISTRADOR
-- =================================

INSERT INTO usuarios_tienda (
    tienda_id,
    rol_id,
    correo,
    hash_contrasena,
    tipo_doc,
    numero_doc,
    nombres_doc,
    telefono,
    activo,
    creado_en
)
SELECT
    @demo_tienda_id,
    @demo_rol_admin_id,
    'demo.admin@example.local',
    '$2a$12$Oq8FdZHwWJNEi0LleTdJNeKr/yFTTD42IzFoOIfkrvPN1Sq/ICxlm', -- contraseña: clave123
    'DNI',
    '00000001',
    'Administrador Demo',
    '987654321',
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios_tienda 
    WHERE tienda_id = @demo_tienda_id 
    AND correo = 'demo.admin@example.local'
)
ON DUPLICATE KEY UPDATE
    nombres_doc = VALUES(nombres_doc),
    telefono = VALUES(telefono),
    activo = VALUES(activo);

-- Obtener ID del usuario
SET @demo_usuario_id = (SELECT id FROM usuarios_tienda WHERE tienda_id = @demo_tienda_id AND correo = 'demo.admin@example.local' LIMIT 1);

-- Asignar sedes al usuario
INSERT INTO usuario_sedes (usuario_id, sede_id, es_sede_principal)
VALUES
    (@demo_usuario_id, @demo_sede_principal_id, TRUE),
    (@demo_usuario_id, @demo_sede_norte_id, FALSE)
ON DUPLICATE KEY UPDATE
    es_sede_principal = VALUES(es_sede_principal);

-- =================================
-- CONFIGURACIÓN DE LA TIENDA
-- =================================

INSERT INTO configuracion_tienda (
    tienda_id,
    ruc,
    razon_social,
    direccion_fiscal,
    ubigeo_fiscal,
    modo_sunat,
    tasa_igv,
    slogan_parte1,
    slogan_parte2,
    mensaje_bienvenida,
    horario_atencion,
    redes_sociales,
    politicas_envio,
    politicas_devolucion,
    email_notificaciones,
    actualizado_en
)
VALUES (
    @demo_tienda_id,
    '10000000001',
    'PANADERIA Y PASTELERIA DEMO S.A.C.',
    'Av. Lima 123, Centro de Lima',
    (SELECT codigo_ubigeo FROM ubigeo_distritos WHERE nombre = 'LIMA' LIMIT 1),
    'PRUEBAS',
    18.00,
    'El sabor de siempre',
    'Con calidad garantizada',
    '¡Bienvenidos a Panadería Demo! Ofrecemos los mejores productos artesanales de la ciudad.',
    JSON_OBJECT(
        'lunes', 'Cerrado',
        'martes', '6:00 AM - 8:00 PM',
        'miercoles', '6:00 AM - 8:00 PM',
        'jueves', '6:00 AM - 8:00 PM',
        'viernes', '6:00 AM - 9:00 PM',
        'sabado', '7:00 AM - 9:00 PM',
        'domingo', '7:00 AM - 2:00 PM'
    ),
    JSON_OBJECT(
        'facebook', 'https://facebook.com/panaderiademo',
        'instagram', 'https://instagram.com/panaderiademo',
        'whatsapp', '+51987654321'
    ),
    'Realizamos envíos a domicilio en Lima Metropolitana. Tiempo estimado: 24-48 horas. Envío gratuito en compras mayores a S/. 50.00',
    'Aceptamos devoluciones dentro de las primeras 24 horas si el producto presenta algún defecto de fabricación.',
    'demo.tienda@example.local',
    CURRENT_TIMESTAMP
)
ON DUPLICATE KEY UPDATE
    razon_social = VALUES(razon_social),
    direccion_fiscal = VALUES(direccion_fiscal),
    modo_sunat = VALUES(modo_sunat),
    slogan_parte1 = VALUES(slogan_parte1),
    slogan_parte2 = VALUES(slogan_parte2),
    mensaje_bienvenida = VALUES(mensaje_bienvenida),
    horario_atencion = VALUES(horario_atencion),
    redes_sociales = VALUES(redes_sociales),
    email_notificaciones = VALUES(email_notificaciones);

-- =================================
-- CATEGORÍAS
-- =================================

-- Categoría Panes
INSERT INTO categorias (
    tienda_id,
    nombre,
    slug,
    descripcion,
    url_imagen,
    icono,
    activa,
    orden_visual,
    creado_en
)
SELECT
    @demo_tienda_id,
    'Panes',
    'panes',
    'Variedad de panes artesanales y tradicionales',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    'bread',
    TRUE,
    1,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM categorias 
    WHERE tienda_id = @demo_tienda_id 
    AND slug = 'panes'
)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    url_imagen = VALUES(url_imagen),
    activa = VALUES(activa),
    orden_visual = VALUES(orden_visual);

-- Categoría Pasteles
INSERT INTO categorias (
    tienda_id,
    nombre,
    slug,
    descripcion,
    url_imagen,
    icono,
    activa,
    orden_visual,
    creado_en
)
SELECT
    @demo_tienda_id,
    'Pasteles',
    'pasteles',
    'Pasteles y tortas para toda ocasión',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    'cake',
    TRUE,
    2,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM categorias 
    WHERE tienda_id = @demo_tienda_id 
    AND slug = 'pasteles'
)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    url_imagen = VALUES(url_imagen),
    activa = VALUES(activa),
    orden_visual = VALUES(orden_visual);

-- Obtener IDs de categorías
SET @demo_cat_panes_id = (SELECT id FROM categorias WHERE tienda_id = @demo_tienda_id AND slug = 'panes' LIMIT 1);
SET @demo_cat_pasteles_id = (SELECT id FROM categorias WHERE tienda_id = @demo_tienda_id AND slug = 'pasteles' LIMIT 1);

-- =================================
-- PRODUCTOS
-- =================================

-- Pan Francés
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
    url_imagen_principal,
    imagenes_galeria,
    visible_en_pos,
    visible_en_storefront,
    destacado_storefront,
    activo,
    creado_en
)
SELECT
    @demo_tienda_id,
    @demo_cat_panes_id,
    'Pan Francés',
    'pan-frances',
    'DEMO-PAN-001',
    'Pan francés tradicional, crujiente por fuera y suave por dentro',
    'PRODUCTO_TERMINADO',
    FALSE,
    50,
    NULL,
    'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80',
    JSON_ARRAY(
        'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80',
        'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&q=80'
    ),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM productos 
    WHERE tienda_id = @demo_tienda_id 
    AND sku = 'DEMO-PAN-001'
)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    precio_base_centimos = VALUES(precio_base_centimos),
    precio_oferta_centimos = VALUES(precio_oferta_centimos),
    url_imagen_principal = VALUES(url_imagen_principal),
    imagenes_galeria = VALUES(imagenes_galeria),
    visible_en_pos = VALUES(visible_en_pos),
    visible_en_storefront = VALUES(visible_en_storefront),
    destacado_storefront = VALUES(destacado_storefront),
    activo = VALUES(activo);

-- Pan Ciabatta
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
    url_imagen_principal,
    imagenes_galeria,
    visible_en_pos,
    visible_en_storefront,
    destacado_storefront,
    activo,
    creado_en
)
SELECT
    @demo_tienda_id,
    @demo_cat_panes_id,
    'Pan Ciabatta',
    'pan-ciabatta',
    'DEMO-PAN-002',
    'Pan italiano con corteza crujiente y miga esponjosa',
    'PRODUCTO_TERMINADO',
    FALSE,
    800,
    NULL,
    'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&q=80',
    JSON_ARRAY(
        'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&q=80',
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80'
    ),
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM productos 
    WHERE tienda_id = @demo_tienda_id 
    AND sku = 'DEMO-PAN-002'
)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    precio_base_centimos = VALUES(precio_base_centimos),
    url_imagen_principal = VALUES(url_imagen_principal),
    imagenes_galeria = VALUES(imagenes_galeria),
    activo = VALUES(activo);

-- Torta de Chocolate
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
    url_imagen_principal,
    imagenes_galeria,
    visible_en_pos,
    visible_en_storefront,
    destacado_storefront,
    activo,
    creado_en
)
SELECT
    @demo_tienda_id,
    @demo_cat_pasteles_id,
    'Torta de Chocolate',
    'torta-chocolate',
    'DEMO-PAST-001',
    'Deliciosa torta de chocolate con cobertura de ganache',
    'PRODUCTO_TERMINADO',
    TRUE,
    4500,
    4000,
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    JSON_ARRAY(
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
        'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80'
    ),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM productos 
    WHERE tienda_id = @demo_tienda_id 
    AND sku = 'DEMO-PAST-001'
)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    precio_base_centimos = VALUES(precio_base_centimos),
    precio_oferta_centimos = VALUES(precio_oferta_centimos),
    url_imagen_principal = VALUES(url_imagen_principal),
    imagenes_galeria = VALUES(imagenes_galeria),
    activo = VALUES(activo);

-- Pie de Limón
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
    url_imagen_principal,
    imagenes_galeria,
    visible_en_pos,
    visible_en_storefront,
    destacado_storefront,
    activo,
    creado_en
)
SELECT
    @demo_tienda_id,
    @demo_cat_pasteles_id,
    'Pie de Limón',
    'pie-limon',
    'DEMO-PAST-002',
    'Refrescante pie de limón con merengue italiano',
    'PRODUCTO_TERMINADO',
    FALSE,
    3200,
    NULL,
    'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80',
    JSON_ARRAY(
        'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&q=80',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80'
    ),
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM productos 
    WHERE tienda_id = @demo_tienda_id 
    AND sku = 'DEMO-PAST-002'
)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    precio_base_centimos = VALUES(precio_base_centimos),
    url_imagen_principal = VALUES(url_imagen_principal),
    imagenes_galeria = VALUES(imagenes_galeria),
    activo = VALUES(activo);

-- Obtener IDs de productos
SET @demo_prod_pan_frances_id = (SELECT id FROM productos WHERE tienda_id = @demo_tienda_id AND sku = 'DEMO-PAN-001' LIMIT 1);
SET @demo_prod_ciabatta_id = (SELECT id FROM productos WHERE tienda_id = @demo_tienda_id AND sku = 'DEMO-PAN-002' LIMIT 1);
SET @demo_prod_torta_id = (SELECT id FROM productos WHERE tienda_id = @demo_tienda_id AND sku = 'DEMO-PAST-001' LIMIT 1);
SET @demo_prod_pie_id = (SELECT id FROM productos WHERE tienda_id = @demo_tienda_id AND sku = 'DEMO-PAST-002' LIMIT 1);

-- =================================
-- INVENTARIO INICIAL DE PRODUCTOS
-- =================================

-- Inventario Sede Principal
INSERT INTO inventario_productos (tienda_id, sede_id, producto_id, cantidad_actual)
VALUES
    (@demo_tienda_id, @demo_sede_principal_id, @demo_prod_pan_frances_id, 100),
    (@demo_tienda_id, @demo_sede_principal_id, @demo_prod_ciabatta_id, 20),
    (@demo_tienda_id, @demo_sede_principal_id, @demo_prod_torta_id, 5),
    (@demo_tienda_id, @demo_sede_principal_id, @demo_prod_pie_id, 8)
ON DUPLICATE KEY UPDATE
    cantidad_actual = VALUES(cantidad_actual);

-- Inventario Sede Norte
INSERT INTO inventario_productos (tienda_id, sede_id, producto_id, cantidad_actual)
VALUES
    (@demo_tienda_id, @demo_sede_norte_id, @demo_prod_pan_frances_id, 80),
    (@demo_tienda_id, @demo_sede_norte_id, @demo_prod_ciabatta_id, 15),
    (@demo_tienda_id, @demo_sede_norte_id, @demo_prod_torta_id, 3),
    (@demo_tienda_id, @demo_sede_norte_id, @demo_prod_pie_id, 6)
ON DUPLICATE KEY UPDATE
    cantidad_actual = VALUES(cantidad_actual);

-- =================================
-- MOVIMIENTOS DE INVENTARIO INICIAL
-- =================================
-- NOTA: Los movimientos se crean solo una vez usando WHERE NOT EXISTS
-- para evitar duplicados en ejecuciones repetibles.

-- Movimientos Sede Principal
INSERT INTO movimientos_inventario_productos (
    tienda_id,
    sede_id,
    producto_id,
    tipo_movimiento,
    cantidad,
    cantidad_anterior,
    cantidad_posterior,
    motivo,
    responsable_id,
    creado_en
)
SELECT
    @demo_tienda_id,
    @demo_sede_principal_id,
    @demo_prod_pan_frances_id,
    'ENTRADA',
    100,
    0,
    100,
    'AJUSTE',
    @demo_usuario_id,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM movimientos_inventario_productos
    WHERE tienda_id = @demo_tienda_id
    AND sede_id = @demo_sede_principal_id
    AND producto_id = @demo_prod_pan_frances_id
    AND tipo_movimiento = 'ENTRADA'
    AND motivo = 'AJUSTE'
    AND cantidad = 100
);

INSERT INTO movimientos_inventario_productos (
    tienda_id, sede_id, producto_id, tipo_movimiento, cantidad,
    cantidad_anterior, cantidad_posterior, motivo, responsable_id, creado_en
)
SELECT @demo_tienda_id, @demo_sede_principal_id, @demo_prod_ciabatta_id, 'ENTRADA', 20, 0, 20, 'AJUSTE', @demo_usuario_id, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM movimientos_inventario_productos
    WHERE tienda_id = @demo_tienda_id AND sede_id = @demo_sede_principal_id
    AND producto_id = @demo_prod_ciabatta_id AND tipo_movimiento = 'ENTRADA'
    AND motivo = 'AJUSTE' AND cantidad = 20
);

INSERT INTO movimientos_inventario_productos (
    tienda_id, sede_id, producto_id, tipo_movimiento, cantidad,
    cantidad_anterior, cantidad_posterior, motivo, responsable_id, creado_en
)
SELECT @demo_tienda_id, @demo_sede_principal_id, @demo_prod_torta_id, 'ENTRADA', 5, 0, 5, 'AJUSTE', @demo_usuario_id, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM movimientos_inventario_productos
    WHERE tienda_id = @demo_tienda_id AND sede_id = @demo_sede_principal_id
    AND producto_id = @demo_prod_torta_id AND tipo_movimiento = 'ENTRADA'
    AND motivo = 'AJUSTE' AND cantidad = 5
);

INSERT INTO movimientos_inventario_productos (
    tienda_id, sede_id, producto_id, tipo_movimiento, cantidad,
    cantidad_anterior, cantidad_posterior, motivo, responsable_id, creado_en
)
SELECT @demo_tienda_id, @demo_sede_principal_id, @demo_prod_pie_id, 'ENTRADA', 8, 0, 8, 'AJUSTE', @demo_usuario_id, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM movimientos_inventario_productos
    WHERE tienda_id = @demo_tienda_id AND sede_id = @demo_sede_principal_id
    AND producto_id = @demo_prod_pie_id AND tipo_movimiento = 'ENTRADA'
    AND motivo = 'AJUSTE' AND cantidad = 8
);

-- Movimientos Sede Norte
INSERT INTO movimientos_inventario_productos (
    tienda_id, sede_id, producto_id, tipo_movimiento, cantidad,
    cantidad_anterior, cantidad_posterior, motivo, responsable_id, creado_en
)
SELECT @demo_tienda_id, @demo_sede_norte_id, @demo_prod_pan_frances_id, 'ENTRADA', 80, 0, 80, 'AJUSTE', @demo_usuario_id, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM movimientos_inventario_productos
    WHERE tienda_id = @demo_tienda_id AND sede_id = @demo_sede_norte_id
    AND producto_id = @demo_prod_pan_frances_id AND tipo_movimiento = 'ENTRADA'
    AND motivo = 'AJUSTE' AND cantidad = 80
);

INSERT INTO movimientos_inventario_productos (
    tienda_id, sede_id, producto_id, tipo_movimiento, cantidad,
    cantidad_anterior, cantidad_posterior, motivo, responsable_id, creado_en
)
SELECT @demo_tienda_id, @demo_sede_norte_id, @demo_prod_ciabatta_id, 'ENTRADA', 15, 0, 15, 'AJUSTE', @demo_usuario_id, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM movimientos_inventario_productos
    WHERE tienda_id = @demo_tienda_id AND sede_id = @demo_sede_norte_id
    AND producto_id = @demo_prod_ciabatta_id AND tipo_movimiento = 'ENTRADA'
    AND motivo = 'AJUSTE' AND cantidad = 15
);

INSERT INTO movimientos_inventario_productos (
    tienda_id, sede_id, producto_id, tipo_movimiento, cantidad,
    cantidad_anterior, cantidad_posterior, motivo, responsable_id, creado_en
)
SELECT @demo_tienda_id, @demo_sede_norte_id, @demo_prod_torta_id, 'ENTRADA', 3, 0, 3, 'AJUSTE', @demo_usuario_id, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM movimientos_inventario_productos
    WHERE tienda_id = @demo_tienda_id AND sede_id = @demo_sede_norte_id
    AND producto_id = @demo_prod_torta_id AND tipo_movimiento = 'ENTRADA'
    AND motivo = 'AJUSTE' AND cantidad = 3
);

INSERT INTO movimientos_inventario_productos (
    tienda_id, sede_id, producto_id, tipo_movimiento, cantidad,
    cantidad_anterior, cantidad_posterior, motivo, responsable_id, creado_en
)
SELECT @demo_tienda_id, @demo_sede_norte_id, @demo_prod_pie_id, 'ENTRADA', 6, 0, 6, 'AJUSTE', @demo_usuario_id, CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM movimientos_inventario_productos
    WHERE tienda_id = @demo_tienda_id AND sede_id = @demo_sede_norte_id
    AND producto_id = @demo_prod_pie_id AND tipo_movimiento = 'ENTRADA'
    AND motivo = 'AJUSTE' AND cantidad = 6
);

-- =========================================
-- CLIENTE GENÉRICO (para todas las tiendas)
-- =========================================
-- Cliente genérico para ventas rápidas sin documento
INSERT IGNORE INTO clientes (tienda_id, tipo_doc, numero_doc, nombre_doc, email, telefono, es_usuario_virtual, hash_contrasena, notas, activo)
SELECT 
    t.id as tienda_id,
    NULL as tipo_doc,
    '00000000' as numero_doc,
    'CLIENTE GENÉRICO' as nombre_doc,
    NULL as email,
    NULL as telefono,
    FALSE as es_usuario_virtual,
    NULL as hash_contrasena,
    'Cliente genérico para ventas sin identificación. Creado automáticamente por el sistema.' as notas,
    TRUE as activo
FROM tiendas t
WHERE NOT EXISTS (
    SELECT 1 FROM clientes c 
    WHERE c.tienda_id = t.id 
    AND c.numero_doc = '00000000'
);
