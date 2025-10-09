-- =============================================================================
-- DULCE CONTROL - V1: Esquema Base y Extensiones
-- Fecha: 2025-10-08
-- Descripción: Configuración inicial del esquema y extensiones PostgreSQL
-- =============================================================================

-- Crear esquema principal
CREATE SCHEMA IF NOT EXISTS dulce_control;

-- Configurar búsqueda de esquemas
SET search_path = dulce_control, public;

-- Extensiones para tipos y búsqueda optimizada
CREATE EXTENSION IF NOT EXISTS citext;      -- Texto case-insensitive para emails
CREATE EXTENSION IF NOT EXISTS pg_trgm;     -- Búsqueda por similitud (trigrams)
CREATE EXTENSION IF NOT EXISTS btree_gist;  -- Índices para rangos y exclusiones
