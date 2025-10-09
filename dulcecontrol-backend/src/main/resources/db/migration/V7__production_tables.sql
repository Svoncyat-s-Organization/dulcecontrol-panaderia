-- =============================================================================
-- DULCE CONTROL - V7: Sistema de Planificación de Producción
-- Fecha: 2025-10-08
-- Descripción: Conteos matutinos y planes de producción diarios
-- =============================================================================

SET search_path = dulce_control, public;

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
