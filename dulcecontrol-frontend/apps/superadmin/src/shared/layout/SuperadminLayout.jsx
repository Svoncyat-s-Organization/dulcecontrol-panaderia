import {useState} from 'react';
import {useLocation, useNavigate, Outlet} from 'react-router-dom';
import {
    IconLayoutGrid,
    IconBuildingStore,
    IconRosetteDiscountCheck,
    IconInvoice,
    IconHeartHandshake,
    IconShieldLock,
    IconLogout
} from '@tabler/icons-react';
import {Breadcrumb, Button, Layout, Menu, theme} from 'antd';
import { useTokenStore } from '../store/tokenStore.js';

const {Header, Sider, Content, Footer} = Layout;


function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label
    };
}

const items = [
    getItem('Tablero', '/', <IconLayoutGrid size={20}/>),
    getItem('Clientes', '/tiendas', <IconBuildingStore size={20}/>, [
        getItem('Tiendas', '/tiendas/directorio'),
        getItem('Sedes', '/tiendas/sedes'),
        getItem('Dominios', '/tiendas/dominios'),
        getItem('Usuarios', '/tiendas/usuarios')
    ]),
    getItem('Suscripciones', '/suscripciones', <IconRosetteDiscountCheck size={20}/>, [
        getItem('Planes', '/suscripciones/planes'),
        getItem('Suscripciones', '/suscripciones/activas'),
        getItem('Historial', '/suscripciones/historial')
    ]),
    getItem('Facturación', '/facturacion', <IconInvoice size={20}/>, [
        getItem('Comprobantes', '/facturacion/comprobantes'),
        getItem('Métodos de Pago', '/facturacion/metodos-pago'),
        getItem('Configuración Fiscal', '/facturacion/configuracion-fiscal')
    ]),
    getItem('Soporte', '/soporte', <IconHeartHandshake size={20}/>),
    getItem('Seguridad', '/seguridad', <IconShieldLock size={20}/>, [
        getItem('El Equipo', '/seguridad/equipo-superadmin'),
        getItem('Bitácora de Auditoría', '/seguridad/bitacora-auditoria')
    ]),
];

const SuperadminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const path = location.pathname || '/';
    const selectedKey = path === '/' ? '/' : path;
    const openKeys = [];
    items.forEach(item => {
        if (item.children) {
            for (const child of item.children) {
                if (path.startsWith(child.key)) {
                    openKeys.push(item.key);
                    break;
                }
            }
        }
    });

    const onMenuClick = ({key}) => {
        navigate(key);
    };

    const { token: themeToken } = theme.useToken();
    const logout = useTokenStore((state) => state.logout);

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logo" style={{height: 48, margin: 8, background: 'rgba(255,255,255,0.2)'}}/>
                <Menu
                    mode="inline"
                    items={items}
                    style={{height: '100%', borderRight: 0}}
                    selectedKeys={[selectedKey]}
                    defaultOpenKeys={openKeys}
                    onClick={onMenuClick}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: '0 24px',
                        background: themeToken.colorBgElevated,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}
                >
                    <Button type="text" icon={<IconLogout size={18}/>} onClick={logout}>
                        Cerrar sesión
                    </Button>
                </Header>
                <Content style={{margin: '16px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        {/* Breadcrums por implementar */}
                    </Breadcrumb>
                    <div style={{padding: 24, minHeight: 360}}>
                        <Outlet/>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>DulceControl Superadmin ©2025</Footer>
            </Layout>
        </Layout>
    )
}

export default SuperadminLayout;