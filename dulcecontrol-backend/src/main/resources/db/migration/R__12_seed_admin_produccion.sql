-- ============================================================================
-- R_12: SEED PRODUCCION ADMINISTRADOR (RECETAS, STOCK IDEAL, PLANES)
-- ============================================================================

-- =================================
-- PRODUCTOS E INSUMOS BASE PARA PRODUCCION
-- =================================

INSERT INTO productos (tienda_id, nombre, slug, sku, tipo, precio_base_centimos)
VALUES
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Torta Selva Negra',
    'torta-selva-negra',
    'SKU-SELVA-001',
    'producto_terminado',
    4500
  )
AS new
ON DUPLICATE KEY UPDATE
  nombre = new.nombre,
  tipo = new.tipo,
  precio_base_centimos = new.precio_base_centimos;

INSERT INTO insumos (tienda_id, nombre, codigo_interno, unidad_base, unidad_compra_habitual, factor_conversion)
VALUES
  (
    (SELECT id FROM tiendas WHERE numero_doc = '20601234567'),
    'Chocolate Bitter 70%',
    'INS-CHOC-001',
    'kg',
    'kg',
    1
  )
AS new
ON DUPLICATE KEY UPDATE
  nombre = new.nombre,
  unidad_base = new.unidad_base,
  unidad_compra_habitual = new.unidad_compra_habitual,
  factor_conversion = new.factor_conversion;

-- =================================
-- RECETAS
-- =================================

INSERT INTO recetas (tienda_id, producto_id, insumo_id, cantidad_requerida, unidad_medida, notas_preparacion)
SELECT
  t.id,
  p.id,
  i.id,
  2.5000,
  'kg',
  'Derretir el chocolate a banio maria y mezclar con la base de la torta.'
FROM tiendas t
INNER JOIN productos p ON p.tienda_id = t.id AND p.slug = 'torta-selva-negra'
INNER JOIN insumos i ON i.tienda_id = t.id AND i.codigo_interno = 'INS-CHOC-001'
WHERE t.numero_doc = '20601234567'
ON DUPLICATE KEY UPDATE
  cantidad_requerida = VALUES(cantidad_requerida),
  unidad_medida = VALUES(unidad_medida),
  notas_preparacion = VALUES(notas_preparacion);

-- =================================
-- STOCK IDEAL
-- =================================

INSERT INTO stock_ideal (tienda_id, sede_id, producto_id, cantidad_ideal, punto_reposicion)
SELECT
  t.id,
  s.id,
  p.id,
  120,
  40
FROM tiendas t
INNER JOIN sedes s ON s.tienda_id = t.id AND s.codigo_interno = 'DM-001'
INNER JOIN productos p ON p.tienda_id = t.id AND p.slug = 'torta-selva-negra'
WHERE t.numero_doc = '20601234567'
ON DUPLICATE KEY UPDATE
  cantidad_ideal = VALUES(cantidad_ideal),
  punto_reposicion = VALUES(punto_reposicion);

-- =================================
-- PLANES DE PRODUCCION
-- =================================

INSERT INTO planes_produccion (tienda_id, sede_id, fecha_produccion, estado, generado_por, confirmado_por, hora_inicio_real, hora_fin_real, notas_maestro)
SELECT
  t.id,
  s.id,
  '2025-01-15',
  'confirmado',
  u_generador.id,
  u_confirmador.id,
  '2025-01-15 06:00:00',
  '2025-01-15 09:00:00',
  'Plan base para produccion diaria de tortas.'
FROM tiendas t
INNER JOIN sedes s ON s.tienda_id = t.id AND s.codigo_interno = 'DM-001'
INNER JOIN usuarios_tienda u_generador ON u_generador.tienda_id = t.id AND u_generador.correo = 'panadero@dulcemanjar.pe'
INNER JOIN usuarios_tienda u_confirmador ON u_confirmador.tienda_id = t.id AND u_confirmador.correo = 'gerente@dulcemanjar.pe'
WHERE t.numero_doc = '20601234567'
ON DUPLICATE KEY UPDATE
  estado = VALUES(estado),
  generado_por = VALUES(generado_por),
  confirmado_por = VALUES(confirmado_por),
  hora_inicio_real = VALUES(hora_inicio_real),
  hora_fin_real = VALUES(hora_fin_real),
  notas_maestro = VALUES(notas_maestro);

-- =================================
-- DETALLES DE PLAN DE PRODUCCION
-- =================================

INSERT INTO detalles_plan_produccion (plan_id, producto_id, origen, cantidad_sugerida, cantidad_planificada, cantidad_producida, cantidad_merma, estado)
SELECT
  plan.id,
  p.id,
  'stock_diario',
  90,
  90,
  0,
  0,
  'pendiente'
FROM tiendas t
INNER JOIN sedes s ON s.tienda_id = t.id AND s.codigo_interno = 'DM-001'
INNER JOIN planes_produccion plan ON plan.sede_id = s.id AND plan.fecha_produccion = '2025-01-15'
INNER JOIN productos p ON p.tienda_id = t.id AND p.slug = 'torta-selva-negra'
WHERE t.numero_doc = '20601234567'
ON DUPLICATE KEY UPDATE
  cantidad_sugerida = VALUES(cantidad_sugerida),
  cantidad_planificada = VALUES(cantidad_planificada),
  cantidad_producida = VALUES(cantidad_producida),
  cantidad_merma = VALUES(cantidad_merma),
  estado = VALUES(estado);
