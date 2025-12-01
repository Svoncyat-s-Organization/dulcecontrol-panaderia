import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute.jsx';
import AdminLayout from '../../layout/admin/AdminLayout.jsx';
import { DashboardPage as AdminDashboardPage } from '../../features/admin/tablero/index.js';
import PlaceholderPage from '../../shared/components/PlaceholderPage.jsx';
import NotFoundPage from '../../shared/components/NotFoundPage.jsx';

import { ProductosPage, CategoriasPage } from '../../features/admin/catalogo/index.js';
import { ExistenciasPage, InsumosPage, MovimientosPage } from '../../features/admin/inventario/index.js';
import { VentasPage, CajasPage } from '../../features/admin/ventas-pedidos/index.js';

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
    <Route path="ventas" element={<Navigate to="ventas/punto-de-venta" replace />} />
    <Route path="ventas/punto-de-venta" element={<VentasPage />} />
    <Route path="ventas/pedidos" element={<VentasPage />} />
    <Route path="ventas/cajas" element={<CajasPage />} />
    <Route path="ventas/historial" element={<VentasPage />} />
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
      element={
        <PlaceholderPage
          title="Series y correlativos"
          description="Enlazaremos tus series con SUNAT para mantener la numeración bajo control."
        />
      }
    />
    <Route
      path="facturacion/comprobantes"
      element={
        <PlaceholderPage
          title="Comprobantes"
          description="Revisa, descarga o anula los comprobantes emitidos por la tienda."
        />
      }
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
