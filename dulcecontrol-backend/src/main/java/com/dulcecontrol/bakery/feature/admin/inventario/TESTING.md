# Guía de Testing - Módulo de Inventario

## 🔧 Configuración Inicial

Antes de probar los endpoints, asegúrate de:

1. ✅ Tener la aplicación corriendo en `http://localhost:8080`
2. ✅ Tener datos seed cargados (ejecutar Flyway)
3. ✅ Conocer los IDs de:
   - Tienda (ejemplo: `1`)
   - Sede (ejemplo: `1`, `2`)
   - Insumo (ejemplo: `1`, `2`, `3`)
   - Producto (ejemplo: `1`, `2`)

## 📝 Ejemplos de Testing con cURL

### 1. Inventario de Insumos

#### Listar todo el inventario de insumos de una tienda
```bash
curl -X GET http://localhost:8080/api/admin/tiendas/1/inventario/insumos
```

**Respuesta esperada (200 OK):**
```json
[
  {
    "id": 1,
    "sedeId": 1,
    "insumoId": 1,
    "cantidadActual": 100.5000,
    "ubicacionFisica": "Almacén Principal - Estante A1",
    "actualizadoEn": "2025-11-12T18:00:00"
  }
]
```

#### Listar inventario de una sede específica
```bash
curl -X GET http://localhost:8080/api/admin/tiendas/1/inventario/insumos/sede/1
```

#### Crear un nuevo registro de inventario
```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/insumos \
  -H "Content-Type: application/json" \
  -d '{
    "sedeId": 1,
    "insumoId": 10,
    "cantidadActual": 50.0,
    "ubicacionFisica": "Almacén B"
  }'
```

**Respuesta esperada (201 CREATED):**
```json
{
  "id": 11,
  "sedeId": 1,
  "insumoId": 10,
  "cantidadActual": 50.0000,
  "ubicacionFisica": "Almacén B",
  "actualizadoEn": "2025-11-12T18:05:00"
}
```

#### Actualizar inventario
```bash
curl -X PUT http://localhost:8080/api/admin/tiendas/1/inventario/insumos/11 \
  -H "Content-Type: application/json" \
  -d '{
    "sedeId": 1,
    "insumoId": 10,
    "cantidadActual": 75.5,
    "ubicacionFisica": "Almacén B - Actualizado"
  }'
```

#### Consultar insumos con bajo stock
```bash
curl -X GET "http://localhost:8080/api/admin/tiendas/1/inventario/insumos/sede/1/bajo-stock?cantidadMinima=20"
```

---

### 2. Inventario de Productos

#### Listar productos de una sede
```bash
curl -X GET http://localhost:8080/api/admin/tiendas/1/inventario/productos/sede/1
```

#### Crear inventario de producto
```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/productos \
  -H "Content-Type: application/json" \
  -d '{
    "sedeId": 1,
    "productoId": 1,
    "cantidadActual": 50,
    "ubicacionFisica": "Vitrina 1"
  }'
```

**Nota:** `cantidadActual` es INTEGER para productos (no BigDecimal).

#### Productos con bajo stock
```bash
curl -X GET "http://localhost:8080/api/admin/tiendas/1/inventario/productos/sede/1/bajo-stock?cantidadMinima=10"
```

---

### 3. Movimientos de Inventario (Insumos)

#### Crear movimiento de ENTRADA
```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/movimientos/insumos \
  -H "Content-Type: application/json" \
  -d '{
    "sedeId": 1,
    "insumoId": 1,
    "tipoMovimiento": "entrada",
    "cantidad": 100.0,
    "motivo": "Compra de harina - Orden #001",
    "ordenCompraId": 1,
    "responsableId": 1
  }'
```

**Resultado:**
- ✅ Stock anterior: 100.5
- ✅ Stock nuevo: 200.5
- ✅ Se registra el movimiento con cantidades anterior/posterior

#### Crear movimiento de SALIDA
```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/movimientos/insumos \
  -H "Content-Type: application/json" \
  -d '{
    "sedeId": 1,
    "insumoId": 1,
    "tipoMovimiento": "salida",
    "cantidad": 50.0,
    "motivo": "Usado en producción - Plan #10",
    "planProduccionId": 10,
    "responsableId": 1
  }'
```

**Resultado:**
- ✅ Stock anterior: 200.5
- ✅ Stock nuevo: 150.5

#### Crear movimiento de AJUSTE
```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/movimientos/insumos \
  -H "Content-Type: application/json" \
  -d '{
    "sedeId": 1,
    "insumoId": 1,
    "tipoMovimiento": "ajuste",
    "cantidad": 125.0,
    "motivo": "Ajuste por inventario físico",
    "responsableId": 1
  }'
```

**Resultado:**
- ✅ Stock anterior: 150.5
- ✅ Stock nuevo: 125.0 (AJUSTE establece cantidad directa)

#### Listar movimientos de un insumo específico
```bash
curl -X GET http://localhost:8080/api/admin/tiendas/1/inventario/movimientos/insumos/sede/1/insumo/1
```

#### Listar movimientos por rango de fechas
```bash
curl -X GET "http://localhost:8080/api/admin/tiendas/1/inventario/movimientos/insumos/rango-fechas?inicio=2025-11-01T00:00:00&fin=2025-11-30T23:59:59"
```

#### Listar movimientos paginados
```bash
curl -X GET "http://localhost:8080/api/admin/tiendas/1/inventario/movimientos/insumos/sede/1/paginado?page=0&size=10&sort=creadoEn,desc"
```

---

### 4. Movimientos de Inventario (Productos)

#### Crear movimiento por PRODUCCIÓN
```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/movimientos/productos \
  -H "Content-Type: application/json" \
  -d '{
    "sedeId": 1,
    "productoId": 1,
    "tipoMovimiento": "entrada",
    "cantidad": 100,
    "motivo": "produccion",
    "planProduccionId": 5,
    "responsableId": 1
  }'
```

#### Crear movimiento por VENTA
```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/movimientos/productos \
  -H "Content-Type: application/json" \
  -d '{
    "sedeId": 1,
    "productoId": 1,
    "tipoMovimiento": "salida",
    "cantidad": 10,
    "motivo": "venta",
    "pedidoId": 100,
    "responsableId": 1
  }'
```

#### Crear movimiento por MERMA
```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/movimientos/productos \
  -H "Content-Type: application/json" \
  -d '{
    "sedeId": 1,
    "productoId": 1,
    "tipoMovimiento": "salida",
    "cantidad": 5,
    "motivo": "merma",
    "responsableId": 1
  }'
```

---

### 5. Transferencias entre Sedes

#### Crear transferencia (Estado inicial: PENDIENTE)
```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/transferencias \
  -H "Content-Type: application/json" \
  -d '{
    "sedeOrigenId": 1,
    "sedeDestinoId": 2,
    "solicitadoPor": 1,
    "observaciones": "Transferencia de emergencia para sede 2",
    "items": [
      {
        "insumoId": 1,
        "cantidadEnviada": 50.0
      },
      {
        "insumoId": 2,
        "cantidadEnviada": 30.0
      },
      {
        "productoId": 1,
        "cantidadEnviada": 20.0
      }
    ]
  }'
```

**Respuesta esperada (201 CREATED):**
```json
{
  "id": 1,
  "sedeOrigenId": 1,
  "sedeDestinoId": 2,
  "estado": "pendiente",
  "solicitadoPor": 1,
  "fechaSolicitud": "2025-11-12T18:30:00",
  "observaciones": "Transferencia de emergencia para sede 2",
  "items": [
    {
      "id": 1,
      "transferenciaId": 1,
      "insumoId": 1,
      "cantidadEnviada": 50.0000
    }
  ]
}
```

#### Cambiar estado a EN_TRANSITO
```bash
curl -X PATCH "http://localhost:8080/api/admin/tiendas/1/inventario/transferencias/1/estado?nuevoEstado=en_transito"
```

**Resultado:**
- ✅ Estado cambia a `en_transito`
- ✅ Se registra `fechaEnvio`

#### Cambiar estado a RECIBIDO
```bash
curl -X PATCH "http://localhost:8080/api/admin/tiendas/1/inventario/transferencias/1/estado?nuevoEstado=recibido"
```

**Resultado:**
- ✅ Estado cambia a `recibido`
- ✅ Se registra `fechaRecepcion`

#### Listar transferencias por estado
```bash
curl -X GET http://localhost:8080/api/admin/tiendas/1/inventario/transferencias/estado/pendiente
curl -X GET http://localhost:8080/api/admin/tiendas/1/inventario/transferencias/estado/en_transito
curl -X GET http://localhost:8080/api/admin/tiendas/1/inventario/transferencias/estado/recibido
```

#### Cancelar transferencia (Soft Delete)
```bash
curl -X DELETE http://localhost:8080/api/admin/tiendas/1/inventario/transferencias/1
```

**Resultado:**
- ✅ Estado cambia a `cancelado`
- ✅ Ya no aparece en listados (filtrado por `@SQLRestriction`)

---

## ⚠️ Errores Comunes y Soluciones

### Error: "Failed to convert value of type 'java.lang.String' to required type 'java.lang.Long'"

**Causa:** Enviaste `{tiendaId}` literalmente en la URL en lugar de un número.

**Solución:**
```bash
# ❌ Incorrecto
curl -X GET http://localhost:8080/api/admin/tiendas/{tiendaId}/inventario/insumos

# ✅ Correcto
curl -X GET http://localhost:8080/api/admin/tiendas/1/inventario/insumos
```

---

### Error: "Estado de transferencia no válido: PENDIENTE"

**Causa:** Enviaste el enum en mayúsculas, pero la base de datos espera minúsculas con guion bajo.

**Solución:**
```json
// ❌ Incorrecto
{
  "estado": "PENDIENTE"
}

// ✅ Correcto
{
  "estado": "pendiente"
}
```

**Valores válidos:**
- `pendiente`
- `en_transito`
- `recibido`
- `cancelado`

---

### Error: "No hay suficiente stock"

**Causa:** Intentaste hacer una SALIDA o TRANSFERENCIA con más cantidad de la que hay disponible.

**Solución:**
1. Verifica el stock actual:
```bash
curl -X GET http://localhost:8080/api/admin/tiendas/1/inventario/insumos/sede/1
```

2. Reduce la cantidad en tu movimiento o haz una entrada primero.

---

### Error: "Ya existe un inventario para este insumo en la sede"

**Causa:** Intentaste crear un segundo registro de inventario para el mismo insumo en la misma sede.

**Solución:** Usa `PUT` para actualizar el registro existente en lugar de crear uno nuevo.

```bash
# En lugar de POST, usa PUT con el ID del registro existente
curl -X PUT http://localhost:8080/api/admin/tiendas/1/inventario/insumos/1 \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## 📊 Flujo Completo de Testing Recomendado

### Paso 1: Crear inventario inicial
```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/insumos \
  -H "Content-Type: application/json" \
  -d '{"sedeId": 1, "insumoId": 1, "cantidadActual": 100.0, "ubicacionFisica": "Almacén A"}'
```

### Paso 2: Hacer una entrada
```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/movimientos/insumos \
  -H "Content-Type: application/json" \
  -d '{"sedeId": 1, "insumoId": 1, "tipoMovimiento": "entrada", "cantidad": 50.0, "motivo": "Compra", "responsableId": 1}'
```

### Paso 3: Verificar stock actualizado
```bash
curl -X GET http://localhost:8080/api/admin/tiendas/1/inventario/insumos/sede/1
# Debería mostrar: cantidadActual: 150.0
```

### Paso 4: Hacer una salida
```bash
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/movimientos/insumos \
  -H "Content-Type: application/json" \
  -d '{"sedeId": 1, "insumoId": 1, "tipoMovimiento": "salida", "cantidad": 25.0, "motivo": "Producción", "responsableId": 1}'
```

### Paso 5: Crear y ejecutar transferencia
```bash
# 5.1 Crear transferencia
curl -X POST http://localhost:8080/api/admin/tiendas/1/inventario/transferencias \
  -H "Content-Type: application/json" \
  -d '{"sedeOrigenId": 1, "sedeDestinoId": 2, "solicitadoPor": 1, "items": [{"insumoId": 1, "cantidadEnviada": 20.0}]}'

# 5.2 Marcar en tránsito
curl -X PATCH "http://localhost:8080/api/admin/tiendas/1/inventario/transferencias/1/estado?nuevoEstado=en_transito"

# 5.3 Marcar recibida
curl -X PATCH "http://localhost:8080/api/admin/tiendas/1/inventario/transferencias/1/estado?nuevoEstado=recibido"
```

---

## 🧪 Testing con Postman/Thunder Client

Si prefieres usar una herramienta visual como Postman o Thunder Client en VS Code:

1. Crea una colección llamada "Inventario"
2. Agrega una variable de entorno `baseUrl` = `http://localhost:8080`
3. Importa estos endpoints y reemplaza los path variables

**Ejemplo de request en Postman:**
- Method: `POST`
- URL: `{{baseUrl}}/api/admin/tiendas/1/inventario/movimientos/insumos`
- Body (raw JSON):
```json
{
  "sedeId": 1,
  "insumoId": 1,
  "tipoMovimiento": "entrada",
  "cantidad": 100.0,
  "motivo": "Compra mensual",
  "responsableId": 1
}
```

---

¡Listo para probar! 🚀
