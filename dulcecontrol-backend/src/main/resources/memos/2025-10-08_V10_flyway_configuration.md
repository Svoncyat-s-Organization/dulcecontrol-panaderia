# Configuración de Flyway - application.properties (2025-10-08)

**Completado**

- Se configuró Flyway en `application.properties` con las siguientes características:
  - **Flyway habilitado** para gestión de migraciones automáticas.
  - **Ubicación**: Scripts en `classpath:db/migration`.
  - **Esquema**: `dulce_control` configurado como esquema principal.
  - **Baseline**: Habilitado para permitir migración de bases existentes.
  - **Validación**: Activa en cada startup para detectar cambios no autorizados.
  - **JPA/Hibernate**: Configurado en modo `validate` (no modifica esquema).

**Configuraciones clave**

**Base de datos:**

- URL: `jdbc:postgresql://localhost:5432/dulcecontrol_bd`
- Usuario: Variable de entorno `POSTGRE_DB_USER` (default: postgres)
- Password: Variable de entorno `POSTGRE_DB_PASSWORD` (requerida)
- Pool de conexiones HikariCP optimizado (5-10 conexiones)

**Flyway:**

- `baseline-on-migrate=true`: Permite aplicar migraciones sobre base existente
- `baseline-version=0`: Considera versión 0 como punto de partida
- `create-schemas=true`: Crea esquema `dulce_control` si no existe
- `validate-on-migrate=true`: Valida checksums de migraciones en startup
- `table=flyway_schema_history`: Tabla de control de versiones

**Hibernate:**

- `ddl-auto=validate`: Solo valida, NO modifica esquema (Flyway es responsable)
- `default_schema=dulce_control`: Todas las entidades usan este esquema por defecto
- `show-sql=false`: SQL no se muestra en consola (usar logging para debug)

**Logging:**

- Flyway: INFO (muestra migraciones aplicadas)
- Hibernate SQL: DEBUG (útil para desarrollo)
- SQL Binders: TRACE (muestra parámetros de queries)

**Ventajas de esta configuración**

1. **Versionado controlado**: Flyway gestiona todas las migraciones.
2. **Seguridad**: Hibernate no puede alterar esquema accidentalmente.
3. **Trazabilidad**: Histórico completo en `flyway_schema_history`.
4. **Rollback manual**: Migraciones reversibles si es necesario.
5. **Ambientes múltiples**: Misma configuración para dev/staging/prod.

**Orden de ejecución en startup**

1. Spring Boot inicia y lee `application.properties`.
2. Flyway se conecta a la base de datos.
3. Crea esquema `dulce_control` si no existe.
4. Revisa tabla `flyway_schema_history`.
5. Aplica migraciones pendientes (V1, V2, ..., V9).
6. Hibernate valida que entidades coincidan con esquema.
7. Aplicación lista para recibir requests.

**Siguiente**

- Ejecutar la aplicación y verificar que las 9 migraciones se apliquen correctamente.
- Revisar tabla `dulce_control.flyway_schema_history` para confirmar versiones.
