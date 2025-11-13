# Postman - Superadmin Suscripciones

- Base URL fija: `http://localhost:8080`

## Planes

### Listar planes

- Metodo: `GET`
- URL completa: `http://localhost:8080/api/superadmin/suscripciones/planes`
- Query param opcional: `soloActivos=true`.
- Como usar en Postman: agrega el query param si necesitas filtrar y envía sin body.

### Obtener plan por ID

- Metodo: `GET`
- URL completa: `http://localhost:8080/api/superadmin/suscripciones/planes/:id`
- Como usar en Postman: reemplaza `:id`; sin body.

### Crear plan

- Metodo: `POST`
- URL completa: `http://localhost:8080/api/superadmin/suscripciones/planes`
- Body raw JSON:

```json
{
  "codigo": "PLAN_PLUS",
  "nombre": "Plan Plus",
  "descripcion": "Plan intermedio con cobertura regional.",
  "precioMensualCentimos": 12990,
  "precioAnualCentimos": 129900,
  "moneda": "PEN",
  "limites": {
    "usuarios": 10,
    "sedes": 4,
    "almacenamiento_gb": 60,
    "facturacion": {
      "comprobantes_mensuales": 600
    }
  },
  "activo": true
}
```

### Actualizar plan

- Metodo: `PUT`
- URL completa: `http://localhost:8080/api/superadmin/suscripciones/planes/:id`
- Body raw JSON:

```json
{
  "codigo": "PLAN_BASICO",
  "nombre": "Plan Basico Actualizado",
  "descripcion": "Cobertura para equipos pequenos con mejoras en reportes.",
  "precioMensualCentimos": 10990,
  "precioAnualCentimos": 109900,
  "moneda": "PEN",
  "limites": {
    "usuarios": 6,
    "sedes": 3,
    "almacenamiento_gb": 25
  },
  "activo": true
}
```

- Nota: no existe `DELETE` de planes; se mantiene el registro para historial de suscripciones y facturacion.

## Suscripciones

### Listar suscripciones

- Metodo: `GET`
- URL completa: `http://localhost:8080/api/superadmin/suscripciones`
- Query params comunes: `tiendaId`, `estado` (por ejemplo `ACTIVA`).
- Como usar en Postman: agrega los filtros que necesites y envía sin body.

### Obtener suscripcion por ID

- Metodo: `GET`
- URL completa: `http://localhost:8080/api/superadmin/suscripciones/:id`
- Como usar en Postman: reemplaza `:id`; sin body.

### Crear suscripcion

- Metodo: `POST`
- URL completa: `http://localhost:8080/api/superadmin/suscripciones`
- Body raw JSON:

```json
{
  "tiendaId": 1,
  "planId": 2,
  "ciclo": "MENSUAL",
  "precioPactadoCentimos": 14990,
  "fechaInicio": "2024-06-01T00:00:00",
  "fechaFin": "2024-11-30T23:59:59",
  "estado": "EN_PRUEBA",
  "autorenovar": true,
  "usuarioResponsableId": 1
}
```

### Actualizar suscripcion

- Metodo: `PUT`
- URL completa: `http://localhost:8080/api/superadmin/suscripciones/:id`
- Body raw JSON:

```json
{
  "planId": 3,
  "ciclo": "ANUAL",
  "precioPactadoCentimos": 259900,
  "fechaFin": "2025-06-30T23:59:59",
  "estado": "ACTIVA",
  "autorenovar": true,
  "usuarioResponsableId": 2
}
```

- Nota: no existe `DELETE` de suscripciones; la API preserva el contrato para conciliacion de pagos y auditoria.

## Historial de Suscripciones

### Listar historial por suscripcion

- Metodo: `GET`
- URL completa: `http://localhost:8080/api/superadmin/suscripciones/:suscripcionId/historial`
- Query param opcional: `limit=5` (o el valor deseado).
- Como usar en Postman: reemplaza `:suscripcionId`, configura el query param y envía sin body.
- Nota: no hay `POST`, `PUT` ni `DELETE` en el historial porque los eventos se generan automaticamente desde el backend para mantener un registro inmutable.
