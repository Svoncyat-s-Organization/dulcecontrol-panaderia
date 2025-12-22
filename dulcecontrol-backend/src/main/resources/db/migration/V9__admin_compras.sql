-- =================================
--   TABLAS PARA EL ADMINISTRADOR
-- =================================

-- Compras e Insumos

CREATE TABLE IF NOT EXISTS insumos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    codigo_interno VARCHAR(100),
    unidad_base ENUM('UNIDAD', 'KG', 'G', 'L', 'ML', 'PAQUETE', 'SACO', 'LATA') NOT NULL,
    unidad_compra_habitual ENUM('UNIDAD', 'KG', 'G', 'L', 'ML', 'PAQUETE', 'SACO', 'LATA') NOT NULL,
    factor_conversion DECIMAL(12,4) DEFAULT 1,
    costo_promedio_unitario_centimos BIGINT DEFAULT 0,
    ultimo_precio_compra_centimos BIGINT,
    stock_actual_global DECIMAL(12,4) DEFAULT 0,
    stock_minimo_global DECIMAL(12,4) DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, nombre),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS proveedores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    nombre_comercial VARCHAR(255) NOT NULL,
    tipo_doc ENUM('DNI', 'RUC') NOT NULL,
    numero_doc VARCHAR(20),
    razon_social VARCHAR(255),
    nombre_contacto VARCHAR(255),
    telefono_contacto VARCHAR(50),
    email_contacto VARCHAR(255),
    es_generico BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ordenes_compra (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    sede_destino_id BIGINT NOT NULL,
    proveedor_id BIGINT NOT NULL,
    fecha_emision DATE NOT NULL DEFAULT (CURRENT_DATE),
    fecha_recepcion_esperada DATE,
    fecha_recepcion_real DATE,
    estado ENUM('BORRADOR', 'ENVIADA', 'RECIBIDA_PARCIAL', 'RECIBIDA_TOTAL', 'CANCELADA') NOT NULL DEFAULT 'BORRADOR',
    moneda VARCHAR(3) DEFAULT 'PEN',
    total_compra_centimos BIGINT NOT NULL DEFAULT 0,
    metodo_pago ENUM('efectivo', 'credito'),
    monto_inicial_centimos BIGINT DEFAULT 0,
    monto_pagado_centimos BIGINT DEFAULT 0,
    saldo_pendiente_centimos BIGINT DEFAULT 0,
    referencia_pago VARCHAR(100) NULL,
    tipo_comprobante_proveedor ENUM('FACTURA', 'BOLETA', 'NOTA_CREDITO', 'NOTA_DEBITO'),
    serie_comprobante_proveedor VARCHAR(50) NULL,
    numero_comprobante_proveedor VARCHAR(50) NULL,
    url_foto_comprobante TEXT NULL,
    observaciones TEXT NULL,
    registrado_por BIGINT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (sede_destino_id) REFERENCES sedes(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
    FOREIGN KEY (registrado_por) REFERENCES usuarios_tienda(id)
);

CREATE TABLE IF NOT EXISTS detalles_orden_compra (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    orden_compra_id BIGINT NOT NULL,
    insumo_id BIGINT NOT NULL,
    cantidad_solicitada DECIMAL(12,4) NOT NULL,
    unidad_compra ENUM('UNIDAD', 'KG', 'G', 'L', 'ML', 'PAQUETE', 'SACO', 'LATA') NOT NULL,
    costo_unitario_pactado_centimos BIGINT NOT NULL,
    total_linea_centimos BIGINT NOT NULL,
    cantidad_recibida DECIMAL(12,4) DEFAULT 0,
    recibido_completo BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (orden_compra_id) REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    FOREIGN KEY (insumo_id) REFERENCES insumos(id)
);

-- =================================
-- ÍNDICES COMPRAS ADMINISTRADOR
-- =================================

-- Insumos
CREATE INDEX idx_insumos_tienda_activos
    ON insumos(tienda_id, activo);

CREATE INDEX idx_insumos_stock_bajo
    ON insumos(tienda_id, stock_actual_global, stock_minimo_global, activo);

-- Compras
CREATE INDEX idx_proveedores_tienda_activos
    ON proveedores(tienda_id, activo);

CREATE INDEX idx_ordenes_compra_estado
    ON ordenes_compra(tienda_id, estado, fecha_emision DESC);

CREATE INDEX idx_ordenes_compra_sede
    ON ordenes_compra(sede_destino_id, estado);

CREATE INDEX idx_ordenes_compra_proveedor
    ON ordenes_compra(proveedor_id, fecha_emision DESC);

CREATE INDEX idx_detalles_orden_compra
    ON detalles_orden_compra(orden_compra_id, insumo_id);

CREATE INDEX idx_detalles_orden_pendientes
    ON detalles_orden_compra(orden_compra_id, recibido_completo);

CREATE INDEX idx_ordenes_compra_pendientes
    ON ordenes_compra(sede_destino_id, estado, fecha_recepcion_esperada);

-- =================================
-- TABLA DE PAGOS DE ÓRDENES DE COMPRA
-- =================================

CREATE TABLE IF NOT EXISTS pagos_orden_compra (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    orden_compra_id BIGINT NOT NULL,
    fecha_pago DATE NOT NULL DEFAULT (CURRENT_DATE),
    monto_pagado_centimos BIGINT NOT NULL,
    metodo_pago VARCHAR(50),
    referencia_pago VARCHAR(100),
    url_foto_comprobante LONGTEXT,
    observaciones TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (orden_compra_id) REFERENCES ordenes_compra(id) ON DELETE CASCADE
);

-- Índices para la tabla de pagos
CREATE INDEX idx_pagos_orden_compra
    ON pagos_orden_compra(orden_compra_id, fecha_pago DESC);

CREATE INDEX idx_pagos_fecha
    ON pagos_orden_compra(fecha_pago DESC);
