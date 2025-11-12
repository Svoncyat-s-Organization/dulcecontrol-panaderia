# Postman - Superadmin Seguridad

- Base URL fija: `http://localhost:8080`

## Usuarios Superadmin

### Listar usuarios

- Metodo: `GET`
- URL completa: `http://localhost:8080/api/superadmin/seguridad/usuarios`
- Como usar en Postman: envía la solicitud sin body.

### Obtener usuario por ID

- Metodo: `GET`
- URL completa: `http://localhost:8080/api/superadmin/seguridad/usuarios/:id`
- Como usar en Postman: reemplaza `:id` en Params > Path Variables y envía sin body.

### Crear usuario

- Metodo: `POST`
- URL completa: `http://localhost:8080/api/superadmin/seguridad/usuarios`
- Body raw JSON:

```json
{
  "correo": "nuevo.superadmin@dulcecontrol.pe",
  "contrasena": "demo1234",
  "tipoDoc": "DNI",
  "numeroDoc": "12345679",
  "nombres": "Nuevo Super Administrador",
  "telefono": "987654321"
}
```

### Actualizar usuario

- Metodo: `PUT`
- URL completa: `http://localhost:8080/api/superadmin/seguridad/usuarios/:id`
- Body raw JSON:

```json
{
  "correo": "pepe.rojas@dulcecontrol.pe",
  "nuevaContrasena": "demo12345",
  "tipoDoc": "DNI",
  "numeroDoc": "75879632",
  "nombres": "Jose Rojas Estrella",
  "telefono": "999888777",
  "activo": true
}
```

### Eliminar usuario

- Metodo: `DELETE`
- URL completa: `http://localhost:8080/api/superadmin/seguridad/usuarios/:id`
- Como usar en Postman: reemplaza `:id`; no hay body.

## Actividades de Superadmin

### Listar actividades recientes

- Metodo: `GET`
- URL completa: `http://localhost:8080/api/superadmin/seguridad/actividades`
- Query params sugerido: `limit=25`.
- Como usar en Postman: configura el query param y envía sin body.

### Listar actividades por superadmin

- Metodo: `GET`
- URL completa: `http://localhost:8080/api/superadmin/seguridad/actividades/usuarios/:superadminId`
- Query params sugerido: `limit=10`.
- Como usar en Postman: reemplaza `:superadminId`, ajusta el query param y envía sin body.

### Registrar actividad

- Metodo: `POST`
- URL completa: `http://localhost:8080/api/superadmin/seguridad/actividades/usuarios/:superadminId`
- Body raw JSON:

```json
{
  "tipoEvento": "login_exitoso",
  "ipOrigen": "2001:db8:1::101",
  "detalles": {
    "accion": "login",
    "navegador": "Chrome 120",
    "plataforma": "Windows 11"
  },
  "creadoEn": "2024-01-06T03:45:00"
}
```

- Nota: no existen endpoints `PUT` o `DELETE` para actividades porque el historial de auditoria es solo de lectura; la API evita modificar o borrar registros para mantener la trazabilidad.
