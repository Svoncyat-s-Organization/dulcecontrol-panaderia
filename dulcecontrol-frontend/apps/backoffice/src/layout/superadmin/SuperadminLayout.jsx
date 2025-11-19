import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
    IconLayoutGrid,
    IconBuildingStore,
    IconRosetteDiscountCheck,
    IconInvoice,
    IconHeartHandshake,
    IconShieldLock,
    IconLogout,
} from '@tabler/icons-react';
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';
import { useTokenStore } from '../../shared/store/tokenStore.js';

const { Header, Sider, Content, Footer } = Layout;
const BASE_PATH = '/super-admin';

const getItem = (label, key, icon, children) => ({
    key,
    icon,
    children,
    label,
});

const items = [
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

const flattenKeys = (menuItems) =>
    menuItems.flatMap((item) =>
        item.children ? [item.key, ...flattenKeys(item.children)] : [item.key]
    );

const SuperadminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { token: themeToken } = theme.useToken();
    const logout = useTokenStore((state) => state.logout);

    const flatKeys = useMemo(() => flattenKeys(items), []);

    const selectedKey = useMemo(() => {
        const current = location.pathname;
        return (
            flatKeys.find((key) => current === key) ||
            flatKeys.find((key) => current.startsWith(key)) ||
            BASE_PATH
        );
    }, [flatKeys, location.pathname]);

    const openKeys = useMemo(
        () =>
            items
                .filter((item) => item.children?.some((child) => location.pathname.startsWith(child.key)))
                .map((item) => item.key),
        [location.pathname]
    );

    const [expandedKeys, setExpandedKeys] = useState(openKeys);

    useEffect(() => {
        setExpandedKeys(openKeys);
    }, [openKeys]);

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
                <div className="logo" style={{ height: 48, margin: 12, background: 'rgba(255,255,255,0.15)' }} />
                <Menu
                    mode="inline"
                    items={items}
                    style={{ height: '100%', borderRight: 0 }}
                    selectedKeys={[selectedKey]}
                    openKeys={expandedKeys}
                    onOpenChange={setExpandedKeys}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: '0 24px',
                        background: themeToken.colorBgElevated,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button type="text" icon={<IconLogout size={18} />} onClick={logout}>
                        Cerrar sesión
                    </Button>
                </Header>
                <Content style={{ margin: '16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>{/* TODO: breadcrumbs */}</Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            borderRadius: 16,
                            background: themeToken.colorBgContainer,
                            boxShadow: '0 35px 80px rgba(15, 23, 42, 0.35)',
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