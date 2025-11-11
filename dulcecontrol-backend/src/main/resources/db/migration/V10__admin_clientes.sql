-- =================================
--   TABLAS PARA EL ADMINISTRADOR
-- =================================

-- Clientes

CREATE TABLE IF NOT EXISTS clientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    tipo_doc ENUM('DNI', 'RUC'),
    numero_doc VARCHAR(20),
    nombre_doc VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(50),
    es_usuario_virtual BOOLEAN NOT NULL DEFAULT FALSE,
    hash_contrasena VARCHAR(255),
    notas TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, tipo_doc, numero_doc),
    UNIQUE (tienda_id, email),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS direcciones_cliente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    etiqueta VARCHAR(100),
    direccion_completa TEXT NOT NULL,
    referencia TEXT,
    distrito_id BIGINT,
    codigo_postal VARCHAR(20),
    es_fiscal BOOLEAN DEFAULT FALSE,
    es_entrega BOOLEAN DEFAULT FALSE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (distrito_id) REFERENCES ubigeo_distritos(id) ON DELETE SET NULL
);

-- =================================
-- ÍNDICES CLIENTES ADMINISTRADOR
-- =================================

-- Clientes
CREATE INDEX idx_clientes_tienda_busqueda
    ON clientes(tienda_id, numero_doc, email, activo);

CREATE INDEX idx_clientes_usuario_virtual
    ON clientes(tienda_id, es_usuario_virtual);

CREATE INDEX idx_direcciones_cliente
    ON direcciones_cliente(cliente_id, es_entrega);

CREATE FULLTEXT INDEX idx_clientes_busqueda_texto
    ON clientes(nombre_doc, email);
