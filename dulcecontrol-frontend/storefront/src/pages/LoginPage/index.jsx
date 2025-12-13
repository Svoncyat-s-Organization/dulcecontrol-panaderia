import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { IconMail, IconLock, IconAlertCircle } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginStorefront } from '../../api/auth.api';
import { useAuthStore } from '../../stores/authStore';
import { getTiendaIdentifier } from '../../config/tenant.config';

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const tiendaId = getTiendaIdentifier();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: loginStorefront,
    onSuccess: (data) => {
      setAuth(data);
      navigate('/');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!tiendaId) {
      alert('Error: No se pudo obtener el ID de la tienda');
      return;
    }

    mutate({
      tiendaId,
      email: formData.email,
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
            Bienvenido
          </h1>
          <p className="text-muted-foreground">
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-sm">
          {/* Error Message */}
          {isError && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
              <IconAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error?.message || 'Error al iniciar sesión'}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-bold uppercase tracking-widest text-foreground/70">
                  Contraseña
                </label>
                <Link to="/recuperar-contrasena" className="text-xs text-primary hover:underline font-bold">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
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

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-foreground">
                Mantener sesión iniciada
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
