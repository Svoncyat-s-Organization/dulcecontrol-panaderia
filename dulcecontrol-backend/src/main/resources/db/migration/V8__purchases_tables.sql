-- =============================================================================
-- DULCE CONTROL - V8: Sistema de Compras y Gastos
-- Fecha: 2025-10-08
-- Descripción: Proveedores, compras de insumos y gastos operativos
-- =============================================================================

SET search_path = dulce_control, public;

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
