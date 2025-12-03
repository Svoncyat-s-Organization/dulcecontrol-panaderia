import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@tabler/icons-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import CollectionCarousel from '@/components/CollectionCarousel';

const ProductsPage = () => {
  // Mock Data - In a real app this would come from an API
  const allProducts = [
    { id: 1, name: 'Torta de Chocolate', price: 45.00, category: 'Pastelería', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1000' },
    { id: 2, name: 'Croissant de Mantequilla', price: 5.50, category: 'Panadería', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=1000' },
    { id: 3, name: 'Cheesecake de Fresa', price: 12.00, category: 'Pastelería', image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df26?auto=format&fit=crop&q=80&w=1000' },
    { id: 4, name: 'Pan Campesino', price: 8.00, category: 'Panadería', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1000' },
    { id: 5, name: 'Galletas de Avena', price: 15.00, category: 'Galletas', image: 'https://images.unsplash.com/photo-1499636138143-bd630f5cfdeb?auto=format&fit=crop&q=80&w=1000' },
    { id: 6, name: 'Café Americano', price: 6.00, category: 'Bebidas', image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=1000' },
    { id: 7, name: 'Baguette Francés', price: 4.50, category: 'Panadería', image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&q=80&w=1000' },
    { id: 8, name: 'Alfajores (Caja x6)', price: 18.00, category: 'Pastelería', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=1000' },
    { id: 9, name: 'Red Velvet Cupcake', price: 8.00, category: 'Cupcakes', image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&q=80&w=1000' },
    { id: 10, name: 'Vanilla Bean Cupcake', price: 7.50, category: 'Cupcakes', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=1000' },
    { id: 11, name: 'Chocochip Cookies', price: 12.00, category: 'Galletas', image: 'https://images.unsplash.com/photo-1499636138143-bd630f5cfdeb?auto=format&fit=crop&q=80&w=1000' },
    { id: 12, name: 'Limonada Frozen', price: 8.00, category: 'Bebidas', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=1000' },
  ];

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
  }, []);

  const categories = Object.keys(productsByCategory);

  // Helper to map category names to slugs
  const getCategorySlug = (categoryName) => {
    const map = {
      'Pastelería': 'pasteleria',
      'Panadería': 'panaderia',
      'Galletas': 'galletas',
      'Cupcakes': 'cupcakes',
      'Bebidas': 'bebidas'
    };
    return map[categoryName] || categoryName.toLowerCase();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Collection Carousel */}
      <CollectionCarousel />

      {/* Product Sections */}
      <div className="flex flex-col">
        {categories.map((category, index) => (
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
                    
                    <Button asChild variant="link" className="text-foreground/70 hover:text-primary font-bold uppercase tracking-widest text-xs">
                        <Link to={`/colecciones/${getCategorySlug(category)}`} className="flex items-center gap-2">
                            Ver más {category} <IconArrowRight className="w-4 h-4" />
                        </Link>
                    </Button>
                 </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                {productsByCategory[category].map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
