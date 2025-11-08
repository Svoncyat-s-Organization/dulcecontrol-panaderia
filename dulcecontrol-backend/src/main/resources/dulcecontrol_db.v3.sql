CREATE DATABASE IF NOT EXISTS dulcecontrol_db;
-- \c dulcecontrol_db -- (Comando psql para conectar a la base si ejecutas por consola)

CREATE SCHEMA IF NOT EXISTS dulce_control;
SET search_path TO dulce_control, public;

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

CREATE TYPE estados_plan_produccion AS ENUM ('borrador', 'confirmado', 'en_proceso', 'finalizado', 'cancelado');
CREATE TYPE estados_item_produccion AS ENUM ('pendiente', 'en_horno', 'terminado', 'merma');
CREATE TYPE origenes_produccion AS ENUM ('stock_diario', 'pedido_cliente');
CREATE TYPE tipos_producto AS ENUM ('producto_terminado', 'insumo_venta', 'servicio');
CREATE TYPE estados_orden_compra AS ENUM ('borrador', 'enviada', 'recibida_parcial', 'recibida_total', 'cancelada');
CREATE TYPE metodos_pago_compra AS ENUM ('efectivo', 'transferencia', 'credito', 'tarjeta');
CREATE TYPE unidades_medida AS ENUM ('unidad', 'kg', 'g', 'l', 'ml', 'paquete', 'saco', 'lata');
CREATE TYPE estados_pedido AS ENUM ('pendiente_pago', 'pagado', 'en_preparacion', 'listo_entrega', 'entregado', 'cancelado', 'devuelto');
CREATE TYPE origenes_pedido AS ENUM ('pos_local', 'storefront_online', 'telefono');
CREATE TYPE tipos_entrega AS ENUM ('recojo_tienda', 'delivery', 'consumo_local');
CREATE TYPE metodos_pago AS ENUM ('efectivo', 'yape', 'plin', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'pasarela_online');
CREATE TYPE estados_pago_pedido AS ENUM ('pendiente', 'parcial', 'pagado_total', 'reembolsado');


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

CREATE TABLE IF NOT EXISTS roles (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id   BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    nombre      TEXT NOT NULL,
    descripcion TEXT,
    es_sistema  BOOLEAN DEFAULT FALSE,
    creado_en   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tienda_id, nombre)
);

CREATE TABLE IF NOT EXISTS permisos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE, -- Clave técnica: 'pedido:crear'
    nombre_visible TEXT NOT NULL, -- Para mostrar al usuario: "Crear Pedidos"
    modulo TEXT NOT NULL -- Para agrupar en la UI: "Ventas", "Producción"
);

CREATE TABLE IF NOT EXISTS roles_permisos (
    rol_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id BIGINT NOT NULL REFERENCES permisos(id) ON DELETE CASCADE,
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE IF NOT EXISTS usuarios_tienda (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    rol_id              BIGINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    correo              CITEXT NOT NULL,
    hash_contrasena     TEXT NOT NULL,
    tipo_doc            tipos_documento NOT NULL,
    numero_doc          TEXT NOT NULL,
    nombres_doc         TEXT NOT NULL,
    telefono            TEXT NULL,
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_acceso_en    TIMESTAMPTZ,
    creado_en           TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ DEFAULT NOW(),
    eliminado_en        TIMESTAMPTZ,
    UNIQUE(tienda_id, correo)
);

CREATE TABLE IF NOT EXISTS usuario_sedes (
    usuario_id          BIGINT NOT NULL REFERENCES usuarios_tienda(id) ON DELETE CASCADE,
    sede_id             BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    es_sede_principal   BOOLEAN DEFAULT FALSE, -- Para seleccionarla por defecto al login
    PRIMARY KEY (usuario_id, sede_id)
);

CREATE TABLE IF NOT EXISTS auditoria_usuarios (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id),
    usuario_id          BIGINT REFERENCES usuarios_tienda(id),    
    accion              TEXT NOT NULL, -- 'pedido_creado', 'producto_editado', 'usuario_desactivado'
    entidad             TEXT NOT NULL, -- 'pedido', 'producto', 'usuario'
    entidad_id          BIGINT,
    valores_anteriores  JSONB, -- Estado antes del cambio
    valores_nuevos      JSONB, -- Estado después del cambio
    ip_origen           INET,
    user_agent          TEXT,
    creado_en           TIMESTAMPTZ DEFAULT NOW()
);

-- Compras

CREATE TABLE IF NOT EXISTS insumos (
    id                                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id                           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    nombre                              TEXT NOT NULL,
    codigo_interno                      TEXT, 
    unidad_base                         unidades_medida NOT NULL, -- Ej: 'g' (gramos) para uso en recetas
    unidad_compra_habitual              unidades_medida NOT NULL, -- Ej: 'saco' de 50kg
    factor_conversion                   NUMERIC(12,4) DEFAULT 1, -- Cuántas unidades base tiene la de compra (Ej: 50000 si es saco de 50kg a gramos)
    costo_promedio_unitario_centimos    BIGINT DEFAULT 0, -- Costo por unidad base (ej. costo por gramo)
    ultimo_precio_compra_centimos       BIGINT,    
    stock_actual_global                 NUMERIC(12,4) DEFAULT 0,
    stock_minimo_global                 NUMERIC(12,4) DEFAULT 0, -- Alerta de reabastecimiento
    activo                              BOOLEAN DEFAULT TRUE,
    creado_en                           TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tienda_id, nombre)
);

CREATE TABLE IF NOT EXISTS proveedores (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    nombre_comercial    TEXT NOT NULL, -- "Distribuidora Nicolini" o "Mercado Central"
    tipo_doc            tipos_documento NOT NULL,
    numero_doc          TEXT, -- RUC del proveedor
    razon_social        TEXT,
    nombre_contacto     TEXT,
    telefono_contacto   TEXT,
    email_contacto      TEXT,
    es_generico         BOOLEAN DEFAULT FALSE, -- TRUE para "Mercado Local" (no pide RUC obligatorio)
    activo              BOOLEAN DEFAULT TRUE,
    creado_en           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ordenes_compra (
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id                   BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_destino_id             BIGINT NOT NULL REFERENCES sedes(id), -- Dónde llegará la mercadería
    proveedor_id                BIGINT NOT NULL REFERENCES proveedores(id),

    fecha_emision               DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_recepcion_esperada    DATE,
    fecha_recepcion_real        DATE,

    estado                      estados_orden_compra NOT NULL DEFAULT 'borrador',

    -- Datos Financieros
    moneda                        CHAR(3) DEFAULT 'PEN',
    total_compra_centimos         BIGINT NOT NULL DEFAULT 0,
    metodo_pago                   metodos_pago_compra,
    referencia_pago               TEXT NOT NULL, -- Nro de operación bancaria o "Efectivo caja chica"

    -- Documento Sustento (Factura que te da el proveedor)
    tipo_comprobante_proveedor    tipos_comprobante, 
    serie_comprobante_proveedor   TEXT NOT NULL,
    numero_comprobante_proveedor  TEXT NOT NULL,
    url_foto_comprobante          TEXT NOT NULL, -- Foto de la boleta del mercado
    observaciones                 TEXT NOT NULL,
    registrado_por                BIGINT REFERENCES usuarios_tienda(id),

    creado_en                     TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en                TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS detalles_orden_compra (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    orden_compra_id BIGINT NOT NULL REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    insumo_id BIGINT NOT NULL REFERENCES insumos(id),
    
    cantidad_solicitada NUMERIC(12,4) NOT NULL, -- Ej: 10 (sacos)
    unidad_compra unidades_medida NOT NULL, -- Ej: 'saco'
    
    costo_unitario_pactado_centimos BIGINT NOT NULL, -- Cuánto costó cada saco
    total_linea_centimos BIGINT NOT NULL,
    
    cantidad_recibida NUMERIC(12,4) DEFAULT 0, -- Lo que realmente llegó (para recepciones parciales)
    
    recibido_completo BOOLEAN DEFAULT FALSE -- Check rápido para no contar decimales
);

-- Producción

CREATE TABLE IF NOT EXISTS recetas (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    producto_id         BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    insumo_id           BIGINT NOT NULL REFERENCES insumos(id) ON DELETE RESTRICT,
    cantidad_requerida  NUMERIC(12,4) NOT NULL, -- Ej: 0.250 (para 250g de harina)
    unidad_medida       unidades_medida NOT NULL, -- Debe coincidir con la unidad base del insumo (kg, lt, und)
    notas_preparacion   TEXT, -- "Tamizar antes de mezclar"
    creado_en           TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(producto_id, insumo_id) -- Un insumo solo aparece una vez por receta
);

CREATE TABLE IF NOT EXISTS stock_ideal (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id             BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    producto_id         BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad_ideal      INTEGER NOT NULL DEFAULT 0, -- El objetivo diario. Ej: 50 croissants.
    punto_reposicion    INTEGER DEFAULT 0, -- Alerta si baja de este nivel
    actualizado_en      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sede_id, producto_id)
);

CREATE TABLE IF NOT EXISTS conteos_diarios (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id       BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id         BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    fecha_conteo    DATE NOT NULL DEFAULT CURRENT_DATE,
    responsable_id  BIGINT REFERENCES usuarios_tienda(id),
    observaciones   TEXT, -- "Sobraron muchos panes por lluvia ayer"
    creado_en       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sede_id, fecha_conteo) -- Solo un conteo matutino por sede por día
);

CREATE TABLE IF NOT EXISTS detalle_conteo_diario (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conteo_id           BIGINT NOT NULL REFERENCES conteos_diarios(id) ON DELETE CASCADE,
    producto_id         BIGINT NOT NULL REFERENCES productos(id),
    cantidad_fisica     INTEGER NOT NULL DEFAULT 0, -- Lo que realmente encontraron
    cantidad_sistema    INTEGER, -- Lo que el sistema creía que había, para calcular mermas desconocidas
    diferencia          GENERATED ALWAYS AS (cantidad_fisica - COALESCE(cantidad_sistema, cantidad_fisica)) STORED
);

CREATE TABLE IF NOT EXISTS planes_produccion (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id             BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    fecha_produccion    DATE NOT NULL DEFAULT CURRENT_DATE,
    estado              estados_plan_produccion NOT NULL DEFAULT 'borrador',

    generado_por        BIGINT REFERENCES usuarios_tienda(id), -- Quién corrió el proceso automático
    confirmado_por      BIGINT REFERENCES usuarios_tienda(id), -- Maestro panadero que dio el OK

    hora_inicio_real    TIMESTAMPTZ,
    hora_fin_real       TIMESTAMPTZ,
    notas_maestro       TEXT, -- "Horno 2 está fallando, priorizar Horno 1"

    creado_en           TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sede_id, fecha_produccion)
);

CREATE TABLE IF NOT EXISTS detalles_plan_produccion (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plan_id             BIGINT NOT NULL REFERENCES planes_produccion(id) ON DELETE CASCADE,
    producto_id         BIGINT NOT NULL REFERENCES productos(id),

    -- Trazabilidad: ¿Por qué producimos esto?
    origen              origenes_produccion NOT NULL DEFAULT 'stock_diario',
    pedido_cliente_id   BIGINT REFERENCES pedidos(id) ON DELETE SET NULL, -- FK a tabla pedidos (si viene de un encargo específico)
    
    -- Cantidades
    cantidad_sugerida   INTEGER NOT NULL, -- Lo que calculó el sistema
    cantidad_planificada INTEGER NOT NULL, -- Lo que confirmó el maestro panadero (puede ajustar)
    cantidad_producida  INTEGER DEFAULT 0, -- Lo que realmente salió bien del horno
    cantidad_merma      INTEGER DEFAULT 0, -- Se quemaron, se cayeron al piso, etc.

    estado              estados_item_produccion NOT NULL DEFAULT 'pendiente',
    hora_termino        TIMESTAMPTZ, -- Para saber a qué hora estuvo listo el pan caliente
    observaciones       TEXT -- "Cliente lo quiere muy tostado" (si viene de pedido)
);

-- Catálogo
CREATE TABLE IF NOT EXISTS categorias (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    nombre              TEXT NOT NULL,
    slug                TEXT NOT NULL, -- Para URL amigable: mi-tienda.com/categoria/tortas-heladas
    descripcion         TEXT,
    url_imagen          TEXT, -- Foto de portada de la categoría para el storefront
    icono               TEXT, -- Nombre de icono (ej. 'cake-icon') para POS
    activa              BOOLEAN NOT NULL DEFAULT TRUE,
    orden_visual        INTEGER DEFAULT 0, -- Para que el dueño ordene qué sale primero
    creado_en           TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tienda_id, nombre),
    UNIQUE(tienda_id, slug)
);

CREATE TABLE IF NOT EXISTS productos (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,

    -- Datos Principales
    nombre              TEXT NOT NULL,
    slug                TEXT NOT NULL, -- URL: mi-tienda.com/producto/torta-chocolate-supreme
    sku                 TEXT NOT NULL, -- Código interno único por tienda
    descripcion         TEXT,
    tipo                tipos_producto NOT NULL DEFAULT 'producto_terminado',
    categoria_id        BIGINT REFERENCES categorias(id) ON DELETE SET NULL,

    -- Precios
    precio_base_centimos    BIGINT NOT NULL DEFAULT 0, -- Precio regular
    precio_oferta_centimos  BIGINT, -- Opcional: si tiene descuento temporal

    -- Configuración de Visualización
    visible_en_pos           BOOLEAN NOT NULL DEFAULT TRUE,
    visible_en_storefront    BOOLEAN NOT NULL DEFAULT TRUE,
    destacado_storefront     BOOLEAN NOT NULL DEFAULT FALSE, -- Para mostrar en "Populares" o home

    -- Multimedia
    url_imagen_principal    TEXT,
    imagenes_galeria        JSONB DEFAULT '[]', -- Array de URLs adicionales: ["url1.jpg", "url2.jpg"]

    -- Atributos Flexibles para Filtros (El reemplazo de EAV)
    -- Ej: {"sabor": "chocolate", "porciones": 12, "dietetico": false}
    atributos           JSONB DEFAULT '{}', 

    -- Control
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en           TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en      TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tienda_id, sku),
    UNIQUE(tienda_id, slug)
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
    UNIQUE(sede_id, insumo_id)
);

CREATE TABLE IF NOT EXISTS inventario_productos (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id           BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id             BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    producto_id         BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad_actual     INTEGER NOT NULL DEFAULT 0,
    ubicacion_fisica    TEXT, -- ej. "Vitrina 1", "Refrigerador postres"
    actualizado_en      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sede_id, producto_id)
);

-- FALTA: Trazabilidad completa de movimientos
CREATE TABLE movimientos_inventario_insumos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id),
    sede_id BIGINT NOT NULL REFERENCES sedes(id),
    insumo_id BIGINT NOT NULL REFERENCES insumos(id),
    
    tipo_movimiento TEXT NOT NULL, -- 'entrada_compra', 'salida_produccion', 'ajuste_inventario', 'transferencia'
    
    cantidad NUMERIC(12,4) NOT NULL, -- Positivo para entradas, negativo para salidas
    cantidad_anterior NUMERIC(12,4) NOT NULL,
    cantidad_posterior NUMERIC(12,4) NOT NULL,
    
    -- Relaciones según el tipo de movimiento
    orden_compra_id BIGINT REFERENCES ordenes_compra(id),
    plan_produccion_id BIGINT REFERENCES planes_produccion(id),
    transferencia_id BIGINT, -- Si mueves entre sedes
    
    motivo TEXT, -- "Ajuste por conteo físico", "Merma por vencimiento"
    responsable_id BIGINT REFERENCES usuarios_tienda(id),
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE movimientos_inventario_productos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id),
    sede_id BIGINT NOT NULL REFERENCES sedes(id),
    producto_id BIGINT NOT NULL REFERENCES productos(id),
    
    tipo_movimiento TEXT NOT NULL, -- 'entrada_produccion', 'salida_venta', 'merma', 'ajuste'
    
    cantidad INTEGER NOT NULL,
    cantidad_anterior INTEGER NOT NULL,
    cantidad_posterior INTEGER NOT NULL,
    
    pedido_id BIGINT REFERENCES pedidos(id),
    plan_produccion_id BIGINT REFERENCES planes_produccion(id),
    
    motivo TEXT,
    responsable_id BIGINT REFERENCES usuarios_tienda(id),
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Transferencias entre sedes
CREATE TABLE transferencias_inventario (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id),
    sede_origen_id BIGINT NOT NULL REFERENCES sedes(id),
    sede_destino_id BIGINT NOT NULL REFERENCES sedes(id),
    
    estado TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'en_transito', 'recibida'
    
    solicitado_por BIGINT REFERENCES usuarios_tienda(id),
    autorizado_por BIGINT REFERENCES usuarios_tienda(id),
    recibido_por BIGINT REFERENCES usuarios_tienda(id),
    
    fecha_solicitud TIMESTAMPTZ DEFAULT NOW(),
    fecha_envio TIMESTAMPTZ,
    fecha_recepcion TIMESTAMPTZ,
    
    observaciones TEXT
);

CREATE TABLE items_transferencia (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    transferencia_id BIGINT NOT NULL REFERENCES transferencias_inventario(id),
    insumo_id BIGINT REFERENCES insumos(id),
    producto_id BIGINT REFERENCES productos(id),
    cantidad_enviada NUMERIC(12,4) NOT NULL,
    cantidad_recibida NUMERIC(12,4),
    CHECK ((insumo_id IS NOT NULL AND producto_id IS NULL) OR (insumo_id IS NULL AND producto_id IS NOT NULL))
);

-- Clientes

CREATE TABLE IF NOT EXISTS clientes (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id                       BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    tipo_doc                        tipos_documento,      -- Puede ser NULL para ventas anónimas rápidas
    numero_doc                      TEXT,    
    nombre_doc                      TEXT NOT NULL, -- Para POS rápido, a veces solo ponen "Cliente Varios"
    email                           CITEXT,
    telefono                        TEXT,
    -- Para usuarios registrados en Storefront
    es_usuario_virtual              BOOLEAN NOT NULL DEFAULT FALSE,
    hash_contrasena                  TEXT,          -- Solo si se registra online
    notas                            TEXT, -- "Le gustan las tortas poco dulces"
    activo                           BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en                        TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en                   TIMESTAMPTZ DEFAULT NOW(),    
    UNIQUE(tienda_id, tipo_doc, numero_doc), -- Evita duplicar al mismo cliente por DNI
    UNIQUE(tienda_id, email) -- Si tiene email, que no se repita
);

CREATE TABLE IF NOT EXISTS direcciones_cliente (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id                       BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    etiqueta                         TEXT, -- "Casa", "Oficina", "Dirección Fiscal"
    direccion_completa               TEXT NOT NULL, -- Calle, número, etc.
    referencia                       TEXT, -- "Frente al parque azul"
    distrito_id                      BIGINT REFERENCES ubigeo_distritos(id) ON DELETE SET NULL,
    codigo_postal                    TEXT,  
    es_fiscal                        BOOLEAN DEFAULT FALSE, -- Para usar en Facturas SUNAT
    es_entrega                       BOOLEAN DEFAULT FALSE, -- Para delivery    
    creado_en                        TIMESTAMPTZ DEFAULT NOW()
);

-- Ventas

CREATE TABLE IF NOT EXISTS cajas (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id       BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id         BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    nombre          TEXT NOT NULL, -- "Caja Principal", "Caja Delivery"
    activa          BOOLEAN DEFAULT TRUE,
    creado_en       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sesiones_caja (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id                       BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    caja_id                         BIGINT NOT NULL REFERENCES cajas(id),
    usuario_apertura_id             BIGINT NOT NULL REFERENCES usuarios_tienda(id),
    usuario_cierre_id               BIGINT REFERENCES usuarios_tienda(id),

    monto_inicial_centimos          BIGINT NOT NULL, -- Con cuánto sencillo abren
    monto_final_esperado_centimos   BIGINT, -- Calculado por el sistema (Solo efectivo)
    monto_final_real_centimos       BIGINT, -- Lo que contó el cajero al cierre
    diferencia_centimos             GENERATED ALWAYS AS (monto_final_real_centimos - monto_final_esperado_centimos) STORED,
    
    fecha_apertura                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_cierre                    TIMESTAMPTZ,
    esta_abierta                    BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS movimientos_caja (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sesion_caja_id                  BIGINT NOT NULL REFERENCES sesiones_caja(id),
    tipo_movimiento                 TEXT NOT NULL, -- 'venta', 'retiro', 'ingreso_manual', 'gasto_menor'
    monto_centimos                  BIGINT NOT NULL,
    metodo_pago                      metodos_pago,
    pedido_id                       BIGINT REFERENCES pedidos(id),
    concepto                         TEXT, -- "Compra de agua para tienda"
    comprobante_asociado             TEXT,
    creado_en                        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedidos (
    id                              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_pedido                   TEXT NOT NULL,
    tienda_id                       BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_origen_id                  BIGINT NOT NULL REFERENCES sedes(id), -- Dónde se tomó
    cliente_id                      BIGINT REFERENCES clientes(id) ON DELETE SET NULL, -- Opcional para venta rápida POS

    -- Contexto de la Venta
    origen                          origenes_pedido NOT NULL,
    sesion_caja_id                  BIGINT REFERENCES sesiones_caja(id), -- Solo si fue POS
    vendedor_id                     BIGINT REFERENCES usuarios_tienda(id), -- Quién atendió

    -- Estados
    estado_pedido                    estados_pedido NOT NULL DEFAULT 'pendiente_pago',
    estado_pago                      estados_pago_pedido NOT NULL DEFAULT 'pendiente',

    -- Logística
    tipo_entrega                     tipos_entrega NOT NULL DEFAULT 'recojo_tienda',
    fecha_entrega_pactada            TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Para POS es NOW(), para encargos es futura
    direccion_entrega                TEXT, -- Si es delivery
    costo_delivery_centimos          BIGINT DEFAULT 0,
    
    -- Totales Financieros
    moneda                           CHAR(3) DEFAULT 'PEN',
    subtotal_items_centimos          BIGINT NOT NULL DEFAULT 0,
    descuento_total_centimos         BIGINT NOT NULL DEFAULT 0,
    impuestos_totales_centimos       BIGINT NOT NULL DEFAULT 0,
    total_final_centimos             BIGINT NOT NULL,
    monto_pagado_centimos            BIGINT NOT NULL DEFAULT 0,
    saldo_pendiente_centimos         GENERATED ALWAYS AS (total_final_centimos - monto_pagado_centimos) STORED,

    -- Datos Fiscales (Copia del momento de venta)
    requiere_comprobante             BOOLEAN DEFAULT TRUE,
    tipo_comprobante                 tipos_comprobante,
    serie_comprobante                TEXT,
    numero_comprobante               TEXT,
    -- Aquí se podrían guardar snapshot de datos del cliente receptor del comprobante

    notas_pedido                     TEXT, -- "Tocar timbre fuerte"
    creado_en                        TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en                   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tienda_id, codigo_pedido)
);

CREATE TABLE IF NOT EXISTS direcciones_pedido (
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pedido_id                   BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    tipo_direccion              TEXT NOT NULL CHECK (tipo_direccion IN ('facturacion', 'envio')),
    nombre_contacto             TEXT NOT NULL, 
    tipo_doc_contacto           tipos_documento,
    numero_doc_contacto         TEXT,
    telefono_contacto           TEXT NOT NULL,
    email_contacto              TEXT,
    direccion_completa          TEXT NOT NULL,
    referencia                  TEXT,         
    distrito                    TEXT,
    provincia                   TEXT,  
    departamento                TEXT,  
    codigo_ubigeo               CHAR(6),
    codigo_postal               TEXT,
    creado_en                   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS detalles_pedido (
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pedido_id                   BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id                 BIGINT NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad                    INTEGER NOT NULL DEFAULT 1,
    precio_unitario_centimos    BIGINT NOT NULL, -- Precio al momento de la venta (por si cambia luego en catálogo)
    subtotal_linea_centimos     BIGINT NOT NULL,
    notas_item                  TEXT -- "Sin mucha crema"
);

CREATE TABLE IF NOT EXISTS pagos_pedido (
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pedido_id                   BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    sesion_caja_id              BIGINT REFERENCES sesiones_caja(id), -- Si se pagó en caja física

    monto_pagado_centimos       BIGINT NOT NULL,
    metodo_pago                 metodo_pago NOT NULL,
    referencia_externa          TEXT, -- Nro operación Yape, ID transacción Stripe

    fecha_pago                  TIMESTAMPTZ DEFAULT NOW(),
    registrado_por              BIGINT REFERENCES usuarios_tienda(id) -- Usuario que recibió el dinero
);

CREATE TABLE IF NOT EXISTS personalizaciones_item_pedido (
    id                                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    detalle_pedido_id                   BIGINT NOT NULL REFERENCES detalles_pedido(id) ON DELETE CASCADE UNIQUE, -- 1 a 1 con una línea de detalle
    descripcion_solicitud               TEXT NOT NULL, -- "Quiero a Spiderman saltando de un edificio..."
    texto_dedicatoria                   TEXT, -- "Feliz 5 añitos Pepito"
    imagenes_referencia                 JSONB DEFAULT '[]', -- Fotos que trajo el cliente
    -- Atributos específicos si los tuvieras estandarizados
    sabor_masa                           TEXT,
    sabor_relleno                        TEXT,
    tematica                             TEXT,
    fecha_limite_produccion              TIMESTAMPTZ, -- Cuándo debe estar listo para que se seque el fondant antes de entregar

    costo_extra_personalizacion_centimos BIGINT DEFAULT 0 -- Si cobras extra por el diseño complejo
);

-- Facturación

CREATE TABLE tienda_series (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    sede_id BIGINT NOT NULL REFERENCES sedes(id) ON DELETE CASCADE,
    tipo_comprobante tipos_comprobante NOT NULL, -- boleta, factura, nota_credito...
    serie CHAR(4) NOT NULL, -- Ej: F001, B002
    correlativo_actual INTEGER NOT NULL DEFAULT 0, -- Último número emitido
    es_electronica BOOLEAN DEFAULT TRUE, -- Por si usan talonario manual de contingencia
    activa BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tienda_id, serie) -- Las series no se pueden repetir dentro de la misma empresa
);

CREATE TABLE tienda_comprobantes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tienda_id BIGINT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
    pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE RESTRICT, -- Vinculo directo a la venta

    -- Datos del Emisor (Snapshot por si cambia la config de la tienda)
    emisor_razon_social TEXT NOT NULL,
    emisor_ruc TEXT NOT NULL,
    emisor_direccion TEXT NOT NULL,
    
    -- Datos del Receptor (Snapshot tomado del pedido)
    cliente_tipo_doc tipos_documento NOT NULL,
    cliente_numero_doc TEXT NOT NULL,
    cliente_nombre TEXT NOT NULL,
    cliente_direccion TEXT, -- Obligatorio para facturas mayores a ciertos montos
    
    -- Datos del Comprobante
    tipo_comprobante tipos_comprobante NOT NULL,
    serie CHAR(4) NOT NULL,
    correlativo INTEGER NOT NULL,
    fecha_emision TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    moneda CHAR(3) DEFAULT 'PEN',
    
    -- Totales (Deben coincidir con el pedido, pero se guardan aquí para integridad fiscal)
    total_gravado_centimos BIGINT NOT NULL DEFAULT 0,
    total_inafecto_centimos BIGINT NOT NULL DEFAULT 0,
    total_exonerado_centimos BIGINT NOT NULL DEFAULT 0,
    total_igv_centimos BIGINT NOT NULL DEFAULT 0,
    total_impuestos_bolsa_centimos BIGINT NOT NULL DEFAULT 0, -- ICBPER (impuesto a bolsas plásticas en Perú)
    total_importe_centimos BIGINT NOT NULL,
    
    -- Estado SUNAT (Integración con PSE/OSE)
    estado_sunat estados_sunat NOT NULL DEFAULT 'pendiente',
    codigo_hash_cpe TEXT,     -- El resumen digital que va en el QR
    xml_firmado_url TEXT,     -- Link al XML enviado a SUNAT
    cdr_sunat_url TEXT,       -- Link a la Constancia de Recepción (el OK de SUNAT)
    representacion_impresa_url TEXT, -- Link al PDF A4/Ticket
    
    respuesta_sunat_codigo TEXT, -- Ej: '0' (Aceptado), '2345' (Error RUC)
    respuesta_sunat_descripcion TEXT,
    
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tipo_comprobante, serie, correlativo) -- Unicidad fiscal global (o por tienda si prefieres)
);

-- Configuración

-- Asegúrate de incluir:
CREATE TABLE configuracion_tienda (
    tienda_id BIGINT PRIMARY KEY REFERENCES tiendas(id) ON DELETE CASCADE,
    
    -- SUNAT
    ruc TEXT,
    razon_social TEXT,
    direccion_fiscal TEXT,
    ubigeo_fiscal CHAR(6) REFERENCES ubigeo_distritos(codigo_ubigeo),
    usuario_sunat_sol TEXT, -- Usuario SOL
    clave_sunat_sol_encriptada TEXT, -- Clave encriptada
    certificado_digital_url TEXT, -- .pfx para firmar XMLs
    modo_sunat TEXT DEFAULT 'pruebas', -- 'pruebas' o 'produccion'
    
    -- IGV y tributos
    tasa_igv NUMERIC(5,2) DEFAULT 18.00,
    
    -- Integración pagos
    api_key_yape TEXT,
    api_key_plin TEXT,
    merchant_id_niubiz TEXT,
    
    -- CMS Storefront
    banner_principal_url TEXT,
    mensaje_bienvenida TEXT,
    horario_atencion JSONB, -- {"lunes": "8:00-18:00", ...}
    redes_sociales JSONB, -- {"facebook": "url", "instagram": "url"}
    politicas_envio TEXT,
    politicas_devolucion TEXT,
    
    -- Notificaciones
    email_notificaciones CITEXT,
    telegram_bot_token TEXT,
    telegram_chat_id TEXT,
    
    actualizado_en TIMESTAMPTZ DEFAULT NOW()
);