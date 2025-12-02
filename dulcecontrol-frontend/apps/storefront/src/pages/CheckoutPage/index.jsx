import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { IconTruck, IconBuildingStore, IconCalendar, IconClock, IconCreditCard, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Placeholder Stripe Key - Replace with env variable
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const steps = [
  { id: 1, title: 'Entrega', icon: IconTruck },
  { id: 2, title: 'Fecha', icon: IconCalendar },
  { id: 3, title: 'Datos', icon: IconBuildingStore }, // Using generic icon for details
  { id: 4, title: 'Pago', icon: IconCreditCard },
];

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [fulfillmentType, setFulfillmentType] = useState('pickup');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-6xl">
        <h1 className="text-4xl font-serif font-bold text-center mb-12 text-foreground">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Steps */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step Indicator */}
            <div className="flex justify-between items-center mb-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10" />
              {steps.map((s) => (
                <div key={s.id} className="flex flex-col items-center bg-background px-2">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                      step >= s.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-muted-foreground text-muted-foreground"
                    )}
                  >
                    {step > s.id ? <IconCheck className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={cn("text-xs font-bold mt-2 uppercase tracking-wider", step >= s.id ? "text-foreground" : "text-muted-foreground")}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Fulfillment */}
            {step === 1 && (
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-6">
                  <h2 className="text-2xl font-serif font-bold">¿Cómo quieres recibir tu pedido?</h2>
                  <RadioGroup value={fulfillmentType} onValueChange={setFulfillmentType} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Label
                      htmlFor="pickup"
                      className={cn(
                        "flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer hover:border-primary/50 transition-all",
                        fulfillmentType === 'pickup' ? "border-primary bg-primary/5" : "border-border"
                      )}
                    >
                      <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                      <IconBuildingStore className="w-12 h-12 mb-4 text-primary" />
                      <span className="font-bold text-lg">Recojo en Tienda</span>
                      <span className="text-sm text-muted-foreground text-center mt-2">Recoge tu pedido en nuestra tienda de Miraflores.</span>
                    </Label>
                    <Label
                      htmlFor="delivery"
                      className={cn(
                        "flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer hover:border-primary/50 transition-all",
                        fulfillmentType === 'delivery' ? "border-primary bg-primary/5" : "border-border"
                      )}
                    >
                      <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                      <IconTruck className="w-12 h-12 mb-4 text-primary" />
                      <span className="font-bold text-lg">Delivery</span>
                      <span className="text-sm text-muted-foreground text-center mt-2">Te lo llevamos a la puerta de tu casa.</span>
                    </Label>
                  </RadioGroup>
                  <div className="flex justify-end">
                    <Button onClick={nextStep} className="rounded-full px-8">Continuar</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-6">
                  <h2 className="text-2xl font-serif font-bold">Elige fecha y hora</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label>Fecha</Label>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow-sm bg-white"
                        locale={es}
                        disabled={(date) => date < new Date()}
                      />
                    </div>
                    <div className="space-y-4">
                      <Label>Hora Estimada</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00', '17:00 - 19:00'].map((slot) => (
                          <Button
                            key={slot}
                            variant={time === slot ? "default" : "outline"}
                            className={cn("w-full", time === slot && "bg-primary text-primary-foreground")}
                            onClick={() => setTime(slot)}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep} className="rounded-full px-8">Atrás</Button>
                    <Button onClick={nextStep} disabled={!date || !time} className="rounded-full px-8">Continuar</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-6">
                  <h2 className="text-2xl font-serif font-bold">Tus Datos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Juan" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Pérez" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="juan@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="999 999 999" />
                    </div>
                  </div>

                  {fulfillmentType === 'delivery' && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      <h3 className="font-bold text-lg">Dirección de Envío</h3>
                      <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Av. Larco 123" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">Distrito</Label>
                          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Miraflores" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">Referencia</Label>
                          <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="Frente al parque" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep} className="rounded-full px-8">Atrás</Button>
                    <Button onClick={nextStep} className="rounded-full px-8">Continuar</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-6">
                  <h2 className="text-2xl font-serif font-bold">Pago Seguro</h2>
                  <div className="bg-white p-6 rounded-xl border border-border">
                    {/* Note: In a real app, you'd fetch the clientSecret from your backend here */}
                    <Elements stripe={stripePromise} options={{ mode: 'payment', currency: 'pen', amount: 10000 }}>
                      <CheckoutForm />
                    </Elements>
                  </div>
                  <div className="flex justify-start">
                    <Button variant="outline" onClick={prevStep} className="rounded-full px-8">Atrás</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-white border-border">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-serif font-bold text-xl border-b border-border pb-4">Resumen del Pedido</h3>
                
                {/* Mock Items - Replace with Cart Context */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=200" alt="Cake" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">Red Velvet Cake</h4>
                      <p className="text-xs text-muted-foreground">Clásico</p>
                      <p className="text-sm font-medium mt-1">S/ 85.00</p>
                    </div>
                  </div>
                   <div className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=200" alt="Cupcake" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">Vanilla Cupcake</h4>
                      <p className="text-xs text-muted-foreground">Pack x6</p>
                      <p className="text-sm font-medium mt-1">S/ 45.00</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>S/ 130.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span>{fulfillmentType === 'delivery' ? 'S/ 15.00' : 'Gratis'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span>S/ {fulfillmentType === 'delivery' ? '145.00' : '130.00'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/success', // Update with production URL
      },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
      <Button type="submit" disabled={!stripe} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg font-bold">
        Pagar Ahora
      </Button>
    </form>
  );
};

export default CheckoutPage;
