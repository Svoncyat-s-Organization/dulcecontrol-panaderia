import { useMemo } from 'react';
import { theme } from 'antd';
import {
  IconLayoutGrid,
  IconUsers,
  IconShoppingBag,
  IconInvoice,
  IconCakeRoll,
  IconBuildingWarehouse,
  IconBrandCakephp,
  IconBasketDollar,
  IconReport,
  IconShieldLock,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { useTokenStore } from '../../shared/store/tokenStore.js';
import SedeSelector from '../../shared/components/SedeSelector.jsx';
import MainLayout from '../shared/MainLayout.jsx';
import { buildInitials, buildPreferredName } from '../../shared/utils/nameUtils.js';

const BASE_PATH = '/admin';

const getItem = (label, key, icon, children) => ({ key, icon, label, children });

const menuItems = [
  getItem('Tablero', BASE_PATH, <IconLayoutGrid size={18} />),
  getItem('Clientes', `${BASE_PATH}/clientes`, <IconUsers size={18} />),
  getItem('Ventas & Pedidos', `${BASE_PATH}/ventas`, <IconShoppingBag size={18} />, [
    getItem('Punto de venta', `${BASE_PATH}/ventas/punto-de-venta`),
    getItem('Pedidos', `${BASE_PATH}/ventas/pedidos`),
    getItem('Cajas', `${BASE_PATH}/ventas/cajas`),
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
  getItem('Catálogo', `${BASE_PATH}/catalogo`, <IconBrandCakephp size={18} />, [
    getItem('Productos', `${BASE_PATH}/catalogo/productos`),
    getItem('Categorías', `${BASE_PATH}/catalogo/categorias`),
  ]),
  getItem('Compras y Proveedores', `${BASE_PATH}/compras`, <IconBasketDollar size={18} />, [
    getItem('Proveedores', `${BASE_PATH}/compras/proveedores`),
    getItem('Órdenes de Compra', `${BASE_PATH}/compras/ordenes`),
  ]),
  getItem('Inventario', `${BASE_PATH}/inventario`, <IconBuildingWarehouse size={18} />, [
    getItem('Existencias', `${BASE_PATH}/inventario/existencias`),
    getItem('Insumos', `${BASE_PATH}/inventario/insumos`),
    getItem('Movimientos', `${BASE_PATH}/inventario/movimientos`),
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
  const user = useTokenStore((state) => state.user);
  const { token: themeToken } = theme.useToken();

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

  const fullName = user?.nombre_completo || user?.nombre || user?.name || '';
  const profileName = buildPreferredName(fullName) || user?.sub || 'Administrador';
  const profileInitials = buildInitials(profileName, user?.sub || 'Administrador');

  return (
    <MainLayout
      basePath={BASE_PATH}
      menuItems={menuItems}
      headerTitle="Panel Administrativo"
      brandLabel="DulceControl Admin"
      profileMenu={{ items: profileMenuItems, onClick: handleProfileClick }}
      profileName={profileName}
      profileInitials={profileInitials}
      headerExtras={<SedeSelector />}
      footerText="DulceControl Admin ©2025"
      headerStyle={{ borderBottom: `2px solid ${themeToken.colorPrimary}` }}
    />
  );
};

export default AdminLayout;
