import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { IconMail, IconLock, IconUser, IconAlertCircle, IconPhone } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerStorefront } from '../../api/auth.api';
import { useAuthStore } from '../../stores/authStore';
import { getTiendaIdentifier } from '../../config/tenant.config';

const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const tiendaId = getTiendaIdentifier();

  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: registerStorefront,
    onSuccess: (data) => {
      setAuth(data);
      navigate('/');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!tiendaId) {
      alert('Error: No se pudo obtener el ID de la tienda');
      return;
    }

    mutate({
      tiendaId,
      nombreCompleto: formData.nombreCompleto,
      email: formData.email,
      telefono: formData.telefono || null,
      password: formData.password,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">
            Crear Cuenta
          </h1>
          <p className="text-muted-foreground">
            Únete a DulceControl
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-sm">
          {/* Error Message */}
          {isError && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
              <IconAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error?.message || 'Error al registrarse'}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="nombreCompleto" className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
                Nombre Completo
              </label>
              <div className="relative">
                <IconUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="nombreCompleto"
                  name="nombreCompleto"
                  type="text"
                  required
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className="pl-12 h-12 rounded-xl border-2 border-border focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="pl-12 h-12 rounded-xl border-2 border-border focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
                Teléfono (Opcional)
              </label>
              <div className="relative">
                <IconPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+56 9 1234 5678"
                  className="pl-12 h-12 rounded-xl border-2 border-border focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-12 h-12 rounded-xl border-2 border-border focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-12 h-12 rounded-xl border-2 border-border focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-bold tracking-widest">
                o
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-xs text-center text-muted-foreground mt-6">
          Al registrarte, aceptas nuestros{' '}
          <Link to="/terminos" className="text-primary hover:underline">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link to="/privacidad" className="text-primary hover:underline">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
