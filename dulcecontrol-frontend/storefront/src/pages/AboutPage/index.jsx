import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPaginaBySlug } from '../../api/paginas.api';
import { useTiendaConfig } from '../../context/TiendaConfigContext';
import { IconSparkles, IconHeart, IconLeaf, IconUsers } from '@tabler/icons-react';

const AboutPage = () => {
  const { config } = useTiendaConfig();
  
  // Usar React Query con refetch automático al cambiar de pestaña
  const { data: paginaData, isLoading } = useQuery({
    queryKey: ['pagina-storefront', 'home-seccion-about'],
    queryFn: () => getPaginaBySlug('home-seccion-about'),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  // Parsear contenido JSON
  const aboutData = paginaData ? JSON.parse(paginaData.contenido || '{}') : {};
  const tituloPage = paginaData?.titulo;
  
  // Usar la imagen del banner principal del hero del storefront
  const imagenTradicion = config?.bannerPrincipalUrl || aboutData?.imagen_tradicion;

  // Mapeo de emojis a iconos de Tabler
  const getIcon = (emoji) => {
    const iconMap = {
      '🌿': IconLeaf,
      '👐': IconUsers,
      '❤️': IconHeart,
      '✨': IconSparkles,
    };
    return iconMap[emoji] || IconSparkles;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl px-4">
          <div className="h-12 bg-muted rounded-lg w-3/4 mx-auto"></div>
          <div className="h-6 bg-muted rounded-lg w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-primary/20 to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,182,193,0.15),transparent_50%)]"></div>
        
        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">Nuestra Historia</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-8 leading-tight">
            {tituloPage}
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 font-medium leading-relaxed max-w-3xl mx-auto">
            {aboutData?.descripcion}
          </p>
        </div>
      </section>

      {/* Story Section - Tradición */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <img 
                  src={imagenTradicion} 
                  alt="Nuestra Cocina" 
                  className="rounded-[2.5rem] shadow-2xl w-full h-auto aspect-[4/5] object-cover ring-1 ring-black/5"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconHeart className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Hecho con</p>
                      <p className="text-lg font-serif font-bold text-primary">Amor & Pasión</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Nuestra Esencia</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                {aboutData?.titulo_tradicion}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {aboutData?.texto_tradicion}
              </p>
              <div className="pt-4">
                <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section with Modern Cards */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-block mb-4 px-4 py-1.5 bg-white rounded-full border border-primary/20">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Lo Que Nos Define</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {aboutData?.titulo_valores}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {aboutData?.valores?.map((valor, index) => {
              const IconComponent = getIcon(aboutData?.iconos_valores?.[index]);
              return (
                <div 
                  key={index} 
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/20 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative space-y-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-foreground leading-tight">
                      {valor}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-[3rem] opacity-90"></div>
            <div className="relative bg-gradient-to-br from-primary/95 to-secondary/95 rounded-[3rem] p-12 md:p-16 text-center shadow-2xl backdrop-blur-sm">
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                  ¿Listo para probar nuestras delicias?
                </h2>
                <p className="text-lg text-white/90">
                  Visita nuestra tienda o realiza tu pedido en línea y descubre por qué nos eligen miles de familias.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <a 
                    href="/colecciones" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                  >
                    Ver Productos
                  </a>
                  <a 
                    href="/contacto" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white backdrop-blur-sm rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white/20 transition-all border-2 border-white/30"
                  >
                    Contáctanos
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
