-- ============================================================================
-- R_03: SEED AUXILIAR - TIENDA DE DEMOSTRACIÓN
-- ============================================================================
-- Este archivo crea una tienda completa con sedes, usuarios, productos
-- y categorías para fines de desarrollo y pruebas.
-- Al ser repeteable (R__), se ejecuta cada vez que cambia.
-- ============================================================================

-- =================================
-- PLAN DE SUSCRIPCIÓN
-- =================================

INSERT INTO planes (
    id,
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
    9991,
    'PLAN_DEMO',
    'Plan Demo',
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
    '2025-01-01 08:00:00'
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
    id,
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
    999,
    'panaderia-demo',
    'RUC',
    '20601234567',
    'PANADERIA Y PASTELERIA DEMO S.A.C.',
    'Panadería Demo',
    'contacto@panaderiademo.pe',
    '987654321',
    '$2a$12$Oq8FdZHwWJNEi0LleTdJNeKr/yFTTD42IzFoOIfkrvPN1Sq/ICxlm', -- contraseña: clave123
    'ACTIVA',
    '2025-01-01 08:00:00'
)
ON DUPLICATE KEY UPDATE
    nombre_doc = VALUES(nombre_doc),
    nombre_comercial = VALUES(nombre_comercial),
    correo_contacto = VALUES(correo_contacto),
    telefono_contacto = VALUES(telefono_contacto),
    estado = VALUES(estado);

-- =================================
-- SUSCRIPCIÓN DE LA TIENDA
-- =================================

INSERT INTO suscripciones (
    id,
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
VALUES (
    9991,
    999,
    9991,
    'ANUAL',
    0,
    '2025-01-01 08:00:00',
    '2026-01-01 08:00:00',
    'ACTIVA',
    TRUE,
    '2025-01-01 08:00:00'
)
ON DUPLICATE KEY UPDATE
    estado = VALUES(estado),
    fecha_fin = VALUES(fecha_fin),
    autorenovar = VALUES(autorenovar);

-- Registrar historial de alta de suscripción
INSERT INTO historial_suscripciones (
    id,
    suscripcion_id,
    plan_anterior_id,
    plan_nuevo_id,
    tipo_movimiento,
    precio_anterior_centimos,
    precio_nuevo_centimos,
    fecha_movimiento
)
VALUES (
    9991,
    9991,
    NULL,
    9991,
    'ALTA',
    NULL,
    0,
    '2025-01-01 08:00:00'
)
ON DUPLICATE KEY UPDATE
    tipo_movimiento = VALUES(tipo_movimiento);

-- =================================
-- SEDES
-- =================================

INSERT INTO sedes (
    id,
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
VALUES
    (
        9991,
        999,
        'SEDE-PRINCIPAL',
        'Sede Principal Centro',
        'Av. Lima 123, Centro de Lima',
        '987654321',
        (SELECT id FROM ubigeo_distritos WHERE nombre = 'LIMA' LIMIT 1),
        TRUE,
        TRUE,
        '2025-01-01 08:00:00'
    ),
    (
        9992,
        999,
        'SEDE-NORTE',
        'Sede Norte San Martin',
        'Av. Alfredo Mendiola 456, San Martin de Porres',
        '987654322',
        (SELECT id FROM ubigeo_distritos WHERE nombre = 'SAN MARTIN DE PORRES' LIMIT 1),
        FALSE,
        TRUE,
        '2025-01-01 09:00:00'
    )
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    direccion = VALUES(direccion),
    telefono = VALUES(telefono),
    es_principal = VALUES(es_principal),
    activo = VALUES(activo);

-- =================================
-- ROL ADMINISTRADOR
-- =================================

INSERT INTO roles (
    id,
    tienda_id,
    nombre,
    descripcion,
    es_sistema,
    creado_en
)
VALUES (
    9991,
    999,
    'Administrador',
    'Rol con todos los permisos del sistema',
    TRUE,
    '2025-01-01 08:00:00'
)
ON DUPLICATE KEY UPDATE
    descripcion = VALUES(descripcion);

-- Asignar todos los permisos al rol Administrador
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT 9991, id FROM permisos
ON DUPLICATE KEY UPDATE rol_id = VALUES(rol_id);

-- =================================
-- USUARIO ADMINISTRADOR
-- =================================

INSERT INTO usuarios_tienda (
    id,
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
VALUES (
    9991,
    999,
    9991,
    'admin@panaderiademo.pe',
    '$2a$12$Oq8FdZHwWJNEi0LleTdJNeKr/yFTTD42IzFoOIfkrvPN1Sq/ICxlm', -- contraseña: clave123
    'DNI',
    '12345678',
    'Administrador Demo',
    '987654321',
    TRUE,
    '2025-01-01 08:00:00'
)
ON DUPLICATE KEY UPDATE
    correo = VALUES(correo),
    nombres_doc = VALUES(nombres_doc),
    telefono = VALUES(telefono),
    activo = VALUES(activo);

-- Asignar sedes al usuario
INSERT INTO usuario_sedes (usuario_id, sede_id, es_sede_principal)
VALUES
    (9991, 9991, TRUE),
    (9991, 9992, FALSE)
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
    999,
    '20601234567',
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
    'contacto@panaderiademo.pe',
    '2025-01-01 08:00:00'
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

INSERT INTO categorias (
    id,
    tienda_id,
    nombre,
    slug,
    descripcion,
    icono,
    activa,
    orden_visual,
    creado_en
)
VALUES
    (
        9991,
        999,
        'Panes',
        'panes',
        'Variedad de panes artesanales y tradicionales',
        'bread',
        TRUE,
        1,
        '2025-01-01 08:00:00'
    ),
    (
        9992,
        999,
        'Pasteles',
        'pasteles',
        'Pasteles y tortas para toda ocasión',
        'cake',
        TRUE,
        2,
        '2025-01-01 08:00:00'
    )
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    activa = VALUES(activa),
    orden_visual = VALUES(orden_visual);

-- =================================
-- PRODUCTOS
-- =================================

INSERT INTO productos (
    id,
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
    activo,
    creado_en
)
VALUES
    (
        9991,
        999,
        9991,
        'Pan Francés',
        'pan-frances',
        'PROD-PAN-001',
        'Pan francés tradicional, crujiente por fuera y suave por dentro',
        'PRODUCTO_TERMINADO',
        FALSE,
        50, -- S/. 0.50
        NULL,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        '2025-01-01 08:00:00'
    ),
    (
        9992,
        999,
        9991,
        'Pan Ciabatta',
        'pan-ciabatta',
        'PROD-PAN-002',
        'Pan italiano con corteza crujiente y miga esponjosa',
        'PRODUCTO_TERMINADO',
        FALSE,
        800, -- S/. 8.00
        NULL,
        TRUE,
        TRUE,
        FALSE,
        TRUE,
        '2025-01-01 08:00:00'
    ),
    (
        9993,
        999,
        9992,
        'Torta de Chocolate',
        'torta-chocolate',
        'PROD-PAST-001',
        'Deliciosa torta de chocolate con cobertura de ganache',
        'PRODUCTO_TERMINADO',
        TRUE,
        4500, -- S/. 45.00
        4000, -- S/. 40.00 (oferta)
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        '2025-01-01 08:00:00'
    ),
    (
        9994,
        999,
        9992,
        'Pie de Limón',
        'pie-limon',
        'PROD-PAST-002',
        'Refrescante pie de limón con merengue italiano',
        'PRODUCTO_TERMINADO',
        FALSE,
        3200, -- S/. 32.00
        NULL,
        TRUE,
        TRUE,
        TRUE,
        TRUE,
        '2025-01-01 08:00:00'
    )
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    descripcion = VALUES(descripcion),
    precio_base_centimos = VALUES(precio_base_centimos),
    precio_oferta_centimos = VALUES(precio_oferta_centimos),
    visible_en_pos = VALUES(visible_en_pos),
    visible_en_storefront = VALUES(visible_en_storefront),
    destacado_storefront = VALUES(destacado_storefront),
    activo = VALUES(activo);

-- =================================
-- INVENTARIO INICIAL DE PRODUCTOS
-- =================================

-- Inventario Sede Principal
INSERT INTO inventario_productos (
    tienda_id,
    sede_id,
    producto_id,
    cantidad_actual
)
VALUES
    (999, 9991, 9991, 100), -- Pan Francés: 100 unidades
    (999, 9991, 9992, 20),  -- Pan Ciabatta: 20 unidades
    (999, 9991, 9993, 5),   -- Torta de Chocolate: 5 unidades
    (999, 9991, 9994, 8)    -- Pie de Limón: 8 unidades
ON DUPLICATE KEY UPDATE
    cantidad_actual = VALUES(cantidad_actual);

-- Inventario Sede Norte
INSERT INTO inventario_productos (
    tienda_id,
    sede_id,
    producto_id,
    cantidad_actual
)
VALUES
    (999, 9992, 9991, 80),  -- Pan Francés: 80 unidades
    (999, 9992, 9992, 15),  -- Pan Ciabatta: 15 unidades
    (999, 9992, 9993, 3),   -- Torta de Chocolate: 3 unidades
    (999, 9992, 9994, 6)    -- Pie de Limón: 6 unidades
ON DUPLICATE KEY UPDATE
    cantidad_actual = VALUES(cantidad_actual);

-- =================================
-- MOVIMIENTOS DE INVENTARIO INICIAL
-- =================================

-- Movimientos Sede Principal (cantidad_anterior=0, cantidad_posterior=cantidad_actual)
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
VALUES
    (999, 9991, 9991, 'ENTRADA', 100, 0, 100, 'AJUSTE', 9991, '2025-01-01 08:30:00'), -- Pan Francés
    (999, 9991, 9992, 'ENTRADA', 20, 0, 20, 'AJUSTE', 9991, '2025-01-01 08:30:00'),   -- Pan Ciabatta
    (999, 9991, 9993, 'ENTRADA', 5, 0, 5, 'AJUSTE', 9991, '2025-01-01 08:30:00'),     -- Torta de Chocolate
    (999, 9991, 9994, 'ENTRADA', 8, 0, 8, 'AJUSTE', 9991, '2025-01-01 08:30:00')      -- Pie de Limón
ON DUPLICATE KEY UPDATE
    cantidad = VALUES(cantidad);

-- Movimientos Sede Norte
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
VALUES
    (999, 9992, 9991, 'ENTRADA', 80, 0, 80, 'AJUSTE', 9991, '2025-01-01 09:30:00'),   -- Pan Francés
    (999, 9992, 9992, 'ENTRADA', 15, 0, 15, 'AJUSTE', 9991, '2025-01-01 09:30:00'),   -- Pan Ciabatta
    (999, 9992, 9993, 'ENTRADA', 3, 0, 3, 'AJUSTE', 9991, '2025-01-01 09:30:00'),     -- Torta de Chocolate
    (999, 9992, 9994, 'ENTRADA', 6, 0, 6, 'AJUSTE', 9991, '2025-01-01 09:30:00')      -- Pie de Limón
ON DUPLICATE KEY UPDATE
    cantidad = VALUES(cantidad);
