import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTiendaConfig } from '../../context/TiendaConfigContext';
import { getPaginaBySlug } from '../../api/paginas.api';

const ContactInfo = ({ horarioAtencion, diasSemana }) => {
  const [contactData, setContactData] = React.useState(null);

  React.useEffect(() => {
    const fetchContactData = async () => {
      try {
        const pagina = await getPaginaBySlug('home-seccion-contact');
        const contenido = JSON.parse(pagina.contenido);
        setContactData(contenido);
      } catch (error) {
        console.error('Error al cargar datos de contacto:', error);
      }
    };
    fetchContactData();
  }, []);

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Visítanos</h2>
        <p className="text-lg text-muted-foreground mb-2">
          {contactData?.direccion || 'Av. Larco 123, Miraflores'}
        </p>
        <p className="text-lg text-muted-foreground">Lima, Perú</p>
      </div>
      
      <div>
        <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Horario</h2>
        <div className="space-y-2 text-lg text-muted-foreground">
          {horarioAtencion ? (
            Object.entries(horarioAtencion).map(([dia, info]) => (
              <p key={dia}>
                <span className="font-bold text-foreground">{diasSemana[dia] || dia}:</span>{' '}
                {info.abierto ? info.horario : 'Cerrado'}
              </p>
            ))
          ) : (
            <>
              <p><span className="font-bold text-foreground">Lun - Vie:</span> 8:00 am - 8:00 pm</p>
              <p><span className="font-bold text-foreground">Sáb:</span> 9:00 am - 9:00 pm</p>
              <p><span className="font-bold text-foreground">Dom:</span> 10:00 am - 6:00 pm</p>
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Llámanos</h2>
        <p className="text-lg text-muted-foreground mb-2">
          {contactData?.telefono || '+51 987 654 321'}
        </p>
        <p className="text-lg text-muted-foreground">
          {contactData?.email || 'hola@dulcecontrol.com'}
        </p>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const { config } = useTiendaConfig();
  
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
    lunes: 'Lun',
    martes: 'Mar',
    miercoles: 'Mié',
    jueves: 'Jue',
    viernes: 'Vie',
    sabado: 'Sáb',
    domingo: 'Dom'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary/30 py-20">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-foreground/80">
            Estamos aquí para endulzar tu día. ¡Escríbenos!
          </p>
        </div>
      </section>

      <div className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <ContactInfo 
            horarioAtencion={horarioAtencion} 
            diasSemana={diasSemana}
          />

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-border/50">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Envíanos un Mensaje</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-foreground/70">Nombre</label>
                <Input id="name" placeholder="Tu nombre" className="h-12 rounded-xl bg-muted/20 border-transparent focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-foreground/70">Email</label>
                <Input id="email" type="email" placeholder="tu@email.com" className="h-12 rounded-xl bg-muted/20 border-transparent focus:bg-white transition-colors" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold uppercase tracking-widest text-foreground/70">Mensaje</label>
                <textarea 
                  id="message" 
                  rows={5}
                  placeholder="¿En qué podemos ayudarte?" 
                  className="w-full p-4 rounded-xl bg-muted/20 border-transparent focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none text-sm"
                />
              </div>
              <Button size="lg" className="w-full rounded-full font-bold uppercase tracking-widest h-12 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                Enviar Mensaje
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
