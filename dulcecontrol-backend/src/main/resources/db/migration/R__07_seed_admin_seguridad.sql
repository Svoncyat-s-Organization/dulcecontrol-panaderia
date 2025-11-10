-- ============================================================================
-- R_07: SEED SEGURIDAD ADMINISTRADOR (ROLES, PERMISOS, USUARIOS)
-- ============================================================================

-- =================================
-- PERMISOS DEL SISTEMA
-- =================================

INSERT INTO permisos (slug, nombre_visible, modulo)
VALUES
  -- Módulo Dashboard
  ('dashboard.view', 'Ver Dashboard', 'dashboard'),
  ('dashboard.stats', 'Ver Estadísticas Avanzadas', 'dashboard'),
  
  -- Módulo Clientes
  ('clientes.view', 'Ver Clientes', 'clientes'),
  ('clientes.create', 'Crear Clientes', 'clientes'),
  ('clientes.edit', 'Editar Clientes', 'clientes'),
  ('clientes.delete', 'Eliminar Clientes', 'clientes'),
  
  -- Módulo Productos
  ('productos.view', 'Ver Productos', 'productos'),
  ('productos.create', 'Crear Productos', 'productos'),
  ('productos.edit', 'Editar Productos', 'productos'),
  ('productos.delete', 'Eliminar Productos', 'productos'),
  ('productos.precios', 'Modificar Precios', 'productos'),
  
  -- Módulo Categorías
  ('categorias.view', 'Ver Categorías', 'categorias'),
  ('categorias.manage', 'Gestionar Categorías', 'categorias'),
  
  -- Módulo Ventas/POS
  ('ventas.view', 'Ver Ventas', 'ventas'),
  ('ventas.create', 'Registrar Ventas', 'ventas'),
  ('ventas.cancel', 'Cancelar Ventas', 'ventas'),
  ('ventas.refund', 'Procesar Devoluciones', 'ventas'),
  
  -- Módulo Pedidos
  ('pedidos.view', 'Ver Pedidos', 'pedidos'),
  ('pedidos.create', 'Crear Pedidos', 'pedidos'),
  ('pedidos.edit', 'Editar Pedidos', 'pedidos'),
  ('pedidos.cancel', 'Cancelar Pedidos', 'pedidos'),
  ('pedidos.status', 'Cambiar Estado de Pedidos', 'pedidos'),
  
  -- Módulo Caja
  ('caja.open', 'Abrir Caja', 'caja'),
  ('caja.close', 'Cerrar Caja', 'caja'),
  ('caja.view', 'Ver Movimientos de Caja', 'caja'),
  ('caja.adjust', 'Ajustar Caja', 'caja'),
  
  -- Módulo Producción
  ('produccion.view', 'Ver Planes de Producción', 'produccion'),
  ('produccion.create', 'Crear Plan de Producción', 'produccion'),
  ('produccion.edit', 'Editar Plan de Producción', 'produccion'),
  ('produccion.confirm', 'Confirmar Producción', 'produccion'),
  ('produccion.conteo', 'Realizar Conteo Diario', 'produccion'),
  
  -- Módulo Recetas
  ('recetas.view', 'Ver Recetas', 'recetas'),
  ('recetas.manage', 'Gestionar Recetas', 'recetas'),
  
  -- Módulo Insumos
  ('insumos.view', 'Ver Insumos', 'insumos'),
  ('insumos.create', 'Crear Insumos', 'insumos'),
  ('insumos.edit', 'Editar Insumos', 'insumos'),
  ('insumos.delete', 'Eliminar Insumos', 'insumos'),
  
  -- Módulo Compras
  ('compras.view', 'Ver Órdenes de Compra', 'compras'),
  ('compras.create', 'Crear Orden de Compra', 'compras'),
  ('compras.edit', 'Editar Orden de Compra', 'compras'),
  ('compras.receive', 'Recibir Mercadería', 'compras'),
  ('compras.cancel', 'Cancelar Orden de Compra', 'compras'),
  
  -- Módulo Proveedores
  ('proveedores.view', 'Ver Proveedores', 'proveedores'),
  ('proveedores.create', 'Crear Proveedores', 'proveedores'),
  ('proveedores.edit', 'Editar Proveedores', 'proveedores'),
  ('proveedores.delete', 'Eliminar Proveedores', 'proveedores'),
  
  -- Módulo Inventario
  ('inventario.view', 'Ver Inventario', 'inventario'),
  ('inventario.adjust', 'Ajustar Inventario', 'inventario'),
  ('inventario.transfer', 'Transferir entre Sedes', 'inventario'),
  
  -- Módulo Reportes
  ('reportes.ventas', 'Ver Reportes de Ventas', 'reportes'),
  ('reportes.produccion', 'Ver Reportes de Producción', 'reportes'),
  ('reportes.inventario', 'Ver Reportes de Inventario', 'reportes'),
  ('reportes.financiero', 'Ver Reportes Financieros', 'reportes'),
  
  -- Módulo Facturación
  ('facturacion.view', 'Ver Comprobantes', 'facturacion'),
  ('facturacion.generate', 'Generar Comprobantes', 'facturacion'),
  ('facturacion.cancel', 'Anular Comprobantes', 'facturacion'),
  ('facturacion.sunat', 'Enviar a SUNAT', 'facturacion'),
  
  -- Módulo Usuarios
  ('usuarios.view', 'Ver Usuarios', 'usuarios'),
  ('usuarios.create', 'Crear Usuarios', 'usuarios'),
  ('usuarios.edit', 'Editar Usuarios', 'usuarios'),
  ('usuarios.delete', 'Eliminar Usuarios', 'usuarios'),
  ('usuarios.roles', 'Gestionar Roles', 'usuarios'),
  
  -- Módulo Configuración
  ('config.view', 'Ver Configuración', 'configuracion'),
  ('config.edit', 'Editar Configuración', 'configuracion'),
  ('config.tienda', 'Configurar Tienda', 'configuracion'),
  ('config.sedes', 'Gestionar Sedes', 'configuracion'),
  
  -- Módulo CMS
  ('cms.view', 'Ver Páginas', 'cms'),
  ('cms.edit', 'Editar Páginas', 'cms')
AS new
ON DUPLICATE KEY UPDATE
  nombre_visible = new.nombre_visible,
  modulo = new.modulo;

-- =================================
-- ROLES DEL SISTEMA (Para cada tienda)
-- =================================

-- Roles para Dulce Manjar
INSERT INTO roles (tienda_id, nombre, descripcion, es_sistema)
VALUES
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Administrador',
    'Acceso total al sistema',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Gerente',
    'Gestión de operaciones y reportes',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Vendedor',
    'Registro de ventas y atención al cliente',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Maestro Panadero',
    'Gestión de producción y recetas',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Almacenero',
    'Gestión de inventario y compras',
    TRUE
  ),
  -- Roles para Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Administrador',
    'Acceso total al sistema',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Vendedor',
    'Registro de ventas y atención al cliente',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    'Panadero',
    'Gestión de producción',
    TRUE
  ),
  -- Roles para Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Administrador',
    'Acceso total al sistema',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    'Vendedor',
    'Registro de ventas y atención al cliente',
    TRUE
  )
AS new
ON DUPLICATE KEY UPDATE
  descripcion = new.descripcion,
  es_sistema = new.es_sistema;

-- =================================
-- ASIGNACIÓN DE PERMISOS A ROLES
-- =================================

-- Administrador de Dulce Manjar (todos los permisos)
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT new.rol_id, new.permiso_id
FROM (
  SELECT
    r.id AS rol_id,
    p.id AS permiso_id
  FROM roles r
  CROSS JOIN permisos p
  WHERE r.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND r.nombre = 'Administrador'
) AS new
ON DUPLICATE KEY UPDATE rol_id = new.rol_id;

-- Gerente de Dulce Manjar (permisos de gestión, sin configuración)
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT new.rol_id, new.permiso_id
FROM (
  SELECT
    r.id AS rol_id,
    p.id AS permiso_id
  FROM roles r
  CROSS JOIN permisos p
  WHERE r.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND r.nombre = 'Gerente'
    AND p.slug NOT LIKE 'config.%'
    AND p.slug NOT LIKE 'usuarios.%'
) AS new
ON DUPLICATE KEY UPDATE rol_id = new.rol_id;

-- Vendedor de Dulce Manjar (solo ventas, clientes, pedidos, caja)
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT new.rol_id, new.permiso_id
FROM (
  SELECT
    r.id AS rol_id,
    p.id AS permiso_id
  FROM roles r
  CROSS JOIN permisos p
  WHERE r.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND r.nombre = 'Vendedor'
    AND (
      p.slug LIKE 'dashboard.view'
      OR p.slug LIKE 'clientes.%'
      OR p.slug LIKE 'productos.view'
      OR p.slug LIKE 'ventas.%'
      OR p.slug LIKE 'pedidos.%'
      OR p.slug LIKE 'caja.%'
    )
) AS new
ON DUPLICATE KEY UPDATE rol_id = new.rol_id;

-- Maestro Panadero de Dulce Manjar (producción, recetas, inventario)
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT new.rol_id, new.permiso_id
FROM (
  SELECT
    r.id AS rol_id,
    p.id AS permiso_id
  FROM roles r
  CROSS JOIN permisos p
  WHERE r.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND r.nombre = 'Maestro Panadero'
    AND (
      p.slug LIKE 'dashboard.view'
      OR p.slug LIKE 'productos.view'
      OR p.slug LIKE 'produccion.%'
      OR p.slug LIKE 'recetas.%'
      OR p.slug LIKE 'inventario.view'
      OR p.slug LIKE 'reportes.produccion'
    )
) AS new
ON DUPLICATE KEY UPDATE rol_id = new.rol_id;

-- Almacenero de Dulce Manjar (inventario, compras, proveedores)
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT new.rol_id, new.permiso_id
FROM (
  SELECT
    r.id AS rol_id,
    p.id AS permiso_id
  FROM roles r
  CROSS JOIN permisos p
  WHERE r.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND r.nombre = 'Almacenero'
    AND (
      p.slug LIKE 'dashboard.view'
      OR p.slug LIKE 'insumos.%'
      OR p.slug LIKE 'compras.%'
      OR p.slug LIKE 'proveedores.%'
      OR p.slug LIKE 'inventario.%'
      OR p.slug LIKE 'reportes.inventario'
    )
) AS new
ON DUPLICATE KEY UPDATE rol_id = new.rol_id;

-- Administrador de Panadería El Sol (todos los permisos)
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT new.rol_id, new.permiso_id
FROM (
  SELECT
    r.id AS rol_id,
    p.id AS permiso_id
  FROM roles r
  CROSS JOIN permisos p
  WHERE r.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')
    AND r.nombre = 'Administrador'
) AS new
ON DUPLICATE KEY UPDATE rol_id = new.rol_id;

-- Vendedor de Panadería El Sol
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT new.rol_id, new.permiso_id
FROM (
  SELECT
    r.id AS rol_id,
    p.id AS permiso_id
  FROM roles r
  CROSS JOIN permisos p
  WHERE r.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')
    AND r.nombre = 'Vendedor'
    AND (
      p.slug LIKE 'dashboard.view'
      OR p.slug LIKE 'clientes.%'
      OR p.slug LIKE 'productos.view'
      OR p.slug LIKE 'ventas.%'
      OR p.slug LIKE 'pedidos.%'
      OR p.slug LIKE 'caja.%'
    )
) AS new
ON DUPLICATE KEY UPDATE rol_id = new.rol_id;

-- Panadero de Panadería El Sol
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT new.rol_id, new.permiso_id
FROM (
  SELECT
    r.id AS rol_id,
    p.id AS permiso_id
  FROM roles r
  CROSS JOIN permisos p
  WHERE r.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')
    AND r.nombre = 'Panadero'
    AND (
      p.slug LIKE 'dashboard.view'
      OR p.slug LIKE 'productos.view'
      OR p.slug LIKE 'produccion.%'
      OR p.slug LIKE 'recetas.view'
    )
) AS new
ON DUPLICATE KEY UPDATE rol_id = new.rol_id;

-- Administrador de Tortas & Delicias
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT new.rol_id, new.permiso_id
FROM (
  SELECT
    r.id AS rol_id,
    p.id AS permiso_id
  FROM roles r
  CROSS JOIN permisos p
  WHERE r.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569')
    AND r.nombre = 'Administrador'
) AS new
ON DUPLICATE KEY UPDATE rol_id = new.rol_id;

-- Vendedor de Tortas & Delicias
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT new.rol_id, new.permiso_id
FROM (
  SELECT
    r.id AS rol_id,
    p.id AS permiso_id
  FROM roles r
  CROSS JOIN permisos p
  WHERE r.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569')
    AND r.nombre = 'Vendedor'
    AND (
      p.slug LIKE 'dashboard.view'
      OR p.slug LIKE 'clientes.%'
      OR p.slug LIKE 'productos.view'
      OR p.slug LIKE 'ventas.%'
      OR p.slug LIKE 'pedidos.%'
      OR p.slug LIKE 'caja.%'
    )
) AS new
ON DUPLICATE KEY UPDATE rol_id = new.rol_id;

-- =================================
-- USUARIOS DE PRUEBA
-- =================================

INSERT INTO usuarios_tienda (tienda_id, rol_id, correo, hash_contrasena, tipo_doc, numero_doc, nombres_doc, telefono, activo)
VALUES
  -- Usuarios de Dulce Manjar
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM roles WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND nombre = 'Administrador'),
    'admin@dulcemanjar.pe',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'DNI',
    '12345678',
    'María Elena Rodríguez García',
    '987654321',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM roles WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND nombre = 'Gerente'),
    'gerente@dulcemanjar.pe',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'DNI',
    '23456789',
    'Carlos Alberto Mendoza Silva',
    '987654325',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM roles WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND nombre = 'Vendedor'),
    'vendedor1@dulcemanjar.pe',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'DNI',
    '34567890',
    'Ana Patricia Torres López',
    '987654326',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM roles WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND nombre = 'Maestro Panadero'),
    'panadero@dulcemanjar.pe',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'DNI',
    '45678901',
    'José Luis Ramírez Castro',
    '987654327',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM roles WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567') AND nombre = 'Almacenero'),
    'almacen@dulcemanjar.pe',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'DNI',
    '56789012',
    'Pedro Antonio Vásquez Ruiz',
    '987654328',
    TRUE
  ),
  -- Usuarios de Panadería El Sol
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM roles WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND nombre = 'Administrador'),
    'admin@panaderiasol.pe',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'DNI',
    '67890123',
    'Roberto Carlos Flores Díaz',
    '987654329',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM roles WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND nombre = 'Vendedor'),
    'vendedor@panaderiasol.pe',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'DNI',
    '78901234',
    'Lucía Fernanda Sánchez Pérez',
    '987654330',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM roles WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568') AND nombre = 'Panadero'),
    'panadero@panaderiasol.pe',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'DNI',
    '89012345',
    'Miguel Ángel Gutiérrez Vargas',
    '987654331',
    TRUE
  ),
  -- Usuarios de Tortas & Delicias
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM roles WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND nombre = 'Administrador'),
    'admin@tortasdelicias.pe',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'DNI',
    '90123456',
    'Carmen Rosa Morales Castillo',
    '987654332',
    TRUE
  ),
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    (SELECT id FROM roles WHERE tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569') AND nombre = 'Vendedor'),
    'vendedor@tortasdelicias.pe',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- contraseña: demo123
    'DNI',
    '01234567',
    'Sandra Milena Herrera Quispe',
    '987654333',
    TRUE
  )
AS new
ON DUPLICATE KEY UPDATE
  correo = new.correo,
  hash_contrasena = new.hash_contrasena,
  nombres_doc = new.nombres_doc,
  telefono = new.telefono,
  activo = new.activo;

-- =================================
-- ASIGNACIÓN DE USUARIOS A SEDES
-- =================================

-- Usuarios de Dulce Manjar - Sede Principal Miraflores
INSERT INTO usuario_sedes (usuario_id, sede_id, es_sede_principal)
SELECT new.usuario_id, new.sede_id, new.es_sede_principal
FROM (
  SELECT
    u.id AS usuario_id,
    s.id AS sede_id,
    TRUE AS es_sede_principal
  FROM usuarios_tienda u
  INNER JOIN sedes s ON s.tienda_id = u.tienda_id
  WHERE u.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND s.codigo_interno = 'DM-001'
) AS new
ON DUPLICATE KEY UPDATE es_sede_principal = new.es_sede_principal;

-- Vendedor de Dulce Manjar también tiene acceso a San Isidro
INSERT INTO usuario_sedes (usuario_id, sede_id, es_sede_principal)
SELECT new.usuario_id, new.sede_id, new.es_sede_principal
FROM (
  SELECT
    u.id AS usuario_id,
    s.id AS sede_id,
    FALSE AS es_sede_principal
  FROM usuarios_tienda u
  INNER JOIN sedes s ON s.tienda_id = u.tienda_id
  WHERE u.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234567')
    AND u.correo = 'vendedor1@dulcemanjar.pe'
    AND s.codigo_interno = 'DM-002'
) AS new
ON DUPLICATE KEY UPDATE es_sede_principal = new.es_sede_principal;

-- Usuarios de Panadería El Sol - Sede Única
INSERT INTO usuario_sedes (usuario_id, sede_id, es_sede_principal)
SELECT new.usuario_id, new.sede_id, new.es_sede_principal
FROM (
  SELECT
    u.id AS usuario_id,
    s.id AS sede_id,
    TRUE AS es_sede_principal
  FROM usuarios_tienda u
  INNER JOIN sedes s ON s.tienda_id = u.tienda_id
  WHERE u.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234568')
    AND s.codigo_interno = 'PS-001'
) AS new
ON DUPLICATE KEY UPDATE es_sede_principal = new.es_sede_principal;

-- Usuarios de Tortas & Delicias - Sede Única
INSERT INTO usuario_sedes (usuario_id, sede_id, es_sede_principal)
SELECT new.usuario_id, new.sede_id, new.es_sede_principal
FROM (
  SELECT
    u.id AS usuario_id,
    s.id AS sede_id,
    TRUE AS es_sede_principal
  FROM usuarios_tienda u
  INNER JOIN sedes s ON s.tienda_id = u.tienda_id
  WHERE u.tienda_id = (SELECT id FROM tiendas WHERE numero_doc = '20601234569')
    AND s.codigo_interno = 'TD-001'
) AS new
ON DUPLICATE KEY UPDATE es_sede_principal = new.es_sede_principal;
