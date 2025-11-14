-- =================================
--   TABLAS PARA EL ADMINISTRADOR
-- =================================

-- Inventario

CREATE TABLE IF NOT EXISTS inventario_insumos_sedes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    sede_id BIGINT NOT NULL,
    insumo_id BIGINT NOT NULL,
    cantidad_actual DECIMAL(12,4) NOT NULL DEFAULT 0,
    ubicacion_fisica VARCHAR(100),
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (sede_id, insumo_id),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE,
    FOREIGN KEY (insumo_id) REFERENCES insumos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inventario_productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    sede_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad_actual INTEGER NOT NULL DEFAULT 0,
    ubicacion_fisica VARCHAR(100),
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (sede_id, producto_id),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transferencias_inventario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    sede_origen_id BIGINT NOT NULL,
    sede_destino_id BIGINT NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    solicitado_por BIGINT,
    autorizado_por BIGINT,
    recibido_por BIGINT,
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_envio DATETIME,
    fecha_recepcion DATETIME,
    observaciones TEXT,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id),
    FOREIGN KEY (sede_origen_id) REFERENCES sedes(id),
    FOREIGN KEY (sede_destino_id) REFERENCES sedes(id),
    FOREIGN KEY (solicitado_por) REFERENCES usuarios_tienda(id),
    FOREIGN KEY (autorizado_por) REFERENCES usuarios_tienda(id),
    FOREIGN KEY (recibido_por) REFERENCES usuarios_tienda(id)
);

CREATE TABLE IF NOT EXISTS items_transferencia (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transferencia_id BIGINT NOT NULL,
    insumo_id BIGINT,
    producto_id BIGINT,
    cantidad_enviada DECIMAL(12,4) NOT NULL,
    cantidad_recibida DECIMAL(12,4),
    CONSTRAINT chk_item_type CHECK ((insumo_id IS NOT NULL AND producto_id IS NULL) OR (insumo_id IS NULL AND producto_id IS NOT NULL)),
    FOREIGN KEY (transferencia_id) REFERENCES transferencias_inventario(id),
    FOREIGN KEY (insumo_id) REFERENCES insumos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS movimientos_inventario_insumos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    sede_id BIGINT NOT NULL,
    insumo_id BIGINT NOT NULL,
    tipo_movimiento VARCHAR(50) NOT NULL,
    cantidad DECIMAL(12,4) NOT NULL,
    cantidad_anterior DECIMAL(12,4) NOT NULL,
    cantidad_posterior DECIMAL(12,4) NOT NULL,
    orden_compra_id BIGINT,
    plan_produccion_id BIGINT,
    transferencia_id BIGINT,
    motivo TEXT,
    responsable_id BIGINT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id),
    FOREIGN KEY (sede_id) REFERENCES sedes(id),
    FOREIGN KEY (insumo_id) REFERENCES insumos(id),
    FOREIGN KEY (orden_compra_id) REFERENCES ordenes_compra(id),
    FOREIGN KEY (plan_produccion_id) REFERENCES planes_produccion(id),
    FOREIGN KEY (transferencia_id) REFERENCES transferencias_inventario(id),
    FOREIGN KEY (responsable_id) REFERENCES usuarios_tienda(id)
);

CREATE TABLE IF NOT EXISTS movimientos_inventario_productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    sede_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    tipo_movimiento VARCHAR(50) NOT NULL,
    cantidad INTEGER NOT NULL,
    cantidad_anterior INTEGER NOT NULL,
    cantidad_posterior INTEGER NOT NULL,
    pedido_id BIGINT,
    plan_produccion_id BIGINT,
    motivo ENUM('PRODUCCION', 'VENTA', 'MERMA', 'AJUSTE', 'TRANSFERENCIA', 'DEVOLUCION') NOT NULL,
    responsable_id BIGINT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id),
    FOREIGN KEY (sede_id) REFERENCES sedes(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (plan_produccion_id) REFERENCES planes_produccion(id),
    FOREIGN KEY (responsable_id) REFERENCES usuarios_tienda(id)
);

-- =================================
-- ÍNDICES INVENTARIO ADMINISTRADOR
-- =================================

-- Inventario (Insumos)
CREATE INDEX idx_inventario_insumos_tienda
    ON inventario_insumos_sedes(tienda_id, cantidad_actual);

CREATE INDEX idx_movimientos_insumos_sede_fecha
    ON movimientos_inventario_insumos(sede_id, insumo_id, creado_en DESC);

CREATE INDEX idx_movimientos_insumos_tipo
    ON movimientos_inventario_insumos(tienda_id, tipo_movimiento, creado_en DESC);

CREATE INDEX idx_movimientos_insumos_orden_compra
    ON movimientos_inventario_insumos(orden_compra_id);

CREATE INDEX idx_movimientos_insumos_plan
    ON movimientos_inventario_insumos(plan_produccion_id);

CREATE INDEX idx_movimientos_insumos_transferencia
    ON movimientos_inventario_insumos(transferencia_id);

-- Inventario (Productos)
CREATE INDEX idx_inventario_productos_disponibles
    ON inventario_productos(tienda_id, cantidad_actual);

CREATE INDEX idx_movimientos_productos_sede_fecha
    ON movimientos_inventario_productos(sede_id, producto_id, creado_en DESC);

CREATE INDEX idx_movimientos_productos_tipo
    ON movimientos_inventario_productos(tienda_id, tipo_movimiento, creado_en DESC);

CREATE INDEX idx_movimientos_productos_pedido
    ON movimientos_inventario_productos(pedido_id);

CREATE INDEX idx_movimientos_productos_plan
    ON movimientos_inventario_productos(plan_produccion_id);

CREATE INDEX idx_inventario_productos_critico
    ON inventario_productos(sede_id, cantidad_actual);

-- Transferencias
CREATE INDEX idx_transferencias_origen
    ON transferencias_inventario(sede_origen_id, estado, fecha_solicitud DESC);

CREATE INDEX idx_transferencias_destino
    ON transferencias_inventario(sede_destino_id, estado, fecha_solicitud DESC);

CREATE INDEX idx_items_transferencia
    ON items_transferencia(transferencia_id);
