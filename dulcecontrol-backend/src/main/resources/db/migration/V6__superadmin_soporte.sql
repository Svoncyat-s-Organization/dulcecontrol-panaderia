-- =================================
-- TABLAS PARA EL SUPERADMINISTRADOR
-- =================================

CREATE TABLE IF NOT EXISTS tickets_soporte (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    asignado_a_id BIGINT,
    asunto VARCHAR(255) NOT NULL,
    prioridad ENUM('baja', 'media', 'alta', 'critica') NOT NULL DEFAULT 'media',
    estado ENUM('abierto', 'pendiente_cliente', 'resuelto', 'cerrado') NOT NULL DEFAULT 'abierto',
    vencimiento_sla_en DATETIME,
    primera_respuesta_en DATETIME,
    resuelto_en DATETIME,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE RESTRICT,
    FOREIGN KEY (asignado_a_id) REFERENCES usuarios_superadmin(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mensajes_ticket (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    tipo_remitente ENUM('superadmin', 'tienda', 'sistema') NOT NULL,
    autor_admin_id BIGINT,
    mensaje TEXT NOT NULL,
    es_nota_interna BOOLEAN NOT NULL DEFAULT FALSE,
    leido_en DATETIME,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets_soporte(id) ON DELETE CASCADE,
    FOREIGN KEY (autor_admin_id) REFERENCES usuarios_superadmin(id) ON DELETE SET NULL
);

-- ========================================
-- ÍNDICES SOPORTE SUPERADMINISTRADOR
-- ========================================

CREATE INDEX idx_tickets_estado_prioridad
    ON tickets_soporte(estado, prioridad, creado_en DESC);

CREATE INDEX idx_tickets_asignacion
    ON tickets_soporte(asignado_a_id, estado);

CREATE INDEX idx_mensajes_ticket_orden
    ON mensajes_ticket(ticket_id, creado_en);

-- =================================
-- TABLAS PARA EL SUPERADMINISTRADOR
-- =================================

CREATE TABLE IF NOT EXISTS series (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipos_comprobante ENUM('factura', 'boleta', 'nota_credito', 'nota_debito') NOT NULL,
    serie CHAR(4) NOT NULL UNIQUE,
    ultimo_correlativo INTEGER NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    es_predeterminada BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comprobantes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    referencia_id BIGINT,
    tienda_id BIGINT NOT NULL,
    suscripcion_id BIGINT,
    serie_id INTEGER NOT NULL,
    estado_pago ENUM('borrador', 'pendiente', 'pagado', 'anulado', 'reembolsado') NOT NULL DEFAULT 'pendiente',
    tipos_comprobante ENUM('factura', 'boleta', 'nota_credito', 'nota_debito') NOT NULL,
    correlativo INTEGER NOT NULL,
    fecha_emision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cliente_tipo_doc ENUM('DNI', 'RUC') NOT NULL,
    cliente_num_doc VARCHAR(20) NOT NULL,
    cliente_nombre_doc VARCHAR(255) NOT NULL,
    cliente_direccion TEXT,
    moneda CHAR(3) NOT NULL DEFAULT 'PEN',
    total_gravado_centimos BIGINT NOT NULL DEFAULT 0,
    total_igv_centimos BIGINT NOT NULL DEFAULT 0,
    total_importe_centimos BIGINT NOT NULL,
    estados_sunat ENUM('pendiente', 'enviado', 'aceptado', 'observado', 'rechazado', 'anulado') NOT NULL DEFAULT 'pendiente',
    codigo_error_sunat VARCHAR(50),
    respuesta_sunat TEXT,
    url_xml TEXT,
    url_cdr TEXT,
    url_pdf TEXT,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (tipos_comprobante, correlativo),
    FOREIGN KEY (referencia_id) REFERENCES comprobantes(id) ON DELETE SET NULL,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE RESTRICT,
    FOREIGN KEY (suscripcion_id) REFERENCES suscripciones(id) ON DELETE SET NULL,
    FOREIGN KEY (serie_id) REFERENCES series(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS detalles_comprobante (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    comprobante_id BIGINT NOT NULL,
    descripcion TEXT NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    valor_unitario_centimos BIGINT NOT NULL,
    precio_unitario_centimos BIGINT NOT NULL,
    igv_item_centimos BIGINT NOT NULL,
    total_item_centimos BIGINT NOT NULL,
    FOREIGN KEY (comprobante_id) REFERENCES comprobantes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transacciones_pago (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    comprobante_id BIGINT NOT NULL,
    pasarela VARCHAR(50) NOT NULL,
    id_transaccion_pasarela VARCHAR(100),
    monto_centimos BIGINT NOT NULL,
    moneda CHAR(3) NOT NULL DEFAULT 'PEN',
    estado ENUM('pendiente', 'exitoso', 'fallido', 'reembolsado') NOT NULL DEFAULT 'pendiente',
    codigo_error VARCHAR(100),
    mensaje_error TEXT,
    metadata_pasarela JSON,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id),
    FOREIGN KEY (comprobante_id) REFERENCES comprobantes(id)
);

-- ========================================
-- ÍNDICES FACTURACIÓN SUPERADMINISTRADOR
-- ========================================

CREATE INDEX idx_comprobantes_tienda_fecha
    ON comprobantes(tienda_id, fecha_emision DESC);

CREATE INDEX idx_comprobantes_tipo_serie
    ON comprobantes(tipos_comprobante, serie_id, correlativo DESC);

CREATE INDEX idx_transacciones_comprobante
    ON transacciones_pago(comprobante_id, estado);

CREATE INDEX idx_transacciones_pasarela
    ON transacciones_pago(pasarela, estado, creado_en DESC);

CREATE INDEX idx_detalles_comprobante_factura
    ON detalles_comprobante(comprobante_id);

-- Tablero
CREATE INDEX idx_comprobantes_sunat_estado
    ON comprobantes(estados_sunat, fecha_emision DESC);
