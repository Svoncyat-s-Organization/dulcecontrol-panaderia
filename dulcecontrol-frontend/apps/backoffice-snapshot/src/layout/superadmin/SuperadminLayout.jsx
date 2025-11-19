import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, Outlet, Link } from 'react-router-dom';
import {
    IconLayoutGrid,
    IconBuildingStore,
    IconRosetteDiscountCheck,
    IconInvoice,
    IconHeartHandshake,
    IconShieldLock,
    IconLogout,
} from '@tabler/icons-react';
import { Button, Layout, Menu, theme, Breadcrumb } from 'antd';
import { useTokenStore } from '../../shared/store/tokenStore.js';

const { Header, Sider, Content, Footer } = Layout;
const BASE_PATH = '/superadmin';

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

const buildBreadcrumbLookup = (menuItems, trail = []) =>
    menuItems.reduce((acc, item) => {
        const currentTrail = [...trail, { path: item.key, label: item.label }];
        acc[item.key] = currentTrail;
        if (item.children) {
            Object.assign(acc, buildBreadcrumbLookup(item.children, currentTrail));
        }
        return acc;
    }, {});

const SuperadminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { token: themeToken } = theme.useToken();
    const logout = useTokenStore((state) => state.logout);

    const flatKeys = useMemo(() => flattenKeys(items), []);
    const breadcrumbLookup = useMemo(() => buildBreadcrumbLookup(items), []);

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

    const breadcrumbItems = useMemo(() => {
        const current = location.pathname;
        const matchKey = Object.keys(breadcrumbLookup)
            .filter((key) => current.startsWith(key))
            .sort((a, b) => b.length - a.length)[0];
        const trail = breadcrumbLookup[matchKey] ?? breadcrumbLookup[BASE_PATH] ?? [];
        return trail.map(({ path, label }) => ({
            title: path === current ? <span>{label}</span> : <Link to={path}>{label}</Link>,
            key: path,
        }));
    }, [breadcrumbLookup, location.pathname]);

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
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)',
                        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.35)',
                    }}
                >
                    {collapsed ? 'DC' : 'DulceControl HQ'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    items={items}
                    style={{ height: '100%', borderRight: 0 }}
                    selectedKeys={[selectedKey]}
                    openKeys={collapsed ? [] : expandedKeys}
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
                        justifyContent: 'space-between',
                        borderBottom: `1px solid ${themeToken.colorBorderSecondary}`,
                    }}
                >
                    <div style={{ fontWeight: 600, fontSize: 16 }}>Panel Corporativo</div>
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
                            'radial-gradient(circle at top, rgba(34, 197, 94, 0.18), transparent 45%)',
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
                <Footer style={{ textAlign: 'center' }}>DulceControl Superadmin ©2025</Footer>
            </Layout>
        </Layout>
    );
};

export default SuperadminLayout;