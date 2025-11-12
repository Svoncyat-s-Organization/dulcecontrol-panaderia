# Módulo de Inventario - DulceControl

## Descripción
Módulo completo para la gestión de inventario de insumos y productos terminados, incluyendo transferencias entre sedes y trazabilidad de movimientos.

## Estructura del Módulo

```
inventario/
├── entity/
│   ├── enums/
│   │   ├── TipoMovimientoInsumo.java
│   │   ├── MotivoMovimientoProducto.java
│   │   └── EstadoTransferencia.java
│   ├── InventarioInsumoSede.java
│   ├── InventarioProducto.java
│   ├── TransferenciaInventario.java
│   ├── ItemTransferencia.java
│   ├── MovimientoInventarioInsumo.java
│   └── MovimientoInventarioProducto.java
├── repository/
│   ├── InventarioInsumoSedeRepository.java
│   ├── InventarioProductoRepository.java
│   ├── TransferenciaInventarioRepository.java
│   ├── ItemTransferenciaRepository.java
│   ├── MovimientoInventarioInsumoRepository.java
│   └── MovimientoInventarioProductoRepository.java
├── service/
│   ├── IInventarioInsumoSedeService.java
│   ├── IInventarioProductoService.java
│   ├── ITransferenciaInventarioService.java
│   ├── IMovimientoInventarioInsumoService.java
│   ├── IMovimientoInventarioProductoService.java
│   └── impl/
│       ├── InventarioInsumoSedeService.java
│       ├── InventarioProductoService.java
│       ├── TransferenciaInventarioService.java
│       ├── MovimientoInventarioInsumoService.java
│       └── MovimientoInventarioProductoService.java
└── controller/
    ├── dto/
    │   ├── InventarioInsumoSedeDTO.java
    │   ├── InventarioProductoDTO.java
    │   ├── TransferenciaInventarioDTO.java
    │   ├── ItemTransferenciaDTO.java
    │   ├── MovimientoInventarioInsumoDTO.java
    │   └── MovimientoInventarioProductoDTO.java
    ├── InventarioInsumoSedeController.java
    ├── InventarioProductoController.java
    ├── TransferenciaInventarioController.java
    ├── MovimientoInventarioInsumoController.java
    └── MovimientoInventarioProductoController.java
```

## Entidades

### 1. InventarioInsumoSede
Almacena las existencias actuales de insumos (materias primas) por sede.
- Cantidad con precisión decimal (12,4)
- Ubicación física en almacén
- Unique constraint por (sede_id, insumo_id)

### 2. InventarioProducto
Almacena las existencias actuales de productos terminados por sede.
- Cantidad entera
- Ubicación física (vitrina, refrigerador, etc.)
- Unique constraint por (sede_id, producto_id)

### 3. TransferenciaInventario
Gestiona las transferencias de inventario entre sedes.
- Estados: pendiente, en_transito, recibido, cancelado
- Soft delete (cancelado)
- Trazabilidad completa con usuarios y fechas

### 4. ItemTransferencia
Detalle de los items transferidos (insumos o productos).
- Validación: debe tener insumo_id O producto_id, no ambos
- Cantidades enviadas y recibidas

### 5. MovimientoInventarioInsumo
Historial de todos los movimientos de insumos.
- Tipos: ENTRADA_COMPRA, SALIDA_PRODUCCION, TRANSFERENCIA, AJUSTE, MERMA, etc.
- Cantidades anterior, movimiento y posterior
- Referencias a orden de compra, plan de producción, transferencia

### 6. MovimientoInventarioProducto
Historial de todos los movimientos de productos.
- Motivos: produccion, venta, merma, ajuste, transferencia, devolucion
- Cantidades anterior, movimiento y posterior
- Referencias a pedido, plan de producción

## Endpoints API

### Inventario de Insumos
**Base URL:** `/api/admin/inventario/insumos`

- `GET /` - Obtener todos los inventarios de insumos
- `GET /{id}` - Obtener por ID
- `GET /tienda/{tiendaId}` - Obtener por tienda
- `GET /sede/{sedeId}` - Obtener por sede
- `GET /sede/{sedeId}/insumo/{insumoId}` - Obtener inventario específico
- `GET /sede/{sedeId}/bajo?cantidadMinima=10.0` - Obtener insumos con stock bajo
- `POST /` - Crear nuevo inventario
- `PUT /{id}` - Actualizar inventario
- `DELETE /{id}` - Eliminar inventario

### Inventario de Productos
**Base URL:** `/api/admin/inventario/productos`

- `GET /` - Obtener todos los inventarios de productos
- `GET /{id}` - Obtener por ID
- `GET /tienda/{tiendaId}` - Obtener por tienda
- `GET /sede/{sedeId}` - Obtener por sede
- `GET /sede/{sedeId}/producto/{productoId}` - Obtener inventario específico
- `GET /sede/{sedeId}/bajo?cantidadMinima=5` - Obtener productos con stock bajo
- `GET /sede/{sedeId}/agotados` - Obtener productos agotados
- `POST /` - Crear nuevo inventario
- `PUT /{id}` - Actualizar inventario
- `DELETE /{id}` - Eliminar inventario

### Transferencias
**Base URL:** `/api/admin/inventario/transferencias`

- `GET /` - Obtener todas las transferencias
- `GET /{id}` - Obtener por ID (incluye items)
- `GET /tienda/{tiendaId}` - Obtener por tienda
- `GET /sede/{sedeId}` - Obtener por sede (origen o destino)
- `GET /estado/{estado}` - Obtener por estado (pendiente, en_transito, recibido)
- `GET /rango-fechas?fechaInicio=...&fechaFin=...` - Obtener por rango de fechas
- `POST /` - Crear nueva transferencia (incluir items)
- `PUT /{id}` - Actualizar transferencia
- `PATCH /{id}/estado?nuevoEstado=...` - Cambiar estado
- `PATCH /{id}/autorizar?autorizadoPor=...` - Autorizar y enviar transferencia
- `PATCH /{id}/recibir?recibidoPor=...` - Confirmar recepción
- `DELETE /{id}` - Cancelar transferencia (soft delete)

### Movimientos de Insumos
**Base URL:** `/api/admin/inventario/movimientos/insumos`

- `GET /` - Obtener todos los movimientos
- `GET /{id}` - Obtener por ID
- `GET /tienda/{tiendaId}` - Obtener por tienda
- `GET /sede/{sedeId}` - Obtener por sede
- `GET /insumo/{insumoId}` - Obtener por insumo
- `GET /sede/{sedeId}/insumo/{insumoId}` - Obtener historial específico
- `GET /tienda/{tiendaId}/tipo/{tipoMovimiento}` - Filtrar por tipo
- `GET /rango-fechas?fechaInicio=...&fechaFin=...` - Obtener por rango de fechas
- `POST /` - Registrar nuevo movimiento

### Movimientos de Productos
**Base URL:** `/api/admin/inventario/movimientos/productos`

- `GET /` - Obtener todos los movimientos
- `GET /{id}` - Obtener por ID
- `GET /tienda/{tiendaId}` - Obtener por tienda
- `GET /sede/{sedeId}` - Obtener por sede
- `GET /producto/{productoId}` - Obtener por producto
- `GET /sede/{sedeId}/producto/{productoId}` - Obtener historial específico
- `GET /tienda/{tiendaId}/motivo/{motivo}` - Filtrar por motivo
- `GET /rango-fechas?fechaInicio=...&fechaFin=...` - Obtener por rango de fechas
- `POST /` - Registrar nuevo movimiento

## Características Implementadas

### ✅ CRUD Completo
- Todos los endpoints con métodos GET, POST, PUT, DELETE
- Validaciones a nivel de entidad

### ✅ Soft Delete
- TransferenciaInventario usa soft delete (estado = 'cancelado')
- Anotaciones @SQLDelete y @SQLRestriction

### ✅ Consultas Avanzadas
- Filtros por tienda, sede, estado
- Búsqueda por rangos de fechas
- Detección de inventario bajo/agotado
- Queries personalizadas con @Query

### ✅ Trazabilidad
- Registro de cantidades anterior/posterior en movimientos
- Seguimiento de usuarios responsables
- Timestamps automáticos
- Referencias cruzadas (orden_compra_id, plan_produccion_id, etc.)

### ✅ Gestión de Transferencias
- Workflow completo: pendiente → en_transito → recibido
- Endpoints específicos para autorizar y recibir
- Validación de items (insumo XOR producto)
- Inclusión automática de items al consultar transferencia

## DTOs

Todos los DTOs están en el paquete `controller.dto`:
- **InventarioInsumoSedeDTO** - Mapea entidad InventarioInsumoSede
- **InventarioProductoDTO** - Mapea entidad InventarioProducto
- **TransferenciaInventarioDTO** - Incluye lista de ItemTransferenciaDTO
- **ItemTransferenciaDTO** - Items individuales de transferencia
- **MovimientoInventarioInsumoDTO** - Historial de movimientos de insumos
- **MovimientoInventarioProductoDTO** - Historial de movimientos de productos

## Enums

### TipoMovimientoInsumo
```java
ENTRADA_COMPRA, SALIDA_PRODUCCION, ENTRADA_TRANSFERENCIA, 
SALIDA_TRANSFERENCIA, AJUSTE_POSITIVO, AJUSTE_NEGATIVO, 
MERMA, DEVOLUCION
```

### MotivoMovimientoProducto
```java
produccion, venta, merma, ajuste, transferencia, devolucion
```

### EstadoTransferencia
```java
pendiente, en_transito, recibido, cancelado
```

## Ejemplo de Uso

### Crear Transferencia con Items
```json
POST /api/admin/inventario/transferencias
{
  "tiendaId": 1,
  "sedeOrigenId": 1,
  "sedeDestinoId": 2,
  "solicitadoPor": 5,
  "observaciones": "Transferencia de harina por stock bajo",
  "items": [
    {
      "insumoId": 1,
      "cantidadEnviada": 50.0
    },
    {
      "insumoId": 2,
      "cantidadEnviada": 30.0
    }
  ]
}
```

### Autorizar Transferencia
```http
PATCH /api/admin/inventario/transferencias/1/autorizar?autorizadoPor=3
```

### Recibir Transferencia
```http
PATCH /api/admin/inventario/transferencias/1/recibir?recibidoPor=7
```

### Consultar Inventario Bajo
```http
GET /api/admin/inventario/insumos/sede/1/bajo?cantidadMinima=10.0
```

### Consultar Productos Agotados
```http
GET /api/admin/inventario/productos/sede/1/agotados
```

## Notas Técnicas

1. **Transaccionalidad**: Todos los métodos de servicio usan `@Transactional`
2. **Validación**: Las entidades validan constraints en @PrePersist/@PreUpdate
3. **Conversión DTO**: Métodos privados en servicios para mapeo entidad ↔ DTO
4. **Lombok**: Uso de @Data, @RequiredArgsConstructor para reducir boilerplate
5. **Spring Data JPA**: Queries derivadas y personalizadas con @Query

## Próximos Pasos Sugeridos

1. Agregar validaciones con `@Valid` y Bean Validation
2. Implementar manejo de excepciones personalizado
3. Agregar paginación con `Pageable` en endpoints GET
4. Implementar endpoints de reportes/estadísticas
5. Agregar auditoría con Spring Data JPA Auditing
6. Considerar DTOs separados para Request/Response
7. Implementar eventos de dominio para movimientos automáticos
