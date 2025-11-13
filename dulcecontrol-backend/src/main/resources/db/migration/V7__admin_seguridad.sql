-- =================================
--   TABLAS PARA EL ADMINISTRADOR
-- =================================
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    es_sistema BOOLEAN DEFAULT FALSE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, nombre),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS permisos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    nombre_visible VARCHAR(100) NOT NULL,
    modulo VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS roles_permisos (
    rol_id BIGINT NOT NULL,
    permiso_id BIGINT NOT NULL,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES roles (id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usuarios_tienda (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    rol_id BIGINT NOT NULL,
    correo VARCHAR(255) NOT NULL,
    hash_contrasena VARCHAR(255) NOT NULL,
    tipo_doc ENUM ('DNI', 'RUC') NOT NULL,
    numero_doc VARCHAR(20) NOT NULL,
    nombres_doc VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_acceso_en DATETIME,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado_en DATETIME,
    UNIQUE (tienda_id, correo),
    UNIQUE (tienda_id, numero_doc),
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles (id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS usuario_sedes (
    usuario_id BIGINT NOT NULL,
    sede_id BIGINT NOT NULL,
    es_sede_principal BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (usuario_id, sede_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios_tienda (id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auditoria_usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    usuario_id BIGINT,
    accion VARCHAR(100) NOT NULL,
    entidad VARCHAR(100) NOT NULL,
    entidad_id BIGINT,
    valores_anteriores JSON,
    valores_nuevos JSON,
    ip_origen VARCHAR(45),
    user_agent TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas (id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios_tienda (id)
);

-- =================================
-- ÍNDICES SEGURIDAD ADMINISTRADOR
-- =================================
CREATE INDEX idx_usuarios_tienda_rol ON usuarios_tienda (rol_id, activo);

CREATE INDEX idx_usuarios_tienda_correo ON usuarios_tienda (tienda_id, correo, eliminado_en);

CREATE INDEX idx_usuarios_tienda_activos ON usuarios_tienda (tienda_id, activo, eliminado_en);

CREATE INDEX idx_usuario_sedes ON usuario_sedes (usuario_id, es_sede_principal);

CREATE INDEX idx_usuario_sedes_por_sede ON usuario_sedes (sede_id, es_sede_principal DESC);

CREATE INDEX idx_roles_tienda ON roles (tienda_id);

CREATE INDEX idx_roles_permisos_permiso ON roles_permisos (permiso_id);

CREATE INDEX idx_permisos_modulo ON permisos (modulo, slug);

CREATE INDEX idx_auditoria_tienda_fecha ON auditoria_usuarios (tienda_id, creado_en DESC);

CREATE INDEX idx_auditoria_usuario ON auditoria_usuarios (usuario_id, creado_en DESC);

CREATE INDEX idx_auditoria_entidad ON auditoria_usuarios (entidad, entidad_id, creado_en DESC);