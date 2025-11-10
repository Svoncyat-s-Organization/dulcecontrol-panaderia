-- =================================
-- TABLAS PARA EL SUPERADMINISTRADOR
-- =================================

-- Seguridad
CREATE TABLE IF NOT EXISTS usuarios_superadmin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(255) NOT NULL UNIQUE,
    hash_contrasena VARCHAR(255) NOT NULL,
    tipo_doc ENUM('DNI', 'RUC') NOT NULL,
    numero_doc VARCHAR(20),
    nombres_doc VARCHAR(255),
    telefono VARCHAR(50),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado_en DATETIME
);

CREATE TABLE IF NOT EXISTS actividad_superadmin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT,
    tipo_evento VARCHAR(100) NOT NULL,
    ip_origen VARCHAR(45),
    detalles JSON,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES usuarios_superadmin(id) ON DELETE SET NULL
);

-- ====================================
-- ÍNDICES SEGURIDAD SUPERADMINISTRADOR
-- ====================================

CREATE INDEX idx_actividad_superadmin_fecha
    ON actividad_superadmin(admin_id, creado_en DESC);

CREATE INDEX idx_usuarios_superadmin_correo
    ON usuarios_superadmin(correo, activo, eliminado_en);
