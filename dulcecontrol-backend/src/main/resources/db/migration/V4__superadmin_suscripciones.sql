-- =================================
-- TABLAS PARA EL SUPERADMINISTRADOR
-- =================================

CREATE TABLE IF NOT EXISTS planes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_mensual_centimos BIGINT NOT NULL,
    precio_anual_centimos BIGINT NOT NULL,
    moneda CHAR(3) NOT NULL DEFAULT 'PEN',
    limites JSON NOT NULL DEFAULT (JSON_OBJECT()),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suscripciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    ciclo ENUM('MENSUAL', 'ANUAL') NOT NULL DEFAULT 'MENSUAL',
    precio_pactado_centimos BIGINT NOT NULL,
    fecha_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATETIME NOT NULL,
    estado ENUM('EN_PRUEBA', 'ACTIVA', 'VENCIDA', 'CANCELADA') NOT NULL DEFAULT 'EN_PRUEBA',
    autorenovar BOOLEAN NOT NULL DEFAULT TRUE,
    cancelado_en DATETIME,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE RESTRICT,
    FOREIGN KEY (plan_id) REFERENCES planes(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS historial_suscripciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    suscripcion_id BIGINT NOT NULL,
    plan_anterior_id BIGINT,
    plan_nuevo_id BIGINT NOT NULL,
    tipo_movimiento ENUM('ALTA', 'RENOVACION', 'UPGRADE', 'DOWNGRADE', 'CANCELACION', 'REACTIVACION') NOT NULL,
    precio_anterior_centimos BIGINT,
    precio_nuevo_centimos BIGINT NOT NULL,
    fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_responsable_id BIGINT,
    FOREIGN KEY (suscripcion_id) REFERENCES suscripciones(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_anterior_id) REFERENCES planes(id),
    FOREIGN KEY (plan_nuevo_id) REFERENCES planes(id)
);

-- ========================================
-- ÍNDICES SUSCRIPCIONES SUPERADMINISTRADOR
-- ========================================

CREATE INDEX idx_planes_activos
    ON planes(activo, codigo);

CREATE INDEX idx_suscripciones_tienda
    ON suscripciones(tienda_id, estado, fecha_fin DESC);

CREATE INDEX idx_historial_suscripciones_lookup
    ON historial_suscripciones(suscripcion_id, fecha_movimiento DESC);

-- Tablero
CREATE INDEX idx_suscripciones_estado_fecha
    ON suscripciones(estado, fecha_fin DESC);
