import { useMemo, useState } from 'react';
import { Layout, Menu, Breadcrumb, theme, Dropdown, Avatar, Space } from 'antd';
import { Outlet } from 'react-router-dom';
import {
  IconLayoutGrid,
  IconUsers,
  IconShoppingBag,
  IconInvoice,
  IconCakeRoll,
  IconBuildingWarehouse,
  IconBrandCakephp,
  IconReport,
  IconShieldLock,
  IconSettings,
  IconLogout,
  IconChevronDown,
} from '@tabler/icons-react';
import { useTokenStore } from '../../shared/store/tokenStore.js';
import { useMenuLogic } from '../../shared/hooks/useMenuLogic.jsx';
import SedeSelector from '../../shared/components/SedeSelector.jsx';

const { Header, Sider, Content, Footer } = Layout;

const BASE_PATH = '/admin';

const getItem = (label, key, icon, children) => ({ key, icon, label, children });

const menuItems = [
  getItem('Tablero', BASE_PATH, <IconLayoutGrid size={18} />),
  getItem('Clientes', `${BASE_PATH}/clientes`, <IconUsers size={18} />),
  getItem('Ventas & Pedidos', `${BASE_PATH}/ventas`, <IconShoppingBag size={18} />, [
    getItem('Punto de venta', `${BASE_PATH}/ventas/punto-de-venta`),
    getItem('Pedidos', `${BASE_PATH}/ventas/pedidos`),
    getItem('Historial de ventas', `${BASE_PATH}/ventas/historial`),
  ]),
  getItem('Facturación', `${BASE_PATH}/facturacion`, <IconInvoice size={18} />, [
    getItem('Series y Correlativos', `${BASE_PATH}/facturacion/series-correlativos`),
    getItem('Comprobantes', `${BASE_PATH}/facturacion/comprobantes`),
  ]),
  getItem('Producción', `${BASE_PATH}/produccion`, <IconCakeRoll size={18} />, [
    getItem('Planificación', `${BASE_PATH}/produccion/planificacion`),
    getItem('Recetas', `${BASE_PATH}/produccion/recetas`),
  ]),
  getItem('Inventario', `${BASE_PATH}/inventario`, <IconBuildingWarehouse size={18} />, [
    getItem('Existencias', `${BASE_PATH}/inventario/existencias`),
    getItem('Insumos', `${BASE_PATH}/inventario/insumos`),
    getItem('Movimientos', `${BASE_PATH}/inventario/movimientos`),
  ]),
  getItem('Catálogo', `${BASE_PATH}/catalogo`, <IconBrandCakephp size={18} />, [
    getItem('Productos', `${BASE_PATH}/catalogo/productos`),
    getItem('Categorías', `${BASE_PATH}/catalogo/categorias`),
  ]),
  getItem('Reportes', `${BASE_PATH}/reportes`, <IconReport size={18} />),
  getItem('Seguridad', `${BASE_PATH}/seguridad`, <IconShieldLock size={18} />),
  getItem('Configuración', `${BASE_PATH}/configuracion`, <IconSettings size={18} />, [
    getItem('Preferencias', `${BASE_PATH}/configuracion/preferencias`),
    getItem('Sedes', `${BASE_PATH}/configuracion/sedes`),
  ]),
];

const AdminLayout = () => {
  const logout = useTokenStore((state) => state.logout);
  const { token: themeToken } = theme.useToken();
  const [currentSede, setCurrentSede] = useState('central');
  const { collapsed, setCollapsed, menuKey, menuProps, breadcrumbItems } = useMenuLogic(
    menuItems,
    BASE_PATH
  );

  const profileMenuItems = useMemo(
    () => [
      { key: 'profile', label: 'Mi perfil' },
      { type: 'divider' },
      { key: 'logout', label: 'Cerrar sesión', icon: <IconLogout size={16} /> },
    ],
    []
  );

  const handleProfileClick = ({ key }) => {
    if (key === 'logout') {
      logout();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="light"
        style={{ background: '#fff'}}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            letterSpacing: 0.5,
            fontWeight: 600,
            backgroundColor: themeToken.colorPrimary,
            boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
          }}
        >
          {collapsed ? 'DC' : 'DulceControl Admin'}
        </div>
        <Menu key={menuKey} theme="light" mode="inline" {...menuProps} />
      </Sider>
      <Layout style={{borderLeft: `2px solid ${themeToken.colorBorderSecondary}` }}>
        <Header
          style={{
            height: 56,
            padding: '0 16px',
            background: themeToken.colorBgElevated,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `2px solid ${themeToken.colorPrimary}`,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 16 }}>Panel Administrativo</div>
          <Space size={16} align="center">
            <SedeSelector value={currentSede} onChange={setCurrentSede} />
            <Dropdown menu={{ items: profileMenuItems, onClick: handleProfileClick }} trigger={['click']}>
              <Space size={10} style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: themeToken.colorPrimary, color: '#fff' }}>AD</Avatar>
                <span style={{ fontWeight: 500 }}>Administrador</span>
                <IconChevronDown size={16} />
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: 0,
            minHeight: 'calc(100vh - 160px)',
            background: themeToken.colorBgLayout,
          }}
        >
          <div style={{ padding: '0 32px 16px' }}>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div
            style={{
              padding: 32,
              minHeight: 360,
              background: themeToken.colorBgContainer,
              borderRadius: 20,
              boxShadow: '0 25px 80px rgba(15, 23, 42, 0.08)',
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>DulceControl Admin ©2025</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
