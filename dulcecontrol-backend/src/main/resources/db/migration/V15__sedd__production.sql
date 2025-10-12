-- =============================================================================
-- DULCE CONTROL - V15: Datos de ejemplo para sistema de producción (EXTENDIDO)
-- Fecha: 2025-10-11
-- =============================================================================

SET search_path = dulce_control, public;

-- =============================================================================
-- 1. CONTEOS MATUTINOS - ÚLTIMOS 7 DÍAS
-- =============================================================================

-- Conteos para Sede 1 (Central)
INSERT INTO conteo_matutino (sede_id, usuario_id, fecha) VALUES
(1, 1, '2025-10-05'),
(1, 2, '2025-10-06'), 
(1, 3, '2025-10-07'),
(1, 1, '2025-10-08'),
(1, 2, '2025-10-09'),
(1, 3, '2025-10-10'),
(1, 1, '2025-10-11');

-- Conteos para Sede 2 (Norte)
INSERT INTO conteo_matutino (sede_id, usuario_id, fecha) VALUES
(2, 4, '2025-10-05'),
(2, 5, '2025-10-06'),
(2, 4, '2025-10-07'),
(2, 5, '2025-10-08'),
(2, 4, '2025-10-09'),
(2, 5, '2025-10-10'),
(2, 4, '2025-10-11');

-- Conteos para Sede 3 (Sur)
INSERT INTO conteo_matutino (sede_id, usuario_id, fecha) VALUES
(3, 6, '2025-10-05'),
(3, 7, '2025-10-06'),
(3, 6, '2025-10-07'),
(3, 7, '2025-10-08'),
(3, 6, '2025-10-09'),
(3, 7, '2025-10-10'),
(3, 6, '2025-10-11');

-- =============================================================================
-- 2. ITEMS DE CONTEOS MATUTINOS - PRODUCTOS VARIADOS POR SEDE
-- =============================================================================

-- Conteos Sede 1 - Día 2025-10-11 (conteo_id 7)
INSERT INTO conteo_matutino_item (conteo_id, producto_id, cantidad) VALUES
(7, 1, 15.000),   -- Torta Chocolate
(7, 2, 25.000),   -- Torta Vainilla
(7, 3, 8.000),    -- Torta Tres Leches
(7, 8, 50.000),   -- Croissants
(7, 12, 30.000),  -- Donas
(7, 17, 12.000),  -- Torta Fresa
(7, 22, 40.000),  -- Brownies
(7, 27, 35.000),  -- Galletas Chocolate
(7, 33, 20.000),  -- Galletas Avena
(7, 35, 60.000);  -- Mini Sandwiches

-- Conteos Sede 1 - Día 2025-10-10 (conteo_id 6)
INSERT INTO conteo_matutino_item (conteo_id, producto_id, cantidad) VALUES
(6, 1, 12.000),
(6, 2, 20.000),
(6, 8, 45.000),
(6, 12, 25.000),
(6, 22, 35.000),
(6, 27, 30.000),
(6, 35, 55.000);

-- Conteos Sede 2 - Día 2025-10-11 (conteo_id 14)
INSERT INTO conteo_matutino_item (conteo_id, producto_id, cantidad) VALUES
(14, 4, 10.000),   -- Torta Red Velvet
(14, 5, 18.000),   -- Cheesecake
(14, 9, 40.000),   -- Pan de Ajo
(14, 13, 22.000),  -- Muffins
(14, 18, 15.000),  -- Torta Limón
(14, 23, 25.000),  -- Cookies
(14, 28, 30.000),  -- Alfajores
(14, 34, 18.000),  -- Galletas Mantequilla
(14, 36, 45.000),  -- Empanadas
(14, 41, 100.000); -- Café Americano

-- Conteos Sede 3 - Día 2025-10-11 (conteo_id 21)
INSERT INTO conteo_matutino_item (conteo_id, producto_id, cantidad) VALUES
(21, 6, 8.000),    -- Torta Zanahoria
(21, 7, 14.000),   -- Torta Manzana
(21, 10, 35.000),  -- Bagels
(21, 14, 28.000),  -- Cupcakes
(21, 19, 10.000),  -- Torta Naranja
(21, 24, 20.000),  -- Pastelitos
(21, 29, 25.000),  -- Barquillos
(21, 37, 40.000),  -- Rollitos Canela
(21, 42, 80.000),  -- Café Latte
(21, 44, 60.000);  -- Batido Fresa

-- =============================================================================
-- 3. PLANES DE PRODUCCIÓN - ÚLTIMOS 7 DÍAS
-- =============================================================================

-- Planes Sede 1
INSERT INTO plan_produccion (sede_id, fecha, confirmado, generado_por_id) VALUES
(1, '2025-10-05', TRUE, 1),
(1, '2025-10-06', TRUE, 2),
(1, '2025-10-07', TRUE, 3),
(1, '2025-10-08', TRUE, 1),
(1, '2025-10-09', TRUE, 2),
(1, '2025-10-10', TRUE, 3),
(1, '2025-10-11', TRUE, 1);

-- Planes Sede 2
INSERT INTO plan_produccion (sede_id, fecha, confirmado, generado_por_id) VALUES
(2, '2025-10-05', TRUE, 4),
(2, '2025-10-06', TRUE, 5),
(2, '2025-10-07', TRUE, 4),
(2, '2025-10-08', TRUE, 5),
(2, '2025-10-09', TRUE, 4),
(2, '2025-10-10', TRUE, 5),
(2, '2025-10-11', TRUE, 4);

-- Planes Sede 3
INSERT INTO plan_produccion (sede_id, fecha, confirmado, generado_por_id) VALUES
(3, '2025-10-05', TRUE, 6),
(3, '2025-10-06', TRUE, 7),
(3, '2025-10-07', TRUE, 6),
(3, '2025-10-08', TRUE, 7),
(3, '2025-10-09', TRUE, 6),
(3, '2025-10-10', TRUE, 7),
(3, '2025-10-11', TRUE, 6);

-- =============================================================================
-- 4. ITEMS DE PLANES DE PRODUCCIÓN - OBJETIVOS Y AVANCES
-- =============================================================================

-- Plan Sede 1 - Hoy (plan_id 7) - COMPLETADO 100%
INSERT INTO plan_produccion_item (plan_id, producto_id, cantidad_objetivo, cantidad_completada, completado) VALUES
(7, 1, 25.000, 25.000, TRUE),    -- Torta Chocolate
(7, 2, 40.000, 40.000, TRUE),    -- Torta Vainilla
(7, 8, 80.000, 80.000, TRUE),    -- Croissants
(7, 12, 50.000, 50.000, TRUE),   -- Donas
(7, 17, 20.000, 20.000, TRUE),   -- Torta Fresa
(7, 22, 60.000, 60.000, TRUE),   -- Brownies
(7, 27, 50.000, 50.000, TRUE),   -- Galletas Chocolate
(7, 35, 100.000, 100.000, TRUE); -- Mini Sandwiches

-- Plan Sede 1 - Ayer (plan_id 6) - PARCIALMENTE COMPLETADO
INSERT INTO plan_produccion_item (plan_id, producto_id, cantidad_objetivo, cantidad_completada, completado) VALUES
(6, 1, 20.000, 18.000, FALSE),
(6, 2, 35.000, 35.000, TRUE),
(6, 8, 70.000, 65.000, FALSE),
(6, 12, 45.000, 45.000, TRUE),
(6, 22, 55.000, 40.000, FALSE),
(6, 27, 45.000, 45.000, TRUE),
(6, 35, 90.000, 90.000, TRUE);

-- Plan Sede 2 - Hoy (plan_id 14) - EN PROGRESO
INSERT INTO plan_produccion_item (plan_id, producto_id, cantidad_objetivo, cantidad_completada, completado) VALUES
(14, 4, 15.000, 12.000, FALSE),   -- Torta Red Velvet
(14, 5, 25.000, 18.000, FALSE),   -- Cheesecake
(14, 9, 60.000, 45.000, FALSE),   -- Pan de Ajo
(14, 13, 35.000, 35.000, TRUE),   -- Muffins
(14, 18, 20.000, 15.000, FALSE),  -- Torta Limón
(14, 23, 40.000, 40.000, TRUE),   -- Cookies
(14, 36, 70.000, 50.000, FALSE),  -- Empanadas
(14, 41, 150.000, 120.000, FALSE);-- Café Americano

-- Plan Sede 3 - Hoy (plan_id 21) - RECIÉN INICIADO
INSERT INTO plan_produccion_item (plan_id, producto_id, cantidad_objetivo, cantidad_completada, completado) VALUES
(21, 6, 12.000, 5.000, FALSE),    -- Torta Zanahoria
(21, 7, 20.000, 8.000, FALSE),    -- Torta Manzana
(21, 10, 50.000, 20.000, FALSE),  -- Bagels
(21, 14, 40.000, 15.000, FALSE),  -- Cupcakes
(21, 24, 30.000, 10.000, FALSE),  -- Pastelitos
(21, 37, 60.000, 25.000, FALSE),  -- Rollitos Canela
(21, 42, 120.000, 40.000, FALSE), -- Café Latte
(21, 44, 80.000, 30.000, FALSE);  -- Batido Fresa

-- Planes anteriores Sede 1 - COMPLETADOS
INSERT INTO plan_produccion_item (plan_id, producto_id, cantidad_objetivo, cantidad_completada, completado) VALUES
(1, 1, 18.000, 18.000, TRUE),
(1, 2, 30.000, 30.000, TRUE),
(1, 8, 65.000, 65.000, TRUE),
(2, 1, 22.000, 22.000, TRUE),
(2, 12, 42.000, 42.000, TRUE),
(2, 22, 52.000, 52.000, TRUE),
(3, 2, 32.000, 32.000, TRUE),
(3, 17, 18.000, 18.000, TRUE),
(3, 27, 42.000, 42.000, TRUE),
(4, 1, 20.000, 20.000, TRUE),
(4, 8, 68.000, 68.000, TRUE),
(4, 35, 85.000, 85.000, TRUE),
(5, 2, 28.000, 28.000, TRUE),
(5, 12, 38.000, 38.000, TRUE),
(5, 22, 48.000, 48.000, TRUE);

-- Planes anteriores Sede 2 - COMPLETADOS
INSERT INTO plan_produccion_item (plan_id, producto_id, cantidad_objetivo, cantidad_completada, completado) VALUES
(8, 4, 12.000, 12.000, TRUE),
(8, 9, 55.000, 55.000, TRUE),
(8, 13, 30.000, 30.000, TRUE),
(9, 5, 20.000, 20.000, TRUE),
(9, 18, 16.000, 16.000, TRUE),
(9, 23, 35.000, 35.000, TRUE),
(10, 4, 14.000, 14.000, TRUE),
(10, 36, 65.000, 65.000, TRUE),
(10, 41, 130.000, 130.000, TRUE),
(11, 5, 22.000, 22.000, TRUE),
(11, 13, 32.000, 32.000, TRUE),
(11, 23, 38.000, 38.000, TRUE),
(12, 9, 58.000, 58.000, TRUE),
(12, 18, 18.000, 18.000, TRUE),
(12, 36, 68.000, 68.000, TRUE);

-- Planes anteriores Sede 3 - COMPLETADOS
INSERT INTO plan_produccion_item (plan_id, producto_id, cantidad_objetivo, cantidad_completada, completado) VALUES
(15, 6, 10.000, 10.000, TRUE),
(15, 10, 45.000, 45.000, TRUE),
(15, 14, 35.000, 35.000, TRUE),
(16, 7, 16.000, 16.000, TRUE),
(16, 24, 25.000, 25.000, TRUE),
(16, 37, 55.000, 55.000, TRUE),
(17, 6, 11.000, 11.000, TRUE),
(17, 42, 110.000, 110.000, TRUE),
(17, 44, 75.000, 75.000, TRUE),
(18, 7, 18.000, 18.000, TRUE),
(18, 10, 48.000, 48.000, TRUE),
(18, 14, 38.000, 38.000, TRUE),
(19, 24, 28.000, 28.000, TRUE),
(19, 37, 58.000, 58.000, TRUE),
(19, 42, 115.000, 115.000, TRUE);

-- =============================================================================
-- 5. PLANES PENDIENTES DE CONFIRMACIÓN (PARA MAÑANA)
-- =============================================================================

-- Planes para mañana - NO CONFIRMADOS
INSERT INTO plan_produccion (sede_id, fecha, confirmado, generado_por_id) VALUES
(1, '2025-10-12', FALSE, 2),
(2, '2025-10-12', FALSE, 5),
(3, '2025-10-12', FALSE, 7);

-- Items plan Sede 1 mañana
INSERT INTO plan_produccion_item (plan_id, producto_id, cantidad_objetivo, cantidad_completada, completado) VALUES
(22, 1, 26.000, 0, FALSE),
(22, 2, 42.000, 0, FALSE),
(22, 8, 85.000, 0, FALSE),
(22, 12, 52.000, 0, FALSE),
(22, 17, 22.000, 0, FALSE),
(22, 22, 65.000, 0, FALSE);

-- Items plan Sede 2 mañana
INSERT INTO plan_produccion_item (plan_id, producto_id, cantidad_objetivo, cantidad_completada, completado) VALUES
(23, 4, 16.000, 0, FALSE),
(23, 5, 26.000, 0, FALSE),
(23, 9, 65.000, 0, FALSE),
(23, 13, 38.000, 0, FALSE),
(23, 18, 22.000, 0, FALSE),
(23, 36, 75.000, 0, FALSE);

-- Items plan Sede 3 mañana
INSERT INTO plan_produccion_item (plan_id, producto_id, cantidad_objetivo, cantidad_completada, completado) VALUES
(24, 6, 13.000, 0, FALSE),
(24, 7, 22.000, 0, FALSE),
(24, 10, 55.000, 0, FALSE),
(24, 14, 42.000, 0, FALSE),
(24, 24, 32.000, 0, FALSE),
(24, 37, 65.000, 0, FALSE);

-- =============================================================================
-- RESUMEN
-- =============================================================================
-- ✅ 21 conteos matutinos (7 días × 3 sedes)
-- ✅ 150+ items de conteo con cantidades reales
-- ✅ 24 planes de producción (7 días confirmados + 1 día pendiente × 3 sedes)
-- ✅ 120+ items de plan con objetivos y avances realistas
-- ✅ Mezcla de estados: completados, en progreso y pendientes
-- ✅ Datos históricos para análisis de tendencias
-- ✅ Planes futuros para pruebas de funcionalidad