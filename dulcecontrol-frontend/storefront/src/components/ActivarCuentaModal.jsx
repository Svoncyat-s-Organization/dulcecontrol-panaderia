import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { IconLock, IconAlertCircle, IconFileText, IconCreditCard } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { activarCuenta } from '@/api/auth.api';

const ActivarCuentaModal = ({ isOpen, onClose, email, tiendaId, onSuccess }) => {
  const [formData, setFormData] = useState({
    tipoDoc: 'DNI',
    numeroDoc: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: ({ tiendaId, activacionData }) => activarCuenta(tiendaId, activacionData),
    onSuccess: (data) => {
      onSuccess(data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.contrasena !== formData.confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (formData.tipoDoc === 'DNI' && formData.numeroDoc.length !== 8) {
      alert('El DNI debe tener 8 dígitos');
      return;
    }

    if (formData.tipoDoc === 'RUC' && formData.numeroDoc.length !== 11) {
      alert('El RUC debe tener 11 dígitos');
      return;
    }

    mutate({
      tiendaId,
      activacionData: {
        email,
        tipoDoc: formData.tipoDoc,
        numeroDoc: formData.numeroDoc,
        contrasena: formData.contrasena
      }
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border-2 border-border rounded-2xl p-8 max-w-md w-full shadow-lg animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
            ¡Ya eres cliente!
          </h2>
          <p className="text-sm text-muted-foreground">
            Verifica tu identidad para activar tu cuenta virtual
          </p>
        </div>

        {/* Info Alert */}
        <div className="mb-6 bg-primary/10 border-2 border-primary/20 rounded-xl p-4">
          <p className="text-sm text-foreground">
            Tu email <strong>{email}</strong> está registrado en nuestra tienda física.
            Para usar la tienda virtual, verifica tu identidad.
          </p>
        </div>

        {/* Error Message */}
        {isError && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
            <IconAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error?.message || 'Error al activar cuenta'}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tipo de Documento */}
          <div>
            <label htmlFor="tipoDoc" className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
              Tipo de Documento
            </label>
            <div className="relative">
              <IconFileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                id="tipoDoc"
                name="tipoDoc"
                required
                value={formData.tipoDoc}
                onChange={handleChange}
                className="w-full pl-12 pr-4 h-12 rounded-xl border-2 border-border focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
              >
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
              </select>
            </div>
          </div>

          {/* Número de Documento */}
          <div>
            <label htmlFor="numeroDoc" className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
              Número de Documento
            </label>
            <div className="relative">
              <IconCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="numeroDoc"
                name="numeroDoc"
                type="text"
                required
                value={formData.numeroDoc}
                onChange={handleChange}
                placeholder={formData.tipoDoc === 'DNI' ? '12345678' : '20123456789'}
                maxLength={formData.tipoDoc === 'DNI' ? 8 : 11}
                className="pl-12 h-12 rounded-xl border-2 border-border focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div>
            <label htmlFor="contrasena" className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
              Nueva Contraseña
            </label>
            <div className="relative">
              <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="contrasena"
                name="contrasena"
                type="password"
                required
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="••••••••"
                className="pl-12 h-12 rounded-xl border-2 border-border focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label htmlFor="confirmarContrasena" className="block text-sm font-bold uppercase tracking-widest text-foreground/70 mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="confirmarContrasena"
                name="confirmarContrasena"
                type="password"
                required
                value={formData.confirmarContrasena}
                onChange={handleChange}
                placeholder="••••••••"
                className="pl-12 h-12 rounded-xl border-2 border-border focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl border-2 font-bold uppercase tracking-wider"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider transition-colors"
            >
              {isLoading ? 'Activando...' : 'Activar Cuenta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivarCuentaModal;
