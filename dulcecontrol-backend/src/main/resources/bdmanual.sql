CREATE DATABASE IF NOT EXISTS dulcecontrol_db;
-- \c dulcecontrol_db -- (Comando psql para conectar a la base si ejecutas por consola)

CREATE SCHEMA IF NOT EXISTS dulce_control;
SET search_path_to dulce_control, public;

-- =================================
--              ENUMS
-- =================================

-- GLOBALES
CREATE TYPE tipos_documento AS ENUM ('DNI', 'RUC', 'CE', 'PASAPORTE');
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

CREATE TYPE roles_admin AS ENUM ('administrador', 'soporte', 'contador', 'vendedor', 'comprador');

-- =================================
--    TABLAS GEOGRÁFICAS (UBIGEO)
-- =================================

CREATE TABLE IF NOT EXISTS ubigeo_departamentos (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre          TEXT NOT NULL,
  codigo_ubigeo   CHAR(2) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ubigeo_provincias (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  departamento_id BIGINT NOT NULL REFERENCES ubigeo_departamentos(id) ON DELETE RESTRICT,
  nombre          TEXT NOT NULL,
  codigo_ubigeo   CHAR(4) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ubigeo_distritos (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  provincia_id    BIGINT NOT NULL REFERENCES ubigeo_provincias(id) ON DELETE RESTRICT,
  nombre          TEXT NOT NULL,
  codigo_ubigeo   CHAR(6) NOT NULL UNIQUE
);

-- =================================
-- TABLAS PARA EL SUPERADMINISTRADOR
-- =================================

-- Seguridad
CREATE TABLE IF NOT EXISTS usuarios_superadmin (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    correo              CITEXT NOT NULL UNIQUE,
    hash_contrasena     TEXT NOT NULL,
    tipo_doc            tipos_documento NOT NULL,
    numero_doc          TEXT NULL,
    nombres_doc         TEXT NULL,
    telefono            TEXT NULL,
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_en        TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS actividad_superadmin (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    admin_id            BIGINT NULL REFERENCES usuarios_superadmin(id) ON DELETE SET NULL,
    tipo_evento         TEXT NOT NULL, -- Ej: 'tienda_suspendida', 'plan_creado', 'reembolso_emitido'
    ip_origen           INET NULL,
    detalles            JSONB NULL, -- Guardar ID de entidad afectada, valores anteriores/nuevos
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tiendas

CREATE TABLE IF NOT EXISTS tiendas (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug                TEXT NOT NULL,
    tipo_doc            tipos_documento NOT NULL,
    numero_doc          TEXT NOT NULL UNIQUE,
    nombre_doc          TEXT NOT NULL, -- Nombre legal para facturación (Razón social o Nombre completo)
    nombre_comercial    TEXT NULL,     -- Nombre "marketing" de la panadería
    correo_contacto     CITEXT NOT NULL,
    telefono_contacto   TEXT NULL,
    hash_contrasena     TEXT NOT NULL,
    estado              estados_tienda NOT NULL DEFAULT 'en_prueba',
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_en        TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS sedes (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    codigo_interno      TEXT NULL,
    nombre              TEXT NOT NULL,
    direccion           TEXT NOT NULL,
    telefono            TEXT NULL,
    distrito_id         BIGINT NULL REFERENCES ubigeo_distritos(id) ON DELETE SET NULL,
    es_principal        BOOLEAN NOT NULL DEFAULT FALSE,
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_en        TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS dominios_tienda (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    tipo                tipos_dominio NOT NULL DEFAULT 'tienda_virtual',
    url_dominio         TEXT NOT NULL UNIQUE,
    url_logo            TEXT NULL, 
    url_favicon         TEXT NULL, 
    color_primario      CHAR(7) NOT NULL DEFAULT '#000000',
    color_secundario    CHAR(7) NOT NULL DEFAULT '#ffffff',
    
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Planes y suscripciones

CREATE TABLE IF NOT EXISTS planes (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo                  TEXT NOT NULL UNIQUE,
    nombre                  TEXT NOT NULL,
    descripcion             TEXT NULL,
    precio_mensual_centimos BIGINT NOT NULL, -- Estandarizado a céntimos
    precio_anual_centimos   BIGINT NOT NULL,
    moneda                  CHAR(3) NOT NULL DEFAULT 'PEN',
    limites                 JSONB NOT NULL DEFAULT '{}', -- Ej: {"max_sedes": 2, "max_usuarios": 5}
    activo                  BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suscripciones (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id               BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE RESTRICT,
    plan_id                 BIGINT NOT NULL REFERENCES planes(id) ON DELETE RESTRICT,
    ciclo                   ciclos_plan NOT NULL DEFAULT 'mensual',
    precio_pactado_centimos BIGINT NOT NULL, -- El precio al que firmaron (por si luego subes el plan)
    fecha_inicio            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_fin               TIMESTAMPTZ NOT NULL, -- Cuándo vence el pago actual
    estado                  estados_suscripcion NOT NULL DEFAULT 'en_prueba',
    autorenovar             BOOLEAN NOT NULL DEFAULT TRUE,
    cancelado_en            TIMESTAMPTZ NULL,
    creado_en               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS historial_suscripciones (
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    suscripcion_id          BIGINT NOT NULL REFERENCES suscripciones(id) ON DELETE CASCADE,
    plan_anterior_id        BIGINT NULL REFERENCES planes(id), -- NULL si es un alta nueva
    plan_nuevo_id           BIGINT NOT NULL REFERENCES planes(id),
    tipo_movimiento         tipos_movimiento_suscripcion NOT NULL,
    precio_anterior_centimos BIGINT NULL,
    precio_nuevo_centimos   BIGINT NOT NULL,
    fecha_movimiento        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    usuario_responsable_id  BIGINT NULL -- Quién hizo el cambio (puede ser un superadmin o el mismo cliente si tuvieras su ID)
);

-- Facturación

CREATE TABLE IF NOT EXISTS series (
    id                  SERIAL PRIMARY KEY,
    tipos_comprobante    tipos_comprobante NOT NULL,
    serie               CHAR(4) NOT NULL UNIQUE,
    ultimo_correlativo  INTEGER NOT NULL DEFAULT 0,
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    es_predeterminada   BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comprobantes (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    referencia_id       BIGINT REFERENCES comprobantes(id) ON DELETE SET NULL, -- Para notas de crédito/débito
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE RESTRICT,
    suscripcion_id      BIGINT NULL REFERENCES suscripciones(id) ON DELETE SET NULL,    
    
    -- Estado del cobro interno
    estado_pago         estados_pago_comprobante NOT NULL DEFAULT 'pendiente',    

    -- Datos Fiscales SUNAT
    tipos_comprobante    tipos_comprobante NOT NULL,
    serie               CHAR(4) NOT NULL,
    correlativo         INTEGER NOT NULL,
    fecha_emision       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Snapshot del cliente (Requisito SUNAT: guardar a quién se emitió en ese momento)
    cliente_tipo_doc    tipos_documento NOT NULL, 
    cliente_num_doc     TEXT NOT NULL,
    cliente_nombre_doc  TEXT NOT NULL, -- Razón social o nombres
    cliente_direccion   TEXT NULL,

    -- Montos (Todo en CENTAVOS)
    moneda              CHAR(3) NOT NULL DEFAULT 'PEN',
    total_gravado_centimos BIGINT NOT NULL DEFAULT 0,
    total_igv_centimos     BIGINT NOT NULL DEFAULT 0,
    total_importe_centimos BIGINT NOT NULL,

    -- Control SUNAT
    estados_sunat        estados_sunat NOT NULL DEFAULT 'pendiente',
    codigo_error_sunat  TEXT,
    respuesta_sunat     TEXT,
    url_xml             TEXT,
    url_cdr             TEXT,
    url_pdf             TEXT,

    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (tipos_comprobante, serie, correlativo)
);

CREATE TABLE IF NOT EXISTS detalles_comprobante (
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comprobante_id              BIGINT NOT NULL REFERENCES comprobantes(id) ON DELETE CASCADE,
    descripcion                 TEXT NOT NULL,
    cantidad                    INTEGER NOT NULL DEFAULT 1,
    valor_unitario_centimos     BIGINT NOT NULL, -- Sin IGV
    precio_unitario_centimos    BIGINT NOT NULL, -- Con IGV
    igv_item_centimos           BIGINT NOT NULL,
    total_item_centimos         BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS transacciones_pago (
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id                   BIGINT NOT NULL REFERENCES tiendas(id),
    comprobante_id              BIGINT NOT NULL REFERENCES comprobantes(id), -- La factura que intenta pagar
    pasarela                    TEXT NOT NULL, -- Stripe
    id_transaccion_pasarela     TEXT,
    monto_centimos              BIGINT NOT NULL,
    moneda                      CHAR(3) NOT NULL DEFAULT 'PEN',
    estado                      estados_transaccion NOT NULL DEFAULT 'pendiente',
    codigo_error                TEXT,
    mensaje_error               TEXT,
    metadata_pasarela           JSONB,
    creado_en                   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Soporte

CREATE TABLE IF NOT EXISTS tickets_soporte (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE RESTRICT,
    asignado_a_id       BIGINT NULL REFERENCES usuarios_superadmin(id) ON DELETE SET NULL,
    asunto              TEXT NOT NULL,
    prioridad           prioridades_ticket NOT NULL DEFAULT 'media',
    estado              estados_ticket NOT NULL DEFAULT 'abierto',
    vencimiento_sla_en  TIMESTAMPTZ NULL,
    primera_respuesta_en TIMESTAMPTZ NULL,
    resuelto_en         TIMESTAMPTZ NULL,
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mensajes_ticket (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id           BIGINT NOT NULL REFERENCES tickets_soporte(id) ON DELETE CASCADE,
    tipo_remitente      remitentes_mensaje NOT NULL,
    -- ID del autor: Puede ser NULL si es un mensaje automático del sistema
    autor_admin_id      BIGINT NULL REFERENCES usuarios_superadmin(id) ON DELETE SET NULL,
    -- NOTA: En un sistema real, aquí también iría un `autor_usuario_tienda_id`
    
    mensaje             TEXT NOT NULL,
    es_nota_interna     BOOLEAN NOT NULL DEFAULT FALSE,
    leido_en            TIMESTAMPTZ NULL,
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =================================
--   TABLAS PARA EL ADMINISTRADOR
-- =================================

-- Seguridad
CREATE TABLE IF NOT EXISTS usuarios_admin (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    correo              CITEXT NOT NULL,
    hash_contrasena     TEXT NOT NULL,
    tipo_doc            tipos_documento NOT NULL,
    numero_doc          TEXT NOT NULL,
    nombres_doc         TEXT NOT NULL,
    telefono            TEXT NULL,
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    eliminado_en        TIMESTAMPTZ NULL,
);