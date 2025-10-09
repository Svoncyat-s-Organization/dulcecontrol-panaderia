-- =============================================================================
-- Migración V10: Crear tabla registros
-- Descripción: Tabla para gestionar registros de clientes con credenciales
-- Fecha: 2025-10-09
-- =============================================================================

CREATE TABLE IF NOT EXISTS registros (
    idregistro INTEGER NOT NULL,
    nombres VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cliente_id VARCHAR(255) ,
    llave_secreta VARCHAR(255) ,
    access_token VARCHAR(255),
    estado INTEGER NOT NULL DEFAULT 1,
    
    -- Constraint de clave primaria
    CONSTRAINT pk_registros PRIMARY KEY (idregistro)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_registros_email ON dulce_control.registros(email);
CREATE INDEX idx_registros_cliente_id ON dulce_control.registros(cliente_id);
CREATE INDEX idx_registros_estado ON dulce_control.registros(estado);

-- Comentarios de la tabla
COMMENT ON TABLE dulce_control.registros IS 'Tabla de registros de clientes con credenciales de acceso';
COMMENT ON COLUMN dulce_control.registros.idregistro IS 'ID único del registro';
COMMENT ON COLUMN dulce_control.registros.nombres IS 'Nombres del cliente';
COMMENT ON COLUMN dulce_control.registros.apellidos IS 'Apellidos del cliente';
COMMENT ON COLUMN dulce_control.registros.email IS 'Correo electrónico del cliente';
COMMENT ON COLUMN dulce_control.registros.cliente_id IS 'Identificador del cliente';
COMMENT ON COLUMN dulce_control.registros.llave_secreta IS 'Llave secreta para autenticación';
COMMENT ON COLUMN dulce_control.registros.access_token IS 'Token de acceso para autenticación';
COMMENT ON COLUMN dulce_control.registros.estado IS 'Estado del registro (1=activo, 0=inactivo)';
