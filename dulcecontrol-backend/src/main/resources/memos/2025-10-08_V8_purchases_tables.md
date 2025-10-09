# V8 – Sistema de Compras y Gastos (2025-10-08)

**Completado**

- Se crearon 4 tablas para gestión de compras y gastos:
  1. **proveedor**: Registro de proveedores con RUC y datos de contacto.
  2. **compra**: Órdenes de compra de insumos con estado.
  3. **compra_insumo_item**: Detalle de insumos por compra con costos.
  4. **gasto**: Registro de gastos operativos categorizados.

**Mejoras aplicadas**

- **Búsqueda trigram** en razón social de proveedores.
- **RUC indexado** para búsqueda rápida de proveedores peruanos.
- **Email CITEXT** case-insensitive para proveedores.
- **Estados de compra**: Registrada (activa) o Anulada (cancelada/devuelta).
- **Validaciones de montos** no negativos en compras y gastos.
- **Costos por compra**: Cada item guarda el costo pagado en esa compra específica.
- **Categorización de gastos**: Permite análisis por tipo de gasto.
- **Comprobantes opcionales**: Soporte para gastos sin comprobante formal.
- **ON DELETE RESTRICT** en insumos para proteger histórico.
- **ON DELETE CASCADE** en items al eliminar compra.
- **ON DELETE SET NULL** en proveedor para mantener histórico de compras.

**Modelo de datos**

- Una compra puede incluir múltiples insumos.
- Cada insumo puede tener diferentes costos en distintas compras.
- Los gastos son registros independientes (no relacionados con compras).
- Gastos pueden ser con o sin comprobante según categoría.

**Categorías de gastos sugeridas**

- Servicios (luz, agua, internet, teléfono)
- Alquiler
- Mantenimiento
- Publicidad
- Transporte
- Limpieza
- Seguridad
- Otros

**Flujo de compra**

1. Se registra una `compra` asociada a un proveedor.
2. Se agregan `compra_insumo_item` con cantidades y costos.
3. Subtotal, impuesto y total se calculan en aplicación.
4. Compra puede anularse si hay devolución o error.

**Análisis financiero**

- Histórico de costos por insumo y proveedor.
- Análisis de gastos por categoría y periodo.
- Control de egresos por sede.

**Siguiente**

- V9: Crear vistas de reporte y optimizaciones adicionales.
