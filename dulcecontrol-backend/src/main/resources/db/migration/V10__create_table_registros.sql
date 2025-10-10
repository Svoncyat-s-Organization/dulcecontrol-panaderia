-- =============================================================================
-- DULCE CONTROL - V10: Tabla de Registros de Clientes
-- Fecha: 2025-10-09
-- Descripción: Gestión de registros de clientes con autenticación JWT
-- =============================================================================

SET search_path = dulce_control, public;

-- =============================================================================
-- TABLA: registros
-- =============================================================================
-- Almacena registros de clientes con credenciales y tokens de acceso
CREATE TABLE IF NOT EXISTS registros (
  idregistro      SERIAL PRIMARY KEY,
  nombres         VARCHAR(255) NOT NULL,
  apellidos       VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  cliente_id      VARCHAR(255) NOT NULL,
  llave_secreta   VARCHAR(255) NOT NULL,
  access_token    VARCHAR(255),
  estado          INTEGER NOT NULL DEFAULT 1
);

-- Índices para optimizar consultas
CREATE INDEX idx_registros_email ON registros(email);
CREATE INDEX idx_registros_cliente_id ON registros(cliente_id);
CREATE INDEX idx_registros_access_token ON registros(access_token);
CREATE INDEX idx_registros_estado ON registros(estado);

-- Comentarios descriptivos
COMMENT ON TABLE registros IS 'Registros de clientes con autenticación JWT';
COMMENT ON COLUMN registros.idregistro IS 'ID autoincremental del registro';
COMMENT ON COLUMN registros.nombres IS 'Nombres del cliente';
COMMENT ON COLUMN registros.apellidos IS 'Apellidos del cliente';
COMMENT ON COLUMN registros.email IS 'Correo electrónico del cliente';
COMMENT ON COLUMN registros.cliente_id IS 'ID único generado con SHA-256 (nombres + apellidos + email)';
COMMENT ON COLUMN registros.llave_secreta IS 'Contraseña encriptada con BCrypt';
COMMENT ON COLUMN registros.access_token IS 'Token JWT para autenticación';
COMMENT ON COLUMN registros.estado IS 'Estado del registro (1=activo, 0=inactivo/eliminado)';
