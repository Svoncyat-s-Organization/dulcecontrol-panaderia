import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ProductCard';
import { getCategorias, getProductos, formatPrecio } from '@/api/catalogo.api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { IconChevronDown } from '@tabler/icons-react';

const CategoryPage = () => {
  const { slug } = useParams();
  
  // Fetch todas las categorías
  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
    staleTime: 5 * 60 * 1000,
  });

  // Encontrar la categoría actual por slug
  const currentCategory = categorias.find(cat => cat.slug === slug);

  // Fetch productos de la categoría actual
  const { data: productosData, isLoading } = useQuery({
    queryKey: ['productos-categoria', currentCategory?.id],
    queryFn: () => getProductos({ categoriaId: currentCategory?.id, size: 100 }),
    enabled: !!currentCategory?.id,
    staleTime: 30 * 1000,
  });

  // Transformar productos de la API
  const products = productosData?.content?.map(producto => ({
    id: producto.id,
    slug: producto.slug,
    name: producto.nombre,
    price: parseFloat(formatPrecio(producto.precioEfectivoCentimos || producto.precioBaseCentimos)),
    category: producto.nombreCategoria,
    image: producto.urlImagenPrincipal,
    badge: producto.tieneOferta ? 'OFERTA' : (producto.destacadoStorefront ? 'BEST SELLER' : null)
  })) || [];

  if (!currentCategory && !isLoading) {
    return <div className="py-20 text-center">Categoría no encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative w-full">
        {/* Desktop Background Layer */}
        <div className="hidden md:flex absolute inset-0 z-0">
          <div className="w-1/2 bg-primary" />
          <div className="w-1/2 relative">
            <img 
              src={currentCategory?.urlImagen || 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&q=80&w=2070'} 
              alt={currentCategory?.nombre || 'Categoría'} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Layer */}
        <div className="flex flex-col md:block relative z-10">
          {/* Text Section */}
          <div className="md:bg-transparent bg-primary w-full">
            <div className="container md:h-full md:flex md:items-center md:min-h-[50vh]">
              <div className="w-full md:w-1/2 py-12 md:py-20">
                <div className="space-y-6 max-w-lg mx-auto md:mx-0">
                  <nav className="text-xs font-bold tracking-widest uppercase text-foreground/60">
                    <Link to="/colecciones" className="hover:text-foreground">Categorías</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">{currentCategory?.nombre || 'Productos'}</span>
                  </nav>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-[0.9]">
                    {currentCategory?.nombre || 'Productos'}
                  </h1>
                  <p className="text-lg text-foreground/80 font-medium leading-relaxed">
                    {currentCategory?.descripcion || 'Descubre nuestros deliciosos productos'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Image Section */}
          <div className="md:hidden h-[300px] relative w-full">
            <img 
              src={currentCategory?.urlImagen || 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&q=80&w=2070'} 
              alt={currentCategory?.nombre || 'Categoría'} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters - 25% */}
          <aside className="w-full md:w-1/4 space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-serif text-2xl font-bold">Filtrar por</h3>
              <button className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                Limpiar
              </button>
            </div>
            
            <Accordion type="multiple" defaultValue={["personalizable", "alergenos"]} className="w-full">
              <AccordionItem value="personalizable" className="border-b border-border">
                <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline py-4">
                  Personalización
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pb-4">
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Personalizables
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Productos Estándar
                    </label>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="alergenos" className="border-b border-border">
                <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline py-4">
                  Alérgenos
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pb-4">
                     <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Sin Gluten
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Sin Lácteos
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Sin Huevo
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Sin Frutos Secos
                    </label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </aside>

          {/* Product Grid - 75% */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex justify-end mb-8">
               <div className="relative inline-block text-left">
                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-border rounded-full px-4 py-2 hover:bg-muted/50 transition-colors">
                    Recomendados <IconChevronDown className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-muted rounded-lg mb-4" />
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-foreground/60">
                No hay productos disponibles en esta categoría
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cross Sell Section */}
      <section className="bg-primary/20 py-20">
         <div className="container">
            <div className="flex items-center justify-between mb-12">
               <h2 className="text-4xl font-serif font-bold text-foreground">Más Colecciones</h2>
               <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full border-foreground/20 hover:bg-foreground hover:text-white">
                     <IconChevronDown className="w-5 h-5 rotate-90" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full border-foreground/20 hover:bg-foreground hover:text-white">
                     <IconChevronDown className="w-5 h-5 -rotate-90" />
                  </Button>
               </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {categorias.filter(cat => cat.slug !== slug).slice(0, 4).map((categoria) => (
                  <Link 
                    key={categoria.id} 
                    to={`/colecciones/${categoria.slug}`}
                    className="group cursor-pointer"
                  >
                     <div className="aspect-square bg-white rounded-xl mb-4 overflow-hidden">
                        <img 
                           src={categoria.urlImagen || 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&q=80&w=500'} 
                           alt={categoria.nombre}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                     </div>
                     <h3 className="font-serif text-xl font-medium">{categoria.nombre}</h3>
                  </Link>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default CategoryPage;
