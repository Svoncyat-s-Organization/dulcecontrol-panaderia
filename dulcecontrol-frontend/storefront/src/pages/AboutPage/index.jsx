import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPaginaBySlug } from '../../api/paginas.api';

const AboutPage = () => {
  // Usar React Query con refetch automático al cambiar de pestaña
  const { data: paginaData, isLoading } = useQuery({
    queryKey: ['pagina-storefront', 'home-seccion-about'],
    queryFn: () => getPaginaBySlug('home-seccion-about'),
    staleTime: 30 * 1000, // 30 segundos (antes era 5 minutos)
    refetchOnWindowFocus: true, // Refrescar al volver a la pestaña
  });

  // Parsear contenido JSON
  const aboutData = paginaData ? JSON.parse(paginaData.contenido || '{}') : {};
  const tituloPage = paginaData?.titulo || 'Nuestra Historia';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-secondary/30 py-20 md:py-32">
        <div className="container text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6">
            {tituloPage}
          </h1>
          <p className="text-xl text-foreground/80 font-medium leading-relaxed">
            {aboutData?.descripcion || 'Conoce nuestra historia y pasión por la repostería.'}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=1000" 
                alt="Nuestra Cocina" 
                className="rounded-[2rem] shadow-xl w-full h-auto aspect-[4/5] object-cover"
              />
            </div>
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-serif font-bold text-foreground">
                Tradición y Pasión
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {aboutData?.descripcion || 'Todo comenzó con una pasión por crear momentos dulces e inolvidables.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-primary/20 py-20 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-foreground">Nuestros Valores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {aboutData?.valores?.map((valor, index) => (
              <div key={index} className="space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-2xl">
                  {['🌿', '👐', '❤️', '✨'][index % 4]}
                </div>
                <h3 className="text-2xl font-serif font-bold">{valor}</h3>
              </div>
            )) || (
              <>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-2xl">
                    🌿
                  </div>
                  <h3 className="text-2xl font-serif font-bold">Ingredientes Frescos</h3>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-2xl">
                    👐
                  </div>
                  <h3 className="text-2xl font-serif font-bold">Hecho a Mano</h3>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-2xl">
                    ❤️
                  </div>
                  <h3 className="text-2xl font-serif font-bold">Con Amor</h3>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
