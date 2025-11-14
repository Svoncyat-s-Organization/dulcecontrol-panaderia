-- =================================
--   TABLAS PARA EL ADMINISTRADOR
-- =================================

-- Catálogo

CREATE TABLE IF NOT EXISTS categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    descripcion TEXT,
    url_imagen TEXT,
    icono VARCHAR(100),
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    orden_visual INTEGER DEFAULT 0,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, nombre),
    UNIQUE (tienda_id, slug),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    categoria_id BIGINT,
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo ENUM('PRODUCTO_TERMINADO', 'INSUMO_VENTA', 'SERVICIO') NOT NULL DEFAULT 'PRODUCTO_TERMINADO',
    es_personalizable BOOLEAN NOT NULL DEFAULT FALSE,
    precio_base_centimos BIGINT NOT NULL DEFAULT 0,
    precio_oferta_centimos BIGINT,
    visible_en_pos BOOLEAN NOT NULL DEFAULT TRUE,
    visible_en_storefront BOOLEAN NOT NULL DEFAULT TRUE,
    destacado_storefront BOOLEAN NOT NULL DEFAULT FALSE,
    url_imagen_principal TEXT,
    imagenes_galeria JSON DEFAULT (JSON_ARRAY()),
    atributos JSON DEFAULT (JSON_OBJECT()),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, sku),
    UNIQUE (tienda_id, slug),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

-- =================================
-- ÍNDICES CATÁLOGO ADMINISTRADOR
-- =================================

-- Catálogo
CREATE INDEX idx_productos_tienda_activos
    ON productos(tienda_id, activo);

CREATE INDEX idx_productos_categoria
    ON productos(categoria_id, activo);

CREATE INDEX idx_productos_pos_visible
    ON productos(tienda_id, visible_en_pos, activo);

CREATE INDEX idx_productos_storefront_visible
    ON productos(tienda_id, visible_en_storefront, activo);

CREATE INDEX idx_productos_destacados
    ON productos(tienda_id, destacado_storefront, activo);

CREATE INDEX idx_productos_busqueda
    ON productos(tienda_id, slug, sku);

CREATE INDEX idx_categorias_tienda_activas
    ON categorias(tienda_id, activa, orden_visual);

CREATE FULLTEXT INDEX idx_productos_busqueda_texto
    ON productos(nombre, descripcion);
