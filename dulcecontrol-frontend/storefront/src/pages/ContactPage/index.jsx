import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTiendaConfig } from '../../context/TiendaConfigContext';
import { getPaginaBySlug } from '../../api/paginas.api';
import { IconMapPin, IconClock, IconPhone, IconMail, IconSend, IconBrandWhatsapp } from '@tabler/icons-react';

const ContactPage = () => {
  const { config } = useTiendaConfig();
  
  // Fetch hero de contacto
  const { data: heroData } = useQuery({
    queryKey: ['pagina-storefront', 'contact-hero'],
    queryFn: () => getPaginaBySlug('contact-hero'),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  // Fetch info de contacto
  const { data: paginaData } = useQuery({
    queryKey: ['pagina-storefront', 'home-seccion-contact'],
    queryFn: () => getPaginaBySlug('home-seccion-contact'),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const heroContent = heroData ? JSON.parse(heroData.contenido || '{}') : {};
  const contactData = paginaData ? JSON.parse(paginaData.contenido || '{}') : {};
  
  // Parse horarioAtencion JSON
  const horarioAtencion = React.useMemo(() => {
    if (!config?.horarioAtencion) return null;
    try {
      return JSON.parse(config.horarioAtencion);
    } catch (error) {
      console.error('Error parsing horarioAtencion:', error);
      return null;
    }
  }, [config?.horarioAtencion]);

  // Formato días de la semana en español
  const diasSemana = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,182,193,0.15),transparent_50%)]"></div>
        
        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">Conversemos</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-6 leading-tight">
            {heroData?.titulo}
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 font-medium">
            {heroContent?.subtitulo}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Information Cards - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ubicación Card */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <IconMapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {paginaData?.titulo}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {contactData?.direccion}
                    </p>
                    <p className="text-muted-foreground">
                      {contactData?.ciudad}
                    </p>
                  </div>
                </div>
              </div>

              {/* Horario Card */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <IconClock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      {contactData?.titulo_horario}
                    </h3>
                    <div className="space-y-1.5">
                      {horarioAtencion ? (
                        Object.entries(horarioAtencion).map(([dia, info]) => (
                          <div key={dia} className="flex justify-between text-sm">
                            <span className="font-medium text-foreground">{diasSemana[dia] || dia}</span>
                            <span className="text-muted-foreground">
                              {info.abierto ? info.horario : 'Cerrado'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-foreground">Lun - Vie</span>
                            <span className="text-muted-foreground">8:00 am - 8:00 pm</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-foreground">Sábado</span>
                            <span className="text-muted-foreground">9:00 am - 9:00 pm</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-foreground">Domingo</span>
                            <span className="text-muted-foreground">10:00 am - 6:00 pm</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacto Card */}
              <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <IconPhone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {contactData?.titulo_telefono}
                      </h3>
                      <a 
                        href={`tel:${contactData?.telefono}`}
                        className="text-muted-foreground hover:text-primary transition-colors block"
                      >
                        {contactData?.telefono}
                      </a>
                    </div>
                  </div>
                  
                  <div className="border-t border-border/50 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconMail className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <a 
                          href={`mailto:${contactData?.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors break-all"
                        >
                          {contactData?.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {contactData?.telefono && (
                    <div className="pt-2">
                      <a
                        href={`https://wa.me/${contactData.telefono.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium text-sm transition-colors shadow-md hover:shadow-lg"
                      >
                        <IconBrandWhatsapp className="w-5 h-5" />
                        Chatear en WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form - 3 columns */}
            <div className="lg:col-span-3">
              <div className="sticky top-24">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[2.5rem] blur-2xl"></div>
                  <div className="relative bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-border/50">
                    <div className="mb-8">
                      <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 rounded-full">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Escríbenos</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
                        {heroContent?.titulo_formulario}
                      </h2>
                      <p className="text-muted-foreground">
                        Completa el formulario y te responderemos a la brevedad.
                      </p>
                    </div>

                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-foreground/70">
                            Nombre *
                          </label>
                          <Input 
                            id="name" 
                            placeholder="Tu nombre completo" 
                            className="h-12 rounded-xl border-border/50 focus:border-primary bg-background/50 focus:bg-white transition-colors"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-foreground/70">
                            Teléfono
                          </label>
                          <Input 
                            id="phone" 
                            type="tel"
                            placeholder="Ej: +51 987 654 321" 
                            className="h-12 rounded-xl border-border/50 focus:border-primary bg-background/50 focus:bg-white transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-foreground/70">
                          Email *
                        </label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="tu@email.com" 
                          className="h-12 rounded-xl border-border/50 focus:border-primary bg-background/50 focus:bg-white transition-colors"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-bold uppercase tracking-wider text-foreground/70">
                          Asunto
                        </label>
                        <Input 
                          id="subject" 
                          placeholder="¿Sobre qué quieres consultarnos?" 
                          className="h-12 rounded-xl border-border/50 focus:border-primary bg-background/50 focus:bg-white transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-foreground/70">
                          Mensaje *
                        </label>
                        <textarea 
                          id="message" 
                          rows={6}
                          placeholder="Cuéntanos, ¿en qué podemos ayudarte?" 
                          className="w-full p-4 rounded-xl border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none bg-background/50 focus:bg-white text-sm"
                          required
                        />
                      </div>

                      <Button 
                        type="submit"
                        size="lg" 
                        className="w-full rounded-full font-bold uppercase tracking-widest h-14 bg-primary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all group"
                      >
                        <IconSend className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                        Enviar Mensaje
                      </Button>

                      <p className="text-xs text-muted-foreground text-center pt-2">
                        * Campos obligatorios
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
