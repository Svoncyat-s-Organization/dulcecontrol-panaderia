import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { IconArrowRight } from '@tabler/icons-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import CollectionCarousel from '@/components/CollectionCarousel';
import { getCategorias, getProductos, formatPrecio } from '@/api/catalogo.api';

const ProductsPage = () => {
  // Fetch categorías y productos desde la API
  const { data: categoriasData } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias
  });

  const { data: productosData, isLoading } = useQuery({
    queryKey: ['productos-all'],
    queryFn: () => getProductos({ size: 100 }) // Traer todos los productos
  });

  // Transformar productos al formato del componente
  const allProducts = useMemo(() => {
    if (!productosData?.content) return [];
    
    return productosData.content.map(producto => ({
      id: producto.id,
      name: producto.nombre,
      slug: producto.slug,
      price: parseFloat(formatPrecio(producto.precioEfectivoCentimos || producto.precioBaseCentimos)),
      category: producto.nombreCategoria || 'Sin categoría',
      categorySlug: producto.slugCategoria,
      image: producto.urlImagenPrincipal || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1000',
      badge: producto.tieneOferta ? 'OFERTA' : null
    }));
  }, [productosData]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const groups = {};
    allProducts.forEach(product => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    return groups;
  }, [allProducts]);

  const categories = Object.keys(productsByCategory);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <CollectionCarousel />
        <div className="container py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-xl"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Collection Carousel */}
      <CollectionCarousel />

      {/* Product Sections */}
      <div className="flex flex-col">
        {categories.length > 0 ? categories.map((category, index) => (
          <section 
            key={category} 
            className={`py-20 md:py-28 ${
              index % 2 === 0 ? 'bg-background' : 'bg-primary/10'
            }`}
          >
            <div className="container">
              {/* Section Header */}
              <div className="text-center mb-16 relative">
                 <div className="flex flex-col items-center justify-center gap-6">
                    <div className="flex items-center gap-4">
                        <span className="h-px w-12 bg-foreground/20 hidden md:block"></span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                        {category}
                        </h2>
                        <span className="h-px w-12 bg-foreground/20 hidden md:block"></span>
                    </div>
                    
                    {productsByCategory[category][0]?.categorySlug && (
                      <Button asChild variant="link" className="text-foreground/70 hover:text-primary font-bold uppercase tracking-widest text-xs">
                          <Link to={`/colecciones/${productsByCategory[category][0].categorySlug}`} className="flex items-center gap-2">
                              Ver más {category} <IconArrowRight className="w-4 h-4" />
                          </Link>
                      </Button>
                    )}
                 </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 mx-auto" style={{maxWidth: 'fit-content'}}>
                {productsByCategory[category].map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )) : (
          <div className="container py-20 text-center">
            <p className="text-muted-foreground text-lg">No hay productos disponibles en este momento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
