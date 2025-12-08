import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute.jsx';
import SuperadminLayout from '../../layout/superadmin/SuperadminLayout.jsx';
import NotFoundPage from '../../shared/components/NotFoundPage.jsx';
import { VerTableroPage as SuperadminDashboardPage } from '../../features/superadmin/tablero/index.js';
import { PlanesManager, SuscripcionesManager, HistorialManager } from '../../features/superadmin/suscripciones/index.js';
import GestionTiendasPage from '../../features/superadmin/tiendas/pages/GestionTiendasPage.jsx';
import { SoporteTicketsPage } from '../../features/superadmin/soporte/index.js';
import { SeguridadUsuariosPage, SeguridadRolesPage, SeguridadBitacoraPage } from '../../features/superadmin/seguridad/index.js';
import { FacturacionPage, FacturacionDetallePage, SeriesPage, MetodosPagoPage } from '../../features/superadmin/facturacion/index.js';
import ObtenerTokenPage from '../../features/superadmin/token/pages/ObtenerTokenPage.jsx';

const superadminRoutes = (
  <Route path="/superadmin" element={<ProtectedRoute allowedRoles={['SUPERADMIN']}><SuperadminLayout /></ProtectedRoute>}>
    <Route index element={<Navigate to="tablero" replace />} />
    <Route path="tablero" element={<SuperadminDashboardPage />} />
    <Route path="tiendas" element={<GestionTiendasPage />} />

    <Route path="suscripciones/planes" element={<PlanesManager />} />
    <Route path="suscripciones/activas" element={<SuscripcionesManager />} />
    <Route path="suscripciones/historial" element={<HistorialManager />} />

    <Route path="facturacion/comprobantes" element={<FacturacionPage />} />
    <Route path="facturacion/comprobantes/:id" element={<FacturacionDetallePage />} />
    <Route path="facturacion/configuracion-fiscal" element={<SeriesPage />} />
    <Route path="facturacion/metodos-pago" element={<MetodosPagoPage />} />

    <Route path="soporte" element={<SoporteTicketsPage />} />
    
    <Route path="seguridad" element={<Navigate to="seguridad/usuarios" replace />} />
    <Route path="seguridad/usuarios" element={<SeguridadUsuariosPage />} />
    <Route path="seguridad/roles" element={<SeguridadRolesPage />} />
    <Route path="seguridad/bitacora" element={<SeguridadBitacoraPage />} />

    <Route path="token" element={<ObtenerTokenPage />} />

    <Route path="*" element={<NotFoundPage title="Vista corporativa no encontrada" description="Verifica la URL o regresa al panel principal de Superadmin." homePath="/superadmin/tablero" actionLabel="Ir al panel" />} />
  </Route>
);

export default superadminRoutes;
