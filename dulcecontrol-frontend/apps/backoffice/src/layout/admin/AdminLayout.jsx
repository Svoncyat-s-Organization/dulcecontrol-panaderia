import { useEffect, useMemo, useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
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
} from '@tabler/icons-react';
import { useTokenStore } from '../../shared/store/tokenStore.js';

const { Header, Sider, Content, Footer } = Layout;

const BASE_PATH = '/admin';

const getItem = (label, key, icon, children) => ({ key, icon, label, children });

const menuItems = [
  getItem('Tablero', BASE_PATH, <IconLayoutGrid size={18} />),
  getItem('Clientes', `${BASE_PATH}/clientes`, <IconUsers size={18} />),
  getItem('Ventas & Pedidos', `${BASE_PATH}/ventas`, <IconShoppingBag size={18} />, [
    getItem('Punto de venta', `${BASE_PATH}/ventas/pedidos`),
    getItem('Pedidos', `${BASE_PATH}/ventas/pedidos`),
    getItem('Historial de ventas', `${BASE_PATH}/ventas/pedidos`),
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

const flattenKeys = (items) =>
  items.flatMap((item) => (item.children ? [item.key, ...flattenKeys(item.children)] : [item.key]));

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useTokenStore((state) => state.logout);
  const { token: themeToken } = theme.useToken();
  const flatKeys = useMemo(() => flattenKeys(menuItems), []);

  const selectedKey = useMemo(() => {
    const current = location.pathname;
    const exactMatch = flatKeys.find((key) => current === key);
    if (exactMatch) return exactMatch;
    const partialMatch = flatKeys
      .slice()
      .sort((a, b) => b.length - a.length)
      .find((key) => current.startsWith(key));
    return partialMatch ?? BASE_PATH;
  }, [flatKeys, location.pathname]);

  const derivedOpenKeys = useMemo(
    () =>
      menuItems
        .filter((item) => item.children?.some((child) => location.pathname.startsWith(child.key)))
        .map((item) => item.key),
    [location.pathname]
  );

  useEffect(() => {
    if (!collapsed) {
      setOpenKeys(derivedOpenKeys);
    }
  }, [collapsed, derivedOpenKeys]);

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
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            letterSpacing: 0.5,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #1a7cfe 0%, #2dd4ff 100%)',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.35)',
          }}
        >
          {collapsed ? 'DC' : 'DulceControl Admin'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          selectedKeys={[selectedKey]}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={setOpenKeys}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: themeToken.colorBgElevated,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 16 }}>Panel Administrativo</div>
          <Button type="text" icon={<IconLogout size={18} />} onClick={logout}>
            Cerrar sesión
          </Button>
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: 0,
            minHeight: 'calc(100vh - 160px)',
            background:
              'radial-gradient(circle at top, rgba(45, 212, 255, 0.18), transparent 45%)',
          }}
        >
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
