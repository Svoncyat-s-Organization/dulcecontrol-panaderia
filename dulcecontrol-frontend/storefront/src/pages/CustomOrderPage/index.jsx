import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconUpload, IconCalendar, IconSend } from '@tabler/icons-react';

const CustomOrderPage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section - Mint */}
      <section className="bg-primary py-16 md:py-24 text-center">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
            Diseña tu Pastel Soñado
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto font-medium">
            Cuéntanos tu idea, sube una referencia y nosotros crearemos una obra de arte comestible solo para ti.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <div className="container max-w-3xl -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-border">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            
            {/* Reference Image */}
            <div className="space-y-4">
              <label className="block text-lg font-serif font-bold text-foreground">
                1. ¿Tienes una foto de referencia?
              </label>
              <div className="border-2 border-dashed border-input rounded-2xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="w-12 h-12 bg-secondary/30 rounded-full flex items-center justify-center text-secondary-foreground mb-2">
                    <IconUpload className="w-6 h-6" />
                  </div>
                  {file ? (
                    <span className="font-bold text-primary">{file.name}</span>
                  ) : (
                    <>
                      <span className="font-bold">Haz clic para subir una imagen</span>
                      <span className="text-sm">o arrastra y suelta aquí</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="block text-lg font-serif font-bold text-foreground">
                2. Describe tu pedido
              </label>
              <textarea 
                className="w-full min-h-[150px] rounded-xl border-2 border-input p-4 text-base focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Ej: Quiero un pastel de vainilla con relleno de manjar blanco, para 20 personas. La temática es de dinosaurios..."
              ></textarea>
            </div>

            {/* Date & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-lg font-serif font-bold text-foreground">
                  3. Fecha de Entrega
                </label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full h-12 rounded-xl border-2 border-input px-4 text-base focus:outline-none focus:border-primary transition-colors"
                  />
                  <IconCalendar className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-lg font-serif font-bold text-foreground">
                  4. Tu Nombre
                </label>
                <input 
                  type="text" 
                  placeholder="Juan Pérez"
                  className="w-full h-12 rounded-xl border-2 border-input px-4 text-base focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button size="lg" className="w-full h-14 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold uppercase tracking-widest text-lg shadow-lg">
                <IconSend className="w-5 h-5 mr-2" />
                Enviar Cotización
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Te responderemos en menos de 24 horas con el precio y detalles.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomOrderPage;
