-- ============================================================================
-- R_10: SEED MÓDULO DE CLIENTES
-- ============================================================================

-- =================================
-- CLIENTE GENÉRICO (para todas las tiendas)
-- =================================
-- Cliente genérico para ventas rápidas sin documento
INSERT IGNORE INTO clientes (tienda_id, tipo_doc, numero_doc, nombre_doc, email, telefono, es_usuario_virtual, hash_contrasena, notas, activo)
SELECT 
    t.id as tienda_id,
    NULL as tipo_doc,
    '00000000' as numero_doc,
    'CLIENTE GENÉRICO' as nombre_doc,
    NULL as email,
    NULL as telefono,
    FALSE as es_usuario_virtual,
    NULL as hash_contrasena,
    'Cliente genérico para ventas sin identificación. Creado automáticamente por el sistema.' as notas,
    TRUE as activo
FROM tiendas t
WHERE NOT EXISTS (
    SELECT 1 FROM clientes c 
    WHERE c.tienda_id = t.id 
    AND c.numero_doc = '00000000'
);

-- =================================
-- CLIENTES
-- =================================

INSERT INTO clientes (tienda_id, tipo_doc, numero_doc, nombre_doc, email, telefono, es_usuario_virtual, hash_contrasena, notas, activo)
VALUES
  -- Clientes Dulce Manjar (RUC 20601234567)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'DNI',
    '72345678',
    'Laura Patricia Mendoza Vega',
    'laura.mendoza@gmail.com',
    '987123456',
    TRUE,
    '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', -- contraseña: demo123
    'Cliente frecuente, le gustan las tortas de chocolate',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'DNI',
    '41256789',
    'Carlos Alberto Rojas Castro',
    'carlos.rojas@outlook.com',
    '945234567',
    TRUE,
    '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', -- contraseña: demo123
    'Prefiere pedidos grandes para eventos corporativos',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'RUC',
    '20512345678',
    'Eventos & Celebraciones SAC',
    'eventos@celebraciones.pe',
    '953345678',
    FALSE,
    NULL,
    'Cliente corporativo - solicitar factura siempre',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'DNI',
    '65432109',
    'María Fernanda Torres López',
    'mafe.torres@yahoo.com',
    '962456789',
    TRUE,
    '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', -- contraseña: demo123
    'Le encantan los panes integrales',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'DNI',
    '23456780',
    'José Luis Ramírez Flores',
    'jose.ramirez@hotmail.com',
    '971567890',
    FALSE,
    NULL,
    'Cliente esporádico, solo compras en tienda',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'DNI',
    '87654321',
    'Ana Sofía Gutiérrez Salas',
    'ana.gutierrez@gmail.com',
    '980678901',
    TRUE,
    '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', -- contraseña: demo123
    'Siempre pide tortas personalizadas para cumpleaños',
    TRUE
  ),
  -- Clientes Panadería El Sol (RUC 20601234568)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'DNI',
    '54321098',
    'Roberto Carlos Pérez Díaz',
    'roberto.perez@gmail.com',
    '989789012',
    TRUE,
    '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', -- contraseña: demo123
    'Cliente VIP - descuento especial',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'DNI',
    '12309876',
    'Carmen Rosa Velásquez Ruiz',
    'carmen.velasquez@hotmail.com',
    '955890123',
    FALSE,
    NULL,
    'Compra pan integral todas las mañanas',
    TRUE
  ),
  -- Clientes Tortas & Delicias (RUC 20601234569)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'DNI',
    '98765432',
    'Daniela Alejandra Quispe Morales',
    'daniela.quispe@gmail.com',
    '964901234',
    TRUE,
    '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', -- contraseña: demo123
    'Especialista en pedidos de tortas temáticas',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'RUC',
    '20523456789',
    'Restaurante El Buen Sabor EIRL',
    'compras@buensabor.pe',
    '973012345',
    FALSE,
    NULL,
    'Cliente corporativo - pedidos semanales',
    TRUE
  )
ON DUPLICATE KEY UPDATE
  nombre_doc = VALUES(nombre_doc),
  email = VALUES(email),
  telefono = VALUES(telefono),
  es_usuario_virtual = VALUES(es_usuario_virtual),
  hash_contrasena = VALUES(hash_contrasena),
  notas = VALUES(notas),
  activo = VALUES(activo);

-- =================================
-- DIRECCIONES DE CLIENTES
-- =================================

INSERT INTO direcciones_cliente (cliente_id, etiqueta, direccion_completa, referencia, distrito_id, codigo_postal, es_fiscal, es_entrega)
SELECT new.cliente_id, new.etiqueta, new.direccion_completa, new.referencia, new.distrito_id, new.codigo_postal, new.es_fiscal, new.es_entrega
FROM (
  -- Direcciones Laura Mendoza
  SELECT
    c.id AS cliente_id,
    'Casa' AS etiqueta,
    'Av. Arequipa 2345, Miraflores' AS direccion_completa,
    'Edificio azul, depto 501' AS referencia,
    d.id AS distrito_id,
    '15074' AS codigo_postal,
    TRUE AS es_fiscal,
    TRUE AS es_entrega
  FROM clientes c
  INNER JOIN ubigeo_distritos d ON d.nombre = 'MIRAFLORES'
  INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id AND p.nombre = 'LIMA'
  INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id AND dep.nombre = 'LIMA'
  WHERE c.numero_doc = '72345678'
    AND c.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
  
  UNION ALL
  
  SELECT
    c.id AS cliente_id,
    'Oficina' AS etiqueta,
    'Av. Javier Prado 890, San Isidro' AS direccion_completa,
    'Piso 3, oficina 305' AS referencia,
    d.id AS distrito_id,
    '15073' AS codigo_postal,
    FALSE AS es_fiscal,
    TRUE AS es_entrega
  FROM clientes c
  INNER JOIN ubigeo_distritos d ON d.nombre = 'SAN ISIDRO'
  INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id AND p.nombre = 'LIMA'
  INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id AND dep.nombre = 'LIMA'
  WHERE c.numero_doc = '72345678'
    AND c.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
  
  UNION ALL
  
  -- Direcciones Carlos Rojas
  SELECT
    c.id AS cliente_id,
    'Domicilio' AS etiqueta,
    'Calle Los Olivos 456, San Isidro' AS direccion_completa,
    'Casa blanca con portón negro' AS referencia,
    d.id AS distrito_id,
    '15073' AS codigo_postal,
    TRUE AS es_fiscal,
    TRUE AS es_entrega
  FROM clientes c
  INNER JOIN ubigeo_distritos d ON d.nombre = 'SAN ISIDRO'
  INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id AND p.nombre = 'LIMA'
  INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id AND dep.nombre = 'LIMA'
  WHERE c.numero_doc = '41256789'
    AND c.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
  
  UNION ALL
  
  -- Direcciones Eventos & Celebraciones SAC
  SELECT
    c.id AS cliente_id,
    'Oficina Principal' AS etiqueta,
    'Av. Petit Thouars 1234, Lince' AS direccion_completa,
    'Edificio corporativo, piso 2' AS referencia,
    d.id AS distrito_id,
    '15072' AS codigo_postal,
    TRUE AS es_fiscal,
    TRUE AS es_entrega
  FROM clientes c
  INNER JOIN ubigeo_distritos d ON d.nombre = 'LINCE'
  INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id AND p.nombre = 'LIMA'
  INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id AND dep.nombre = 'LIMA'
  WHERE c.numero_doc = '20512345678'
    AND c.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
  
  UNION ALL
  
  -- Direcciones María Fernanda Torres
  SELECT
    c.id AS cliente_id,
    'Casa' AS etiqueta,
    'Jr. Camaná 567, Cercado de Lima' AS direccion_completa,
    'Frente al parque' AS referencia,
    d.id AS distrito_id,
    '15001' AS codigo_postal,
    TRUE AS es_fiscal,
    TRUE AS es_entrega
  FROM clientes c
  INNER JOIN ubigeo_distritos d ON d.nombre = 'LIMA'
  INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id AND p.nombre = 'LIMA'
  INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id AND dep.nombre = 'LIMA'
  WHERE c.numero_doc = '65432109'
    AND c.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
  
  UNION ALL
  
  -- Direcciones Ana Sofía Gutiérrez
  SELECT
    c.id AS cliente_id,
    'Casa' AS etiqueta,
    'Av. La Marina 3456, San Miguel' AS direccion_completa,
    'Condominio Las Palmeras, torre B, depto 802' AS referencia,
    d.id AS distrito_id,
    '15088' AS codigo_postal,
    TRUE AS es_fiscal,
    TRUE AS es_entrega
  FROM clientes c
  INNER JOIN ubigeo_distritos d ON d.nombre = 'SAN MIGUEL'
  INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id AND p.nombre = 'LIMA'
  INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id AND dep.nombre = 'LIMA'
  WHERE c.numero_doc = '87654321'
    AND c.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
  
  UNION ALL
  
  -- Direcciones Roberto Pérez (Panadería El Sol)
  SELECT
    c.id AS cliente_id,
    'Casa' AS etiqueta,
    'Av. Universitaria 789, Los Olivos' AS direccion_completa,
    'Casa esquina, color amarillo' AS referencia,
    d.id AS distrito_id,
    '15304' AS codigo_postal,
    TRUE AS es_fiscal,
    TRUE AS es_entrega
  FROM clientes c
  INNER JOIN ubigeo_distritos d ON d.nombre = 'LOS OLIVOS'
  INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id AND p.nombre = 'LIMA'
  INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id AND dep.nombre = 'LIMA'
  WHERE c.numero_doc = '54321098'
    AND c.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')
  
  UNION ALL
  
  -- Direcciones Carmen Rosa Velásquez (Panadería El Sol)
  SELECT
    c.id AS cliente_id,
    'Casa' AS etiqueta,
    'Jr. Los Pinos 234, San Martín de Porres' AS direccion_completa,
    'Segunda cuadra, casa verde' AS referencia,
    d.id AS distrito_id,
    '15102' AS codigo_postal,
    TRUE AS es_fiscal,
    TRUE AS es_entrega
  FROM clientes c
  INNER JOIN ubigeo_distritos d ON d.nombre = 'SAN MARTIN DE PORRES'
  INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id AND p.nombre = 'LIMA'
  INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id AND dep.nombre = 'LIMA'
  WHERE c.numero_doc = '12309876'
    AND c.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')
  
  UNION ALL
  
  -- Direcciones Daniela Quispe (Tortas & Delicias)
  SELECT
    c.id AS cliente_id,
    'Domicilio' AS etiqueta,
    'Av. Benavides 1234, Surco' AS direccion_completa,
    'Edificio Los Sauces, depto 302' AS referencia,
    d.id AS distrito_id,
    '15038' AS codigo_postal,
    TRUE AS es_fiscal,
    TRUE AS es_entrega
  FROM clientes c
  INNER JOIN ubigeo_distritos d ON d.nombre = 'SANTIAGO DE SURCO'
  INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id AND p.nombre = 'LIMA'
  INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id AND dep.nombre = 'LIMA'
  WHERE c.numero_doc = '98765432'
    AND c.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569')
  
  UNION ALL
  
  -- Direcciones Restaurante El Buen Sabor (Tortas & Delicias)
  SELECT
    c.id AS cliente_id,
    'Sede Principal' AS etiqueta,
    'Av. Primavera 567, Surco' AS direccion_completa,
    'Centro comercial Primavera, local 25' AS referencia,
    d.id AS distrito_id,
    '15038' AS codigo_postal,
    TRUE AS es_fiscal,
    TRUE AS es_entrega
  FROM clientes c
  INNER JOIN ubigeo_distritos d ON d.nombre = 'SANTIAGO DE SURCO'
  INNER JOIN ubigeo_provincias p ON p.id = d.provincia_id AND p.nombre = 'LIMA'
  INNER JOIN ubigeo_departamentos dep ON dep.id = p.departamento_id AND dep.nombre = 'LIMA'
  WHERE c.numero_doc = '20523456789'
    AND c.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569')
) AS new
ON DUPLICATE KEY UPDATE
  etiqueta = VALUES(etiqueta),
  direccion_completa = VALUES(direccion_completa),
  referencia = VALUES(referencia),
  distrito_id = VALUES(distrito_id),
  codigo_postal = VALUES(codigo_postal),
  es_fiscal = VALUES(es_fiscal),
  es_entrega = VALUES(es_entrega);
