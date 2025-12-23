import { getTiendaIdentifier } from '../config/tenant.config';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Login de cliente en el storefront
 */
export const loginStorefront = async (loginData) => {
  const tiendaId = getTiendaIdentifier();
  const url = `${API_BASE_URL}/api/auth/storefront/login`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  return response.json();
};

/**
 * Registro de nuevo cliente en el storefront
 */
export const registerStorefront = async (registerData) => {
  const tiendaId = getTiendaIdentifier();
  const url = `${API_BASE_URL}/api/auth/storefront/register`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrarse');
  }

  return response.json();
};

/**
 * Verifica si un email existe y si pertenece a un cliente físico
 */
export const verificarEmail = async (tiendaId, email) => {
  const url = `${API_BASE_URL}/api/auth/storefront/verificar-email?tiendaId=${tiendaId}&email=${encodeURIComponent(email)}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al verificar email');
  }

  return response.json();
};

/**
 * Activa la cuenta de un cliente físico para que pueda acceder al storefront
 */
export const activarCuenta = async (tiendaId, activacionData) => {
  const url = `${API_BASE_URL}/api/auth/storefront/activar-cuenta?tiendaId=${tiendaId}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(activacionData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al activar cuenta');
  }

  return response.json();
};
