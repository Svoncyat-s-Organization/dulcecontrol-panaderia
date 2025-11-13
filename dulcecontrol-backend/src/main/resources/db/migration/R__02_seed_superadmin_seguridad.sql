-- ============================================================================
-- R_02: SEED SEGURIDAD SUPERADMINISTRADOR
-- ============================================================================

-- =================================
-- USUARIOS SUPERADMIN
-- =================================

INSERT INTO usuarios_superadmin (id, correo, hash_contrasena, tipo_doc, numero_doc, nombres_doc, telefono, activo, creado_en, actualizado_en)
VALUES
  (
    1,
    'sofia.rojas@dulcecontrol.pe',
    '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', -- contraseña: demo123
    'DNI',
    '45879632',
    'Sofía Andrea Rojas Delgado',
    '999888777',
    TRUE,
    '2024-01-05 09:30:00',
    '2024-01-05 09:30:00'
  ),
  (
    2,
    'martin.leon@dulcecontrol.pe',
    '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', -- contraseña: demo123
    'DNI',
    '41236547',
    'Martín Eduardo León Paredes',
    '988777666',
    TRUE,
    '2024-01-05 09:45:00',
    '2024-01-05 09:45:00'
  ),
  (
    3,
    'administrador@dulcecontrol.pe',
    '$2a$10$.VTbUPug.CwBqEurWC/1GuCBAaZAK4ZBsbqwXFcWKpev31J/JvGQK', -- contraseña: demo123
    'RUC',
    '20609999888',
    'DulceControl S.A.C.',
    '987654310',
    TRUE,
    '2024-01-06 10:10:00',
    '2024-01-06 10:10:00'
  )
AS new
ON DUPLICATE KEY UPDATE
  correo = new.correo,
  hash_contrasena = new.hash_contrasena,
  tipo_doc = new.tipo_doc,
  numero_doc = new.numero_doc,
  nombres_doc = new.nombres_doc,
  telefono = new.telefono,
  activo = new.activo,
  creado_en = new.creado_en,
  actualizado_en = new.actualizado_en;

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
AS new
ON DUPLICATE KEY UPDATE
  admin_id = new.admin_id,
  tipo_evento = new.tipo_evento,
  ip_origen = new.ip_origen,
  detalles = new.detalles,
  creado_en = new.creado_en;