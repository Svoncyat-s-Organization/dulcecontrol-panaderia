# Módulo Producción - Completado ✅

## Estado del Módulo
**100% Funcional** - Los 3 submódulos están implementados y probados.

---

## 1. Stock Ideal ✅
**Propósito**: Define las cantidades ideales de cada producto que deben estar disponibles diariamente.

**Funcionalidades**:
- ✅ Lista todos los productos (configurados y sin configurar)
- ✅ CRUD completo con lógica de merge (upsert)
- ✅ Muestra categorías de productos
- ✅ Campo cantidadIdeal editable
- ✅ Validación: cantidades >= 0

**Archivos**:
- `api/stockIdeal.api.js`
- `components/StockIdealTable/*`
- `components/StockIdealForm/*`
- `pages/StockIdealPage.jsx`

---

## 2. Planificación ✅
**Propósito**: Gestiona los planes de producción diarios con estados y seguimiento de progreso.

**Funcionalidades**:
- ✅ Ciclo de vida completo: BORRADOR → CONFIRMADO → EN_PROCESO → FINALIZADO
- ✅ CRUD de planes con fecha y tipo (STOCK_DIARIO, PEDIDO_CLIENTE)
- ✅ Edición inline de detalles (cantidad planeada/producida)
- ✅ Agrupación por tipo de plan en la UI
- ✅ Barra de progreso visual (items completados/total)
- ✅ "Marcar Listo" rápido para items individuales
- ✅ Cálculo de totales automático
- ✅ Validaciones de estado (no editar planes CONFIRMADOS+)

**Archivos**:
- `api/planificacion.api.js`
- `components/PlanProduccionTable/*`
- `components/PlanDetalleModal/*`
- `constants/estadosPlan.js`
- `utils/planificacionMappers.js`
- `pages/PlanificacionPage.jsx`

**Backend Fixes Implementados**:
- `PlanProduccionAdminService.listPlanesByTienda()` refactorizado para incluir detalles con batch loading (N+1 optimizado)
- `DetallePlanProduccionRepository` extendido con `findByPlanIdInOrderByPlanIdAscIdAsc()`
- Seed data corregida con SKUs válidos (DM-PAN-001, DM-TORTA-001)

---

## 3. Recetas ✅
**Propósito**: Define los insumos y cantidades necesarias para elaborar cada producto (explosión de materiales).

**Concepto**: Es el "Manual de Instrucciones" que traduce "Quiero vender X" en "Necesito comprar Y". Conecta Ventas (productos) con Compras (insumos).

**Funcionalidades**:
- ✅ CRUD completo de recetas
- ✅ Select de Productos (del catálogo)
- ✅ Select de Insumos (del módulo Compras)
- ✅ Cantidad requerida con 4 decimales de precisión
- ✅ 8 unidades de medida: UNIDAD, KG, G, L, ML, PAQUETE, SACO, LATA
- ✅ Notas de preparación (opcional, máx 2000 chars)
- ✅ Validación de unicidad (producto + insumo) en backend
- ✅ Formateo inteligente de cantidades ("0.5 kg", "4 und", "250 ml")

**Archivos Creados**:
```
produccion/
├── api/
│   └── recetas.api.js          # 5 funciones CRUD
├── constants/
│   └── recetasConstants.js     # UNIDADES_MEDIDA + config
├── utils/
│   └── recetasMappers.js       # 5 utilidades de formato/validación
├── components/
│   ├── RecetasTable/
│   │   ├── index.jsx           # Container con queries/mutations
│   │   └── RecetasTableView.jsx  # Vista pura con tabla
│   └── RecetaForm/
│       ├── index.jsx           # Container con form logic
│       └── RecetaFormView.jsx  # Modal con formulario
└── pages/
    └── RecetasPage.jsx         # Página principal
```

**Backend (Pre-existente)**:
- `RecetaAdminController.java` - REST endpoints completos
- `RecetaAdminService.java` - Lógica de negocio + validaciones
- `UnidadMedidaReceta.java` - Enum con 8 unidades
- Validación única: `(producto_id, insumo_id)` no puede repetirse

**Utilidades Implementadas**:
```javascript
formatCantidadConUnidad(0.5, 'KG')  // → "0.5 kg"
prepareRecetaPayload(formValues)    // → API payload
validateCantidad(cantidad)          // → true/false
groupRecetasByProducto(recetas)     // → { productoId: [recetas] }
calcularCostoReceta(receta, costoInsumo) // → Future feature
```

**Columnas de la Tabla**:
| Producto | Insumo | Cantidad Requerida | Notas | Acciones |
|----------|--------|-------------------|-------|----------|
| Pan (DM-PAN-001) | Harina (INS-001) | 0.5 kg | Mezclar bien | ✏️ 🗑️ |

**Restricciones**:
- No se puede editar `productoId` ni `insumoId` después de crear (campos disabled en modo edición)
- Backend rechaza duplicados (producto + insumo ya existe)
- Cantidad debe ser > 0.0001

---

## Arquitectura General

**Patrón**: Container/View estricto
- **Container** (`index.jsx`): Maneja queries, mutations, estado, handlers
- **View** (`*View.jsx`): Componente puro de UI, solo recibe props

**Estado Global**:
- `useTokenStore` → tiendaId (necesario para todas las queries)
- `useSedeStore` → sedeId (para filtros multisede)

**Query Keys**:
```javascript
STOCK_IDEAL_KEYS.lists(tiendaId)
PLAN_KEYS.lists(tiendaId, { fecha, tipo })
RECETA_KEYS.lists(tiendaId)
```

**Invalidaciones**:
Todos los mutations invalidan sus respectivas query keys después de éxito.

---

## Flujo del Panadero

### Día Anterior (Setup)
1. **Stock Ideal** → Define cantidades base (ej: 20 panes, 10 tortas)
2. **Recetas** → Configura insumos por producto (ej: 1 pan = 0.1kg harina + 2 und huevos)

### Día de Trabajo
3. **Planificación** → Crea plan:
   - Stock Diario: Productos del Stock Ideal
   - Pedidos Cliente: Productos adicionales bajo pedido
   
4. **Modal "Agregar Productos"**:
   - Selecciona productos
   - Define cantidad planeada
   - Guarda

5. **Plan en BORRADOR**:
   - Edita inline si necesita ajustar cantidades
   - Botón "Confirmar Plan" → cambia a CONFIRMADO

6. **Plan CONFIRMADO**:
   - Ya no se puede editar cantidades
   - Botón "Iniciar Producción" → cambia a EN_PROCESO

7. **Plan EN_PROCESO**:
   - Edición inline de `cantidadProducida`
   - Botón "Marcar Listo" por item (icono ✓ verde)
   - Barra de progreso muestra avance (ej: 3/10 items)

8. **Plan Completo** (todos los items marcados):
   - Botón "Finalizar Plan" → cambia a FINALIZADO

9. **Plan FINALIZADO**:
   - Solo lectura
   - Comparación: planeado vs producido
   - Registro histórico

---

## Validaciones Backend Corregidas

### Problema Original
`PlanProduccionAdminService.listPlanesByTienda()` devolvía planes sin detalles → Tabla mostraba columnas vacías.

### Solución Implementada
```java
// ANTES
return planes.stream()
    .map(plan -> new PlanProduccionResponse(...))
    .toList();

// DESPUÉS
List<Long> planIds = planes.stream().map(Plan::getId).toList();
List<DetallePlan> todosLosDetalles = detalleRepository.findByPlanIdInOrderByPlanIdAscIdAsc(planIds);
Map<Long, List<DetallePlan>> detallesPorPlan = todosLosDetalles.stream()
    .collect(Collectors.groupingBy(DetallePlan::getPlanId));

// Batch load productos
Set<Long> productoIds = todosLosDetalles.stream()
    .map(DetallePlan::getProductoId)
    .collect(Collectors.toSet());
Map<Long, Producto> productos = productoRepository.findByIdIn(productoIds);

return planes.stream()
    .map(plan -> {
        List<DetallePlan> detalles = detallesPorPlan.getOrDefault(plan.getId(), List.of());
        List<DetalleResponse> detallesResponse = detalles.stream()
            .map(d -> new DetalleResponse(...))
            .toList();
        return new PlanProduccionResponse(..., detallesResponse);
    })
    .toList();
```

**Beneficio**: Evita N+1 queries, carga todo en 3 queries (planes, detalles, productos).

---

## Seeds Corregidas

### Archivo: `R__12_seed_admin_produccion.sql`

**Cambios**:
- ❌ SKUs incorrectos: `'PAN-001'`, `'TORTA-001'`
- ✅ SKUs corregidos: `'DM-PAN-001'`, `'DM-TORTA-001'`

**Datos de Prueba**:
```sql
-- 4 planes creados
Plan 1: STOCK_DIARIO, BORRADOR, fecha: ayer
Plan 2: PEDIDO_CLIENTE, CONFIRMADO, fecha: hoy
Plan 3: STOCK_DIARIO, EN_PROCESO, fecha: hoy
Plan 4: STOCK_DIARIO, FINALIZADO, fecha: hace 2 días

-- Cada plan tiene 2 detalles con productos DM-PAN-001 y DM-TORTA-001
```

---

## Tecnologías

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| Frontend | React | 19.2.0 |
| UI Library | Ant Design | 6.0.0-alpha.5 |
| Data Fetching | TanStack Query | 5.90.10 |
| Estado Global | Zustand | 5.0.8 |
| Iconos | Tabler Icons | 3.30.0 |
| Backend | Spring Boot | 3.5.5 |
| Java | OpenJDK | 17 |
| Base de Datos | MySQL | 8.0 |

---

## Próximos Pasos (Futuro)

### Fase 2: Analytics
- Dashboard de producción (tendencias, eficiencia)
- Comparación planeado vs producido (gráficos)
- Alertas de desperdicio (producido < planeado)

### Fase 3: Integración
- Auto-calcular compras desde Recetas (explosión de materiales)
- Sincronizar inventario al finalizar plan
- Notificaciones de stock bajo

### Fase 4: Optimización
- Sugerencias de producción basadas en histórico
- ML para predecir demanda
- Optimización de batch sizes

---

## Comandos Útiles

### Desarrollo
```bash
cd /home/svonccy/workspaces/dulcecontrol-panaderia/dulcecontrol-frontend/apps/backoffice
pnpm dev
```

### Build
```bash
pnpm build
```

### Backend
```bash
cd /home/svonccy/workspaces/dulcecontrol-panaderia/dulcecontrol-backend
./mvnw spring-boot:run
```

### Base de Datos
```bash
mysql -u root -p52845284 dulcecontrol_db < archivo.sql
```

---

## Contacto de Desarrollo
- Usuario: svonccy
- Workspace: `/home/svonccy/workspaces/dulcecontrol-panaderia`
- Frontend: `dulcecontrol-frontend/apps/backoffice`
- Backend: `dulcecontrol-backend`

---

**Fecha de Completación**: 2024
**Estado**: ✅ PRODUCCIÓN LISTO
