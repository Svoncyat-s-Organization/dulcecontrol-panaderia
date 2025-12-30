-- ============================================================================
-- R_02: SEED SEGURIDAD SUPERADMINISTRADOR
-- ============================================================================

-- =================================
-- DESARROLLADOR TOKEN
-- =================================

INSERT INTO desarrollador_token (id, nombre_completo, correo, hash_contrasena, activo, creado_en, eliminado_en)
VALUES
  (
    1,
    'Joy Steven Correa Torres',
    'joy.correa@dev.dulcecontrol.pe',
    '$2a$12$Oq8FdZHwWJNEi0LleTdJNeKr/yFTTD42IzFoOIfkrvPN1Sq/ICxlm', -- contraseña: clave123
    TRUE,
    '2025-01-01 08:00:00',
    NULL
  ),
  (
    2,
    'Belthe Alain Rodas Cubas',
    'belthe.rodas@dev.dulcecontrol.pe',
    '$2a$12$Oq8FdZHwWJNEi0LleTdJNeKr/yFTTD42IzFoOIfkrvPN1Sq/ICxlm', -- contraseña: clave123
    TRUE,
    '2025-01-02 09:30:00',
    NULL
  ),
  (
    3,
    'Frank Edgardo Vasquez Bardalez',
    'frank.vasquez@dev.dulcecontrol.pe',
    '$2a$12$Oq8FdZHwWJNEi0LleTdJNeKr/yFTTD42IzFoOIfkrvPN1Sq/ICxlm', -- contraseña: clave123
    TRUE,
    '2025-01-03 10:15:00',
    NULL
  ),
  (
    4,
    'Jeison Yamir Carranza Diaz',
    'jeison.carranza@dev.dulcecontrol.pe',
    '$2a$12$Oq8FdZHwWJNEi0LleTdJNeKr/yFTTD42IzFoOIfkrvPN1Sq/ICxlm', -- contraseña: clave123
    FALSE,
    '2025-01-04 11:00:00',
    '2025-06-15 14:30:00'
  )
ON DUPLICATE KEY UPDATE
  nombre_completo = VALUES(nombre_completo),
  correo = VALUES(correo),
  hash_contrasena = VALUES(hash_contrasena),
  activo = VALUES(activo),
  creado_en = VALUES(creado_en),
  eliminado_en = VALUES(eliminado_en);

-- =================================
-- USUARIOS SUPERADMIN
-- =================================

INSERT INTO usuarios_superadmin (id, correo, hash_contrasena, tipo_doc, numero_doc, nombres_doc, telefono, activo, creado_en, actualizado_en)
VALUES
  (
    1,
    'ubuntu.sanchez@dulcecontrol.pe',
    '$2a$12$Oq8FdZHwWJNEi0LleTdJNeKr/yFTTD42IzFoOIfkrvPN1Sq/ICxlm', -- contraseña: clave123
    'DNI',
    '45879632',
    'Frank Ubuntu Vasquez Reategui',
    '999888777',
    TRUE,
    '2024-01-05 09:30:00',
    '2024-01-05 09:30:00'
  ),
  (
    2,
    'pepe.guevara@dulcecontrol.pe',
    '$2a$12$Oq8FdZHwWJNEi0LleTdJNeKr/yFTTD42IzFoOIfkrvPN1Sq/ICxlm', -- contraseña: clave123
    'DNI',
    '41236547',
    'Shenlon Ayachi Llanos',
    '988777666',
    TRUE,
    '2024-01-05 09:45:00',
    '2024-01-05 09:45:00'
  ),
  (
    3,
    'administrador@dulcecontrol.pe',
    '$2a$12$Oq8FdZHwWJNEi0LleTdJNeKr/yFTTD42IzFoOIfkrvPN1Sq/ICxlm', -- contraseña: clave123
    'RUC',
    '20609999888',
    'DulceControl S.A.C.',
    '987654310',
    TRUE,
    '2024-01-06 10:10:00',
    '2024-01-06 10:10:00'
  )
ON DUPLICATE KEY UPDATE
  correo = VALUES(correo),
  hash_contrasena = VALUES(hash_contrasena),
  tipo_doc = VALUES(tipo_doc),
  numero_doc = VALUES(numero_doc),
  nombres_doc = VALUES(nombres_doc),
  telefono = VALUES(telefono),
  activo = VALUES(activo),
  creado_en = VALUES(creado_en),
  actualizado_en = VALUES(actualizado_en);

-- =================================
-- PERMISOS SUPERADMIN
-- =================================

INSERT INTO permisos_superadmin (id, slug, nombre_visible, modulo)
VALUES
  (1, 'seguridad.usuarios.view', 'Gestión de usuarios corporativos', 'Seguridad'),
  (2, 'seguridad.usuarios.manage', 'Gestionar usuarios corporativos', 'Seguridad'),
  (3, 'seguridad.roles.manage', 'Gestionar roles y permisos', 'Seguridad'),
  (4, 'tiendas.manage', 'Gestionar tiendas y sucursales', 'Tiendas'),
  (5, 'suscripciones.manage', 'Gestionar suscripciones', 'Suscripciones'),
  (6, 'facturacion.manage', 'Gestionar facturación SaaS', 'Facturacion'),
  (7, 'soporte.manage', 'Gestionar soporte corporativo', 'Soporte'),
  (8, 'reportes.view', 'Gestión de reportes ejecutivos', 'Reportes')
ON DUPLICATE KEY UPDATE
  nombre_visible = VALUES(nombre_visible),
  modulo = VALUES(modulo);

-- =================================
-- ROLES SUPERADMIN
-- =================================

INSERT INTO roles_superadmin (id, nombre, descripcion, es_sistema)
VALUES
  (
    1,
    'Administrador Global',
    'Acceso completo a la plataforma y capacidades corporativas',
    TRUE
  )
ON DUPLICATE KEY UPDATE
  descripcion = VALUES(descripcion),
  es_sistema = VALUES(es_sistema),
  actualizado_en = CURRENT_TIMESTAMP;

-- =================================
-- ASIGNACIÓN DE PERMISOS A ROLES
-- =================================

INSERT INTO roles_superadmin_permisos (rol_id, permiso_id)
SELECT
  (SELECT id FROM roles_superadmin WHERE nombre = 'Administrador Global') AS rol_id,
  p.id AS permiso_id
FROM permisos_superadmin p
ON DUPLICATE KEY UPDATE rol_id = VALUES(rol_id);

-- =================================
-- ASIGNACIÓN DE ROLES A USUARIOS
-- =================================

INSERT INTO usuarios_superadmin_roles (usuario_id, rol_id)
SELECT u.id, r.id
FROM usuarios_superadmin u
CROSS JOIN roles_superadmin r
WHERE r.nombre = 'Administrador Global'
  AND u.correo IN (
    'sofia.rojas@dulcecontrol.pe',
    'martin.leon@dulcecontrol.pe',
    'administrador@dulcecontrol.pe'
  )
ON DUPLICATE KEY UPDATE usuario_id = VALUES(usuario_id);

-- =================================
-- ACTIVIDADES RECIENTES
-- =================================

INSERT INTO actividad_superadmin (id, admin_id, tipo_evento, ip_origen, detalles, creado_en)
VALUES
  (
    1,
    (SELECT id FROM usuarios_superadmin WHERE correo = 'sofia.rojas@dulcecontrol.pe'),
    'login_exitoso',
    '2001:db8:1::101',
    JSON_OBJECT('navegador', 'Chrome 120', 'plataforma', 'Windows 11', 'accion', 'login'),
    '2024-01-06 08:45:00'
  ),
  (
    2,
    (SELECT id FROM usuarios_superadmin WHERE correo = 'sofia.rojas@dulcecontrol.pe'),
    'configuracion_actualizada',
    '2001:db8:1::101',
    JSON_OBJECT('modulo', 'tiendas', 'descripcion', 'Actualizó datos de la tienda Dulce Manjar'),
    '2024-01-06 09:10:00'
  ),
  (
    3,
    (SELECT id FROM usuarios_superadmin WHERE correo = 'martin.leon@dulcecontrol.pe'),
    'plan_aprobado',
    '2801:1d8:203::55',
    JSON_OBJECT('tienda', 'Panadería El Sol', 'plan', 'PLAN_PRO'),
    '2024-02-02 10:20:00'
  ),
  (
    4,
    (SELECT id FROM usuarios_superadmin WHERE correo = 'administrador@dulcecontrol.pe'),
    'sistema_mantenimiento',
    '2801:1d8:203::60',
    JSON_OBJECT('accion', 'programacion_mantenimiento', 'ventana', '2024-02-05 00:00 - 02:00'),
    '2024-02-04 18:30:00'
  )
ON DUPLICATE KEY UPDATE
  admin_id = VALUES(admin_id),
  tipo_evento = VALUES(tipo_evento),
  ip_origen = VALUES(ip_origen),
  detalles = VALUES(detalles),
  creado_en = VALUES(creado_en);