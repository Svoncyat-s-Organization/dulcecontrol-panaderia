# V2 – Funciones Utilitarias y Triggers (2025-10-08)

**Completado**

- Se implementaron 5 funciones PL/pgSQL para automatización y validaciones:
  1. **set_updated_at**: Actualiza automáticamente `actualizado_en` en cada UPDATE.
  2. **calcular_total_item_venta**: Calcula el total de un item de venta validando que no sea negativo.
  3. **recalcular_totales_venta**: Recalcula subtotal, impuesto y total cuando cambian los items.
  4. **validar_cambio_estado_pedido**: Implementa máquina de estados para el flujo de pedidos.
  5. **plan_item_autocompletar**: Marca automáticamente items completados en producción.

**Mejoras aplicadas**

- Validaciones robustas con mensajes de error descriptivos.
- Máquina de estados para pedidos evita transiciones inválidas.
- Cálculos automáticos eliminan inconsistencias en totales de venta.
- Manejo de casos NULL con COALESCE para mayor seguridad.

**Transiciones de estado de pedidos permitidas**

- `pendiente` → `en_preparacion` o `anulado`
- `en_preparacion` → `listo` o `anulado`
- `listo` → `entregado` o `anulado`
- `entregado` y `anulado` son estados finales

**Siguiente**

- V3: Crear tablas core de organización (sede, rol, permiso, usuario).
