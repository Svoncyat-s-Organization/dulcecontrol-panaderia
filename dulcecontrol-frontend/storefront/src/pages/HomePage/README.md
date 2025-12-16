# HomePage - Storefront

## Descripción
Página principal del storefront completamente dinámica. Consume configuraciones desde el backend para mostrar Hero, Destacados y Personalización.

## Fuentes de Datos

### 1. Configuración General (`configuracion_tienda`)
- **sloganTienda**: Slogan dinámico del Hero (ej: "Dulces Momentos")
- **bannerPrincipalUrl**: Imagen del Hero
- **mensajeBienvenida**: Texto del Hero

### 2. Secciones JSON (`paginas_storefront`)

#### `home-seccion-destacados`
```json
{
  "subtitulo": "Texto descriptivo para la sección de productos destacados"
}
```

#### `home-seccion-personalizada`
```json
{
  "titulo_destacado": "Texto destacado en blanco",
  "descripcion": "Descripción completa de la sección",
  "texto_boton": "Texto del botón CTA",
  "enlace_boton": "/ruta-destino",
  "imagen_1": "https://...",
  "imagen_2": "https://..."
}
```

## Queries Utilizadas

### `productos-destacados`
- Fetch: 4 productos con `destacado: true`
- API: `getProductos({ destacado: true, size: 4 })`

### `paginas-storefront-activas`
- Fetch: Todas las páginas activas
- API: `getPaginasActivas()`
- Cache: 5 minutos
- Filtros:
  - `slug === 'home-seccion-destacados'`
  - `slug === 'home-seccion-personalizada'`

## Estructura de Secciones

### Hero Section (bg-secondary/30)
- **Título**: `config.sloganTienda` (dynamic) - dividido en primera palabra + resto ✅
- **Mensaje**: `config.mensajeBienvenida` (dynamic) ✅
- **Imagen**: `config.bannerPrincipalUrl` (dynamic) ✅
- **CTA**: Link a `/colecciones`

### Destacados Section (bg-background)
- **Título**: Hardcoded "Los Favoritos del Barrio"
- **Subtítulo**: `destacadosData.subtitulo` (dynamic) ✅
- **Productos**: Query `productos-destacados` (dynamic)
- **CTA**: Link a `/colecciones`

### Personalizada Section (bg-primary)
- **Badge**: Hardcoded "Personalización Total"
- **Título Principal**: Hardcoded "¿Tienes una idea única?"
- **Título Destacado**: `personalizadaData.titulo_destacado` (dynamic) ✅
- **Descripción**: `personalizadaData.descripcion` (dynamic) ✅
- **Texto Botón**: `personalizadaData.texto_boton` (dynamic) ✅
- **Link Botón**: `personalizadaData.enlace_boton` (dynamic) ✅
- **Imagen 1**: `personalizadaData.imagen_1` (dynamic) ✅
- **Imagen 2**: `personalizadaData.imagen_2` (dynamic) ✅

## Fallbacks

Todos los campos dinámicos tienen fallbacks predeterminados:

```javascript
// Hero
sloganTienda: config?.sloganTienda || 'Dulces Momentos'
bannerUrl: config?.bannerPrincipalUrl || 'https://images.unsplash.com/photo-1535141192574-5d4897c12636...'
mensajeBienvenida: config?.mensajeBienvenida || 'Descubre la magia de la repostería artesanal...'

// División del slogan
primerapalabra: sloganParts[0] || 'Dulces'
restoSlogan: sloganParts.slice(1).join(' ') || 'Momentos'

// Destacados
subtitulo: destacadosData.subtitulo || 'Estos son los postres que todos están pidiendo...'

// Personalizada
titulo_destacado: personalizadaData.titulo_destacado || '¡La hacemos realidad!'
descripcion: personalizadaData.descripcion || 'Sube una foto de referencia...'
texto_boton: personalizadaData.texto_boton || 'Cotizar Ahora'
enlace_boton: personalizadaData.enlace_boton || '/custom-order'
imagen_1: personalizadaData.imagen_1 || 'https://images.unsplash.com/photo-1563729784474...'
imagen_2: personalizadaData.imagen_2 || 'https://images.unsplash.com/photo-1586985289688...'
```

## Edición de Contenido

1. Ir a Backoffice → Configuración → Tienda Virtual
2. Pestaña "Secciones Home"
3. Editar **Sección Destacados** (subtitulo)
4. Editar **Sección Personalizada** (6 campos)
5. Guardar cambios
6. Storefront se actualiza automáticamente (cache 5min)

## Tecnologías
- React Query (fetch + cache)
- TiendaConfigContext (config global)
- getPaginasActivas API
- JSON.parse para contenido dinámico

## Notas Técnicas
- Los slugs deben ser exactos: `home-seccion-destacados`, `home-seccion-personalizada`
- El campo `contenido` en BD es LONGTEXT con JSON válido
- Parsing seguro con fallback: `JSON.parse(contenido || '{}')`
- Cache de 5 minutos para evitar llamadas innecesarias
