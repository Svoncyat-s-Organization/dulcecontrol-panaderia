import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconShoppingCartPlus } from '@tabler/icons-react';

const ProductCard = ({ product }) => {
  const { id, name, price, image, category } = product;

  return (
    <Card className="overflow-hidden flex flex-col h-full bg-muted/40 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group border-0">
      <Link to={`/producto/${id}`} className="block relative aspect-square overflow-hidden rounded-xl">
        <img 
          src={image} 
          alt={name} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-foreground shadow-sm">
          {category}
        </div>
      </Link>
      <CardHeader className="p-5 pb-3">
        <Link to={`/producto/${id}`}>
          <CardTitle className="text-base font-bold line-clamp-1 hover:text-primary transition-colors" title={name}>{name}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="px-5 pb-3 flex-1">
        <p className="text-lg font-bold text-primary">S/ {price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Button className="w-full gap-2 rounded-full shadow-sm">
          <IconShoppingCartPlus className="h-4 w-4" />
          Agregar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
