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
ON DUPLICATE KEY UPDATE
  codigo = VALUES(codigo),
  nombre = VALUES(nombre),
  descripcion = VALUES(descripcion),
  precio_mensual_centimos = VALUES(precio_mensual_centimos),
  precio_anual_centimos = VALUES(precio_anual_centimos),
  moneda = VALUES(moneda),
  limites = VALUES(limites),
  activo = VALUES(activo),
  creado_en = VALUES(creado_en),
  actualizado_en = VALUES(actualizado_en);

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
ON DUPLICATE KEY UPDATE
  tienda_id = VALUES(tienda_id),
  plan_id = VALUES(plan_id),
  ciclo = VALUES(ciclo),
  precio_pactado_centimos = VALUES(precio_pactado_centimos),
  fecha_inicio = VALUES(fecha_inicio),
  fecha_fin = VALUES(fecha_fin),
  estado = VALUES(estado),
  autorenovar = VALUES(autorenovar),
  cancelado_en = VALUES(cancelado_en),
  creado_en = VALUES(creado_en),
  actualizado_en = VALUES(actualizado_en);

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
ON DUPLICATE KEY UPDATE
  suscripcion_id = VALUES(suscripcion_id),
  plan_anterior_id = VALUES(plan_anterior_id),
  plan_nuevo_id = VALUES(plan_nuevo_id),
  tipo_movimiento = VALUES(tipo_movimiento),
  precio_anterior_centimos = VALUES(precio_anterior_centimos),
  precio_nuevo_centimos = VALUES(precio_nuevo_centimos),
  fecha_movimiento = VALUES(fecha_movimiento),
  usuario_responsable_id = VALUES(usuario_responsable_id);
