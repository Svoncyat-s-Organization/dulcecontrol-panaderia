# V7 – Sistema de Planificación de Producción (2025-10-08)

**Completado**

- Se crearon 4 tablas para planificación y seguimiento de producción:
  1. **conteo_matutino**: Registro de conteos de inventario al inicio del día.
  2. **conteo_matutino_item**: Detalle de productos contados.
  3. **plan_produccion**: Plan de producción diario por sede.
  4. **plan_produccion_item**: Items del plan con seguimiento de avance.

**Mejoras aplicadas**

- **Restricción única** por sede y fecha en conteos y planes.
- **Trigger automático** para marcar items como completados:
  - Se activa cuando `cantidad_completada >= cantidad_objetivo`.
  - Evita inconsistencias en el estado de completado.
- **Estado de confirmación** en planes para aprobar antes de ejecutar.
- **Trazabilidad**: Usuario que genera el plan y timestamp de creación.
- **ON DELETE CASCADE** en items para limpieza automática.
- **ON DELETE RESTRICT** en productos/usuarios para mantener historial.
- **Índices optimizados** para búsquedas por fecha, sede y estado.

**Flujo de operación diaria**

1. **Conteo matutino** (6:00 AM):

   - Panaderos cuentan stock existente de productos.
   - Registran cantidades en `conteo_matutino_item`.
   - Útil para detectar mermas o discrepancias.

2. **Generación de plan** (7:00 AM):

   - Sistema o supervisor crea `plan_produccion`.
   - Define cantidades objetivo por producto basándose en:
     - Stock actual (del conteo).
     - Stock ideal (de `inventario_config`).
     - Pedidos pendientes del día.
     - Histórico de ventas.
   - Plan se marca como `confirmado = TRUE` para autorizar.

3. **Seguimiento de producción** (durante el día):
   - Panaderos actualizan `cantidad_completada` conforme producen.
   - Campo `completado` se marca automáticamente por trigger.
   - Supervisores monitorean avance en tiempo real.

**Ventajas del sistema**

- Elimina producción excesiva (desperdicio).
- Evita faltantes (stock out).
- Permite ajustes dinámicos durante el día.
- Genera histórico para análisis de eficiencia.

**Siguiente**

- V8: Crear tablas de compras y gastos (proveedores, insumos).
