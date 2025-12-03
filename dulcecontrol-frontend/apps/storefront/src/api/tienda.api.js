// API pública para consumir configuración desde el backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// TODO: Reemplazar tiendaId hardcodeado por subdomain detection o param
const TIENDA_ID = 1;

export const getTiendaConfig = async () => {
  const response = await fetch(`${API_BASE_URL}/api/public/tienda/${TIENDA_ID}/config`);
  if (!response.ok) {
    throw new Error('Error al obtener configuración de tienda');
  }
  return response.json();
};

export const getPaginasActivas = async () => {
  const response = await fetch(`${API_BASE_URL}/api/public/tienda/${TIENDA_ID}/paginas`);
  if (!response.ok) {
    throw new Error('Error al obtener páginas');
  }
  return response.json();
};

export const getPaginaPorSlug = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/api/public/tienda/${TIENDA_ID}/paginas/${slug}`);
  if (!response.ok) {
    throw new Error('Página no encontrada');
  }
  return response.json();
};
