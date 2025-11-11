SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =================================
--    TABLAS GEOGRÁFICAS (UBIGEO)
-- =================================

CREATE TABLE IF NOT EXISTS ubigeo_departamentos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo_ubigeo CHAR(2) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS ubigeo_provincias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    departamento_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    codigo_ubigeo CHAR(4) NOT NULL UNIQUE,
    FOREIGN KEY (departamento_id) REFERENCES ubigeo_departamentos(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS ubigeo_distritos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    provincia_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    codigo_ubigeo CHAR(6) NOT NULL UNIQUE,
    FOREIGN KEY (provincia_id) REFERENCES ubigeo_provincias(id) ON DELETE RESTRICT
);

-- ====================================
-- ÍNDICES GEOGRÁFICOS (UBIGEO)
-- ====================================

CREATE INDEX idx_ubigeo_provincias_dpto_id
    ON ubigeo_provincias(departamento_id);

CREATE INDEX idx_ubigeo_distritos_prov_id
    ON ubigeo_distritos(provincia_id);
