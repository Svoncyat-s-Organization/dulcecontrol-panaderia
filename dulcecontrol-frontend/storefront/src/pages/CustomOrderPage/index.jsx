import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  IconLogin,
  IconCake,
  IconArrowLeft,
  IconCheck
} from '@tabler/icons-react';
import { useAuthStore } from '../../stores/authStore';
import { getProductos, formatPrecio } from '@/api/catalogo.api';
import { createPedidoPersonalizado } from '../../api/pedidos.api';
import ProductCard from '@/components/ProductCard';

const CustomOrderPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);

  const [step, setStep] = useState('selector'); // 'selector' | 'form'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    cantidad: 1,
    descripcionSolicitud: '',
    textoDedicatoria: '',
    saborMasa: '',
    saborRelleno: '',
    tematica: '',
  });

  // Fetch productos para selector
  const { data: productosData, isLoading } = useQuery({
    queryKey: ['productos-catalogo'],
    queryFn: () => getProductos({ size: 20 }),
    enabled: isAuthenticated,
  });

  // Mutation para crear pedido
  const { mutate: crearPedido, isLoading: creandoPedido } = useMutation({
    mutationFn: (data) => createPedidoPersonalizado(data, token),
    onSuccess: () => {
      alert('¡Pedido creado exitosamente! Nos pondremos en contacto contigo.');
      navigate('/');
    },
    onError: (error) => {
      alert(error.message || 'Error al crear pedido');
    },
  });

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setStep('form');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      alert('Selecciona un producto base');
      return;
    }

    if (!formData.descripcionSolicitud.trim()) {
      alert('Describe cómo quieres personalizar tu producto');
      return;
    }

    crearPedido({
      productoId: selectedProduct.id,
      ...formData,
    });
  };

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-border">
            <IconLogin className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Inicia Sesión
            </h2>
            <p className="text-muted-foreground mb-6">
              Debes tener una cuenta para realizar pedidos personalizados
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/login')}
                className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest"
              >
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                variant="outline"
                className="w-full h-12 rounded-full font-bold uppercase tracking-widest"
              >
                Crear Cuenta
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <section className="relative py-16 md:py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,182,193,0.2),transparent_50%)]"></div>
        
        <div className="container relative z-10">
          <div className="inline-block mb-6 px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              {step === 'selector' ? 'Paso 1: Producto Base' : 'Paso 2: Personalización'}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">
            Diseña tu Producto Soñado
          </h1>
          {step === 'selector' ? (
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
              Selecciona el producto base que quieres personalizar
            </p>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => setStep('selector')}
                variant="outline"
                className="rounded-full"
              >
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Cambiar Producto
              </Button>
              <p className="text-lg text-foreground/70">
                Base: <strong>{selectedProduct?.nombre}</strong>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="container max-w-6xl -mt-10 relative z-10">
        {step === 'selector' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-border">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6 text-center">
              Catálogo de Productos Base
            </h2>
            
            {isLoading ? (
              <p className="text-center text-muted-foreground">Cargando productos...</p>
            ) : productosData?.content?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosData.content.map((producto) => (
                  <div
                    key={producto.id}
                    className="border-2 border-border rounded-2xl p-4 hover:border-primary transition-colors cursor-pointer"
                    onClick={() => handleProductSelect(producto)}
                  >
                    <ProductCard producto={producto} />
                    <Button className="w-full mt-4 rounded-full bg-primary">
                      Seleccionar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No hay productos disponibles</p>
            )}
          </div>
        )}

        {step === 'form' && selectedProduct && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-border">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6 text-center">
                Personaliza tu {selectedProduct.nombre}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Cantidad */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
                    Cantidad
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) })}
                    className="rounded-full h-12"
                    required
                  />
                </div>

                {/* Descripción de la solicitud */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
                    Descripción de tu Pedido *
                  </label>
                  <textarea
                    value={formData.descripcionSolicitud}
                    onChange={(e) => setFormData({ ...formData, descripcionSolicitud: e.target.value })}
                    className="w-full min-h-[120px] px-4 py-3 border-2 border-border rounded-2xl focus:border-primary focus:outline-none resize-none"
                    placeholder="Describe cómo quieres tu producto personalizado..."
                    required
                  />
                </div>

                {/* Sabor de Masa */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
                    Sabor de Masa
                  </label>
                  <Input
                    type="text"
                    value={formData.saborMasa}
                    onChange={(e) => setFormData({ ...formData, saborMasa: e.target.value })}
                    className="rounded-full h-12"
                    placeholder="Ej: Vainilla, Chocolate, Red Velvet..."
                  />
                </div>

                {/* Sabor de Relleno */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
                    Sabor de Relleno
                  </label>
                  <Input
                    type="text"
                    value={formData.saborRelleno}
                    onChange={(e) => setFormData({ ...formData, saborRelleno: e.target.value })}
                    className="rounded-full h-12"
                    placeholder="Ej: Crema pastelera, Dulce de leche..."
                  />
                </div>

                {/* Dedicatoria */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
                    Dedicatoria
                  </label>
                  <textarea
                    value={formData.textoDedicatoria}
                    onChange={(e) => setFormData({ ...formData, textoDedicatoria: e.target.value })}
                    className="w-full min-h-[80px] px-4 py-3 border-2 border-border rounded-2xl focus:border-primary focus:outline-none resize-none"
                    placeholder="Mensaje para decorar el producto..."
                  />
                </div>

                {/* Temática */}
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
                    Temática
                  </label>
                  <Input
                    type="text"
                    value={formData.tematica}
                    onChange={(e) => setFormData({ ...formData, tematica: e.target.value })}
                    className="rounded-full h-12"
                    placeholder="Ej: Unicornio, Fútbol, Princesas..."
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    onClick={() => setStep('selector')}
                    variant="outline"
                    className="flex-1 h-12 rounded-full font-bold uppercase tracking-widest"
                  >
                    <IconArrowLeft className="w-5 h-5 mr-2" />
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    disabled={creandoPedido}
                    className="flex-1 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest"
                  >
                    <IconCheck className="w-5 h-5 mr-2" />
                    {creandoPedido ? 'Enviando...' : 'Crear Pedido'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomOrderPage;
