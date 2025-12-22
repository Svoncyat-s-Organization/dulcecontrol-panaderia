import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute.jsx';
import PermissionGuard from '../PermissionGuard.jsx';
import AdminLayout from '../../layout/admin/AdminLayout.jsx';
import PlaceholderPage from '../../shared/components/PlaceholderPage.jsx';
import NotFoundPage from '../../shared/components/NotFoundPage.jsx';
import { ADMIN_ROUTE_PERMISSIONS } from '../../shared/permissions/adminPermissionConfig.js';
import { DashboardPage as AdminDashboardPage } from '../../features/admin/tablero/index.js';
import { ClientesPage } from '../../features/admin/clientes/index.js';
import { VentasPage, CajasPage } from '../../features/admin/ventas-pedidos/index.js';
import { InsumosPage as ComprasInsumosPage, ProveedoresPage, OrdenesCompraPage } from '../../features/admin/compras/index.js';
import { ExistenciasPage, InsumosPage, MovimientosPage, TransferenciasPage } from '../../features/admin/inventario/index.js';
import { StockIdealPage, RecetasPage, PlanificacionPage } from '../../features/admin/produccion/index.js';
import { ProductosPage, CategoriasPage } from '../../features/admin/catalogo/index.js';
import { FacturacionPage, FacturacionDetallePage, SeriesPage } from '../../features/admin/facturacion/index.js';
import { ReportesVentasPage, ReportesPedidosPage } from '../../features/admin/reportes/index.js';
import DatosEmpresaPage from '../../features/admin/configuracion/pages/DatosEmpresaPage.jsx';
import SedesPage from '../../features/admin/configuracion/pages/SedesPage.jsx';
import TiendaVirtualPage from '../../features/admin/configuracion/pages/TiendaVirtualPage.jsx';
import SeguridadUsuariosPage from '../../features/admin/seguridad/pages/UsuariosPage.jsx';
import SeguridadRolesPage from '../../features/admin/seguridad/pages/RolesPage.jsx';

const guard = (key, element) => {
  const perms = ADMIN_ROUTE_PERMISSIONS[key] ?? [];
  return perms.length ? <PermissionGuard anyOf={perms}>{element}</PermissionGuard> : element;
};

const PLACEHOLDERS = [
  { path: 'facturacion', title: 'Facturación', description: 'Configura comprobantes y series.' },
  { path: 'compras', title: 'Compras', description: 'Gestiona insumos y proveedores.' },
  { path: 'inventario', title: 'Inventario', description: 'Control de existencias por sede.' },
  { path: 'catalogo', title: 'Catálogo', description: 'Productos y categorías.' },
  { path: 'configuracion/preferencias', title: 'Preferencias', description: 'Horarios y parámetros.' },
];

const adminRoutes = (
  <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
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
    <Route path="inventario/transferencias" element={guard('inventario/transferencias', <TransferenciasPage />)} />
    
    <Route path="produccion" element={<Navigate to="planificacion" replace />} />
    <Route path="produccion/planificacion" element={<PlanificacionPage />} />
    <Route path="produccion/stock-ideal" element={<StockIdealPage />} />
    <Route path="produccion/recetas" element={<RecetasPage />} />
    
    <Route path="catalogo/productos" element={<ProductosPage />} />
    <Route path="catalogo/categorias" element={<CategoriasPage />} />
    
    <Route path="facturacion/comprobantes" element={<FacturacionPage />} />
    <Route path="facturacion/comprobantes/:id" element={<FacturacionDetallePage />} />
    <Route path="facturacion/series-correlativos" element={<SeriesPage />} />
    
    <Route path="reportes" element={<Navigate to="ventas" replace />} />
    <Route path="reportes/ventas" element={guard('reportes/ventas', <ReportesVentasPage />)} />
    <Route path="reportes/pedidos" element={guard('reportes/pedidos', <ReportesPedidosPage />)} />

    <Route path="seguridad" element={<Navigate to="seguridad/usuarios" replace />} />
    <Route path="seguridad/usuarios" element={guard('seguridad/usuarios', <SeguridadUsuariosPage />)} />
    <Route path="seguridad/roles" element={guard('seguridad/roles', <SeguridadRolesPage />)} />
    
    <Route path="configuracion" element={<Navigate to="datos-empresa" replace />} />
    <Route path="configuracion/datos-empresa" element={<DatosEmpresaPage />} />
    <Route path="configuracion/sedes" element={<SedesPage />} />
    <Route path="configuracion/tienda-virtual" element={<TiendaVirtualPage />} />
    
    {PLACEHOLDERS.map(({ path, title, description }) => (
      <Route key={path} path={path} element={guard(path, <PlaceholderPage title={title} description={description} />)} />
    ))}
    
    <Route path="*" element={<NotFoundPage title="Sección no encontrada" description="No encontramos la página dentro del panel administrativo." homePath="/admin/tablero" actionLabel="Volver al tablero" />} />
  </Route>
);

export default adminRoutes;
