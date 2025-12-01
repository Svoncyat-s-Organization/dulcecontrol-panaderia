import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IconArrowLeft, IconShoppingCartPlus, IconMinus, IconPlus } from '@tabler/icons-react';
import useCartStore from '@/store/useCartStore';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = React.useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Mock Data (Replace with API later)
  const product = {
    id: parseInt(id),
    name: 'Torta de Chocolate',
    price: 45.00,
    description: 'Deliciosa torta de chocolate húmeda con relleno de fudge casero y cobertura de ganache. Perfecta para celebraciones o para darte un gusto.',
    category: 'Pastelería',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1000',
    ingredients: ['Harina', 'Cacao', 'Huevos', 'Leche', 'Mantequilla', 'Azúcar'],
    nutritionalInfo: {
      calories: '450 kcal',
      fat: '25g',
      carbs: '55g',
      protein: '6g'
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <div className="container py-10 min-h-screen">
      <Link to="/colecciones" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <IconArrowLeft className="mr-2 h-4 w-4" /> Volver al Catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Image */}
        <div className="rounded-2xl overflow-hidden bg-muted aspect-square relative group">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {product.category}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
            <p className="text-2xl sm:text-3xl font-bold text-primary">S/ {product.price.toFixed(2)}</p>
          </div>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Ingredientes:</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <span key={ing} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                  {ing}
                </span>
              ))}
            </div>
          </div>

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
            <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
              <IconShoppingCartPlus className="h-5 w-5" />
              Agregar al Carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
