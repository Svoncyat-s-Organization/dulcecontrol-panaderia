import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCategorias } from '@/api/catalogo.api';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CollectionCarousel = () => {
  // Fetch categorías reales desde el backend
  const { data: categorias, isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias
  });

  // Determinar si mostrar flechas (solo si hay más de 5 items en desktop o 2 en mobile)
  const showArrows = categorias && categorias.length > 5;

  if (isLoading) {
    return (
      <div className="w-full py-12 bg-gradient-to-b from-secondary/20 to-background border-b border-border">
        <div className="container">
          <div className="h-8 bg-muted rounded w-48 mb-8 animate-pulse"></div>
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-32 space-y-3">
                <div className="aspect-square rounded-full bg-muted animate-pulse"></div>
                <div className="h-4 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!categorias || categorias.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-12 bg-secondary/30 from-secondary/20 to-background border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Explorar Colecciones</h2>
        </div>
        
        <Carousel
          opts={{
            align: showArrows ? "start" : "center",
            loop: showArrows,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 justify-center">
            {categorias.map((categoria) => (
              <CarouselItem key={categoria.id} className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6">
                <Link to={`/colecciones/${categoria.slug}`} className="group block text-center">
                  <div className="aspect-square rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg group-hover:border-primary group-hover:shadow-xl transition-all duration-300">
                    <img 
                      src={categoria.urlImagen || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400'} 
                      alt={categoria.nombre} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-serif text-base md:text-lg font-medium text-foreground group-hover:text-primary transition-colors px-2">
                    {categoria.nombre}
                  </h3>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          {showArrows && (
            <>
              <CarouselPrevious className="hidden md:flex -left-6 h-12 w-12 bg-white border-2 border-primary/20 hover:bg-primary hover:text-white hover:border-primary shadow-lg" />
              <CarouselNext className="hidden md:flex -right-6 h-12 w-12 bg-white border-2 border-primary/20 hover:bg-primary hover:text-white hover:border-primary shadow-lg" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default CollectionCarousel;
