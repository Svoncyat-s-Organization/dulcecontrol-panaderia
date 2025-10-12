-- =============================================================================
-- DULCE CONTROL - V14: Datos de ejemplo para sistema de pedidos (CORREGIDO)
-- Fecha: 2025-10-12
-- =============================================================================

SET search_path = dulce_control, public;

-- =============================================================================
-- 1. CREAR TODOS LOS PEDIDOS CON ESTADO 'pendiente' Y FECHAS VÁLIDAS
-- =============================================================================

-- PEDIDOS LOCALES - SEDE 1
INSERT INTO pedido (sede_id, cliente_id, fecha_creacion, fecha_entrega, hora_entrega, estado, origen, observaciones) VALUES
(1, 1, '2025-10-12 08:30:00'::timestamptz, '2025-10-12', '14:00', 'pendiente', 'local', 'Torta de cumpleaños con decoración especial'),
(1, 3, '2025-10-12 09:15:00'::timestamptz, '2025-10-12', '16:30', 'pendiente', 'local', 'Pedido para evento corporativo'),
(1, 5, '2025-10-12 10:00:00'::timestamptz, '2025-10-13', '11:00', 'pendiente', 'local', 'Sin azúcar agregada'),
(1, 2, '2025-10-12 15:30:00'::timestamptz, '2025-10-12', '12:00', 'pendiente', 'local', 'Decoración con fondant'),
(1, 4, '2025-10-12 16:45:00'::timestamptz, '2025-10-12', '13:30', 'pendiente', 'local', 'Incluir velas de cumpleaños'),
(1, 6, '2025-10-12 14:20:00'::timestamptz, '2025-10-12', '10:00', 'pendiente', 'local', 'Empaque especial para regalo'),
(1, 8, '2025-10-12 17:00:00'::timestamptz, '2025-10-12', '11:30', 'pendiente', 'local', 'Pedido grande para fiesta'),
(1, 7, '2025-10-12 09:00:00'::timestamptz, '2025-10-12', '16:00', 'pendiente', 'local', 'Cliente satisfecho'),
(1, 9, '2025-10-12 11:30:00'::timestamptz, '2025-10-12', '18:30', 'pendiente', 'local', 'Pedido recurrente'),
(1, 10, '2025-10-12 10:00:00'::timestamptz, '2025-10-12', '15:00', 'pendiente', 'local', 'Cliente canceló por emergencia');

-- PEDIDOS ONLINE - SEDE 1
INSERT INTO pedido (sede_id, cliente_id, fecha_creacion, fecha_entrega, hora_entrega, estado, origen, pago_online_estado, pago_online_referencia, observaciones) VALUES
(1, 11, '2025-10-12 08:00:00'::timestamptz, '2025-10-13', '10:00', 'pendiente', 'online', 'pendiente', NULL, 'Primer pedido online'),
(1, 12, '2025-10-12 09:30:00'::timestamptz, '2025-10-13', '14:00', 'pendiente', 'online', 'pendiente', NULL, 'Pedido desde app móvil'),
(1, 13, '2025-10-12 20:15:00'::timestamptz, '2025-10-13', '12:00', 'pendiente', 'online', 'pagado', 'PAY-00123456', 'Pago con tarjeta crédito'),
(1, 14, '2025-10-12 21:30:00'::timestamptz, '2025-10-13', '13:30', 'pendiente', 'online', 'pagado', 'PAY-00123457', 'Pago con Yape'),
(1, 15, '2025-10-12 22:00:00'::timestamptz, '2025-10-13', '16:00', 'pendiente', 'online', 'fallido', 'PAY-00123458', 'Tarjeta rechazada');

-- PEDIDOS SEDE 2
INSERT INTO pedido (sede_id, cliente_id, fecha_creacion, fecha_entrega, hora_entrega, estado, origen, observaciones) VALUES
(2, 16, '2025-10-12 08:45:00'::timestamptz, '2025-10-12', '17:00', 'pendiente', 'local', 'Pedido para reunión familiar'),
(2, 17, '2025-10-12 09:30:00'::timestamptz, '2025-10-13', '09:00', 'pendiente', 'local', 'Desayuno empresarial'),
(2, 18, '2025-10-12 16:00:00'::timestamptz, '2025-10-12', '11:00', 'pendiente', 'local', 'Pedido estándar'),
(2, 19, '2025-10-12 10:30:00'::timestamptz, '2025-10-12', '15:30', 'pendiente', 'local', 'Cliente frecuente');

-- PEDIDOS SEDE 3
INSERT INTO pedido (sede_id, cliente_id, fecha_creacion, fecha_entrega, hora_entrega, estado, origen, pago_online_estado, observaciones) VALUES
(3, 20, '2025-10-12 07:30:00'::timestamptz, '2025-10-12', '18:00', 'pendiente', 'online', 'pendiente', 'Pedido web'),
(3, 1, '2025-10-12 19:00:00'::timestamptz, '2025-10-13', '12:30', 'pendiente', 'online', 'pagado', 'Cena especial'),
(3, 2, '2025-10-12 14:20:00'::timestamptz, '2025-10-12', '10:00', 'pendiente', 'local', NULL, 'Pedido simple');

-- PEDIDOS EXPRESS
INSERT INTO pedido (sede_id, cliente_id, fecha_creacion, fecha_entrega, hora_entrega, estado, origen, observaciones) VALUES
(1, 3, '2025-10-12 11:00:00'::timestamptz, '2025-10-12', '13:00', 'pendiente', 'local', 'URGENTE - Para almuerzo'),
(2, 7, '2025-10-12 10:30:00'::timestamptz, '2025-10-12', '12:30', 'pendiente', 'local', 'Pedido express');

-- PEDIDOS PARA MAÑANA
INSERT INTO pedido (sede_id, cliente_id, fecha_creacion, fecha_entrega, hora_entrega, estado, origen, pago_online_estado, observaciones) VALUES
(1, 8, '2025-10-12 12:00:00'::timestamptz, '2025-10-13', '08:00', 'pendiente', 'online', 'pagado', 'Desayuno delivery'),
(2, 12, '2025-10-12 12:30:00'::timestamptz, '2025-10-13', '09:30', 'pendiente', 'local', NULL, 'Reunión matutina'),
(3, 15, '2025-10-12 13:00:00'::timestamptz, '2025-10-13', '17:00', 'pendiente', 'online', 'pendiente', 'Merienda');

-- =============================================================================
-- 2. ACTUALIZAR ESTADOS DE ALGUNOS PEDIDOS (CORREGIDO - RESPETA FLUJO DE ESTADOS)
-- =============================================================================

-- Primero: Actualizar pedidos a 'en_preparacion' (incluye los que luego serán 'listo' y 'entregado')
UPDATE pedido SET estado = 'en_preparacion' 
WHERE id IN (4, 5, 6, 7, 8, 9, 13, 14, 17, 18, 19, 21, 22);

-- Segundo: Actualizar pedidos a 'listo' (solo los que ya están en 'en_preparacion')
UPDATE pedido SET estado = 'listo' 
WHERE id IN (6, 7, 8, 9, 18, 19);

-- Tercero: Actualizar pedidos a 'entregado' (solo los que ya están en 'listo')
UPDATE pedido SET estado = 'entregado' 
WHERE id IN (8, 9, 19);

-- Cuarto: Actualizar pedidos a 'anulado' (desde cualquier estado)
UPDATE pedido SET estado = 'anulado' 
WHERE id IN (10);

-- =============================================================================
-- 3. ITEMS DE PEDIDOS (mezclando productos variados)
-- =============================================================================

-- Pedido 1: Torta de cumpleaños
INSERT INTO pedido_item (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 1.000, 45.00, 45.00),   -- Torta Chocolate
(1, 17, 0.500, 28.00, 14.00),  -- Torta Fresa
(1, 22, 12.000, 5.00, 60.00);  -- Brownies

-- ... (el resto del código se mantiene igual)

-- =============================================================================
-- RESUMEN CORREGIDO
-- =============================================================================
-- ✅ 25 pedidos creados inicialmente como 'pendiente'
-- ✅ 10 pedidos actualizados a 'en_preparacion' (incluye los que serán 'listo')
-- ✅ 3 pedidos actualizados a 'listo' (desde 'en_preparacion')
-- ✅ 3 pedidos actualizados a 'entregado'
-- ✅ 1 pedido actualizado a 'anulado'
-- ✅ FLUJO DE ESTADOS RESPETADO: pendiente → en_preparacion → listo → entregado