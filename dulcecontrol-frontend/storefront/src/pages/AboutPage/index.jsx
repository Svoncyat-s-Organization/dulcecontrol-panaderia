import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-secondary/30 py-20 md:py-32">
        <div className="container text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6">
            Nuestra Historia
          </h1>
          <p className="text-xl text-foreground/80 font-medium leading-relaxed">
            Desde 1996, horneando felicidad con los mejores ingredientes y mucho amor.
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
                Todo comenzó en una pequeña cocina con una batidora y un sueño. Queríamos traer el sabor auténtico de la repostería casera a cada mesa. Hoy, seguimos fieles a esa misión, utilizando recetas tradicionales y técnicas artesanales.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Creemos que un buen postre no solo alimenta el cuerpo, sino también el alma. Por eso, cada pastel, cada galleta y cada cupcake se hace a mano, fresco cada día.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-2xl">
                🌿
              </div>
              <h3 className="text-2xl font-serif font-bold">Ingredientes Frescos</h3>
              <p className="text-muted-foreground">Solo usamos mantequilla real, huevos de granja y frutas de estación.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-2xl">
                👐
              </div>
              <h3 className="text-2xl font-serif font-bold">Hecho a Mano</h3>
              <p className="text-muted-foreground">Sin premezclas ni atajos. Todo se hace desde cero en nuestra cocina.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-2xl">
                ❤️
              </div>
              <h3 className="text-2xl font-serif font-bold">Con Amor</h3>
              <p className="text-muted-foreground">Ponemos el corazón en cada detalle para que disfrutes cada bocado.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
