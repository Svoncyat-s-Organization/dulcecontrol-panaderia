-- =============================================================================
-- DULCE CONTROL - V5: Tablas Operacionales - POS y Ventas
-- Fecha: 2025-10-08
-- Descripción: Sistema de caja, ventas, items y pagos con cálculos automáticos
-- =============================================================================

SET search_path = dulce_control, public;

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
