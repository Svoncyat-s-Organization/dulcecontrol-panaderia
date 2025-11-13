*Endpoints de autenticación.*

// --- MODULO 1: AUTENTICACIÓN ---
[POST] /api/v1/auth/login

-----

### 🚀 API SUPERADMIN (SaaS)

*Gestión de tu plataforma, suscripciones y monitoreo global.*

// --- MÓDULO 2: GESTIÓN DE TIENDAS ---
[DELETE] /api/superadmin/tiendas/{tiendaId}
[DELETE] /api/superadmin/tiendas/{tiendaId}/sedes/{sedeId}
[GET]    /api/superadmin/tiendas
[GET]    /api/superadmin/tiendas/{tiendaId}
[GET]    /api/superadmin/tiendas/{tiendaId}/sedes
[GET]    /api/superadmin/tiendas/{tiendaId}/sedes/{sedeId}
[POST]   /api/superadmin/tiendas
[POST]   /api/superadmin/tiendas/{tiendaId}/sedes
[PUT]    /api/superadmin/tiendas/{tiendaId}
[PUT]    /api/superadmin/tiendas/{tiendaId}/sedes/{sedeId}

// --- MÓDULO 3: PLANES Y SUSCRIPCIONES ---
[GET]    /api/superadmin/suscripciones
[GET]    /api/superadmin/suscripciones/planes
[GET]    /api/superadmin/suscripciones/planes/{id}
[GET]    /api/superadmin/suscripciones/{id}
[GET]    /api/superadmin/suscripciones/{suscripcionId}/historial
[POST]   /api/superadmin/suscripciones
[POST]   /api/superadmin/suscripciones/planes
[PUT]    /api/superadmin/suscripciones/planes/{id}
[PUT]    /api/superadmin/suscripciones/{id}

// --- MÓDULO 4: FACTURACIÓN Y SUNAT (DEL SAAS) ---
[DELETE] /api/superadmin/facturacion/series/{id}
[GET]    /api/superadmin/facturacion/comprobantes
[GET]    /api/superadmin/facturacion/comprobantes/{comprobanteId}/detalles
[GET]    /api/superadmin/facturacion/comprobantes/{id}
[GET]    /api/superadmin/facturacion/series
[GET]    /api/superadmin/facturacion/series/{id}
[GET]    /api/superadmin/facturacion/transacciones
[GET]    /api/superadmin/facturacion/transacciones/{id}
[POST]   /api/superadmin/facturacion/series
[PUT]    /api/superadmin/facturacion/series/{id}

// --- MÓDULO 5: CENTRO DE SOPORTE ---
[DELETE] /api/superadmin/soporte/mensajes/{id}
[DELETE] /api/superadmin/soporte/tickets/{id}
[GET]    /api/superadmin/soporte/mensajes
[GET]    /api/superadmin/soporte/mensajes/{id}
[GET]    /api/superadmin/soporte/tickets
[GET]    /api/superadmin/soporte/tickets/{id}
[GET]    /api/superadmin/soporte/tickets/{ticketId}/mensajes
[POST]   /api/superadmin/soporte/mensajes
[POST]   /api/superadmin/soporte/tickets
[PUT]    /api/superadmin/soporte/mensajes/{id}
[PUT]    /api/superadmin/soporte/tickets/{id}

// --- MÓDULO 6: SISTEMA Y SEGURIDAD ---
[DELETE] /api/superadmin/seguridad/usuarios/{id}
[GET]    /api/superadmin/seguridad/actividades
[GET]    /api/superadmin/seguridad/actividades/usuarios/{superadminId}
[GET]    /api/superadmin/seguridad/usuarios
[GET]    /api/superadmin/seguridad/usuarios/{id}
[POST]   /api/superadmin/seguridad/actividades/usuarios/{superadminId}
[POST]   /api/superadmin/seguridad/usuarios
[PUT]    /api/superadmin/seguridad/usuarios/{id}

-----

### 🏪 API ADMIN (Cliente / Panadería)

*Endpoints operativos para el día a día de tus clientes.*

// --- MÓDULO 2: CLIENTES ---
[DELETE] /api/admin/tiendas/{tiendaId}/clientes/{clienteId}
[DELETE] /api/admin/tiendas/{tiendaId}/clientes/{clienteId}/direcciones/{direccionId}
[GET]    /api/admin/tiendas/{tiendaId}/clientes
[GET]    /api/admin/tiendas/{tiendaId}/clientes/buscar
[GET]    /api/admin/tiendas/{tiendaId}/clientes/{clienteId}
[GET]    /api/admin/tiendas/{tiendaId}/clientes/{clienteId}/direcciones
[GET]    /api/admin/tiendas/{tiendaId}/clientes/{clienteId}/direcciones/{direccionId}
[POST]   /api/admin/tiendas/{tiendaId}/clientes
[POST]   /api/admin/tiendas/{tiendaId}/clientes/{clienteId}/direcciones
[PUT]    /api/admin/tiendas/{tiendaId}/clientes/{clienteId}
[PUT]    /api/admin/tiendas/{tiendaId}/clientes/{clienteId}/direcciones/{direccionId}

// --- MÓDULO 3: VENTAS & PEDIDOS (POS / CAJA) ---
[DELETE] /api/admin/tiendas/{tiendaId}/ventas/cajas/{cajaId}
[DELETE] /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}
[DELETE] /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detalleId}
[DELETE] /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detallePedidoId}/personalizacion
[DELETE] /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/direcciones/{direccionId}
[DELETE] /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/pagos/{pagoId}
[DELETE] /api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionCajaId}/movimientos/{movimientoId}
[DELETE] /api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionId}
[GET]    /api/admin/tiendas/{tiendaId}/ventas/cajas
[GET]    /api/admin/tiendas/{tiendaId}/ventas/cajas/{cajaId}
[GET]    /api/admin/tiendas/{tiendaId}/ventas/pedidos
[GET]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}
[GET]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles
[GET]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detalleId}
[GET]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detallePedidoId}/personalizacion
[GET]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/direcciones
[GET]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/direcciones/{direccionId}
[GET]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/pagos
[GET]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/pagos/{pagoId}
[GET]    /api/admin/tiendas/{tiendaId}/ventas/sesiones-caja
[GET]    /api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionCajaId}/movimientos
[GET]    /api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionCajaId}/movimientos/{movimientoId}
[GET]    /api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionId}
[POST]   /api/admin/tiendas/{tiendaId}/ventas/cajas
[POST]   /api/admin/tiendas/{tiendaId}/ventas/pedidos
[POST]   /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles
[POST]   /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detallePedidoId}/personalizacion
[POST]   /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/direcciones
[POST]   /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/pagos
[POST]   /api/admin/tiendas/{tiendaId}/ventas/sesiones-caja
[POST]   /api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionCajaId}/movimientos
[PUT]    /api/admin/tiendas/{tiendaId}/ventas/cajas/{cajaId}
[PUT]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}
[PUT]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detalleId}
[PUT]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detallePedidoId}/personalizacion
[PUT]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/direcciones/{direccionId}
[PUT]    /api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/pagos/{pagoId}
[PUT]    /api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionCajaId}/movimientos/{movimientoId}
[PUT]    /api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionId}

// --- MÓDULO 4: PRODUCCIÓN ---
[DELETE] /api/admin/tiendas/{tiendaId}/produccion/recetas/{recetaId}
[DELETE] /api/admin/tiendas/{tiendaId}/produccion/stock-ideal/{stockId}
[GET]    /api/admin/tiendas/{tiendaId}/produccion/recetas
[GET]    /api/admin/tiendas/{tiendaId}/produccion/recetas/{recetaId}
[GET]    /api/admin/tiendas/{tiendaId}/produccion/stock-ideal
[GET]    /api/admin/tiendas/{tiendaId}/produccion/stock-ideal/{stockId}
[POST]   /api/admin/tiendas/{tiendaId}/produccion/recetas
[POST]   /api/admin/tiendas/{tiendaId}/produccion/stock-ideal
[PUT]    /api/admin/tiendas/{tiendaId}/produccion/recetas/{recetaId}
[PUT]    /api/admin/tiendas/{tiendaId}/produccion/stock-ideal/{stockId}

// --- MÓDULO 5: INVENTARIO (Existencias y Movimientos) ---
[DELETE] /api/admin/tiendas/{tiendaId}/inventario/insumos/{id}
[DELETE] /api/admin/tiendas/{tiendaId}/inventario/productos/{id}
[DELETE] /api/admin/tiendas/{tiendaId}/inventario/transferencias/{id}
[GET]    /api/admin/tiendas/{tiendaId}/inventario/insumos
[GET]    /api/admin/tiendas/{tiendaId}/inventario/insumos/sede/{sedeId}
[GET]    /api/admin/tiendas/{tiendaId}/inventario/insumos/sede/{sedeId}/bajo-stock
[GET]    /api/admin/tiendas/{tiendaId}/inventario/insumos/{id}
[GET]    /api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos
[GET]    /api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos/rango-fechas
[GET]    /api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos/sede/{sedeId}
[GET]    /api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos/sede/{sedeId}/insumo/{insumoId}
[GET]    /api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos/sede/{sedeId}/paginado
[GET]    /api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos/{id}
[GET]    /api/admin/tiendas/{tiendaId}/inventario/movimientos/productos
[GET]    /api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/rango-fechas
[GET]    /api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/sede/{sedeId}
[GET]    /api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/sede/{sedeId}/paginado
[GET]    /api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/sede/{sedeId}/producto/{productoId}
[GET]    /api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/{id}
[GET]    /api/admin/tiendas/{tiendaId}/inventario/productos
[GET]    /api/admin/tiendas/{tiendaId}/inventario/productos/sede/{sedeId}
[GET]    /api/admin/tiendas/{tiendaId}/inventario/productos/sede/{sedeId}/bajo-stock
[GET]    /api/admin/tiendas/{tiendaId}/inventario/productos/{id}
[GET]    /api/admin/tiendas/{tiendaId}/inventario/transferencias
[GET]    /api/admin/tiendas/{tiendaId}/inventario/transferencias/estado/{estado}
[GET]    /api/admin/tiendas/{tiendaId}/inventario/transferencias/{id}
[PATCH]  /api/admin/tiendas/{tiendaId}/inventario/transferencias/{id}/estado
[POST]   /api/admin/tiendas/{tiendaId}/inventario/insumos
[POST]   /api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos
[POST]   /api/admin/tiendas/{tiendaId}/inventario/movimientos/productos
[POST]   /api/admin/tiendas/{tiendaId}/inventario/productos
[POST]   /api/admin/tiendas/{tiendaId}/inventario/transferencias
[PUT]    /api/admin/tiendas/{tiendaId}/inventario/insumos/{id}
[PUT]    /api/admin/tiendas/{tiendaId}/inventario/productos/{id}
[PUT]    /api/admin/tiendas/{tiendaId}/inventario/transferencias/{id}

// --- MÓDULO 6: COMPRAS (Gestión con Proveedores) ---
[DELETE] /api/admin/tiendas/{tiendaId}/compras/insumos/{insumoId}
[DELETE] /api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles/{detalleId}
[DELETE] /api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenId}
[DELETE] /api/admin/tiendas/{tiendaId}/compras/proveedores/{proveedorId}
[GET]    /api/admin/tiendas/{tiendaId}/compras/insumos
[GET]    /api/admin/tiendas/{tiendaId}/compras/insumos/{insumoId}
[GET]    /api/admin/tiendas/{tiendaId}/compras/ordenes
[GET]    /api/admin/tiendas/{tiendaId}/compras/ordenes/pendientes
[GET]    /api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles
[GET]    /api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles/{detalleId}
[GET]    /api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenId}
[GET]    /api/admin/tiendas/{tiendaId}/compras/proveedores
[GET]    /api/admin/tiendas/{tiendaId}/compras/proveedores/{proveedorId}
[PATCH]  /api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles/{detalleId}/recepcion
[PATCH]  /api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenId}/estado
[POST]   /api/admin/tiendas/{tiendaId}/compras/insumos
[POST]   /api/admin/tiendas/{tiendaId}/compras/ordenes
[POST]   /api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles
[POST]   /api/admin/tiendas/{tiendaId}/compras/proveedores
[PUT]    /api/admin/tiendas/{tiendaId}/compras/insumos/{insumoId}
[PUT]    /api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles/{detalleId}
[PUT]    /api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenId}
[PUT]    /api/admin/tiendas/{tiendaId}/compras/proveedores/{proveedorId}

// --- MÓDULO 7: FACTURACIÓN (Emisión de Comprobantes) ---
[DELETE] /api/admin/tiendas/{tiendaId}/facturacion/comprobantes/{comprobanteId}
[GET]    /api/admin/tiendas/{tiendaId}/facturacion/comprobantes
[GET]    /api/admin/tiendas/{tiendaId}/facturacion/comprobantes/pedido/{pedidoId}
[GET]    /api/admin/tiendas/{tiendaId}/facturacion/comprobantes/{comprobanteId}
[PATCH]  /api/admin/tiendas/{tiendaId}/facturacion/comprobantes/{comprobanteId}/estado-sunat
[POST]   /api/admin/tiendas/{tiendaId}/facturacion/comprobantes
[POST]   /api/admin/tiendas/{tiendaId}/facturacion/comprobantes/{comprobanteId}/enviar-sunat
[PUT]    /api/admin/tiendas/{tiendaId}/facturacion/comprobantes/{comprobanteId}

// --- MÓDULO 8: CATÁLOGO ---
[DELETE] /api/admin/tiendas/{tiendaId}/catalogo/categorias/{categoriaId}
[DELETE] /api/admin/tiendas/{tiendaId}/catalogo/productos/{productoId}
[GET]    /api/admin/tiendas/{tiendaId}/catalogo/categorias
[GET]    /api/admin/tiendas/{tiendaId}/catalogo/categorias/{categoriaId}
[GET]    /api/admin/tiendas/{tiendaId}/catalogo/productos
[GET]    /api/admin/tiendas/{tiendaId}/catalogo/productos/{productoId}
[POST]   /api/admin/tiendas/{tiendaId}/catalogo/categorias
[POST]   /api/admin/tiendas/{tiendaId}/catalogo/productos
[PUT]    /api/admin/tiendas/{tiendaId}/catalogo/categorias/{categoriaId}
[PUT]    /api/admin/tiendas/{tiendaId}/catalogo/productos/{productoId}

// --- MÓDULO 10: CONFIGURACIÓN & SEGURIDAD ---
// -- Subsección: Configuración General --
[GET]    /api/admin/tiendas/{tiendaId}/configuracion
[PUT]    /api/admin/tiendas/{tiendaId}/configuracion

// -- Subsección: CMS Storefront --
[DELETE] /api/admin/tiendas/{tiendaId}/paginas-storefront/{paginaId}
[GET]    /api/admin/tiendas/{tiendaId}/paginas-storefront
[GET]    /api/admin/tiendas/{tiendaId}/paginas-storefront/buscar
[GET]    /api/admin/tiendas/{tiendaId}/paginas-storefront/{paginaId}
[POST]   /api/admin/tiendas/{tiendaId}/paginas-storefront
[PUT]    /api/admin/tiendas/{tiendaId}/paginas-storefront/{paginaId}

// -- Subsección: Usuarios y Roles --
[DELETE] /api/admin/tiendas/{tiendaId}/seguridad/roles/{rolId}
[DELETE] /api/admin/tiendas/{tiendaId}/seguridad/usuarios/{usuarioId}
[GET]    /api/admin/seguridad/permisos
[GET]    /api/admin/tiendas/{tiendaId}/seguridad/roles
[GET]    /api/admin/tiendas/{tiendaId}/seguridad/roles/{rolId}
[GET]    /api/admin/tiendas/{tiendaId}/seguridad/usuarios
[GET]    /api/admin/tiendas/{tiendaId}/seguridad/usuarios/{usuarioId}
[POST]   /api/admin/tiendas/{tiendaId}/seguridad/roles
[POST]   /api/admin/tiendas/{tiendaId}/seguridad/usuarios
[PUT]    /api/admin/tiendas/{tiendaId}/seguridad/roles/{rolId}
[PUT]    /api/admin/tiendas/{tiendaId}/seguridad/usuarios/{usuarioId}

// -- Subsección: Configuración SUNAT (Series) --
[DELETE] /api/admin/facturacion/series/{id}
[GET]    /api/admin/facturacion/series/sede/{sedeId}
[GET]    /api/admin/facturacion/series/sede/{sedeId}/activas
[GET]    /api/admin/facturacion/series/tienda/{tiendaId}
[GET]    /api/admin/facturacion/series/tienda/{tiendaId}/activas
[GET]    /api/admin/facturacion/series/tienda/{tiendaId}/tipo/{tipoComprobante}/activas
[GET]    /api/admin/facturacion/series/{id}
[POST]   /api/admin/facturacion/series
[POST]   /api/admin/facturacion/series/{id}/incrementar-correlativo
[PUT]    /api/admin/facturacion/series/{id}
[PUT]    /api/admin/facturacion/series/{id}/activar