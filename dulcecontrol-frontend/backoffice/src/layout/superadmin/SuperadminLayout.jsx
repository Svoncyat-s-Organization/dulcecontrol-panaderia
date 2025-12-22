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
import { buildInitials, buildPreferredName } from '../../shared/utils/nameUtils.js';

const BASE_PATH = '/superadmin';

const getItem = (label, key, icon, children) => ({ key, icon, label, children });

const menuItems = [
    getItem('Tablero', BASE_PATH, <IconLayoutGrid size={20} />),
    getItem('Gestión de Tiendas', `${BASE_PATH}/tiendas`, <IconBuildingStore size={20} />),
    getItem('Suscripciones', `${BASE_PATH}/suscripciones`, <IconRosetteDiscountCheck size={20} />, [
        getItem('Planes', `${BASE_PATH}/suscripciones/planes`),
        getItem('Suscripciones', `${BASE_PATH}/suscripciones/activas`),
        getItem('Historial', `${BASE_PATH}/suscripciones/historial`),
    ]),
    getItem('Facturación', `${BASE_PATH}/facturacion`, <IconInvoice size={20} />, [
        getItem('Comprobantes', `${BASE_PATH}/facturacion/comprobantes`),
        getItem('Configuración Fiscal', `${BASE_PATH}/facturacion/configuracion-fiscal`),
    ]),
    getItem('Soporte', `${BASE_PATH}/soporte`, <IconHeartHandshake size={20} />),
    getItem('Seguridad', `${BASE_PATH}/seguridad`, <IconShieldLock size={20} />, [
        getItem('Usuarios', `${BASE_PATH}/seguridad/usuarios`),
        getItem('Roles y Permisos', `${BASE_PATH}/seguridad/roles`),
        getItem('Bitácora', `${BASE_PATH}/seguridad/bitacora`),
    ]),
];

const SuperadminLayout = () => {
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
    const profileName = buildPreferredName(fullName) || user?.sub || 'Superadmin';
    const profileInitials = buildInitials(profileName, user?.sub || 'Superadmin');

    return (
        <MainLayout
            basePath={BASE_PATH}
            menuItems={menuItems}
            headerTitle="Panel Corporativo"
            brandLabel="DulceControl"
            profileMenu={{ items: profileMenuItems, onClick: handleProfileClick }}
            profileName={profileName}
            profileInitials={profileInitials}
            footerText="DulceControl Superadmin ©2025"
            headerStyle={{ borderBottom: `2px solid ${themeToken.colorPrimary}` }}
            innerLayoutStyle={{ borderLeft: `2px solid ${themeToken.colorBorderSecondary}` }}
            contentCardStyle={{ boxShadow: '0 25px 80px rgba(134, 84, 84, 0.08)' }}
        />
    );
};

export default SuperadminLayout;