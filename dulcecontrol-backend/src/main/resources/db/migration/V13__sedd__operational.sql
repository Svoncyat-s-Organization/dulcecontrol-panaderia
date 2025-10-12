-- =============================================================================
-- DULCE CONTROL - V13: Datos Operacionales (CORREGIDO)
-- Fecha: 2025-10-12
-- =============================================================================

SET search_path = dulce_control, public;

-- =============================================================================
-- 1. CERRAR CAJAS EXISTENTES ANTES DE INSERTAR NUEVAS
-- =============================================================================

-- Cerrar todas las cajas abiertas existentes
UPDATE caja_sesion 
SET usuario_cierre_id = 1,
    cierre_at = NOW(),
    monto_cierre = (
        SELECT COALESCE(SUM(total), 0) + monto_apertura
        FROM venta 
        WHERE venta.caja_sesion_id = caja_sesion.id
    ),
    observaciones = 'Cerrado automáticamente para migración V13'
WHERE cierre_at IS NULL;

-- =============================================================================
-- 2. USAR TABLAS TEMPORALES PARA ALMACENAR IDs DE CAJAS
-- =============================================================================

-- Crear tabla temporal para almacenar IDs de cajas
CREATE TEMPORARY TABLE temp_cajas AS
SELECT id, sede_id FROM caja_sesion WHERE false;

-- Insertar nuevas cajas y guardar sus IDs
INSERT INTO caja_sesion (sede_id, usuario_apertura_id, monto_apertura, creado_en) 
VALUES 
    (1, 1, 500.00, '2025-10-12 08:00:00'::timestamptz),
    (2, 4, 300.00, '2025-10-12 08:00:00'::timestamptz),  
    (3, 6, 400.00, '2025-10-12 08:00:00'::timestamptz);

-- Almacenar los IDs en la tabla temporal
INSERT INTO temp_cajas (id, sede_id)
SELECT id, sede_id FROM caja_sesion 
WHERE creado_en >= '2025-10-12'::timestamptz;

-- =============================================================================
-- 3. VENTAS DEL DÍA - SEDE 1
-- =============================================================================

INSERT INTO venta (sede_id, caja_sesion_id, usuario_id, cliente_id, fecha, estado, moneda, comprobante_tipo, comprobante_serie, comprobante_numero, sunat_estado, subtotal, impuesto_porcentaje, impuesto, total)
SELECT 
    1, 
    (SELECT id FROM temp_cajas WHERE sede_id = 1),
    usuario_id, cliente_id, fecha::timestamptz, estado, moneda, comprobante_tipo, comprobante_serie, comprobante_numero, sunat_estado, subtotal, impuesto_porcentaje, impuesto, total
FROM (VALUES
    (2, 1, '2025-10-12 09:00:00', 'emitida', 'PEN', 'boleta', 'B001', '000015', 'aceptado', 65.80, 18, 11.84, 77.64),
    (3, 5, '2025-10-12 10:30:00', 'emitida', 'PEN', 'boleta', 'B001', '000016', 'aceptado', 120.50, 18, 21.69, 142.19),
    (2, 8, '2025-10-12 12:15:00', 'emitida', 'PEN', 'factura', 'F001', '000008', 'aceptado', 280.00, 18, 50.40, 330.40),
    (3, 12, '2025-10-12 15:45:00', 'emitida', 'PEN', 'boleta', 'B001', '000017', 'aceptado', 45.20, 18, 8.14, 53.34),
    (2, 3, '2025-10-12 17:30:00', 'emitida', 'PEN', 'boleta', 'B001', '000018', 'aceptado', 95.00, 18, 17.10, 112.10)
) AS v(usuario_id, cliente_id, fecha, estado, moneda, comprobante_tipo, comprobante_serie, comprobante_numero, sunat_estado, subtotal, impuesto_porcentaje, impuesto, total);

-- =============================================================================
-- 4. VENTAS DEL DÍA - SEDE 2
-- =============================================================================

INSERT INTO venta (sede_id, caja_sesion_id, usuario_id, cliente_id, fecha, estado, moneda, comprobante_tipo, comprobante_serie, comprobante_numero, sunat_estado, subtotal, impuesto_porcentaje, impuesto, total)
SELECT 
    2, 
    (SELECT id FROM temp_cajas WHERE sede_id = 2),
    usuario_id, cliente_id, fecha::timestamptz, estado, moneda, comprobante_tipo, comprobante_serie, comprobante_numero, sunat_estado, subtotal, impuesto_porcentaje, impuesto, total
FROM (VALUES
    (4, 7, '2025-10-12 08:30:00', 'emitida', 'PEN', 'boleta', 'B002', '000011', 'aceptado', 38.50, 18, 6.93, 45.43),
    (5, 10, '2025-10-12 11:00:00', 'emitida', 'PEN', 'boleta', 'B002', '000012', 'aceptado', 82.30, 18, 14.81, 97.11),
    (4, 14, '2025-10-12 13:20:00', 'emitida', 'PEN', 'factura', 'F002', '000006', 'aceptado', 195.00, 18, 35.10, 230.10),
    (5, 9, '2025-10-12 16:00:00', 'emitida', 'PEN', 'boleta', 'B002', '000013', 'aceptado', 56.80, 18, 10.22, 67.02)
) AS v(usuario_id, cliente_id, fecha, estado, moneda, comprobante_tipo, comprobante_serie, comprobante_numero, sunat_estado, subtotal, impuesto_porcentaje, impuesto, total);

-- =============================================================================
-- 5. VENTAS DEL DÍA - SEDE 3
-- =============================================================================

INSERT INTO venta (sede_id, caja_sesion_id, usuario_id, cliente_id, fecha, estado, moneda, comprobante_tipo, comprobante_serie, comprobante_numero, sunat_estado, subtotal, impuesto_porcentaje, impuesto, total)
SELECT 
    3, 
    (SELECT id FROM temp_cajas WHERE sede_id = 3),
    usuario_id, cliente_id, fecha::timestamptz, estado, moneda, comprobante_tipo, comprobante_serie, comprobante_numero, sunat_estado, subtotal, impuesto_porcentaje, impuesto, total
FROM (VALUES
    (6, 13, '2025-10-12 09:15:00', 'emitida', 'PEN', 'boleta', 'B003', '000011', 'aceptado', 72.40, 18, 13.03, 85.43),
    (7, 16, '2025-10-12 11:45:00', 'emitida', 'PEN', 'boleta', 'B003', '000012', 'aceptado', 110.00, 18, 19.80, 129.80),
    (6, 18, '2025-10-12 14:30:00', 'emitida', 'PEN', 'factura', 'F003', '000006', 'aceptado', 320.00, 18, 57.60, 377.60),
    (7, 15, '2025-10-12 17:15:00', 'emitida', 'PEN', 'boleta', 'B003', '000013', 'aceptado', 48.60, 18, 8.75, 57.35)
) AS v(usuario_id, cliente_id, fecha, estado, moneda, comprobante_tipo, comprobante_serie, comprobante_numero, sunat_estado, subtotal, impuesto_porcentaje, impuesto, total);

-- =============================================================================
-- 6. OBTENER IDs DE VENTAS PARA LOS DETALLES
-- =============================================================================

-- Crear una tabla temporal para facilitar las inserciones
CREATE TEMPORARY TABLE temp_ventas AS
SELECT v.id, v.sede_id, ROW_NUMBER() OVER (PARTITION BY v.sede_id ORDER BY v.id) as venta_num
FROM venta v 
WHERE v.caja_sesion_id IN (SELECT id FROM temp_cajas);

-- =============================================================================
-- 7. DETALLES DE VENTAS - SEDE 1 (CORREGIDO)
-- =============================================================================

-- Venta 1 - Sede 1
INSERT INTO venta_item (venta_id, producto_id, cantidad, precio_unitario, descuento)
SELECT 
    (SELECT id FROM temp_ventas WHERE sede_id = 1 AND venta_num = 1),
    producto_id, cantidad, precio_unitario, descuento
FROM (VALUES
    (1, 2.00, 4.00, 0),   -- 2 unidades de producto 1 a S/4.00 c/u
    (8, 8.00, 1.00, 0),   -- 8 unidades de producto 8 a S/1.00 c/u
    (2, 4.00, 2.00, 0),   -- 4 unidades de producto 2 a S/2.00 c/u
    (4, 1.50, 4.00, 0),   -- 1.5 unidades de producto 4 a S/4.00 c/u
    (3, 3.00, 3.00, 0)    -- 3 unidades de producto 3 a S/3.00 c/u
) AS d(producto_id, cantidad, precio_unitario, descuento);

-- Venta 2 - Sede 1
INSERT INTO venta_item (venta_id, producto_id, cantidad, precio_unitario, descuento)
SELECT 
    (SELECT id FROM temp_ventas WHERE sede_id = 1 AND venta_num = 2),
    producto_id, cantidad, precio_unitario, descuento
FROM (VALUES
    (17, 1.00, 28.00, 0), -- 1 unidad de producto 17 a S/28.00 c/u
    (22, 3.00, 5.00, 0),  -- 3 unidades de producto 22 a S/5.00 c/u
    (35, 4.00, 4.00, 0),  -- 4 unidades de producto 35 a S/4.00 c/u
    (41, 3.00, 4.00, 0)   -- 3 unidades de producto 41 a S/4.00 c/u
) AS d(producto_id, cantidad, precio_unitario, descuento);

-- Venta 3 - Sede 1
INSERT INTO venta_item (venta_id, producto_id, cantidad, precio_unitario, descuento)
SELECT 
    (SELECT id FROM temp_ventas WHERE sede_id = 1 AND venta_num = 3),
    producto_id, cantidad, precio_unitario, descuento
FROM (VALUES
    (5, 2.00, 25.00, 0),  -- 2 unidades de producto 5 a S/25.00 c/u
    (12, 3.00, 15.00, 0), -- 3 unidades de producto 12 a S/15.00 c/u
    (18, 1.00, 35.00, 0)  -- 1 unidad de producto 18 a S/35.00 c/u
) AS d(producto_id, cantidad, precio_unitario, descuento);

-- =============================================================================
-- 8. PAGOS DE VENTAS (CORREGIDO)
-- =============================================================================

-- Pagos para Sede 1
INSERT INTO pago_venta (venta_id, metodo_pago, monto, referencia)
SELECT 
    (SELECT id FROM temp_ventas WHERE sede_id = 1 AND venta_num = 1),
    metodo_pago, monto, referencia
FROM (VALUES
    ('efectivo', 77.64, NULL)
) AS p(metodo_pago, monto, referencia);

INSERT INTO pago_venta (venta_id, metodo_pago, monto, referencia)
SELECT 
    (SELECT id FROM temp_ventas WHERE sede_id = 1 AND venta_num = 2),
    metodo_pago, monto, referencia
FROM (VALUES
    ('tarjeta', 142.19, 'VISA-123456')
) AS p(metodo_pago, monto, referencia);

INSERT INTO pago_venta (venta_id, metodo_pago, monto, referencia)
SELECT 
    (SELECT id FROM temp_ventas WHERE sede_id = 1 AND venta_num = 3),
    metodo_pago, monto, referencia
FROM (VALUES
    ('efectivo', 200.00, NULL),
    ('yape', 130.40, 'YAPE-789012')
) AS p(metodo_pago, monto, referencia);

-- Pagos para Sede 2
INSERT INTO pago_venta (venta_id, metodo_pago, monto, referencia)
SELECT 
    (SELECT id FROM temp_ventas WHERE sede_id = 2 AND venta_num = 1),
    metodo_pago, monto, referencia
FROM (VALUES
    ('efectivo', 45.43, NULL)
) AS p(metodo_pago, monto, referencia);

-- =============================================================================
-- 9. VENTAS ANULADAS (CORREGIDO)
-- =============================================================================

INSERT INTO venta (sede_id, caja_sesion_id, usuario_id, cliente_id, fecha, estado, moneda, comprobante_tipo, comprobante_serie, comprobante_numero, sunat_estado, subtotal, impuesto_porcentaje, impuesto, total, anulado_at, anulado_por_id)
SELECT 
    1, 
    (SELECT id FROM temp_cajas WHERE sede_id = 1),
    2, 3, '2025-10-12 11:00:00'::timestamptz, 'anulada', 'PEN', 'boleta', 'B001', '000019', 'rechazado', 35.00, 18, 6.30, 41.30, '2025-10-12 11:05:00'::timestamptz, 2;

INSERT INTO venta (sede_id, caja_sesion_id, usuario_id, cliente_id, fecha, estado, moneda, comprobante_tipo, comprobante_serie, comprobante_numero, sunat_estado, subtotal, impuesto_porcentaje, impuesto, total, anulado_at, anulado_por_id)
SELECT 
    2, 
    (SELECT id FROM temp_cajas WHERE sede_id = 2),
    4, 8, '2025-10-12 10:30:00'::timestamptz, 'anulada', 'PEN', 'boleta', 'B002', '000014', 'rechazado', 28.50, 18, 5.13, 33.63, '2025-10-12 10:35:00'::timestamptz, 4;

-- =============================================================================
-- 10. CIERRES DE CAJA (CORREGIDO)
-- =============================================================================

UPDATE caja_sesion 
SET usuario_cierre_id = CASE sede_id 
                          WHEN 1 THEN 1 
                          WHEN 2 THEN 4 
                          WHEN 3 THEN 6 
                        END,
    cierre_at = '2025-10-12 20:00:00'::timestamptz,
    monto_cierre = monto_apertura + (
        SELECT COALESCE(SUM(total), 0)
        FROM venta 
        WHERE venta.caja_sesion_id = caja_sesion.id 
        AND venta.estado != 'anulada'
    ),
    observaciones = CASE sede_id 
                      WHEN 1 THEN 'Cierre normal - Buen día de ventas'
                      WHEN 2 THEN 'Cierre con ventas estables' 
                      WHEN 3 THEN 'Excelente día de ventas'
                    END
WHERE id IN (SELECT id FROM temp_cajas);

-- =============================================================================
-- 11. LIMPIAR TABLAS TEMPORALES
-- =============================================================================

DROP TABLE IF EXISTS temp_ventas;
DROP TABLE IF EXISTS temp_cajas;

-- =============================================================================
-- RESUMEN
-- =============================================================================