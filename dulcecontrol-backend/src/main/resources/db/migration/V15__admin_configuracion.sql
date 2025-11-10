-- =================================
--   TABLAS PARA EL ADMINISTRADOR
-- =================================

-- Configuración

CREATE TABLE IF NOT EXISTS configuracion_tienda (
    tienda_id BIGINT PRIMARY KEY,
    ruc VARCHAR(20),
    razon_social VARCHAR(255),
    direccion_fiscal TEXT,
    ubigeo_fiscal CHAR(6),
    usuario_sunat_sol VARCHAR(100),
    clave_sunat_sol_encriptada TEXT,
    certificado_digital_url TEXT,
    modo_sunat VARCHAR(20) DEFAULT 'pruebas',
    tasa_igv DECIMAL(5,2) DEFAULT 18.00,
    api_key_yape VARCHAR(255),
    api_key_plin VARCHAR(255),
    merchant_id_niubiz VARCHAR(100),
    banner_principal_url TEXT,
    mensaje_bienvenida TEXT,
    horario_atencion JSON DEFAULT (JSON_OBJECT()),
    redes_sociales JSON DEFAULT (JSON_OBJECT()),
    politicas_envio TEXT,
    politicas_devolucion TEXT,
    email_notificaciones VARCHAR(255),
    telegram_bot_token VARCHAR(255),
    telegram_chat_id VARCHAR(100),
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE,
    FOREIGN KEY (ubigeo_fiscal) REFERENCES ubigeo_distritos(codigo_ubigeo)
);

-- CMS

CREATE TABLE IF NOT EXISTS paginas_storefront (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    slug VARCHAR(100) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido LONGTEXT NOT NULL,
    meta_descripcion TEXT,
    orden_menu INTEGER DEFAULT 0,
    visible_en_menu BOOLEAN DEFAULT TRUE,
    activa BOOLEAN DEFAULT TRUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, slug),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE
);

-- =======================================
-- ÍNDICES CONFIGURACIÓN CMS ADMINISTRADOR
-- =======================================

CREATE INDEX idx_paginas_storefront_activas
    ON paginas_storefront(tienda_id, activa, orden_menu);

CREATE INDEX idx_paginas_storefront_menu
    ON paginas_storefront(tienda_id, visible_en_menu, orden_menu, activa);
