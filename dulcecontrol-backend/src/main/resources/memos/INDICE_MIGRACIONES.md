# Índice de Migraciones - DulceControl Backend

## Resumen de Migraciones Flyway

Este documento índice las migraciones de la base de datos **DulceControl** implementadas con Flyway.

---

## 📋 Listado de Versiones

| Versión | Archivo                      | Descripción                           | Fecha      |
| ------- | ---------------------------- | ------------------------------------- | ---------- |
| **V1**  | `V1__initial_schema.sql`     | Esquema base y extensiones PostgreSQL | 2025-10-08 |
| **V2**  | `V2__database_functions.sql` | Funciones PL/pgSQL y triggers         | 2025-10-08 |
| **V3**  | `V3__core_tables.sql`        | Tablas de organización y acceso       | 2025-10-08 |
| **V4**  | `V4__catalog_tables.sql`     | Catálogos de productos e insumos      | 2025-10-08 |
| **V5**  | `V5__operational_tables.sql` | Sistema POS y ventas                  | 2025-10-08 |
| **V6**  | `V6__orders_tables.sql`      | Sistema de pedidos                    | 2025-10-08 |
| **V7**  | `V7__production_tables.sql`  | Planificación de producción           | 2025-10-08 |
| **V8**  | `V8__purchases_tables.sql`   | Compras y gastos                      | 2025-10-08 |
| **V9**  | `V9__views_and_indexes.sql`  | Vistas de reporte y optimizaciones    | 2025-10-08 |

---

## 📖 Detalle de cada Migración

### V1 - Esquema Base y Extensiones

- **Archivo memo**: `2025-10-08_V1_initial_schema.md`
- **Contenido**:
  - Creación del esquema `dulce_control`
  - Extensiones: `citext`, `pg_trgm`, `btree_gist`
  - Configuración de `search_path`

### V2 - Funciones de Base de Datos

- **Archivo memo**: `2025-10-08_V2_database_functions.md`
- **Contenido**:
  - `set_updated_at()`: Timestamps automáticos
  - `calcular_total_item_venta()`: Cálculo de totales de items
  - `recalcular_totales_venta()`: Actualización de totales de venta
  - `validar_cambio_estado_pedido()`: Máquina de estados
  - `plan_item_autocompletar()`: Completado automático

### V3 - Tablas Core

- **Archivo memo**: `2025-10-08_V3_core_tables.md`
- **Tablas**: `sede`, `rol`, `permiso`, `rol_permiso`, `usuario`, `usuario_rol`, `usuario_sede`, `usuario_recuperacion`
- **Características**: Seguridad, autenticación, autorización

### V4 - Catálogos

- **Archivo memo**: `2025-10-08_V4_catalog_tables.md`
- **Tablas**: `categoria_producto`, `producto`, `producto_imagen`, `insumo`, `receta`, `receta_item`, `inventario_producto`, `inventario_config`, `cliente`
- **Características**: Maestros de productos, recetas, inventarios

### V5 - Sistema POS

- **Archivo memo**: `2025-10-08_V5_operational_tables.md`
- **Tablas**: `caja_sesion`, `venta`, `venta_item`, `pago_venta`
- **Características**: Punto de venta, cálculos automáticos, pagos mixtos

### V6 - Sistema de Pedidos

- **Archivo memo**: `2025-10-08_V6_orders_tables.md`
- **Tablas**: `pedido`, `pedido_item`, `pago_pedido`, `pedido_adjunto`, `pedido_entrega`
- **Características**: Pedidos personalizados, máquina de estados, adjuntos

### V7 - Producción

- **Archivo memo**: `2025-10-08_V7_production_tables.md`
- **Tablas**: `conteo_matutino`, `conteo_matutino_item`, `plan_produccion`, `plan_produccion_item`
- **Características**: Planificación diaria, seguimiento de avance

### V8 - Compras y Gastos

- **Archivo memo**: `2025-10-08_V8_purchases_tables.md`
- **Tablas**: `proveedor`, `compra`, `compra_insumo_item`, `gasto`
- **Características**: Gestión de proveedores, compras, gastos operativos

### V9 - Vistas y Optimizaciones

- **Archivo memo**: `2025-10-08_V9_views_and_indexes.md`
- **Vistas**: `vw_resumen_venta_pago`, `vw_pedido_totales`, `vw_plan_produccion_progreso`, `vw_inventario_alertas`, `vw_ventas_diarias`, `vw_productos_top_ventas`
- **Características**: Reportes analíticos, índices optimizados

---

## 🎯 Estadísticas del Proyecto

- **Total de migraciones**: 9
- **Total de tablas**: 31
- **Total de vistas**: 6
- **Total de funciones**: 5
- **Total de triggers**: 11
- **Extensiones PostgreSQL**: 3

---

## 🚀 Ejecución de Migraciones

### Prerequisitos

1. PostgreSQL 12+ instalado y ejecutándose
2. Base de datos `dulcecontrol_bd` creada
3. Variables de entorno configuradas:
   - `POSTGRE_DB_USER` (opcional, default: postgres)
   - `POSTGRE_DB_PASSWORD` (requerida)

### Comandos

**Iniciar aplicación (aplica migraciones automáticamente):**

```bash
cd dulcecontrol-backend
mvnw spring-boot:run
```

**Verificar migraciones aplicadas:**

```sql
SELECT * FROM dulce_control.flyway_schema_history ORDER BY installed_rank;
```

**Limpiar base de datos (desarrollo):**

```bash
mvnw flyway:clean
```

**Validar migraciones:**

```bash
mvnw flyway:validate
```

**Información de estado:**

```bash
mvnw flyway:info
```

---

## 📝 Notas Importantes

1. **No modificar migraciones aplicadas**: Una vez ejecutada, una migración no debe modificarse.
2. **Versionado secuencial**: Las versiones deben ser secuenciales (V1, V2, V3...).
3. **Checksums**: Flyway valida checksums; cambiar archivo aplicado genera error.
4. **Rollback manual**: Flyway no tiene rollback automático; crear nueva migración para revertir.
5. **Ambientes**: Mismos scripts se aplican en todos los ambientes (dev/staging/prod).

---

## 🔗 Referencias

- **Flyway**: https://flywaydb.org/documentation/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Spring Boot**: https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization.migration-tool.flyway

---

**Fecha de creación**: 2025-10-08  
**Última actualización**: 2025-10-08  
**Versión actual**: V9
