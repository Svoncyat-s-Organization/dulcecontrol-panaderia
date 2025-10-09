-- =============================================================================
-- DULCE CONTROL - V3: Tablas Core de Organización y Acceso
-- Fecha: 2025-10-08
-- Descripción: Sedes, roles, permisos, usuarios y sus relaciones
-- =============================================================================

SET search_path = dulce_control, public;

-- =============================================================================
-- 1. TABLA: sede
-- =============================================================================
-- Representa las diferentes sucursales o puntos de venta
CREATE TABLE IF NOT EXISTS sede (
  id              BIGSERIAL PRIMARY KEY,
  nombre          VARCHAR(120) NOT NULL,
  direccion       VARCHAR(250),
  telefono        VARCHAR(20) CHECK (telefono ~ '^[0-9 +()-]{6,20}$' OR telefono IS NULL),
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER sede_set_updated_at
BEFORE UPDATE ON sede FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE sede IS 'Sucursales o puntos de venta del sistema';
COMMENT ON COLUMN sede.telefono IS 'Formato: números, espacios, +, paréntesis, guiones (6-20 caracteres)';

-- =============================================================================
-- 2. TABLA: rol
-- =============================================================================
-- Define roles de usuario (admin, cajero, panadero, etc.)
CREATE TABLE IF NOT EXISTS rol (
  id              BIGSERIAL PRIMARY KEY,
  nombre          VARCHAR(60) UNIQUE NOT NULL,
  descripcion     VARCHAR(250),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER rol_set_updated_at
BEFORE UPDATE ON rol FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE rol IS 'Roles de usuario en el sistema (admin, cajero, panadero, etc.)';

-- =============================================================================
-- 3. TABLA: permiso
-- =============================================================================
-- Define permisos granulares del sistema
CREATE TABLE IF NOT EXISTS permiso (
  id              BIGSERIAL PRIMARY KEY,
  codigo          VARCHAR(80) UNIQUE NOT NULL,
  descripcion     VARCHAR(250),
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER permiso_set_updated_at
BEFORE UPDATE ON permiso FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE permiso IS 'Permisos granulares del sistema';
COMMENT ON COLUMN permiso.codigo IS 'Código único del permiso (ej: pos.abrir_caja, inventario.ajustar)';

-- =============================================================================
-- 4. TABLA: rol_permiso
-- =============================================================================
-- Relación muchos a muchos entre roles y permisos
CREATE TABLE IF NOT EXISTS rol_permiso (
  rol_id      BIGINT NOT NULL REFERENCES rol(id) ON DELETE CASCADE,
  permiso_id  BIGINT NOT NULL REFERENCES permiso(id) ON DELETE CASCADE,
  PRIMARY KEY (rol_id, permiso_id)
);

COMMENT ON TABLE rol_permiso IS 'Asignación de permisos a roles';

-- =============================================================================
-- 5. TABLA: usuario
-- =============================================================================
-- Usuarios del sistema con autenticación
CREATE TABLE IF NOT EXISTS usuario (
  id                BIGSERIAL PRIMARY KEY,
  nombres           VARCHAR(120) NOT NULL,
  apellidos         VARCHAR(120),
  email             CITEXT UNIQUE NOT NULL,
  telefono          VARCHAR(20) CHECK (telefono ~ '^[0-9 +()-]{6,20}$' OR telefono IS NULL),
  contrasena_hash   VARCHAR(200) NOT NULL CHECK (LENGTH(contrasena_hash) >= 60),
  sede_preferida_id BIGINT REFERENCES sede(id),
  activo            BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsqueda rápida por email (trigram)
CREATE INDEX IF NOT EXISTS idx_usuario_email_trgm 
ON usuario USING gin (email gin_trgm_ops);

CREATE TRIGGER usuario_set_updated_at
BEFORE UPDATE ON usuario FOR EACH ROW
EXECUTE FUNCTION dulce_control.set_updated_at();

COMMENT ON TABLE usuario IS 'Usuarios del sistema con autenticación';
COMMENT ON COLUMN usuario.email IS 'Email único, case-insensitive (tipo CITEXT)';
COMMENT ON COLUMN usuario.contrasena_hash IS 'Hash bcrypt de la contraseña (mínimo 60 caracteres)';

-- =============================================================================
-- 6. TABLA: usuario_rol
-- =============================================================================
-- Asignación de roles a usuarios (un usuario puede tener múltiples roles)
CREATE TABLE IF NOT EXISTS usuario_rol (
  usuario_id  BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  rol_id      BIGINT NOT NULL REFERENCES rol(id) ON DELETE RESTRICT,
  PRIMARY KEY (usuario_id, rol_id)
);

COMMENT ON TABLE usuario_rol IS 'Asignación de roles a usuarios (relación N:M)';

-- =============================================================================
-- 7. TABLA: usuario_sede
-- =============================================================================
-- Sedes a las que tiene acceso cada usuario
CREATE TABLE IF NOT EXISTS usuario_sede (
  usuario_id  BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  sede_id     BIGINT NOT NULL REFERENCES sede(id) ON DELETE CASCADE,
  PRIMARY KEY (usuario_id, sede_id)
);

COMMENT ON TABLE usuario_sede IS 'Sedes a las que un usuario tiene acceso';

-- =============================================================================
-- 8. TABLA: usuario_recuperacion
-- =============================================================================
-- Tokens para recuperación de contraseña
CREATE TABLE IF NOT EXISTS usuario_recuperacion(
  id          BIGSERIAL PRIMARY KEY,
  usuario_id  BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  token       VARCHAR(120) UNIQUE NOT NULL,
  expira_en   TIMESTAMPTZ NOT NULL,
  usado       BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuario_recuperacion_token 
ON usuario_recuperacion(token) WHERE usado = FALSE;

COMMENT ON TABLE usuario_recuperacion IS 'Tokens para recuperación de contraseña';
COMMENT ON COLUMN usuario_recuperacion.expira_en IS 'Fecha de expiración del token';
COMMENT ON COLUMN usuario_recuperacion.usado IS 'Indica si el token ya fue utilizado';
