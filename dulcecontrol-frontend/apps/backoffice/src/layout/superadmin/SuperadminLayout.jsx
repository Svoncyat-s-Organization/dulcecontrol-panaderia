import { useMemo } from 'react';
import { theme } from 'antd';
import {
    IconLayoutGrid,
    IconBuildingStore,
    IconRosetteDiscountCheck,
    IconInvoice,
    IconHeartHandshake,
    IconShieldLock,
    IconLogout,
} from '@tabler/icons-react';
import { useTokenStore } from '../../shared/store/tokenStore.js';
import MainLayout from '../shared/MainLayout.jsx';

const BASE_PATH = '/superadmin';

const getItem = (label, key, icon, children) => ({ key, icon, label, children });

const menuItems = [
    getItem('Tablero', BASE_PATH, <IconLayoutGrid size={20} />),
    getItem('Clientes', `${BASE_PATH}/tiendas`, <IconBuildingStore size={20} />, [
        getItem('Tiendas', `${BASE_PATH}/tiendas/directorio`),
        getItem('Sedes', `${BASE_PATH}/tiendas/sedes`),
        getItem('Dominios', `${BASE_PATH}/tiendas/dominios`),
        getItem('Usuarios', `${BASE_PATH}/tiendas/usuarios`),
    ]),
    getItem('Suscripciones', `${BASE_PATH}/suscripciones`, <IconRosetteDiscountCheck size={20} />, [
        getItem('Planes', `${BASE_PATH}/suscripciones/planes`),
        getItem('Suscripciones', `${BASE_PATH}/suscripciones/activas`),
        getItem('Historial', `${BASE_PATH}/suscripciones/historial`),
    ]),
    getItem('Facturación', `${BASE_PATH}/facturacion`, <IconInvoice size={20} />, [
        getItem('Comprobantes', `${BASE_PATH}/facturacion/comprobantes`),
        getItem('Métodos de Pago', `${BASE_PATH}/facturacion/metodos-pago`),
        getItem('Configuración Fiscal', `${BASE_PATH}/facturacion/configuracion-fiscal`),
    ]),
    getItem('Soporte', `${BASE_PATH}/soporte`, <IconHeartHandshake size={20} />),
    getItem('Seguridad', `${BASE_PATH}/seguridad`, <IconShieldLock size={20} />, [
        getItem('El Equipo', `${BASE_PATH}/seguridad/equipo-superadmin`),
        getItem('Bitácora de Auditoría', `${BASE_PATH}/seguridad/bitacora-auditoria`),
    ]),
];

const SuperadminLayout = () => {
    const logout = useTokenStore((state) => state.logout);
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

    return (
        <MainLayout
            basePath={BASE_PATH}
            menuItems={menuItems}
            headerTitle="Panel Corporativo"
            brandLabel="DulceControl"
            profileMenu={{ items: profileMenuItems, onClick: handleProfileClick }}
            profileName="Superadmin"
            profileInitials="SA"
            footerText="DulceControl Superadmin ©2025"
            headerStyle={{ borderBottom: `2px solid ${themeToken.colorPrimary}` }}
            innerLayoutStyle={{ borderLeft: `2px solid ${themeToken.colorBorderSecondary}` }}
            contentCardStyle={{ boxShadow: '0 25px 80px rgba(134, 84, 84, 0.08)' }}
        />
    );
};

export default SuperadminLayout;