-- =============================================================================
-- DULCE CONTROL - V4: Tablas de Catálogos
-- Fecha: 2025-10-08
-- Descripción: Productos, categorías, insumos, recetas, inventarios y clientes
-- =============================================================================

SET search_path = dulce_control, public;

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
