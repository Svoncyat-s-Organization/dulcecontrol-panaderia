-- =======================================================
-- SCRIPT DE BASE DE DATOS POSTGRESQL - DULCECONTROL MVP
-- =======================================================

-- CREATE DATABASE dulcecontrol_db
--    WITH ENCODING = 'UTF8';

-- \c dulcecontrol_db;

-- =================================
--    TABLAS GEOGRÁFICAS (UBIGEO)
-- =================================

CREATE TABLE ubigeo_departamentos
(
    id            BIGSERIAL PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL,
    codigo_ubigeo VARCHAR(2)   NOT NULL UNIQUE
);

CREATE TABLE ubigeo_provincias
(
    id              BIGSERIAL PRIMARY KEY,
    departamento_id BIGINT       NOT NULL,
    nombre          VARCHAR(100) NOT NULL,
    codigo_ubigeo   VARCHAR(4)   NOT NULL UNIQUE,
    FOREIGN KEY (departamento_id) REFERENCES ubigeo_departamentos (id) ON DELETE RESTRICT
);

CREATE TABLE ubigeo_distritos
(
    id            BIGSERIAL PRIMARY KEY,
    provincia_id  BIGINT       NOT NULL,
    nombre        VARCHAR(100) NOT NULL,
    codigo_ubigeo VARCHAR(6)   NOT NULL UNIQUE,
    FOREIGN KEY (provincia_id) REFERENCES ubigeo_provincias (id) ON DELETE RESTRICT
);

-- =================================
-- TABLAS PARA EL SUPERADMINISTRADOR
-- =================================

-- Seguridad
CREATE TABLE usuarios_superadmin
(
    id              BIGSERIAL PRIMARY KEY,
    correo          VARCHAR(255) NOT NULL UNIQUE,
    hash_contrasena VARCHAR(255) NOT NULL,
    tipo_doc        VARCHAR(10)  NOT NULL CHECK (tipo_doc IN ('DNI', 'RUC')),
    numero_doc      VARCHAR(20),
    nombres_doc     VARCHAR(255),
    telefono        VARCHAR(50),
    activo          BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado_en    TIMESTAMP
);

CREATE TABLE actividad_superadmin
(
    id          BIGSERIAL PRIMARY KEY,
    admin_id    BIGINT,
    tipo_evento VARCHAR(100) NOT NULL,
    ip_origen   VARCHAR(45),
    detalles    JSON,
    creado_en   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES usuarios_superadmin (id) ON DELETE SET NULL
);

-- Tiendas

CREATE TABLE tiendas
(
    id                BIGSERIAL PRIMARY KEY,
    slug              VARCHAR(100) NOT NULL,
    tipo_doc          VARCHAR(10)  NOT NULL CHECK (tipo_doc IN ('DNI', 'RUC')),
    numero_doc        VARCHAR(20)  NOT NULL UNIQUE,
    nombre_doc        VARCHAR(255) NOT NULL,
    nombre_comercial  VARCHAR(255),
    correo_contacto   VARCHAR(255) NOT NULL,
    telefono_contacto VARCHAR(50),
    hash_contrasena   VARCHAR(255) NOT NULL,
    estado            VARCHAR(20)  NOT NULL DEFAULT 'EN_PRUEBA' CHECK (estado IN ('EN_PRUEBA', 'ACTIVA', 'SUSPENDIDA', 'CANCELADA')),
    creado_en         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado_en      TIMESTAMP
);

CREATE TABLE sedes
(
    id             BIGSERIAL PRIMARY KEY,
    tienda_id      BIGINT       NOT NULL,
    codigo_interno VARCHAR(50),
    nombre         VARCHAR(100) NOT NULL,
    direccion      TEXT         NOT NULL,
    telefono       VARCHAR(50),
    distrito_id    BIGINT,
    es_principal   BOOLEAN      NOT NULL DEFAULT FALSE,
    activo         BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado_en   TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (distrito_id) REFERENCES ubigeo_distritos (id) ON DELETE SET NULL
);

CREATE TABLE dominios_tienda
(
    id               BIGSERIAL PRIMARY KEY,
    tienda_id        BIGINT       NOT NULL,
    tipo             VARCHAR(20)  NOT NULL DEFAULT 'TIENDA_VIRTUAL' CHECK (tipo IN ('ADMINISTRATIVO', 'TIENDA_VIRTUAL')),
    url_dominio      VARCHAR(255) NOT NULL UNIQUE,
    url_logo         TEXT,
    url_favicon      TEXT,
    color_primario   VARCHAR(7)   NOT NULL DEFAULT '#000000',
    color_secundario VARCHAR(7)   NOT NULL DEFAULT '#ffffff',
    creado_en        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE
);

-- Planes y suscripciones

CREATE TABLE planes
(
    id                      BIGSERIAL PRIMARY KEY,
    codigo                  VARCHAR(50)  NOT NULL UNIQUE,
    nombre                  VARCHAR(100) NOT NULL,
    descripcion             TEXT,
    precio_mensual_centimos BIGINT       NOT NULL,
    precio_anual_centimos   BIGINT       NOT NULL,
    moneda                  VARCHAR(3)   NOT NULL DEFAULT 'PEN',
    limites                 JSON        NOT NULL DEFAULT '{}',
    activo                  BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en               TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suscripciones
(
    id                      BIGSERIAL PRIMARY KEY,
    tienda_id               BIGINT      NOT NULL,
    plan_id                 BIGINT      NOT NULL,
    ciclo                   VARCHAR(10) NOT NULL DEFAULT 'MENSUAL' CHECK (ciclo IN ('MENSUAL', 'ANUAL')),
    precio_pactado_centimos BIGINT      NOT NULL,
    fecha_inicio            TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin               TIMESTAMP   NOT NULL,
    estado                  VARCHAR(20) NOT NULL DEFAULT 'EN_PRUEBA' CHECK (estado IN ('EN_PRUEBA', 'ACTIVA', 'VENCIDA', 'CANCELADA')),
    autorenovar             BOOLEAN     NOT NULL DEFAULT TRUE,
    cancelado_en            TIMESTAMP,
    creado_en               TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE RESTRICT,
    FOREIGN KEY (plan_id) REFERENCES planes (id) ON DELETE RESTRICT
);

CREATE TABLE historial_suscripciones
(
    id                       BIGSERIAL PRIMARY KEY,
    suscripcion_id           BIGINT      NOT NULL,
    plan_anterior_id         BIGINT,
    plan_nuevo_id            BIGINT      NOT NULL,
    tipo_movimiento          VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN
                                                         ('ALTA', 'RENOVACION', 'UPGRADE', 'DOWNGRADE', 'CANCELACION',
                                                          'REACTIVACION')),
    precio_anterior_centimos BIGINT,
    precio_nuevo_centimos    BIGINT      NOT NULL,
    fecha_movimiento         TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_responsable_id   BIGINT,
    FOREIGN KEY (suscripcion_id) REFERENCES suscripciones (id) ON DELETE CASCADE,
    FOREIGN KEY (plan_anterior_id) REFERENCES planes (id),
    FOREIGN KEY (plan_nuevo_id) REFERENCES planes (id)
);

-- Facturación (SaaS)

CREATE TABLE series
(
    id                 SERIAL PRIMARY KEY,
    tipos_comprobante  VARCHAR(20) NOT NULL CHECK (tipos_comprobante IN
                                                   ('FACTURA', 'BOLETA', 'NOTA_CREDITO', 'NOTA_DEBITO')),
    serie              VARCHAR(4)  NOT NULL UNIQUE,
    ultimo_correlativo INTEGER     NOT NULL DEFAULT 0,
    activo             BOOLEAN     NOT NULL DEFAULT TRUE,
    es_predeterminada  BOOLEAN     NOT NULL DEFAULT FALSE,
    creado_en          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comprobantes
(
    id                     BIGSERIAL PRIMARY KEY,
    referencia_id          BIGINT,
    tienda_id              BIGINT       NOT NULL,
    suscripcion_id         BIGINT,
    serie_id               INTEGER      NOT NULL,
    estado_pago            VARCHAR(20)  NOT NULL DEFAULT 'PENDIENTE' CHECK (estado_pago IN
                                                                            ('BORRADOR', 'PENDIENTE', 'PAGADO',
                                                                             'ANULADO', 'REEMBOLSADO')),
    tipos_comprobante      VARCHAR(20)  NOT NULL CHECK (tipos_comprobante IN
                                                        ('FACTURA', 'BOLETA', 'NOTA_CREDITO', 'NOTA_DEBITO')),
    correlativo            INTEGER      NOT NULL,
    fecha_emision          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cliente_tipo_doc       VARCHAR(10)  NOT NULL CHECK (cliente_tipo_doc IN ('DNI', 'RUC')),
    cliente_num_doc        VARCHAR(20)  NOT NULL,
    cliente_nombre_doc     VARCHAR(255) NOT NULL,
    cliente_direccion      TEXT,
    moneda                 VARCHAR(3)   NOT NULL DEFAULT 'PEN',
    total_gravado_centimos BIGINT       NOT NULL DEFAULT 0,
    total_igv_centimos     BIGINT       NOT NULL DEFAULT 0,
    total_importe_centimos BIGINT       NOT NULL,
    estados_sunat          VARCHAR(20)  NOT NULL DEFAULT 'PENDIENTE' CHECK (estados_sunat IN
                                                                            ('PENDIENTE', 'ENVIADO', 'ACEPTADO',
                                                                             'OBSERVADO', 'RECHAZADO', 'ANULADO')),
    codigo_error_sunat     VARCHAR(50),
    respuesta_sunat        TEXT,
    url_xml                TEXT,
    url_cdr                TEXT,
    url_pdf                TEXT,
    creado_en              TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tipos_comprobante, correlativo),
    FOREIGN KEY (referencia_id) REFERENCES comprobantes (id) ON DELETE SET NULL,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE RESTRICT,
    FOREIGN KEY (suscripcion_id) REFERENCES suscripciones (id) ON DELETE SET NULL,
    FOREIGN KEY (serie_id) REFERENCES series (id) ON DELETE RESTRICT
);

CREATE TABLE detalles_comprobante
(
    id                       BIGSERIAL PRIMARY KEY,
    comprobante_id           BIGINT  NOT NULL,
    descripcion              TEXT    NOT NULL,
    cantidad                 INTEGER NOT NULL DEFAULT 1,
    valor_unitario_centimos  BIGINT  NOT NULL,
    precio_unitario_centimos BIGINT  NOT NULL,
    igv_item_centimos        BIGINT  NOT NULL,
    total_item_centimos      BIGINT  NOT NULL,
    FOREIGN KEY (comprobante_id) REFERENCES comprobantes (id) ON DELETE CASCADE
);

CREATE TABLE transacciones_pago
(
    id                      BIGSERIAL PRIMARY KEY,
    tienda_id               BIGINT      NOT NULL,
    comprobante_id          BIGINT      NOT NULL,
    pasarela                VARCHAR(50) NOT NULL,
    id_transaccion_pasarela VARCHAR(100),
    monto_centimos          BIGINT      NOT NULL,
    moneda                  VARCHAR(3)  NOT NULL DEFAULT 'PEN',
    estado                  VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'EXITOSO', 'FALLIDO', 'REEMBOLSADO')),
    codigo_error            VARCHAR(100),
    mensaje_error           TEXT,
    metadata_pasarela       JSON,
    creado_en               TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
    FOREIGN KEY (comprobante_id) REFERENCES comprobantes (id)
);

-- Soporte

CREATE TABLE tickets_soporte
(
    id                   BIGSERIAL PRIMARY KEY,
    tienda_id            BIGINT       NOT NULL,
    asignado_a_id        BIGINT,
    asunto               VARCHAR(255) NOT NULL,
    prioridad            VARCHAR(10)  NOT NULL DEFAULT 'MEDIA' CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA', 'CRITICA')),
    estado               VARCHAR(20)  NOT NULL DEFAULT 'ABIERTO' CHECK (estado IN ('ABIERTO', 'PENDIENTE_CLIENTE', 'RESUELTO', 'CERRADO')),
    vencimiento_sla_en   TIMESTAMP,
    primera_respuesta_en TIMESTAMP,
    resuelto_en          TIMESTAMP,
    creado_en            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE RESTRICT,
    FOREIGN KEY (asignado_a_id) REFERENCES usuarios_superadmin (id) ON DELETE SET NULL
);

CREATE TABLE mensajes_ticket
(
    id              BIGSERIAL PRIMARY KEY,
    ticket_id       BIGINT      NOT NULL,
    tipo_remitente  VARCHAR(20) NOT NULL CHECK (tipo_remitente IN ('SUPERADMIN', 'TIENDA', 'SISTEMA')),
    autor_admin_id  BIGINT,
    mensaje         TEXT        NOT NULL,
    es_nota_interna BOOLEAN     NOT NULL DEFAULT FALSE,
    leido_en        TIMESTAMP,
    creado_en       TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets_soporte (id) ON DELETE CASCADE,
    FOREIGN KEY (autor_admin_id) REFERENCES usuarios_superadmin (id) ON DELETE SET NULL
);

-- =================================
--    TABLAS PARA EL ADMINISTRADOR
-- =================================

-- Seguridad

CREATE TABLE roles
(
    id          BIGSERIAL PRIMARY KEY,
    tienda_id   BIGINT       NOT NULL,
    nombre      VARCHAR(100) NOT NULL,
    descripcion TEXT,
    es_sistema  BOOLEAN   DEFAULT FALSE,
    creado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, nombre),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE
);

CREATE TABLE permisos
(
    id             BIGSERIAL PRIMARY KEY,
    slug           VARCHAR(100) NOT NULL UNIQUE,
    nombre_visible VARCHAR(100) NOT NULL,
    modulo         VARCHAR(100) NOT NULL
);

CREATE TABLE roles_permisos
(
    rol_id     BIGINT NOT NULL,
    permiso_id BIGINT NOT NULL,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES roles (id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos (id) ON DELETE CASCADE
);

CREATE TABLE usuarios_tienda
(
    id               BIGSERIAL PRIMARY KEY,
    tienda_id        BIGINT       NOT NULL,
    rol_id           BIGINT       NOT NULL,
    correo           VARCHAR(255) NOT NULL,
    hash_contrasena  VARCHAR(255) NOT NULL,
    tipo_doc         VARCHAR(10)  NOT NULL CHECK (tipo_doc IN ('DNI', 'RUC')),
    numero_doc       VARCHAR(20)  NOT NULL,
    nombres_doc      VARCHAR(255) NOT NULL,
    telefono         VARCHAR(50),
    activo           BOOLEAN      NOT NULL DEFAULT TRUE,
    ultimo_acceso_en TIMESTAMP,
    creado_en        TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    actualizado_en   TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    eliminado_en     TIMESTAMP,
    UNIQUE (tienda_id, correo),
    UNIQUE (tienda_id, numero_doc),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles (id) ON DELETE RESTRICT
);

CREATE TABLE usuario_sedes
(
    usuario_id        BIGINT NOT NULL,
    sede_id           BIGINT NOT NULL,
    es_sede_principal BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (usuario_id, sede_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios_tienda (id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes (id) ON DELETE CASCADE
);

CREATE TABLE auditoria_usuarios
(
    id                 BIGSERIAL PRIMARY KEY,
    tienda_id          BIGINT       NOT NULL,
    usuario_id         BIGINT,
    accion             VARCHAR(100) NOT NULL,
    entidad            VARCHAR(100) NOT NULL,
    entidad_id         BIGINT,
    valores_anteriores JSON,
    valores_nuevos     JSON,
    ip_origen          VARCHAR(45),
    user_agent         TEXT,
    creado_en          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios_tienda (id)
);

-- Catálogo

CREATE TABLE categorias
(
    id           BIGSERIAL PRIMARY KEY,
    tienda_id    BIGINT       NOT NULL,
    nombre       VARCHAR(100) NOT NULL,
    slug         VARCHAR(100) NOT NULL,
    descripcion  TEXT,
    url_imagen   TEXT,
    icono        VARCHAR(100),
    activa       BOOLEAN      NOT NULL DEFAULT TRUE,
    orden_visual INTEGER               DEFAULT 0,
    creado_en    TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, nombre),
    UNIQUE (tienda_id, slug),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE
);

CREATE TABLE productos
(
    id                     BIGSERIAL PRIMARY KEY,
    tienda_id              BIGINT       NOT NULL,
    categoria_id           BIGINT,
    nombre                 VARCHAR(255) NOT NULL,
    slug                   VARCHAR(255) NOT NULL,
    sku                    VARCHAR(100) NOT NULL,
    descripcion            TEXT,
    tipo                   VARCHAR(20)  NOT NULL DEFAULT 'PRODUCTO_TERMINADO' CHECK (tipo IN ('PRODUCTO_TERMINADO', 'INSUMO_VENTA', 'SERVICIO')),
    es_personalizable      BOOLEAN      NOT NULL DEFAULT FALSE,
    precio_base_centimos   BIGINT       NOT NULL DEFAULT 0,
    precio_oferta_centimos BIGINT,
    visible_en_pos         BOOLEAN      NOT NULL DEFAULT TRUE,
    visible_en_storefront  BOOLEAN      NOT NULL DEFAULT TRUE,
    destacado_storefront   BOOLEAN      NOT NULL DEFAULT FALSE,
    url_imagen_principal   TEXT,
    imagenes_galeria       JSON                 DEFAULT '[]',
    atributos              JSON                 DEFAULT '{}',
    activo                 BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en              TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    actualizado_en         TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, sku),
    UNIQUE (tienda_id, slug),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE SET NULL
);

-- Compras e Insumos

CREATE TABLE insumos
(
    id                               BIGSERIAL PRIMARY KEY,
    tienda_id                        BIGINT       NOT NULL,
    nombre                           VARCHAR(255) NOT NULL,
    codigo_interno                   VARCHAR(100),
    unidad_base                      VARCHAR(20)  NOT NULL CHECK (unidad_base IN
                                                                  ('UNIDAD', 'KG', 'G', 'L', 'ML', 'PAQUETE', 'SACO',
                                                                   'LATA')),
    unidad_compra_habitual           VARCHAR(20)  NOT NULL CHECK (unidad_compra_habitual IN
                                                                  ('UNIDAD', 'KG', 'G', 'L', 'ML', 'PAQUETE', 'SACO',
                                                                   'LATA')),
    factor_conversion                DECIMAL(12, 4) DEFAULT 1,
    costo_promedio_unitario_centimos BIGINT         DEFAULT 0,
    ultimo_precio_compra_centimos    BIGINT,
    stock_actual_global              DECIMAL(12, 4) DEFAULT 0,
    stock_minimo_global              DECIMAL(12, 4) DEFAULT 0,
    activo                           BOOLEAN        DEFAULT TRUE,
    creado_en                        TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, nombre),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE
);

CREATE TABLE proveedores
(
    id                BIGSERIAL PRIMARY KEY,
    tienda_id         BIGINT       NOT NULL,
    nombre_comercial  VARCHAR(255) NOT NULL,
    tipo_doc          VARCHAR(10)  NOT NULL CHECK (tipo_doc IN ('DNI', 'RUC')),
    numero_doc        VARCHAR(20),
    razon_social      VARCHAR(255),
    nombre_contacto   VARCHAR(255),
    telefono_contacto VARCHAR(50),
    email_contacto    VARCHAR(255),
    es_generico       BOOLEAN   DEFAULT FALSE,
    activo            BOOLEAN   DEFAULT TRUE,
    creado_en         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE
);

CREATE TABLE ordenes_compra
(
    id                           BIGSERIAL PRIMARY KEY,
    tienda_id                    BIGINT      NOT NULL,
    sede_destino_id              BIGINT      NOT NULL,
    proveedor_id                 BIGINT      NOT NULL,
    fecha_emision                DATE        NOT NULL DEFAULT CURRENT_DATE,
    fecha_recepcion_esperada     DATE,
    fecha_recepcion_real         DATE,
    estado                       VARCHAR(20) NOT NULL DEFAULT 'BORRADOR' CHECK (estado IN ('BORRADOR', 'ENVIADA',
                                                                                           'RECIBIDA_PARCIAL',
                                                                                           'RECIBIDA_TOTAL',
                                                                                           'CANCELADA')),
    moneda                       VARCHAR(3)           DEFAULT 'PEN',
    total_compra_centimos        BIGINT      NOT NULL DEFAULT 0,
    metodo_pago                  VARCHAR(20) CHECK (metodo_pago IN ('EFECTIVO', 'TRANSFERENCIA', 'CREDITO', 'TARJETA')),
    referencia_pago              VARCHAR(100),
    tipo_comprobante_proveedor   VARCHAR(20) CHECK (tipo_comprobante_proveedor IN
                                                    ('FACTURA', 'BOLETA', 'NOTA_CREDITO', 'NOTA_DEBITO')),
    serie_comprobante_proveedor  VARCHAR(50),
    numero_comprobante_proveedor VARCHAR(50),
    url_foto_comprobante         TEXT,
    observaciones                TEXT,
    registrado_por               BIGINT,
    creado_en                    TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    actualizado_en               TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (sede_destino_id) REFERENCES sedes (id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores (id),
    FOREIGN KEY (registrado_por) REFERENCES usuarios_tienda (id)
);

CREATE TABLE detalles_orden_compra
(
    id                              BIGSERIAL PRIMARY KEY,
    orden_compra_id                 BIGINT         NOT NULL,
    insumo_id                       BIGINT         NOT NULL,
    cantidad_solicitada             DECIMAL(12, 4) NOT NULL,
    unidad_compra                   VARCHAR(20)    NOT NULL CHECK (unidad_compra IN
                                                                   ('UNIDAD', 'KG', 'G', 'L', 'ML', 'PAQUETE', 'SACO',
                                                                    'LATA')),
    costo_unitario_pactado_centimos BIGINT         NOT NULL,
    total_linea_centimos            BIGINT         NOT NULL,
    cantidad_recibida               DECIMAL(12, 4) DEFAULT 0,
    recibido_completo               BOOLEAN        DEFAULT FALSE,
    FOREIGN KEY (orden_compra_id) REFERENCES ordenes_compra (id) ON DELETE CASCADE,
    FOREIGN KEY (insumo_id) REFERENCES insumos (id)
);

-- Clientes

CREATE TABLE clientes
(
    id                 BIGSERIAL PRIMARY KEY,
    tienda_id          BIGINT       NOT NULL,
    tipo_doc           VARCHAR(10) CHECK (tipo_doc IN ('DNI', 'RUC')),
    numero_doc         VARCHAR(20),
    nombre_doc         VARCHAR(255) NOT NULL,
    email              VARCHAR(255),
    telefono           VARCHAR(50),
    es_usuario_virtual BOOLEAN      NOT NULL DEFAULT FALSE,
    hash_contrasena    VARCHAR(255),
    notas              TEXT,
    activo             BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en          TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    actualizado_en     TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, tipo_doc, numero_doc),
    UNIQUE (tienda_id, email),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE
);

CREATE TABLE direcciones_cliente
(
    id                 BIGSERIAL PRIMARY KEY,
    cliente_id         BIGINT NOT NULL,
    etiqueta           VARCHAR(100),
    direccion_completa TEXT   NOT NULL,
    referencia         TEXT,
    distrito_id        BIGINT,
    codigo_postal      VARCHAR(20),
    es_fiscal          BOOLEAN   DEFAULT FALSE,
    es_entrega         BOOLEAN   DEFAULT FALSE,
    creado_en          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE,
    FOREIGN KEY (distrito_id) REFERENCES ubigeo_distritos (id) ON DELETE SET NULL
);

-- Ventas (POS y Storefront)

CREATE TABLE cajas
(
    id        BIGSERIAL PRIMARY KEY,
    tienda_id BIGINT       NOT NULL,
    sede_id   BIGINT       NOT NULL,
    nombre    VARCHAR(100) NOT NULL,
    activa    BOOLEAN   DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes (id) ON DELETE CASCADE
);

CREATE TABLE sesiones_caja
(
    id                            BIGSERIAL PRIMARY KEY,
    tienda_id                     BIGINT    NOT NULL,
    caja_id                       BIGINT    NOT NULL,
    usuario_apertura_id           BIGINT    NOT NULL,
    usuario_cierre_id             BIGINT,
    monto_inicial_centimos        BIGINT    NOT NULL,
    monto_final_esperado_centimos BIGINT,
    monto_final_real_centimos     BIGINT,
    diferencia_centimos           INTEGER GENERATED ALWAYS AS (monto_final_real_centimos - monto_final_esperado_centimos) STORED,
    fecha_apertura                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre                  TIMESTAMP,
    esta_abierta                  BOOLEAN            DEFAULT TRUE,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (caja_id) REFERENCES cajas (id),
    FOREIGN KEY (usuario_apertura_id) REFERENCES usuarios_tienda (id),
    FOREIGN KEY (usuario_cierre_id) REFERENCES usuarios_tienda (id)
);

CREATE TABLE pedidos
(
    id                         BIGSERIAL PRIMARY KEY,
    codigo_pedido              VARCHAR(50) NOT NULL,
    tienda_id                  BIGINT      NOT NULL,
    sede_origen_id             BIGINT      NOT NULL,
    cliente_id                 BIGINT,
    origen                     VARCHAR(20) NOT NULL CHECK (origen IN ('POS_LOCAL', 'STOREFRONT_ONLINE', 'TELEFONO')),
    sesion_caja_id             BIGINT,
    vendedor_id                BIGINT,
    estado_pedido              VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE_PAGO' CHECK (estado_pedido IN
                                                                                    ('BORRADOR', 'PENDIENTE_PAGO',
                                                                                     'PAGADO', 'EN_PREPARACION',
                                                                                     'LISTO_ENTREGA', 'ENTREGADO',
                                                                                     'CANCELADO', 'DEVUELTO')),
    estado_pago                VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado_pago IN ('PENDIENTE', 'PARCIAL', 'PAGADO_TOTAL', 'REEMBOLSADO')),
    tipo_entrega               VARCHAR(20) NOT NULL DEFAULT 'RECOJO_TIENDA' CHECK (tipo_entrega IN ('RECOJO_TIENDA', 'DELIVERY', 'CONSUMO_LOCAL')),
    fecha_entrega_pactada      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    direccion_entrega          TEXT,
    costo_delivery_centimos    BIGINT               DEFAULT 0,
    moneda                     VARCHAR(3)           DEFAULT 'PEN',
    subtotal_items_centimos    BIGINT      NOT NULL DEFAULT 0,
    descuento_total_centimos   BIGINT      NOT NULL DEFAULT 0,
    impuestos_totales_centimos BIGINT      NOT NULL DEFAULT 0,
    total_final_centimos       BIGINT      NOT NULL,
    monto_pagado_centimos      BIGINT      NOT NULL DEFAULT 0,
    saldo_pendiente_centimos   INTEGER GENERATED ALWAYS AS (total_final_centimos - monto_pagado_centimos) STORED,
    requiere_comprobante       BOOLEAN              DEFAULT TRUE,
    tipo_comprobante           VARCHAR(20) CHECK (tipo_comprobante IN ('FACTURA', 'BOLETA', 'NOTA_CREDITO', 'NOTA_DEBITO')),
    serie_comprobante          VARCHAR(20),
    numero_comprobante         VARCHAR(20),
    notas_pedido               TEXT,
    creado_en                  TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    actualizado_en             TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, codigo_pedido),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (sede_origen_id) REFERENCES sedes (id),
    FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE SET NULL,
    FOREIGN KEY (sesion_caja_id) REFERENCES sesiones_caja (id),
    FOREIGN KEY (vendedor_id) REFERENCES usuarios_tienda (id)
);

CREATE TABLE direcciones_pedido
(
    id                  BIGSERIAL PRIMARY KEY,
    pedido_id           BIGINT       NOT NULL,
    tipo_direccion      VARCHAR(20)  NOT NULL CHECK (tipo_direccion IN ('FACTURACION', 'ENVIO')),
    nombre_contacto     VARCHAR(255) NOT NULL,
    tipo_doc_contacto   VARCHAR(10) CHECK (tipo_doc_contacto IN ('DNI', 'RUC')),
    numero_doc_contacto VARCHAR(20),
    telefono_contacto   VARCHAR(50)  NOT NULL,
    email_contacto      VARCHAR(255),
    direccion_completa  TEXT         NOT NULL,
    referencia          TEXT,
    distrito            VARCHAR(100),
    provincia           VARCHAR(100),
    departamento        VARCHAR(100),
    codigo_ubigeo       VARCHAR(6),
    codigo_postal       VARCHAR(20),
    creado_en           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE
);

CREATE TABLE detalles_pedido
(
    id                       BIGSERIAL PRIMARY KEY,
    pedido_id                BIGINT  NOT NULL,
    producto_id              BIGINT  NOT NULL,
    cantidad                 INTEGER NOT NULL DEFAULT 1,
    precio_unitario_centimos BIGINT  NOT NULL,
    subtotal_linea_centimos  BIGINT  NOT NULL,
    notas_item               TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE RESTRICT
);

CREATE TABLE pagos_pedido
(
    id                    BIGSERIAL PRIMARY KEY,
    pedido_id             BIGINT      NOT NULL,
    sesion_caja_id        BIGINT,
    monto_pagado_centimos BIGINT      NOT NULL,
    metodo_pago           VARCHAR(20) NOT NULL CHECK (metodo_pago IN
                                                      ('EFECTIVO', 'YAPE', 'PLIN', 'TARJETA_CREDITO', 'TARJETA_DEBITO',
                                                       'TRANSFERENCIA', 'PASARELA_ONLINE')),
    referencia_externa    VARCHAR(100),
    fecha_pago            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registrado_por        BIGINT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
    FOREIGN KEY (sesion_caja_id) REFERENCES sesiones_caja (id),
    FOREIGN KEY (registrado_por) REFERENCES usuarios_tienda (id)
);

CREATE TABLE personalizaciones_item_pedido
(
    id                                   BIGSERIAL PRIMARY KEY,
    detalle_pedido_id                    BIGINT NOT NULL UNIQUE,
    descripcion_solicitud                TEXT   NOT NULL,
    texto_dedicatoria                    TEXT,
    imagenes_referencia                  JSON  DEFAULT '[]',
    sabor_masa                           VARCHAR(100),
    sabor_relleno                        VARCHAR(100),
    tematica                             VARCHAR(100),
    fecha_limite_produccion              TIMESTAMP,
    costo_extra_personalizacion_centimos BIGINT DEFAULT 0,
    FOREIGN KEY (detalle_pedido_id) REFERENCES detalles_pedido (id) ON DELETE CASCADE
);

CREATE TABLE movimientos_caja
(
    id                   BIGSERIAL PRIMARY KEY,
    sesion_caja_id       BIGINT      NOT NULL,
    tipo_movimiento      VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN
                                                     ('VENTA', 'DEVOLUCION', 'GASTO_OPERATIVO', 'RETIRO_EFECTIVO',
                                                      'INGRESO_EFECTIVO', 'AJUSTE')),
    monto_centimos       BIGINT      NOT NULL,
    metodo_pago          VARCHAR(20) CHECK (metodo_pago IN
                                            ('EFECTIVO', 'YAPE', 'PLIN', 'TARJETA_CREDITO', 'TARJETA_DEBITO',
                                             'TRANSFERENCIA', 'PASARELA_ONLINE')),
    pedido_id            BIGINT,
    concepto             TEXT,
    comprobante_asociado VARCHAR(100),
    creado_en            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sesion_caja_id) REFERENCES sesiones_caja (id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id)
);

-- Producción

CREATE TABLE recetas
(
    id                 BIGSERIAL PRIMARY KEY,
    tienda_id          BIGINT         NOT NULL,
    producto_id        BIGINT         NOT NULL,
    insumo_id          BIGINT         NOT NULL,
    cantidad_requerida DECIMAL(12, 4) NOT NULL,
    unidad_medida      VARCHAR(20)    NOT NULL,
    notas_preparacion  TEXT,
    creado_en          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (producto_id, insumo_id),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
    FOREIGN KEY (insumo_id) REFERENCES insumos (id) ON DELETE RESTRICT
);

CREATE TABLE stock_ideal
(
    id               BIGSERIAL PRIMARY KEY,
    tienda_id        BIGINT  NOT NULL,
    sede_id          BIGINT  NOT NULL,
    producto_id      BIGINT  NOT NULL,
    cantidad_ideal   INTEGER NOT NULL DEFAULT 0,
    punto_reposicion INTEGER          DEFAULT 0,
    actualizado_en   TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sede_id, producto_id),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes (id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
);

CREATE TABLE conteos_diarios
(
    id             BIGSERIAL PRIMARY KEY,
    tienda_id      BIGINT NOT NULL,
    sede_id        BIGINT NOT NULL,
    fecha_conteo   DATE   NOT NULL DEFAULT CURRENT_DATE,
    responsable_id BIGINT,
    observaciones  TEXT,
    creado_en      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sede_id, fecha_conteo),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes (id) ON DELETE CASCADE,
    FOREIGN KEY (responsable_id) REFERENCES usuarios_tienda (id)
);

CREATE TABLE detalle_conteo_diario
(
    id               BIGSERIAL PRIMARY KEY,
    conteo_id        BIGINT  NOT NULL,
    producto_id      BIGINT  NOT NULL,
    cantidad_fisica  INTEGER NOT NULL DEFAULT 0,
    cantidad_sistema INTEGER,
    diferencia       INTEGER GENERATED ALWAYS AS (cantidad_fisica - COALESCE(cantidad_sistema, cantidad_fisica)) STORED,
    FOREIGN KEY (conteo_id) REFERENCES conteos_diarios (id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos (id)
);

CREATE TABLE planes_produccion
(
    id               BIGSERIAL PRIMARY KEY,
    tienda_id        BIGINT      NOT NULL,
    sede_id          BIGINT      NOT NULL,
    fecha_produccion DATE        NOT NULL DEFAULT CURRENT_DATE,
    estado           VARCHAR(20) NOT NULL DEFAULT 'BORRADOR' CHECK (estado IN ('BORRADOR', 'CONFIRMADO', 'EN_PROCESO',
                                                                               'FINALIZADO', 'CANCELADO')),
    generado_por     BIGINT,
    confirmado_por   BIGINT,
    hora_inicio_real TIMESTAMP,
    hora_fin_real    TIMESTAMP,
    notas_maestro    TEXT,
    creado_en        TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    actualizado_en   TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sede_id, fecha_produccion),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes (id) ON DELETE CASCADE,
    FOREIGN KEY (generado_por) REFERENCES usuarios_tienda (id),
    FOREIGN KEY (confirmado_por) REFERENCES usuarios_tienda (id)
);

CREATE TABLE detalles_plan_produccion
(
    id                   BIGSERIAL PRIMARY KEY,
    plan_id              BIGINT      NOT NULL,
    producto_id          BIGINT      NOT NULL,
    origen               VARCHAR(20) NOT NULL DEFAULT 'STOCK_DIARIO' CHECK (origen IN ('STOCK_DIARIO', 'PEDIDO_CLIENTE')),
    pedido_cliente_id    BIGINT,
    detalle_pedido_id    BIGINT,
    es_personalizado     BOOLEAN     NOT NULL DEFAULT FALSE,
    personalizacion_id   BIGINT,
    cantidad_sugerida    INTEGER     NOT NULL,
    cantidad_planificada INTEGER     NOT NULL,
    cantidad_producida   INTEGER              DEFAULT 0,
    cantidad_merma       INTEGER              DEFAULT 0,
    estado               VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'EN_HORNO', 'TERMINADO', 'MERMA')),
    hora_termino         TIMESTAMP,
    observaciones        TEXT,
    FOREIGN KEY (plan_id) REFERENCES planes_produccion (id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos (id),
    FOREIGN KEY (pedido_cliente_id) REFERENCES pedidos (id) ON DELETE SET NULL,
    FOREIGN KEY (detalle_pedido_id) REFERENCES detalles_pedido (id) ON DELETE SET NULL,
    FOREIGN KEY (personalizacion_id) REFERENCES personalizaciones_item_pedido (id) ON DELETE SET NULL
);

-- Inventario

CREATE TABLE inventario_insumos_sedes
(
    id               BIGSERIAL PRIMARY KEY,
    tienda_id        BIGINT         NOT NULL,
    sede_id          BIGINT         NOT NULL,
    insumo_id        BIGINT         NOT NULL,
    cantidad_actual  DECIMAL(12, 4) NOT NULL DEFAULT 0,
    ubicacion_fisica VARCHAR(100),
    actualizado_en   TIMESTAMP               DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sede_id, insumo_id),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes (id) ON DELETE CASCADE,
    FOREIGN KEY (insumo_id) REFERENCES insumos (id) ON DELETE CASCADE
);

CREATE TABLE inventario_productos
(
    id               BIGSERIAL PRIMARY KEY,
    tienda_id        BIGINT  NOT NULL,
    sede_id          BIGINT  NOT NULL,
    producto_id      BIGINT  NOT NULL,
    cantidad_actual  INTEGER NOT NULL DEFAULT 0,
    ubicacion_fisica VARCHAR(100),
    actualizado_en   TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sede_id, producto_id),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes (id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
);

CREATE TABLE transferencias_inventario
(
    id              BIGSERIAL PRIMARY KEY,
    tienda_id       BIGINT      NOT NULL,
    sede_origen_id  BIGINT      NOT NULL,
    sede_destino_id BIGINT      NOT NULL,
    estado          VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    solicitado_por  BIGINT,
    autorizado_por  BIGINT,
    recibido_por    BIGINT,
    fecha_solicitud TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    fecha_envio     TIMESTAMP,
    fecha_recepcion TIMESTAMP,
    observaciones   TEXT,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
    FOREIGN KEY (sede_origen_id) REFERENCES sedes (id),
    FOREIGN KEY (sede_destino_id) REFERENCES sedes (id),
    FOREIGN KEY (solicitado_por) REFERENCES usuarios_tienda (id),
    FOREIGN KEY (autorizado_por) REFERENCES usuarios_tienda (id),
    FOREIGN KEY (recibido_por) REFERENCES usuarios_tienda (id)
);

CREATE TABLE items_transferencia
(
    id                BIGSERIAL PRIMARY KEY,
    transferencia_id  BIGINT         NOT NULL,
    insumo_id         BIGINT,
    producto_id       BIGINT,
    cantidad_enviada  DECIMAL(12, 4) NOT NULL,
    cantidad_recibida DECIMAL(12, 4),
    CONSTRAINT chk_item_type CHECK ((insumo_id IS NOT NULL AND producto_id IS NULL) OR
                                    (insumo_id IS NULL AND producto_id IS NOT NULL)),
    FOREIGN KEY (transferencia_id) REFERENCES transferencias_inventario (id),
    FOREIGN KEY (insumo_id) REFERENCES insumos (id),
    FOREIGN KEY (producto_id) REFERENCES productos (id)
);

CREATE TABLE movimientos_inventario_insumos
(
    id                 BIGSERIAL PRIMARY KEY,
    tienda_id          BIGINT         NOT NULL,
    sede_id            BIGINT         NOT NULL,
    insumo_id          BIGINT         NOT NULL,
    tipo_movimiento    VARCHAR(50)    NOT NULL,
    cantidad           DECIMAL(12, 4) NOT NULL,
    cantidad_anterior  DECIMAL(12, 4) NOT NULL,
    cantidad_posterior DECIMAL(12, 4) NOT NULL,
    orden_compra_id    BIGINT,
    plan_produccion_id BIGINT,
    transferencia_id   BIGINT,
    motivo             TEXT,
    responsable_id     BIGINT,
    creado_en          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
    FOREIGN KEY (sede_id) REFERENCES sedes (id),
    FOREIGN KEY (insumo_id) REFERENCES insumos (id),
    FOREIGN KEY (orden_compra_id) REFERENCES ordenes_compra (id),
    FOREIGN KEY (plan_produccion_id) REFERENCES planes_produccion (id),
    FOREIGN KEY (transferencia_id) REFERENCES transferencias_inventario (id),
    FOREIGN KEY (responsable_id) REFERENCES usuarios_tienda (id)
);

CREATE TABLE movimientos_inventario_productos
(
    id                 BIGSERIAL PRIMARY KEY,
    tienda_id          BIGINT      NOT NULL,
    sede_id            BIGINT      NOT NULL,
    producto_id        BIGINT      NOT NULL,
    tipo_movimiento    VARCHAR(50) NOT NULL,
    cantidad           INTEGER     NOT NULL,
    cantidad_anterior  INTEGER     NOT NULL,
    cantidad_posterior INTEGER     NOT NULL,
    pedido_id          BIGINT,
    plan_produccion_id BIGINT,
    motivo             VARCHAR(20) NOT NULL CHECK (motivo IN ('PRODUCCION', 'VENTA', 'MERMA', 'AJUSTE', 'TRANSFERENCIA',
                                                              'DEVOLUCION')),
    responsable_id     BIGINT,
    creado_en          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
    FOREIGN KEY (sede_id) REFERENCES sedes (id),
    FOREIGN KEY (producto_id) REFERENCES productos (id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id),
    FOREIGN KEY (plan_produccion_id) REFERENCES planes_produccion (id),
    FOREIGN KEY (responsable_id) REFERENCES usuarios_tienda (id)
);

-- Facturación Tienda

CREATE TABLE tienda_series
(
    id                 BIGSERIAL PRIMARY KEY,
    tienda_id          BIGINT      NOT NULL,
    sede_id            BIGINT      NOT NULL,
    tipo_comprobante   VARCHAR(20) NOT NULL CHECK (tipo_comprobante IN ('factura', 'boleta', 'nota_credito', 'nota_debito')),
    serie              VARCHAR(4)  NOT NULL,
    correlativo_actual INTEGER     NOT NULL DEFAULT 0,
    es_electronica     BOOLEAN              DEFAULT TRUE,
    activa             BOOLEAN              DEFAULT TRUE,
    creado_en          TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, serie),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes (id) ON DELETE CASCADE
);

CREATE TABLE tienda_comprobantes
(
    id                             BIGSERIAL PRIMARY KEY,
    tienda_id                      BIGINT       NOT NULL,
    pedido_id                      BIGINT       NOT NULL,
    serie_id                       BIGINT       NOT NULL,
    emisor_razon_social            VARCHAR(255) NOT NULL,
    emisor_ruc                     VARCHAR(20)  NOT NULL,
    emisor_direccion               TEXT         NOT NULL,
    cliente_tipo_doc               VARCHAR(10)  NOT NULL CHECK (cliente_tipo_doc IN ('DNI', 'RUC')),
    cliente_numero_doc             VARCHAR(20)  NOT NULL,
    cliente_nombre                 VARCHAR(255) NOT NULL,
    cliente_direccion              TEXT,
    tipo_comprobante               VARCHAR(20)  NOT NULL CHECK (tipo_comprobante IN ('factura', 'boleta', 'nota_credito', 'nota_debito')),
    correlativo                    INTEGER      NOT NULL,
    fecha_emision                  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    moneda                         VARCHAR(3)            DEFAULT 'PEN',
    total_gravado_centimos         BIGINT       NOT NULL DEFAULT 0,
    total_inafecto_centimos        BIGINT       NOT NULL DEFAULT 0,
    total_exonerado_centimos       BIGINT       NOT NULL DEFAULT 0,
    total_igv_centimos             BIGINT       NOT NULL DEFAULT 0,
    total_impuestos_bolsa_centimos BIGINT       NOT NULL DEFAULT 0,
    total_importe_centimos         BIGINT       NOT NULL,
    estado_sunat                   VARCHAR(20)  NOT NULL DEFAULT 'PENDIENTE' CHECK (estado_sunat IN
                                                                                    ('PENDIENTE', 'ENVIADO', 'ACEPTADO',
                                                                                     'OBSERVADO', 'RECHAZADO',
                                                                                     'ANULADO')),
    codigo_hash_cpe                VARCHAR(255),
    xml_firmado_url                TEXT,
    cdr_sunat_url                  TEXT,
    representacion_impresa_url     TEXT,
    respuesta_sunat_codigo         VARCHAR(50),
    respuesta_sunat_descripcion    TEXT,
    creado_en                      TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tipo_comprobante, correlativo),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE RESTRICT,
    FOREIGN KEY (serie_id) REFERENCES tienda_series (id) ON DELETE RESTRICT
);

-- Configuración

CREATE TABLE configuracion_tienda
(
    tienda_id                  BIGINT PRIMARY KEY,
    ruc                        VARCHAR(20),
    razon_social               VARCHAR(255),
    direccion_fiscal           TEXT,
    ubigeo_fiscal              VARCHAR(6),
    usuario_sunat_sol          VARCHAR(100),
    clave_sunat_sol_encriptada TEXT,
    certificado_digital_url    TEXT,
    modo_sunat                 VARCHAR(20)   DEFAULT 'PRUEBAS',
    tasa_igv                   DECIMAL(5, 2) DEFAULT 18.00,
    api_key_yape               VARCHAR(255),
    api_key_plin               VARCHAR(255),
    merchant_id_niubiz         VARCHAR(100),
    banner_principal_url       TEXT,
    mensaje_bienvenida         TEXT,
    horario_atencion           JSON         DEFAULT '{}',
    redes_sociales             JSON         DEFAULT '{}',
    politicas_envio            TEXT,
    politicas_devolucion       TEXT,
    email_notificaciones       VARCHAR(255),
    telegram_bot_token         VARCHAR(255),
    telegram_chat_id           VARCHAR(100),
    actualizado_en             TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (ubigeo_fiscal) REFERENCES ubigeo_distritos (codigo_ubigeo)
);

-- CMS

CREATE TABLE paginas_storefront
(
    id               BIGSERIAL PRIMARY KEY,
    tienda_id        BIGINT       NOT NULL,
    slug             VARCHAR(100) NOT NULL,
    titulo           VARCHAR(255) NOT NULL,
    contenido        TEXT         NOT NULL,
    meta_descripcion TEXT,
    orden_menu       INTEGER   DEFAULT 0,
    visible_en_menu  BOOLEAN   DEFAULT TRUE,
    activa           BOOLEAN   DEFAULT TRUE,
    creado_en        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, slug),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE
);