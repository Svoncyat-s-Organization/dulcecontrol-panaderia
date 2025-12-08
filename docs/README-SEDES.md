# Submódulo: Sedes (Sucursales)

## 📋 Descripción General

El módulo de Sedes permite gestionar las sucursales físicas de la tienda. Es fundamental para operaciones multisede, ya que cada local mantiene su propio inventario, cajas y personal asignado.

## 🎯 Funcionalidades Implementadas

### Backend (Spring Boot)

#### Entidades Creadas
1. **UbigeoDepartamento** (`shared/ubigeo/entity`)
   - Departamentos del Perú (Lima, Arequipa, etc.)
   
2. **UbigeoProvincia** (`shared/ubigeo/entity`)
   - Provincias por departamento
   
3. **UbigeoDistrito** (`shared/ubigeo/entity`)
   - Distritos por provincia (necesario para SUNAT)

#### DTOs
1. **SedeResponse** - Respuesta completa con datos de ubicación
2. **SedeCreateRequest** - Creación con validaciones:
   - Código interno: Solo mayúsculas, números y guiones (max 50)
   - Nombre: Obligatorio (max 100)
   - Dirección: Obligatoria
   - Teléfono: Formato válido (max 50)
   - DistritoId: Obligatorio (FK a ubigeo_distritos)
   
3. **SedeUpdateRequest** - Actualización con validaciones similares

#### Repositories
1. **SedeAdminRepository** - Queries especializadas:
   - `findByTiendaIdOrderByEsPrincipalDescNombreAsc`
   - `existsByTiendaIdAndNombre`
   - `existsOtraSedePrincipal`
   
2. **Repositories de Ubigeo** (UbigeoDepartamento, Provincia, Distrito)

#### Services
1. **SedeAdminService** - Lógica de negocio:
   - ✅ Solo una sede principal por tienda
   - ✅ Nombres únicos dentro de la tienda
   - ✅ Códigos internos únicos
   - ✅ Validación de distrito existe
   - ✅ No desactivar sede principal si hay otras activas
   - ✅ No eliminar sede principal
   
2. **UbigeoService** - Consultas en cascada para selección geográfica

#### Controllers
1. **SedeAdminController** (`/api/admin/tiendas/{tiendaId}/configuracion/sedes`)
   - `GET /` - Lista todas las sedes
   - `GET /{sedeId}` - Obtiene una sede específica
   - `POST /` - Crea nueva sede
   - `PUT /{sedeId}` - Actualiza sede
   - `DELETE /{sedeId}` - Elimina sede permanentemente
   - `PUT /{sedeId}/desactivar` - Desactiva sede (soft delete)
   
2. **UbigeoController** (`/api/ubigeo`)
   - `GET /departamentos` - Lista departamentos
   - `GET /departamentos/{id}/provincias` - Provincias de un departamento
   - `GET /provincias/{id}/distritos` - Distritos de una provincia

### Frontend (React)

#### API Layer
1. **sedes.api.js** - Funciones CRUD:
   - `getSedes(tiendaId)`
   - `getSede(tiendaId, sedeId)`
   - `createSede(tiendaId, payload)`
   - `updateSede(tiendaId, sedeId, payload)`
   - `deleteSede(tiendaId, sedeId)`
   - `desactivarSede(tiendaId, sedeId)`
   
2. **ubigeo.api.js** - Consultas geográficas:
   - `getDepartamentos()`
   - `getProvinciasByDepartamento(departamentoId)`
   - `getDistritosByProvincia(provinciaId)`

#### Componentes
1. **UbigeoSelector** - Selector en cascada:
   - Departamento → Provincia → Distrito
   - Búsqueda con filtro
   - Deshabilitación condicional
   
2. **SedesTable** (Container/View):
   - **index.jsx** (Container): Lógica con TanStack Query
   - **SedesTableView.jsx** (View): UI pura con Ant Design
   - Tabla con columnas: Código, Nombre, Dirección, Teléfono, Estado
   - Modal para crear/editar con formulario completo
   - Confirmación antes de desactivar/eliminar

#### Páginas
- **SedesPage.jsx** - Ensamblador simple que renderiza SedesTable

#### Rutas
- `/admin/configuracion/sedes` - Gestión de sedes (ya integrada en AdminRoutes)

## 🔧 Reglas de Negocio Implementadas

### Validación en Creación
1. ✅ Nombre único dentro de la tienda
2. ✅ Código interno único dentro de la tienda
3. ✅ Solo una sede principal por tienda
4. ✅ Distrito debe existir en catálogo de Ubigeo

### Validación en Actualización
1. ✅ Nombre único (excepto la propia sede)
2. ✅ Código interno único (excepto la propia sede)
3. ✅ Si se marca como principal, no puede haber otra principal activa

### Validación en Desactivación
1. ✅ No se puede desactivar la sede principal si hay otras sedes activas
2. ✅ Modal de confirmación antes de desactivar

### Validación en Eliminación
1. ✅ No se puede eliminar la sede principal
2. ⏳ TODO: Validar que no tenga cajas abiertas
3. ⏳ TODO: Validar que no tenga usuarios activos asignados
4. ✅ Modal de confirmación antes de eliminar

## 📊 Estructura de Base de Datos

### Tabla: sedes
```sql
id BIGINT PRIMARY KEY
tienda_id BIGINT (FK -> tiendas)
codigo_interno VARCHAR(50)
nombre VARCHAR(100) NOT NULL
direccion TEXT NOT NULL
telefono VARCHAR(50)
distrito_id BIGINT (FK -> ubigeo_distritos)
es_principal BOOLEAN DEFAULT FALSE
activo BOOLEAN DEFAULT TRUE
creado_en DATETIME
actualizado_en DATETIME
eliminado_en DATETIME (Soft Delete)
```

### Tablas de Ubigeo
- `ubigeo_departamentos` (id, nombre, codigo_ubigeo)
- `ubigeo_provincias` (id, departamento_id, nombre, codigo_ubigeo)
- `ubigeo_distritos` (id, provincia_id, nombre, codigo_ubigeo)

## 🚀 Uso

### Crear una Sede
1. Clic en botón "Nueva Sede"
2. Llenar formulario:
   - Código interno (ej: DM-001)
   - Nombre (ej: "Sede Principal - Miraflores")
   - Dirección completa
   - Seleccionar Ubigeo en cascada
   - Teléfono (opcional)
   - Marcar como "Sede Principal" si aplica
3. Guardar

### Editar una Sede
1. Clic en ícono de editar en la tabla
2. Modificar campos necesarios
3. Activar/Desactivar sede con switch
4. Guardar

### Desactivar una Sede
1. Clic en ícono de desactivar (⛔)
2. Confirmar en modal
3. La sede pasa a estado "Inactivo"

### Eliminar una Sede
1. Clic en ícono de eliminar (🗑️)
2. Confirmar en modal
3. Eliminación permanente (no se puede deshacer)

## 🎨 Características de UI

1. **Tabla Responsive**: Scroll horizontal para pantallas pequeñas
2. **Búsqueda**: Filtro por cualquier columna
3. **Paginación**: 10 sedes por página (configurable)
4. **Estados Visuales**:
   - Tag verde: Activo
   - Tag gris: Inactivo
   - Corona dorada: Sede Principal
5. **Validaciones en Tiempo Real**: Formulario con feedback inmediato

## 🔗 Integración con Otros Módulos

### Inventario
- Cada sede tiene su propio inventario de productos e insumos
- Al crear una sede nueva, se inicializa con stock 0 de todos los productos

### Seguridad (Usuarios)
- Los usuarios se asignan a sedes específicas
- Un usuario puede tener acceso a múltiples sedes
- El selector de sede en el header filtra según permisos

### Ventas (Cajas)
- Cada sede puede tener múltiples cajas
- Las ventas se registran vinculadas a una sede específica

### Facturación (Series)
- Cada sede debe tener sus propias series de comprobantes
- El código anexo SUNAT se configura por sede (0000 para principal, 0001+ para sucursales)

## ⚠️ Consideraciones Importantes

1. **Sede Principal**: Siempre debe existir al menos una sede principal activa
2. **Ubigeo SUNAT**: La selección de distrito es obligatoria para cumplir con requisitos de facturación electrónica
3. **Eliminación**: Solo se puede eliminar una sede si no tiene movimientos asociados
4. **Código Interno**: Se recomienda usar un formato como "XX-NNN" donde XX son las iniciales y NNN es un correlativo

## 📝 TODO / Mejoras Futuras

1. ⏳ Validar que no se pueda eliminar sede con cajas abiertas
2. ⏳ Validar que no se pueda eliminar sede con usuarios asignados
3. ⏳ Agregar configuración de series de comprobantes por sede
4. ⏳ Agregar campo `codigo_anexo_sunat` a la tabla sedes
5. ⏳ Implementar transferencias de inventario entre sedes
6. ⏳ Agregar geolocalización (latitud/longitud) para mapas
7. ⏳ Exportar listado de sedes a Excel/PDF

## 🧪 Testing

### Backend
```bash
cd dulcecontrol-backend
./mvnw clean compile -DskipTests
```

### Frontend
```bash
cd dulcecontrol-frontend/apps/backoffice
pnpm run build
```

## 📚 Referencias

- **SRS**: Requisitos RF-SED-GES-001, RF-SED-GES-002
- **Base de Datos**: V3__superadmin_tiendas.sql
- **Seeds**: R__03_seed_superadmin_tiendas.sql
- **Ubigeo**: V1__base_ubigeo.sql, R__01_seed_ubigeo.sql
