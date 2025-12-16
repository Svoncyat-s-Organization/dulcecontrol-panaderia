import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { IconArrowLeft, IconShoppingCartPlus, IconMinus, IconPlus, IconSparkles } from '@tabler/icons-react';
import useCartStore from '@/store/useCartStore';
import { getProductoBySlug, formatPrecio } from '@/api/catalogo.api';

const ProductDetailPage = () => {
  const { id: slugParam } = useParams(); // El router usa :id pero en realidad es el slug
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [showPersonalizacion, setShowPersonalizacion] = React.useState(false);
  const [personalizacion, setPersonalizacion] = React.useState({
    dedicatoria: '',
    saborMasa: '',
    saborRelleno: '',
    tematica: '',
    imagenReferencia: null
  });
  
  const addItem = useCartStore((state) => state.addItem);

  // Fetch producto por slug desde la API
  const { data: productoData, isLoading, error } = useQuery({
    queryKey: ['producto', slugParam],
    queryFn: () => getProductoBySlug(slugParam),
    enabled: !!slugParam
  });

  // Transformar datos de la API al formato del componente
  const product = productoData ? {
    id: productoData.id,
    name: productoData.nombre,
    slug: productoData.slug,
    price: parseFloat(formatPrecio(productoData.precioEfectivoCentimos || productoData.precioBaseCentimos)),
    priceOriginal: productoData.precioOfertaCentimos ? parseFloat(formatPrecio(productoData.precioBaseCentimos)) : null,
    description: productoData.descripcion || 'Sin descripción',
    category: productoData.categoria?.nombre || 'General',
    categorySlug: productoData.categoria?.slug,
    image: productoData.urlImagenPrincipal || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1000',
    imagenesGaleria: productoData.imagenesGaleria || [],
    esPersonalizable: productoData.esPersonalizable,
    atributos: productoData.atributos || {}
  } : null;

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = (usePersonalizacion = false) => {
    if (!product) return;
    
    const personalizacionData = usePersonalizacion && product.esPersonalizable ? personalizacion : null;
    addItem(product, quantity, personalizacionData);
    
    // Reset form después de agregar
    if (usePersonalizacion) {
      setPersonalizacion({
        dedicatoria: '',
        saborMasa: '',
        saborRelleno: '',
        tematica: '',
        imagenReferencia: null
      });
      setShowPersonalizacion(false);
    }
    
    // TODO: Mostrar toast de éxito
    alert(`✅ ${quantity} ${product.name}${personalizacionData ? ' personalizado' : ''} agregado al carrito`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-10 min-h-screen">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-muted rounded w-32"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-2xl"></div>
            <div className="space-y-6">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container py-10 min-h-screen">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Producto no encontrado</h2>
          <p className="text-muted-foreground mb-6">El producto que buscas no existe o ya no está disponible.</p>
          <Button asChild>
            <Link to="/colecciones">Volver al Catálogo</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/colecciones" className="hover:text-primary transition-colors">
          Catálogo
        </Link>
        <span>/</span>
        {product.categorySlug && (
          <>
            <Link to={`/colecciones/${product.categorySlug}`} className="hover:text-primary transition-colors">
              {product.category}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="rounded-2xl overflow-hidden bg-muted aspect-square relative group">
            <img 
              src={selectedImage === -1 || product.imagenesGaleria.length === 0 ? product.image : product.imagenesGaleria[selectedImage]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          
          {/* Thumbnail Gallery */}
          {product.imagenesGaleria.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              <button 
                onClick={() => setSelectedImage(-1)}
                className={`rounded-lg overflow-hidden aspect-square border-2 transition-all ${selectedImage === -1 ? 'border-primary shadow-md' : 'border-transparent hover:border-primary/50'}`}
              >
                <img 
                  src={product.image} 
                  alt="Principal" 
                  className="w-full h-full object-cover"
                />
              </button>
              {product.imagenesGaleria.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`rounded-lg overflow-hidden aspect-square border-2 transition-all ${selectedImage === idx ? 'border-primary shadow-md' : 'border-transparent hover:border-primary/50'}`}
                >
                  <img 
                    src={img} 
                    alt={`Imagen ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {product.category}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
            <div className="flex items-center gap-3">
              <p className="text-2xl sm:text-3xl font-bold text-primary">S/ {product.price.toFixed(2)}</p>
              {product.priceOriginal && (
                <p className="text-lg text-muted-foreground line-through">S/ {product.priceOriginal.toFixed(2)}</p>
              )}
            </div>
          </div>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {product.description}
          </p>

          {/* Atributos del producto */}
          {product.atributos && Object.keys(product.atributos).length > 0 && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-foreground/70 mb-3">Información del Producto</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.atributos.porciones && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Porciones:</span>
                    <span className="text-sm text-muted-foreground">{product.atributos.porciones}</span>
                  </div>
                )}
                {product.atributos.peso_kg && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Peso:</span>
                    <span className="text-sm text-muted-foreground">{product.atributos.peso_kg} kg</span>
                  </div>
                )}
                {product.atributos.tiempo_anticipacion && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Anticipación:</span>
                    <span className="text-sm text-muted-foreground">{product.atributos.tiempo_anticipacion}</span>
                  </div>
                )}
                {product.atributos.tamaño_ml && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Tamaño:</span>
                    <span className="text-sm text-muted-foreground">{product.atributos.tamaño_ml} ml</span>
                  </div>
                )}
              </div>
              {product.atributos.alérgenos && product.atributos.alérgenos.length > 0 && (
                <div className="pt-2 border-t border-border/50 mt-3">
                  <span className="text-sm font-medium">Contiene: </span>
                  <span className="text-sm text-muted-foreground">
                    {product.atributos.alérgenos.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 🎨 SPIDERMAN LOGIC: Form de Personalización */}
          {product.esPersonalizable && (
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <IconSparkles className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">¡Personaliza tu {product.name}!</h3>
              </div>
              
              <Button 
                variant={showPersonalizacion ? "secondary" : "default"}
                onClick={() => setShowPersonalizacion(!showPersonalizacion)}
                className="w-full mb-4"
              >
                {showPersonalizacion ? 'Cerrar Personalización' : 'Personalizar mi Pedido'}
              </Button>

              {showPersonalizacion && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Dedicatoria (opcional)</label>
                    <Input 
                      placeholder="Ej: Feliz cumpleaños María"
                      value={personalizacion.dedicatoria}
                      onChange={(e) => setPersonalizacion({ ...personalizacion, dedicatoria: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Sabor de Masa</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={personalizacion.saborMasa}
                        onChange={(e) => setPersonalizacion({ ...personalizacion, saborMasa: e.target.value })}
                      >
                        <option value="">Selecciona...</option>
                        <option value="Vainilla">Vainilla</option>
                        <option value="Chocolate">Chocolate</option>
                        <option value="Red Velvet">Red Velvet</option>
                        <option value="Zanahoria">Zanahoria</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Relleno</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={personalizacion.saborRelleno}
                        onChange={(e) => setPersonalizacion({ ...personalizacion, saborRelleno: e.target.value })}
                      >
                        <option value="">Selecciona...</option>
                        <option value="Manjar Blanco">Manjar Blanco</option>
                        <option value="Crema de Chocolate">Crema de Chocolate</option>
                        <option value="Fresas con Crema">Fresas con Crema</option>
                        <option value="Chantilly">Chantilly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Temática (opcional)</label>
                    <Input 
                      placeholder="Ej: Spiderman, Frozen, Unicornios"
                      value={personalizacion.tematica}
                      onChange={(e) => setPersonalizacion({ ...personalizacion, tematica: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Imagen de Referencia (opcional)</label>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setPersonalizacion({ 
                        ...personalizacion, 
                        imagenReferencia: e.target.files[0] 
                      })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Sube una foto de cómo te gustaría tu pastel</p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <div className="flex items-center border rounded-md w-full sm:w-auto">
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <IconMinus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)}>
                <IconPlus className="h-4 w-4" />
              </Button>
            </div>

            <Button 
              size="lg" 
              className="flex-1 gap-2" 
              onClick={() => handleAddToCart(showPersonalizacion && product.esPersonalizable)}
            >
              <IconShoppingCartPlus className="h-5 w-5" />
              {showPersonalizacion && product.esPersonalizable ? 'Agregar Personalizado' : 'Agregar al Carrito'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
