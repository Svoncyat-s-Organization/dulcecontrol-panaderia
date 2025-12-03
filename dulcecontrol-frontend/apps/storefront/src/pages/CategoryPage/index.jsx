import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryConfig } from '@/config/categories';
import ProductCard from '@/components/ProductCard';
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
  const config = categoryConfig[slug];
  const [products, setProducts] = useState([]);

  // Mock Products Data (In a real app, fetch based on slug)
  useEffect(() => {
    // Simulating API fetch
    const mockProducts = [
      { id: 1, name: 'Torta de Chocolate', price: 45.00, category: 'Pastelería', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1000', badge: 'BEST SELLER' },
      { id: 2, name: 'Cheesecake de Fresa', price: 12.00, category: 'Pastelería', image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df26?auto=format&fit=crop&q=80&w=1000', badge: 'PICK UP ONLY' },
      { id: 3, name: 'Alfajores (Caja x6)', price: 18.00, category: 'Pastelería', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=1000' },
      { id: 4, name: 'Red Velvet Cupcake', price: 8.00, category: 'Cupcakes', image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&q=80&w=1000', badge: 'NEW' },
      { id: 5, name: 'Vanilla Bean Cupcake', price: 7.50, category: 'Cupcakes', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=1000' },
      { id: 6, name: 'Chocochip Cookies', price: 12.00, category: 'Galletas', image: 'https://images.unsplash.com/photo-1499636138143-bd630f5cfdeb?auto=format&fit=crop&q=80&w=1000' },
    ];
    
    // Simple filter simulation
    if (slug === 'pasteleria') {
        setProducts(mockProducts.filter(p => p.category === 'Pastelería'));
    } else if (slug === 'cupcakes') {
        setProducts(mockProducts.filter(p => p.category === 'Cupcakes'));
    } else if (slug === 'galletas') {
        setProducts(mockProducts.filter(p => p.category === 'Galletas'));
    } else {
        setProducts(mockProducts);
    }
  }, [slug]);

  if (!config) {
    return <div className="py-20 text-center">Categoría no encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative w-full">
        {/* Desktop Background Layer */}
        <div className="hidden md:flex absolute inset-0 z-0">
          <div className={`w-1/2 ${config.themeColor}`} />
          <div className="w-1/2 relative">
            <img 
              src={config.heroImage} 
              alt={config.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Layer */}
        <div className="flex flex-col md:block relative z-10">
          {/* Text Section */}
          <div className={`md:bg-transparent ${config.themeColor} w-full`}>
            <div className="container md:h-full md:flex md:items-center md:min-h-[50vh]">
              <div className="w-full md:w-1/2 py-12 md:py-20">
                <div className="space-y-6 max-w-lg mx-auto md:mx-0">
                  <nav className="text-xs font-bold tracking-widest uppercase text-foreground/60">
                    <Link to="/colecciones" className="hover:text-foreground">Categorías</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">{config.title}</span>
                  </nav>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-[0.9]">
                    {config.title}
                  </h1>
                  <p className="text-lg text-foreground/80 font-medium leading-relaxed">
                    {config.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Image Section */}
          <div className="md:hidden h-[300px] relative w-full">
            <img 
              src={config.heroImage} 
              alt={config.title} 
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
            
            <Accordion type="multiple" defaultValue={["pickup", "type"]} className="w-full">
              <AccordionItem value="pickup" className="border-b border-border">
                <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline py-4">
                  Entrega / Recojo
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pb-4">
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Solo Recojo
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Delivery Local
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Envíos Nacionales
                    </label>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="type" className="border-b border-border">
                <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline py-4">
                  Tipo
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pb-4">
                     <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Sin Gluten
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Vegano
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Sin Nueces
                    </label>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
               <AccordionItem value="flavor" className="border-b border-border">
                <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:no-underline py-4">
                  Sabor
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pb-4">
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Chocolate
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Vainilla
                    </label>
                    <label className="flex items-center gap-2 text-sm text-foreground/80 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" /> Fruta
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
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
            {/* Simple Carousel Mockup */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { name: 'Tortas', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=500' },
                 { name: 'Favoritos', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=500' },
                 { name: 'Galletas', image: 'https://images.unsplash.com/photo-1499636138143-bd630f5cfdeb?auto=format&fit=crop&q=80&w=500' },
                 { name: 'Cupcakes', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=500' }
               ].map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                     <div className="aspect-square bg-white rounded-xl mb-4 overflow-hidden">
                        <img 
                           src={item.image} 
                           alt={item.name}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                     </div>
                     <h3 className="font-serif text-xl font-medium">{item.name}</h3>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default CategoryPage;
