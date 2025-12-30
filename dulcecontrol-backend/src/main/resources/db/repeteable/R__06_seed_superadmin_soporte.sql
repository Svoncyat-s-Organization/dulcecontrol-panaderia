-- ============================================================================
-- R__06: SEED MÓDULO DE SOPORTE SUPERADMIN
-- ============================================================================

-- =================================
-- TICKETS DE SOPORTE
-- =================================

INSERT INTO tickets_soporte (
  tienda_id,
  asignado_a_id,
  asunto,
  prioridad,
  estado,
  vencimiento_sla_en,
  primera_respuesta_en,
  resuelto_en
)
VALUES
  -- Ticket #1: Dulce Manjar - Problema con facturación electrónica (RESUELTO)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM usuarios_superadmin WHERE correo = 'admin@dulcecontrol.pe' LIMIT 1),
    'Error al enviar facturas a SUNAT',
    'alta',
    'resuelto',
    DATE_SUB(CURDATE(), INTERVAL 10 DAY) + INTERVAL 4 HOUR,
    DATE_SUB(CURDATE(), INTERVAL 10 DAY) + INTERVAL 30 MINUTE,
    DATE_SUB(CURDATE(), INTERVAL 9 DAY) + INTERVAL 15 HOUR
  ),
  -- Ticket #2: Panadería El Sol - Consulta sobre inventario (PENDIENTE CLIENTE)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234568'),
    (SELECT id FROM usuarios_superadmin WHERE correo = 'soporte@dulcecontrol.pe' LIMIT 1),
    'Duda sobre transferencias entre sedes',
    'media',
    'pendiente_cliente',
    DATE_SUB(CURDATE(), INTERVAL 2 DAY) + INTERVAL 8 HOUR,
    DATE_SUB(CURDATE(), INTERVAL 2 DAY) + INTERVAL 45 MINUTE,
    NULL
  ),
  -- Ticket #3: Tortas & Delicias - Problema técnico (ABIERTO)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234569'),
    NULL,
    'No puedo acceder al módulo de producción',
    'critica',
    'abierto',
    CURDATE() + INTERVAL 2 HOUR,
    NULL,
    NULL
  ),
  -- Ticket #4: Dulce Manjar - Mejora sugerida (CERRADO)
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    (SELECT id FROM usuarios_superadmin WHERE correo = 'soporte@dulcecontrol.pe' LIMIT 1),
    'Sugerencia: Reporte de ventas por categoría',
    'baja',
    'cerrado',
    DATE_SUB(CURDATE(), INTERVAL 5 DAY) + INTERVAL 48 HOUR,
    DATE_SUB(CURDATE(), INTERVAL 5 DAY) + INTERVAL 2 HOUR,
    DATE_SUB(CURDATE(), INTERVAL 3 DAY) + INTERVAL 16 HOUR
  )
ON DUPLICATE KEY UPDATE
  estado = VALUES(estado),
  asignado_a_id = VALUES(asignado_a_id),
  primera_respuesta_en = VALUES(primera_respuesta_en),
  resuelto_en = VALUES(resuelto_en);

-- =================================
-- MENSAJES DE TICKETS
-- =================================

INSERT INTO mensajes_ticket (
  ticket_id,
  tipo_remitente,
  autor_admin_id,
  mensaje,
  es_nota_interna
)
VALUES
  -- Conversación Ticket #1 (Facturación SUNAT)
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Error al enviar facturas a SUNAT'),
    'tienda',
    NULL,
    'Hola, tenemos un problema con la emisión de facturas electrónicas. Al intentar enviar el comprobante F001-00123 a SUNAT, recibimos el error "CPE no válido - Código hash incorrecto". ¿Podrían ayudarnos a resolverlo?',
    FALSE
  ),
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Error al enviar facturas a SUNAT'),
    'superadmin',
    (SELECT id FROM usuarios_superadmin WHERE correo = 'admin@dulcecontrol.pe' LIMIT 1),
    'Hola, gracias por contactarnos. Voy a revisar el comprobante inmediatamente. ¿Podrías compartirme los últimos 4 dígitos del RUC del cliente?',
    FALSE
  ),
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Error al enviar facturas a SUNAT'),
    'superadmin',
    (SELECT id FROM usuarios_superadmin WHERE correo = 'admin@dulcecontrol.pe' LIMIT 1),
    'NOTA INTERNA: Revisar configuración del certificado digital de la tienda. Posible problema con la firma del XML.',
    TRUE
  ),
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Error al enviar facturas a SUNAT'),
    'tienda',
    NULL,
    'Claro, el RUC del cliente es 20XXXXXX789. El cliente es "Distribuidora Lima SAC".',
    FALSE
  ),
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Error al enviar facturas a SUNAT'),
    'superadmin',
    (SELECT id FROM usuarios_superadmin WHERE correo = 'admin@dulcecontrol.pe' LIMIT 1),
    'Encontré el problema. El certificado digital necesita ser renovado. Ya lo actualicé en el sistema. Por favor intenta emitir nuevamente el comprobante y confirma si funciona correctamente.',
    FALSE
  ),
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Error al enviar facturas a SUNAT'),
    'tienda',
    NULL,
    '¡Perfecto! Ya funciona correctamente. Muchas gracias por la ayuda. Ticket resuelto.',
    FALSE
  ),

  -- Conversación Ticket #2 (Inventario)
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Duda sobre transferencias entre sedes'),
    'tienda',
    NULL,
    '¿Cómo puedo realizar una transferencia de insumos entre mis dos sedes? No encuentro la opción en el módulo de inventario.',
    FALSE
  ),
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Duda sobre transferencias entre sedes'),
    'superadmin',
    (SELECT id FROM usuarios_superadmin WHERE correo = 'soporte@dulcecontrol.pe' LIMIT 1),
    'Hola, para realizar transferencias entre sedes debes ir al módulo Inventario → Transferencias. Ahí encontrarás un botón "Nueva Transferencia" donde puedes seleccionar la sede origen, sede destino y los insumos a transferir. ¿Te aparece esa opción?',
    FALSE
  ),
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Duda sobre transferencias entre sedes'),
    'tienda',
    NULL,
    'Ah ya lo encontré, muchas gracias. Pero tengo otra duda: ¿cómo autorizo la transferencia en la sede destino?',
    FALSE
  ),

  -- Conversación Ticket #3 (Error técnico - sin respuesta aún)
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'No puedo acceder al módulo de producción'),
    'tienda',
    NULL,
    'Desde esta mañana no puedo ingresar al módulo de producción. Me aparece un error 500 cuando intento acceder. Es urgente porque necesito revisar las recetas para la producción de hoy.',
    FALSE
  ),

  -- Conversación Ticket #4 (Mejora)
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Sugerencia: Reporte de ventas por categoría'),
    'tienda',
    NULL,
    'Me gustaría que agreguen un reporte de ventas agrupado por categoría de productos. Esto nos ayudaría mucho para identificar qué tipo de productos son más rentables.',
    FALSE
  ),
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Sugerencia: Reporte de ventas por categoría'),
    'superadmin',
    (SELECT id FROM usuarios_superadmin WHERE correo = 'soporte@dulcecontrol.pe' LIMIT 1),
    '¡Excelente sugerencia! Voy a pasarla al equipo de desarrollo para que la evalúen. Mientras tanto, te comento que puedes exportar el reporte de ventas a Excel y usar tablas dinámicas para agrupar por categoría.',
    FALSE
  ),
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Sugerencia: Reporte de ventas por categoría'),
    'sistema',
    NULL,
    'El equipo de desarrollo ha agregado esta funcionalidad en la versión 1.5.0 que se desplegó hoy. Puedes acceder al nuevo reporte en Ventas → Reportes → Ventas por Categoría.',
    FALSE
  ),
  (
    (SELECT id FROM tickets_soporte WHERE asunto = 'Sugerencia: Reporte de ventas por categoría'),
    'tienda',
    NULL,
    '¡Increíble! Ya lo probé y funciona perfecto. Muchas gracias por implementarlo tan rápido.',
    FALSE
  )
ON DUPLICATE KEY UPDATE
  mensaje = VALUES(mensaje);

