# Módulo de Inventario - DulceControl

## Descripción General

El módulo de inventario gestiona el control de existencias tanto de insumos (materias primas) como de productos terminados en un sistema **multi-tenant** y **multi-sede**. Permite realizar seguimiento en tiempo real de las cantidades disponibles, registrar movimientos de inventario, y gestionar transferencias entre sedes.

## Arquitectura

El módulo sigue una arquitectura en capas:

```
feature/admin/inventario/
├── controller/           # Controladores REST (API endpoints)
│   ├── dto/             # DTOs para request/response
│   ├── InventarioInsumoSedeController.java
│   ├── InventarioProductoController.java
│   ├── TransferenciaInventarioController.java
│   ├── MovimientoInventarioInsumoController.java
│   └── MovimientoInventarioProductoController.java
├── entity/              # Entidades JPA (modelo de datos)
│   ├── enums/           # Enumeraciones
│   ├── InventarioInsumoSede.java
│   ├── InventarioProducto.java
│   ├── TransferenciaInventario.java
│   ├── ItemTransferencia.java
│   ├── MovimientoInventarioInsumo.java
│   └── MovimientoInventarioProducto.java
├── repository/          # Repositorios JPA (acceso a datos)
├── service/             # Interfaces de servicios
│   └── impl/           # Implementaciones de servicios
└── README.md
```

## Entidades Principales

### 1. InventarioInsumoSede
Representa el inventario de insumos (materias primas) por sede.

**Campos principales:**
- `tiendaId`: ID de la tienda (multi-tenant)
- `sedeId`: ID de la sede (multi-sede)
- `insumoId`: ID del insumo
- `cantidadActual`: Cantidad disponible (BigDecimal)
- `ubicacionFisica`: Ubicación física del insumo

### 2. InventarioProducto
Representa el inventario de productos terminados por sede.

**Campos principales:**
- `tiendaId`: ID de la tienda
- `sedeId`: ID de la sede
- `productoId`: ID del producto
- `cantidadActual`: Cantidad disponible (Integer)
- `ubicacionFisica`: Ubicación física del producto

### 3. TransferenciaInventario
Gestiona las transferencias de inventario entre sedes.

**Estados:**
- `PENDIENTE`: Transferencia solicitada
- `EN_TRANSITO`: Transferencia enviada
- `RECIBIDO`: Transferencia recibida
- `CANCELADO`: Transferencia cancelada (soft delete)

**Campos principales:**
- `sedeOrigenId`: Sede de origen
- `sedeDestinoId`: Sede de destino
- `estado`: Estado actual de la transferencia
- `items`: Lista de items a transferir

### 4. MovimientoInventarioInsumo / MovimientoInventarioProducto
Registra todos los movimientos de inventario para auditoría y trazabilidad.

**Tipos de Movimiento:**
- `ENTRADA`: Ingreso de stock
- `SALIDA`: Salida de stock
- `AJUSTE`: Ajuste de inventario
- `TRANSFERENCIA`: Transferencia entre sedes

## Endpoints API

### Inventario de Insumos

**Base URL:** `/api/admin/tiendas/{tiendaId}/inventario/insumos`

- `GET /` - Listar todo el inventario de insumos de la tienda
- `GET /sede/{sedeId}` - Listar inventario de una sede específica
- `GET /sede/{sedeId}/bajo-stock?cantidadMinima=10` - Listar insumos con bajo stock
- `GET /{id}` - Obtener un inventario específico
- `POST /` - Crear nuevo registro de inventario
- `PUT /{id}` - Actualizar inventario
- `DELETE /{id}` - Eliminar inventario

### Inventario de Productos

**Base URL:** `/api/admin/tiendas/{tiendaId}/inventario/productos`

- `GET /` - Listar todo el inventario de productos de la tienda
- `GET /sede/{sedeId}` - Listar inventario de una sede específica
- `GET /sede/{sedeId}/bajo-stock?cantidadMinima=5` - Listar productos con bajo stock
- `GET /{id}` - Obtener un inventario específico
- `POST /` - Crear nuevo registro de inventario
- `PUT /{id}` - Actualizar inventario
- `DELETE /{id}` - Eliminar inventario

### Transferencias

**Base URL:** `/api/admin/tiendas/{tiendaId}/inventario/transferencias`

- `GET /` - Listar todas las transferencias
- `GET /estado/{estado}` - Listar transferencias por estado
- `GET /{id}` - Obtener una transferencia específica
- `POST /` - Crear nueva transferencia
- `PUT /{id}` - Actualizar transferencia (solo si está PENDIENTE)
- `PATCH /{id}/estado?nuevoEstado=EN_TRANSITO` - Cambiar estado de transferencia
- `DELETE /{id}` - Cancelar transferencia (soft delete)

### Movimientos de Inventario (Insumos)

**Base URL:** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos`

- `GET /` - Listar todos los movimientos
- `GET /sede/{sedeId}` - Listar movimientos de una sede
- `GET /sede/{sedeId}/paginado` - Listar movimientos paginados
- `GET /sede/{sedeId}/insumo/{insumoId}` - Listar movimientos de un insumo específico
- `GET /rango-fechas?inicio=2024-01-01T00:00:00&fin=2024-12-31T23:59:59` - Listar por rango de fechas
- `POST /` - Crear nuevo movimiento (actualiza inventario automáticamente)

### Movimientos de Inventario (Productos)

**Base URL:** `/api/admin/tiendas/{tiendaId}/inventario/movimientos/productos`

Mismos endpoints que movimientos de insumos, pero para productos.

## Ejemplo de Uso

### ⚠️ IMPORTANTE: Reemplazar Path Variables

Los ejemplos de endpoints usan `{tiendaId}`, `{sedeId}`, etc. como placeholders. Debes reemplazarlos con valores numéricos reales:

**❌ Incorrecto:**
```
GET /api/admin/tiendas/{tiendaId}/inventario/insumos
```

**✅ Correcto:**
```
GET /api/admin/tiendas/1/inventario/insumos
```

### Ejemplos de Peticiones con cURL

#### 1. Listar inventario de insumos de una tienda

```bash
curl -X GET http://localhost:8080/api/admin/tiendas/1/inventario/insumos
```

#### 2. Listar inventario de una sede específica

```bash
curl -X GET http://localhost:8080/api/admin/tiendas/1/inventario/insumos/sede/1
```

#### 3. Consultar productos con bajo stock

```bash
curl -X GET "http://localhost:8080/api/admin/tiendas/1/inventario/productos/sede/1/bajo-stock?cantidadMinima=10"
```

### Crear un movimiento de entrada de insumos

```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/movimientos/insumos \
  -H "Content-Type: application/json" \
  -d '{
    "sedeId": 1,
    "insumoId": 5,
    "tipoMovimiento": "entrada",
    "cantidad": 50.5,
    "motivo": "Compra de harina - Orden #123",
    "ordenCompraId": 123,
    "responsableId": 10
  }'
```

**Resultado:** 
- Se crea el movimiento en la tabla `movimientos_inventario_insumos`
- Se actualiza automáticamente el `cantidadActual` en `inventario_insumos_sedes`
- Se registra la cantidad anterior y posterior para auditoría

### Crear una transferencia entre sedes

```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/transferencias \
  -H "Content-Type: application/json" \
  -d '{
    "sedeOrigenId": 1,
    "sedeDestinoId": 2,
    "solicitadoPor": 10,
    "observaciones": "Transferencia de urgencia",
    "items": [
      {
        "insumoId": 5,
        "cantidadEnviada": 20.0
      },
      {
        "productoId": 3,
        "cantidadEnviada": 15.0
      }
    ]
  }'
```

### Cambiar estado de una transferencia

```bash
# Marcar como en tránsito
curl -X PATCH "http://localhost:8080/api/admin/tiendas/1/inventario/transferencias/1/estado?nuevoEstado=en_transito"

# Marcar como recibida
curl -X PATCH "http://localhost:8080/api/admin/tiendas/1/inventario/transferencias/1/estado?nuevoEstado=recibido"
```

## Valores Válidos para Enums

### EstadoTransferencia
Los valores deben enviarse en **minúsculas con guion bajo**:
- `pendiente` - Transferencia solicitada
- `en_transito` - Mercancía enviada
- `recibido` - Mercancía recibida en destino
- `cancelado` - Transferencia cancelada

**Ejemplo JSON:**
```json
{
  "estado": "en_transito"
}
```

### TipoMovimientoInsumo
Los valores deben enviarse en **minúsculas**:
- `entrada` - Ingreso de stock
- `salida` - Salida de stock
- `ajuste` - Ajuste de inventario
- `transferencia` - Transferencia entre sedes

**Ejemplo JSON:**
```json
{
  "tipoMovimiento": "entrada"
}
```

### MotivoMovimientoProducto
Los valores deben enviarse en **minúsculas**:
- `produccion` - Entrada por producción
- `venta` - Salida por venta
- `merma` - Pérdida de producto
- `ajuste` - Ajuste de inventario
- `transferencia` - Transferencia entre sedes
- `devolucion` - Devolución de producto

**Ejemplo JSON:**
```json
POST /api/admin/tiendas/1/inventario/movimientos/insumos
{
  "sedeId": 1,
  "insumoId": 5,
  "tipoMovimiento": "entrada",
  "cantidad": 50.5,
  "motivo": "Compra de harina - Orden #123",
  "ordenCompraId": 123,
  "responsableId": 10
}
```

**Resultado:** 
- Se crea el movimiento en la tabla `movimientos_inventario_insumos`
- Se actualiza automáticamente el `cantidadActual` en `inventario_insumos_sedes`
- Se registra la cantidad anterior y posterior para auditoría

### Crear una transferencia entre sedes

```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/transferencias \
  -H "Content-Type: application/json" \
  -d '{
    "sedeOrigenId": 1,
    "sedeDestinoId": 2,
    "solicitadoPor": 10,
    "observaciones": "Transferencia de urgencia",
    "items": [
      {
        "insumoId": 5,
        "cantidadEnviada": 20.0
      },
      {
        "productoId": 3,
        "cantidadEnviada": 15.0
      }
    ]
  }'
```

## Características Importantes

### 1. Multi-Tenant y Multi-Sede
- Todos los endpoints requieren `tiendaId` en la URL
- Filtrado automático por `tiendaId` en todas las consultas
- Soporte para múltiples sedes por tienda

### 2. Validaciones
- No se permite stock negativo en salidas
- Validación de transferencias entre sedes diferentes
- Validación de transiciones de estado en transferencias
- Unicidad: un insumo/producto solo puede tener un registro de inventario por sede

### 3. Auditoría y Trazabilidad
- Todos los movimientos se registran con fecha/hora
- Se guarda la cantidad anterior y posterior a cada movimiento
- Referencia a orden de compra, plan de producción o pedido relacionado
- Identificación del usuario responsable

### 4. Soft Delete
- Las transferencias usan soft delete (estado CANCELADO)
- No se eliminan físicamente los registros para mantener la trazabilidad

### 5. Actualización Automática de Inventario
- Al crear un movimiento, el inventario se actualiza automáticamente
- Si no existe un registro de inventario, se crea automáticamente con cantidad 0

## Flujo de Trabajo - Transferencias

1. **PENDIENTE**: Usuario solicita transferencia
2. **EN_TRANSITO**: Autorizado, mercancía enviada (se registra fecha de envío)
3. **RECIBIDO**: Mercancía recibida en destino (se registra fecha de recepción)

En cualquier momento antes de RECIBIDO se puede **CANCELAR** la transferencia.

## Consideraciones de Rendimiento

- Índices en: `tienda_id`, `sede_id`, `insumo_id`, `producto_id`, `fecha_creacion`
- Paginación disponible para listados de movimientos
- Consultas optimizadas con JPA Specifications

## Tecnologías Utilizadas

- Spring Boot 3.5.5
- Spring Data JPA
- Jakarta Validation
- Lombok
- PostgreSQL / MySQL

## Próximas Mejoras

- [ ] Notificaciones automáticas por bajo stock
- [ ] Alertas de vencimiento de insumos
- [ ] Reportes de rotación de inventario
- [ ] Integración con módulo de compras
- [ ] Dashboard de inventario en tiempo real
