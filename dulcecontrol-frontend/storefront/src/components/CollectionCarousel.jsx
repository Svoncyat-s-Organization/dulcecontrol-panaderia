import React from 'react';
import { Link } from 'react-router-dom';
import { categoryConfig } from '@/config/categories';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CollectionCarousel = () => {
  const categories = Object.entries(categoryConfig);

  return (
    <div className="w-full py-12 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground">Explorar Colecciones</h2>
            {/* Optional: Add filter toggles here if needed later */}
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {categories.map(([slug, config]) => (
              <CarouselItem key={slug} className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6">
                <Link to={`/colecciones/${slug}`} className="group block text-center">
                  <div className="aspect-square rounded-full overflow-hidden mb-4 border-2 border-transparent group-hover:border-primary transition-all duration-300">
                    <img 
                      src={config.heroImage} 
                      alt={config.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                    {config.title}
                  </h3>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </div>
  );
};

export default CollectionCarousel;
