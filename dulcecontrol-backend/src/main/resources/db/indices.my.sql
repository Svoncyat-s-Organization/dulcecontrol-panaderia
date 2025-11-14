-- ======================================================
-- ÍNDICES MYSQL - DULCECONTROL (Equivalentes PostgreSQL)
-- ======================================================

USE dulcecontrol_db;

-- ============================================
-- ÍNDICES BASE (UBIGEO)
-- ============================================

CREATE INDEX idx_ubigeo_provincias_dpto_id
    ON ubigeo_provincias(departamento_id);

CREATE INDEX idx_ubigeo_distritos_prov_id
    ON ubigeo_distritos(provincia_id);

-- ============================================
-- ÍNDICES ORGANIZADOS POR MÓDULO
-- ============================================

-- ==============================
-- ÍNDICES PARA SUPERADMINISTRADOR
-- ==============================

-- Dashboard: KPIs en tiempo real
CREATE INDEX idx_tiendas_estado_activo
    ON tiendas(estado, eliminado_en);

CREATE INDEX idx_suscripciones_estado_fecha
    ON suscripciones(estado, fecha_fin DESC);

CREATE INDEX idx_comprobantes_sunat_estado
    ON comprobantes(estados_sunat, fecha_emision DESC);

-- Gestión de Tiendas
CREATE INDEX idx_tiendas_busqueda
    ON tiendas(numero_doc, nombre_comercial);

CREATE INDEX idx_sedes_tienda_activas
    ON sedes(tienda_id, activo, eliminado_en);

CREATE INDEX idx_dominios_tienda
    ON dominios_tienda(tienda_id, tipo);

-- Planes y Suscripciones
CREATE INDEX idx_planes_activos
    ON planes(activo, codigo);

CREATE INDEX idx_suscripciones_tienda
    ON suscripciones(tienda_id, estado, fecha_fin DESC);

CREATE INDEX idx_historial_suscripciones_lookup
    ON historial_suscripciones(suscripcion_id, fecha_movimiento DESC);

-- Facturación y SUNAT
CREATE INDEX idx_comprobantes_tienda_fecha
    ON comprobantes(tienda_id, fecha_emision DESC);

CREATE INDEX idx_comprobantes_tipo_serie
    ON comprobantes(tipos_comprobante, serie_id, correlativo DESC);

CREATE INDEX idx_transacciones_comprobante
    ON transacciones_pago(comprobante_id, estado);

CREATE INDEX idx_transacciones_pasarela
    ON transacciones_pago(pasarela, estado, creado_en DESC);

CREATE INDEX idx_detalles_comprobante_factura
    ON detalles_comprobante(comprobante_id);

-- Centro de Soporte
CREATE INDEX idx_tickets_estado_prioridad
    ON tickets_soporte(estado, prioridad, creado_en DESC);

CREATE INDEX idx_tickets_asignacion
    ON tickets_soporte(asignado_a_id, estado);

CREATE INDEX idx_mensajes_ticket_orden
    ON mensajes_ticket(ticket_id, creado_en);

-- Sistema y Seguridad
CREATE INDEX idx_actividad_superadmin_fecha
    ON actividad_superadmin(admin_id, creado_en DESC);

CREATE INDEX idx_usuarios_superadmin_correo
    ON usuarios_superadmin(correo, activo, eliminado_en);

-- ==============================
-- ÍNDICES PARA ADMINISTRADOR
-- ==============================

-- Dashboard
CREATE INDEX idx_pedidos_tienda_fecha
    ON pedidos(tienda_id, creado_en DESC);

CREATE INDEX idx_pedidos_estado_pago
    ON pedidos(tienda_id, estado_pedido, estado_pago);

-- Clientes
CREATE INDEX idx_clientes_tienda_busqueda
    ON clientes(tienda_id, numero_doc, email, activo);

CREATE INDEX idx_clientes_usuario_virtual
    ON clientes(tienda_id, es_usuario_virtual);

CREATE INDEX idx_direcciones_cliente
    ON direcciones_cliente(cliente_id, es_entrega);

-- Ventas & Pedidos (POS)
CREATE INDEX idx_pedidos_borrador_pos
    ON pedidos(sede_origen_id, vendedor_id, estado_pedido);

CREATE INDEX idx_pedidos_sede_fecha
    ON pedidos(sede_origen_id, estado_pedido, creado_en DESC);

CREATE INDEX idx_detalles_pedido_producto
    ON detalles_pedido(pedido_id, producto_id);

CREATE INDEX idx_direcciones_pedido_envio
    ON direcciones_pedido(pedido_id);

CREATE INDEX idx_pagos_pedido
    ON pagos_pedido(pedido_id, fecha_pago DESC);

-- Caja
CREATE INDEX idx_sesiones_caja_activas
    ON sesiones_caja(caja_id, esta_abierta, fecha_apertura DESC);

CREATE INDEX idx_sesiones_caja_usuario
    ON sesiones_caja(usuario_apertura_id, fecha_apertura DESC);

CREATE INDEX idx_movimientos_caja_sesion
    ON movimientos_caja(sesion_caja_id, tipo_movimiento, creado_en);

CREATE INDEX idx_movimientos_caja_pedido
    ON movimientos_caja(pedido_id);

-- Producción
CREATE INDEX idx_planes_produccion_sede_fecha
    ON planes_produccion(sede_id, fecha_produccion, estado);

CREATE INDEX idx_planes_produccion_activos
    ON planes_produccion(tienda_id, estado);

CREATE INDEX idx_detalles_plan_producto
    ON detalles_plan_produccion(plan_id, producto_id, estado);

CREATE INDEX idx_detalles_plan_personalizados
    ON detalles_plan_produccion(plan_id, es_personalizado);

CREATE INDEX idx_detalles_plan_pedido_cliente
    ON detalles_plan_produccion(pedido_cliente_id);

CREATE INDEX idx_detalles_plan_detalle_pedido
    ON detalles_plan_produccion(detalle_pedido_id);

CREATE INDEX idx_recetas_producto
    ON recetas(producto_id, insumo_id);

CREATE INDEX idx_conteos_diarios_sede_fecha
    ON conteos_diarios(sede_id, fecha_conteo DESC);

CREATE INDEX idx_detalle_conteo
    ON detalle_conteo_diario(conteo_id, producto_id);

-- Inventario (Insumos)
CREATE INDEX idx_inventario_insumos_tienda
    ON inventario_insumos_sedes(tienda_id, cantidad_actual);

CREATE INDEX idx_movimientos_insumos_sede_fecha
    ON movimientos_inventario_insumos(sede_id, insumo_id, creado_en DESC);

CREATE INDEX idx_movimientos_insumos_tipo
    ON movimientos_inventario_insumos(tienda_id, tipo_movimiento, creado_en DESC);

CREATE INDEX idx_movimientos_insumos_orden_compra
    ON movimientos_inventario_insumos(orden_compra_id);

CREATE INDEX idx_movimientos_insumos_plan
    ON movimientos_inventario_insumos(plan_produccion_id);

CREATE INDEX idx_movimientos_insumos_transferencia
    ON movimientos_inventario_insumos(transferencia_id);

-- Inventario (Productos)
CREATE INDEX idx_inventario_productos_disponibles
    ON inventario_productos(tienda_id, cantidad_actual);

CREATE INDEX idx_movimientos_productos_sede_fecha
    ON movimientos_inventario_productos(sede_id, producto_id, creado_en DESC);

CREATE INDEX idx_movimientos_productos_tipo
    ON movimientos_inventario_productos(tienda_id, tipo_movimiento, creado_en DESC);

CREATE INDEX idx_movimientos_productos_pedido
    ON movimientos_inventario_productos(pedido_id);

CREATE INDEX idx_movimientos_productos_plan
    ON movimientos_inventario_productos(plan_produccion_id);

-- Transferencias
CREATE INDEX idx_transferencias_origen
    ON transferencias_inventario(sede_origen_id, estado, fecha_solicitud DESC);

CREATE INDEX idx_transferencias_destino
    ON transferencias_inventario(sede_destino_id, estado, fecha_solicitud DESC);

CREATE INDEX idx_items_transferencia
    ON items_transferencia(transferencia_id);

-- Compras
CREATE INDEX idx_proveedores_tienda_activos
    ON proveedores(tienda_id, activo);

CREATE INDEX idx_ordenes_compra_estado
    ON ordenes_compra(tienda_id, estado, fecha_emision DESC);

CREATE INDEX idx_ordenes_compra_sede
    ON ordenes_compra(sede_destino_id, estado);

CREATE INDEX idx_ordenes_compra_proveedor
    ON ordenes_compra(proveedor_id, fecha_emision DESC);

CREATE INDEX idx_detalles_orden_compra
    ON detalles_orden_compra(orden_compra_id, insumo_id);

CREATE INDEX idx_detalles_orden_pendientes
    ON detalles_orden_compra(orden_compra_id, recibido_completo);

-- Catálogo
CREATE INDEX idx_productos_tienda_activos
    ON productos(tienda_id, activo);

CREATE INDEX idx_productos_categoria
    ON productos(categoria_id, activo);

CREATE INDEX idx_productos_pos_visible
    ON productos(tienda_id, visible_en_pos, activo);

CREATE INDEX idx_productos_storefront_visible
    ON productos(tienda_id, visible_en_storefront, activo);

CREATE INDEX idx_productos_destacados
    ON productos(tienda_id, destacado_storefront, activo);

CREATE INDEX idx_productos_busqueda
    ON productos(tienda_id, slug, sku);

CREATE INDEX idx_categorias_tienda_activas
    ON categorias(tienda_id, activa, orden_visual);

-- Insumos
CREATE INDEX idx_insumos_tienda_activos
    ON insumos(tienda_id, activo);

CREATE INDEX idx_insumos_stock_bajo
    ON insumos(tienda_id, stock_actual_global, stock_minimo_global, activo);

-- Facturación Tienda
CREATE INDEX idx_tienda_comprobantes_pedido
    ON tienda_comprobantes(pedido_id);

CREATE INDEX idx_tienda_comprobantes_serie
    ON tienda_comprobantes(tipo_comprobante, serie_id, correlativo DESC);

CREATE INDEX idx_tienda_comprobantes_fecha
    ON tienda_comprobantes(tienda_id, fecha_emision DESC);

CREATE INDEX idx_tienda_comprobantes_sunat
    ON tienda_comprobantes(estado_sunat, fecha_emision DESC);

CREATE INDEX idx_tienda_series_activas
    ON tienda_series(tienda_id, sede_id, activa);

-- Configuración & Seguridad (Usuarios y Roles)
CREATE INDEX idx_usuarios_tienda_rol
    ON usuarios_tienda(rol_id, activo);

CREATE INDEX idx_usuarios_tienda_correo
    ON usuarios_tienda(tienda_id, correo, eliminado_en);

CREATE INDEX idx_usuarios_tienda_activos
    ON usuarios_tienda(tienda_id, activo, eliminado_en);

CREATE INDEX idx_usuarios_tokens_validos
    ON usuarios_tienda_tokens(usuario_id, tipo, expira_en, revocado_en);

CREATE INDEX idx_usuario_sedes
    ON usuario_sedes(usuario_id, es_sede_principal);

CREATE INDEX idx_usuario_sedes_por_sede
    ON usuario_sedes(sede_id, es_sede_principal DESC);

CREATE INDEX idx_roles_tienda
    ON roles(tienda_id);

CREATE INDEX idx_roles_permisos_permiso
    ON roles_permisos(permiso_id);

CREATE INDEX idx_permisos_modulo
    ON permisos(modulo, slug);

-- Auditoría
CREATE INDEX idx_auditoria_tienda_fecha
    ON auditoria_usuarios(tienda_id, creado_en DESC);

CREATE INDEX idx_auditoria_usuario
    ON auditoria_usuarios(usuario_id, creado_en DESC);

CREATE INDEX idx_auditoria_entidad
    ON auditoria_usuarios(entidad, entidad_id, creado_en DESC);

-- CMS (Storefront)
CREATE INDEX idx_paginas_storefront_activas
    ON paginas_storefront(tienda_id, activa, orden_menu);

CREATE INDEX idx_paginas_storefront_menu
    ON paginas_storefront(tienda_id, visible_en_menu, orden_menu, activa);

-- ==============================
-- ÍNDICES ESPECIALES PARA REPORTES
-- ==============================

CREATE INDEX idx_pedidos_reporte_ventas
    ON pedidos(tienda_id, estado_pedido, creado_en);

CREATE INDEX idx_detalles_pedido_stats
    ON detalles_pedido(producto_id, cantidad);

CREATE INDEX idx_detalles_plan_merma
    ON detalles_plan_produccion(producto_id, cantidad_merma);

CREATE INDEX idx_planes_produccion_tiempos
    ON planes_produccion(tienda_id, fecha_produccion, hora_inicio_real, hora_fin_real, estado);

-- ==============================
-- ÍNDICES DE BÚSQUEDA FULLTEXT
-- ==============================

CREATE FULLTEXT INDEX idx_productos_busqueda_texto
    ON productos(nombre, descripcion);

CREATE FULLTEXT INDEX idx_clientes_busqueda_texto
    ON clientes(nombre_doc, email);

-- ==============================
-- ÍNDICES COMPUESTOS PARA CONSULTAS COMPLEJAS
-- ==============================

CREATE INDEX idx_sesiones_caja_dashboard
    ON sesiones_caja(caja_id, fecha_apertura, esta_abierta);

CREATE INDEX idx_pedidos_pendientes_sede
    ON pedidos(sede_origen_id, estado_pedido, estado_pago, fecha_entrega_pactada);

CREATE INDEX idx_inventario_productos_critico
    ON inventario_productos(sede_id, cantidad_actual);

CREATE INDEX idx_ordenes_compra_pendientes
    ON ordenes_compra(sede_destino_id, estado, fecha_recepcion_esperada);

-- ==============================
-- NOTAS SOBRE FILTROS PARCIALES
-- ==============================
-- MySQL 8.0 no soporta índices parciales con condiciones WHERE.
-- Se incluyen las columnas de filtrado (por ejemplo, activo, eliminado_en, estado)
-- dentro de los índices para acercarse al comportamiento selectivo definido en PostgreSQL.

