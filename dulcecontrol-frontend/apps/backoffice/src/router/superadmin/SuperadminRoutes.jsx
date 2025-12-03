import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute.jsx';
import SuperadminLayout from '../../layout/superadmin/SuperadminLayout.jsx';
import PlaceholderPage from '../../shared/components/PlaceholderPage.jsx';
import { VerTableroPage as SuperadminDashboardPage } from '../../features/superadmin/tablero/index.js';
import { PlanesManager, SuscripcionesManager, HistorialManager } from '../../features/superadmin/suscripciones/index.js';
import NotFoundPage from '../../shared/components/NotFoundPage.jsx';
import TiendasPage from '../../features/superadmin/tiendas/pages/TiendasPage.jsx';
import SedesPage from '../../features/superadmin/tiendas/pages/SedesPage.jsx';
import DominiosPage from '../../features/superadmin/tiendas/pages/DominiosPage.jsx';
import UsuariosPage from '../../features/superadmin/tiendas/pages/UsuariosPage.jsx';
import { SoporteTicketsPage } from '../../features/superadmin/soporte/index.js';

const superadminRoutes = (
    <Route
      path="tablero"
      element={
        <SuperadminDashboardPage />
      }
    />
    <Route path="tiendas/directorio" element={<TiendasPage />} />
    <Route path="tiendas/sedes" element={<SedesPage />} />
    <Route path="tiendas/:tiendaId/sedes" element={<SedesPage />} />
    <Route path="tiendas/dominios" element={<DominiosPage />} />
    <Route path="tiendas/:tiendaId/dominios" element={<DominiosPage />} />
    <Route path="tiendas/usuarios" element={<UsuariosPage />} />
    <Route path="tiendas/:tiendaId/usuarios" element={<UsuariosPage />} />
    <Route
      path="suscripciones/planes"
      element={<PlanesManager />}
    />
    <Route
      path="suscripciones/activas"
      element={<SuscripcionesManager />}
    />
    <Route
      path="suscripciones/historial"
      element={<HistorialManager />}
    />
    <Route
      path="facturacion/comprobantes"
      element={
        <PlaceholderPage
          title="Comprobantes"
          description="Estamos integrando Sunat y los proveedores de facturación electrónica para listar todos los comprobantes."
        />
        <Route
            path="facturacion/metodos-pago"
            element={
                <PlaceholderPage
                    title="Métodos de pago"
                    description="Administra pasarelas y cuentas bancarias próximamente desde un único panel."
                />
            }
        />
        <Route
            path="facturacion/configuracion-fiscal"
            element={<SeriesPage />}
        />
      }
    />
    <Route path="soporte" element={<SoporteTicketsPage />} />
    <Route
      path="seguridad/equipo-superadmin"
      element={
        <PlaceholderPage
          title="Equipo Superadmin"
          description="Estamos moviendo la gestión de accesos al nuevo layout. Vuelve pronto para asignar roles."
        />
        <Route
            path="seguridad/bitacora-auditoria"
            element={
                <PlaceholderPage
                    title="Bitácora de auditoría"
                    description="Los registros de actividad se están sincronizando con la nueva API."
                />
            }
        />
        <Route
            path="*"
            element={
                <NotFoundPage
                    title="Vista corporativa no encontrada"
                    description="Verifica la URL o regresa al panel principal de Superadmin."
                    homePath="/superadmin/tablero"
                    actionLabel="Ir al panel"
                />
            }
        />
    </Route>
);

export default superadminRoutes;
