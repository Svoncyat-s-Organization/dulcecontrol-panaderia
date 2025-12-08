import React from 'react';
import { Link } from 'react-router-dom';
import { IconPackage, IconClock, IconCheck, IconX, IconChevronRight } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const MyPurchasesPage = () => {
  // Mock purchase data
  const purchases = [
    {
      id: 'ORD-2024-001',
      date: '2024-11-28',
      status: 'completed',
      total: 69.00,
      items: [
        { name: 'Torta de Chocolate', quantity: 1, price: 45.00, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=100' },
        { name: 'Red Velvet Cupcake', quantity: 3, price: 8.00, image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&q=80&w=100' },
      ],
      pickupLocation: 'Miraflores - Av. Larco 1234',
      pickupDate: '2024-11-30',
      pickupTime: '2:00 PM - 5:00 PM'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-11-25',
      status: 'pending',
      total: 52.00,
      items: [
        { name: 'Cheesecake de Fresa', quantity: 2, price: 12.00, image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df26?auto=format&fit=crop&q=80&w=100' },
        { name: 'Vanilla Bean Cupcake', quantity: 4, price: 7.00, image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=100' },
      ],
      pickupLocation: 'San Isidro - Calle Las Flores 567',
      pickupDate: '2024-12-02',
      pickupTime: '9:00 AM - 12:00 PM'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-11-20',
      status: 'cancelled',
      total: 15.00,
      items: [
        { name: 'Chocochip Cookies', quantity: 1, price: 12.00, image: 'https://images.unsplash.com/photo-1499636138143-bd630f5cfdeb?auto=format&fit=crop&q=80&w=100' },
      ],
      pickupLocation: 'Barranco - Av. Grau 890',
      pickupDate: '2024-11-22',
      pickupTime: '6:00 PM - 8:00 PM'
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-primary/20 text-primary border-primary/30',
      pending: 'bg-accent/20 text-accent-foreground border-accent/30',
      cancelled: 'bg-muted text-muted-foreground border-border'
    };

    const icons = {
      completed: <IconCheck className="w-4 h-4" />,
      pending: <IconClock className="w-4 h-4" />,
      cancelled: <IconX className="w-4 h-4" />
    };

    const labels = {
      completed: 'Completado',
      pending: 'Pendiente',
      cancelled: 'Cancelado'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">
            Mis Compras
          </h1>
          <p className="text-muted-foreground">
            Revisa el historial de tus pedidos
          </p>
        </div>

        {/* Empty State */}
        {purchases.length === 0 ? (
          <Card className="p-12 rounded-2xl text-center">
            <IconPackage className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-serif font-bold text-foreground mb-2">
              No tienes compras aún
            </h3>
            <p className="text-muted-foreground mb-6">
              Empieza a explorar nuestros deliciosos productos
            </p>
            <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/colecciones">Ver Productos</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="p-6 rounded-2xl border-2 border-border hover:border-primary/50 transition-colors">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-border">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-serif font-bold text-foreground">
                        Pedido {purchase.id}
                      </h3>
                      {getStatusBadge(purchase.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Realizado el {new Date(purchase.date).toLocaleDateString('es-PE', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="text-2xl font-bold text-foreground">
                      S/ {purchase.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="py-4 space-y-3">
                  {purchase.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {item.quantity} × S/ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold text-foreground">
                        S/ {(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pickup Information */}
                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Lugar de Recojo
                      </p>
                      <p className="text-sm text-foreground font-medium">
                        {purchase.pickupLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Fecha y Hora
                      </p>
                      <p className="text-sm text-foreground font-medium">
                        {new Date(purchase.pickupDate).toLocaleDateString('es-PE', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {purchase.pickupTime}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-full border-2 border-border hover:border-primary hover:bg-primary/5"
                    >
                      Ver Detalles
                      <IconChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                    {purchase.status === 'completed' && (
                      <Button 
                        className="flex-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      >
                        Volver a Pedir
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyPurchasesPage;
