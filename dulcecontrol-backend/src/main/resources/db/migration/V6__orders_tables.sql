-- =============================================================================
-- DULCE CONTROL - V6: Sistema de Pedidos
-- Fecha: 2025-10-08
-- Descripción: Pedidos personalizados (local/online), pagos parciales, adjuntos
-- =============================================================================

SET search_path = dulce_control, public;

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
