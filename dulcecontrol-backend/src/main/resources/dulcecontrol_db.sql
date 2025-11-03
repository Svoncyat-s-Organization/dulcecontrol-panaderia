-- =============================================================================
-- DULCE CONTROL - V1: Esquema Base y Extensiones
-- Fecha: 2025-10-08
-- Descripción: Configuración inicial del esquema y extensiones PostgreSQL
-- =============================================================================

-- Crear esquema principal
CREATE SCHEMA IF NOT EXISTS dulce_control;

-- Configurar búsqueda de esquemas
SET search_path = dulce_control, public;

-- Extensiones para tipos y búsqueda optimizada
CREATE EXTENSION IF NOT EXISTS citext;      -- Texto case-insensitive para emails
CREATE EXTENSION IF NOT EXISTS pg_trgm;     -- Búsqueda por similitud (trigrams)
CREATE EXTENSION IF NOT EXISTS btree_gist;  -- Índices para rangos y exclusiones

-- =============================================================================
-- DULCE CONTROL - V2: Funciones Utilitarias y Triggers
-- Fecha: 2025-10-08
-- Descripción: Funciones PL/pgSQL para automatización y validaciones
-- =============================================================================


-- =============================================================================
-- 1. Función: Actualización automática de timestamps
-- =============================================================================
-- Actualiza automáticamente el campo 'actualizado_en' en cada UPDATE
CREATE OR REPLACE FUNCTION dulce_control.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.actualizado_en := NOW();
  RETURN NEW;
END $$;

-- =============================================================================
-- 2. Función: Calcular total de items en ventas
-- =============================================================================
-- Calcula: total_item = (cantidad * precio_unitario) - descuento
-- Valida que el resultado no sea negativo
CREATE OR REPLACE FUNCTION dulce_control.calcular_total_item_venta()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.total_item := ROUND((NEW.cantidad * NEW.precio_unitario) - COALESCE(NEW.descuento, 0), 2);
  
  IF NEW.total_item < 0 THEN
    RAISE EXCEPTION 'El total_item no puede ser negativo. Verifique cantidad, precio y descuento.';
  END IF;
  
  RETURN NEW;
END $$;

-- =============================================================================
-- 3. Función: Recalcular totales de venta
-- =============================================================================
-- Recalcula subtotal, impuesto y total de una venta cuando cambian sus items
-- Se ejecuta DESPUÉS de INSERT/UPDATE/DELETE en venta_item
CREATE OR REPLACE FUNCTION dulce_control.recalcular_totales_venta()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_venta_id BIGINT := COALESCE(NEW.venta_id, OLD.venta_id);
  v_subtotal NUMERIC(12,2);
  v_impuesto NUMERIC(12,2);
  v_total    NUMERIC(12,2);
  v_pct      NUMERIC(5,2);
BEGIN
  -- Sumar todos los items de la venta
  SELECT COALESCE(ROUND(SUM(total_item), 2), 0) INTO v_subtotal
  FROM dulce_control.venta_item 
  WHERE venta_id = v_venta_id;

  -- Obtener porcentaje de impuesto configurado
  SELECT impuesto_porcentaje INTO v_pct
  FROM dulce_control.venta 
  WHERE id = v_venta_id;

  -- Calcular impuesto y total
  v_impuesto := ROUND(v_subtotal * (COALESCE(v_pct, 0) / 100.0), 2);
  v_total    := ROUND(v_subtotal + v_impuesto, 2);

  -- Actualizar la venta
  UPDATE dulce_control.venta
    SET subtotal = v_subtotal,
        impuesto = v_impuesto,
        total    = v_total,
        actualizado_en = NOW()
  WHERE id = v_venta_id;

  RETURN NULL;
END $$;

-- =============================================================================
-- 4. Función: Validar cambios de estado en pedidos (Máquina de Estados)
-- =============================================================================
-- Implementa una máquina de estados para pedidos:
-- pendiente → en_preparacion → listo → entregado
-- Cualquier estado puede pasar a 'anulado' excepto 'entregado'
CREATE OR REPLACE FUNCTION dulce_control.validar_cambio_estado_pedido()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  e_old TEXT := COALESCE(OLD.estado, '');
  e_new TEXT := NEW.estado;
  valido BOOLEAN := FALSE;
BEGIN
  -- Validar que el estado sea uno de los permitidos
  IF e_new NOT IN ('pendiente', 'en_preparacion', 'listo', 'entregado', 'anulado') THEN
    RAISE EXCEPTION 'Estado de pedido inválido: %. Estados permitidos: pendiente, en_preparacion, listo, entregado, anulado', e_new;
  END IF;

  -- En INSERT, el estado inicial debe ser 'pendiente'
  IF TG_OP = 'INSERT' THEN
    IF NEW.estado <> 'pendiente' THEN
      RAISE EXCEPTION 'El estado inicial de un pedido debe ser "pendiente", se intentó crear con: %', NEW.estado;
    END IF;
    RETURN NEW;
  END IF;

  -- Validar transiciones permitidas
  IF e_old = 'pendiente' AND e_new IN ('en_preparacion', 'anulado') THEN
    valido := TRUE;
  ELSIF e_old = 'en_preparacion' AND e_new IN ('listo', 'anulado') THEN
    valido := TRUE;
  ELSIF e_old = 'listo' AND e_new IN ('entregado', 'anulado') THEN
    valido := TRUE;
  ELSIF e_old = 'entregado' AND e_new = 'entregado' THEN
    valido := TRUE;  -- Permitir UPDATE sin cambio de estado
  ELSIF e_old = 'anulado' AND e_new = 'anulado' THEN
    valido := TRUE;  -- Permitir UPDATE sin cambio de estado
  END IF;

  IF NOT valido THEN
    RAISE EXCEPTION 'Transición de estado no permitida: % → %. Verifique el flujo de estados del pedido.', e_old, e_new;
  END IF;

  RETURN NEW;
END $$;

-- =============================================================================
-- 5. Función: Autocompletar estado de items en plan de producción
-- =============================================================================
-- Marca automáticamente un item como completado cuando cantidad_completada >= cantidad_objetivo
CREATE OR REPLACE FUNCTION dulce_control.plan_item_autocompletar()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Validar cantidades no negativas
  IF NEW.cantidad_completada < 0 THEN
    RAISE EXCEPTION 'La cantidad_completada no puede ser negativa: %', NEW.cantidad_completada;
  END IF;
  
  IF NEW.cantidad_objetivo < 0 THEN
    RAISE EXCEPTION 'La cantidad_objetivo no puede ser negativa: %', NEW.cantidad_objetivo;
  END IF;

  -- Marcar como completado si se alcanzó el objetivo
  IF NEW.cantidad_completada >= NEW.cantidad_objetivo THEN
    NEW.completado := TRUE;
  ELSE
    NEW.completado := FALSE;
  END IF;

  RETURN NEW;
END $$;

-- =============================================================================
-- DULCE CONTROL - V3: Tablas Core de Organización y Acceso
-- Fecha: 2025-10-08
-- Descripción: Sedes, roles, permisos, usuarios y sus relaciones
-- =============================================================================


-- =============================================================================
-- 1. TABLA: sede
-- =============================================================================
-- Representa las diferentes sucursales o puntos de venta
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

COMMENT ON TABLE sede IS 'Sucursales o puntos de venta del sistema';
COMMENT ON COLUMN sede.telefono IS 'Formato: números, espacios, +, paréntesis, guiones (6-20 caracteres)';

-- =============================================================================
-- 2. TABLA: rol
-- =============================================================================
-- Define roles de usuario (admin, cajero, panadero, etc.)
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

COMMENT ON TABLE rol IS 'Roles de usuario en el sistema (admin, cajero, panadero, etc.)';

-- =============================================================================
-- 3. TABLA: permiso
-- =============================================================================
-- Define permisos granulares del sistema
CREATE TABLE IF NOT EXISTS permiso (
  id              BIGSERIAL PRIMARY KEY,
  codigo          VARCHAR(80) UNIQUE NOT NULL,
  descripcion     VARCHAR(250),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER permiso_set_updated_at
BEFORE UPDATE ON permiso FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE permiso IS 'Permisos granulares del sistema';
COMMENT ON COLUMN permiso.codigo IS 'Código único del permiso (ej: pos.abrir_caja, inventario.ajustar)';

-- =============================================================================
-- 4. TABLA: rol_permiso
-- =============================================================================
-- Relación muchos a muchos entre roles y permisos
CREATE TABLE IF NOT EXISTS rol_permiso (
  rol_id      BIGINT NOT NULL REFERENCES rol(id) ON DELETE CASCADE,
  permiso_id  BIGINT NOT NULL REFERENCES permiso(id) ON DELETE CASCADE,
  PRIMARY KEY (rol_id, permiso_id)
);

COMMENT ON TABLE rol_permiso IS 'Asignación de permisos a roles';

-- =============================================================================
-- 5. TABLA: usuario
-- =============================================================================
-- Usuarios del sistema con autenticación
CREATE TABLE IF NOT EXISTS usuario (
  id                BIGSERIAL PRIMARY KEY,
  nombres           VARCHAR(120) NOT NULL,
  apellidos         VARCHAR(120),
  email             CITEXT UNIQUE NOT NULL,
  telefono          VARCHAR(20) CHECK (telefono ~ '^[0-9 +()-]{6,20}$' OR telefono IS NULL),
  contrasena_hash   VARCHAR(200) NOT NULL CHECK (LENGTH(contrasena_hash) >= 60),
  sede_preferida_id BIGINT REFERENCES sede(id),
  activo            BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsqueda rápida por email (trigram)
CREATE INDEX IF NOT EXISTS idx_usuario_email_trgm 
ON usuario USING gin (email gin_trgm_ops);

CREATE TRIGGER usuario_set_updated_at
BEFORE UPDATE ON usuario FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE usuario IS 'Usuarios del sistema con autenticación';
COMMENT ON COLUMN usuario.email IS 'Email único, case-insensitive (tipo CITEXT)';
COMMENT ON COLUMN usuario.contrasena_hash IS 'Hash bcrypt de la contraseña (mínimo 60 caracteres)';

-- =============================================================================
-- 6. TABLA: usuario_rol
-- =============================================================================
-- Asignación de roles a usuarios (un usuario puede tener múltiples roles)
CREATE TABLE IF NOT EXISTS usuario_rol (
  usuario_id  BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  rol_id      BIGINT NOT NULL REFERENCES rol(id) ON DELETE RESTRICT,
  PRIMARY KEY (usuario_id, rol_id)
);

COMMENT ON TABLE usuario_rol IS 'Asignación de roles a usuarios (relación N:M)';

-- =============================================================================
-- 7. TABLA: usuario_sede
-- =============================================================================
-- Sedes a las que tiene acceso cada usuario
CREATE TABLE IF NOT EXISTS usuario_sede (
  usuario_id  BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  sede_id     BIGINT NOT NULL REFERENCES sede(id) ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, sede_id)
);

COMMENT ON TABLE usuario_sede IS 'Sedes a las que un usuario tiene acceso';

-- =============================================================================
-- 8. TABLA: usuario_recuperacion
-- =============================================================================
-- Tokens para recuperación de contraseña
CREATE TABLE IF NOT EXISTS usuario_recuperacion(
  id          BIGSERIAL PRIMARY KEY,
  usuario_id  BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  token       VARCHAR(120) UNIQUE NOT NULL,
  expira_en   TIMESTAMPTZ NOT NULL,
  usado       BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuario_recuperacion_token 
ON usuario_recuperacion(token) WHERE usado = FALSE;

COMMENT ON TABLE usuario_recuperacion IS 'Tokens para recuperación de contraseña';
COMMENT ON COLUMN usuario_recuperacion.expira_en IS 'Fecha de expiración del token';
COMMENT ON COLUMN usuario_recuperacion.usado IS 'Indica si el token ya fue utilizado';

-- =============================================================================
-- DULCE CONTROL - V4: Tablas de Catálogos
-- Fecha: 2025-10-08
-- Descripción: Productos, categorías, insumos, recetas, inventarios y clientes
-- =============================================================================


-- =============================================================================
-- 1. TABLA: categoria_producto
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

COMMENT ON TABLE categoria_producto IS 'Categorías de productos (panes, pasteles, bebidas, etc.)';

-- =============================================================================
-- 2. TABLA: producto
-- =============================================================================
CREATE TABLE IF NOT EXISTS producto (
  id                  BIGSERIAL PRIMARY KEY,
  codigo              VARCHAR(50) UNIQUE NOT NULL,
  nombre              VARCHAR(200) NOT NULL,
  descripcion         TEXT,
  categoria_id        BIGINT REFERENCES categoria_producto(id) ON DELETE SET NULL,
  unidad_medida       VARCHAR(30) NOT NULL DEFAULT 'unidad',
  precio_venta        NUMERIC(12,2) NOT NULL CHECK (precio_venta >= 0),
  visible_storefront  BOOLEAN NOT NULL DEFAULT TRUE,
  slug                VARCHAR(160) UNIQUE,
  activo              BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsqueda
CREATE INDEX IF NOT EXISTS idx_producto_nombre_trgm 
ON producto USING gin (nombre gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_producto_slug 
ON producto(slug) WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_producto_categoria 
ON producto(categoria_id) WHERE categoria_id IS NOT NULL;

CREATE TRIGGER producto_set_updated_at
BEFORE UPDATE ON producto FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE producto IS 'Catálogo de productos de la panadería/pastelería';
COMMENT ON COLUMN producto.slug IS 'URL amigable para e-commerce';
COMMENT ON COLUMN producto.visible_storefront IS 'Visible en tienda online';
COMMENT ON COLUMN producto.unidad_medida IS 'Ejemplos: unidad, kg, lt, docena';

-- =============================================================================
-- 3. TABLA: producto_imagen
-- =============================================================================
CREATE TABLE IF NOT EXISTS producto_imagen(
  id            BIGSERIAL PRIMARY KEY,
  producto_id   BIGINT NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  url           VARCHAR(400) NOT NULL,
  orden         INT NOT NULL DEFAULT 1,
  UNIQUE(producto_id, orden)
);

CREATE INDEX IF NOT EXISTS idx_producto_imagen_prod 
ON producto_imagen(producto_id);

COMMENT ON TABLE producto_imagen IS 'Imágenes de productos (para e-commerce)';
COMMENT ON COLUMN producto_imagen.orden IS 'Orden de visualización de la imagen';

-- =============================================================================
-- 4. TABLA: insumo
-- =============================================================================
CREATE TABLE IF NOT EXISTS insumo (
  id                BIGSERIAL PRIMARY KEY,
  codigo            VARCHAR(50) UNIQUE NOT NULL,
  nombre            VARCHAR(200) NOT NULL,
  descripcion       TEXT,
  unidad_medida     VARCHAR(30) NOT NULL DEFAULT 'unidad',
  costo_referencia  NUMERIC(12,4) CHECK (costo_referencia IS NULL OR costo_referencia >= 0),
  activo            BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_insumo_nombre_trgm 
ON insumo USING gin (nombre gin_trgm_ops);

CREATE TRIGGER insumo_set_updated_at
BEFORE UPDATE ON insumo FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE insumo IS 'Materias primas e insumos para producción';
COMMENT ON COLUMN insumo.costo_referencia IS 'Costo promedio de referencia (opcional)';

-- =============================================================================
-- 5. TABLA: receta
-- =============================================================================
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

COMMENT ON TABLE receta IS 'Recetas de producción de productos';
COMMENT ON COLUMN receta.producto_id IS 'Un producto tiene máximo una receta';

-- =============================================================================
-- 6. TABLA: receta_item
-- =============================================================================
CREATE TABLE IF NOT EXISTS receta_item (
  id              BIGSERIAL PRIMARY KEY,
  receta_id       BIGINT NOT NULL REFERENCES receta(id) ON DELETE CASCADE,
  insumo_id       BIGINT NOT NULL REFERENCES insumo(id) ON DELETE RESTRICT,
  cantidad        NUMERIC(12,4) NOT NULL CHECK (cantidad > 0),
  unidad_medida   VARCHAR(30) NOT NULL,
  UNIQUE (receta_id, insumo_id)
);

CREATE INDEX IF NOT EXISTS idx_receta_item_receta 
ON receta_item(receta_id);

COMMENT ON TABLE receta_item IS 'Ingredientes de cada receta';
COMMENT ON COLUMN receta_item.cantidad IS 'Cantidad del insumo necesaria';

-- =============================================================================
-- 7. TABLA: inventario_producto
-- =============================================================================
CREATE TABLE IF NOT EXISTS inventario_producto (
  sede_id         BIGINT NOT NULL REFERENCES sede(id) ON DELETE CASCADE,
  producto_id     BIGINT NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  stock_actual    NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
  stock_minimo    NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
  PRIMARY KEY (sede_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_inventario_producto_prod 
ON inventario_producto(producto_id);

CREATE INDEX IF NOT EXISTS idx_inventario_bajo_stock 
ON inventario_producto(sede_id, producto_id) 
WHERE stock_actual <= stock_minimo;

COMMENT ON TABLE inventario_producto IS 'Stock de productos por sede';
COMMENT ON COLUMN inventario_producto.stock_minimo IS 'Nivel de alerta de stock bajo';

-- =============================================================================
-- 8. TABLA: inventario_config
-- =============================================================================
CREATE TABLE IF NOT EXISTS inventario_config(
  sede_id       BIGINT NOT NULL REFERENCES sede(id) ON DELETE CASCADE,
  producto_id   BIGINT NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  stock_ideal   NUMERIC(12,3) NOT NULL CHECK (stock_ideal >= 0),
  PRIMARY KEY (sede_id, producto_id)
);

COMMENT ON TABLE inventario_config IS 'Configuración de stock ideal por sede para planificación';

-- =============================================================================
-- 9. TABLA: cliente
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

CREATE INDEX IF NOT EXISTS idx_cliente_nombre_trgm 
ON cliente USING gin (nombre gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_cliente_email 
ON cliente(email) WHERE email IS NOT NULL;

CREATE TRIGGER cliente_set_updated_at
BEFORE UPDATE ON cliente FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE cliente IS 'Registro de clientes (ventas y pedidos)';
COMMENT ON COLUMN cliente.email IS 'Email opcional, case-insensitive';

-- =============================================================================
-- DULCE CONTROL - V5: Tablas Operacionales - POS y Ventas
-- Fecha: 2025-10-08
-- Descripción: Sistema de caja, ventas, items y pagos con cálculos automáticos
-- =============================================================================


-- =============================================================================
-- 1. TABLA: caja_sesion
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

-- Restricción: Solo una caja abierta por sede
CREATE UNIQUE INDEX IF NOT EXISTS unq_caja_abierta_por_sede
ON caja_sesion(sede_id) WHERE (cierre_at IS NULL);

CREATE INDEX IF NOT EXISTS idx_caja_sesion_sede 
ON caja_sesion(sede_id);

CREATE INDEX IF NOT EXISTS idx_caja_sesion_apertura 
ON caja_sesion(apertura_at);

CREATE TRIGGER caja_sesion_set_updated_at
BEFORE UPDATE ON caja_sesion FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE caja_sesion IS 'Sesiones de caja (apertura/cierre) por sede';
COMMENT ON INDEX unq_caja_abierta_por_sede IS 'Garantiza una sola caja abierta por sede';

-- =============================================================================
-- 2. TABLA: venta
-- =============================================================================
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

-- Restricción: Comprobante único
CREATE UNIQUE INDEX IF NOT EXISTS unq_comprobante
ON venta(comprobante_tipo, comprobante_serie, comprobante_numero)
WHERE (comprobante_tipo IS NOT NULL AND comprobante_serie IS NOT NULL AND comprobante_numero IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_venta_fecha 
ON venta(fecha);

CREATE INDEX IF NOT EXISTS idx_venta_sede 
ON venta(sede_id);

CREATE INDEX IF NOT EXISTS idx_venta_caja 
ON venta(caja_sesion_id) WHERE caja_sesion_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_venta_estado 
ON venta(estado, fecha);

CREATE TRIGGER venta_set_updated_at
BEFORE UPDATE ON venta FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE venta IS 'Registro de ventas del POS';
COMMENT ON COLUMN venta.sunat_estado IS 'Estado de envío a SUNAT (para facturación electrónica)';
COMMENT ON INDEX unq_comprobante IS 'Garantiza unicidad de comprobantes emitidos';

-- =============================================================================
-- 3. TABLA: venta_item
-- =============================================================================
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

CREATE INDEX IF NOT EXISTS idx_venta_item_venta 
ON venta_item(venta_id);

CREATE INDEX IF NOT EXISTS idx_venta_item_producto 
ON venta_item(producto_id);

-- Trigger: Calcular total_item antes de insertar/actualizar
CREATE TRIGGER venta_item_before_ins_upd
BEFORE INSERT OR UPDATE ON venta_item FOR EACH ROW
EXECUTE FUNCTION dulce_control.calcular_total_item_venta();

-- Trigger: Recalcular totales de venta después de cambios en items
CREATE TRIGGER venta_item_after_change
AFTER INSERT OR UPDATE OR DELETE ON venta_item FOR EACH ROW
EXECUTE FUNCTION dulce_control.recalcular_totales_venta();

COMMENT ON TABLE venta_item IS 'Líneas de detalle de cada venta';
COMMENT ON COLUMN venta_item.total_item IS 'Calculado automáticamente por trigger';

-- =============================================================================
-- 4. TABLA: pago_venta
-- =============================================================================
CREATE TABLE IF NOT EXISTS pago_venta (
  id              BIGSERIAL PRIMARY KEY,
  venta_id        BIGINT NOT NULL REFERENCES venta(id) ON DELETE CASCADE,
  metodo_pago     VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('efectivo','yape','plin','tarjeta')),
  monto           NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  referencia      VARCHAR(120),
  recibido_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pago_venta_venta 
ON pago_venta(venta_id);

CREATE INDEX IF NOT EXISTS idx_pago_venta_metodo 
ON pago_venta(metodo_pago);

CREATE INDEX IF NOT EXISTS idx_pago_venta_fecha 
ON pago_venta(recibido_at);

COMMENT ON TABLE pago_venta IS 'Registros de pago de ventas (soporta pagos mixtos)';
COMMENT ON COLUMN pago_venta.referencia IS 'Número de operación para pagos digitales';

-- =============================================================================
-- DULCE CONTROL - V6: Sistema de Pedidos
-- Fecha: 2025-10-08
-- Descripción: Pedidos personalizados (local/online), pagos parciales, adjuntos
-- =============================================================================


-- =============================================================================
-- 1. TABLA: pedido
-- =============================================================================
CREATE TABLE IF NOT EXISTS pedido (
  id                     BIGSERIAL PRIMARY KEY,
  sede_id                BIGINT NOT NULL REFERENCES sede(id) ON DELETE RESTRICT,
  cliente_id             BIGINT REFERENCES cliente(id) ON DELETE SET NULL,
  fecha_creacion         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_entrega          DATE,
  hora_entrega           TIME,
  estado                 VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                          CHECK (estado IN ('pendiente','en_preparacion','listo','entregado','anulado')),
  origen                 VARCHAR(20) NOT NULL DEFAULT 'local'
                          CHECK (origen IN ('local','online')),
  pago_online_estado     VARCHAR(20)
                          CHECK (pago_online_estado IN ('pendiente','pagado','fallido') OR pago_online_estado IS NULL),
  pago_online_referencia VARCHAR(120),
  observaciones          TEXT,
  creado_en              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_pedido_fecha_entrega CHECK (fecha_entrega IS NULL OR fecha_entrega >= CURRENT_DATE)
);

CREATE INDEX IF NOT EXISTS idx_pedido_sede_estado 
ON pedido(sede_id, estado);

CREATE INDEX IF NOT EXISTS idx_pedido_fecha_creacion 
ON pedido(fecha_creacion);

CREATE INDEX IF NOT EXISTS idx_pedido_fecha_entrega 
ON pedido(fecha_entrega) WHERE fecha_entrega IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pedido_origen 
ON pedido(origen, estado);

CREATE TRIGGER pedido_set_updated_at
BEFORE UPDATE ON pedido FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

-- Trigger: Validar máquina de estados
CREATE TRIGGER pedido_validar_estado
BEFORE INSERT OR UPDATE ON pedido FOR EACH ROW
EXECUTE FUNCTION dulce_control.validar_cambio_estado_pedido();

COMMENT ON TABLE pedido IS 'Pedidos personalizados (locales y online)';
COMMENT ON COLUMN pedido.origen IS 'local: pedido en tienda, online: desde web/app';
COMMENT ON COLUMN pedido.pago_online_estado IS 'Estado de pago online (pasarelas de pago)';

-- =============================================================================
-- 2. TABLA: pedido_item
-- =============================================================================
CREATE TABLE IF NOT EXISTS pedido_item (
  id              BIGSERIAL PRIMARY KEY,
  pedido_id       BIGINT NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
  producto_id     BIGINT NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
  cantidad        NUMERIC(12,3) NOT NULL CHECK (cantidad > 0),
  precio_unitario NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal        NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
  UNIQUE (pedido_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_pedido_item_pedido 
ON pedido_item(pedido_id);

CREATE INDEX IF NOT EXISTS idx_pedido_item_producto 
ON pedido_item(producto_id);

COMMENT ON TABLE pedido_item IS 'Productos incluidos en cada pedido';

-- =============================================================================
-- 3. TABLA: pago_pedido
-- =============================================================================
CREATE TABLE IF NOT EXISTS pago_pedido (
  id              BIGSERIAL PRIMARY KEY,
  pedido_id       BIGINT NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
  metodo_pago     VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('efectivo','yape','plin','tarjeta')),
  monto           NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  referencia      VARCHAR(120),
  pagado_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pago_pedido_pedido 
ON pago_pedido(pedido_id);

CREATE INDEX IF NOT EXISTS idx_pago_pedido_metodo 
ON pago_pedido(metodo_pago);

CREATE INDEX IF NOT EXISTS idx_pago_pedido_fecha 
ON pago_pedido(pagado_at);

COMMENT ON TABLE pago_pedido IS 'Pagos de pedidos (soporta pagos parciales y adelantos)';
COMMENT ON COLUMN pago_pedido.referencia IS 'Número de operación para pagos digitales';

-- =============================================================================
-- 4. TABLA: pedido_adjunto
-- =============================================================================
CREATE TABLE IF NOT EXISTS pedido_adjunto (
  id              BIGSERIAL PRIMARY KEY,
  pedido_id       BIGINT NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
  ruta_archivo    VARCHAR(400) NOT NULL,
  tipo_mime       VARCHAR(80),
  tamano_bytes    BIGINT CHECK (tamano_bytes IS NULL OR tamano_bytes >= 0),
  subido_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedido_adjunto_pedido 
ON pedido_adjunto(pedido_id);

CREATE INDEX IF NOT EXISTS idx_pedido_adjunto_fecha 
ON pedido_adjunto(subido_at);

COMMENT ON TABLE pedido_adjunto IS 'Archivos adjuntos a pedidos (diseños, referencias, fotos)';
COMMENT ON COLUMN pedido_adjunto.ruta_archivo IS 'Ruta relativa o URL del archivo almacenado';

-- =============================================================================
-- 5. TABLA: pedido_entrega
-- =============================================================================
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

CREATE INDEX IF NOT EXISTS idx_pedido_entrega_modalidad 
ON pedido_entrega(modalidad);

COMMENT ON TABLE pedido_entrega IS 'Información de entrega de pedidos (retiro o delivery)';
COMMENT ON COLUMN pedido_entrega.modalidad IS 'retiro: cliente recoge en tienda, delivery: envío a domicilio';
COMMENT ON COLUMN pedido_entrega.referencia IS 'Referencias adicionales para ubicar la dirección';

-- =============================================================================
-- DULCE CONTROL - V7: Sistema de Planificación de Producción
-- Fecha: 2025-10-08
-- Descripción: Conteos matutinos y planes de producción diarios
-- =============================================================================


-- =============================================================================
-- 1. TABLA: conteo_matutino
-- =============================================================================
CREATE TABLE IF NOT EXISTS conteo_matutino(
  id          BIGSERIAL PRIMARY KEY,
  sede_id     BIGINT NOT NULL REFERENCES sede(id) ON DELETE RESTRICT,
  usuario_id  BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
  fecha       DATE NOT NULL DEFAULT CURRENT_DATE,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(sede_id, fecha)
);

CREATE INDEX IF NOT EXISTS idx_conteo_matutino_sede_fecha 
ON conteo_matutino(sede_id, fecha);

CREATE INDEX IF NOT EXISTS idx_conteo_matutino_fecha 
ON conteo_matutino(fecha);

COMMENT ON TABLE conteo_matutino IS 'Registro de conteos de inventario al inicio del día';
COMMENT ON CONSTRAINT conteo_matutino_sede_id_fecha_key ON conteo_matutino 
IS 'Un solo conteo por sede por día';

-- =============================================================================
-- 2. TABLA: conteo_matutino_item
-- =============================================================================
CREATE TABLE IF NOT EXISTS conteo_matutino_item(
  id          BIGSERIAL PRIMARY KEY,
  conteo_id   BIGINT NOT NULL REFERENCES conteo_matutino(id) ON DELETE CASCADE,
  producto_id BIGINT NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
  cantidad    NUMERIC(12,3) NOT NULL CHECK (cantidad >= 0),
  UNIQUE(conteo_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_conteo_item_conteo 
ON conteo_matutino_item(conteo_id);

CREATE INDEX IF NOT EXISTS idx_conteo_item_producto 
ON conteo_matutino_item(producto_id);

COMMENT ON TABLE conteo_matutino_item IS 'Detalle de productos contados en cada conteo matutino';

-- =============================================================================
-- 3. TABLA: plan_produccion
-- =============================================================================
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

CREATE INDEX IF NOT EXISTS idx_plan_produccion_sede_fecha 
ON plan_produccion(sede_id, fecha);

CREATE INDEX IF NOT EXISTS idx_plan_produccion_fecha 
ON plan_produccion(fecha);

CREATE INDEX IF NOT EXISTS idx_plan_produccion_confirmado 
ON plan_produccion(confirmado, fecha);

CREATE TRIGGER plan_produccion_set_updated_at
BEFORE UPDATE ON plan_produccion FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE plan_produccion IS 'Plan de producción diario por sede';
COMMENT ON COLUMN plan_produccion.confirmado IS 'Indica si el plan fue aprobado para ejecución';
COMMENT ON CONSTRAINT plan_produccion_sede_id_fecha_key ON plan_produccion 
IS 'Un solo plan de producción por sede por día';

-- =============================================================================
-- 4. TABLA: plan_produccion_item
-- =============================================================================
CREATE TABLE IF NOT EXISTS plan_produccion_item(
  id                   BIGSERIAL PRIMARY KEY,
  plan_id              BIGINT NOT NULL REFERENCES plan_produccion(id) ON DELETE CASCADE,
  producto_id          BIGINT NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
  cantidad_objetivo    NUMERIC(12,3) NOT NULL CHECK (cantidad_objetivo >= 0),
  cantidad_completada  NUMERIC(12,3) NOT NULL DEFAULT 0 CHECK (cantidad_completada >= 0),
  completado           BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(plan_id, producto_id)
);

CREATE INDEX IF NOT EXISTS idx_plan_item_plan 
ON plan_produccion_item(plan_id);

CREATE INDEX IF NOT EXISTS idx_plan_item_producto 
ON plan_produccion_item(producto_id);

CREATE INDEX IF NOT EXISTS idx_plan_item_completado 
ON plan_produccion_item(plan_id, completado);

-- Trigger: Automarcar como completado cuando se alcanza el objetivo
CREATE TRIGGER plan_item_autocomplete_before
BEFORE INSERT OR UPDATE ON plan_produccion_item FOR EACH ROW
EXECUTE FUNCTION dulce_control.plan_item_autocompletar();

COMMENT ON TABLE plan_produccion_item IS 'Items del plan de producción con seguimiento de avance';
COMMENT ON COLUMN plan_produccion_item.completado IS 'Se marca automáticamente TRUE cuando cantidad_completada >= cantidad_objetivo';

-- =============================================================================
-- DULCE CONTROL - V8: Sistema de Compras y Gastos
-- Fecha: 2025-10-08
-- Descripción: Proveedores, compras de insumos y gastos operativos
-- =============================================================================


-- =============================================================================
-- 1. TABLA: proveedor
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

CREATE INDEX IF NOT EXISTS idx_proveedor_razon_trgm 
ON proveedor USING gin (razon_social gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_proveedor_ruc 
ON proveedor(ruc) WHERE ruc IS NOT NULL;

CREATE TRIGGER proveedor_set_updated_at
BEFORE UPDATE ON proveedor FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE proveedor IS 'Proveedores de insumos y servicios';
COMMENT ON COLUMN proveedor.ruc IS 'RUC del proveedor (Registro Único de Contribuyentes - Perú)';

-- =============================================================================
-- 2. TABLA: compra
-- =============================================================================
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

CREATE INDEX IF NOT EXISTS idx_compra_sede_fecha 
ON compra(sede_id, fecha);

CREATE INDEX IF NOT EXISTS idx_compra_fecha 
ON compra(fecha);

CREATE INDEX IF NOT EXISTS idx_compra_proveedor 
ON compra(proveedor_id) WHERE proveedor_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_compra_estado 
ON compra(estado, fecha);

CREATE TRIGGER compra_set_updated_at
BEFORE UPDATE ON compra FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE compra IS 'Registro de compras de insumos';
COMMENT ON COLUMN compra.estado IS 'registrada: activa, anulada: cancelada o devuelta';

-- =============================================================================
-- 3. TABLA: compra_insumo_item
-- =============================================================================
CREATE TABLE IF NOT EXISTS compra_insumo_item (
  id              BIGSERIAL PRIMARY KEY,
  compra_id       BIGINT NOT NULL REFERENCES compra(id) ON DELETE CASCADE,
  insumo_id       BIGINT NOT NULL REFERENCES insumo(id) ON DELETE RESTRICT,
  cantidad        NUMERIC(12,4) NOT NULL CHECK (cantidad > 0),
  costo_unitario  NUMERIC(12,4) NOT NULL CHECK (costo_unitario >= 0),
  subtotal        NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
  UNIQUE (compra_id, insumo_id)
);

CREATE INDEX IF NOT EXISTS idx_compra_insumo_item_compra 
ON compra_insumo_item(compra_id);

CREATE INDEX IF NOT EXISTS idx_compra_insumo_item_insumo 
ON compra_insumo_item(insumo_id);

COMMENT ON TABLE compra_insumo_item IS 'Detalle de insumos comprados en cada compra';
COMMENT ON COLUMN compra_insumo_item.costo_unitario IS 'Costo unitario pagado en esta compra específica';

-- =============================================================================
-- 4. TABLA: gasto
-- =============================================================================
CREATE TABLE IF NOT EXISTS gasto (
  id                  BIGSERIAL PRIMARY KEY,
  sede_id             BIGINT NOT NULL REFERENCES sede(id) ON DELETE RESTRICT,
  fecha               DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria           VARCHAR(60) NOT NULL,
  descripcion         VARCHAR(250),
  monto               NUMERIC(12,2) NOT NULL CHECK (monto > 0),
  comprobante_tipo    VARCHAR(20) CHECK (comprobante_tipo IN ('boleta','factura','ninguno') OR comprobante_tipo IS NULL),
  comprobante_serie   VARCHAR(10),
  comprobante_numero  VARCHAR(20),
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gasto_sede_fecha 
ON gasto(sede_id, fecha);

CREATE INDEX IF NOT EXISTS idx_gasto_fecha 
ON gasto(fecha);

CREATE INDEX IF NOT EXISTS idx_gasto_categoria 
ON gasto(categoria, fecha);

CREATE TRIGGER gasto_set_updated_at
BEFORE UPDATE ON gasto FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE gasto IS 'Registro de gastos operativos (servicios, alquileres, etc.)';
COMMENT ON COLUMN gasto.categoria IS 'Categoría del gasto: servicios, alquiler, mantenimiento, publicidad, etc.';
COMMENT ON COLUMN gasto.comprobante_tipo IS 'ninguno: para gastos menores sin comprobante formal';

-- =============================================================================
-- DULCE CONTROL - V9: Vistas de Reporte y Optimizaciones
-- Fecha: 2025-10-08
-- Descripción: Vistas para reportes y análisis de negocio
-- =============================================================================


-- =============================================================================
-- 1. VISTA: Resumen de pagos por venta
-- =============================================================================
CREATE OR REPLACE VIEW vw_resumen_venta_pago AS
SELECT 
  v.id AS venta_id,
  v.fecha,
  v.sede_id,
  v.estado,
  v.subtotal,
  v.impuesto,
  v.total,
  COALESCE(SUM(pv.monto) FILTER (WHERE pv.metodo_pago = 'efectivo'), 0) AS efectivo,
  COALESCE(SUM(pv.monto) FILTER (WHERE pv.metodo_pago = 'yape'), 0) AS yape,
  COALESCE(SUM(pv.monto) FILTER (WHERE pv.metodo_pago = 'plin'), 0) AS plin,
  COALESCE(SUM(pv.monto) FILTER (WHERE pv.metodo_pago = 'tarjeta'), 0) AS tarjeta,
  COALESCE(SUM(pv.monto), 0) AS total_pagado
FROM venta v
LEFT JOIN pago_venta pv ON pv.venta_id = v.id
GROUP BY v.id, v.fecha, v.sede_id, v.estado, v.subtotal, v.impuesto, v.total;

COMMENT ON VIEW vw_resumen_venta_pago IS 
'Resumen de ventas con desglose de métodos de pago';

-- =============================================================================
-- 2. VISTA: Totales y saldo de pedidos
-- =============================================================================
CREATE OR REPLACE VIEW vw_pedido_totales AS
SELECT 
  p.id AS pedido_id,
  p.sede_id,
  p.cliente_id,
  p.estado,
  p.fecha_creacion,
  p.fecha_entrega,
  COALESCE(SUM(pi.subtotal), 0) AS total_pedido,
  COALESCE(pe.costo_envio, 0) AS costo_envio,
  COALESCE(SUM(pi.subtotal), 0) + COALESCE(pe.costo_envio, 0) AS total_con_envio,
  COALESCE(SUM(pp.monto), 0) AS total_pagado,
  (COALESCE(SUM(pi.subtotal), 0) + COALESCE(pe.costo_envio, 0)) - COALESCE(SUM(pp.monto), 0) AS saldo_pendiente
FROM pedido p
LEFT JOIN pedido_item pi ON pi.pedido_id = p.id
LEFT JOIN pago_pedido pp ON pp.pedido_id = p.id
LEFT JOIN pedido_entrega pe ON pe.pedido_id = p.id
GROUP BY p.id, p.sede_id, p.cliente_id, p.estado, p.fecha_creacion, p.fecha_entrega, pe.costo_envio;

COMMENT ON VIEW vw_pedido_totales IS 
'Resumen de pedidos con totales, pagos y saldo pendiente';

-- =============================================================================
-- 3. VISTA: Progreso de planes de producción
-- =============================================================================
CREATE OR REPLACE VIEW vw_plan_produccion_progreso AS
SELECT 
  pl.id AS plan_id,
  pl.sede_id,
  pl.fecha,
  pl.confirmado,
  COUNT(ppi.id) AS total_productos,
  COUNT(ppi.id) FILTER (WHERE ppi.completado = TRUE) AS productos_completados,
  COUNT(ppi.id) FILTER (WHERE ppi.completado = FALSE) AS productos_pendientes,
  CASE 
    WHEN COUNT(ppi.id) = 0 THEN 0
    ELSE ROUND((COUNT(ppi.id) FILTER (WHERE ppi.completado = TRUE)::NUMERIC / COUNT(ppi.id)::NUMERIC) * 100, 2)
  END AS porcentaje_completado,
  SUM(ppi.cantidad_objetivo) AS cantidad_objetivo_total,
  SUM(ppi.cantidad_completada) AS cantidad_completada_total
FROM plan_produccion pl
LEFT JOIN plan_produccion_item ppi ON ppi.plan_id = pl.id
GROUP BY pl.id, pl.sede_id, pl.fecha, pl.confirmado;

COMMENT ON VIEW vw_plan_produccion_progreso IS 
'Resumen del progreso de planes de producción por día';

-- =============================================================================
-- 4. VISTA: Inventario con alertas de stock bajo
-- =============================================================================
CREATE OR REPLACE VIEW vw_inventario_alertas AS
SELECT 
  ip.sede_id,
  s.nombre AS sede_nombre,
  ip.producto_id,
  p.codigo AS producto_codigo,
  p.nombre AS producto_nombre,
  ip.stock_actual,
  ip.stock_minimo,
  ic.stock_ideal,
  CASE 
    WHEN ip.stock_actual <= ip.stock_minimo THEN 'CRÍTICO'
    WHEN ip.stock_actual <= (ip.stock_minimo * 1.5) THEN 'BAJO'
    WHEN ic.stock_ideal IS NOT NULL AND ip.stock_actual < ic.stock_ideal THEN 'REABASTECER'
    ELSE 'OK'
  END AS estado_stock,
  CASE 
    WHEN ic.stock_ideal IS NOT NULL THEN ic.stock_ideal - ip.stock_actual
    ELSE NULL
  END AS cantidad_sugerida_producir
FROM inventario_producto ip
INNER JOIN producto p ON p.id = ip.producto_id
INNER JOIN sede s ON s.id = ip.sede_id
LEFT JOIN inventario_config ic ON ic.sede_id = ip.sede_id AND ic.producto_id = ip.producto_id
WHERE p.activo = TRUE;

COMMENT ON VIEW vw_inventario_alertas IS 
'Inventario con alertas de stock bajo y sugerencias de producción';

-- =============================================================================
-- 5. VISTA: Resumen de ventas diarias por sede
-- =============================================================================
CREATE OR REPLACE VIEW vw_ventas_diarias AS
SELECT 
  v.sede_id,
  s.nombre AS sede_nombre,
  DATE(v.fecha) AS fecha,
  COUNT(v.id) AS total_ventas,
  COUNT(v.id) FILTER (WHERE v.estado = 'emitida') AS ventas_emitidas,
  COUNT(v.id) FILTER (WHERE v.estado = 'anulada') AS ventas_anuladas,
  COALESCE(SUM(v.total) FILTER (WHERE v.estado = 'emitida'), 0) AS total_ingresos,
  COALESCE(AVG(v.total) FILTER (WHERE v.estado = 'emitida'), 0) AS ticket_promedio
FROM venta v
INNER JOIN sede s ON s.id = v.sede_id
GROUP BY v.sede_id, s.nombre, DATE(v.fecha);

COMMENT ON VIEW vw_ventas_diarias IS 
'Resumen de ventas diarias por sede con métricas clave';

-- =============================================================================
-- 6. VISTA: Top productos más vendidos
-- =============================================================================
CREATE OR REPLACE VIEW vw_productos_top_ventas AS
SELECT 
  p.id AS producto_id,
  p.codigo,
  p.nombre,
  p.categoria_id,
  c.nombre AS categoria_nombre,
  SUM(vi.cantidad) AS cantidad_total_vendida,
  COUNT(DISTINCT vi.venta_id) AS numero_ventas,
  SUM(vi.total_item) AS ingresos_totales,
  AVG(vi.precio_unitario) AS precio_promedio
FROM venta_item vi
INNER JOIN producto p ON p.id = vi.producto_id
INNER JOIN venta v ON v.id = vi.venta_id
LEFT JOIN categoria_producto c ON c.id = p.categoria_id
WHERE v.estado = 'emitida'
  AND v.fecha >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.id, p.codigo, p.nombre, p.categoria_id, c.nombre
ORDER BY cantidad_total_vendida DESC;

COMMENT ON VIEW vw_productos_top_ventas IS 
'Productos más vendidos en los últimos 30 días';

-- =============================================================================
-- ÍNDICES ADICIONALES DE OPTIMIZACIÓN
-- =============================================================================

-- Optimizar búsquedas de ventas por rango de fechas
CREATE INDEX IF NOT EXISTS idx_venta_fecha_estado 
ON venta(fecha, estado) WHERE estado = 'emitida';

-- Optimizar búsquedas de pedidos por estado y fecha de entrega
CREATE INDEX IF NOT EXISTS idx_pedido_estado_entrega 
ON pedido(estado, fecha_entrega) WHERE estado NOT IN ('entregado', 'anulado');

-- Optimizar consultas de inventario bajo
CREATE INDEX IF NOT EXISTS idx_inventario_stock_critico 
ON inventario_producto(sede_id, producto_id) 
WHERE stock_actual <= stock_minimo;

-- =============================================================================
-- DULCE CONTROL - V10: Tabla de Registros de Clientes
-- Fecha: 2025-10-09
-- Descripción: Gestión de registros de clientes con autenticación JWT
-- =============================================================================


-- =============================================================================
-- TABLA: registros
-- =============================================================================
-- Almacena registros de clientes con credenciales y tokens de acceso
CREATE TABLE IF NOT EXISTS registros (
  idregistro      SERIAL PRIMARY KEY,
  nombres         VARCHAR(255) NOT NULL,
  apellidos       VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  cliente_id      VARCHAR(255) NOT NULL,
  llave_secreta   VARCHAR(255) NOT NULL,
  access_token    VARCHAR(255),
  estado          INTEGER NOT NULL DEFAULT 1
);

-- Índices para optimizar consultas
CREATE INDEX idx_registros_email ON registros(email);
CREATE INDEX idx_registros_cliente_id ON registros(cliente_id);
CREATE INDEX idx_registros_access_token ON registros(access_token);
CREATE INDEX idx_registros_estado ON registros(estado);

-- Comentarios descriptivos
COMMENT ON TABLE registros IS 'Registros de clientes con autenticación JWT';
COMMENT ON COLUMN registros.idregistro IS 'ID autoincremental del registro';
COMMENT ON COLUMN registros.nombres IS 'Nombres del cliente';
COMMENT ON COLUMN registros.apellidos IS 'Apellidos del cliente';
COMMENT ON COLUMN registros.email IS 'Correo electrónico del cliente';
COMMENT ON COLUMN registros.cliente_id IS 'ID único generado con SHA-256 (nombres + apellidos + email)';
COMMENT ON COLUMN registros.llave_secreta IS 'Contraseña encriptada con BCrypt';
COMMENT ON COLUMN registros.access_token IS 'Token JWT para autenticación';
COMMENT ON COLUMN registros.estado IS 'Estado del registro (1=activo, 0=inactivo/eliminado)';
