import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import ProductCard from '@/components/ProductCard';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Todos';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const categories = ['Todos', 'Panadería', 'Pastelería', 'Galletas', 'Bebidas'];
  
  const allProducts = [
    { id: 1, name: 'Torta de Chocolate', price: 45.00, category: 'Pastelería', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop' },
    { id: 2, name: 'Croissant de Mantequilla', price: 5.50, category: 'Panadería', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop' },
    { id: 3, name: 'Cheesecake de Fresa', price: 12.00, category: 'Pastelería', image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df26?q=80&w=1000&auto=format&fit=crop' },
    { id: 4, name: 'Pan Campesino', price: 8.00, category: 'Panadería', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop' },
    { id: 5, name: 'Galletas de Avena', price: 15.00, category: 'Galletas', image: 'https://images.unsplash.com/photo-1499636138143-bd630f5cfdeb?q=80&w=1000&auto=format&fit=crop' },
    { id: 6, name: 'Café Americano', price: 6.00, category: 'Bebidas', image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=1000&auto=format&fit=crop' },
    { id: 7, name: 'Baguette Francés', price: 4.50, category: 'Panadería', image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=1000&auto=format&fit=crop' },
    { id: 8, name: 'Alfajores (Caja x6)', price: 18.00, category: 'Pastelería', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1000&auto=format&fit=crop' },
  ];

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'Todos') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container py-10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo</h1>
          <p className="text-muted-foreground">Explora nuestra variedad de productos frescos.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar productos..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <IconFilter className="h-4 w-4" /> Categorías
            </h3>
            <div className="flex flex-wrap md:flex-col gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  className="justify-start w-full md:w-auto"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No se encontraron productos.</p>
              <Button variant="link" onClick={() => { setSelectedCategory('Todos'); setSearchQuery(''); }}>
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
