-- =================================
-- ROLES Y PERMISOS SUPERADMIN
-- =================================

CREATE TABLE IF NOT EXISTS permisos_superadmin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(150) NOT NULL UNIQUE,
    nombre_visible VARCHAR(255) NOT NULL,
    modulo VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS roles_superadmin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL UNIQUE,
    descripcion VARCHAR(500),
    es_sistema BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles_superadmin_permisos (
    rol_id BIGINT NOT NULL,
    permiso_id BIGINT NOT NULL,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES roles_superadmin(id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos_superadmin(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usuarios_superadmin_roles (
    usuario_id BIGINT NOT NULL,
    rol_id BIGINT NOT NULL,
    PRIMARY KEY (usuario_id, rol_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios_superadmin(id) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles_superadmin(id) ON DELETE CASCADE
);

CREATE INDEX idx_roles_superadmin_nombre
    ON roles_superadmin(nombre);

CREATE INDEX idx_permisos_superadmin_slug
    ON permisos_superadmin(slug);
