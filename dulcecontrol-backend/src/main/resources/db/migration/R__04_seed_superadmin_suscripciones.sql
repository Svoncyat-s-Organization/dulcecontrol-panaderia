-- ============================================================================
-- R_04: SEED SUSCRIPCIONES SUPERADMINISTRADOR
-- ============================================================================

-- =================================
-- PLANES DISPONIBLES
-- =================================

INSERT INTO planes (id, codigo, nombre, descripcion, precio_mensual_centimos, precio_anual_centimos, moneda, limites, activo, creado_en, actualizado_en)
VALUES
  (
    1,
    'PLAN_BASIC',
    'Plan Básico',
    'Orientado a panaderías con operaciones iniciales y un equipo reducido.',
    9900,
    99000,
    'PEN',
    JSON_OBJECT('usuarios', 5, 'sedes', 2, 'almacenamiento_gb', 20, 'facturacion', JSON_OBJECT('comprobantes_mensuales', 200)),
    TRUE,
    '2024-01-10 09:00:00',
    '2024-01-10 09:00:00'
  ),
  (
    2,
    'PLAN_PRO',
    'Plan Profesional',
    'Pensado para cadenas en expansión con necesidades avanzadas de producción.',
    14990,
    149900,
    'PEN',
    JSON_OBJECT('usuarios', 15, 'sedes', 5, 'almacenamiento_gb', 80, 'facturacion', JSON_OBJECT('comprobantes_mensuales', 1000)),
    TRUE,
    '2024-01-10 09:05:00',
    '2024-01-10 09:05:00'
  ),
  (
    3,
    'PLAN_ENTERPRISE',
    'Plan Enterprise',
    'Incluye soporte dedicado, integración con ERP y facturación ilimitada.',
    25990,
    259900,
    'PEN',
    JSON_OBJECT('usuarios', 50, 'sedes', 15, 'almacenamiento_gb', 250, 'soporte', JSON_OBJECT('24x7', TRUE, 'canal', 'Slack')), 
    TRUE,
    '2024-01-10 09:10:00',
    '2024-01-10 09:10:00'
  )
AS new
ON DUPLICATE KEY UPDATE
  codigo = new.codigo,
  nombre = new.nombre,
  descripcion = new.descripcion,
  precio_mensual_centimos = new.precio_mensual_centimos,
  precio_anual_centimos = new.precio_anual_centimos,
  moneda = new.moneda,
  limites = new.limites,
  activo = new.activo,
  creado_en = new.creado_en,
  actualizado_en = new.actualizado_en;

-- =================================
-- SUSCRIPCIONES DE TIENDAS
-- =================================

INSERT INTO suscripciones (id, tienda_id, plan_id, ciclo, precio_pactado_centimos, fecha_inicio, fecha_fin, estado, autorenovar, cancelado_en, creado_en, actualizado_en)
VALUES
  (
    1,
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    2,
    'MENSUAL',
    14990,
    '2024-02-01 00:00:00',
    '2024-07-31 23:59:59',
    'ACTIVA',
    TRUE,
    NULL,
    '2024-02-01 08:00:00',
    '2024-04-01 09:15:00'
  ),
  (
    2,
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    1,
    'MENSUAL',
    8990,
    '2024-02-10 00:00:00',
    '2024-03-10 23:59:59',
    'EN_PRUEBA',
    TRUE,
    NULL,
    '2024-02-10 09:00:00',
    '2024-02-10 09:00:00'
  ),
  (
    3,
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    3,
    'ANUAL',
    259900,
    '2024-01-01 00:00:00',
    '2024-12-31 23:59:59',
    'CANCELADA',
    FALSE,
    '2024-05-20 12:00:00',
    '2024-01-01 10:15:00',
    '2024-05-20 12:05:00'
  )
AS new
ON DUPLICATE KEY UPDATE
  tienda_id = new.tienda_id,
  plan_id = new.plan_id,
  ciclo = new.ciclo,
  precio_pactado_centimos = new.precio_pactado_centimos,
  fecha_inicio = new.fecha_inicio,
  fecha_fin = new.fecha_fin,
  estado = new.estado,
  autorenovar = new.autorenovar,
  cancelado_en = new.cancelado_en,
  creado_en = new.creado_en,
  actualizado_en = new.actualizado_en;

-- =================================
-- HISTORIAL DE SUSCRIPCIONES
-- =================================

INSERT INTO historial_suscripciones (id, suscripcion_id, plan_anterior_id, plan_nuevo_id, tipo_movimiento, precio_anterior_centimos, precio_nuevo_centimos, fecha_movimiento, usuario_responsable_id)
VALUES
  (
    1,
    1,
    NULL,
    1,
    'ALTA',
    NULL,
    9900,
    '2024-01-15 10:00:00',
    (SELECT id FROM usuarios_superadmin WHERE correo = 'sofia.rojas@dulcecontrol.pe')
  ),
  (
    2,
    1,
    1,
    2,
    'UPGRADE',
    9900,
    14990,
    '2024-02-01 08:05:00',
    (SELECT id FROM usuarios_superadmin WHERE correo = 'sofia.rojas@dulcecontrol.pe')
  ),
  (
    3,
    2,
    NULL,
    1,
    'ALTA',
    NULL,
    8990,
    '2024-02-10 09:00:00',
    (SELECT id FROM usuarios_superadmin WHERE correo = 'martin.leon@dulcecontrol.pe')
  ),
  (
    4,
    3,
    NULL,
    3,
    'ALTA',
    NULL,
    259900,
    '2023-12-20 11:30:00',
    (SELECT id FROM usuarios_superadmin WHERE correo = 'administrador@dulcecontrol.pe')
  ),
  (
    5,
    3,
    3,
    3,
    'CANCELACION',
    259900,
    259900,
    '2024-05-20 12:00:00',
    (SELECT id FROM usuarios_superadmin WHERE correo = 'administrador@dulcecontrol.pe')
  )
AS new
ON DUPLICATE KEY UPDATE
  suscripcion_id = new.suscripcion_id,
  plan_anterior_id = new.plan_anterior_id,
  plan_nuevo_id = new.plan_nuevo_id,
  tipo_movimiento = new.tipo_movimiento,
  precio_anterior_centimos = new.precio_anterior_centimos,
  precio_nuevo_centimos = new.precio_nuevo_centimos,
  fecha_movimiento = new.fecha_movimiento,
  usuario_responsable_id = new.usuario_responsable_id;