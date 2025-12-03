import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowLeft, IconClock, IconMapPin, IconCreditCard } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const CheckoutPage = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Mock cart items (In a real app, this would come from context/state)
  const cartItems = [
    { id: 1, name: 'Torta de Chocolate', price: 45.00, quantity: 1, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: 'Red Velvet Cupcake', price: 8.00, quantity: 3, image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&q=80&w=200' },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% IGV
  const total = subtotal + tax;

  const locations = [
    { id: 'miraflores', name: 'Miraflores - Av. Larco 1234' },
    { id: 'sanisidro', name: 'San Isidro - Calle Las Flores 567' },
    { id: 'barranco', name: 'Barranco - Av. Grau 890' },
  ];

  const timeSlots = [
    { id: 'morning', label: 'Mañana', time: '9:00 AM - 12:00 PM' },
    { id: 'afternoon', label: 'Tarde', time: '2:00 PM - 5:00 PM' },
    { id: 'evening', label: 'Noche', time: '6:00 PM - 8:00 PM' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we would integrate with Stripe
    console.log('Checkout submitted:', { selectedLocation, selectedDate, selectedTime, specialInstructions });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container">
        {/* Back Link */}
        <Link to="/colecciones" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <IconArrowLeft className="mr-2 h-4 w-4" /> Volver a Productos
        </Link>

        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">Finalizar Pedido</h1>
          <p className="text-muted-foreground">Completa los detalles de tu pedido</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Pickup Location */}
              <Card className="p-8 rounded-2xl border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <IconMapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Ubicación de Recojo</h2>
                </div>
                
                <div className="space-y-3">
                  {locations.map((location) => (
                    <label
                      key={location.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedLocation === location.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="location"
                        value={location.id}
                        checked={selectedLocation === location.id}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="font-medium text-foreground">{location.name}</span>
                    </label>
                  ))}
                </div>
              </Card>

              {/* Pickup Date & Time */}
              <Card className="p-8 rounded-2xl border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                    <IconClock className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Fecha y Hora de Recojo</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Date Picker */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-3">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-colors font-medium"
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-3">
                      Horario
                    </label>
                    <div className="space-y-2">
                      {timeSlots.map((slot) => (
                        <label
                          key={slot.id}
                          className={`flex items-center justify-between gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedTime === slot.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="time"
                              value={slot.id}
                              checked={selectedTime === slot.id}
                              onChange={(e) => setSelectedTime(e.target.value)}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="font-medium text-foreground text-sm">{slot.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{slot.time}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="mt-6">
                  <label className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-3">
                    Instrucciones Especiales (Opcional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Ej: Sin gluten, mensaje personalizado..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-colors resize-none"
                  />
                </div>
              </Card>

              {/* Payment Section */}
              <Card className="p-8 rounded-2xl border-border/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <IconCreditCard className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Método de Pago</h2>
                </div>

                {/* Stripe Placeholder */}
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <IconCreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium mb-2">Integración de Stripe</p>
                  <p className="text-sm text-muted-foreground/70">
                    El procesamiento de pagos será configurado próximamente
                  </p>
                </div>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-widest h-14 text-base"
                disabled={!selectedLocation || !selectedDate || !selectedTime}
              >
                Proceder al Pago
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <Card className="p-6 rounded-2xl border-border/50">
                <h3 className="text-xl font-serif font-bold text-foreground mb-6">Resumen del Pedido</h3>
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-foreground">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                        <p className="text-sm font-bold text-foreground mt-1">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IGV (18%)</span>
                    <span className="font-medium text-foreground">S/ {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">S/ {total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
