-- =================================
--   TABLAS PARA EL ADMINISTRADOR
-- =================================

-- Facturación Tienda

CREATE TABLE IF NOT EXISTS tienda_series (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    sede_id BIGINT NOT NULL,
    tipo_comprobante ENUM('factura', 'boleta', 'nota_credito', 'nota_debito') NOT NULL,
    serie CHAR(4) NOT NULL,
    correlativo_actual INTEGER NOT NULL DEFAULT 0,
    es_electronica BOOLEAN DEFAULT TRUE,
    activa BOOLEAN DEFAULT TRUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, serie),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tienda_comprobantes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    pedido_id BIGINT NOT NULL,
    serie_id BIGINT NOT NULL,
    emisor_razon_social VARCHAR(255) NOT NULL,
    emisor_ruc VARCHAR(20) NOT NULL,
    emisor_direccion TEXT NOT NULL,
    cliente_tipo_doc ENUM('DNI', 'RUC') NOT NULL,
    cliente_numero_doc VARCHAR(20) NOT NULL,
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_direccion TEXT,
    tipo_comprobante ENUM('factura', 'boleta', 'nota_credito', 'nota_debito') NOT NULL,
    correlativo INTEGER NOT NULL,
    fecha_emision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    moneda CHAR(3) DEFAULT 'PEN',
    total_gravado_centimos BIGINT NOT NULL DEFAULT 0,
    total_inafecto_centimos BIGINT NOT NULL DEFAULT 0,
    total_exonerado_centimos BIGINT NOT NULL DEFAULT 0,
    total_igv_centimos BIGINT NOT NULL DEFAULT 0,
    total_impuestos_bolsa_centimos BIGINT NOT NULL DEFAULT 0,
    total_importe_centimos BIGINT NOT NULL,
    estado_sunat ENUM('pendiente', 'enviado', 'aceptado', 'observado', 'rechazado', 'anulado') NOT NULL DEFAULT 'pendiente',
    codigo_hash_cpe VARCHAR(255),
    xml_firmado_url TEXT,
    cdr_sunat_url TEXT,
    representacion_impresa_url TEXT,
    respuesta_sunat_codigo VARCHAR(50),
    respuesta_sunat_descripcion TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tipo_comprobante, correlativo),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE RESTRICT,
    FOREIGN KEY (serie_id) REFERENCES tienda_series(id) ON DELETE RESTRICT
);

-- =================================
-- ÍNDICES FACTURACIÓN ADMINISTRADOR
-- =================================

-- Facturación Tienda
CREATE INDEX idx_tienda_comprobantes_pedido
    ON tienda_comprobantes(pedido_id);

CREATE INDEX idx_tienda_comprobantes_serie
    ON tienda_comprobantes(tipo_comprobante, serie_id, correlativo DESC);

CREATE INDEX idx_tienda_comprobantes_fecha
    ON tienda_comprobantes(tienda_id, fecha_emision DESC);

CREATE INDEX idx_tienda_comprobantes_sunat
    ON tienda_comprobantes(estado_sunat, fecha_emision DESC);

CREATE INDEX idx_tienda_series_activas
    ON tienda_series(tienda_id, sede_id, activa);
