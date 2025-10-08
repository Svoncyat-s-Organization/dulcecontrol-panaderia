-- =============================================================================
-- DULCE CONTROL - BD UNIFICADA (PostgreSQL)
-- Un solo archivo: esquema + extensiones + tablas + checks + indices + triggers + vistas
-- Ejecutar en una base de datos nueva/vacia (sin seeds).
-- Requisitos: PostgreSQL 12+
-- =============================================================================

-- 0) Esquema y extensiones
CREATE SCHEMA IF NOT EXISTS dulce_control;
SET search_path = dulce_control, public;

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- =============================================================================
-- 1) Funciones utilitarias
-- =============================================================================

-- 1.1 updated_at automatico
CREATE OR REPLACE FUNCTION dulce_control.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.actualizado_en := NOW();
  RETURN NEW;
END $$;

-- 1.2 Calcular total_item en venta_item
CREATE OR REPLACE FUNCTION dulce_control.calcular_total_item_venta()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.total_item := ROUND((NEW.cantidad * NEW.precio_unitario) - COALESCE(NEW.descuento,0), 2);
  IF NEW.total_item < 0 THEN
    RAISE EXCEPTION 'total_item no puede ser negativo';
  END IF;
  RETURN NEW;
END $$;

-- 1.3 Recalcular totales de una venta al tocar venta_item
CREATE OR REPLACE FUNCTION dulce_control.recalcular_totales_venta()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_venta_id BIGINT := COALESCE(NEW.venta_id, OLD.venta_id);
  v_subtotal NUMERIC(12,2);
  v_impuesto NUMERIC(12,2);
  v_total    NUMERIC(12,2);
  v_pct      NUMERIC(5,2);
BEGIN
  SELECT COALESCE(ROUND(SUM(total_item),2),0) INTO v_subtotal
  FROM dulce_control.venta_item WHERE venta_id = v_venta_id;

  SELECT impuesto_porcentaje INTO v_pct
  FROM dulce_control.venta WHERE id = v_venta_id;

  v_impuesto := ROUND(v_subtotal * (COALESCE(v_pct,0)/100.0), 2);
  v_total    := ROUND(v_subtotal + v_impuesto, 2);

  UPDATE dulce_control.venta
    SET subtotal = v_subtotal,
        impuesto = v_impuesto,
        total    = v_total,
        actualizado_en = NOW()
  WHERE id = v_venta_id;

  RETURN NULL;
END $$;

-- 1.4 Validar cambios de estado en pedidos (MDE)
CREATE OR REPLACE FUNCTION dulce_control.validar_cambio_estado_pedido()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  e_old TEXT := COALESCE(OLD.estado, '');
  e_new TEXT := NEW.estado;
  valido BOOLEAN := FALSE;
BEGIN
  IF e_new NOT IN ('pendiente','en_preparacion','listo','entregado','anulado') THEN
    RAISE EXCEPTION 'Estado de pedido invalido: %', e_new;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.estado <> 'pendiente' THEN
      RAISE EXCEPTION 'El estado inicial de un pedido debe ser "pendiente"';
    END IF;
    RETURN NEW;
  END IF;

  IF e_old = 'pendiente' AND e_new IN ('en_preparacion','anulado') THEN
    valido := TRUE;
  ELSIF e_old = 'en_preparacion' AND e_new IN ('listo','anulado') THEN
    valido := TRUE;
  ELSIF e_old = 'listo' AND e_new IN ('entregado','anulado') THEN
    valido := TRUE;
  ELSIF e_old = 'entregado' AND e_new = 'entregado' THEN
    valido := TRUE;
  ELSIF e_old = 'anulado' AND e_new = 'anulado' THEN
    valido := TRUE;
  END IF;

  IF NOT valido THEN
    RAISE EXCEPTION 'Transicion de estado no permitida: % -> %', e_old, e_new;
  END IF;

  RETURN NEW;
END $$;

-- 1.5 Autocompletar estado de plan_produccion_item
CREATE OR REPLACE FUNCTION dulce_control.plan_item_autocompletar()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.cantidad_completada < 0 THEN
    RAISE EXCEPTION 'cantidad_completada no puede ser negativa';
  END IF;
  IF NEW.cantidad_objetivo < 0 THEN
    RAISE EXCEPTION 'cantidad_objetivo no puede ser negativa';
  END IF;

  IF NEW.cantidad_completada >= NEW.cantidad_objetivo THEN
    NEW.completado := TRUE;
  ELSE
    NEW.completado := FALSE;
  END IF;

  RETURN NEW;
END $$;

-- =============================================================================
-- 2) Basicos de organizacion y acceso
-- =============================================================================

CREATE TABLE IF NOT EXISTS sede (
  id              BIGSERIAL PRIMARY KEY,
  nombre          VARCHAR(120) NOT NULL,
  direccion       VARCHAR(250),
  telefono        VARCHAR(20) CHECK (telefono ~ '^[0-9 +()-]{6,20}$' OR telefono IS NULL),
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER sede_set_updated_at
BEFORE UPDATE ON sede FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

CREATE TABLE IF NOT EXISTS rol (
  id              BIGSERIAL PRIMARY KEY,
  nombre          VARCHAR(60) UNIQUE NOT NULL,
  descripcion     VARCHAR(250),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER rol_set_updated_at
BEFORE UPDATE ON rol FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

CREATE TABLE IF NOT EXISTS permiso (
  id              BIGSERIAL PRIMARY KEY,
  codigo          VARCHAR(80) UNIQUE NOT NULL, -- p.ej. 'pos.abrir_caja'
  descripcion     VARCHAR(250),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER permiso_set_updated_at
BEFORE UPDATE ON permiso FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

CREATE TABLE IF NOT EXISTS rol_permiso (
  rol_id      BIGINT NOT NULL REFERENCES rol(id) ON DELETE CASCADE,
  permiso_id  BIGINT NOT NULL REFERENCES permiso(id) ON DELETE CASCADE,
  PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE IF NOT EXISTS usuario (
  id              BIGSERIAL PRIMARY KEY,
  nombres         VARCHAR(120) NOT NULL,
  apellidos       VARCHAR(120),
  email           CITEXT UNIQUE NOT NULL,
  telefono        VARCHAR(20) CHECK (telefono ~ '^[0-9 +()-]{6,20}$' OR telefono IS NULL),
  contrasena_hash VARCHAR(200) NOT NULL CHECK (LENGTH(contrasena_hash) >= 60),
  sede_preferida_id BIGINT REFERENCES sede(id),
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_usuario_email_trgm ON usuario USING gin (email gin_trgm_ops);
CREATE TRIGGER usuario_set_updated_at
BEFORE UPDATE ON usuario FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

CREATE TABLE IF NOT EXISTS usuario_rol (
  usuario_id  BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  rol_id      BIGINT NOT NULL REFERENCES rol(id) ON DELETE RESTRICT,
  PRIMARY KEY (usuario_id, rol_id)
);

CREATE TABLE IF NOT EXISTS usuario_sede (
  usuario_id  BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  sede_id     BIGINT NOT NULL REFERENCES sede(id) ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, sede_id)
);

-- Recuperacion de contrasena
CREATE TABLE IF NOT EXISTS usuario_recuperacion(
  id          BIGSERIAL PRIMARY KEY,
  usuario_id  BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  token       VARCHAR(120) UNIQUE NOT NULL,
  expira_en   TIMESTAMPTZ NOT NULL,
  usado       BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3) Catalogos: categorias, productos, imagenes, insumos, recetas
-- =============================================================================

CREATE TABLE IF NOT EXISTS categoria_producto (
  id              BIGSERIAL PRIMARY KEY,
  nombre          VARCHAR(120) NOT NULL UNIQUE,
  descripcion     VARCHAR(250),
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER categoria_producto_set_updated_at
BEFORE UPDATE ON categoria_producto FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

CREATE TABLE IF NOT EXISTS producto (
  id                BIGSERIAL PRIMARY KEY,
  codigo            VARCHAR(50) UNIQUE NOT NULL,
  nombre            VARCHAR(200) NOT NULL,
  descripcion       TEXT,
  categoria_id      BIGINT REFERENCES categoria_producto(id) ON DELETE SET NULL,
  unidad_medida     VARCHAR(30) NOT NULL DEFAULT 'unidad', -- 'unidad','kg','lt'
  precio_venta      NUMERIC(12,2) NOT NULL CHECK (precio_venta >= 0),
  visible_storefront BOOLEAN NOT NULL DEFAULT TRUE,
  slug              VARCHAR(160) UNIQUE,
  activo            BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_producto_nombre_trgm ON producto USING gin (nombre gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_producto_slug ON producto(slug);
CREATE TRIGGER producto_set_updated_at
BEFORE UPDATE ON producto FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

CREATE TABLE IF NOT EXISTS producto_imagen(
  id            BIGSERIAL PRIMARY KEY,
  producto_id   BIGINT NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  url           VARCHAR(400) NOT NULL,
  orden         INT NOT NULL DEFAULT 1,
  UNIQUE(producto_id, orden)
);
CREATE INDEX IF NOT EXISTS idx_producto_imagen_prod ON producto_imagen(producto_id);

-- Insumos (materias primas)
CREATE TABLE IF NOT EXISTS insumo (
  id              BIGSERIAL PRIMARY KEY,
  codigo          VARCHAR(50) UNIQUE NOT NULL,
  nombre          VARCHAR(200) NOT NULL,
  descripcion     TEXT,
  unidad_medida   VARCHAR(30) NOT NULL DEFAULT 'unidad',
  costo_referencia NUMERIC(12,4) CHECK (costo_referencia IS NULL OR costo_referencia >= 0),
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_insumo_nombre_trgm ON insumo USING gin (nombre gin_trgm_ops);
CREATE TRIGGER insumo_set_updated_at
BEFORE UPDATE ON insumo FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

-- Recetas
CREATE TABLE IF NOT EXISTS receta (
  id              BIGSERIAL PRIMARY KEY,
  producto_id     BIGINT NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  descripcion     TEXT,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (producto_id)
);
CREATE TRIGGER receta_set_updated_at
BEFORE UPDATE ON receta FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

CREATE TABLE IF NOT EXISTS receta_item (
  id              BIGSERIAL PRIMARY KEY,
  receta_id       BIGINT NOT NULL REFERENCES receta(id) ON DELETE CASCADE,
  insumo_id       BIGINT NOT NULL REFERENCES insumo(id) ON DELETE RESTRICT,
  cantidad        NUMERIC(12,4) NOT NULL CHECK (cantidad > 0),
  unidad_medida   VARCHAR(30) NOT NULL,
  UNIQUE (receta_id, insumo_id)
);

-- =============================================================================
-- 4) Inventario de productos por sede
-- =============================================================================

CREATE TABLE IF NOT EXISTS inventario_producto (
  sede_id         BIGINT NOT NULL REFERENCES sede(id) ON DELETE CASCADE,
  producto_id     BIGINT NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  stock_actual    NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
  stock_minimo    NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
  PRIMARY KEY (sede_id, producto_id)
);
CREATE INDEX IF NOT EXISTS idx_inventario_producto_prod ON inventario_producto(producto_id);

-- Configuracion de stock ideal por sede (para planificacion)
CREATE TABLE IF NOT EXISTS inventario_config(
  sede_id       BIGINT NOT NULL REFERENCES sede(id) ON DELETE CASCADE,
  producto_id   BIGINT NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  stock_ideal   NUMERIC(12,3) NOT NULL CHECK (stock_ideal >= 0),
  PRIMARY KEY (sede_id, producto_id)
);

-- =============================================================================
-- 5) Clientes
-- =============================================================================

CREATE TABLE IF NOT EXISTS cliente (
  id              BIGSERIAL PRIMARY KEY,
  nombre          VARCHAR(200) NOT NULL,
  telefono        VARCHAR(20) CHECK (telefono ~ '^[0-9 +()-]{6,20}$' OR telefono IS NULL),
  email           CITEXT,
  direccion       VARCHAR(250),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cliente_nombre_trgm ON cliente USING gin (nombre gin_trgm_ops);
CREATE TRIGGER cliente_set_updated_at
BEFORE UPDATE ON cliente FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

-- =============================================================================
-- 6) Caja, POS y Ventas
-- =============================================================================

CREATE TABLE IF NOT EXISTS caja_sesion (
  id                  BIGSERIAL PRIMARY KEY,
  sede_id             BIGINT NOT NULL REFERENCES sede(id) ON DELETE RESTRICT,
  usuario_apertura_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
  apertura_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  monto_apertura      NUMERIC(12,2) NOT NULL CHECK (monto_apertura >= 0),
  usuario_cierre_id   BIGINT REFERENCES usuario(id) ON DELETE RESTRICT,
  cierre_at           TIMESTAMPTZ,
  monto_cierre        NUMERIC(12,2) CHECK (monto_cierre IS NULL OR monto_cierre >= 0),
  observaciones       TEXT,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (cierre_at IS NULL OR cierre_at >= apertura_at)
);
-- Una sola caja abierta por sede
CREATE UNIQUE INDEX IF NOT EXISTS unq_caja_abierta_por_sede
ON caja_sesion(sede_id) WHERE (cierre_at IS NULL);

CREATE TRIGGER caja_sesion_set_updated_at
BEFORE UPDATE ON caja_sesion FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

CREATE TABLE IF NOT EXISTS venta (
  id                  BIGSERIAL PRIMARY KEY,
  sede_id             BIGINT NOT NULL REFERENCES sede(id) ON DELETE RESTRICT,
  caja_sesion_id      BIGINT REFERENCES caja_sesion(id) ON DELETE SET NULL,
  usuario_id          BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
  cliente_id          BIGINT REFERENCES cliente(id) ON DELETE SET NULL,
  fecha               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  estado              VARCHAR(20) NOT NULL DEFAULT 'emitida'
                       CHECK (estado IN ('emitida','anulada')),
  moneda              CHAR(3) NOT NULL DEFAULT 'PEN' CHECK (UPPER(moneda) = 'PEN'),
  comprobante_tipo    VARCHAR(20) CHECK (comprobante_tipo IN ('boleta','factura','ticket') OR comprobante_tipo IS NULL),
  comprobante_serie   VARCHAR(10),
  comprobante_numero  VARCHAR(20),
  sunat_estado        VARCHAR(20) DEFAULT 'pendiente'
                       CHECK (sunat_estado IN ('pendiente','enviado','aceptado','rechazado')),
  sunat_mensaje       TEXT,
  subtotal            NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  impuesto_porcentaje NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (impuesto_porcentaje >= 0),
  impuesto            NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (impuesto >= 0),
  total               NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  anulado_at          TIMESTAMPTZ,
  anulado_por_id      BIGINT REFERENCES usuario(id) ON DELETE SET NULL,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK ((comprobante_serie IS NULL AND comprobante_numero IS NULL)
         OR (comprobante_serie IS NOT NULL AND comprobante_numero IS NOT NULL))
);
CREATE UNIQUE INDEX IF NOT EXISTS unq_comprobante
ON venta(comprobante_tipo, comprobante_serie, comprobante_numero)
WHERE (comprobante_tipo IS NOT NULL AND comprobante_serie IS NOT NULL AND comprobante_numero IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_venta_fecha ON venta(fecha);
CREATE INDEX IF NOT EXISTS idx_venta_sede ON venta(sede_id);
CREATE TRIGGER venta_set_updated_at
BEFORE UPDATE ON venta FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

CREATE TABLE IF NOT EXISTS venta_item (
  id              BIGSERIAL PRIMARY KEY,
  venta_id        BIGINT NOT NULL REFERENCES venta(id) ON DELETE CASCADE,
  producto_id     BIGINT NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
  cantidad        NUMERIC(12,3) NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0),
  descuento       NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (descuento >= 0),
  total_item      NUMERIC(12,2) NOT NULL,
  UNIQUE (venta_id, producto_id)
);
CREATE INDEX IF NOT EXISTS idx_venta_item_venta ON venta_item(venta_id);
CREATE TRIGGER venta_item_before_ins_upd
BEFORE INSERT OR UPDATE ON venta_item FOR EACH ROW
EXECUTE FUNCTION dulce_control.calcular_total_item_venta();

CREATE TRIGGER venta_item_after_change
AFTER INSERT OR UPDATE OR DELETE ON venta_item FOR EACH ROW
EXECUTE FUNCTION dulce_control.recalcular_totales_venta();

CREATE TABLE IF NOT EXISTS pago_venta (
  id              BIGSERIAL PRIMARY KEY,
  venta_id        BIGINT NOT NULL REFERENCES venta(id) ON DELETE CASCADE,
  metodo_pago     VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('efectivo','yape','plin','tarjeta')),
  monto           NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  referencia      VARCHAR(120),
  recibido_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pago_venta_venta ON pago_venta(venta_id);
CREATE INDEX IF NOT EXISTS idx_pago_venta_metodo ON pago_venta(metodo_pago);

-- =============================================================================
-- 7) Pedidos personalizados (con origen/pago online, pagos parciales y adjuntos)
-- =============================================================================

CREATE TABLE IF NOT EXISTS pedido (
  id                BIGSERIAL PRIMARY KEY,
  sede_id           BIGINT NOT NULL REFERENCES sede(id) ON DELETE RESTRICT,
  cliente_id        BIGINT REFERENCES cliente(id) ON DELETE SET NULL,
  fecha_creacion    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_entrega     DATE,
  hora_entrega      TIME,
  estado            VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                     CHECK (estado IN ('pendiente','en_preparacion','listo','entregado','anulado')),
  origen            VARCHAR(20) NOT NULL DEFAULT 'local'
                     CHECK (origen IN ('local','online')),
  pago_online_estado VARCHAR(20)
                     CHECK (pago_online_estado IN ('pendiente','pagado','fallido') OR pago_online_estado IS NULL),
  pago_online_referencia VARCHAR(120),
  observaciones     TEXT,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_pedido_fecha_entrega CHECK (fecha_entrega IS NULL OR fecha_entrega >= CURRENT_DATE)
);
CREATE INDEX IF NOT EXISTS idx_pedido_sede_estado ON pedido(sede_id, estado);
CREATE INDEX IF NOT EXISTS idx_pedido_fecha ON pedido(fecha_creacion);
CREATE TRIGGER pedido_set_updated_at
BEFORE UPDATE ON pedido FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

CREATE TRIGGER pedido_validar_estado
BEFORE INSERT OR UPDATE ON pedido FOR EACH ROW
EXECUTE FUNCTION dulce_control.validar_cambio_estado_pedido();

CREATE TABLE IF NOT EXISTS pedido_item (
  id              BIGSERIAL PRIMARY KEY,
  pedido_id       BIGINT NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
  producto_id     BIGINT NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
  cantidad        NUMERIC(12,3) NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal        NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
  UNIQUE (pedido_id, producto_id)
);
CREATE INDEX IF NOT EXISTS idx_pedido_item_pedido ON pedido_item(pedido_id);

CREATE TABLE IF NOT EXISTS pago_pedido (
  id              BIGSERIAL PRIMARY KEY,
  pedido_id       BIGINT NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
  metodo_pago     VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('efectivo','yape','plin','tarjeta')),
  monto           NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  referencia      VARCHAR(120),
  pagado_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pago_pedido_pedido ON pago_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pago_pedido_metodo ON pago_pedido(metodo_pago);

CREATE TABLE IF NOT EXISTS pedido_adjunto (
  id              BIGSERIAL PRIMARY KEY,
  pedido_id       BIGINT NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
  ruta_archivo    VARCHAR(400) NOT NULL,
  tipo_mime       VARCHAR(80),
  tamano_bytes    BIGINT CHECK (tamano_bytes IS NULL OR tamano_bytes >= 0),
  subido_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pedido_adjunto_pedido ON pedido_adjunto(pedido_id);

-- Entrega/direccion para pedidos online
CREATE TABLE IF NOT EXISTS pedido_entrega(
  pedido_id   BIGINT PRIMARY KEY REFERENCES pedido(id) ON DELETE CASCADE,
  modalidad   VARCHAR(20) NOT NULL CHECK (modalidad IN ('retiro','delivery')),
  direccion   VARCHAR(250),
  referencia  VARCHAR(250),
  distrito    VARCHAR(80),
  costo_envio NUMERIC(12,2) DEFAULT 0 CHECK (costo_envio >= 0),
  CONSTRAINT chk_pedido_entrega_direccion
    CHECK (
      (modalidad = 'retiro' AND direccion IS NULL)
      OR
      (modalidad = 'delivery' AND direccion IS NOT NULL)
    )
);

-- =============================================================================
-- 8) Planificacion de produccion (conteo, plan y checklist)
-- =============================================================================

-- Conteo matutino por sede/fecha
CREATE TABLE IF NOT EXISTS conteo_matutino(
  id          BIGSERIAL PRIMARY KEY,
  sede_id     BIGINT NOT NULL REFERENCES sede(id) ON DELETE RESTRICT,
  usuario_id  BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
  fecha       DATE NOT NULL DEFAULT CURRENT_DATE,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sede_id, fecha)
);
CREATE INDEX IF NOT EXISTS idx_conteo_matutino_sede_fecha ON conteo_matutino(sede_id, fecha);

CREATE TABLE IF NOT EXISTS conteo_matutino_item(
  id          BIGSERIAL PRIMARY KEY,
  conteo_id   BIGINT NOT NULL REFERENCES conteo_matutino(id) ON DELETE CASCADE,
  producto_id BIGINT NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
  cantidad    NUMERIC(12,3) NOT NULL CHECK (cantidad >= 0),
  UNIQUE(conteo_id, producto_id)
);
CREATE INDEX IF NOT EXISTS idx_conteo_item_conteo ON conteo_matutino_item(conteo_id);

-- Plan del dia
CREATE TABLE IF NOT EXISTS plan_produccion(
  id              BIGSERIAL PRIMARY KEY,
  sede_id         BIGINT NOT NULL REFERENCES sede(id) ON DELETE RESTRICT,
  fecha           DATE NOT NULL DEFAULT CURRENT_DATE,
  confirmado      BOOLEAN NOT NULL DEFAULT FALSE,
  generado_por_id BIGINT REFERENCES usuario(id) ON DELETE SET NULL,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sede_id, fecha)
);
CREATE TRIGGER plan_produccion_set_updated_at
BEFORE UPDATE ON plan_produccion FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();
CREATE INDEX IF NOT EXISTS idx_plan_produccion_sede_fecha ON plan_produccion(sede_id, fecha);

CREATE TABLE IF NOT EXISTS plan_produccion_item(
  id                   BIGSERIAL PRIMARY KEY,
  plan_id              BIGINT NOT NULL REFERENCES plan_produccion(id) ON DELETE CASCADE,
  producto_id          BIGINT NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
  cantidad_objetivo    NUMERIC(12,3) NOT NULL CHECK (cantidad_objetivo >= 0),
  cantidad_completada  NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (cantidad_completada >= 0),
  completado           BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(plan_id, producto_id)
);
CREATE INDEX IF NOT EXISTS idx_plan_item_plan ON plan_produccion_item(plan_id);

CREATE TRIGGER plan_item_autocomplete_before
BEFORE INSERT OR UPDATE ON plan_produccion_item FOR EACH ROW
EXECUTE FUNCTION dulce_control.plan_item_autocompletar();

-- =============================================================================
-- 9) Compras y gastos
-- =============================================================================

CREATE TABLE IF NOT EXISTS proveedor (
  id              BIGSERIAL PRIMARY KEY,
  ruc             VARCHAR(20),
  razon_social    VARCHAR(200) NOT NULL,
  telefono        VARCHAR(20) CHECK (telefono ~ '^[0-9 +()-]{6,20}$' OR telefono IS NULL),
  email           CITEXT,
  direccion       VARCHAR(250),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_proveedor_razon_trgm ON proveedor USING gin (razon_social gin_trgm_ops);
CREATE TRIGGER proveedor_set_updated_at
BEFORE UPDATE ON proveedor FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

CREATE TABLE IF NOT EXISTS compra (
  id              BIGSERIAL PRIMARY KEY,
  sede_id         BIGINT NOT NULL REFERENCES sede(id) ON DELETE RESTRICT,
  proveedor_id    BIGINT REFERENCES proveedor(id) ON DELETE SET NULL,
  fecha           DATE NOT NULL DEFAULT CURRENT_DATE,
  estado          VARCHAR(20) NOT NULL DEFAULT 'registrada'
                   CHECK (estado IN ('registrada','anulada')),
  subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  impuesto        NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (impuesto >= 0),
  total           NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_compra_sede_fecha ON compra(sede_id, fecha);
CREATE TRIGGER compra_set_updated_at
BEFORE UPDATE ON compra FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

CREATE TABLE IF NOT EXISTS compra_insumo_item (
  id              BIGSERIAL PRIMARY KEY,
  compra_id       BIGINT NOT NULL REFERENCES compra(id) ON DELETE CASCADE,
  insumo_id       BIGINT NOT NULL REFERENCES insumo(id) ON DELETE RESTRICT,
  cantidad        NUMERIC(12,4) NOT NULL CHECK (cantidad > 0),
  costo_unitario  NUMERIC(12,4) NOT NULL CHECK (costo_unitario >= 0),
  subtotal        NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
  UNIQUE (compra_id, insumo_id)
);
CREATE INDEX IF NOT EXISTS idx_compra_insumo_item_compra ON compra_insumo_item(compra_id);

CREATE TABLE IF NOT EXISTS gasto (
  id              BIGSERIAL PRIMARY KEY,
  sede_id         BIGINT NOT NULL REFERENCES sede(id) ON DELETE RESTRICT,
  fecha           DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria       VARCHAR(60) NOT NULL,
  descripcion     VARCHAR(250),
  monto           NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  comprobante_tipo VARCHAR(20) CHECK (comprobante_tipo IN ('boleta','factura','ninguno') OR comprobante_tipo IS NULL),
  comprobante_serie VARCHAR(10),
  comprobante_numero VARCHAR(20),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_gasto_sede_fecha ON gasto(sede_id, fecha);
CREATE TRIGGER gasto_set_updated_at
BEFORE UPDATE ON gasto FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

-- =============================================================================
-- 10) Vistas de apoyo
-- =============================================================================

-- Resumen de pagos por venta
CREATE OR REPLACE VIEW vw_resumen_venta_pago AS
SELECT v.id AS venta_id,
       v.fecha,
       v.sede_id,
       v.subtotal,
       v.impuesto,
       v.total,
       COALESCE(SUM(pv.monto) FILTER (WHERE pv.metodo_pago = 'efectivo'),0) AS efectivo,
       COALESCE(SUM(pv.monto) FILTER (WHERE pv.metodo_pago = 'yape'),0)     AS yape,
       COALESCE(SUM(pv.monto) FILTER (WHERE pv.metodo_pago = 'plin'),0)     AS plin,
       COALESCE(SUM(pv.monto) FILTER (WHERE pv.metodo_pago = 'tarjeta'),0)  AS tarjeta
FROM venta v
LEFT JOIN pago_venta pv ON pv.venta_id = v.id
GROUP BY v.id;

-- Totales y saldo del pedido
CREATE OR REPLACE VIEW vw_pedido_totales AS
SELECT p.id AS pedido_id,
       COALESCE(SUM(pi.subtotal),0) AS total_pedido,
       COALESCE(SUM(pp.monto),0)    AS total_pagado,
       COALESCE(SUM(pi.subtotal),0) - COALESCE(SUM(pp.monto),0) AS saldo
FROM pedido p
LEFT JOIN pedido_item pi ON pi.pedido_id = p.id
LEFT JOIN pago_pedido  pp ON pp.pedido_id = p.id
GROUP BY p.id;

-- Progreso del plan de produccion
CREATE OR REPLACE VIEW vw_plan_produccion_progreso AS
SELECT pl.id AS plan_id,
       pl.sede_id,
       pl.fecha,
       COUNT(*) AS productos_en_plan,
       COUNT(*) FILTER (WHERE ppi.completado) AS productos_completados
FROM plan_produccion pl
LEFT JOIN plan_produccion_item ppi ON ppi.plan_id = pl.id
GROUP BY pl.id, pl.sede_id, pl.fecha;

-- =============================================================================
-- FIN DEL SCRIPT
-- =============================================================================