import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import {
    IconLayoutGrid,
    IconBuildingStore,
    IconRosetteDiscountCheck,
    IconInvoice,
    IconHeartHandshake,
    IconShieldLock,
    IconLogout,
    IconChevronDown,
} from '@tabler/icons-react';
import { Layout, Menu, theme, Breadcrumb, Dropdown, Avatar, Space } from 'antd';
import { useTokenStore } from '../../shared/store/tokenStore.js';
import { useMenuLogic } from '../../shared/hooks/useMenuLogic.jsx';

const { Header, Sider, Content, Footer } = Layout;
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
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        backgroundColor: themeToken.colorPrimary,
                        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
                    }}
                >
                    {collapsed ? 'DC' : 'DulceControl'}
                </div>
                <Menu
                    key={menuKey}
                    theme="light"
                    mode="inline"
                    style={{ height: '100%', borderRight: 0,  }}
                    {...menuProps}
                />
            </Sider>
            <Layout style={{borderLeft: `2px solid ${themeToken.colorBorderSecondary}`}}>
                <Header
                    style={{
                        height: 56,
                        padding: '0 16px',
                        background: themeToken.colorBgElevated,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: `2px solid ${themeToken.colorPrimary}`,
                    }}
                >
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Panel Corporativo</div>
                    <Dropdown menu={{ items: profileMenuItems, onClick: handleProfileClick }} trigger={['click']}>
                        <Space size={10} style={{ cursor: 'pointer' }}>
                            <Avatar style={{ backgroundColor: themeToken.colorPrimary, color: '#fff' }}>SA</Avatar>
                            <span style={{ fontWeight: 500 }}>Superadmin</span>
                            <IconChevronDown size={16} />
                        </Space>
                    </Dropdown>
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
                            boxShadow: '0 25px 80px rgba(134, 84, 84, 0.08)',
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>DulceControl Superadmin ©2025</Footer>
            </Layout>
        </Layout>
    );
};

export default SuperadminLayout;