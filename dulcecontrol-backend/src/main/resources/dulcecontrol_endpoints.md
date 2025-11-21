Aquí está la organización de los endpoints según las categorías especificadas:

# Panel Superadministrador

## 0. Autenticación
* **POST** `/api/auth/superadmin/login`
* **POST** `/api/token/register`
* **POST** `/api/token/login`
* **GET** `/api/token`
* **GET** `/api/token/me`
* **DELETE** `/api/token/{id}`

## 1. Tablero/Dashboard
*(No hay endpoints específicos de dashboard en la lista)*

## 2. Gestión de Tiendas y Sedes
* **GET** `/api/superadmin/tiendas/{tiendaId}`
* **PUT** `/api/superadmin/tiendas/{tiendaId}`
* **DELETE** `/api/superadmin/tiendas/{tiendaId}`
* **GET** `/api/superadmin/tiendas`
* **POST** `/api/superadmin/tiendas`
* **GET** `/api/superadmin/tiendas/{tiendaId}/sedes/{sedeId}`
* **PUT** `/api/superadmin/tiendas/{tiendaId}/sedes/{sedeId}`
* **DELETE** `/api/superadmin/tiendas/{tiendaId}/sedes/{sedeId}`
* **GET** `/api/superadmin/tiendas/{tiendaId}/sedes`
* **POST** `/api/superadmin/tiendas/{tiendaId}/sedes`

## 3. Gestión de Suscripciones y Planes
* **GET** `/api/superadmin/suscripciones/{id}`
* **PUT** `/api/superadmin/suscripciones/{id}`
* **GET** `/api/superadmin/suscripciones`
* **POST** `/api/superadmin/suscripciones`
* **GET** `/api/superadmin/suscripciones/{suscripcionId}/historial`
* **GET** `/api/superadmin/suscripciones/planes/{id}`
* **PUT** `/api/superadmin/suscripciones/planes/{id}`
* **GET** `/api/superadmin/suscripciones/planes`
* **POST** `/api/superadmin/suscripciones/planes`

## 4. Facturación y SUNAT
* **GET** `/api/superadmin/facturacion/series/{id}`
* **PUT** `/api/superadmin/facturacion/series/{id}`
* **DELETE** `/api/superadmin/facturacion/series/{id}`
* **GET** `/api/superadmin/facturacion/series`
* **POST** `/api/superadmin/facturacion/series`
* **GET** `/api/superadmin/facturacion/transacciones`
* **GET** `/api/superadmin/facturacion/transacciones/{id}`
* **GET** `/api/superadmin/facturacion/comprobantes`
* **GET** `/api/superadmin/facturacion/comprobantes/{id}`
* **GET** `/api/superadmin/facturacion/comprobantes/{comprobanteId}/detalles`

## 5. Centro de Soporte
* **GET** `/api/superadmin/soporte/tickets/{id}`
* **PUT** `/api/superadmin/soporte/tickets/{id}`
* **DELETE** `/api/superadmin/soporte/tickets/{id}`
* **GET** `/api/superadmin/soporte/tickets`
* **POST** `/api/superadmin/soporte/tickets`
* **GET** `/api/superadmin/soporte/tickets/{ticketId}/mensajes`
* **GET** `/api/superadmin/soporte/mensajes/{id}`
* **PUT** `/api/superadmin/soporte/mensajes/{id}`
* **DELETE** `/api/superadmin/soporte/mensajes/{id}`
* **GET** `/api/superadmin/soporte/mensajes`
* **POST** `/api/superadmin/soporte/mensajes`

## 6. Sistema y Seguridad
* **GET** `/api/superadmin/seguridad/usuarios/{id}`
* **PUT** `/api/superadmin/seguridad/usuarios/{id}`
* **DELETE** `/api/superadmin/seguridad/usuarios/{id}`
* **GET** `/api/superadmin/seguridad/usuarios`
* **POST** `/api/superadmin/seguridad/usuarios`
* **GET** `/api/superadmin/seguridad/actividades/usuarios/{superadminId}`
* **POST** `/api/superadmin/seguridad/actividades/usuarios/{superadminId}`
* **GET** `/api/superadmin/seguridad/actividades`

---

# Panel Administrador

## 0. Autenticación y Selector de Sede
* **POST** `/api/auth/admin/login`
* **POST** `/api/auth/storefront/login`

## 1. Tablero/Dashboard
*(No hay endpoints específicos de dashboard en la lista)*

## 2. Gestión de Clientes
* **GET** `/api/admin/tiendas/{tiendaId}/clientes/{clienteId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/clientes/{clienteId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/clientes/{clienteId}`
* **GET** `/api/admin/tiendas/{tiendaId}/clientes`
* **POST** `/api/admin/tiendas/{tiendaId}/clientes`
* **GET** `/api/admin/tiendas/{tiendaId}/clientes/buscar`
* **GET** `/api/admin/tiendas/{tiendaId}/clientes/{clienteId}/direcciones/{direccionId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/clientes/{clienteId}/direcciones/{direccionId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/clientes/{clienteId}/direcciones/{direccionId}`
* **GET** `/api/admin/tiendas/{tiendaId}/clientes/{clienteId}/direcciones`
* **POST** `/api/admin/tiendas/{tiendaId}/clientes/{clienteId}/direcciones`

## 3. Gestión de Ventas y Pedidos
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/pedidos`
* **POST** `/api/admin/tiendas/{tiendaId}/ventas/pedidos`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detalleId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detalleId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detalleId}`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles`
* **POST** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detallePedidoId}/personalizacion`
* **PUT** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detallePedidoId}/personalizacion`
* **POST** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detallePedidoId}/personalizacion`
* **DELETE** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detallePedidoId}/personalizacion`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/pagos/{pagoId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/pagos/{pagoId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/pagos/{pagoId}`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/pagos`
* **POST** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/pagos`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/direcciones/{direccionId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/direcciones/{direccionId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/direcciones/{direccionId}`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/direcciones`
* **POST** `/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/direcciones`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/cajas/{cajaId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/ventas/cajas/{cajaId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/ventas/cajas/{cajaId}`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/cajas`
* **POST** `/api/admin/tiendas/{tiendaId}/ventas/cajas`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionId}`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/sesiones-caja`
* **POST** `/api/admin/tiendas/{tiendaId}/ventas/sesiones-caja`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionCajaId}/movimientos/{movimientoId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionCajaId}/movimientos/{movimientoId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionCajaId}/movimientos/{movimientoId}`
* **GET** `/api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionCajaId}/movimientos`
* **POST** `/api/admin/tiendas/{tiendaId}/ventas/sesiones-caja/{sesionCajaId}/movimientos`

## 4. Gestión de Producción y Recetas
* **GET** `/api/admin/tiendas/{tiendaId}/produccion/recetas/{recetaId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/produccion/recetas/{recetaId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/produccion/recetas/{recetaId}`
* **GET** `/api/admin/tiendas/{tiendaId}/produccion/recetas`
* **POST** `/api/admin/tiendas/{tiendaId}/produccion/recetas`
* **GET** `/api/admin/tiendas/{tiendaId}/produccion/stock-ideal/{stockId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/produccion/stock-ideal/{stockId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/produccion/stock-ideal/{stockId}`
* **GET** `/api/admin/tiendas/{tiendaId}/produccion/stock-ideal`
* **POST** `/api/admin/tiendas/{tiendaId}/produccion/stock-ideal`

## 5. Gestión de Inventario e Insumos
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/productos/{id}`
* **PUT** `/api/admin/tiendas/{tiendaId}/inventario/productos/{id}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/inventario/productos/{id}`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/productos`
* **POST** `/api/admin/tiendas/{tiendaId}/inventario/productos`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/productos/sede/{sedeId}`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/productos/sede/{sedeId}/bajo-stock`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/insumos/{id}`
* **PUT** `/api/admin/tiendas/{tiendaId}/inventario/insumos/{id}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/inventario/insumos/{id}`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/insumos`
* **POST** `/api/admin/tiendas/{tiendaId}/inventario/insumos`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/insumos/sede/{sedeId}`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/insumos/sede/{sedeId}/bajo-stock`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/transferencias/{id}`
* **PUT** `/api/admin/tiendas/{tiendaId}/inventario/transferencias/{id}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/inventario/transferencias/{id}`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/transferencias`
* **POST** `/api/admin/tiendas/{tiendaId}/inventario/transferencias`
* **PATCH** `/api/admin/tiendas/{tiendaId}/inventario/transferencias/{id}/estado`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/transferencias/estado/{estado}`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/productos`
* **POST** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/productos`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/{id}`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/sede/{sedeId}`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/sede/{sedeId}/producto/{productoId}`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/sede/{sedeId}/paginado`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/rango-fechas`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos`
* **POST** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos/{id}`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos/sede/{sedeId}`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos/sede/{sedeId}/paginado`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos/sede/{sedeId}/insumo/{insumoId}`
* **GET** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos/rango-fechas`

## 6. Gestión de Compras y Proveedores
* **GET** `/api/admin/tiendas/{tiendaId}/compras/proveedores/{proveedorId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/compras/proveedores/{proveedorId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/compras/proveedores/{proveedorId}`
* **GET** `/api/admin/tiendas/{tiendaId}/compras/proveedores`
* **POST** `/api/admin/tiendas/{tiendaId}/compras/proveedores`
* **GET** `/api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenId}`
* **GET** `/api/admin/tiendas/{tiendaId}/compras/ordenes`
* **POST** `/api/admin/tiendas/{tiendaId}/compras/ordenes`
* **PATCH** `/api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenId}/estado`
* **GET** `/api/admin/tiendas/{tiendaId}/compras/ordenes/pendientes`
* **GET** `/api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles/{detalleId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles/{detalleId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles/{detalleId}`
* **GET** `/api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles`
* **POST** `/api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles`
* **PATCH** `/api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles/{detalleId}/recepcion`
* **GET** `/api/admin/tiendas/{tiendaId}/compras/insumos/{insumoId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/compras/insumos/{insumoId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/compras/insumos/{insumoId}`
* **GET** `/api/admin/tiendas/{tiendaId}/compras/insumos`
* **POST** `/api/admin/tiendas/{tiendaId}/compras/insumos`

## 7. Facturación y SUNAT
* **GET** `/api/admin/tiendas/{tiendaId}/facturacion/series/{serieId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/facturacion/series/{serieId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/facturacion/series/{serieId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/facturacion/series/{serieId}/activar`
* **GET** `/api/admin/tiendas/{tiendaId}/facturacion/series`
* **POST** `/api/admin/tiendas/{tiendaId}/facturacion/series`
* **POST** `/api/admin/tiendas/{tiendaId}/facturacion/series/{serieId}/incrementar-correlativo`
* **GET** `/api/admin/tiendas/{tiendaId}/facturacion/series/tipo/{tipoComprobante}`
* **GET** `/api/admin/tiendas/{tiendaId}/facturacion/series/sede/{sedeId}`
* **GET** `/api/admin/tiendas/{tiendaId}/facturacion/series/activas`
* **GET** `/api/admin/tiendas/{tiendaId}/facturacion/comprobantes/{comprobanteId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/facturacion/comprobantes/{comprobanteId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/facturacion/comprobantes/{comprobanteId}`
* **GET** `/api/admin/tiendas/{tiendaId}/facturacion/comprobantes`
* **POST** `/api/admin/tiendas/{tiendaId}/facturacion/comprobantes`
* **POST** `/api/admin/tiendas/{tiendaId}/facturacion/comprobantes/{comprobanteId}/enviar-sunat`
* **PATCH** `/api/admin/tiendas/{tiendaId}/facturacion/comprobantes/{comprobanteId}/estado-sunat`
* **GET** `/api/admin/tiendas/{tiendaId}/facturacion/comprobantes/pedido/{pedidoId}`

## 8. Catálogo de Productos y Categorías
* **GET** `/api/admin/tiendas/{tiendaId}/catalogo/productos/{productoId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/catalogo/productos/{productoId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/catalogo/productos/{productoId}`
* **GET** `/api/admin/tiendas/{tiendaId}/catalogo/productos`
* **POST** `/api/admin/tiendas/{tiendaId}/catalogo/productos`
* **GET** `/api/admin/tiendas/{tiendaId}/catalogo/categorias/{categoriaId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/catalogo/categorias/{categoriaId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/catalogo/categorias/{categoriaId}`
* **GET** `/api/admin/tiendas/{tiendaId}/catalogo/categorias`
* **POST** `/api/admin/tiendas/{tiendaId}/catalogo/categorias`
* **GET** `/api/admin/tiendas/{tiendaId}/paginas-storefront/{paginaId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/paginas-storefront/{paginaId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/paginas-storefront/{paginaId}`
* **GET** `/api/admin/tiendas/{tiendaId}/paginas-storefront`
* **POST** `/api/admin/tiendas/{tiendaId}/paginas-storefront`
* **GET** `/api/admin/tiendas/{tiendaId}/paginas-storefront/buscar`

## 9. Reportes
*(Los endpoints de movimientos de inventario también pueden considerarse parte de reportes, pero ya están clasificados en Inventario)*

## 10. Seguridad
* **GET** `/api/admin/tiendas/{tiendaId}/seguridad/usuarios/{usuarioId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/seguridad/usuarios/{usuarioId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/seguridad/usuarios/{usuarioId}`
* **GET** `/api/admin/tiendas/{tiendaId}/seguridad/usuarios`
* **POST** `/api/admin/tiendas/{tiendaId}/seguridad/usuarios`
* **GET** `/api/admin/tiendas/{tiendaId}/seguridad/usuarios/{usuarioId}/sedes`
* **POST** `/api/admin/tiendas/{tiendaId}/seguridad/usuarios/{usuarioId}/sedes`
* **DELETE** `/api/admin/tiendas/{tiendaId}/seguridad/usuarios/{usuarioId}/sedes/{sedeId}`
* **GET** `/api/admin/tiendas/{tiendaId}/seguridad/roles/{rolId}`
* **PUT** `/api/admin/tiendas/{tiendaId}/seguridad/roles/{rolId}`
* **DELETE** `/api/admin/tiendas/{tiendaId}/seguridad/roles/{rolId}`
* **GET** `/api/admin/tiendas/{tiendaId}/seguridad/roles`
* **POST** `/api/admin/tiendas/{tiendaId}/seguridad/roles`
* **GET** `/api/admin/tiendas/{tiendaId}/seguridad/auditoria`
* **GET** `/api/admin/tiendas/{tiendaId}/seguridad/auditoria/usuario/{usuarioId}`
* **GET** `/api/admin/tiendas/{tiendaId}/seguridad/auditoria/rango`
* **GET** `/api/admin/seguridad/permisos`

## 11. Configuración
* **GET** `/api/admin/tiendas/{tiendaId}/configuracion`
* **PUT** `/api/admin/tiendas/{tiendaId}/configuracion`