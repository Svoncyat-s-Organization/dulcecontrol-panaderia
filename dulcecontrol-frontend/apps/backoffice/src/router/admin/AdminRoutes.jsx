import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute.jsx';
import AdminLayout from '../../layout/admin/AdminLayout.jsx';
import { DashboardPage as AdminDashboardPage } from '../../features/admin/tablero/index.js';
import PlaceholderPage from '../../shared/components/PlaceholderPage.jsx';
import NotFoundPage from '../../shared/components/NotFoundPage.jsx';

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
    <Route path="tablero" element={<AdminDashboardPage />} />
    <Route path="clientes" element={<ClientesPage />} />
    <Route path="ventas" element={<VentasPage />} />
    <Route path="ventas/punto-de-venta" element={<VentasPage />} />
    <Route path="ventas/pedidos" element={<VentasPage />} />
    <Route path="ventas/historial" element={<VentasPage />} />
    <Route path="ventas/cajas" element={<CajasPage />} />
    <Route path="compras/insumos" element={<ComprasInsumosPage />} />
    <Route path="compras/proveedores" element={<ProveedoresPage />} />
    <Route path="compras/ordenes" element={<OrdenesCompraPage />} />
    <Route path="inventario/existencias" element={<ExistenciasPage />} />
    <Route path="inventario/insumos" element={<InsumosPage />} />
    <Route path="inventario/movimientos" element={<MovimientosPage />} />
    <Route path="produccion" element={<Navigate to="planificacion" replace />} />
    <Route path="produccion/planificacion" element={<PlanificacionPage />} />
    <Route path="produccion/stock-ideal" element={<StockIdealPage />} />
    <Route path="produccion/recetas" element={<RecetasPage />} />
    <Route path="catalogo/productos" element={<ProductosPage />} />
    <Route path="catalogo/categorias" element={<CategoriasPage />} />
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
        element={<PlaceholderPage title={title} description={description} />}
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
