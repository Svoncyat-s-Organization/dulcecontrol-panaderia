-- =================================
--   TABLAS PARA EL ADMINISTRADOR
-- =================================

-- Producción

CREATE TABLE IF NOT EXISTS recetas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    insumo_id BIGINT NOT NULL,
    cantidad_requerida DECIMAL(12,4) NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL,
    notas_preparacion TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (producto_id, insumo_id),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (insumo_id) REFERENCES insumos(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS stock_ideal (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    sede_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad_ideal INTEGER NOT NULL DEFAULT 0,
    punto_reposicion INTEGER DEFAULT 0,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (sede_id, producto_id),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conteos_diarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    sede_id BIGINT NOT NULL,
    fecha_conteo DATE NOT NULL DEFAULT (CURRENT_DATE),
    responsable_id BIGINT,
    observaciones TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sede_id, fecha_conteo),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE,
    FOREIGN KEY (responsable_id) REFERENCES usuarios_tienda(id)
);

CREATE TABLE IF NOT EXISTS detalle_conteo_diario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conteo_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad_fisica INTEGER NOT NULL DEFAULT 0,
    cantidad_sistema INTEGER,
    diferencia INTEGER GENERATED ALWAYS AS (cantidad_fisica - COALESCE(cantidad_sistema, cantidad_fisica)) STORED,
    FOREIGN KEY (conteo_id) REFERENCES conteos_diarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS planes_produccion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    sede_id BIGINT NOT NULL,
    fecha_produccion DATE NOT NULL DEFAULT (CURRENT_DATE),
    estado ENUM('BORRADOR', 'CONFIRMADO', 'EN_PROCESO', 'FINALIZADO', 'CANCELADO') NOT NULL DEFAULT 'BORRADOR',
    generado_por BIGINT,
    confirmado_por BIGINT,
    hora_inicio_real DATETIME,
    hora_fin_real DATETIME,
    notas_maestro TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (sede_id, fecha_produccion),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE,
    FOREIGN KEY (generado_por) REFERENCES usuarios_tienda(id),
    FOREIGN KEY (confirmado_por) REFERENCES usuarios_tienda(id)
);

CREATE TABLE IF NOT EXISTS detalles_plan_produccion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plan_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    origen ENUM('STOCK_DIARIO', 'PEDIDO_CLIENTE') NOT NULL DEFAULT 'STOCK_DIARIO',
    pedido_cliente_id BIGINT,
    detalle_pedido_id BIGINT,
    es_personalizado BOOLEAN NOT NULL DEFAULT FALSE,
    personalizacion_id BIGINT,
    cantidad_sugerida INTEGER NOT NULL,
    cantidad_planificada INTEGER NOT NULL,
    cantidad_producida INTEGER DEFAULT 0,
    cantidad_merma INTEGER DEFAULT 0,
    estado ENUM('PENDIENTE', 'EN_HORNO', 'TERMINADO', 'MERMA') NOT NULL DEFAULT 'PENDIENTE',
    hora_termino DATETIME,
    observaciones TEXT,
    FOREIGN KEY (plan_id) REFERENCES planes_produccion(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (pedido_cliente_id) REFERENCES pedidos(id) ON DELETE SET NULL,
    FOREIGN KEY (detalle_pedido_id) REFERENCES detalles_pedido(id) ON DELETE SET NULL,
    FOREIGN KEY (personalizacion_id) REFERENCES personalizaciones_item_pedido(id) ON DELETE SET NULL
);

-- =================================
-- ÍNDICES PRODUCCIÓN ADMINISTRADOR
-- =================================

-- Producción
CREATE INDEX idx_planes_produccion_sede_fecha
    ON planes_produccion(sede_id, fecha_produccion, estado);

CREATE INDEX idx_planes_produccion_activos
    ON planes_produccion(tienda_id, estado);

CREATE INDEX idx_detalles_plan_producto
    ON detalles_plan_produccion(plan_id, producto_id, estado);

CREATE INDEX idx_detalles_plan_personalizados
    ON detalles_plan_produccion(plan_id, es_personalizado);

CREATE INDEX idx_detalles_plan_pedido_cliente
    ON detalles_plan_produccion(pedido_cliente_id);

CREATE INDEX idx_detalles_plan_detalle_pedido
    ON detalles_plan_produccion(detalle_pedido_id);

CREATE INDEX idx_recetas_producto
    ON recetas(producto_id, insumo_id);

CREATE INDEX idx_conteos_diarios_sede_fecha
    ON conteos_diarios(sede_id, fecha_conteo DESC);

CREATE INDEX idx_detalle_conteo
    ON detalle_conteo_diario(conteo_id, producto_id);

-- Reportes

CREATE INDEX idx_detalles_plan_merma
    ON detalles_plan_produccion(producto_id, cantidad_merma);

CREATE INDEX idx_planes_produccion_tiempos
    ON planes_produccion(tienda_id, fecha_produccion, hora_inicio_real, hora_fin_real, estado);
