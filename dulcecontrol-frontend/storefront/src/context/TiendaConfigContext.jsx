import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTiendaConfig } from '../api/tienda.api';

const TiendaConfigContext = createContext(null);

export const TiendaConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getTiendaConfig();
        setConfig(data);
        
        // Inyectar colores como variables CSS
        if (data.colorPrimario) {
          document.documentElement.style.setProperty('--color-primary', data.colorPrimario);
        }
        if (data.colorSecundario) {
          document.documentElement.style.setProperty('--color-secondary', data.colorSecundario);
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

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
