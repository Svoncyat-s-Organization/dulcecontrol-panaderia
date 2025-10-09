# V5 – Tablas Operacionales - POS y Ventas (2025-10-08)

**Completado**

- Se crearon 4 tablas para el sistema de punto de venta (POS):
  1. **caja_sesion**: Control de apertura/cierre de caja por turno.
  2. **venta**: Registro de ventas con comprobantes y estado SUNAT.
  3. **venta_item**: Líneas de detalle con cálculo automático de totales.
  4. **pago_venta**: Registros de pago (soporta pagos mixtos).

**Mejoras aplicadas**

- **Índice único parcial** que garantiza una sola caja abierta por sede.
- **Índice único compuesto** para evitar duplicación de comprobantes.
- **Triggers automáticos** para cálculo de totales:
  - `calcular_total_item_venta`: Calcula total por línea antes de guardar.
  - `recalcular_totales_venta`: Actualiza subtotal, impuesto y total de la venta.
- **Validaciones de negocio**:
  - Montos no negativos en caja y ventas.
  - Fecha de cierre >= fecha de apertura.
  - Comprobantes completos o nulos (no parciales).
  - Estados de venta y SUNAT con valores controlados.
- **Pagos mixtos**: Una venta puede tener múltiples métodos de pago.
- **Moneda fija**: Solo PEN (soles peruanos).
- **ON DELETE RESTRICT** en usuario y sede (no eliminar si hay ventas).
- **ON DELETE CASCADE** en items y pagos (limpieza automática al eliminar venta).

**Flujo operacional**

1. Usuario abre caja (caja_sesion) con monto inicial.
2. Se registran ventas asociadas a la sesión de caja.
3. Cada venta tiene items (productos vendidos).
4. Los totales se calculan automáticamente al agregar/modificar items.
5. Se registran pagos (efectivo, Yape, Plin, tarjeta).
6. Al cerrar turno, se cierra la sesión con monto final.

**Integraciones futuras**

- Estado SUNAT preparado para facturación electrónica.
- Tipos de comprobante (boleta, factura, ticket).

**Siguiente**

- V6: Crear sistema de pedidos personalizados (online y local).
