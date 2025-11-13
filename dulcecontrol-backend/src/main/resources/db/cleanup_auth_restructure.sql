-- ==============================================
-- SCRIPT DE LIMPIEZA POST-REESTRUCTURACIÓN
-- ==============================================
-- 
-- Este script elimina la tabla usuarios_tienda_tokens
-- que ya no se utiliza en el nuevo sistema de autenticación stateless.
--
-- Ejecutar este script SOLO si la tabla existe en tu base de datos.
--
-- Fecha: 2025-11-13
-- ==============================================

-- Verificar si la tabla existe antes de eliminarla
DROP TABLE IF EXISTS usuarios_tienda_tokens;

-- Mensaje de confirmación
SELECT 'Tabla usuarios_tienda_tokens eliminada correctamente' AS resultado;

-- ==============================================
-- VERIFICACIÓN ADICIONAL
-- ==============================================

-- Listar todas las tablas relacionadas con seguridad
SELECT 
    TABLE_NAME, 
    TABLE_ROWS 
FROM 
    information_schema.TABLES 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME LIKE '%usuario%'
ORDER BY 
    TABLE_NAME;
