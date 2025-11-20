import { useMemo, useState } from 'react';
import { theme } from 'antd';
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
import SedeSelector from '../../shared/components/SedeSelector.jsx';
import MainLayout from '../shared/MainLayout.jsx';

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
    <MainLayout
      basePath={BASE_PATH}
      menuItems={menuItems}
      headerTitle="Panel Administrativo"
      brandLabel="DulceControl Admin"
      profileMenu={{ items: profileMenuItems, onClick: handleProfileClick }}
      profileName="Administrador"
      profileInitials="AD"
      headerExtras={<SedeSelector value={currentSede} onChange={setCurrentSede} />}
      footerText="DulceControl Admin ©2025"
      headerStyle={{ borderBottom: `2px solid ${themeToken.colorPrimary}` }}
    />
  );
};

export default AdminLayout;
