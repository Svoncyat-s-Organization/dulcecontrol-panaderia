import React, { useState } from 'react';
import { Tabs } from 'antd';
import { BgColorsOutlined, FileTextOutlined, GlobalOutlined } from '@ant-design/icons';
import BrandingForm from '../components/BrandingForm';
import PaginasStorefrontTable from '../components/PaginasStorefrontTable';
import ConfiguracionPublicaForm from '../components/ConfiguracionPublicaForm';

/**
 * Página principal del módulo Tienda Virtual (CMS & Branding)
 * Organizada en 3 pestañas:
 * 1. Apariencia (logo, favicon, colores)
 * 2. Páginas (CMS dinámico)
 * 3. Configuración Pública (banner, horarios, redes, políticas)
 */
const TiendaVirtualPage = () => {
  const [activeTab, setActiveTab] = useState('1');

  const items = [
    {
      key: '1',
      label: (
        <span>
          <BgColorsOutlined />
          Apariencia
        </span>
      ),
      children: <BrandingForm />,
    },
    {
      key: '2',
      label: (
        <span>
          <FileTextOutlined />
          Páginas
        </span>
      ),
      children: <PaginasStorefrontTable />,
    },
    {
      key: '3',
      label: (
        <span>
          <GlobalOutlined />
          Configuración Pública
        </span>
      ),
      children: <ConfiguracionPublicaForm />,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>
        🌐 Tienda Virtual (CMS & Branding)
      </h1>
      <Tabs
        activeKey={activeTab}
        items={items}
        onChange={setActiveTab}
        size="large"
      />
    </div>
  );
};

export default TiendaVirtualPage;
