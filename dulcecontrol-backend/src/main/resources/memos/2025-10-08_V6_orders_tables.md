# V6 – Sistema de Pedidos (2025-10-08)

**Completado**

- Se crearon 5 tablas para gestión de pedidos personalizados:
  1. **pedido**: Pedidos con máquina de estados y soporte local/online.
  2. **pedido_item**: Productos del pedido con precios y cantidades.
  3. **pago_pedido**: Pagos parciales y adelantos (pagos mixtos).
  4. **pedido_adjunto**: Archivos adjuntos (diseños, referencias, fotos).
  5. **pedido_entrega**: Datos de retiro o delivery con validaciones.

**Mejoras aplicadas**

- **Máquina de estados** validada por trigger (ver V2):
  - pendiente → en_preparacion → listo → entregado
  - Cualquier estado puede pasar a anulado (excepto entregado).
- **Doble origen**: Pedidos locales (en tienda) y online (web/app).
- **Pagos online**: Estado de pago para integraciones con pasarelas.
- **Pagos parciales**: Un pedido puede tener múltiples pagos registrados.
- **Adjuntos**: Soporte para diseños personalizados de tortas/pasteles.
- **Validación de entrega**:
  - Retiro: sin dirección.
  - Delivery: dirección obligatoria + costo de envío.
- **Validación de fecha**: Fecha de entrega no puede ser en el pasado.
- **Índices optimizados** para búsquedas por estado, sede y fecha.

**Flujo de pedido online**

1. Cliente crea pedido desde web/app (origen = 'online').
2. Puede adjuntar diseños o referencias visuales.
3. Sistema registra intento de pago online.
4. Si pago exitoso, estado pasa a 'pendiente'.
5. Personal cambia estados según avanza la preparación.
6. Cliente recoge (retiro) o se envía (delivery).

**Flujo de pedido local**

1. Cliente solicita en tienda (origen = 'local').
2. Personal registra pedido con items y observaciones.
3. Cliente puede hacer pagos parciales (adelanto).
4. Se completa preparación y entrega.
5. Cliente paga saldo pendiente al recoger.

**Siguiente**

- V7: Crear tablas de planificación de producción (conteos, planes).
