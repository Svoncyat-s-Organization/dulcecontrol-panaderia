-- =================================
-- TABLAS PARA EL SUPERADMINISTRADOR
-- =================================

CREATE TABLE IF NOT EXISTS tiendas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL,
    tipo_doc ENUM('DNI', 'RUC') NOT NULL,
    numero_doc VARCHAR(20) NOT NULL UNIQUE,
    nombre_doc VARCHAR(255) NOT NULL,
    nombre_comercial VARCHAR(255),
    correo_contacto VARCHAR(255) NOT NULL,
    telefono_contacto VARCHAR(50),
    hash_contrasena VARCHAR(255) NOT NULL,
    estado ENUM('EN_PRUEBA', 'ACTIVA', 'SUSPENDIDA', 'CANCELADA') NOT NULL DEFAULT 'EN_PRUEBA',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado_en DATETIME
);

CREATE TABLE IF NOT EXISTS sedes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    codigo_interno VARCHAR(50),
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(50),
    distrito_id BIGINT,
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado_en DATETIME,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (distrito_id) REFERENCES ubigeo_distritos(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS dominios_tienda (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    tipo ENUM('ADMINISTRATIVO', 'TIENDA_VIRTUAL') NOT NULL DEFAULT 'TIENDA_VIRTUAL',
    url_dominio VARCHAR(255) NOT NULL UNIQUE,
    url_logo TEXT,
    url_favicon TEXT,
    color_primario VARCHAR(7) NOT NULL DEFAULT '#000000',
    color_secundario VARCHAR(7) NOT NULL DEFAULT '#ffffff',
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE
);

-- ====================================
-- ÍNDICES TIENDAS SUPERADMINISTRADOR
-- ====================================

CREATE INDEX idx_tiendas_busqueda
    ON tiendas(numero_doc, nombre_comercial);

CREATE INDEX idx_sedes_tienda_activas
    ON sedes(tienda_id, activo, eliminado_en);

CREATE INDEX idx_dominios_tienda
    ON dominios_tienda(tienda_id, tipo);

-- Tablero
CREATE INDEX idx_tiendas_estado_activo
    ON tiendas(estado, eliminado_en);
