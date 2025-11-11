# V9 – Vistas de Reporte y Optimizaciones (2025-10-08)

**Completado**

- Se crearon 6 vistas analíticas para reportes:
  1. **vw_resumen_venta_pago**: Desglose de pagos por método en cada venta.
  2. **vw_pedido_totales**: Totales, pagos y saldo pendiente de pedidos.
  3. **vw_plan_produccion_progreso**: Progreso de planes con porcentaje de completado.
  4. **vw_inventario_alertas**: Alertas de stock con sugerencias de producción.
  5. **vw_ventas_diarias**: Resumen diario con métricas clave (ticket promedio, total).
  6. **vw_productos_top_ventas**: Top productos de últimos 30 días.
- Se agregaron 3 índices adicionales de optimización.

**Mejoras aplicadas**

- **Vistas materializadas virtuales**: Simplifica queries complejas en aplicación.
- **Agregaciones eficientes**: Uso de `FILTER` para sumar por condición.
- **Cálculos automáticos**: Porcentajes, promedios, saldos.
- **Alertas inteligentes**: Estados de stock (CRÍTICO, BAJO, REABASTECER, OK).
- **Ventana de tiempo**: Top ventas de últimos 30 días.
- **Índices parciales**: Solo indexan registros relevantes (estados específicos).

**Casos de uso de las vistas**

**1. vw_resumen_venta_pago**

- Dashboard de caja: Ver métodos de pago por venta.
- Cierre de caja: Cuadre de efectivo vs digitales.
- Reportes contables: Desglose de ingresos por método.

**2. vw_pedido_totales**

- Lista de pedidos pendientes con saldo.
- Control de adelantos y pagos parciales.
- Alertas de pedidos sin pagar completos.

**3. vw_plan_produccion_progreso**

- Dashboard de producción en tiempo real.
- Reporte de eficiencia de cumplimiento.
- Planificación de recursos por avance.

**4. vw_inventario_alertas**

- Alertas automáticas de stock bajo.
- Sugerencias de cantidad a producir.
- Planificación preventiva de producción.

**5. vw_ventas_diarias**

- Reportes gerenciales diarios.
- Comparación de sedes.
- Análisis de tendencias de venta.

**6. vw_productos_top_ventas**

- Análisis de popularidad de productos.
- Decisiones de producción basadas en demanda.
- Estrategias de marketing y promociones.

**Índices de optimización**

- **idx_venta_fecha_estado**: Acelera reportes de ventas por periodo.
- **idx_pedido_estado_entrega**: Optimiza lista de pedidos activos.
- **idx_inventario_stock_critico**: Búsqueda rápida de productos con stock bajo.

**Performance**

- Vistas calculan en tiempo de consulta (no materializadas).
- Para dashboards de alta frecuencia, considerar materializar.
- Índices parciales reducen tamaño y mejoran velocidad.

**Siguiente**

- V10: Configurar Flyway en application.properties.
