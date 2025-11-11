-- ============================================
-- FUNCIONES, TRIGGERS Y PROCEDURES
-- ============================================

SET search_path TO dulce_control, public;

-- ============================================
-- FUNCIONES AUXILIARES REUTILIZABLES
-- ============================================

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION actualizar_timestamp IS 
'Actualiza automáticamente el campo actualizado_en antes de un UPDATE';

-- Función para generar código de pedido único
CREATE OR REPLACE FUNCTION generar_codigo_pedido()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.codigo_pedido IS NULL THEN
        NEW.codigo_pedido := 'PED-' || 
                            TO_CHAR(NEW.creado_en, 'YYYYMMDD') || '-' ||
                            LPAD(NEW.id::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generar_codigo_pedido IS 
'Genera automáticamente un código de pedido único en formato PED-YYYYMMDD-000001';

-- Función para validar stock disponible
CREATE OR REPLACE FUNCTION validar_stock_producto(
    p_sede_id BIGINT,
    p_producto_id BIGINT,
    p_cantidad INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_stock_actual INTEGER;
BEGIN
    SELECT cantidad_actual INTO v_stock_actual
    FROM inventario_productos
    WHERE sede_id = p_sede_id AND producto_id = p_producto_id;
    
    RETURN COALESCE(v_stock_actual, 0) >= p_cantidad;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION validar_stock_producto IS 
'Valida si hay stock suficiente de un producto en una sede específica';

-- ==============================
-- TRIGGERS PARA SUPERADMINISTRADOR
-- ==============================

-- Actualizar timestamp en tiendas
CREATE TRIGGER trg_tiendas_actualizado 
    BEFORE UPDATE ON tiendas 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_timestamp();

-- Actualizar timestamp en sedes
CREATE TRIGGER trg_sedes_actualizado 
    BEFORE UPDATE ON sedes 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_timestamp();

-- Actualizar timestamp en dominios
CREATE TRIGGER trg_dominios_actualizado 
    BEFORE UPDATE ON dominios_tienda 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_timestamp();

-- Registrar cambios en suscripciones automáticamente
CREATE OR REPLACE FUNCTION registrar_cambio_suscripcion()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo registrar si cambia el plan o el precio
    IF OLD.plan_id != NEW.plan_id OR OLD.precio_pactado_centimos != NEW.precio_pactado_centimos THEN
        INSERT INTO historial_suscripciones (
            suscripcion_id,
            plan_anterior_id,
            plan_nuevo_id,
            tipo_movimiento,
            precio_anterior_centimos,
            precio_nuevo_centimos,
            fecha_movimiento
        ) VALUES (
            NEW.id,
            OLD.plan_id,
            NEW.plan_id,
            CASE 
                WHEN NEW.estado = 'cancelada' THEN 'cancelacion'::tipos_movimiento_suscripcion
                WHEN OLD.plan_id != NEW.plan_id THEN 
                    CASE 
                        WHEN NEW.precio_pactado_centimos > OLD.precio_pactado_centimos 
                        THEN 'upgrade'::tipos_movimiento_suscripcion
                        ELSE 'downgrade'::tipos_movimiento_suscripcion
                    END
                ELSE 'renovacion'::tipos_movimiento_suscripcion
            END,
            OLD.precio_pactado_centimos,
            NEW.precio_pactado_centimos,
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_suscripciones_cambio
    AFTER UPDATE ON suscripciones
    FOR EACH ROW
    EXECUTE FUNCTION registrar_cambio_suscripcion();

COMMENT ON FUNCTION registrar_cambio_suscripcion IS 
'Registra automáticamente en historial_suscripciones cualquier cambio de plan o precio';

-- Actualizar correlativo de series automáticamente
CREATE OR REPLACE FUNCTION incrementar_correlativo_serie()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE series 
    SET ultimo_correlativo = ultimo_correlativo + 1
    WHERE serie = NEW.serie AND tipos_comprobante = NEW.tipos_comprobante;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comprobantes_correlativo
    AFTER INSERT ON comprobantes
    FOR EACH ROW
    EXECUTE FUNCTION incrementar_correlativo_serie();

COMMENT ON FUNCTION incrementar_correlativo_serie IS 
'Incrementa automáticamente el correlativo de la serie después de emitir un comprobante';

-- ==============================
-- TRIGGERS PARA ADMINISTRADOR
-- ==============================

-- Actualizar timestamp en productos
CREATE TRIGGER trg_productos_actualizado 
    BEFORE UPDATE ON productos 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_timestamp();

-- Actualizar timestamp en pedidos
CREATE TRIGGER trg_pedidos_actualizado 
    BEFORE UPDATE ON pedidos 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_timestamp();

-- Actualizar timestamp en planes de producción
CREATE TRIGGER trg_planes_produccion_actualizado 
    BEFORE UPDATE ON planes_produccion 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_timestamp();

-- Actualizar timestamp en órdenes de compra
CREATE TRIGGER trg_ordenes_compra_actualizado 
    BEFORE UPDATE ON ordenes_compra 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_timestamp();

-- Generar código de pedido automáticamente
CREATE TRIGGER trg_pedidos_codigo
    BEFORE INSERT ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION generar_codigo_pedido();

-- Registrar movimientos de caja automáticamente al confirmar pago
CREATE OR REPLACE FUNCTION registrar_movimiento_caja_pago()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo registrar si hay sesión de caja activa
    IF NEW.sesion_caja_id IS NOT NULL THEN
        INSERT INTO movimientos_caja (
            sesion_caja_id,
            tipo_movimiento,
            monto_centimos,
            metodo_pago,
            pedido_id,
            concepto,
            creado_en
        ) VALUES (
            NEW.sesion_caja_id,
            'venta'::tipos_movimiento_caja,
            NEW.monto_pagado_centimos,
            NEW.metodo_pago,
            NEW.pedido_id,
            'Pago de pedido',
            NEW.fecha_pago
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pagos_pedido_movimiento_caja
    AFTER INSERT ON pagos_pedido
    FOR EACH ROW
    EXECUTE FUNCTION registrar_movimiento_caja_pago();

COMMENT ON FUNCTION registrar_movimiento_caja_pago IS 
'Registra automáticamente el movimiento en caja cuando se registra un pago de pedido';

-- Actualizar stock de productos al confirmar venta
CREATE OR REPLACE FUNCTION actualizar_stock_venta()
RETURNS TRIGGER AS $$
DECLARE
    v_detalle RECORD;
BEGIN
    -- Solo actualizar stock cuando el pedido pase a estado 'pagado' o 'en_preparacion'
    IF NEW.estado_pedido IN ('pagado', 'en_preparacion') AND 
       OLD.estado_pedido NOT IN ('pagado', 'en_preparacion') THEN
        
        FOR v_detalle IN 
            SELECT producto_id, cantidad 
            FROM detalles_pedido 
            WHERE pedido_id = NEW.id
        LOOP
            -- Descontar del inventario
            UPDATE inventario_productos
            SET cantidad_actual = cantidad_actual - v_detalle.cantidad,
                actualizado_en = NOW()
            WHERE sede_id = NEW.sede_origen_id 
              AND producto_id = v_detalle.producto_id;
            
            -- Registrar movimiento
            INSERT INTO movimientos_inventario_productos (
                tienda_id,
                sede_id,
                producto_id,
                tipo_movimiento,
                cantidad,
                cantidad_anterior,
                cantidad_posterior,
                pedido_id,
                motivo,
                creado_en
            )
            SELECT 
                NEW.tienda_id,
                NEW.sede_origen_id,
                v_detalle.producto_id,
                'salida',
                -v_detalle.cantidad,
                ip.cantidad_actual + v_detalle.cantidad,
                ip.cantidad_actual,
                NEW.id,
                'venta'::motivos_movimiento,
                NOW()
            FROM inventario_productos ip
            WHERE ip.sede_id = NEW.sede_origen_id 
              AND ip.producto_id = v_detalle.producto_id;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pedidos_actualizar_stock
    AFTER UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_stock_venta();

COMMENT ON FUNCTION actualizar_stock_venta IS 
'Descuenta automáticamente el stock de productos cuando un pedido se confirma';

-- Actualizar stock de productos al finalizar producción
CREATE OR REPLACE FUNCTION actualizar_stock_produccion()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo si cambia de 'pendiente'/'en_horno' a 'terminado'
    IF NEW.estado = 'terminado' AND OLD.estado IN ('pendiente', 'en_horno') THEN
        
        -- Aumentar inventario de productos terminados
        INSERT INTO inventario_productos (tienda_id, sede_id, producto_id, cantidad_actual, actualizado_en)
        SELECT 
            pp.tienda_id,
            pp.sede_id,
            NEW.producto_id,
            NEW.cantidad_producida,
            NOW()
        FROM planes_produccion pp
        WHERE pp.id = NEW.plan_id
        ON CONFLICT (sede_id, producto_id)
        DO UPDATE SET 
            cantidad_actual = inventario_productos.cantidad_actual + EXCLUDED.cantidad_actual,
            actualizado_en = NOW();
        
        -- Registrar movimiento de ingreso
        INSERT INTO movimientos_inventario_productos (
            tienda_id,
            sede_id,
            producto_id,
            tipo_movimiento,
            cantidad,
            cantidad_anterior,
            cantidad_posterior,
            plan_produccion_id,
            motivo,
            creado_en
        )
        SELECT 
            pp.tienda_id,
            pp.sede_id,
            NEW.producto_id,
            'entrada',
            NEW.cantidad_producida,
            COALESCE(ip.cantidad_actual, 0),
            COALESCE(ip.cantidad_actual, 0) + NEW.cantidad_producida,
            NEW.plan_id,
            'produccion'::motivos_movimiento,
            NOW()
        FROM planes_produccion pp
        LEFT JOIN inventario_productos ip ON ip.sede_id = pp.sede_id AND ip.producto_id = NEW.producto_id
        WHERE pp.id = NEW.plan_id;
        
        -- Descontar insumos usados según receta
        INSERT INTO movimientos_inventario_insumos (
            tienda_id,
            sede_id,
            insumo_id,
            tipo_movimiento,
            cantidad,
            cantidad_anterior,
            cantidad_posterior,
            plan_produccion_id,
            motivo,
            creado_en
        )
        SELECT 
            pp.tienda_id,
            pp.sede_id,
            r.insumo_id,
            'salida',
            -(r.cantidad_requerida * NEW.cantidad_producida),
            ii.cantidad_actual,
            ii.cantidad_actual - (r.cantidad_requerida * NEW.cantidad_producida),
            NEW.plan_id,
            'Consumo por producción',
            NOW()
        FROM recetas r
        INNER JOIN planes_produccion pp ON pp.id = NEW.plan_id
        INNER JOIN inventario_insumos_sedes ii ON ii.sede_id = pp.sede_id AND ii.insumo_id = r.insumo_id
        WHERE r.producto_id = NEW.producto_id;
        
        -- Actualizar stock de insumos
        UPDATE inventario_insumos_sedes ii
        SET cantidad_actual = cantidad_actual - (r.cantidad_requerida * NEW.cantidad_producida),
            actualizado_en = NOW()
        FROM recetas r, planes_produccion pp
        WHERE r.producto_id = NEW.producto_id
          AND ii.insumo_id = r.insumo_id
          AND pp.id = NEW.plan_id
          AND ii.sede_id = pp.sede_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_detalles_plan_produccion_stock
    AFTER UPDATE ON detalles_plan_produccion
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_stock_produccion();

COMMENT ON FUNCTION actualizar_stock_produccion IS 
'Actualiza automáticamente inventarios de productos e insumos al finalizar producción';

-- Actualizar stock de insumos al recibir orden de compra
CREATE OR REPLACE FUNCTION actualizar_stock_compra()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo si la cantidad recibida aumenta
    IF NEW.cantidad_recibida > OLD.cantidad_recibida THEN
        
        -- Aumentar inventario de insumos
        INSERT INTO inventario_insumos_sedes (tienda_id, sede_id, insumo_id, cantidad_actual, actualizado_en)
        SELECT 
            oc.tienda_id,
            oc.sede_destino_id,
            NEW.insumo_id,
            NEW.cantidad_recibida - OLD.cantidad_recibida,
            NOW()
        FROM ordenes_compra oc
        WHERE oc.id = NEW.orden_compra_id
        ON CONFLICT (sede_id, insumo_id)
        DO UPDATE SET 
            cantidad_actual = inventario_insumos_sedes.cantidad_actual + EXCLUDED.cantidad_actual,
            actualizado_en = NOW();
        
        -- Registrar movimiento
        INSERT INTO movimientos_inventario_insumos (
            tienda_id,
            sede_id,
            insumo_id,
            tipo_movimiento,
            cantidad,
            cantidad_anterior,
            cantidad_posterior,
            orden_compra_id,
            motivo,
            creado_en
        )
        SELECT 
            oc.tienda_id,
            oc.sede_destino_id,
            NEW.insumo_id,
            'entrada',
            NEW.cantidad_recibida - OLD.cantidad_recibida,
            COALESCE(ii.cantidad_actual, 0) - (NEW.cantidad_recibida - OLD.cantidad_recibida),
            COALESCE(ii.cantidad_actual, 0),
            NEW.orden_compra_id,
            'Recepción de compra',
            NOW()
        FROM ordenes_compra oc
        LEFT JOIN inventario_insumos_sedes ii ON ii.sede_id = oc.sede_destino_id AND ii.insumo_id = NEW.insumo_id
        WHERE oc.id = NEW.orden_compra_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_detalles_orden_compra_stock
    AFTER UPDATE ON detalles_orden_compra
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_stock_compra();

COMMENT ON FUNCTION actualizar_stock_compra IS 
'Actualiza automáticamente el inventario de insumos al recibir una orden de compra';

-- Actualizar costo promedio de insumo al recibir compra
CREATE OR REPLACE FUNCTION actualizar_costo_promedio_insumo()
RETURNS TRIGGER AS $$
DECLARE
    v_stock_actual NUMERIC;
    v_costo_actual BIGINT;
    v_nuevo_costo BIGINT;
BEGIN
    IF NEW.cantidad_recibida > OLD.cantidad_recibida THEN
        -- Obtener stock y costo actual
        SELECT stock_actual_global, costo_promedio_unitario_centimos
        INTO v_stock_actual, v_costo_actual
        FROM insumos
        WHERE id = NEW.insumo_id;
        
        -- Calcular nuevo costo promedio ponderado
        v_nuevo_costo := (
            (v_stock_actual * v_costo_actual) + 
            ((NEW.cantidad_recibida - OLD.cantidad_recibida) * NEW.costo_unitario_pactado_centimos)
        ) / (v_stock_actual + (NEW.cantidad_recibida - OLD.cantidad_recibida));
        
        -- Actualizar insumo
        UPDATE insumos
        SET costo_promedio_unitario_centimos = v_nuevo_costo,
            ultimo_precio_compra_centimos = NEW.costo_unitario_pactado_centimos,
            stock_actual_global = stock_actual_global + (NEW.cantidad_recibida - OLD.cantidad_recibida)
        WHERE id = NEW.insumo_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_detalles_orden_compra_costo
    AFTER UPDATE ON detalles_orden_compra
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_costo_promedio_insumo();

COMMENT ON FUNCTION actualizar_costo_promedio_insumo IS 
'Actualiza el costo promedio ponderado del insumo al recibir compras';

-- Incrementar correlativo de series de tienda automáticamente
CREATE OR REPLACE FUNCTION incrementar_correlativo_serie_tienda()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tienda_series 
    SET correlativo_actual = correlativo_actual + 1
    WHERE serie = NEW.serie AND tipo_comprobante = NEW.tipo_comprobante;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tienda_comprobantes_correlativo
    AFTER INSERT ON tienda_comprobantes
    FOR EACH ROW
    EXECUTE FUNCTION incrementar_correlativo_serie_tienda();

-- Auditoría automática de cambios críticos
CREATE OR REPLACE FUNCTION registrar_auditoria()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO auditoria_usuarios (
        tienda_id,
        usuario_id,
        accion,
        entidad,
        entidad_id,
        valores_anteriores,
        valores_nuevos,
        creado_en
    ) VALUES (
        COALESCE(NEW.tienda_id, OLD.tienda_id),
        current_setting('app.usuario_id', true)::BIGINT,
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END,
        NOW()
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION registrar_auditoria IS 
'Registra automáticamente en auditoria_usuarios cualquier cambio en tablas críticas';

-- Aplicar auditoría a tablas críticas
CREATE TRIGGER trg_auditoria_productos
    AFTER INSERT OR UPDATE OR DELETE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION registrar_auditoria();

CREATE TRIGGER trg_auditoria_pedidos
    AFTER INSERT OR UPDATE OR DELETE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION registrar_auditoria();

CREATE TRIGGER trg_auditoria_ordenes_compra
    AFTER INSERT OR UPDATE OR DELETE ON ordenes_compra
    FOR EACH ROW
    EXECUTE FUNCTION registrar_auditoria();

-- ==============================
-- PROCEDURES ÚTILES
-- ==============================

-- Procedure para cerrar sesión de caja
CREATE OR REPLACE PROCEDURE cerrar_sesion_caja(
    p_sesion_id BIGINT,
    p_usuario_cierre_id BIGINT,
    p_monto_final_real_centimos BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_monto_esperado BIGINT;
BEGIN
    -- Calcular monto esperado (inicial + movimientos)
    SELECT 
        sc.monto_inicial_centimos + COALESCE(SUM(mc.monto_centimos), 0)
    INTO v_monto_esperado
    FROM sesiones_caja sc
    LEFT JOIN movimientos_caja mc ON mc.sesion_caja_id = sc.id
    WHERE sc.id = p_sesion_id
    GROUP BY sc.monto_inicial_centimos;
    
    -- Actualizar sesión
    UPDATE sesiones_caja
    SET usuario_cierre_id = p_usuario_cierre_id,
        monto_final_esperado_centimos = v_monto_esperado,
        monto_final_real_centimos = p_monto_final_real_centimos,
        fecha_cierre = NOW(),
        esta_abierta = FALSE
    WHERE id = p_sesion_id;
    
    RAISE NOTICE 'Sesión cerrada. Diferencia: %', (p_monto_final_real_centimos - v_monto_esperado);
END;
$$;

COMMENT ON PROCEDURE cerrar_sesion_caja IS 
'Cierra una sesión de caja calculando automáticamente el monto esperado y la diferencia';

-- Procedure para generar plan de producción desde conteo
CREATE OR REPLACE PROCEDURE generar_plan_desde_conteo(
    p_conteo_id BIGINT,
    p_fecha_produccion DATE,
    p_usuario_id BIGINT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_sede_id BIGINT;
    v_tienda_id BIGINT;
    v_plan_id BIGINT;
    v_producto RECORD;
BEGIN
    -- Obtener sede y tienda del conteo
    SELECT sede_id, tienda_id INTO v_sede_id, v_tienda_id
    FROM conteos_diarios
    WHERE id = p_conteo_id;
    
    -- Crear plan de producción
    INSERT INTO planes_produccion (tienda_id, sede_id, fecha_produccion, generado_por, estado)
    VALUES (v_tienda_id, v_sede_id, p_fecha_produccion, p_usuario_id, 'borrador')
    RETURNING id INTO v_plan_id;
    
    -- Insertar detalles basados en diferencias del conteo vs stock ideal
    FOR v_producto IN
        SELECT 
            dcd.producto_id,
            GREATEST(si.cantidad_ideal - dcd.cantidad_fisica, 0) as cantidad_faltante
        FROM detalle_conteo_diario dcd
        INNER JOIN stock_ideal si ON si.producto_id = dcd.producto_id AND si.sede_id = v_sede_id
        WHERE dcd.conteo_id = p_conteo_id
          AND si.cantidad_ideal > dcd.cantidad_fisica
    LOOP
        INSERT INTO detalles_plan_produccion (
            plan_id,
            producto_id,
            origen,
            cantidad_sugerida,
            cantidad_planificada,
            estado
        ) VALUES (
            v_plan_id,
            v_producto.producto_id,
            'stock_diario',
            v_producto.cantidad_faltante,
            v_producto.cantidad_faltante,
            'pendiente'
        );
    END LOOP;
    
    RAISE NOTICE 'Plan de producción % generado para sede %', v_plan_id, v_sede_id;
END;
$$;

COMMENT ON PROCEDURE generar_plan_desde_conteo IS 
'Genera automáticamente un plan de producción basado en las diferencias detectadas en el conteo diario';