-- =================================
-- V16: ALTERAR TIPO_DOC DE ENUM A VARCHAR
-- =================================

-- Primero actualizar los valores existentes (si los hay)
UPDATE clientes SET tipo_doc = 'DNI' WHERE tipo_doc = 0;
UPDATE clientes SET tipo_doc = 'RUC' WHERE tipo_doc = 1;

-- Luego cambiar el tipo de columna
ALTER TABLE clientes MODIFY COLUMN tipo_doc VARCHAR(10) NOT NULL;

-- =================================
-- ÍNDICES (si es necesario actualizar)
-- =================================

-- El índice existente debería funcionar con VARCHAR