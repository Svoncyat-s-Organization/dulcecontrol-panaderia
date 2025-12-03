# Refactorización: Módulo de Planificación de Producción

## 📋 Resumen Ejecutivo

El módulo de **Planificación** resuelve el problema crítico de las panaderías: **¿Qué y cuánto debemos hornear hoy?**

Este refactoring mejora la UX para reflejar el flujo real de trabajo de una panadería, dividido en 3 pasos secuenciales.

---

## 🎯 El Problema que Resuelve

En una panadería manual, el dueño debe adivinar cantidades diariamente:
- **Merma (Desperdicio)**: Producir de más → productos se botan
- **Quiebre de Stock**: Producir de menos → pierdes ventas

**Solución**: Automatizar la decisión usando matemáticas simples pero efectivas.

---

## 🔄 Flujo de los 3 Pasos

### ① PASO 1: Conteo Matutino (Inventario Inicial)

**¿Qué hace?**  
Antes de encender el horno, el encargado cuenta lo que quedó del día anterior.

**En el sistema:**
- Ingresan: "Quedaron 3 Tartaletas y 10 Panes Ciabatta"
- Botón: "Cargar productos del stock ideal" para pre-llenar la lista
- Campo principal: **Cantidad Física** (lo que sobró)

**Para qué sirve:**  
Establecer el **Inventario Inicial** del día. Si tu meta es 20 tartas y ya tienes 3, solo necesitas hacer 17.

---

### ② PASO 2: Generación Automática (La Fórmula Mágica)

**La Fórmula:**
```
(Stock Ideal - Lo que sobró) + Pedidos Especiales = A PRODUCIR HOY
```

**Ejemplo:**
- Stock Ideal de Baguettes: 100
- Sobraron ayer: 20
- Pedidos especiales de baguettes: 5
- **= Producir hoy: (100 - 20) + 5 = 85 baguettes**

**En el sistema:**
- Fecha de producción
- Notas opcionales para el maestro panadero
- Botón: "Calcular y generar plan de producción"

**Resultado:**
- Si el cálculo da **negativo** → Sistema dice "No produzcas esto hoy" (sobró mucho ayer)
- Si da **positivo** → Genera el plan con las cantidades exactas

---

### ③ PASO 3: Checklist del Panadero (Hoja de Ruta)

**¿Qué hace?**  
El panadero ve una lista clara de qué hornear, sin tener que preguntar.

**Visualización:**
- **Agrupado por tipo:**
  - "Stock diario" (para vitrinas)
  - "Pedido personalizado" (tortas de cumpleaños, pedidos especiales)
- Estados: `PENDIENTE` → `EN_HORNO` → `TERMINADO` → `MERMA`

**Interacción:**
1. Conforme saca productos del horno, marca "Terminar"
2. Modal pregunta: "¿Cantidad real producida?" (para ajustar si hubo merma)
3. Al confirmar, el sistema:
   - Actualiza inventario automáticamente
   - El vendedor puede empezar a vender

**Estadísticas en tiempo real:**
- Total items: 12
- ✓ Terminados: 8
- ⏳ En progreso: 3
- ✗ Merma: 1

---

## 🎨 Mejoras de UX Implementadas

### Textos Explicativos
- ✅ Tabs numerados: `① Conteo Matutino`, `② Generación Automática`, `③ Checklist del Panadero`
- ✅ Alerts con descripción de cada paso:
  - Paso 1: "¿Qué sobró ayer? Esto es tu INVENTARIO INICIAL"
  - Paso 2: "La Fórmula Mágica: (Stock Ideal - Lo que sobró) + Pedidos = A PRODUCIR"
  - Paso 3: "Hoja de Ruta del Panadero: Marca conforme saques del horno"

### Botones Mejorados
| Antes | Después |
|-------|---------|
| "Usar stock ideal" | "Cargar productos del stock ideal" + ícono ✨ |
| "Registrar conteo" | "Guardar inventario inicial" + texto "Después ve al Paso 2" |
| "Generar plan" | "Calcular y generar plan de producción" + ícono 🧮 + texto guía |

### Iconografía
- 💾 `IconDeviceFloppy`: Guardar conteo
- ✨ `IconSparkles`: Cargar automático
- 🧮 `IconCalculator`: Calcular plan
- ✓ `IconCircleCheck`: Terminar producción
- ✗ `IconCircleX`: Registrar merma
- 👁️ `IconEye`: Ver detalles de pedido personalizado

---

## 🔧 Cambios Técnicos

### API
**Agregado:**
```javascript
// productionApi.js
export const getConteoDiario = async (tiendaId, { fecha, sedeId } = {}) => {
  const params = {};
  if (fecha) params.fecha = fecha;
  if (sedeId) params.sedeId = sedeId;
  const { data } = await apiClient.get(buildConteosUrl(tiendaId), { params });
  return data;
};
```

### Query Keys
```javascript
// queryKeys.js
conteo: (tiendaId, sedeId = null, fecha = null) => 
  [...baseKey(tiendaId), 'conteo', sedeId ?? null, fecha ?? null],
```

### Manager (index.jsx)
```javascript
const conteoQuery = useQuery({
  queryKey: PRODUCTION_KEYS.conteo(tiendaId, sedeId, formattedDate),
  queryFn: () =>
    getConteoDiario(tiendaId, { fecha: formattedDate, sedeId }).catch(() => null),
  enabled: Boolean(tiendaId && sedeId),
  staleTime: 2 * 60 * 1000,
});

// Prop nueva
conteoExistente={Boolean(conteoQuery.data)}
```

---

## 📊 Estado Actual

### ✅ Completado
- [x] Análisis del flujo de panadería y definición de 3 pasos
- [x] Mejora de textos explicativos en los 3 tabs
- [x] Iconografía y botones más descriptivos
- [x] API para verificar si existe conteo del día
- [x] Integración de `conteoQuery` en el manager
- [x] Build exitoso sin errores

### 🔄 Pendiente (Próximas Iteraciones)
- [ ] **Paso 2**: Mostrar tabla con cálculo previo de la fórmula
  - Columnas: Producto | Stock Ideal | Inventario Inicial | Pedidos | = A Producir
  - InputNumber editable para ajustes manuales
  - Resaltar en rojo cantidades negativas (no producir)
  
- [ ] **Paso 3**: Mejorar checklist
  - Checkboxes en lugar de botones para marcar terminado
  - Progress bar visual mostrando % completado
  - Confetti cuando se completa el 100%
  
- [ ] **Backend**: Endpoint para obtener cálculo previo del plan antes de confirmar

- [ ] **Testing**: Actualizar tests con nueva lógica de flujo

- [ ] **Documentación**: Screenshots del flujo completo

---

## 🧪 Testing Manual

### Flujo Completo a Validar
1. **Conteo Matutino:**
   - Cargar productos del stock ideal
   - Ingresar cantidades que sobraron
   - Guardar → Verificar mensaje de éxito
   - Verificar que `conteoQuery.data` no sea null

2. **Generación del Plan:**
   - Ingresar fecha y notas opcionales
   - Calcular plan → Verificar que se ejecute `generatePlanProduccion`
   - Verificar que se invalide la query del checklist
   - Confirmar que se genera el plan en la base de datos

3. **Checklist:**
   - Ver lista agrupada por tipo (Vitrina vs Pedidos)
   - Marcar items como "Terminado"
   - Ingresar cantidad real producida (si difiere de la planificada)
   - Registrar merma si es necesario
   - Verificar que el inventario se actualiza correctamente

---

## 🎓 Conceptos Clave

### Stock Ideal
Número "meta" configurado previamente (ej: "Siempre quiero 100 baguettes al abrir")

### Inventario Inicial
Lo que quedó del día anterior (lo que se cuenta en el Paso 1)

### Pedidos Especiales
Tortas de cumpleaños, pedidos personalizados que los clientes encargaron para hoy

### Merma
Productos que se dañaron, quemaron o no se pueden vender

### Quiebre de Stock
Quedarse sin productos para vender (pérdida de ventas)

---

## 📝 Notas para el Desarrollador

- El módulo usa **Ant Design 5**: `Tabs`, `Form.List`, `Alert`, `Table`, `Modal`, `Tag`
- **TanStack Query v5**: `useQuery`, `useMutation`, `queryClient.invalidateQueries`
- Estado local: `conteoForm`, `planForm`, modales de personalizado y terminar
- Validaciones: `Form.List` requiere al menos 1 producto con `productoId` y `cantidadFisica`
- El backend maneja upsert: si ya existe un conteo del día, lo actualiza en lugar de crear duplicado

---

## 🚀 Próximos Pasos Recomendados

1. **Mostrar la fórmula visual en Paso 2** (tabla con cálculos intermedios)
2. **Progress bar en Paso 3** (motivación visual para el panadero)
3. **Validación de navegación entre pasos** (no permitir Paso 2 sin conteo)
4. **Notificaciones push** cuando el panadero termine un lote
5. **Histórico de planes** para comparar precisión de predicciones vs realidad

---

**Refactorizado por:** GitHub Copilot  
**Fecha:** 2 de Diciembre, 2025  
**Versión:** v1.0 - Mejora de UX y textos explicativos
