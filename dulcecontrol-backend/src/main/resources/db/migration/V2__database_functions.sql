-- =============================================================================
-- DULCE CONTROL - V2: Funciones Utilitarias y Triggers
-- Fecha: 2025-10-08
-- Descripción: Funciones PL/pgSQL para automatización y validaciones
-- =============================================================================

SET search_path = dulce_control, public;

-- =============================================================================
-- 1. Función: Actualización automática de timestamps
-- =============================================================================
-- Actualiza automáticamente el campo 'actualizado_en' en cada UPDATE
CREATE OR REPLACE FUNCTION dulce_control.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.actualizado_en := NOW();
  RETURN NEW;
END $$;

-- =============================================================================
-- 2. Función: Calcular total de items en ventas
-- =============================================================================
-- Calcula: total_item = (cantidad * precio_unitario) - descuento
-- Valida que el resultado no sea negativo
CREATE OR REPLACE FUNCTION dulce_control.calcular_total_item_venta()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.total_item := ROUND((NEW.cantidad * NEW.precio_unitario) - COALESCE(NEW.descuento, 0), 2);
  
  IF NEW.total_item < 0 THEN
    RAISE EXCEPTION 'El total_item no puede ser negativo. Verifique cantidad, precio y descuento.';
  END IF;
  
  RETURN NEW;
END $$;

-- =============================================================================
-- 3. Función: Recalcular totales de venta
-- =============================================================================
-- Recalcula subtotal, impuesto y total de una venta cuando cambian sus items
-- Se ejecuta DESPUÉS de INSERT/UPDATE/DELETE en venta_item
CREATE OR REPLACE FUNCTION dulce_control.recalcular_totales_venta()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_venta_id BIGINT := COALESCE(NEW.venta_id, OLD.venta_id);
  v_subtotal NUMERIC(12,2);
  v_impuesto NUMERIC(12,2);
  v_total    NUMERIC(12,2);
  v_pct      NUMERIC(5,2);
BEGIN
  -- Sumar todos los items de la venta
  SELECT COALESCE(ROUND(SUM(total_item), 2), 0) INTO v_subtotal
  FROM dulce_control.venta_item 
  WHERE venta_id = v_venta_id;

  -- Obtener porcentaje de impuesto configurado
  SELECT impuesto_porcentaje INTO v_pct
  FROM dulce_control.venta 
  WHERE id = v_venta_id;

  -- Calcular impuesto y total
  v_impuesto := ROUND(v_subtotal * (COALESCE(v_pct, 0) / 100.0), 2);
  v_total    := ROUND(v_subtotal + v_impuesto, 2);

  -- Actualizar la venta
  UPDATE dulce_control.venta
    SET subtotal = v_subtotal,
        impuesto = v_impuesto,
        total    = v_total,
        actualizado_en = NOW()
  WHERE id = v_venta_id;

  RETURN NULL;
END $$;

-- =============================================================================
-- 4. Función: Validar cambios de estado en pedidos (Máquina de Estados)
-- =============================================================================
-- Implementa una máquina de estados para pedidos:
-- pendiente → en_preparacion → listo → entregado
-- Cualquier estado puede pasar a 'anulado' excepto 'entregado'
CREATE OR REPLACE FUNCTION dulce_control.validar_cambio_estado_pedido()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  e_old TEXT := COALESCE(OLD.estado, '');
  e_new TEXT := NEW.estado;
  valido BOOLEAN := FALSE;
BEGIN
  -- Validar que el estado sea uno de los permitidos
  IF e_new NOT IN ('pendiente', 'en_preparacion', 'listo', 'entregado', 'anulado') THEN
    RAISE EXCEPTION 'Estado de pedido inválido: %. Estados permitidos: pendiente, en_preparacion, listo, entregado, anulado', e_new;
  END IF;

  -- En INSERT, el estado inicial debe ser 'pendiente'
  IF TG_OP = 'INSERT' THEN
    IF NEW.estado <> 'pendiente' THEN
      RAISE EXCEPTION 'El estado inicial de un pedido debe ser "pendiente", se intentó crear con: %', NEW.estado;
    END IF;
    RETURN NEW;
  END IF;

  -- Validar transiciones permitidas
  IF e_old = 'pendiente' AND e_new IN ('en_preparacion', 'anulado') THEN
    valido := TRUE;
  ELSIF e_old = 'en_preparacion' AND e_new IN ('listo', 'anulado') THEN
    valido := TRUE;
  ELSIF e_old = 'listo' AND e_new IN ('entregado', 'anulado') THEN
    valido := TRUE;
  ELSIF e_old = 'entregado' AND e_new = 'entregado' THEN
    valido := TRUE;  -- Permitir UPDATE sin cambio de estado
  ELSIF e_old = 'anulado' AND e_new = 'anulado' THEN
    valido := TRUE;  -- Permitir UPDATE sin cambio de estado
  END IF;

  IF NOT valido THEN
    RAISE EXCEPTION 'Transición de estado no permitida: % → %. Verifique el flujo de estados del pedido.', e_old, e_new;
  END IF;

  RETURN NEW;
END $$;

-- =============================================================================
-- 5. Función: Autocompletar estado de items en plan de producción
-- =============================================================================
-- Marca automáticamente un item como completado cuando cantidad_completada >= cantidad_objetivo
CREATE OR REPLACE FUNCTION dulce_control.plan_item_autocompletar()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Validar cantidades no negativas
  IF NEW.cantidad_completada < 0 THEN
    RAISE EXCEPTION 'La cantidad_completada no puede ser negativa: %', NEW.cantidad_completada;
  END IF;
  
  IF NEW.cantidad_objetivo < 0 THEN
    RAISE EXCEPTION 'La cantidad_objetivo no puede ser negativa: %', NEW.cantidad_objetivo;
  END IF;

  -- Marcar como completado si se alcanzó el objetivo
  IF NEW.cantidad_completada >= NEW.cantidad_objetivo THEN
    NEW.completado := TRUE;
  ELSE
    NEW.completado := FALSE;
  END IF;

  RETURN NEW;
END $$;
