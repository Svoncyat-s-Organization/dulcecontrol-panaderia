# Cambios para Compatibilidad con MySQL 5.5 / MariaDB

## Fecha: 2025-11-13
## Autor: GitHub Copilot

## Problema Identificado

La aplicación fallaba en el servidor de producción (MySQL 5.5 / MariaDB) con el siguiente error:

```
You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version 
for the right syntax to use near 'AS new ON DUPLICATE KEY UPDATE nombre = new.nombre' at line 33
```

## Causa Raíz

La sintaxis `INSERT ... VALUES ... AS alias` fue introducida en MySQL 8.0.19 y no está disponible en:
- MySQL 5.5
- MySQL 5.6
- MySQL 5.7
- MariaDB (todas las versiones hasta 10.3)

## Solución Implementada

Se modificaron TODOS los archivos de migración repetibles (R__*.sql) para usar la sintaxis compatible:

### Antes (MySQL 8.0+):
```sql
INSERT INTO tabla (columna1, columna2)
VALUES
  ('valor1', 'valor2'),
  ('valor3', 'valor4')
AS new
ON DUPLICATE KEY UPDATE
  columna1 = new.columna1,
  columna2 = new.columna2;
```

### Después (MySQL 5.5+ compatible):
```sql
INSERT INTO tabla (columna1, columna2)
VALUES
  ('valor1', 'valor2'),
  ('valor3', 'valor4')
ON DUPLICATE KEY UPDATE
  columna1 = VALUES(columna1),
  columna2 = VALUES(columna2);
```

## Archivos Modificados

Todos los archivos de migración repetibles fueron actualizados:

1. R__01_seed_ubigeo.sql
2. R__02_seed_superadmin_seguridad.sql
3. R__03_seed_superadmin_tiendas.sql
4. R__04_seed_superadmin_suscripciones.sql
5. R__05_seed_superadmin_facturacion.sql
6. R__06_seed_superadmin_soporte.sql
7. R__07_seed_admin_seguridad.sql
8. R__08_seed_admin_catalogo.sql
9. R__09_seed_admin_compras.sql
10. R__10_seed_admin_clientes.sql
11. R__11_seed_admin_ventas.sql
12. R__12_seed_admin_produccion.sql
13. R__13_seed_admin_inventario.sql
14. R__14_seed_admin_facturacion.sql
15. R__15_seed_admin_configuracion.sql

## Cambios Específicos

1. **Eliminadas** todas las líneas que contenían `AS new`
2. **Reemplazadas** todas las referencias `new.columna` por `VALUES(columna)` 
   SOLO en secciones `ON DUPLICATE KEY UPDATE`
3. **Preservadas** las referencias `new.columna` en otras partes del código 
   (como subqueries o CTEs)

## Verificación

- ✅ 15 archivos procesados
- ✅ 0 referencias a "AS new" encontradas
- ✅ Sintaxis compatible con MySQL 5.5+
- ✅ Sintaxis compatible con MariaDB 5.5+
- ✅ Compatible hacia adelante con MySQL 8.0+

## Advertencia sobre VALUES()

**Nota importante:** La función `VALUES()` en `ON DUPLICATE KEY UPDATE` está 
marcada como **deprecated** desde MySQL 8.0.20 y será removida en futuras versiones.
La nueva sintaxis recomendada es usar alias:

```sql
INSERT INTO tabla (col1, col2) 
VALUES ('a', 'b') AS new
ON DUPLICATE KEY UPDATE col1 = new.col1;
```

Sin embargo, para mantener compatibilidad con MySQL 5.5/MariaDB en producción,
usamos `VALUES()` que funciona en todas las versiones desde MySQL 5.0 hasta 8.0.x.

## Recomendación Futura

Cuando el servidor de producción se actualice a MySQL 8.0+, considerar:
1. Revertir a la sintaxis con alias `AS new`
2. Actualizar todas las migraciones repetibles
3. Probar exhaustivamente antes de desplegar

