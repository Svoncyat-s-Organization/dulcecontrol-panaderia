import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IconEye } from '@tabler/icons-react';
import { Card } from '@/components/ui/card'; // Added import for Card component

const ProductCard = ({ product }) => {
  const { id, name, price, image, badge } = product; // Added badge to destructuring

  return (
    <Card className="group border-0 shadow-none bg-transparent relative overflow-hidden">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/20 mb-4">
        <img 
          src={image} 
          alt={name} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground shadow-sm">
            {badge}
          </div>
        )}

        {/* Hover Overlay with Action */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <Button 
             asChild
             size="sm" 
             className="rounded-full bg-white text-foreground hover:bg-white/90 font-bold uppercase tracking-wider text-xs px-6 h-9 shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
           >
             <Link to={`/producto/${id}`}>
               <IconEye className="w-4 h-4 mr-2" />
               Vista Rápida
             </Link>
           </Button>
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <h3 className="font-serif text-lg font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground font-medium">
          S/ {price.toFixed(2)}
        </p>
      </div>
    </Card>
  );
};

export default ProductCard;
