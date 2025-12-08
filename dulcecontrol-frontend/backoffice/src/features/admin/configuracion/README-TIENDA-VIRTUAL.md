# Submódulo: Tienda Virtual (CMS & Branding)

## 📖 Descripción

Este módulo le da al administrador **control total** sobre la apariencia y el contenido institucional de su página web (storefront) sin tocar código React. Gestiona branding (logos, colores), páginas dinámicas (CMS) y configuración pública (banner, horarios, redes sociales, políticas).

---

## 🎯 Objetivos

1. **Branding Dinámico**: Logo, favicon y paleta de colores personalizados.
2. **CMS Institucional**: Crear/editar páginas como "Quiénes Somos", "Términos y Condiciones", "Política de Envíos".
3. **Configuración Pública**: Banner principal, mensaje de bienvenida, horarios de atención, redes sociales y políticas de envío/devolución.
4. **Integración Storefront**: El storefront consume esta configuración vía API pública al cargar.

---

## 🗂️ Estructura de Base de Datos

### Tabla: `dominios_tienda`

Almacena el branding de la tienda (logo, favicon, colores).

```sql
CREATE TABLE dominios_tienda (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    tipo ENUM('ADMINISTRATIVO', 'TIENDA_VIRTUAL') DEFAULT 'TIENDA_VIRTUAL',
    url_dominio VARCHAR(255) NOT NULL UNIQUE,
    url_logo TEXT,  -- Logo para Navbar
    url_favicon TEXT,  -- Icono del navegador
    color_primario VARCHAR(7) DEFAULT '#000000',  -- Hex
    color_secundario VARCHAR(7) DEFAULT '#ffffff',  -- Hex
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE
);
```

### Tabla: `configuracion_tienda`

Almacena configuración pública (banner, horarios, redes sociales, políticas).

```sql
CREATE TABLE configuracion_tienda (
    tienda_id BIGINT PRIMARY KEY,
    banner_principal_url TEXT,  -- Banner del hero
    mensaje_bienvenida TEXT,  -- Mensaje debajo del título
    horario_atencion JSON,  -- {"lunes": {"abierto": true, "horario": "09:00-18:00"}}
    redes_sociales JSON,  -- {"facebook": "url", "instagram": "url"}
    politicas_envio TEXT,  -- Términos de envío
    politicas_devolucion TEXT,  -- Términos de devolución
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE
);
```

### Tabla: `paginas_storefront`

Almacena páginas dinámicas creadas por el CMS.

```sql
CREATE TABLE paginas_storefront (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tienda_id BIGINT NOT NULL,
    slug VARCHAR(100) NOT NULL,  -- URL amigable (ej: sobre-nosotros)
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,  -- HTML o Markdown
    meta_descripcion TEXT,  -- SEO
    orden_menu INTEGER DEFAULT 0,
    visible_en_menu BOOLEAN DEFAULT TRUE,
    activa BOOLEAN DEFAULT TRUE,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (tienda_id, slug),
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id) ON DELETE CASCADE
);
```

---

## 🚀 Backend (Spring Boot)

### DTOs Creados

- `BrandingResponse.java`: Logo, favicon, colores.
- `BrandingUpdateRequest.java`: Validaciones para colores (#RRGGBB).
- `ConfiguracionPublicaResponse.java`: Combina branding + config pública.
- `ConfiguracionPublicaUpdateRequest.java`: Banner, mensaje, horarios, redes, políticas.
- `PaginaStorefrontResponse.java`, `PaginaStorefrontCreateRequest.java`, `PaginaStorefrontUpdateRequest.java`: CMS.

### Services

- **`BrandingService`**: CRUD sobre `dominios_tienda` (solo tipo `TIENDA_VIRTUAL`).
- **`ConfiguracionPublicaService`**: Lee y actualiza configuración pública combinando `dominios_tienda` + `configuracion_tienda`.
- **`PaginaStorefrontService`**: CRUD completo para páginas del CMS.

### Controllers

#### Admin (Requieren autenticación)

- **`BrandingController`**  
  - `GET /api/admin/tiendas/{tiendaId}/configuracion/branding`
  - `PUT /api/admin/tiendas/{tiendaId}/configuracion/branding`

- **`ConfiguracionPublicaController`**  
  - `GET /api/admin/tiendas/{tiendaId}/configuracion/publica`
  - `PUT /api/admin/tiendas/{tiendaId}/configuracion/publica`

- **`PaginaStorefrontController`**  
  - `GET /api/admin/tiendas/{tiendaId}/paginas-storefront`
  - `GET /api/admin/tiendas/{tiendaId}/paginas-storefront/{paginaId}`
  - `POST /api/admin/tiendas/{tiendaId}/paginas-storefront`
  - `PUT /api/admin/tiendas/{tiendaId}/paginas-storefront/{paginaId}`
  - `DELETE /api/admin/tiendas/{tiendaId}/paginas-storefront/{paginaId}`

#### Público (Sin autenticación - para Storefront)

- **`TiendaPublicaController`**  
  - `GET /api/public/tienda/{tiendaId}/config` → Retorna configuración completa (branding + config pública).
  - `GET /api/public/tienda/{tiendaId}/paginas` → Lista páginas activas y visibles.
  - `GET /api/public/tienda/{tiendaId}/paginas/{slug}` → Obtiene página por slug.

---

## 🎨 Admin Frontend (React + Ant Design)

### Componentes Creados

1. **`BrandingForm`** (Pestaña 1: Apariencia)
   - Inputs para `urlLogo` y `urlFavicon`.
   - Color Pickers para `colorPrimario` y `colorSecundario`.
   - Preview en recuadros de color.

2. **`PaginasStorefrontTable`** (Pestaña 2: Páginas)
   - Tabla con columnas: título, slug, contenido (truncado), orden, visible, activa.
   - Modal para crear/editar con Form + TextArea.
   - Validaciones: slug único, patrón `^[a-z0-9-]+$`.

3. **`ConfiguracionPublicaForm`** (Pestaña 3: Configuración Pública)
   - Inputs para `bannerPrincipalUrl`, `mensajeBienvenida`.
   - TextAreas para JSON: `horarioAtencion`, `redesSociales`.
   - TextAreas para `politicasEnvio` y `politicasDevolucion`.

### Página Principal

- **`TiendaVirtualPage.jsx`**: Contiene un componente `<Tabs>` con 3 pestañas que renderizan los 3 componentes anteriores.

### Integración en Rutas

```jsx
// AdminRoutes.jsx
const TiendaVirtualPage = lazy(() => import('../../features/admin/configuracion/pages/TiendaVirtualPage.jsx'));

<Route path="configuracion/tienda-virtual" element={<TiendaVirtualPage />} />
```

**URL en Admin**: `http://localhost:5173/admin/configuracion/tienda-virtual`

---

## 🌐 Storefront (React)

### API Layer

**`tienda.api.js`**:

```javascript
export const getTiendaConfig = async () => {
  const response = await fetch(`${API_BASE_URL}/api/public/tienda/${TIENDA_ID}/config`);
  return response.json();
};
```

### Context y Hook

**`TiendaConfigContext.jsx`**:

- `TiendaConfigProvider`: Fetch configuración al montar.
- Inyecta colores como variables CSS:  
  `document.documentElement.style.setProperty('--color-primary', colorPrimario);`
- Actualiza favicon dinámicamente.
- `useTiendaConfig()`: Hook para consumir contexto.

### Integración en `main.jsx`

```jsx
<TiendaConfigProvider>
  <App />
</TiendaConfigProvider>
```

### Uso en `MainLayout.jsx`

```jsx
const { config, loading } = useTiendaConfig();

{config?.urlLogo ? (
  <img src={config.urlLogo} alt="Logo" className="h-16" />
) : (
  <span>DulceControl</span>
)}
```

### Uso en `HomePage.jsx`

```jsx
const { config } = useTiendaConfig();
const bannerUrl = config?.bannerPrincipalUrl || 'default-url';
const mensajeBienvenida = config?.mensajeBienvenida || 'texto por defecto';
```

---

## 🔄 Flujo de Trabajo

1. **Admin entra a Configuración > Tienda Virtual**.
2. **Pestaña 1 (Apariencia)**:
   - Sube logo a CDN (ej: Cloudinary), pega URL.
   - Selecciona colores con ColorPicker.
   - Guarda → Backend actualiza `dominios_tienda`.

3. **Pestaña 2 (Páginas)**:
   - Crea página "Quiénes Somos" con slug `sobre-nosotros`.
   - Escribe contenido en TextArea.
   - Define orden, visibilidad en menú, estado activo.
   - Guarda → Backend inserta en `paginas_storefront`.

4. **Pestaña 3 (Configuración Pública)**:
   - Sube banner principal, pega URL.
   - Escribe mensaje de bienvenida.
   - Define horarios y redes sociales en JSON.
   - Escribe políticas de envío/devolución.
   - Guarda → Backend actualiza `configuracion_tienda`.

5. **Storefront se recarga**:
   - `useEffect` en `TiendaConfigProvider` hace `GET /api/public/tienda/1/config`.
   - Inyecta colores en CSS, actualiza favicon.
   - `MainLayout` muestra logo dinámico.
   - `HomePage` usa banner y mensaje desde backend.

---

## 🧪 Testing

### Backend

```bash
# Desde el directorio backend
./mvnw test -Dtest=BrandingControllerTest
./mvnw test -Dtest=ConfiguracionPublicaControllerTest
./mvnw test -Dtest=PaginaStorefrontControllerTest
```

### Frontend Admin

```bash
# Desde apps/backoffice
pnpm run build
pnpm run dev
# Navegar a: http://localhost:5173/admin/configuracion/tienda-virtual
```

### Storefront

```bash
# Desde apps/storefront
pnpm run dev
# Navegar a: http://localhost:5174
# Verificar que se muestren logo, colores y banner desde el backend
```

---

## 📝 TODO / Mejoras Futuras

- [ ] **Editor Rich Text**: Integrar ReactQuill o TipTap para `contenido` en lugar de TextArea plano.
- [ ] **Upload de Imágenes**: Componente `Upload` de Ant Design integrado con CDN (Cloudinary, AWS S3).
- [ ] **Detección de Subdominio**: Reemplazar `TIENDA_ID` hardcodeado por detección automática desde `window.location.hostname`.
- [ ] **Preview en Tiempo Real**: Botón "Previsualizar" en Admin que abra modal mostrando cómo se verá el storefront.
- [ ] **Validación JSON**: Componente con CodeMirror para editar JSON de horarios/redes con validación en tiempo real.
- [ ] **SEO Avanzado**: Agregar campos `meta_keywords`, `og:image`, `og:title` para Open Graph.
- [ ] **Páginas Dinámicas en Menú**: Generar menú del storefront automáticamente desde `paginas_storefront` visibles.
- [ ] **Versionado de Páginas**: Histórico de cambios en contenido (audit trail).

---

## 📚 Documentación Relacionada

- [README-DATOS-EMPRESA.md](./README-DATOS-EMPRESA.md) - Submódulo 1: Datos de Empresa
- [README-SEDES.md](./README-SEDES.md) - Submódulo 2: Sedes (Sucursales)
- [API Endpoints](../../../resources/dulcecontrol_endpoints.md)

---

## ✅ Checklist de Integración

- [x] Backend: DTOs creados y validados
- [x] Backend: Services con lógica de negocio
- [x] Backend: Controllers Admin + Público
- [x] Backend: Compilación exitosa (523 archivos)
- [x] Frontend Admin: Componentes UI con Ant Design
- [x] Frontend Admin: Página con Tabs + Lazy Loading
- [x] Frontend Admin: Compilación exitosa
- [x] Storefront: Context + Hook `useTiendaConfig`
- [x] Storefront: Integración en MainLayout y HomePage
- [x] Storefront: Inyección de colores en CSS
- [x] Documentación: README completo

---

## 🎉 Resultado Final

El **administrador** ahora puede cambiar logo, colores, banner y contenido institucional desde el backoffice **sin tocar código**. El **storefront** consume esta configuración vía API pública y se actualiza automáticamente al recargar la página. 🚀
