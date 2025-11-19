import { useState, useMemo } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  IconLayoutGrid,
  IconShoppingBag,
  IconUsers,
  IconReport,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { useTokenStore } from '../../shared/store/tokenStore.js';

const { Header, Sider, Content, Footer } = Layout;

const BASE_PATH = '/admin';

const getItem = (label, key, icon) => ({ key, icon, label });

const menuItems = [
  getItem('Resumen', BASE_PATH, <IconLayoutGrid size={18} />),
  getItem('Ventas & Pedidos', `${BASE_PATH}/ventas`, <IconShoppingBag size={18} />),
  getItem('Clientes', `${BASE_PATH}/clientes`, <IconUsers size={18} />),
  getItem('Reportes', `${BASE_PATH}/reportes`, <IconReport size={18} />),
  getItem('Configuración', `${BASE_PATH}/configuracion`, <IconSettings size={18} />),
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useTokenStore((state) => state.logout);
  const { token: themeToken } = theme.useToken();

  const selectedKey = useMemo(() => {
    const currentPath = location.pathname;
    const match = menuItems.find((item) => currentPath.startsWith(item.key));
    return match ? match.key : BASE_PATH;
  }, [location.pathname]);

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
        <div
          style={{
            height: 56,
            margin: 16,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            letterSpacing: 0.5,
            fontWeight: 600,
          }}
        >
          {collapsed ? 'DC' : 'DulceControl Admin'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: themeToken.colorBgElevated,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Button type="text" icon={<IconLogout size={18} />} onClick={logout}>
            Cerrar sesión
          </Button>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: themeToken.colorBgContainer,
              borderRadius: 16,
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
