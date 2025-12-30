
-- ============================================================================
-- SEED AUXILIAR: PERMISOS, ROLES Y PERMISOS_ROLES
-- ============================================================================
-- Este archivo siembra los permisos del sistema y crea roles estándar
-- para todas las tiendas existentes en la base de datos.
-- Al ser repeteable (R__), se ejecuta cada vez que cambia.
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
ON DUPLICATE KEY UPDATE
  nombre_visible = VALUES(nombre_visible),
  modulo = VALUES(modulo);

-- =================================
-- ROLES ESTÁNDAR (Para todas las tiendas)
-- =================================

-- Crear roles estándar para cada tienda existente
INSERT INTO roles (tienda_id, nombre, descripcion, es_sistema)
SELECT t.id, 'Administrador', 'Acceso total al sistema', TRUE
FROM tiendas t
WHERE NOT EXISTS (
  SELECT 1 FROM roles r WHERE r.tienda_id = t.id AND r.nombre = 'Administrador'
);

INSERT INTO roles (tienda_id, nombre, descripcion, es_sistema)
SELECT t.id, 'Gerente', 'Gestión de operaciones y reportes', TRUE
FROM tiendas t
WHERE NOT EXISTS (
  SELECT 1 FROM roles r WHERE r.tienda_id = t.id AND r.nombre = 'Gerente'
);

INSERT INTO roles (tienda_id, nombre, descripcion, es_sistema)
SELECT t.id, 'Vendedor', 'Registro de ventas y atención al cliente', TRUE
FROM tiendas t
WHERE NOT EXISTS (
  SELECT 1 FROM roles r WHERE r.tienda_id = t.id AND r.nombre = 'Vendedor'
);

INSERT INTO roles (tienda_id, nombre, descripcion, es_sistema)
SELECT t.id, 'Maestro Panadero', 'Gestión de producción y recetas', TRUE
FROM tiendas t
WHERE NOT EXISTS (
  SELECT 1 FROM roles r WHERE r.tienda_id = t.id AND r.nombre = 'Maestro Panadero'
);

INSERT INTO roles (tienda_id, nombre, descripcion, es_sistema)
SELECT t.id, 'Almacenero', 'Gestión de inventario y compras', TRUE
FROM tiendas t
WHERE NOT EXISTS (
  SELECT 1 FROM roles r WHERE r.tienda_id = t.id AND r.nombre = 'Almacenero'
);

-- =================================
-- ASIGNACIÓN DE PERMISOS A ROLES
-- =================================

-- Administrador: Todos los permisos
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permisos p
WHERE r.nombre = 'Administrador'
  AND NOT EXISTS (
    SELECT 1 FROM roles_permisos rp 
    WHERE rp.rol_id = r.id AND rp.permiso_id = p.id
  );

-- Gerente: Todos los permisos excepto configuración y usuarios
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permisos p
WHERE r.nombre = 'Gerente'
  AND p.slug NOT LIKE 'config.%'
  AND p.slug NOT LIKE 'usuarios.%'
  AND NOT EXISTS (
    SELECT 1 FROM roles_permisos rp 
    WHERE rp.rol_id = r.id AND rp.permiso_id = p.id
  );

-- Vendedor: Solo ventas, clientes, pedidos, caja
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permisos p
WHERE r.nombre = 'Vendedor'
  AND (
    p.slug = 'dashboard.view'
    OR p.slug LIKE 'clientes.%'
    OR p.slug = 'productos.view'
    OR p.slug LIKE 'ventas.%'
    OR p.slug LIKE 'pedidos.%'
    OR p.slug LIKE 'caja.%'
  )
  AND NOT EXISTS (
    SELECT 1 FROM roles_permisos rp 
    WHERE rp.rol_id = r.id AND rp.permiso_id = p.id
  );

-- Maestro Panadero: Producción, recetas, inventario (visualización)
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permisos p
WHERE r.nombre = 'Maestro Panadero'
  AND (
    p.slug = 'dashboard.view'
    OR p.slug = 'productos.view'
    OR p.slug LIKE 'produccion.%'
    OR p.slug LIKE 'recetas.%'
    OR p.slug = 'inventario.view'
    OR p.slug = 'reportes.produccion'
  )
  AND NOT EXISTS (
    SELECT 1 FROM roles_permisos rp 
    WHERE rp.rol_id = r.id AND rp.permiso_id = p.id
  );

-- Almacenero: Inventario, compras, proveedores, insumos
INSERT INTO roles_permisos (rol_id, permiso_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permisos p
WHERE r.nombre = 'Almacenero'
  AND (
    p.slug = 'dashboard.view'
    OR p.slug LIKE 'insumos.%'
    OR p.slug LIKE 'compras.%'
    OR p.slug LIKE 'proveedores.%'
    OR p.slug LIKE 'inventario.%'
    OR p.slug = 'reportes.inventario'
  )
  AND NOT EXISTS (
    SELECT 1 FROM roles_permisos rp 
    WHERE rp.rol_id = r.id AND rp.permiso_id = p.id
  );
