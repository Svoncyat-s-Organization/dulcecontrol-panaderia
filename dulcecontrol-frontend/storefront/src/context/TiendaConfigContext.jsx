import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTiendaConfig } from '../api/tienda.api';
import { getTiendaIdentifier } from '../config/tenant.config';

// Función auxiliar para convertir HEX a RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Función para convertir HEX a HSL (para Tailwind)
const hexToHsl = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

const TiendaConfigContext = createContext(null);

export const TiendaConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Verificar que se pueda detectar la tienda
        const identifier = getTiendaIdentifier();
        if (!identifier) {
          throw new Error('TIENDA_NO_DETECTADA');
        }

        const data = await getTiendaConfig();
        
        // Verificar que la tienda esté activa
        if (data && data.activo === false) {
          throw new Error('TIENDA_INACTIVA');
        }
        
        setConfig(data);
        
        // Inyectar colores como variables CSS globales
        if (data.colorPrimario) {
          const primaryHex = data.colorPrimario;
          const primaryRgb = hexToRgb(primaryHex);
          const primaryHsl = hexToHsl(primaryHex);
          
          // HEX directo
          document.documentElement.style.setProperty('--color-primary-hex', primaryHex);
          
          // RGB para transparencias
          if (primaryRgb) {
            document.documentElement.style.setProperty('--color-primary-rgb', `${primaryRgb.r} ${primaryRgb.g} ${primaryRgb.b}`);
          }
          
          // HSL para Tailwind (sobrescribe los valores por defecto)
          if (primaryHsl) {
            document.documentElement.style.setProperty('--primary', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
            // Calcular foreground (texto) basado en la luminosidad
            const foregroundL = primaryHsl.l > 50 ? 20 : 98;
            document.documentElement.style.setProperty('--primary-foreground', `${primaryHsl.h} ${primaryHsl.s}% ${foregroundL}%`);
          }
        }
        
        if (data.colorSecundario) {
          const secondaryHex = data.colorSecundario;
          const secondaryRgb = hexToRgb(secondaryHex);
          const secondaryHsl = hexToHsl(secondaryHex);
          
          // HEX directo
          document.documentElement.style.setProperty('--color-secondary-hex', secondaryHex);
          
          // RGB para transparencias
          if (secondaryRgb) {
            document.documentElement.style.setProperty('--color-secondary-rgb', `${secondaryRgb.r} ${secondaryRgb.g} ${secondaryRgb.b}`);
          }
          
          // HSL para Tailwind (sobrescribe los valores por defecto)
          if (secondaryHsl) {
            document.documentElement.style.setProperty('--secondary', `${secondaryHsl.h} ${secondaryHsl.s}% ${secondaryHsl.l}%`);
            // Calcular foreground (texto) basado en la luminosidad
            const foregroundL = secondaryHsl.l > 50 ? 20 : 98;
            document.documentElement.style.setProperty('--secondary-foreground', `${secondaryHsl.h} ${secondaryHsl.s}% ${foregroundL}%`);
          }
        }
        
        // Actualizar título de la página
        if (data.nombreComercial) {
          document.title = data.nombreComercial;
        }
        
        // Actualizar favicon si existe
        if (data.urlFavicon) {
          const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = data.urlFavicon;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
      } catch (err) {
        console.error('Error al cargar configuración de tienda:', err);
        setError(err.message || 'ERROR_DESCONOCIDO');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-yellow-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Cargando tienda...</p>
          <p className="text-sm text-gray-500 mt-2">Preparando todo para ti</p>
        </div>
      </div>
    );
  }

  // Estado de error: Tienda no detectada
  if (error === 'TIENDA_NO_DETECTADA' || error?.includes('No se pudo detectar')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tienda No Encontrada
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            No pudimos identificar la tienda desde este dominio. Verifica que estés accediendo desde el dominio correcto.
          </p>
          <div className="bg-white rounded-lg p-4 text-left text-sm text-gray-500 border border-gray-200">
            <p className="font-mono text-xs">
              <strong>Hostname actual:</strong> {window.location.hostname}
            </p>
            <p className="mt-2 text-xs">
              En desarrollo, asegúrate de tener <code className="bg-gray-100 px-1 rounded">VITE_TIENDA_ID</code> en tu archivo <code className="bg-gray-100 px-1 rounded">.env.local</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Estado de error: Tienda inactiva
  if (error === 'TIENDA_INACTIVA') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tienda Cerrada Temporalmente
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {config?.mensajeCierre || 'Estamos realizando mejoras. Volveremos pronto con nuevas sorpresas.'}
          </p>
        </div>
      </div>
    );
  }

  // Estado de error: Backend no disponible u otro error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tienda Temporalmente No Disponible
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Estamos teniendo problemas técnicos. Por favor, intenta nuevamente en unos minutos.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600 transition-colors"
          >
            Reintentar
          </button>
          {import.meta.env.MODE === 'development' && (
            <div className="mt-6 bg-white rounded-lg p-4 text-left text-sm text-red-600 border border-red-200">
              <strong>Error de desarrollo:</strong>
              <pre className="mt-2 text-xs overflow-auto">{error}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <TiendaConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </TiendaConfigContext.Provider>
  );
};

export const useTiendaConfig = () => {
  const context = useContext(TiendaConfigContext);
  if (!context) {
    throw new Error('useTiendaConfig debe usarse dentro de un TiendaConfigProvider');
  }
  return context;
};
