import { lazy, Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { Spin } from 'antd';
import ProtectedRoute from '../ProtectedRoute.jsx';
import PermissionGuard from '../PermissionGuard.jsx';
import AdminLayout from '../../layout/admin/AdminLayout.jsx';
import { DashboardPage as AdminDashboardPage } from '../../features/admin/tablero/index.js';
import PlaceholderPage from '../../shared/components/PlaceholderPage.jsx';
import NotFoundPage from '../../shared/components/NotFoundPage.jsx';
import { ADMIN_ROUTE_PERMISSIONS } from '../../shared/permissions/adminPermissionConfig.js';

import { ProductosPage, CategoriasPage } from '../../features/admin/catalogo/index.js';
import { ExistenciasPage, InsumosPage, MovimientosPage } from '../../features/admin/inventario/index.js';
import { VentasPage, CajasPage } from '../../features/admin/ventas-pedidos/index.js';
import { InsumosPage as ComprasInsumosPage, ProveedoresPage, OrdenesCompraPage } from '../../features/admin/compras/index.js';
import { ClientesPage } from '../../features/admin/clientes/index.js';
import { lazy } from 'react';
import { StockIdealPage, RecetasPage, PlanificacionPage } from '../../features/admin/produccion/index.js';
import { FacturacionPage, FacturacionDetallePage, SeriesPage } from '../../features/admin/facturacion/index.js';

// Lazy loading para configuración
const DatosEmpresaPage = lazy(() => import('../../features/admin/configuracion/pages/DatosEmpresaPage.jsx'));
const SedesPage = lazy(() => import('../../features/admin/configuracion/pages/SedesPage.jsx'));
const TiendaVirtualPage = lazy(() => import('../../features/admin/configuracion/pages/TiendaVirtualPage.jsx'));

const SeguridadUsuariosPage = lazy(() => import('../../features/admin/seguridad/pages/UsuariosPage.jsx'));
const SeguridadRolesPage = lazy(() => import('../../features/admin/seguridad/pages/RolesPage.jsx'));

const RouteFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
    <Spin size="large" />
  </div>
);

const guard = (key, element) => {
  const requirements = ADMIN_ROUTE_PERMISSIONS[key] ?? [];
  if (!requirements.length) {
    return element;
  }
  return <PermissionGuard anyOf={requirements}>{element}</PermissionGuard>;
};

const PLACEHOLDER_ROUTES = [
  {
    path: 'facturacion',
    title: 'Facturación',
    description: 'Configura tus comprobantes electrónicos, series y formatos oficiales.',
  },
  {
    path: 'compras',
    title: 'Compras',
    description: 'Gestiona insumos, proveedores y órdenes de compra para tu panadería.',
  },
  {
    path: 'inventario',
    title: 'Inventario',
    description: 'Panel principal para existencias, transferencias y controles por sede.',
  },
  {
    path: 'catalogo',
    title: 'Catálogo',
    description: 'Configura productos, combos y categorías visibles para tus canales.',
  },
  {
    path: 'reportes',
    title: 'Reportes',
    description: 'Consolida KPIs diarios y alertas financieras de la operación.',
  },
  {
    path: 'configuracion',
    title: 'Configuración',
    description: 'Centralizará ajustes de tienda, branding y preferencias generales.',
    path: 'seguridad',
    title: 'Seguridad',
    description: 'Gestiona roles, permisos y accesos del personal administrativo.',
  },
  {
    path: 'configuracion/tienda-virtual',
    title: 'Tienda Virtual',
    description: 'Configura la apariencia, contenido y branding de tu tienda online.',
  },
  {
    path: 'configuracion/preferencias',
    title: 'Preferencias',
    description: 'Define horarios, monedas y parámetros locales para la operación.',
  },
];

const adminRoutes = (
  <Route
    path="/admin"
    element={
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="tablero" replace />} />
    <Route path="tablero" element={guard('tablero', <AdminDashboardPage />)} />
    <Route path="clientes" element={guard('clientes', <ClientesPage />)} />
    <Route path="ventas" element={guard('ventas', <VentasPage />)} />
    <Route path="ventas/punto-de-venta" element={guard('ventas/punto-de-venta', <VentasPage />)} />
    <Route path="ventas/pedidos" element={guard('ventas/pedidos', <VentasPage />)} />
    <Route path="ventas/historial" element={guard('ventas/historial', <VentasPage />)} />
    <Route path="ventas/cajas" element={guard('ventas/cajas', <CajasPage />)} />
    <Route path="compras/insumos" element={guard('compras/insumos', <ComprasInsumosPage />)} />
    <Route path="compras/proveedores" element={guard('compras/proveedores', <ProveedoresPage />)} />
    <Route path="compras/ordenes" element={guard('compras/ordenes', <OrdenesCompraPage />)} />
    <Route path="inventario/existencias" element={guard('inventario/existencias', <ExistenciasPage />)} />
    <Route path="inventario/insumos" element={guard('inventario/insumos', <InsumosPage />)} />
    <Route path="inventario/movimientos" element={guard('inventario/movimientos', <MovimientosPage />)} />
    <Route path="produccion" element={<Navigate to="planificacion" replace />} />
    <Route path="produccion/planificacion" element={<PlanificacionPage />} />
    <Route path="produccion/stock-ideal" element={<StockIdealPage />} />
    <Route path="produccion/recetas" element={<RecetasPage />} />
    <Route path="catalogo/productos" element={<ProductosPage />} />
    <Route path="catalogo/categorias" element={<CategoriasPage />} />
    <Route path="seguridad" element={<Navigate to="seguridad/usuarios" replace />} />
    <Route
      path="seguridad/usuarios"
      element={
        <PermissionGuard anyOf={ADMIN_ROUTE_PERMISSIONS['seguridad/usuarios'] ?? []}>
          <Suspense fallback={<RouteFallback />}>
            <SeguridadUsuariosPage />
          </Suspense>
        </PermissionGuard>
      }
    />
    <Route
      path="seguridad/roles"
      element={
        <PermissionGuard anyOf={ADMIN_ROUTE_PERMISSIONS['seguridad/roles'] ?? []}>
          <Suspense fallback={<RouteFallback />}>
            <SeguridadRolesPage />
          </Suspense>
        </PermissionGuard>
      }
    />
    <Route path="configuracion" element={<Navigate to="datos-empresa" replace />} />
    <Route path="configuracion/datos-empresa" element={<DatosEmpresaPage />} />
    <Route path="configuracion/sedes" element={<SedesPage />} />
    <Route path="configuracion/tienda-virtual" element={<TiendaVirtualPage />} />

    <Route path="facturacion/comprobantes" element={<FacturacionPage />} />
    <Route path="facturacion/comprobantes/:id" element={<FacturacionDetallePage />} />
    <Route path="facturacion/series-correlativos" element={<SeriesPage />} />

    {PLACEHOLDER_ROUTES.map(({ path, title, description }) => (
      <Route
        key={path}
        path={path}
        element={guard(path, <PlaceholderPage title={title} description={description} />)}
      />
    ))}
    <Route
      path="*"
      element={
        <NotFoundPage
          title="Sección no encontrada"
          description="No encontramos la página dentro del panel administrativo."
          homePath="/admin/tablero"
          actionLabel="Volver al tablero"
        />
      }
    />
  </Route>
);

export default adminRoutes;
