# Módulo de Producción

## 📁 Estructura del Módulo

```
produccion/
├── api/
│   ├── stockIdeal.api.js           # API client Stock Ideal
│   └── planProduccion.api.js       # API client Planificación y Conteos
├── components/
│   ├── StockIdealTable/            # Submódulo Stock Ideal
│   │   ├── index.jsx               # Container
│   │   └── StockIdealTableView.jsx # View
│   ├── StockIdealForm/
│   │   ├── index.jsx
│   │   └── StockIdealFormView.jsx
│   ├── PlanProduccionTable/        # Submódulo Planificación
│   │   ├── index.jsx               # Container
│   │   └── PlanProduccionTableView.jsx # View
│   └── PlanDetalleModal/
│       ├── index.jsx               # Container
│       └── PlanDetalleModalView.jsx # View (Checklist del panadero)
├── constants/
│   ├── queryKeys.js                # Query keys para TanStack Query
│   └── planProduccionConstants.js  # Estados y configuraciones
├── pages/
│   ├── StockIdealPage.jsx
│   ├── PlanificacionPage.jsx
│   └── RecetasPage.jsx
└── utils/
    ├── stockIdealMappers.js
    └── planProduccionMappers.js    # Lógica de planificación
```

---

## 📦 Submódulo: Stock Ideal

### Funcionalidades

- **Listado completo**: Muestra TODOS los productos activos
- **Merge inteligente**: Mezcla productos con configuración de stock ideal
- **Productos sin configurar**: Aparecen con valores en 0, listos para configurar (Upsert)
- **Filtrado por sede**: Solo muestra data de la sede seleccionada
- **Estados visuales**: Pendiente | Configurado | Deshabilitado

### Reglas de Negocio

1. Stock Ideal debe ser ≥ Punto de Reposición
2. Merge de productos con stock ideal (sin configuración = 0)
3. Filtrado obligatorio por sede
4. Solo productos activos

---

## 📋 Submódulo: Planificación de Producción

### Funcionalidades Implementadas

#### **Vista Principal (PlanProduccionTable)**
✅ Listado de planes por sede  
✅ Visualización de estado del plan (Borrador, Confirmado, En Proceso, Finalizado)  
✅ Separación visual de items: Stock Diario vs Pedidos Cliente  
✅ Barra de progreso de producción en tiempo real  
✅ Totales: Planificado, Producido, Merma  
✅ Acciones contextuales por estado:
  - BORRADOR → Confirmar | Cancelar
  - CONFIRMADO → Iniciar Producción
  - EN_PROCESO → Finalizar

#### **Modal de Detalle (Checklist del Panadero)**
✅ Vista completa del plan con detalles por origen  
✅ Tabla separada para Stock Diario (📦)  
✅ Tabla separada para Pedidos Cliente (🎂)  
✅ Edición inline de items:
  - Cantidad producida
  - Cantidad de merma
  - Estado (Pendiente | En Horno | Terminado | Merma)
  - Observaciones
✅ Botón rápido "Marcar Listo" (completa cantidad planificada)  
✅ Validación: Solo editable en estado CONFIRMADO o EN_PROCESO  
✅ Estadísticas en tiempo real

### Reglas de Negocio Implementadas

1. **Ciclo de Vida del Plan**
   - BORRADOR: Generado, pendiente revisión (Admin debe confirmar)
   - CONFIRMADO: Aprobado, visible para el panadero
   - EN_PROCESO: Producción iniciada, registra hora de inicio
   - FINALIZADO: Completado, registra hora de fin
   - CANCELADO: Descartado

2. **Origen de Items**
   - STOCK_DIARIO: Productos anónimos para vitrina
   - PEDIDO_CLIENTE: Vinculados a pedido específico (muestra #Pedido)

3. **Registro de Realidad vs Planificación**
   - Cantidad Planificada (objetivo)
   - Cantidad Producida (real)
   - Cantidad Merma (diferencia negativa)

4. **Validaciones**
   - Solo BORRADOR puede confirmarse
   - Solo CONFIRMADO puede iniciarse
   - Items editables solo en planes activos

### Integración Backend

**Endpoints utilizados:**
- `GET /api/admin/tiendas/{tiendaId}/produccion/planes-produccion?sedeId={sedeId}`
- `GET /api/admin/tiendas/{tiendaId}/produccion/planes-produccion/{fecha}/detalles?sedeId={sedeId}`
- `PATCH /api/admin/tiendas/{tiendaId}/produccion/planes-produccion/{planId}`
- `PATCH /api/admin/tiendas/{tiendaId}/produccion/planes-produccion/detalles/{detalleId}`

---

## 🏗️ Cumplimiento Arquitectura (100%)

| Requisito | Estado |
|-----------|--------|
| Patrón Container/View | ✅ Estricto |
| API Layer con `apiClient` | ✅ Implementado |
| TanStack Query | ✅ Usado correctamente |
| Ant Design UI | ✅ 100% |
| Todo en `features/admin/produccion/` | ✅ Sí |
| Zero lógica en Views | ✅ Solo props |
| Utils para lógica pura | ✅ Separado |
| Constants para query keys | ✅ Centralizado |
| Sin breadcrumbs duplicados | ✅ Usa layout |

---

## 🔜 Próximo Submódulo

- **Recetas**: Gestión de insumos por producto
