import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute.jsx';
import AdminLayout from '../../layout/admin/AdminLayout.jsx';
import { DashboardPage as AdminDashboardPage } from '../../features/admin/tablero/index.js';
import PlaceholderPage from '../../shared/components/PlaceholderPage.jsx';
import NotFoundPage from '../../shared/components/NotFoundPage.jsx';

import { ProductosPage, CategoriasPage } from '../../features/admin/catalogo/index.js';
import { ExistenciasPage, InsumosPage, MovimientosPage } from '../../features/admin/inventario/index.js';
import FacturacionPage from '../../features/admin/facturacion/pages/FacturacionPage.jsx';
import FacturacionDetallePage from '../../features/admin/facturacion/pages/FacturacionDetallePage.jsx';
import SeriesPage from '../../features/admin/facturacion/pages/SeriesPage.jsx';

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
    <Route
      path="clientes"
      element={
        <PlaceholderPage
          title="Clientes"
          description="Aquí podrás buscar, crear y fidelizar a tus clientes corporativos y retail."
        />
      }
    />
    <Route
      path="ventas"
      element={
        <PlaceholderPage
          title="Ventas & Pedidos"
          description="Resumen general de ventas, pedidos y estado de la operación diaria."
        />
      }
    />
    <Route
      path="ventas/punto-de-venta"
      element={
        <PlaceholderPage
          title="Punto de venta"
          description="Desde aquí abriremos/cerraremos la caja y habilitaremos el POS web para registrar transacciones en mostrador."
        />
      }
    />
    <Route
      path="ventas/pedidos"
      element={
        <PlaceholderPage
          title="Pedidos"
          description="Centralizaremos los pedidos online y programados para su seguimiento."
        />
      }
    />
    <Route
      path="ventas/historial"
      element={
        <PlaceholderPage
          title="Historial de ventas"
          description="Consulta el histórico de ventas por tienda, sede y canal."
        />
      }
    />
    <Route
      path="facturacion"
      element={
        <PlaceholderPage
          title="Facturación"
          description="Configura tus comprobantes electrónicos, series y formatos oficiales."
        />
      }
    />
    <Route
      path="facturacion/series-correlativos"
      element={<SeriesPage />}
    />
    <Route
      path="facturacion/comprobantes"
      element={<FacturacionPage />}
    />
    <Route
      path="facturacion/comprobantes/:id"
      element={<FacturacionDetallePage />}
    />
    <Route
      path="produccion"
      element={
        <PlaceholderPage
          title="Producción"
          description="Gestiona planes diarios, lotes especiales y coordinaciones con el obrador."
        />
      }
    />
    <Route
      path="produccion/planificacion"
      element={
        <PlaceholderPage
          title="Planificación"
          description="Define la producción estimada por turno y controla la demanda."
        />
      }
    />
    <Route
      path="produccion/recetas"
      element={
        <PlaceholderPage
          title="Recetas"
          description="Muy pronto podrás versionar recetas y costos directamente desde aquí."
        />
      }
    />
    <Route
      path="inventario"
      element={
        <PlaceholderPage
          title="Inventario"
          description="Panel principal para existencias, transferencias y controles por sede."
        />
      }
    />
    <Route path="inventario/existencias" element={<ExistenciasPage />} />
    <Route path="inventario/insumos" element={<InsumosPage />} />
    <Route path="inventario/movimientos" element={<MovimientosPage />} />
    <Route
      path="catalogo"
      element={
        <PlaceholderPage
          title="Catálogo"
          description="Configura productos, combos y categorías visibles para tus canales."
        />
      }
    />
    <Route
      path="catalogo/productos"
      element={<ProductosPage />}
    />
    <Route
      path="catalogo/categorias"
      element={<CategoriasPage />}
    />
    <Route
      path="reportes"
      element={
        <PlaceholderPage
          title="Reportes"
          description="Consolida KPIs diarios y alertas financieras de la operación."
        />
      }
    />
    <Route
      path="seguridad"
      element={
        <PlaceholderPage
          title="Seguridad"
          description="Gestiona roles, permisos y accesos del personal administrativo."
        />
      }
    />
    <Route
      path="configuracion"
      element={
        <PlaceholderPage
          title="Configuración"
          description="Centralizará ajustes de tienda, branding y preferencias generales."
        />
      }
    />
    <Route
      path="configuracion/preferencias"
      element={
        <PlaceholderPage
          title="Preferencias"
          description="Define horarios, monedas y parámetros locales para la operación."
        />
      }
    />
    <Route
      path="configuracion/sedes"
      element={
        <PlaceholderPage
          title="Sedes"
          description="Pronto podrás dar de alta o pausar sedes desde este apartado."
        />
      }
    />
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
