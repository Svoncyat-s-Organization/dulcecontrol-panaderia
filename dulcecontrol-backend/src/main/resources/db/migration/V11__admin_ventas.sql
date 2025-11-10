-- =================================
--   TABLAS PARA EL ADMINISTRADOR
-- =================================

-- Ventas (POS y Storefront)
CREATE TABLE IF NOT EXISTS cajas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    sede_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sesiones_caja (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    caja_id BIGINT NOT NULL,
    usuario_apertura_id BIGINT NOT NULL,
    usuario_cierre_id BIGINT,
    monto_inicial_centimos BIGINT NOT NULL,
    monto_final_esperado_centimos BIGINT,
    monto_final_real_centimos BIGINT,
    diferencia_centimos INT GENERATED ALWAYS AS (monto_final_real_centimos - monto_final_esperado_centimos) STORED,
    fecha_apertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre DATETIME,
    esta_abierta BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (caja_id) REFERENCES cajas(id),
    FOREIGN KEY (usuario_apertura_id) REFERENCES usuarios_tienda(id),
    FOREIGN KEY (usuario_cierre_id) REFERENCES usuarios_tienda(id)
);

CREATE TABLE IF NOT EXISTS pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_pedido VARCHAR(50) NOT NULL,
    tienda_id BIGINT NOT NULL,
    sede_origen_id BIGINT NOT NULL,
    cliente_id BIGINT,
    origen ENUM('pos_local', 'storefront_online', 'telefono') NOT NULL,
    sesion_caja_id BIGINT,
    vendedor_id BIGINT,
    estado_pedido ENUM('borrador', 'pendiente_pago', 'pagado', 'en_preparacion', 'listo_entrega', 'entregado', 'cancelado', 'devuelto') NOT NULL DEFAULT 'pendiente_pago',
    estado_pago ENUM('pendiente', 'parcial', 'pagado_total', 'reembolsado') NOT NULL DEFAULT 'pendiente',
    tipo_entrega ENUM('recojo_tienda', 'delivery', 'consumo_local') NOT NULL DEFAULT 'recojo_tienda',
    fecha_entrega_pactada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    direccion_entrega TEXT,
    costo_delivery_centimos BIGINT DEFAULT 0,
    moneda CHAR(3) DEFAULT 'PEN',
    subtotal_items_centimos BIGINT NOT NULL DEFAULT 0,
    descuento_total_centimos BIGINT NOT NULL DEFAULT 0,
    impuestos_totales_centimos BIGINT NOT NULL DEFAULT 0,
    total_final_centimos BIGINT NOT NULL,
    monto_pagado_centimos BIGINT NOT NULL DEFAULT 0,
    saldo_pendiente_centimos INT GENERATED ALWAYS AS (total_final_centimos - monto_pagado_centimos) STORED,
    requiere_comprobante BOOLEAN DEFAULT TRUE,
    tipo_comprobante ENUM('factura', 'boleta', 'nota_credito', 'nota_debito'),
    serie_comprobante VARCHAR(20),
    numero_comprobante VARCHAR(20),
    notas_pedido TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, codigo_pedido),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (sede_origen_id) REFERENCES sedes(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
    FOREIGN KEY (sesion_caja_id) REFERENCES sesiones_caja(id),
    FOREIGN KEY (vendedor_id) REFERENCES usuarios_tienda(id)
);

CREATE TABLE IF NOT EXISTS direcciones_pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    tipo_direccion ENUM('facturacion', 'envio') NOT NULL,
    nombre_contacto VARCHAR(255) NOT NULL,
    tipo_doc_contacto ENUM('DNI', 'RUC'),
    numero_doc_contacto VARCHAR(20),
    telefono_contacto VARCHAR(50) NOT NULL,
    email_contacto VARCHAR(255),
    direccion_completa TEXT NOT NULL,
    referencia TEXT,
    distrito VARCHAR(100),
    provincia VARCHAR(100),
    departamento VARCHAR(100),
    codigo_ubigeo CHAR(6),
    codigo_postal VARCHAR(20),
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS detalles_pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario_centimos BIGINT NOT NULL,
    subtotal_linea_centimos BIGINT NOT NULL,
    notas_item TEXT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS pagos_pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    sesion_caja_id BIGINT,
    monto_pagado_centimos BIGINT NOT NULL,
    metodo_pago ENUM('efectivo', 'yape', 'plin', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'pasarela_online') NOT NULL,
    referencia_externa VARCHAR(100),
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    registrado_por BIGINT,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (sesion_caja_id) REFERENCES sesiones_caja(id),
    FOREIGN KEY (registrado_por) REFERENCES usuarios_tienda(id)
);

CREATE TABLE IF NOT EXISTS personalizaciones_item_pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    detalle_pedido_id BIGINT NOT NULL UNIQUE,
    descripcion_solicitud TEXT NOT NULL,
    texto_dedicatoria TEXT,
    imagenes_referencia JSON DEFAULT (JSON_ARRAY()),
    sabor_masa VARCHAR(100),
    sabor_relleno VARCHAR(100),
    tematica VARCHAR(100),
    fecha_limite_produccion DATETIME,
    costo_extra_personalizacion_centimos BIGINT DEFAULT 0,
    FOREIGN KEY (detalle_pedido_id) REFERENCES detalles_pedido(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS movimientos_caja (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sesion_caja_id BIGINT NOT NULL,
    tipo_movimiento ENUM('venta', 'devolucion', 'gasto_operativo', 'retiro_efectivo', 'ingreso_efectivo', 'ajuste') NOT NULL,
    monto_centimos BIGINT NOT NULL,
    metodo_pago ENUM('efectivo', 'yape', 'plin', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'pasarela_online'),
    pedido_id BIGINT,
    concepto TEXT,
    comprobante_asociado VARCHAR(100),
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sesion_caja_id) REFERENCES sesiones_caja(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

-- =================================
-- ÍNDICES VENTAS ADMINISTRADOR
-- =================================

-- Caja
CREATE INDEX idx_sesiones_caja_activas
    ON sesiones_caja(caja_id, esta_abierta, fecha_apertura DESC);

CREATE INDEX idx_sesiones_caja_usuario
    ON sesiones_caja(usuario_apertura_id, fecha_apertura DESC);

CREATE INDEX idx_movimientos_caja_sesion
    ON movimientos_caja(sesion_caja_id, tipo_movimiento, creado_en);

CREATE INDEX idx_movimientos_caja_pedido
    ON movimientos_caja(pedido_id);

CREATE INDEX idx_sesiones_caja_dashboard
    ON sesiones_caja(caja_id, fecha_apertura, esta_abierta);

-- Ventas & Pedidos (POS)
CREATE INDEX idx_pedidos_borrador_pos
    ON pedidos(sede_origen_id, vendedor_id, estado_pedido);

CREATE INDEX idx_pedidos_sede_fecha
    ON pedidos(sede_origen_id, estado_pedido, creado_en DESC);

CREATE INDEX idx_detalles_pedido_producto
    ON detalles_pedido(pedido_id, producto_id);

CREATE INDEX idx_direcciones_pedido_envio
    ON direcciones_pedido(pedido_id);

CREATE INDEX idx_pagos_pedido
    ON pagos_pedido(pedido_id, fecha_pago DESC);

CREATE INDEX idx_pedidos_pendientes_sede
    ON pedidos(sede_origen_id, estado_pedido, estado_pago, fecha_entrega_pactada);

-- Dashboard
CREATE INDEX idx_pedidos_tienda_fecha
    ON pedidos(tienda_id, creado_en DESC);

CREATE INDEX idx_pedidos_estado_pago
    ON pedidos(tienda_id, estado_pedido, estado_pago);

-- Reportes
CREATE INDEX idx_pedidos_reporte_ventas
    ON pedidos(tienda_id, estado_pedido, creado_en);

CREATE INDEX idx_detalles_pedido_stats
    ON detalles_pedido(producto_id, cantidad);
