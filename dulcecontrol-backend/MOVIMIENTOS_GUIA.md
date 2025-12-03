# Submódulo Movimientos - Guía de Resolución

## Estado Actual

El submódulo **Movimientos** (Kardex) está completamente implementado y funcional:

### ✅ Backend Completado
- **DTOs enriquecidos**: Respuestas incluyen nombres legibles (nombreProducto, sku, nombreInsumo, codigoInterno, usuarioResponsable)
- **Services con JOIN**: Ambos services (productos e insumos) realizan JOIN con tablas relacionadas
- **Controllers**: Endpoints REST con filtrado por sede, rango de fechas, y paginación
- **Compilación**: Backend compila sin errores (BUILD SUCCESS)

### ✅ Frontend Completado
- **Filtros avanzados**: DatePicker rango, Select tipo/motivo
- **Columnas de saldos**: Cantidad Anterior, Movimiento (+/-), Cantidad Posterior
- **Colores semafóricos**: Verde (ENTRADA), Rojo (SALIDA), Naranja (AJUSTE)
- **Botón exportar**: Placeholder para futuro desarrollo
- **Build exitoso**: 3.1MB → 932KB gzipped

## ⚠️ Problema: Tablas Vacías

Las tablas de kardex aparecen vacías porque **no hay movimientos en la base de datos**.

### Causa Raíz

Los movimientos se generan automáticamente cuando ocurren estas acciones:
- ✅ Ajustes manuales desde **Existencias** (productos)
- ✅ Ajustes manuales desde **Insumos**
- Ventas desde POS (no implementado aún)
- Compras (no implementado aún)
- Producción (no implementado aún)

La **seed data** en `R__13_seed_admin_inventario.sql` tiene INSERTs pero usan JOINs complejos con tablas que pueden no tener datos (ordenes_compra, planes_produccion).

## 🔧 Soluciones

### Solución 1: Generar Movimientos desde Existencias/Insumos (Recomendado)

1. **Inicia sesión** en el frontend
2. **Selecciona una sede** desde el selector del header
3. Ve a **Inventario > Existencias**
4. Haz clic en el icono de ajuste (⚖️) de cualquier producto
5. En el modal:
   - Selecciona **Tipo de Movimiento**: ENTRADA o SALIDA
   - Selecciona un **Motivo** (ej: AJUSTE, MERMA, PRODUCCION)
   - Ingresa una **Cantidad**
   - Haz clic en **Vista Previa**
   - Confirma el ajuste

✅ Esto creará automáticamente un movimiento en la tabla de kardex

**Repite lo mismo en Inventario > Insumos para generar movimientos de insumos**

### Solución 2: Insertar Datos de Demostración (SQL Manual)

Si prefieres poblar las tablas con datos de prueba:

```bash
# Desde la raíz del proyecto backend
mysql -h localhost -u root -p'TuPassword' pasteleria_panaderia < insertar_movimientos_demo.sql
```

Este script inserta:
- 4 movimientos de productos (Pan Francés): PRODUCCION, VENTA, MERMA, CADUCIDAD
- 3 movimientos de insumos (Harina): COMPRA, CONSUMO, TRANSFERENCIA

**Nota**: Ajusta el password según tu configuración en `application.properties`

### Solución 3: Regenerar Seed Data (Desarrollo)

Si quieres que Flyway vuelva a ejecutar la migración R__13:

```bash
# 1. Eliminar el registro de Flyway
mysql -h localhost -u root -p'TuPassword' pasteleria_panaderia -e "
DELETE FROM flyway_schema_history WHERE script = 'R__13_seed_admin_inventario.sql';
"

# 2. Reiniciar backend
pkill -9 -f "spring-boot:run"
cd dulcecontrol-backend
mvn spring-boot:run
```

⚠️ **Advertencia**: Esto borrará todos los movimientos existentes y volverá a intentar insertar desde la migración.

## 📊 Verificación

Para verificar que los movimientos se insertaron correctamente:

```sql
SELECT COUNT(*) as total_productos FROM movimientos_inventario_productos;
SELECT COUNT(*) as total_insumos FROM movimientos_inventario_insumos;
```

Deberías ver al menos 1 registro en cada tabla.

## 🔍 Debugging

Si después de generar movimientos las tablas siguen vacías:

### 1. Verificar que el backend esté corriendo
```bash
curl http://localhost:2250/actuator/health
```

### 2. Verificar logs del backend
```bash
tail -100 /tmp/backend.log | grep -E "(ERROR|Exception|movimientos)"
```

### 3. Verificar en DevTools del navegador
- Abre **F12 > Network**
- Navega a **Inventario > Movimientos**
- Busca request a `/api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/sede/{sedeId}`
- Verifica:
  - **Status Code**: Debe ser 200
  - **Response**: Debe ser un array (aunque esté vacío)
  - **Errors**: Si es 401, no estás autenticado; si es 403, no tienes permisos

### 4. Verificar autenticación
Asegúrate de:
- ✅ Haber iniciado sesión correctamente
- ✅ Tener un token JWT válido en localStorage
- ✅ Tener permisos de ADMIN o acceso al módulo Inventario
- ✅ Haber seleccionado una sede válida

### 5. Verificar datos en BD directamente
```sql
-- Ver estructura de las tablas
DESCRIBE movimientos_inventario_productos;
DESCRIBE movimientos_inventario_insumos;

-- Ver todos los movimientos (sin filtros)
SELECT * FROM movimientos_inventario_productos LIMIT 10;
SELECT * FROM movimientos_inventario_insumos LIMIT 10;
```

## 📝 Notas Técnicas

### Arquitectura del Kardex
- **Append-only**: Los movimientos nunca se editan ni eliminan (inmutabilidad)
- **Multi-tenant**: Filtrado automático por tienda_id en todos los queries
- **Audit trail completo**: Registra quién, cuándo, cuánto, por qué, y los saldos anterior/posterior
- **Trazabilidad**: Los movimientos pueden relacionarse con pedidos, órdenes de compra, planes de producción

### Endpoints Disponibles
```
GET /api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/sede/{sedeId}
GET /api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/sede/{sedeId}/paginado
GET /api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/sede/{sedeId}/producto/{productoId}
GET /api/admin/tiendas/{tiendaId}/inventario/movimientos/productos/rango-fechas?inicio=&fin=
POST /api/admin/tiendas/{tiendaId}/inventario/movimientos/productos

GET /api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos/sede/{sedeId}
GET /api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos/sede/{sedeId}/paginado
POST /api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos
```

### Tipos de Movimiento
- **ENTRADA**: Aumenta el stock (verde)
- **SALIDA**: Disminuye el stock (rojo)

### Motivos Válidos
**Productos**:
- VENTA, PRODUCCION, COMPRA, DEVOLUCION, MERMA, CADUCIDAD, AJUSTE, TRANSFERENCIA

**Insumos**:
- COMPRA, DEVOLUCION, PRODUCCION (consumo), VENTA, MERMA, CADUCIDAD, AJUSTE (texto libre)

## ✅ Checklist de Implementación

- [x] Backend DTOs enriquecidos
- [x] Backend Services con JOIN
- [x] Backend Controllers con filtros
- [x] Frontend tabla con columnas de saldos
- [x] Frontend filtros avanzados (fecha, tipo, motivo)
- [x] Frontend colores semafóricos
- [x] Build y compilación exitosa
- [ ] Seed data poblado (depende de usuario)
- [ ] Pruebas E2E en navegador

## 🚀 Próximos Pasos

1. **Poblar la BD** con movimientos usando cualquiera de las 3 soluciones
2. **Probar filtros** en el frontend (rango de fechas, tipo, motivo)
3. **Verificar exportación** (actualmente muestra alert "en desarrollo")
4. **Implementar módulos** que generen movimientos automáticamente:
   - POS (ventas → SALIDA productos)
   - Compras (recepción → ENTRADA insumos)
   - Producción (consumo insumos → SALIDA, productos terminados → ENTRADA)
