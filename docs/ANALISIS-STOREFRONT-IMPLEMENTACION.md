# 📊 Análisis de Implementación: Storefront DulceControl

## 🎯 Resumen Ejecutivo

Este documento presenta el análisis completo del wireframe actual del storefront, su relación con el backend/base de datos existente, y el plan detallado de implementación para convertir el prototipo en una aplicación completamente funcional e integrada.

---

## 📂 1. Inventario del Wireframe Actual

### 1.1 Páginas Existentes (11 páginas)

| Página | Ruta | Estado Actual | Datos |
|--------|------|--------------|-------|
| **HomePage** | `/` | ✅ Diseñada | Mock data para productos destacados, banner hardcoded |
| **ProductsPage** | `/colecciones` | ✅ Diseñada | 12 productos mock agrupados por categoría |
| **CategoryPage** | `/colecciones/:slug` | ✅ Diseñada | Filtros mock, datos estáticos |
| **ProductDetailPage** | `/producto/:id` | ✅ Diseñada | Datos mock, sin lógica de personalización |
| **CustomOrderPage** | `/custom-order` | ✅ Diseñada | Formulario sin backend |
| **CheckoutPage** | `/checkout` | ✅ Diseñada | Sedes hardcoded, sin integración de pago |
| **LoginPage** | `/login` | ✅ Diseñada | Form sin auth backend |
| **RegisterPage** | `/register` | ✅ Diseñada | Form sin backend |
| **MyPurchasesPage** | `/mis-compras` | ✅ Diseñada | Mock data de 3 pedidos |
| **AboutPage** | `/sobre-nosotros` | ⚠️ Estático | HTML hardcoded (reemplazar con CMS) |
| **ContactPage** | `/contactanos` | ⚠️ Estático | Datos hardcoded (reemplazar con CMS) |

### 1.2 Componentes Reutilizables

| Componente | Ubicación | Función | Estado |
|------------|-----------|---------|--------|
| **ProductCard** | `/components/ProductCard.jsx` | Tarjeta visual de producto con hover | ✅ Funcional |
| **CartSheet** | `/components/CartSheet.jsx` | Panel lateral del carrito (Zustand) | ✅ Funcional con Zustand |
| **CollectionCarousel** | `/components/CollectionCarousel.jsx` | Carrusel de categorías/productos | ✅ Funcional |
| **MainLayout** | `/layout/MainLayout.jsx` | Header + Footer + Outlet | ✅ Con useTiendaConfig |

### 1.3 Estado Global (Zustand)

**useCartStore** (`/store/useCartStore.js`):
```javascript
items: []              // Productos en carrito
addItem(product, quantity)
removeItem(productId)
updateQuantity(productId, quantity)
clearCart()
getTotalItems()
getTotalPrice()
```

**Características**:
- ✅ Persistencia en localStorage (`dulcecontrol-cart`)
- ✅ Funciones CRUD completas
- ⚠️ **Faltante**: No guarda datos de personalización (dedicatoria, sabor, foto)

### 1.4 Context Existente

**TiendaConfigContext** (`/context/TiendaConfigContext.jsx`):
- ✅ Fetch de config en mount desde `/api/public/tienda/1/config`
- ✅ Inyección de CSS variables (colores)
- ✅ Actualización de favicon dinámico
- ✅ Hook `useTiendaConfig()` → `{ config, loading, error }`

---

## 🗄️ 2. Análisis de Base de Datos

### 2.1 Tablas del Catálogo (Productos)

#### **categorias**
```sql
id BIGINT PRIMARY KEY
tienda_id BIGINT (FK)
nombre TEXT NOT NULL
slug TEXT NOT NULL (UNIQUE per tienda)
descripcion TEXT
url_imagen TEXT
icono TEXT
activa BOOLEAN (DEFAULT TRUE)
orden_visual INTEGER
```

**Uso Storefront**:
- HomePage: Carrusel de categorías con `url_imagen`
- ProductsPage: Agrupación de productos por categoría
- CategoryPage: Hero image + descripción

#### **productos**
```sql
id BIGINT PRIMARY KEY
tienda_id BIGINT (FK)
categoria_id BIGINT (FK nullable)
nombre TEXT NOT NULL
slug TEXT NOT NULL (UNIQUE per tienda)
sku TEXT NOT NULL (UNIQUE per tienda)
descripcion TEXT
tipo tipos_producto (DEFAULT 'producto_terminado')
es_personalizable BOOLEAN (DEFAULT FALSE) 🎨 ← CLAVE para "Spiderman Logic"
precio_base_centimos BIGINT
precio_oferta_centimos BIGINT (nullable)
visible_en_pos BOOLEAN
visible_en_storefront BOOLEAN 🌐 ← Filtro principal
destacado_storefront BOOLEAN 🌟 ← Para "Best Sellers"
url_imagen_principal TEXT
imagenes_galeria JSONB (array de URLs)
atributos JSONB (open schema)
activo BOOLEAN
```

**Campos Críticos para Storefront**:
1. **es_personalizable**: Si TRUE → Mostrar form de personalización
2. **visible_en_storefront**: Filtro de productos públicos
3. **destacado_storefront**: Productos de HomePage hero
4. **precio_oferta_centimos**: Si no NULL → Mostrar badge "OFERTA"

### 2.2 Tablas de Pedidos

#### **pedidos**
```sql
id BIGINT PRIMARY KEY
codigo_pedido TEXT NOT NULL (UNIQUE per tienda)
tienda_id BIGINT (FK)
sede_origen_id BIGINT (FK)
cliente_id BIGINT (FK nullable)
origen origenes_pedido (ENUM: 'storefront', 'pos', 'whatsapp', etc.)
sesion_caja_id BIGINT (nullable para storefront)
vendedor_id BIGINT (nullable para storefront)
estado_pedido estados_pedido (DEFAULT 'pendiente_pago')
estado_pago estados_pago_pedido (DEFAULT 'pendiente')
tipo_entrega tipos_entrega (DEFAULT 'recojo_tienda')
fecha_entrega_pactada TIMESTAMPTZ
direccion_entrega TEXT (nullable si recojo_tienda)
costo_delivery_centimos BIGINT
subtotal_items_centimos BIGINT
descuento_total_centimos BIGINT
impuestos_totales_centimos BIGINT
total_final_centimos BIGINT
monto_pagado_centimos BIGINT
saldo_pendiente_centimos INT (GENERATED)
requiere_comprobante BOOLEAN
notas_pedido TEXT
```

**Estados para Storefront UI**:
```sql
-- estados_pedido ENUM
'pendiente_pago'      → Gris (No pagado)
'confirmado'          → Azul (Pago confirmado)
'en_produccion'       → Naranja (En Horno)
'listo_recoger'       → Verde (Listo)
'entregado'           → Verde oscuro (Completado)
'cancelado'           → Rojo
```

#### **detalles_pedido**
```sql
id BIGINT PRIMARY KEY
pedido_id BIGINT (FK)
producto_id BIGINT (FK)
cantidad INTEGER
precio_unitario_centimos BIGINT
subtotal_linea_centimos BIGINT
notas_item TEXT
```

#### **personalizaciones_item_pedido** 🎨 ← SPIDERMAN LOGIC
```sql
id BIGINT PRIMARY KEY
detalle_pedido_id BIGINT (FK UNIQUE) ← 1:1 con detalles_pedido
descripcion_solicitud TEXT
texto_dedicatoria TEXT
imagenes_referencia JSONB (array de URLs)
sabor_masa TEXT
sabor_relleno TEXT
tematica TEXT
fecha_limite_produccion TIMESTAMPTZ
costo_extra_personalizacion_centimos BIGINT
```

**Flujo Personalización**:
1. Usuario ve producto con `es_personalizable = TRUE`
2. Form aparece en ProductDetailPage
3. Al agregar al carrito: Se guarda personalizationData en item
4. En checkout: Backend crea `detalles_pedido` + `personalizaciones_item_pedido`

#### **pagos_pedido**
```sql
id BIGINT PRIMARY KEY
pedido_id BIGINT (FK)
monto_pagado_centimos BIGINT
metodo_pago metodos_pago (ENUM)
referencia_externa TEXT (para Yape/Plin/Stripe)
fecha_pago TIMESTAMPTZ
```

**Métodos de Pago para Storefront**:
```sql
'efectivo'
'yape'
'plin'
'tarjeta_credito'
'tarjeta_debito'
'transferencia'
```

### 2.3 Tablas de Clientes

#### **clientes**
```sql
id BIGINT PRIMARY KEY
tienda_id BIGINT (FK)
tipo_doc tipos_documento (nullable)
numero_doc TEXT (nullable)
nombre_doc TEXT NOT NULL
email CITEXT (UNIQUE per tienda)
telefono TEXT
es_usuario_virtual BOOLEAN (DEFAULT FALSE)
hash_contrasena TEXT (nullable si es_usuario_virtual)
activo BOOLEAN
```

**Notas**:
- **es_usuario_virtual = TRUE**: Cliente sin cuenta (checkout como guest)
- **hash_contrasena no NULL**: Cliente registrado (puede ver MyPurchasesPage)

#### **direcciones_pedido** (tabla separada de direcciones_cliente)
```sql
id BIGINT PRIMARY KEY
pedido_id BIGINT (FK)
tipo_direccion TEXT ('facturacion' o 'envio')
nombre_contacto TEXT
telefono_contacto TEXT
email_contacto TEXT
direccion_completa TEXT
referencia TEXT
distrito, provincia, departamento TEXT
```

---

## 🔌 3. Backend Existente

### 3.1 Endpoints Públicos Implementados (Submódulo 3)

✅ **TiendaPublicaController**:
```java
GET /api/public/tienda/{tiendaId}/config
  → Retorna: ConfiguracionPublicaResponse (branding + config)
  
GET /api/public/tienda/{tiendaId}/paginas
  → Retorna: List<PaginaStorefrontResponse> (solo activas)
  
GET /api/public/tienda/{tiendaId}/paginas/{slug}
  → Retorna: PaginaStorefrontResponse
```

### 3.2 Endpoints Faltantes para Storefront

❌ **CatalogoPublicoController** (A CREAR):
```java
GET /api/public/tienda/{tiendaId}/categorias
  → Params: activa=true
  → Response: List<CategoriaPublicaResponse>

GET /api/public/tienda/{tiendaId}/productos
  → Params: categoriaId, destacado, activo, visible_en_storefront
  → Response: Page<ProductoPublicoResponse>

GET /api/public/tienda/{tiendaId}/productos/{slug}
  → Response: ProductoDetallePublicoResponse (incluye imagenes_galeria)
```

❌ **PedidosStorefrontController** (A CREAR):
```java
POST /api/public/pedidos
  → Body: CreatePedidoStorefrontRequest (cliente, items, entrega, pago)
  → Response: PedidoCreatedResponse (codigo_pedido, total)
  
GET /api/storefront/pedidos/me (AUTENTICADO)
  → Header: Authorization: Bearer <token>
  → Response: List<PedidoResumenResponse>
  
GET /api/storefront/pedidos/{codigoPedido} (AUTENTICADO)
  → Response: PedidoDetalleResponse
```

❌ **AuthStorefrontController** (A CREAR):
```java
POST /api/auth/storefront/register
  → Body: { email, password, nombre_doc, telefono }
  → Response: { token, cliente }

POST /api/auth/storefront/login
  → Body: { email, password }
  → Response: { token, cliente }
```

---

## 🎨 4. Plan de Implementación Fase por Fase

### **FASE 1: Catálogo Dinámico (Homepage + Products)** 🔥 PRIORIDAD ALTA

#### Backend (2 días)

**A. Crear DTOs** (`com.dulcecontrol.dto.publico.catalogo`):
```java
// CategoriaPublicaResponse.java
public record CategoriaPublicaResponse(
    Long id,
    String nombre,
    String slug,
    String descripcion,
    String urlImagen,
    String icono,
    Integer ordenVisual
) {}

// ProductoPublicoResponse.java
public record ProductoPublicoResponse(
    Long id,
    String nombre,
    String slug,
    String descripcion,
    Long precioBaseCentimos,
    Long precioOfertaCentimos,  // nullable
    Boolean esPersonalizable,
    Boolean destacadoStorefront,
    String urlImagenPrincipal,
    String nombreCategoria,
    String slugCategoria
) {}

// ProductoDetallePublicoResponse.java
public record ProductoDetallePublicoResponse(
    Long id,
    String nombre,
    String slug,
    String descripcion,
    Long precioBaseCentimos,
    Long precioOfertaCentimos,
    Boolean esPersonalizable,
    String urlImagenPrincipal,
    List<String> imagenesGaleria,  // extraer de JSONB
    Map<String, Object> atributos,  // JSONB as Map
    CategoriaPublicaResponse categoria
) {}
```

**B. Crear Servicios**:
```java
// ICatalogoPublicoService.java
List<CategoriaPublicaResponse> obtenerCategoriasActivas(Long tiendaId);
Page<ProductoPublicoResponse> buscarProductos(
    Long tiendaId, 
    Long categoriaId, 
    Boolean destacado, 
    Pageable pageable
);
ProductoDetallePublicoResponse obtenerProductoPorSlug(Long tiendaId, String slug);
```

**C. Crear Controller**:
```java
@RestController
@RequestMapping("/api/public/tienda/{tiendaId}/catalogo")
public class CatalogoPublicoController {
    
    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaPublicaResponse>> obtenerCategorias(
        @PathVariable Long tiendaId
    );
    
    @GetMapping("/productos")
    public ResponseEntity<Page<ProductoPublicoResponse>> buscarProductos(
        @PathVariable Long tiendaId,
        @RequestParam(required = false) Long categoriaId,
        @RequestParam(required = false) Boolean destacado,
        Pageable pageable
    );
    
    @GetMapping("/productos/{slug}")
    public ResponseEntity<ProductoDetallePublicoResponse> obtenerProducto(
        @PathVariable Long tiendaId,
        @PathVariable String slug
    );
}
```

#### Frontend (3 días)

**A. API Layer** (`/src/api/catalogo.api.js`):
```javascript
export const getCategorias = async (tiendaId) => {
  const response = await fetch(`/api/public/tienda/${tiendaId}/catalogo/categorias`);
  return response.json();
};

export const getProductos = async (tiendaId, params = {}) => {
  const query = new URLSearchParams(params);
  const response = await fetch(`/api/public/tienda/${tiendaId}/catalogo/productos?${query}`);
  return response.json();
};

export const getProductoBySlug = async (tiendaId, slug) => {
  const response = await fetch(`/api/public/tienda/${tiendaId}/catalogo/productos/${slug}`);
  return response.json();
};
```

**B. Actualizar HomePage**:
```jsx
// Reemplazar mock data
const { data: categorias } = useQuery({
  queryKey: ['categorias'],
  queryFn: () => getCategorias(TIENDA_ID)
});

const { data: destacados } = useQuery({
  queryKey: ['productos-destacados'],
  queryFn: () => getProductos(TIENDA_ID, { destacado: true, page: 0, size: 4 })
});

// Usar CollectionCarousel con categorias reales
<CollectionCarousel items={categorias} />

// Renderizar destacados
{destacados?.content.map(producto => (
  <ProductCard key={producto.id} product={formatProduct(producto)} />
))}
```

**C. Actualizar ProductsPage**:
```jsx
const { data: productos } = useQuery({
  queryKey: ['productos', categoriaId],
  queryFn: () => getProductos(TIENDA_ID, { categoriaId, page: 0, size: 50 })
});

// Agrupar por categoría en frontend (o paginar por categoría)
const porCategoria = useMemo(() => {
  return groupBy(productos?.content, 'nombreCategoria');
}, [productos]);
```

**D. Actualizar ProductDetailPage**:
```jsx
const { slug } = useParams();
const { data: producto } = useQuery({
  queryKey: ['producto', slug],
  queryFn: () => getProductoBySlug(TIENDA_ID, slug)
});

// Galería de imágenes
<ImageGallery images={producto.imagenesGaleria} />

// Precio con oferta
const precioFinal = producto.precioOfertaCentimos 
  ? producto.precioOfertaCentimos / 100
  : producto.precioBaseCentimos / 100;
```

---

### **FASE 2: Personalización "Spiderman Logic"** 🎨 COMPLEJIDAD ALTA

#### Frontend (2 días)

**A. Actualizar useCartStore** (`/store/useCartStore.js`):
```javascript
addItem: (product, quantity = 1, personalizacion = null) => {
  const items = get().items;
  
  // Si tiene personalización, cada item es único (no agrupar)
  if (personalizacion) {
    const uniqueId = `${product.id}_${Date.now()}`;
    set({ 
      items: [...items, { 
        ...product, 
        quantity, 
        uniqueId,
        personalizacion 
      }] 
    });
  } else {
    // Lógica existente de agrupación
  }
}
```

**B. Crear PersonalizacionForm** (`/components/PersonalizacionForm.jsx`):
```jsx
const PersonalizacionForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    dedicatoria: '',
    saborMasa: '',
    saborRelleno: '',
    tematica: '',
    imagenReferencia: null
  });

  const handleFileUpload = async (file) => {
    // Upload a Cloudinary o S3
    const url = await uploadImage(file);
    setFormData({ ...formData, imagenReferencia: url });
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-bold text-lg">Personaliza tu pedido</h3>
      
      <Input
        placeholder="Dedicatoria (ej: Feliz cumpleaños María)"
        value={formData.dedicatoria}
        onChange={(e) => setFormData({ ...formData, dedicatoria: e.target.value })}
      />
      
      <Select 
        label="Sabor de Masa"
        options={['Vainilla', 'Chocolate', 'Red Velvet', 'Zanahoria']}
        value={formData.saborMasa}
        onChange={(value) => setFormData({ ...formData, saborMasa: value })}
      />
      
      <Select 
        label="Relleno"
        options={['Manjar Blanco', 'Crema de Chocolate', 'Fresas con Crema']}
        value={formData.saborRelleno}
        onChange={(value) => setFormData({ ...formData, saborRelleno: value })}
      />
      
      <Input
        placeholder="Temática (ej: Spiderman, Frozen)"
        value={formData.tematica}
        onChange={(e) => setFormData({ ...formData, tematica: e.target.value })}
      />
      
      <FileUpload 
        label="Imagen de Referencia (Opcional)"
        onUpload={handleFileUpload}
        accept="image/*"
      />
      
      <Button onClick={() => onSubmit(formData)} disabled={loading}>
        Agregar al Carrito
      </Button>
    </Card>
  );
};
```

**C. Actualizar ProductDetailPage**:
```jsx
const ProductDetailPage = () => {
  const { slug } = useParams();
  const { data: producto } = useQuery(...);
  const addItem = useCartStore((state) => state.addItem);
  const [showPersonalizacion, setShowPersonalizacion] = useState(false);

  const handleAddToCart = (personalizacion = null) => {
    addItem(producto, quantity, personalizacion);
    toast.success('Producto agregado al carrito');
  };

  return (
    <>
      {/* Información básica del producto */}
      
      {producto.esPersonalizable ? (
        <div className="space-y-4">
          <Button onClick={() => setShowPersonalizacion(!showPersonalizacion)}>
            {showPersonalizacion ? 'Agregar sin personalizar' : 'Personalizar mi pedido'}
          </Button>
          
          {showPersonalizacion ? (
            <PersonalizacionForm onSubmit={handleAddToCart} />
          ) : (
            <Button onClick={() => handleAddToCart()}>
              Agregar al Carrito
            </Button>
          )}
        </div>
      ) : (
        <Button onClick={() => handleAddToCart()}>
          Agregar al Carrito
        </Button>
      )}
    </>
  );
};
```

#### Backend (1 día)

- La lógica ya está en la tabla `personalizaciones_item_pedido`
- Se implementará en FASE 4 (Checkout) al crear el pedido

---

### **FASE 3: Páginas Dinámicas CMS** 📄 PRIORIDAD MEDIA

#### Frontend (1 día)

**A. Crear DynamicPage** (`/pages/DynamicPage/index.jsx`):
```jsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPaginaPorSlug } from '@/api/tienda.api';

const DynamicPage = () => {
  const { slug } = useParams();
  const { data: pagina, isLoading } = useQuery({
    queryKey: ['pagina', slug],
    queryFn: () => getPaginaPorSlug(TIENDA_ID, slug)
  });

  if (isLoading) return <LoadingSpinner />;
  if (!pagina) return <NotFound />;

  return (
    <div className="container py-20">
      <h1 className="text-5xl font-serif font-bold mb-6">{pagina.titulo}</h1>
      
      {/* Renderizar HTML sanitizado */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pagina.contenido) }}
      />
    </div>
  );
};

export default DynamicPage;
```

**B. Actualizar AppRouter.jsx**:
```jsx
import DynamicPage from '@/pages/DynamicPage';

// Reemplazar AboutPage y ContactPage
<Route path="/p/:slug" element={<DynamicPage />} />

// Eliminar:
// <Route path="/sobre-nosotros" element={<AboutPage />} />
// <Route path="/contactanos" element={<ContactPage />} />
```

**C. Actualizar Footer/Navigation**:
```jsx
// Fetch de páginas del menú
const { data: paginasMenu } = useQuery({
  queryKey: ['paginas-menu'],
  queryFn: async () => {
    const paginas = await getPaginasActivas(TIENDA_ID);
    return paginas.filter(p => p.visibleEnMenu).sort((a, b) => a.ordenMenu - b.ordenMenu);
  }
});

// Renderizar links dinámicos
{paginasMenu?.map(pagina => (
  <Link key={pagina.id} to={`/p/${pagina.slug}`}>
    {pagina.titulo}
  </Link>
))}
```

---

### **FASE 4: Checkout Completo** 💳 PRIORIDAD ALTA

#### Backend (4 días)

**A. Crear DTOs** (`com.dulcecontrol.dto.publico.pedidos`):
```java
// CreatePedidoStorefrontRequest.java
public record CreatePedidoStorefrontRequest(
    // Cliente (puede ser guest o registrado)
    ClienteDataRequest cliente,
    
    // Items
    List<ItemPedidoRequest> items,
    
    // Entrega
    TipoEntrega tipoEntrega,
    Long sedeOrigenId,
    LocalDateTime fechaEntregaPactada,
    String direccionEntrega,  // nullable si recojo_tienda
    
    // Pago
    MetodoPago metodoPago,
    String referenciaExterna,  // para Yape/Plin
    
    // Comprobante
    Boolean requiereComprobante,
    TipoComprobante tipoComprobante,
    
    // Notas
    String notasPedido
) {}

// ClienteDataRequest.java
public record ClienteDataRequest(
    Long clienteId,  // nullable si es guest
    String email,
    String nombreDoc,
    String telefono,
    TipoDocumento tipoDoc,
    String numeroDoc
) {}

// ItemPedidoRequest.java
public record ItemPedidoRequest(
    Long productoId,
    Integer cantidad,
    PersonalizacionRequest personalizacion  // nullable
) {}

// PersonalizacionRequest.java
public record PersonalizacionRequest(
    String descripcionSolicitud,
    String textoDedicatoria,
    List<String> imagenesReferencia,
    String saborMasa,
    String saborRelleno,
    String tematica
) {}

// PedidoCreatedResponse.java
public record PedidoCreatedResponse(
    Long id,
    String codigoPedido,
    Long totalFinalCentimos,
    String estadoPedido,
    String estadoPago,
    LocalDateTime fechaEntregaPactada
) {}
```

**B. Crear Servicio**:
```java
public interface IPedidoStorefrontService {
    PedidoCreatedResponse crearPedido(CreatePedidoStorefrontRequest request);
}

@Service
public class PedidoStorefrontService implements IPedidoStorefrontService {
    
    @Transactional
    public PedidoCreatedResponse crearPedido(CreatePedidoStorefrontRequest request) {
        // 1. Validar productos existen y están activos
        List<Producto> productos = validarProductos(request.items());
        
        // 2. Crear o buscar cliente
        Cliente cliente = resolverCliente(request.cliente());
        
        // 3. Calcular totales
        long subtotal = calcularSubtotal(request.items(), productos);
        long impuestos = (long) (subtotal * 0.18);  // IGV 18%
        long totalFinal = subtotal + impuestos;
        
        // 4. Crear pedido
        Pedido pedido = new Pedido();
        pedido.setCodigoPedido(generarCodigoPedido());
        pedido.setTiendaId(request.tiendaId());
        pedido.setSedeOrigenId(request.sedeOrigenId());
        pedido.setClienteId(cliente.getId());
        pedido.setOrigen(OrigenPedido.STOREFRONT);
        pedido.setEstadoPedido(EstadoPedido.PENDIENTE_PAGO);
        pedido.setEstadoPago(EstadoPagoPedido.PENDIENTE);
        pedido.setTipoEntrega(request.tipoEntrega());
        pedido.setFechaEntregaPactada(request.fechaEntregaPactada());
        pedido.setSubtotalItemsCentimos(subtotal);
        pedido.setImpuestosTotalesCentimos(impuestos);
        pedido.setTotalFinalCentimos(totalFinal);
        pedidoRepository.save(pedido);
        
        // 5. Crear detalles_pedido
        for (ItemPedidoRequest item : request.items()) {
            Producto producto = findProductoById(item.productoId());
            
            DetallePedido detalle = new DetallePedido();
            detalle.setPedidoId(pedido.getId());
            detalle.setProductoId(producto.getId());
            detalle.setCantidad(item.cantidad());
            detalle.setPrecioUnitarioCentimos(producto.getPrecioBaseCentimos());
            detalle.setSubtotalLineaCentimos(producto.getPrecioBaseCentimos() * item.cantidad());
            detallePedidoRepository.save(detalle);
            
            // 6. Si tiene personalización, crear registro
            if (item.personalizacion() != null) {
                PersonalizacionItemPedido pers = new PersonalizacionItemPedido();
                pers.setDetallePedidoId(detalle.getId());
                pers.setDescripcionSolicitud(item.personalizacion().descripcionSolicitud());
                pers.setTextoDedicatoria(item.personalizacion().textoDedicatoria());
                // ... mapear otros campos
                personalizacionRepository.save(pers);
            }
        }
        
        // 7. Crear pago si es inmediato (Yape/Plin/Stripe)
        if (request.metodoPago() != MetodoPago.EFECTIVO) {
            PagoPedido pago = new PagoPedido();
            pago.setPedidoId(pedido.getId());
            pago.setMontoPagadoCentimos(0);  // Pendiente de confirmación
            pago.setMetodoPago(request.metodoPago());
            pago.setReferenciaExterna(request.referenciaExterna());
            pagoRepository.save(pago);
        }
        
        // 8. Reducir stock (opcional: hacer en cambio de estado a "confirmado")
        
        return new PedidoCreatedResponse(
            pedido.getId(),
            pedido.getCodigoPedido(),
            pedido.getTotalFinalCentimos(),
            pedido.getEstadoPedido().name(),
            pedido.getEstadoPago().name(),
            pedido.getFechaEntregaPactada()
        );
    }
}
```

**C. Crear Controller**:
```java
@RestController
@RequestMapping("/api/public/pedidos")
public class PedidosStorefrontController {
    
    @PostMapping
    public ResponseEntity<PedidoCreatedResponse> crearPedido(
        @Valid @RequestBody CreatePedidoStorefrontRequest request
    ) {
        PedidoCreatedResponse response = pedidoService.crearPedido(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

#### Frontend (3 días)

**A. API Layer** (`/api/pedidos.api.js`):
```javascript
export const crearPedido = async (pedidoData) => {
  const response = await fetch('/api/public/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedidoData)
  });
  return response.json();
};
```

**B. Actualizar CheckoutPage**:
```jsx
const CheckoutPage = () => {
  const { items, clearCart } = useCartStore();
  const { config } = useTiendaConfig();
  const [formData, setFormData] = useState({
    nombreContacto: '',
    email: '',
    telefono: '',
    tipoDoc: 'DNI',
    numeroDoc: '',
    sedeOrigenId: null,
    fechaEntrega: '',
    horario: '',
    metodoPago: 'yape',
    notasPedido: ''
  });

  const mutation = useMutation({
    mutationFn: crearPedido,
    onSuccess: (data) => {
      clearCart();
      navigate(`/pedido-confirmado/${data.codigoPedido}`);
    }
  });

  const handleSubmit = () => {
    const payload = {
      cliente: {
        email: formData.email,
        nombreDoc: formData.nombreContacto,
        telefono: formData.telefono,
        tipoDoc: formData.tipoDoc,
        numeroDoc: formData.numeroDoc
      },
      items: items.map(item => ({
        productoId: item.id,
        cantidad: item.quantity,
        personalizacion: item.personalizacion || null
      })),
      tipoEntrega: 'recojo_tienda',
      sedeOrigenId: formData.sedeOrigenId,
      fechaEntregaPactada: `${formData.fechaEntrega}T${formData.horario}`,
      metodoPago: formData.metodoPago.toUpperCase(),
      requiereComprobante: true,
      tipoComprobante: 'BOLETA',
      notasPedido: formData.notasPedido
    };

    mutation.mutate(payload);
  };

  return (
    <>
      {/* Formulario de cliente */}
      {/* Selector de sedes (dinámico desde /api/public/tienda/1/sedes) */}
      {/* Selector de fecha/hora */}
      {/* Método de pago con QR de Yape/Plin */}
      {/* Botón de confirmar pedido */}
      
      {/* Sidebar: Resumen del carrito con personalizaciones */}
      <CartSummary items={items} />
    </>
  );
};
```

**C. Mostrar Personalizaciones en CartSheet**:
```jsx
{item.personalizacion && (
  <div className="text-xs text-muted-foreground mt-1">
    <p>✨ Personalizado:</p>
    {item.personalizacion.dedicatoria && <p>- {item.personalizacion.dedicatoria}</p>}
    {item.personalizacion.saborMasa && <p>- Masa: {item.personalizacion.saborMasa}</p>}
    {item.personalizacion.tematica && <p>- Tema: {item.personalizacion.tematica}</p>}
  </div>
)}
```

---

### **FASE 5: Autenticación y Mis Compras** 🔐 PRIORIDAD MEDIA

#### Backend (3 días)

**A. Crear AuthStorefrontController**:
```java
@RestController
@RequestMapping("/api/auth/storefront")
public class AuthStorefrontController {
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        // 1. Validar email único
        // 2. Crear cliente con hash_contrasena
        // 3. Generar JWT token
        // 4. Retornar token + datos cliente
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // 1. Buscar cliente por email
        // 2. Validar contraseña (BCrypt)
        // 3. Generar JWT token
        // 4. Retornar token + datos cliente
    }
}
```

**B. Crear Endpoints de Pedidos Autenticados**:
```java
@RestController
@RequestMapping("/api/storefront/pedidos")
public class MisPedidosController {
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<PedidoResumenResponse>> obtenerMisPedidos(
        @AuthenticationPrincipal ClientePrincipal cliente
    ) {
        // Retornar pedidos del cliente con paginación
    }
    
    @GetMapping("/{codigoPedido}")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<PedidoDetalleResponse> obtenerDetallePedido(
        @PathVariable String codigoPedido,
        @AuthenticationPrincipal ClientePrincipal cliente
    ) {
        // Validar que el pedido pertenece al cliente
        // Retornar detalle completo con items y estado
    }
}
```

#### Frontend (2 días)

**A. Crear AuthContext** (`/context/AuthContext.jsx`):
```jsx
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Fetch user data
      fetchUserProfile(token).then(setUser);
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await fetch('/api/auth/storefront/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    setToken(data.token);
    setUser(data.cliente);
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**B. Actualizar MyPurchasesPage**:
```jsx
const MyPurchasesPage = () => {
  const { token } = useAuth();
  
  const { data: pedidos } = useQuery({
    queryKey: ['mis-pedidos'],
    queryFn: () => getMisPedidos(token),
    enabled: !!token
  });

  const getEstadoColor = (estado) => {
    const colors = {
      'pendiente_pago': 'bg-gray-200 text-gray-800',
      'confirmado': 'bg-blue-200 text-blue-800',
      'en_produccion': 'bg-orange-200 text-orange-800',
      'listo_recoger': 'bg-green-200 text-green-800',
      'entregado': 'bg-green-600 text-white',
      'cancelado': 'bg-red-200 text-red-800'
    };
    return colors[estado] || colors.pendiente_pago;
  };

  return (
    <>
      {pedidos?.map(pedido => (
        <Card key={pedido.codigoPedido}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">{pedido.codigoPedido}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(pedido.creadoEn), 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getEstadoColor(pedido.estadoPedido)}`}>
              {ESTADO_LABELS[pedido.estadoPedido]}
            </span>
          </div>
          
          <div className="mt-4">
            <p className="text-sm">Total: S/ {pedido.totalFinalCentimos / 100}</p>
            <Link to={`/pedido/${pedido.codigoPedido}`} className="text-primary text-sm font-bold">
              Ver Detalle →
            </Link>
          </div>
        </Card>
      ))}
    </>
  );
};
```

---

### **FASE 6: Optimizaciones y Pulido** ✨ PRIORIDAD BAJA

#### A. Filtros Avanzados en CategoryPage
- Rango de precios (slider)
- Disponibilidad (en stock / agotado)
- Ordenamiento (precio, nombre, popularidad)

#### B. SEO y Meta Tags
- Dynamic meta tags con react-helmet-async
- Sitemap.xml generado desde páginas CMS
- OpenGraph tags para compartir en redes

#### C. Performance
- Lazy loading de imágenes (IntersectionObserver)
- Paginación infinita en productos
- Cache de categorías con React Query (staleTime: 5min)

#### D. Analytics
- Google Analytics 4
- Facebook Pixel
- Eventos de e-commerce (view_item, add_to_cart, purchase)

---

## 📋 5. Resumen de Endpoints

### Públicos (Sin autenticación)

| Método | Endpoint | Estado | Descripción |
|--------|----------|--------|-------------|
| GET | `/api/public/tienda/{id}/config` | ✅ Hecho | Config global storefront |
| GET | `/api/public/tienda/{id}/paginas` | ✅ Hecho | Lista páginas CMS activas |
| GET | `/api/public/tienda/{id}/paginas/{slug}` | ✅ Hecho | Página CMS por slug |
| GET | `/api/public/tienda/{id}/categorias` | ❌ Falta | Lista categorías activas |
| GET | `/api/public/tienda/{id}/productos` | ❌ Falta | Lista/búsqueda productos |
| GET | `/api/public/tienda/{id}/productos/{slug}` | ❌ Falta | Detalle producto |
| POST | `/api/public/pedidos` | ❌ Falta | Crear pedido (guest o auth) |
| GET | `/api/public/tienda/{id}/sedes` | ⚠️ Revisar | Sedes para selector en checkout |

### Autenticados (Requieren Bearer token)

| Método | Endpoint | Estado | Descripción |
|--------|----------|--------|-------------|
| POST | `/api/auth/storefront/register` | ❌ Falta | Registro de cliente |
| POST | `/api/auth/storefront/login` | ❌ Falta | Login cliente |
| GET | `/api/storefront/pedidos/me` | ❌ Falta | Lista pedidos del cliente |
| GET | `/api/storefront/pedidos/{codigo}` | ❌ Falta | Detalle de pedido |

---

## 🎯 6. Métricas de Éxito

### KPIs Técnicos
- ✅ **Cobertura de Tests**: > 70% en servicios críticos
- ✅ **Performance**: Lighthouse Score > 90
- ✅ **Tiempo de Carga**: FCP < 1.5s, LCP < 2.5s
- ✅ **Error Rate**: < 1% en producción

### KPIs de Negocio
- ✅ **Conversión**: Tasa de checkout completado > 60%
- ✅ **Carrito Abandonado**: < 40%
- ✅ **Pedidos Personalizados**: > 30% del total
- ✅ **Clientes Registrados**: > 40% de pedidos con cuenta

---

## ⏱️ 7. Timeline Estimado

| Fase | Duración | Dependencias |
|------|----------|--------------|
| Fase 1: Catálogo | 5 días | Ninguna (iniciar ya) |
| Fase 2: Personalización | 3 días | Fase 1 completa |
| Fase 3: Páginas CMS | 1 día | Ninguna (paralelo a F1) |
| Fase 4: Checkout | 7 días | Fase 1 y 2 completas |
| Fase 5: Auth + Mis Compras | 5 días | Fase 4 completa |
| Fase 6: Pulido | 3 días | Todas las anteriores |

**Total: ~4-5 semanas** (con 1 desarrollador full-stack)

---

## 🚀 8. Próximos Pasos Inmediatos

### Día 1-2: Backend Catálogo
1. ✅ Crear DTOs en `com.dulcecontrol.dto.publico.catalogo`
2. ✅ Crear `CatalogoPublicoService`
3. ✅ Crear `CatalogoPublicoController`
4. ✅ Tests unitarios básicos
5. ✅ Compilar y verificar endpoints con Postman

### Día 3-4: Frontend Catálogo
1. ✅ Crear `/api/catalogo.api.js`
2. ✅ Actualizar `HomePage` con API real
3. ✅ Actualizar `ProductsPage` con paginación
4. ✅ Actualizar `ProductDetailPage` con galería

### Día 5: Testing E2E
1. ✅ Probar flujo completo: Home → Products → Detail → Cart
2. ✅ Validar precios con centimos (dividir / 100)
3. ✅ Validar filtros (activo, visible_en_storefront)

---

## 📝 Notas Finales

### Decisiones de Arquitectura
- ✅ **Precios en centimos**: Evitar problemas de redondeo con decimales
- ✅ **Slugs únicos**: URLs amigables y SEO optimizado
- ✅ **JSONB para flexibilidad**: imagenes_galeria, atributos permiten extensión sin migrations
- ✅ **Personalización 1:1**: Cada detalle_pedido puede tener 1 personalización (UNIQUE constraint)

### Riesgos y Mitigaciones
- ⚠️ **Stock concurrente**: Implementar locks optimistas al reducir stock
- ⚠️ **Upload de imágenes**: Usar CDN (Cloudinary/S3) con validación de tamaño
- ⚠️ **Pagos Yape/Plin**: Requiere QR dinámico o confirmación manual
- ⚠️ **GDPR/LPDP**: Hash de contraseñas (BCrypt), consentimiento de cookies

### Referencias Técnicas
- Spring Boot Docs: https://docs.spring.io/spring-boot/docs/3.5.5/reference/html/
- React Query: https://tanstack.com/query/latest
- Zustand: https://docs.pmnd.rs/zustand/getting-started/introduction
- shadcn/ui: https://ui.shadcn.com/docs

---

**Documento generado el**: 2024-11-30  
**Última actualización**: 2024-11-30  
**Versión**: 1.0
