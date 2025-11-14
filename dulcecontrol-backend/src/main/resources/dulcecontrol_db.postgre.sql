CREATE DATABASE IF NOT EXISTS dulcecontrol_db;

\connect dulcecontrol_db

CREATE EXTENSION IF NOT EXISTS citext;

CREATE SCHEMA IF NOT EXISTS dulce_control;
SET search_path TO dulce_control, public;

-- =================================
--              ENUMS
-- =================================

-- GLOBALES
CREATE TYPE tipos_documento AS ENUM ('DNI', 'RUC');
CREATE TYPE tipos_comprobante AS ENUM ('factura', 'boleta', 'nota_credito', 'nota_debito');
CREATE TYPE estados_sunat AS ENUM ('pendiente', 'enviado', 'aceptado', 'observado', 'rechazado', 'anulado');
CREATE TYPE tipos_serie_sunat AS ENUM ('F', 'B', 'FN', 'BN');

-- Superadministrador 

CREATE TYPE tipos_dominio AS ENUM ('administrativo', 'tienda_virtual');
CREATE TYPE ciclos_plan AS ENUM ('mensual', 'anual');
CREATE TYPE estados_tienda AS ENUM ('en_prueba', 'activa', 'suspendida', 'cancelada');
CREATE TYPE estados_suscripcion AS ENUM ('en_prueba', 'activa', 'vencida', 'cancelada');
CREATE TYPE tipos_movimiento_suscripcion AS ENUM ('alta', 'renovacion', 'upgrade', 'downgrade', 'cancelacion', 'reactivacion');
CREATE TYPE estados_pago_comprobante AS ENUM ('borrador', 'pendiente', 'pagado', 'anulado', 'reembolsado');
CREATE TYPE estados_transaccion AS ENUM ('pendiente', 'exitoso', 'fallido', 'reembolsado'); 
CREATE TYPE prioridades_ticket AS ENUM ('baja', 'media', 'alta', 'critica');
CREATE TYPE estados_ticket AS ENUM ('abierto', 'pendiente_cliente', 'resuelto', 'cerrado');
CREATE TYPE remitentes_mensaje AS ENUM ('superadmin', 'tienda', 'sistema');

-- Administrador

CREATE TYPE estados_plan_produccion AS ENUM ('borrador', 'confirmado', 'en_proceso', 'finalizado', 'cancelado');
CREATE TYPE estados_item_produccion AS ENUM ('pendiente', 'en_horno', 'terminado', 'merma');
CREATE TYPE origenes_produccion AS ENUM ('stock_diario', 'pedido_cliente');
CREATE TYPE tipos_producto AS ENUM ('producto_terminado', 'insumo_venta', 'servicio');
CREATE TYPE estados_orden_compra AS ENUM ('borrador', 'enviada', 'recibida_parcial', 'recibida_total', 'cancelada');
CREATE TYPE metodos_pago_compra AS ENUM ('efectivo', 'transferencia', 'credito', 'tarjeta');
CREATE TYPE unidades_medida AS ENUM ('unidad', 'kg', 'g', 'l', 'ml', 'paquete', 'saco', 'lata');
CREATE TYPE estados_pedido AS ENUM ('borrador', 'pendiente_pago', 'pagado', 'en_preparacion', 'listo_entrega', 'entregado', 'cancelado', 'devuelto');
CREATE TYPE origenes_pedido AS ENUM ('pos_local', 'storefront_online', 'telefono');
CREATE TYPE tipos_entrega AS ENUM ('recojo_tienda', 'delivery', 'consumo_local');
CREATE TYPE metodos_pago AS ENUM ('efectivo', 'yape', 'plin', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'pasarela_online');
CREATE TYPE estados_pago_pedido AS ENUM ('pendiente', 'parcial', 'pagado_total', 'reembolsado');
CREATE TYPE motivos_movimiento AS ENUM ('produccion', 'venta', 'merma', 'ajuste', 'transferencia', 'devolucion');
CREATE TYPE tipos_movimiento_caja AS ENUM ('venta', 'devolucion', 'gasto_operativo', 'retiro_efectivo', 'ingreso_efectivo', 'ajuste');

-- =================================
--    TABLAS GEOGRÁFICAS (UBIGEO)
-- =================================

CREATE TABLE IF NOT EXISTS ubigeo_departamentos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre TEXT NOT NULL,
    codigo_ubigeo CHAR(2) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ubigeo_provincias (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    departamento_id BIGINT NOT NULL REFERENCES ubigeo_departamentos(id) ON DELETE RESTRICT,
    nombre TEXT NOT NULL,
    codigo_ubigeo CHAR(4) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ubigeo_distritos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    provincia_id BIGINT NOT NULL REFERENCES ubigeo_provincias(id) ON DELETE RESTRICT,
    nombre TEXT NOT NULL,
    codigo_ubigeo CHAR(6) NOT NULL UNIQUE
);

-- =================================
-- TABLAS PARA EL SUPERADMINISTRADOR
-- =================================


-- Seguridad
CREATE TABLE IF NOT EXISTS usuarios_superadmin (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    correo CITEXT NOT NULL UNIQUE,
    hash_contrasena TEXT NOT NULL,
    tipo_doc tipos_documento NOT NULL,
    numero_doc TEXT,
    nombres_doc TEXT,
    telefono TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS actividad_superadmin (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    admin_id BIGINT REFERENCES usuarios_superadmin(id) ON DELETE SET NULL,
    tipo_evento TEXT NOT NULL,
    ip_origen INET,
    detalles JSONB,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tiendas

CREATE TABLE IF NOT EXISTS tiendas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug TEXT NOT NULL,
    tipo_doc tipos_documento NOT NULL,
    numero_doc TEXT NOT NULL UNIQUE,
    nombre_doc TEXT NOT NULL,
    nombre_comercial TEXT,
    correo_contacto CITEXT NOT NULL,
    telefono_contacto TEXT,
    hash_contrasena TEXT NOT NULL,
    estado estados_tienda NOT NULL DEFAULT 'en_prueba',
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sedes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    codigo_interno TEXT,
    nombre TEXT NOT NULL,
    direccion TEXT NOT NULL,
    telefono TEXT,
    distrito_id BIGINT REFERENCES ubigeo_distritos(id) ON DELETE SET NULL,
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_en TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS dominios_tienda (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    tipo tipos_dominio NOT NULL DEFAULT 'tienda_virtual',
    url_dominio TEXT NOT NULL UNIQUE,
    url_logo TEXT,
    url_favicon TEXT,
    color_primario CHAR(7) NOT NULL DEFAULT '#000000',
    color_secundario CHAR(7) NOT NULL DEFAULT '#ffffff',
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Planes y suscripciones

CREATE TABLE IF NOT EXISTS planes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio_mensual_centimos BIGINT NOT NULL,
    precio_anual_centimos BIGINT NOT NULL,
    moneda CHAR(3) NOT NULL DEFAULT 'PEN',
    limites JSONB NOT NULL DEFAULT '{}',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suscripciones (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE RESTRICT,
    plan_id BIGINT NOT NULL REFERENCES planes(id) ON DELETE RESTRICT,
    ciclo ciclos_plan NOT NULL DEFAULT 'mensual',
    precio_pactado_centimos BIGINT NOT NULL,
    fecha_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_fin TIMESTAMPTZ NOT NULL,
    estado estados_suscripcion NOT NULL DEFAULT 'en_prueba',
    autorenovar BOOLEAN NOT NULL DEFAULT TRUE,
    cancelado_en TIMESTAMPTZ,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS historial_suscripciones (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    suscripcion_id BIGINT NOT NULL REFERENCES suscripciones(id) ON DELETE CASCADE,
    plan_anterior_id BIGINT REFERENCES planes(id),
    plan_nuevo_id BIGINT NOT NULL REFERENCES planes(id),
    tipo_movimiento tipos_movimiento_suscripcion NOT NULL,
    precio_anterior_centimos BIGINT,
    precio_nuevo_centimos BIGINT NOT NULL,
    fecha_movimiento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    usuario_responsable_id BIGINT
);

-- Facturación (SaaS)

CREATE TABLE IF NOT EXISTS series (
    id SERIAL PRIMARY KEY,
    tipos_comprobante tipos_comprobante NOT NULL,
    serie CHAR(4) NOT NULL UNIQUE,
    ultimo_correlativo INTEGER NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    es_predeterminada BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comprobantes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    referencia_id BIGINT REFERENCES comprobantes(id) ON DELETE SET NULL,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE RESTRICT,
    suscripcion_id BIGINT REFERENCES suscripciones(id) ON DELETE SET NULL,
    serie_id INTEGER NOT NULL REFERENCES series(id) ON DELETE RESTRICT,
    estado_pago estados_pago_comprobante NOT NULL DEFAULT 'pendiente',
    tipos_comprobante tipos_comprobante NOT NULL,
    correlativo INTEGER NOT NULL,
    fecha_emision TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cliente_tipo_doc tipos_documento NOT NULL,
    cliente_num_doc TEXT NOT NULL,
    cliente_nombre_doc TEXT NOT NULL,
    cliente_direccion TEXT,
    moneda CHAR(3) NOT NULL DEFAULT 'PEN',
    total_gravado_centimos BIGINT NOT NULL DEFAULT 0,
    total_igv_centimos BIGINT NOT NULL DEFAULT 0,
    total_importe_centimos BIGINT NOT NULL,
    estados_sunat estados_sunat NOT NULL DEFAULT 'pendiente',
    codigo_error_sunat TEXT,
    respuesta_sunat TEXT,
    url_xml TEXT,
    url_cdr TEXT,
    url_pdf TEXT,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tipos_comprobante, correlativo)
);

CREATE TABLE IF NOT EXISTS detalles_comprobante (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comprobante_id BIGINT NOT NULL REFERENCES comprobantes(id) ON DELETE CASCADE,
    descripcion TEXT NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    valor_unitario_centimos BIGINT NOT NULL,
    precio_unitario_centimos BIGINT NOT NULL,
    igv_item_centimos BIGINT NOT NULL,
    total_item_centimos BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS transacciones_pago (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id),
    comprobante_id BIGINT NOT NULL REFERENCES comprobantes(id),
    pasarela TEXT NOT NULL,
    id_transaccion_pasarela TEXT,
    monto_centimos BIGINT NOT NULL,
    moneda CHAR(3) NOT NULL DEFAULT 'PEN',
    estado estados_transaccion NOT NULL DEFAULT 'pendiente',
    codigo_error TEXT,
    mensaje_error TEXT,
    metadata_pasarela JSONB,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Soporte

CREATE TABLE IF NOT EXISTS tickets_soporte (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE RESTRICT,
    asignado_a_id BIGINT REFERENCES usuarios_superadmin(id) ON DELETE SET NULL,
    asunto TEXT NOT NULL,
    prioridad prioridades_ticket NOT NULL DEFAULT 'media',
    estado estados_ticket NOT NULL DEFAULT 'abierto',
    vencimiento_sla_en TIMESTAMPTZ,
    primera_respuesta_en TIMESTAMPTZ,
    resuelto_en TIMESTAMPTZ,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mensajes_ticket (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES tickets_soporte(id) ON DELETE CASCADE,
    tipo_remitente remitentes_mensaje NOT NULL,
    autor_admin_id BIGINT REFERENCES usuarios_superadmin(id) ON DELETE SET NULL,
    mensaje TEXT NOT NULL,
    es_nota_interna BOOLEAN NOT NULL DEFAULT FALSE,
    leido_en TIMESTAMPTZ,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =================================
--   TABLAS PARA EL ADMINISTRADOR
-- =================================

-- Seguridad

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    es_sistema BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tienda_id, nombre)
);

CREATE TABLE IF NOT EXISTS permisos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    nombre_visible TEXT NOT NULL,
    modulo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS roles_permisos (
    rol_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id BIGINT NOT NULL REFERENCES permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE IF NOT EXISTS usuarios_tienda (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    rol_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    correo CITEXT NOT NULL,
    hash_contrasena TEXT NOT NULL,
    tipo_doc tipos_documento NOT NULL,
    numero_doc TEXT NOT NULL,
    nombres_doc TEXT NOT NULL,
    telefono TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_acceso_en TIMESTAMPTZ,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    eliminado_en TIMESTAMPTZ,
    UNIQUE (tienda_id, correo),
    UNIQUE (tienda_id, numero_doc)
);

CREATE TABLE IF NOT EXISTS usuario_sedes (
    usuario_id BIGINT NOT NULL REFERENCES usuarios_tienda(id) ON DELETE CASCADE,
    sede_id BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    es_sede_principal BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (usuario_id, sede_id)
);

CREATE TABLE IF NOT EXISTS auditoria_usuarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id),
    usuario_id BIGINT REFERENCES usuarios_tienda(id),
    accion TEXT NOT NULL,
    entidad TEXT NOT NULL,
    entidad_id BIGINT,
    valores_anteriores JSONB,
    valores_nuevos JSONB,
    ip_origen INET,
    user_agent TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Catálogo

CREATE TABLE IF NOT EXISTS categorias (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    slug TEXT NOT NULL,
    descripcion TEXT,
    url_imagen TEXT,
    icono TEXT,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    orden_visual INTEGER DEFAULT 0,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tienda_id, nombre),
    UNIQUE (tienda_id, slug)
);

CREATE TABLE IF NOT EXISTS productos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    categoria_id BIGINT REFERENCES categorias(id) ON DELETE SET NULL,
    nombre TEXT NOT NULL,
    slug TEXT NOT NULL,
    sku TEXT NOT NULL,
    descripcion TEXT,
    tipo tipos_producto NOT NULL DEFAULT 'producto_terminado',
    es_personalizable BOOLEAN NOT NULL DEFAULT FALSE,
    precio_base_centimos BIGINT NOT NULL DEFAULT 0,
    precio_oferta_centimos BIGINT,
    visible_en_pos BOOLEAN NOT NULL DEFAULT TRUE,
    visible_en_storefront BOOLEAN NOT NULL DEFAULT TRUE,
    destacado_storefront BOOLEAN NOT NULL DEFAULT FALSE,
    url_imagen_principal TEXT,
    imagenes_galeria JSONB DEFAULT '[]',
    atributos JSONB DEFAULT '{}',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tienda_id, sku),
    UNIQUE (tienda_id, slug)
);

-- Compras e Insumos

CREATE TABLE IF NOT EXISTS insumos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    codigo_interno TEXT,
    unidad_base unidades_medida NOT NULL,
    unidad_compra_habitual unidades_medida NOT NULL,
    factor_conversion NUMERIC(12,4) DEFAULT 1,
    costo_promedio_unitario_centimos BIGINT DEFAULT 0,
    ultimo_precio_compra_centimos BIGINT,
    stock_actual_global NUMERIC(12,4) DEFAULT 0,
    stock_minimo_global NUMERIC(12,4) DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tienda_id, nombre)
);

CREATE TABLE IF NOT EXISTS proveedores (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    nombre_comercial TEXT NOT NULL,
    tipo_doc tipos_documento NOT NULL,
    numero_doc TEXT,
    razon_social TEXT,
    nombre_contacto TEXT,
    telefono_contacto TEXT,
    email_contacto TEXT,
    es_generico BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ordenes_compra (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_destino_id BIGINT NOT NULL REFERENCES sedes(id),
    proveedor_id BIGINT NOT NULL REFERENCES proveedores(id),
    fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_recepcion_esperada DATE,
    fecha_recepcion_real DATE,
    estado estados_orden_compra NOT NULL DEFAULT 'borrador',
    moneda CHAR(3) DEFAULT 'PEN',
    total_compra_centimos BIGINT NOT NULL DEFAULT 0,
    metodo_pago metodos_pago_compra,
    referencia_pago TEXT NULL,
    tipo_comprobante_proveedor tipos_comprobante,
    serie_comprobante_proveedor TEXT NULL,
    numero_comprobante_proveedor TEXT NULL,
    url_foto_comprobante TEXT NULL,
    observaciones TEXT NULL,
    registrado_por BIGINT REFERENCES usuarios_tienda(id),
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS detalles_orden_compra (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    orden_compra_id BIGINT NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    insumo_id BIGINT NOT NULL REFERENCES insumos(id),
    cantidad_solicitada NUMERIC(12,4) NOT NULL,
    unidad_compra unidades_medida NOT NULL,
    costo_unitario_pactado_centimos BIGINT NOT NULL,
    total_linea_centimos BIGINT NOT NULL,
    cantidad_recibida NUMERIC(12,4) DEFAULT 0,
    recibido_completo BOOLEAN DEFAULT FALSE
);

-- Clientes

CREATE TABLE IF NOT EXISTS clientes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    tipo_doc tipos_documento,
    numero_doc TEXT,
    nombre_doc TEXT NOT NULL,
    email CITEXT,
    telefono TEXT,
    es_usuario_virtual BOOLEAN NOT NULL DEFAULT FALSE,
    hash_contrasena TEXT,
    notas TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tienda_id, tipo_doc, numero_doc),
    UNIQUE (tienda_id, email)
);

CREATE TABLE IF NOT EXISTS direcciones_cliente (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    etiqueta TEXT,
    direccion_completa TEXT NOT NULL,
    referencia TEXT,
    distrito_id BIGINT REFERENCES ubigeo_distritos(id) ON DELETE SET NULL,
    codigo_postal TEXT,
    es_fiscal BOOLEAN DEFAULT FALSE,
    es_entrega BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Ventas (POS y Storefront)

CREATE TABLE IF NOT EXISTS cajas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sesiones_caja (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    caja_id BIGINT NOT NULL REFERENCES cajas(id),
    usuario_apertura_id BIGINT NOT NULL REFERENCES usuarios_tienda(id),
    usuario_cierre_id BIGINT REFERENCES usuarios_tienda(id),
    monto_inicial_centimos BIGINT NOT NULL,
    monto_final_esperado_centimos BIGINT,
    monto_final_real_centimos BIGINT,
    diferencia_centimos INT GENERATED ALWAYS AS (monto_final_real_centimos - monto_final_esperado_centimos) STORED,
    fecha_apertura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_cierre TIMESTAMPTZ,
    esta_abierta BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_pedido TEXT NOT NULL,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_origen_id BIGINT NOT NULL REFERENCES sedes(id),
    cliente_id BIGINT REFERENCES clientes(id) ON DELETE SET NULL,
    origen origenes_pedido NOT NULL,
    sesion_caja_id BIGINT REFERENCES sesiones_caja(id),
    vendedor_id BIGINT REFERENCES usuarios_tienda(id),
    estado_pedido estados_pedido NOT NULL DEFAULT 'pendiente_pago',
    estado_pago estados_pago_pedido NOT NULL DEFAULT 'pendiente',
    tipo_entrega tipos_entrega NOT NULL DEFAULT 'recojo_tienda',
    fecha_entrega_pactada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    direccion_entrega TEXT,
    costo_delivery_centimos BIGINT DEFAULT 0,
    moneda CHAR(3) DEFAULT 'PEN',
    subtotal_items_centimos BIGINT NOT NULL DEFAULT 0,
    descuento_total_centimos BIGINT NOT NULL DEFAULT 0,
    impuestos_totales_centimos BIGINT NOT NULL DEFAULT 0,
    total_final_centimos BIGINT NOT NULL,
    monto_pagado_centimos BIGINT NOT NULL DEFAULT 0,
    saldo_pendiente_centimos INT GENERATED ALWAYS AS (total_final_centimos - monto_pagado_centimos) STORED,
    requiere_comprobante BOOLEAN DEFAULT TRUE,
    tipo_comprobante tipos_comprobante,
    serie_comprobante TEXT,
    numero_comprobante TEXT,
    notas_pedido TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tienda_id, codigo_pedido)
);

CREATE TABLE IF NOT EXISTS direcciones_pedido (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    tipo_direccion TEXT NOT NULL CHECK (tipo_direccion IN ('facturacion', 'envio')),
    nombre_contacto TEXT NOT NULL,
    tipo_doc_contacto tipos_documento,
    numero_doc_contacto TEXT,
    telefono_contacto TEXT NOT NULL,
    email_contacto TEXT,
    direccion_completa TEXT NOT NULL,
    referencia TEXT,
    distrito TEXT,
    provincia TEXT,
    departamento TEXT,
    codigo_ubigeo CHAR(6),
    codigo_postal TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS detalles_pedido (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario_centimos BIGINT NOT NULL,
    subtotal_linea_centimos BIGINT NOT NULL,
    notas_item TEXT
);

CREATE TABLE IF NOT EXISTS pagos_pedido (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    sesion_caja_id BIGINT REFERENCES sesiones_caja(id),
    monto_pagado_centimos BIGINT NOT NULL,
    metodo_pago metodos_pago NOT NULL,
    referencia_externa TEXT,
    fecha_pago TIMESTAMPTZ DEFAULT NOW(),
    registrado_por BIGINT REFERENCES usuarios_tienda(id)
);

CREATE TABLE IF NOT EXISTS personalizaciones_item_pedido (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    detalle_pedido_id BIGINT NOT NULL REFERENCES detalles_pedido(id) ON DELETE CASCADE,
    descripcion_solicitud TEXT NOT NULL,
    texto_dedicatoria TEXT,
    imagenes_referencia JSONB DEFAULT '[]',
    sabor_masa TEXT,
    sabor_relleno TEXT,
    tematica TEXT,
    fecha_limite_produccion TIMESTAMPTZ,
    costo_extra_personalizacion_centimos BIGINT DEFAULT 0,
    UNIQUE (detalle_pedido_id)
);

CREATE TABLE IF NOT EXISTS movimientos_caja (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sesion_caja_id BIGINT NOT NULL REFERENCES sesiones_caja(id),
    tipo_movimiento tipos_movimiento_caja NOT NULL,
    monto_centimos BIGINT NOT NULL,
    metodo_pago metodos_pago,
    pedido_id BIGINT REFERENCES pedidos(id),
    concepto TEXT,
    comprobante_asociado TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Producción

CREATE TABLE IF NOT EXISTS recetas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    insumo_id BIGINT NOT NULL REFERENCES insumos(id) ON DELETE RESTRICT,
    cantidad_requerida NUMERIC(12,4) NOT NULL,
    unidad_medida unidades_medida NOT NULL,
    notas_preparacion TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (producto_id, insumo_id)
);

CREATE TABLE IF NOT EXISTS stock_ideal (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad_ideal INTEGER NOT NULL DEFAULT 0,
    punto_reposicion INTEGER DEFAULT 0,
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (sede_id, producto_id)
);

CREATE TABLE IF NOT EXISTS conteos_diarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    fecha_conteo DATE NOT NULL DEFAULT CURRENT_DATE,
    responsable_id BIGINT REFERENCES usuarios_tienda(id),
    observaciones TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (sede_id, fecha_conteo)
);

CREATE TABLE IF NOT EXISTS detalle_conteo_diario (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conteo_id BIGINT NOT NULL REFERENCES conteos_diarios(id) ON DELETE CASCADE,
    producto_id BIGINT NOT NULL REFERENCES productos(id),
    cantidad_fisica INTEGER NOT NULL DEFAULT 0,
    cantidad_sistema INTEGER,
    diferencia INTEGER GENERATED ALWAYS AS (cantidad_fisica - COALESCE(cantidad_sistema, cantidad_fisica)) STORED
);

CREATE TABLE IF NOT EXISTS planes_produccion (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    fecha_produccion DATE NOT NULL DEFAULT CURRENT_DATE,
    estado estados_plan_produccion NOT NULL DEFAULT 'borrador',
    generado_por BIGINT REFERENCES usuarios_tienda(id),
    confirmado_por BIGINT REFERENCES usuarios_tienda(id),
    hora_inicio_real TIMESTAMPTZ,
    hora_fin_real TIMESTAMPTZ,
    notas_maestro TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (sede_id, fecha_produccion)
);

CREATE TABLE IF NOT EXISTS detalles_plan_produccion (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plan_id BIGINT NOT NULL REFERENCES planes_produccion(id) ON DELETE CASCADE,
    producto_id BIGINT NOT NULL REFERENCES productos(id),
    origen origenes_produccion NOT NULL DEFAULT 'stock_diario',
    pedido_cliente_id BIGINT REFERENCES pedidos(id) ON DELETE SET NULL,
    detalle_pedido_id BIGINT REFERENCES detalles_pedido(id) ON DELETE SET NULL,
    es_personalizado BOOLEAN NOT NULL DEFAULT FALSE,
    personalizacion_id BIGINT REFERENCES personalizaciones_item_pedido(id) ON DELETE SET NULL,
    cantidad_sugerida INTEGER NOT NULL,
    cantidad_planificada INTEGER NOT NULL,
    cantidad_producida INTEGER DEFAULT 0,
    cantidad_merma INTEGER DEFAULT 0,
    estado estados_item_produccion NOT NULL DEFAULT 'pendiente',
    hora_termino TIMESTAMPTZ,
    observaciones TEXT
);

-- Inventario

CREATE TABLE IF NOT EXISTS inventario_insumos_sedes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    insumo_id BIGINT NOT NULL REFERENCES insumos(id) ON DELETE CASCADE,
    cantidad_actual NUMERIC(12,4) NOT NULL DEFAULT 0,
    ubicacion_fisica TEXT,
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (sede_id, insumo_id)
);

CREATE TABLE IF NOT EXISTS inventario_productos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad_actual INTEGER NOT NULL DEFAULT 0,
    ubicacion_fisica TEXT,
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (sede_id, producto_id)
);

CREATE TABLE IF NOT EXISTS transferencias_inventario (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id),
    sede_origen_id BIGINT NOT NULL REFERENCES sedes(id),
    sede_destino_id BIGINT NOT NULL REFERENCES sedes(id),
    estado TEXT NOT NULL DEFAULT 'pendiente',
    solicitado_por BIGINT REFERENCES usuarios_tienda(id),
    autorizado_por BIGINT REFERENCES usuarios_tienda(id),
    recibido_por BIGINT REFERENCES usuarios_tienda(id),
    fecha_solicitud TIMESTAMPTZ DEFAULT NOW(),
    fecha_envio TIMESTAMPTZ,
    fecha_recepcion TIMESTAMPTZ,
    observaciones TEXT
);

CREATE TABLE IF NOT EXISTS items_transferencia (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    transferencia_id BIGINT NOT NULL REFERENCES transferencias_inventario(id),
    insumo_id BIGINT REFERENCES insumos(id),
    producto_id BIGINT REFERENCES productos(id),
    cantidad_enviada NUMERIC(12,4) NOT NULL,
    cantidad_recibida NUMERIC(12,4),
    CHECK ((insumo_id IS NOT NULL AND producto_id IS NULL) OR (insumo_id IS NULL AND producto_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS movimientos_inventario_insumos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id),
    sede_id BIGINT NOT NULL REFERENCES sedes(id),
    insumo_id BIGINT NOT NULL REFERENCES insumos(id),
    tipo_movimiento TEXT NOT NULL,
    cantidad NUMERIC(12,4) NOT NULL,
    cantidad_anterior NUMERIC(12,4) NOT NULL,
    cantidad_posterior NUMERIC(12,4) NOT NULL,
    orden_compra_id BIGINT REFERENCES ordenes_compra(id),
    plan_produccion_id BIGINT REFERENCES planes_produccion(id),
    transferencia_id BIGINT REFERENCES transferencias_inventario(id),
    motivo TEXT,
    responsable_id BIGINT REFERENCES usuarios_tienda(id),
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS movimientos_inventario_productos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id),
    sede_id BIGINT NOT NULL REFERENCES sedes(id),
    producto_id BIGINT NOT NULL REFERENCES productos(id),
    tipo_movimiento TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    cantidad_anterior INTEGER NOT NULL,
    cantidad_posterior INTEGER NOT NULL,
    pedido_id BIGINT REFERENCES pedidos(id),
    plan_produccion_id BIGINT REFERENCES planes_produccion(id),
    motivo motivos_movimiento NOT NULL,
    responsable_id BIGINT REFERENCES usuarios_tienda(id),
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Facturación Tienda

CREATE TABLE IF NOT EXISTS tienda_series (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    tipo_comprobante tipos_comprobante NOT NULL,
    serie CHAR(4) NOT NULL,
    correlativo_actual INTEGER NOT NULL DEFAULT 0,
    es_electronica BOOLEAN DEFAULT TRUE,
    activa BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tienda_id, serie)
);

CREATE TABLE IF NOT EXISTS tienda_comprobantes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE RESTRICT,
    serie_id BIGINT NOT NULL REFERENCES tienda_series(id) ON DELETE RESTRICT,
    emisor_razon_social TEXT NOT NULL,
    emisor_ruc TEXT NOT NULL,
    emisor_direccion TEXT NOT NULL,
    cliente_tipo_doc tipos_documento NOT NULL,
    cliente_numero_doc TEXT NOT NULL,
    cliente_nombre TEXT NOT NULL,
    cliente_direccion TEXT,
    tipo_comprobante tipos_comprobante NOT NULL,
    correlativo INTEGER NOT NULL,
    fecha_emision TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    moneda CHAR(3) DEFAULT 'PEN',
    total_gravado_centimos BIGINT NOT NULL DEFAULT 0,
    total_inafecto_centimos BIGINT NOT NULL DEFAULT 0,
    total_exonerado_centimos BIGINT NOT NULL DEFAULT 0,
    total_igv_centimos BIGINT NOT NULL DEFAULT 0,
    total_impuestos_bolsa_centimos BIGINT NOT NULL DEFAULT 0,
    total_importe_centimos BIGINT NOT NULL,
    estado_sunat estados_sunat NOT NULL DEFAULT 'pendiente',
    codigo_hash_cpe TEXT,
    xml_firmado_url TEXT,
    cdr_sunat_url TEXT,
    representacion_impresa_url TEXT,
    respuesta_sunat_codigo TEXT,
    respuesta_sunat_descripcion TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tipo_comprobante, correlativo)
);

-- Configuración

CREATE TABLE IF NOT EXISTS configuracion_tienda (
    tienda_id BIGINT PRIMARY KEY REFERENCES tiendas(id) ON DELETE CASCADE,
    ruc TEXT,
    razon_social TEXT,
    direccion_fiscal TEXT,
    ubigeo_fiscal CHAR(6) REFERENCES ubigeo_distritos(codigo_ubigeo),
    usuario_sunat_sol TEXT,
    clave_sunat_sol_encriptada TEXT,
    certificado_digital_url TEXT,
    modo_sunat TEXT DEFAULT 'pruebas',
    tasa_igv NUMERIC(5,2) DEFAULT 18.00,
    api_key_yape TEXT,
    api_key_plin TEXT,
    merchant_id_niubiz TEXT,
    banner_principal_url TEXT,
    mensaje_bienvenida TEXT,
    horario_atencion JSONB,
    redes_sociales JSONB,
    politicas_envio TEXT,
    politicas_devolucion TEXT,
    email_notificaciones CITEXT,
    telegram_bot_token TEXT,
    telegram_chat_id TEXT,
    actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- CMS

CREATE TABLE IF NOT EXISTS paginas_storefront (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    meta_descripcion TEXT,  
    orden_menu INTEGER DEFAULT 0,
    visible_en_menu BOOLEAN DEFAULT TRUE,
    activa BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tienda_id, slug)
);

