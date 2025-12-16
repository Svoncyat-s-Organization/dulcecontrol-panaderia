import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@tabler/icons-react';
import ProductCard from '@/components/ProductCard';
import { useTiendaConfig } from '../../context/TiendaConfigContext';
import { getProductos, formatPrecio } from '@/api/catalogo.api';
import { getPaginasActivas } from '@/api/tienda.api';

const HomePage = () => {
  const { config } = useTiendaConfig();
  
  // Fetch productos destacados desde la API (4 productos)
  const { data: productosData, isLoading: loadingProductos } = useQuery({
    queryKey: ['productos-destacados'],
    queryFn: () => getProductos({ destacado: true, size: 4 })
  });

  // Fetch páginas activas (JSON sections para HomePage)
  const { data: paginasData } = useQuery({
    queryKey: ['paginas-storefront-activas'],
    queryFn: getPaginasActivas,
    staleTime: 30 * 1000, // 30 segundos (reducido de 5 minutos)
    refetchOnWindowFocus: true, // Refrescar al volver a la pestaña
  });

  // Extraer secciones JSON de HomePage
  const seccionDestacados = paginasData?.find(p => p.slug === 'home-seccion-destacados');
  const seccionPersonalizada = paginasData?.find(p => p.slug === 'home-seccion-personalizada');

  // Parsear contenido JSON
  const destacadosData = seccionDestacados 
    ? JSON.parse(seccionDestacados.contenido || '{}')
    : {};
  
  const personalizadaData = seccionPersonalizada
    ? JSON.parse(seccionPersonalizada.contenido || '{}')
    : {};

  // Banner y mensaje dinámicos desde el backend
  const bannerUrl = config?.bannerPrincipalUrl;
  const mensajeBienvenida = config?.mensajeBienvenida;
  const sloganParte1 = config?.sloganParte1;
  const sloganParte2 = config?.sloganParte2;

  // Transformar productos de la API al formato esperado por ProductCard
  const featuredProducts = productosData?.content?.map(producto => ({
    id: producto.id,
    slug: producto.slug,
    name: producto.nombre,
    price: parseFloat(formatPrecio(producto.precioEfectivoCentimos || producto.precioBaseCentimos)),
    category: producto.nombreCategoria || 'General',
    image: producto.urlImagenPrincipal,
    badge: producto.tieneOferta ? 'OFERTA' : (producto.destacadoStorefront ? 'BEST SELLER' : null)
  })) || [];

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section - Pink Background */}
      <section className="bg-secondary/30 py-20 md:py-32 overflow-hidden">
        <div className="container flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left space-y-8 z-10">
            <h1 className="text-6xl md:text-8xl font-bold text-foreground leading-[0.9] tracking-tight">
              {sloganParte1} <br/>
              <span className="italic font-serif text-primary/80">{sloganParte2}</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
              {mensajeBienvenida}
            </p>
            <div className="pt-4">
              <Button size="lg" asChild className="rounded-full px-10 py-7 text-sm font-bold uppercase tracking-widest bg-foreground text-white hover:bg-foreground/90 shadow-lg">
                <Link to="/colecciones">
                  Ver Menú de Hoy
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 relative w-full max-w-lg md:max-w-none">
             <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 border-4 border-white">
                <img 
                  src={bannerUrl} 
                  alt="Banner Principal" 
                  className="w-full h-auto object-cover aspect-square"
                />
             </div>
             {/* Decorative blobs */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent rounded-full blur-2xl -z-0 opacity-60"></div>
             <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </section>

      {/* 2. Best Sellers - White Background */}
      <section className="bg-background py-24">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {seccionDestacados?.titulo}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {destacadosData.subtitulo}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mx-auto" style={{maxWidth: 'fit-content'}}>
            {loadingProductos ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-4 animate-pulse">
                  <div className="aspect-square bg-muted rounded-xl"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-muted-foreground">
                No hay productos destacados disponibles
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-16">
             <Button variant="outline" asChild className="rounded-full px-8 border-2 border-foreground text-foreground hover:bg-foreground hover:text-white font-bold uppercase tracking-widest">
               <Link to="/colecciones">Ver Todo el Catálogo</Link>
             </Button>
          </div>
        </div>
      </section>

      {/* 3. "Crea tu Dulce" Section - Mint Background */}
      <section className="bg-primary py-24 relative overflow-hidden">
        <div className="container relative z-10">
           <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-8 text-center md:text-left">
                 <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-primary-foreground mb-2 border border-white/30">
                    Personalización Total
                 </div>
                 <h2 className="text-5xl md:text-5xl font-bold text-foreground leading-tight">
                    {seccionPersonalizada?.titulo} <br/>
                    <span className="text-6xl md:text-6xl text-secondary">
                      {personalizadaData.titulo_destacado}
                    </span>
                 </h2>
                 <p className="text-xl text-primary-foreground/90 font-medium max-w-xl">
                    {personalizadaData.descripcion}
                 </p>
                 <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-white/90 font-bold uppercase tracking-widest px-10 py-7 shadow-xl border-0">
                    <Link to={personalizadaData.enlace_boton}>
                      {personalizadaData.texto_boton}
                    </Link>
                 </Button>
              </div>
              <div className="flex-1 relative">
                 <div className="grid grid-cols-2 gap-6">
                    <img 
                      src={personalizadaData.imagen_1} 
                      className="rounded-2xl shadow-lg -rotate-6 hover:rotate-0 transition-transform duration-500 border-4 border-white/50" 
                      alt="Personalización 1" 
                    />
                    <img 
                      src={personalizadaData.imagen_2} 
                      className="rounded-2xl shadow-lg rotate-6 hover:rotate-0 transition-transform duration-500 border-4 border-white/50 mt-12" 
                      alt="Personalización 2" 
                    />
                 </div>
              </div>
           </div>
        </div>
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </section>
    </div>
  );
};

export default HomePage;
