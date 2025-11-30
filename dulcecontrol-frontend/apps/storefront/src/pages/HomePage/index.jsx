import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IconArrowRight, IconBread, IconCake, IconCookie, IconCoffee } from '@tabler/icons-react';
import ProductCard from '@/components/ProductCard';

const HomePage = () => {
  // Mock Data (Replace with API later)
  const categories = [
    { id: 1, name: 'Panadería', icon: <IconBread className="h-8 w-8" />, color: 'bg-orange-100 text-orange-600' },
    { id: 2, name: 'Pastelería', icon: <IconCake className="h-8 w-8" />, color: 'bg-pink-100 text-pink-600' },
    { id: 3, name: 'Galletas', icon: <IconCookie className="h-8 w-8" />, color: 'bg-amber-100 text-amber-600' },
    { id: 4, name: 'Bebidas', icon: <IconCoffee className="h-8 w-8" />, color: 'bg-stone-100 text-stone-600' },
  ];

  const featuredProducts = [
    { id: 1, name: 'Torta de Chocolate', price: 45.00, category: 'Pastelería', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop' },
    { id: 2, name: 'Croissant de Mantequilla', price: 5.50, category: 'Panadería', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop' },
    { id: 3, name: 'Cheesecake de Fresa', price: 12.00, category: 'Pastelería', image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df26?q=80&w=1000&auto=format&fit=crop' },
    { id: 4, name: 'Pan Campesino', price: 8.00, category: 'Panadería', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop' },
  ];

  return (
    <div className="flex flex-col gap-20 pb-24">
      {/* Hero Section */}
      <section className="relative bg-muted/30 py-24 md:py-40 overflow-hidden">
        <div className="container relative z-10 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
            ✨ Nuevo: Envíos a todo Lima
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            El sabor de lo <span className="text-primary">artesanal</span><br />
            en tu mesa
          </h1>
          <p className="max-w-[600px] text-muted-foreground text-base md:text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Descubre nuestra selección de panes de masa madre, pasteles finos y postres irresistibles. Horneamos felicidad todos los días.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <Button size="lg" asChild className="rounded-full px-8 w-full sm:w-auto">
              <Link to="/catalogo">
                Ver Catálogo <IconArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 w-full sm:w-auto">
              Nuestras Sedes
            </Button>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-0 right-0 translate-x-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Featured Categories */}
      <section className="container py-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Categorías Populares</h2>
          <Link to="/catalogo" className="text-sm font-medium text-primary hover:underline flex items-center">
            Ver todas <IconArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              to={`/catalogo?category=${cat.name}`}
              className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className={`p-4 rounded-full mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="font-semibold group-hover:text-primary transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Recién Horneados</h2>
          <Link to="/catalogo" className="text-sm font-medium text-primary hover:underline flex items-center">
            Ver todo <IconArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="container py-4">
        <div className="rounded-3xl bg-primary px-6 py-20 md:px-12 md:py-28 text-center text-primary-foreground relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">¿Te provoca algo dulce?</h2>
            <p className="text-primary-foreground/90 text-base md:text-lg leading-relaxed">
              Suscríbete a nuestro boletín y recibe un 10% de descuento en tu primera compra online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto pt-4">
              <input 
                type="email" 
                placeholder="tu@email.com" 
                className="flex h-12 w-full rounded-full border-0 bg-background px-6 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground shadow-sm"
              />
              <Button size="lg" variant="secondary" className="rounded-full px-8 shadow-sm">
                Suscribirme
              </Button>
            </div>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pattern-dots" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
