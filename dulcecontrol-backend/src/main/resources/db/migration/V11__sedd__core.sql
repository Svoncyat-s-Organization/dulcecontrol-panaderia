-- =============================================================================
-- DULCE CONTROL - V11: Datos Iniciales del Sistema
-- Fecha: 2025-10-11
-- Descripción: Inserts de datos base para sedes, roles, permisos y usuarios
-- =============================================================================

SET search_path = dulce_control, public;

-- =============================================================================
-- 1. SEDES
-- =============================================================================
INSERT INTO sede (nombre, direccion, telefono, activo) VALUES
('PASTELERIA FINA RAULETTI TARAPOTO', 'Jr. Alegría Arias de Morey 119, Tarapoto', '+51 989 205 736', TRUE),
('La Nieta de Portella', 'Jr. Lamas 173, Tarapoto', '+51 989 205 736', TRUE),
('Pasteleria Jheydi', 'Jr. Imperio 602, Nueva Cajamarca - Rioja', '+51 985 694 170', TRUE);

-- =============================================================================
-- 2. ROLES
-- =============================================================================
INSERT INTO rol (nombre, descripcion) VALUES
('ADMIN', 'Administrador con acceso completo al sistema'),
('VENDEDOR', 'Vendedor de mostrador'),
('PANADERO/DECORADOR', 'Encargado de produccion de productos');

-- =============================================================================
-- 3. PERMISOS
-- =============================================================================
INSERT INTO permiso (codigo, descripcion) VALUES
-- Permisos de Sistema
('sistema.configuracion', 'Configurar parámetros del sistema'),
('sistema.usuarios', 'Gestionar usuarios del sistema'),
('sistema.roles', 'Gestionar roles y permisos'),
('sistema.sedes', 'Gestionar sedes'),

-- Permisos de Punto de Venta (POS)
('pos.abrir_caja', 'Abrir sesión de caja'),
('pos.cerrar_caja', 'Cerrar sesión de caja'),
('pos.ventas', 'Realizar ventas'),
('pos.anular_venta', 'Anular ventas'),
('pos.ver_reportes', 'Ver reportes de caja'),

-- Permisos de Inventario
('inventario.ver', 'Ver inventario'),
('inventario.ajustar', 'Realizar ajustes de inventario'),
('inventario.transferir', 'Transferir productos entre sedes'),
('inventario.conteo', 'Realizar conteos de inventario'),

-- Permisos de Productos
('productos.ver', 'Ver catálogo de productos'),
('productos.crear', 'Crear nuevos productos'),
('productos.editar', 'Editar productos existentes'),
('productos.eliminar', 'Eliminar productos'),
('productos.precios', 'Modificar precios de productos'),

-- Permisos de Producción
('produccion.planificar', 'Planificar producción'),
('produccion.registrar', 'Registrar producción realizada'),
('produccion.recetas', 'Gestionar recetas'),

-- Permisos de Compras
('compras.ver', 'Ver compras'),
('compras.crear', 'Registrar nuevas compras'),
('compras.aprobar', 'Aprobar compras'),
('compras.proveedores', 'Gestionar proveedores'),

-- Permisos de Pedidos
('pedidos.ver', 'Ver pedidos'),
('pedidos.crear', 'Crear nuevos pedidos'),
('pedidos.editar', 'Editar pedidos'),
('pedidos.cancelar', 'Cancelar pedidos'),
('pedidos.entregar', 'Marcar pedidos como entregados'),

-- Permisos de Clientes
('clientes.ver', 'Ver clientes'),
('clientes.crear', 'Registrar nuevos clientes'),
('clientes.editar', 'Editar información de clientes'),

-- Permisos de Reportes
('reportes.ventas', 'Ver reportes de ventas'),
('reportes.produccion', 'Ver reportes de producción'),
('reportes.inventario', 'Ver reportes de inventario'),
('reportes.financieros', 'Ver reportes financieros'),

-- Permisos de Gastos
('gastos.ver', 'Ver gastos'),
('gastos.registrar', 'Registrar nuevos gastos'),
('gastos.aprobar', 'Aprobar gastos');

-- =============================================================================
-- 4. ASIGNACIÓN DE PERMISOS A ROLES
-- =============================================================================

-- ADMIN: Todos los permisos
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id
FROM rol r
CROSS JOIN permiso p
WHERE r.nombre = 'ADMIN';

-- VENDEDOR: Permisos de ventas y pedidos
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id
FROM rol r
CROSS JOIN permiso p
WHERE r.nombre = 'VENDEDOR'
  AND p.codigo IN (
    'pos.ventas',
    'productos.ver',
    'clientes.ver',
    'clientes.crear',
    'pedidos.ver',
    'pedidos.crear',
    'pedidos.editar',
    'inventario.ver'
  );

-- INVENTARIO: Permisos de inventario y compras
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id
FROM rol r
CROSS JOIN permiso p
WHERE r.nombre = 'PANADERO/DECORADOR'
  AND p.codigo IN (
    'pedidos.ver',
    'pedidos.entregar',
    'produccion.planificar',
    'produccion.registrar',
    'produccion.recetas'
  );

-- =============================================================================
-- 5. USUARIOS DE PRUEBA
-- =============================================================================
-- NOTA: Las contraseñas están hasheadas con BCrypt
-- Contraseña para todos: "admin123" (hash BCrypt)

INSERT INTO usuario (nombres, apellidos, email, telefono, contrasena_hash, sede_preferida_id, activo) VALUES
('Juan', 'Pérez García', 'juan.perez@dulcecontrol.com', '+51 999 111 222', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, TRUE),
('María', 'López Sánchez', 'maria.lopez@dulcecontrol.com', '+51 999 222 333', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, TRUE),
('Carlos', 'Rodríguez Vega', 'carlos.rodriguez@dulcecontrol.com', '+51 999 333 444', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, TRUE),
('Ana', 'Martínez Torres', 'ana.martinez@dulcecontrol.com', '+51 999 444 555', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, TRUE),
('Luis', 'González Flores', 'luis.gonzalez@dulcecontrol.com', '+51 999 555 666', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, TRUE),
('Rosa', 'Fernández Díaz', 'rosa.fernandez@dulcecontrol.com', '+51 999 666 777', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, TRUE),
('Diego', 'Ramírez Castro', 'diego.ramirez@dulcecontrol.com', '+51 999 777 888', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, TRUE),
('Lucía', 'Torres Salazar', 'lucia.torres@dulcecontrol.com', '+51 999 888 999', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, TRUE),
('Jorge', 'Mendoza Ríos', 'jorge.mendoza@dulcecontrol.com', '+51 999 999 111', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, TRUE),
('Elena', 'Castañeda Ruiz', 'elena.castaneda@dulcecontrol.com', '+51 999 999 222', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, TRUE),
('Andrés', 'Vargas Silva', 'andres.vargas@dulcecontrol.com', '+51 999 999 333', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 3, TRUE),
('Paola', 'Reyes Campos', 'paola.reyes@dulcecontrol.com', '+51 999 999 444', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, TRUE),
('Miguel', 'Navarro León', 'miguel.navarro@dulcecontrol.com', '+51 999 999 555', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, TRUE),
('Carmen', 'Rojas Pineda', 'carmen.rojas@dulcecontrol.com', '+51 999 999 666', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1, TRUE),
('Ricardo', 'Morales Aguirre', 'ricardo.morales@dulcecontrol.com', '+51 999 999 777', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 2, TRUE);

-- =============================================================================
-- 6. ASIGNACIÓN DE ROLES A USUARIOS
-- =============================================================================

-- Juan Pérez - ADMIN (Sede 1)
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'juan.perez@dulcecontrol.com'
  AND r.nombre = 'ADMIN';

-- María López - ADMIN (Sede 2)
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'maria.lopez@dulcecontrol.com'
  AND r.nombre = 'ADMIN';

-- Carlos Rodríguez - ADMIN (Sede 3)
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'carlos.rodriguez@dulcecontrol.com'
  AND r.nombre = 'ADMIN';

-- Ana Martínez - VENDEDOR
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'ana.martinez@dulcecontrol.com'
  AND r.nombre = 'VENDEDOR';

-- Luis González - PANADERO/DECORADOR
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'luis.gonzalez@dulcecontrol.com'
  AND r.nombre = 'PANADERO/DECORADOR';

-- Rosa Fernández - VENDEDOR
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'rosa.fernandez@dulcecontrol.com'
  AND r.nombre = 'VENDEDOR';

-- Diego Ramírez - PANADERO/DECORADOR
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'diego.ramirez@dulcecontrol.com'
  AND r.nombre = 'PANADERO/DECORADOR';

-- Lucía Torres - VENDEDOR
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'lucia.torres@dulcecontrol.com'
  AND r.nombre = 'VENDEDOR';

-- Jorge Mendoza - PANADERO/DECORADOR
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'jorge.mendoza@dulcecontrol.com'
  AND r.nombre = 'PANADERO/DECORADOR';

-- Elena Castañeda - VENDEDOR
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'elena.castaneda@dulcecontrol.com'
  AND r.nombre = 'VENDEDOR';

-- Andrés Vargas - PANADERO/DECORADOR
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'andres.vargas@dulcecontrol.com'
  AND r.nombre = 'PANADERO/DECORADOR';

-- Paola Reyes - VENDEDOR
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'paola.reyes@dulcecontrol.com'
  AND r.nombre = 'VENDEDOR';

-- Miguel Navarro - PANADERO/DECORADOR
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'miguel.navarro@dulcecontrol.com'
  AND r.nombre = 'PANADERO/DECORADOR';

-- Carmen Rojas - VENDEDOR
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'carmen.rojas@dulcecontrol.com'
  AND r.nombre = 'VENDEDOR';

-- Ricardo Morales - PANADERO/DECORADOR
INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuario u
CROSS JOIN rol r
WHERE u.email = 'ricardo.morales@dulcecontrol.com'
  AND r.nombre = 'PANADERO/DECORADOR';

-- =============================================================================
-- 7. ASIGNACIÓN DE SEDES A USUARIOS 
-- =============================================================================

-- Juan Pérez - ADMIN (Acceso a todas las sedes)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'juan.perez@dulcecontrol.com';

-- María López - ADMIN (Acceso a todas las sedes)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'maria.lopez@dulcecontrol.com';

-- Carlos Rodríguez - ADMIN (Acceso a todas las sedes)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'carlos.rodriguez@dulcecontrol.com';

-- Ana Martínez - VENDEDOR (solo PASTELERIA FINA RAULETTI TARAPOTO)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'ana.martinez@dulcecontrol.com'
  AND s.nombre = 'PASTELERIA FINA RAULETTI TARAPOTO';

-- Luis González - PANADERO/DECORADOR (solo LA NIETA DE PORTELLA)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'luis.gonzalez@dulcecontrol.com'
  AND s.nombre = 'LA NIETA DE PORTELLA';

-- Rosa Fernández - VENDEDOR (solo PASTELERIA JHEIDY)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'rosa.fernandez@dulcecontrol.com'
  AND s.nombre = 'PASTELERIA JHEIDY';

-- Diego Ramírez - PANADERO/DECORADOR (PASTELERIA FINA RAULETTI TARAPOTO y LA NIETA DE PORTELLA)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'diego.ramirez@dulcecontrol.com'
  AND s.nombre IN ('PASTELERIA FINA RAULETTI TARAPOTO', 'LA NIETA DE PORTELLA');

-- Lucía Torres - VENDEDOR (solo LA NIETA DE PORTELLA)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'lucia.torres@dulcecontrol.com'
  AND s.nombre = 'LA NIETA DE PORTELLA';

-- Jorge Mendoza - PANADERO/DECORADOR (solo PASTELERIA JHEIDY)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'jorge.mendoza@dulcecontrol.com'
  AND s.nombre = 'PASTELERIA JHEIDY';

-- Elena Castañeda - VENDEDOR (solo PASTELERIA FINA RAULETTI TARAPOTO)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'elena.castaneda@dulcecontrol.com'
  AND s.nombre = 'PASTELERIA FINA RAULETTI TARAPOTO';

-- Andrés Vargas - PANADERO/DECORADOR (solo LA NIETA DE PORTELLA)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'andres.vargas@dulcecontrol.com'
  AND s.nombre = 'LA NIETA DE PORTELLA';

-- Paola Reyes - VENDEDOR (solo PASTELERIA JHEIDY)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'paola.reyes@dulcecontrol.com'
  AND s.nombre = 'PASTELERIA JHEIDY';

-- Miguel Navarro - PANADERO/DECORADOR (PASTELERIA FINA RAULETTI TARAPOTO y PASTELERIA JHEIDY)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'miguel.navarro@dulcecontrol.com'
  AND s.nombre IN ('PASTELERIA FINA RAULETTI TARAPOTO', 'PASTELERIA JHEIDY');

-- Carmen Rojas - VENDEDOR (solo LA NIETA DE PORTELLA)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'carmen.rojas@dulcecontrol.com'
  AND s.nombre = 'LA NIETA DE PORTELLA';

-- Ricardo Morales - PANADERO/DECORADOR (solo PASTELERIA FINA RAULETTI TARAPOTO)
INSERT INTO usuario_sede (usuario_id, sede_id)
SELECT u.id, s.id
FROM usuario u
CROSS JOIN sede s
WHERE u.email = 'ricardo.morales@dulcecontrol.com'
  AND s.nombre = 'PASTELERIA FINA RAULETTI TARAPOTO';

