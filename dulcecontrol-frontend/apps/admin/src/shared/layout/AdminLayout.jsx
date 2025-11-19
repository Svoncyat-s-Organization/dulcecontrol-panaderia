import { useState } from 'react';
import { Layout, Menu, Button, theme, Flex, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  IconLayoutGrid,
  IconShoppingBag,
  IconUsers,
  IconReport,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { useTokenStore } from '../store/tokenStore.js';

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

const getItem = (label, key, icon) => ({ key, icon, label });

const menuItems = [
  getItem('Resumen', '/', <IconLayoutGrid size={18} />),
  getItem('Ventas & Pedidos', '/ventas', <IconShoppingBag size={18} />),
  getItem('Clientes', '/clientes', <IconUsers size={18} />),
  getItem('Reportes', '/reportes', <IconReport size={18} />),
  getItem('Configuración', '/configuracion', <IconSettings size={18} />),
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token: themeToken } = theme.useToken();
  const logout = useTokenStore((state) => state.logout);

  const onMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <Flex
          align="center"
          justify="center"
          style={{ height: 56, margin: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 8 }}
        >
          <Text strong>{collapsed ? 'DC' : 'DulceControl Admin'}</Text>
        </Flex>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={[location.pathname]}
          onClick={onMenuClick}
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
          <div style={{ padding: 24, minHeight: 360, background: themeToken.colorBgContainer, borderRadius: 12 }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>DulceControl Admin ©2025</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
