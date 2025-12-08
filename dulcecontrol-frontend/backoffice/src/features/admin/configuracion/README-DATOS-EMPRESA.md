# Submódulo: Datos de Empresa (Identidad Fiscal)

## 📋 Descripción

Submódulo del sistema de Configuración que permite al Administrador de la tienda gestionar la información legal, fiscal y operativa de su empresa. Esta información es crítica para:
- Emisión de comprobantes de pago (Boletas/Facturas)
- Integración con SUNAT para facturación electrónica
- Cumplimiento de obligaciones tributarias

---

## 🏗️ Arquitectura

### **Backend (`dulcecontrol-backend`)**

#### Ubicación
```
src/main/java/com/dulcecontrol/bakery/features/admin/configuracion/
├── controller/
│   └── DatosEmpresaController.java
├── dto/
│   ├── DatosEmpresaResponse.java
│   └── DatosEmpresaUpdateRequest.java
├── repository/
│   └── DominioTiendaAdminRepository.java
└── service/
    ├── IDatosEmpresaService.java
    └── impl/
        └── DatosEmpresaService.java
```

#### Tablas Utilizadas
- **`tiendas`**: Datos básicos (RUC, Razón Social, Nombre Comercial, Contacto)
- **`configuracion_tienda`**: Datos fiscales y SUNAT (Dirección Fiscal, Ubigeo, Usuario SOL, Certificado, IGV)
- **`dominios_tienda`**: Logo de la empresa (url_logo)

#### Endpoints

**GET** `/api/admin/tiendas/{tiendaId}/configuracion/datos-empresa`
- Obtiene todos los datos de empresa unificados
- **Response**: `DatosEmpresaResponse`
- **Nota**: La clave SOL NO se expone por seguridad

**PUT** `/api/admin/tiendas/{tiendaId}/configuracion/datos-empresa`
- Actualiza los datos de empresa
- **Body**: `DatosEmpresaUpdateRequest`
- **Validaciones**:
  - RUC: Exactamente 11 dígitos numéricos
  - Ubigeo: Exactamente 6 dígitos
  - Modo SUNAT: Solo `PRUEBAS` o `PRODUCCION`
  - Tasa IGV: Entre 0 y 100

#### Lógica de Negocio

1. **Unificación de Datos**: El service consulta 3 tablas y unifica la respuesta
2. **Encriptación de Clave SOL**: 
   - Solo se encripta y guarda si el usuario envía una nueva
   - Se usa `BCryptPasswordEncoder`
3. **Actualización Transaccional**: 
   - Actualiza `tiendas`, `configuracion_tienda` y `dominios_tienda` en una sola transacción
   - Si `configuracion_tienda` no existe, la crea automáticamente

---

### **Frontend (`dulcecontrol-frontend/apps/backoffice`)**

#### Ubicación
```
src/features/admin/configuracion/
├── api/
│   └── datos-empresa.api.js
├── components/
│   └── DatosEmpresaForm/
│       ├── index.jsx (Container - Lógica)
│       └── DatosEmpresaFormView.jsx (View - UI)
├── constants/
│   └── queryKeys.js
└── pages/
    └── DatosEmpresaPage.jsx (Ensamblador)
```

#### Patrón Container/View

**Container (`index.jsx`)**:
- Maneja `useQuery` para cargar datos
- Maneja `useMutation` para actualizar
- Muestra modal de confirmación antes de guardar
- Pasa datos y funciones al View por props

**View (`DatosEmpresaFormView.jsx`)**:
- Renderiza formulario Ant Design
- 4 secciones en Cards:
  1. 📋 Identidad Legal
  2. 🏢 Datos Fiscales
  3. 🔐 Configuración SUNAT
  4. ⚙️ Parámetros Globales
- NO tiene lógica de negocio

#### Ruta
```
/admin/configuracion/datos-empresa
```

---

## 🔐 Reglas de Seguridad

### Clave SOL (Campo Crítico)
1. **NO se muestra** el valor actual en el formulario (campo vacío con placeholder `********`)
2. **Solo se actualiza** si el usuario escribe algo nuevo
3. **Se encripta** con BCrypt en el backend antes de guardar
4. El payload solo incluye `claveSunatSol` si no está vacía

### Validaciones Frontend
```javascript
// RUC: Exactamente 11 dígitos
pattern: /^\d{11}$/

// Ubigeo: Exactamente 6 dígitos
pattern: /^\d{6}$/

// Email: Formato válido
type: 'email'

// Tasa IGV: 0-100 con 2 decimales
min: 0, max: 100, precision: 2
```

---

## 🎯 Funcionalidades Implementadas

### ✅ CRUD Completo
- [x] **Consulta**: GET datos de empresa
- [x] **Actualización**: PUT con validaciones
- [ ] **Creación**: No aplica (se crea automáticamente con la tienda)
- [ ] **Eliminación**: No aplica (datos críticos)

### ✅ Validaciones
- [x] RUC de 11 dígitos
- [x] Ubigeo de 6 dígitos
- [x] Formato de correo
- [x] Rango de IGV (0-100%)
- [x] Modo SUNAT (PRUEBAS/PRODUCCION)

### ✅ Seguridad
- [x] Encriptación de Clave SOL
- [x] No exposición de credenciales
- [x] Modal de confirmación antes de guardar

### ⚠️ Pendientes
- [ ] Upload de Certificado Digital (.p12/.pfx)
- [ ] Upload de Logo
- [ ] Selector de Ubigeo (autocomplete desde BD)
- [ ] Validación RUC con API de SUNAT

---

## 🚀 Cómo Usar

### 1. Acceder al Módulo
```
Panel Admin → Configuración → Datos de Empresa
```

### 2. Editar Campos
- Completar información legal (RUC, Razón Social, etc.)
- Si desea cambiar la Clave SOL, escribirla en el campo de contraseña
- Dejar vacío si NO desea cambiarla

### 3. Guardar Cambios
- Click en "Guardar Cambios"
- Confirmar en el modal
- Los cambios afectan a futuros comprobantes (históricos intactos)

---

## 📊 Diagrama de Flujo

```
┌─────────────┐
│   Usuario   │
│   (Admin)   │
└──────┬──────┘
       │
       │ Accede /configuracion/datos-empresa
       ▼
┌─────────────────────┐
│  DatosEmpresaPage   │ ← Ensamblador
└──────┬──────────────┘
       │
       │ Renderiza
       ▼
┌─────────────────────┐
│ DatosEmpresaForm    │ ← Container
│   (index.jsx)       │
└──────┬──────────────┘
       │
       │ useQuery → GET /api/admin/tiendas/{id}/configuracion/datos-empresa
       ▼
┌─────────────────────┐
│     Backend         │
│ DatosEmpresaService │
└──────┬──────────────┘
       │
       │ Consulta tiendas + configuracion_tienda + dominios_tienda
       ▼
┌─────────────────────┐
│  DatosEmpresaForm   │
│   View.jsx          │ ← Presentacional
└──────┬──────────────┘
       │
       │ Usuario edita y envía formulario
       ▼
┌─────────────────────┐
│ DatosEmpresaForm    │
│   (index.jsx)       │ ← Mutation
└──────┬──────────────┘
       │
       │ useMutation → PUT /api/admin/tiendas/{id}/configuracion/datos-empresa
       ▼
┌─────────────────────┐
│     Backend         │
│ DatosEmpresaService │
│  - Valida RUC       │
│  - Encripta Clave   │
│  - Actualiza 3 tablas│
└─────────────────────┘
```

---

## 🧪 Testing

### Backend
```bash
# Ejecutar tests del service
./mvnw test -Dtest=DatosEmpresaServiceTest
```

### Frontend
```bash
# Ejecutar aplicación en desarrollo
cd dulcecontrol-frontend/apps/backoffice
pnpm dev
```

Navegar a: `http://localhost:5173/admin/configuracion/datos-empresa`

---

## 📝 Notas Técnicas

1. **¿Por qué 3 tablas?**
   - `tiendas`: Datos básicos (creados por SuperAdmin)
   - `configuracion_tienda`: Extensión fiscal (editable por Admin)
   - `dominios_tienda`: Branding (compartido con Storefront)

2. **¿Por qué BCrypt para Clave SOL?**
   - Aunque es una clave externa (SUNAT), la almacenamos encriptada por seguridad
   - Si la BD es comprometida, las credenciales no son legibles

3. **¿Qué pasa si configuro mal el Modo SUNAT?**
   - `PRUEBAS`: Los comprobantes van al servidor beta de SUNAT
   - `PRODUCCION`: Los comprobantes son oficiales y legales
   - **Cuidado**: Cambiar de producción a pruebas puede causar problemas con series

---

## 🔄 Próximos Pasos

### Mejoras Planificadas
1. **Upload de Archivos**: Implementar subida segura de certificados y logos
2. **Selector de Ubigeo**: Componente de búsqueda con las tablas `ubigeo_*`
3. **Validación RUC Online**: Consultar API de SUNAT para verificar RUC
4. **Historial de Cambios**: Auditar cambios en datos fiscales

---

## 👥 Responsables

- **Backend**: Sistema de configuración
- **Frontend**: Módulo Admin/Configuración
- **Revisión**: @Ayala (según repartición.md)

---

**Fecha de Implementación**: Diciembre 2025  
**Estado**: ✅ Completado (v1.0)
