import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute.jsx';
import SuperadminLayout from '../../layout/superadmin/SuperadminLayout.jsx';
import PlaceholderPage from '../../shared/components/PlaceholderPage.jsx';
import { VerTableroPage as SuperadminDashboardPage } from '../../features/superadmin/tablero/index.js';
import NotFoundPage from '../../shared/components/NotFoundPage.jsx';
import { FacturacionPage, FacturacionDetallePage, SeriesPage } from '../../features/superadmin/facturacion/index.js';

const superadminRoutes = (
    <Route
        path="/superadmin"
        element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
                <SuperadminLayout />
            </ProtectedRoute>
        }
    >
        <Route index element={<Navigate to="tablero" replace />} />
        <Route
            path="tablero"
            element={
                <SuperadminDashboardPage />
            }
        />
        <Route path="tiendas/directorio" element={
            <PlaceholderPage
                title="Tiendas"
                description="Este será el directorio de tiendas donde podrás gestionar todas las tiendas registradas en la plataforma."
            />
        } />
        <Route path="tiendas/sedes" element={
            <PlaceholderPage
                title="Sedes"
                description="Aquí podrás administrar las sedes de cada tienda registrada."
            />
        } />
        <Route path="tiendas/dominios" element={
            <PlaceholderPage
                title="Dominios"
                description="Se planea integrar la gestión de dominios próximamente."
            />
        } />
        <Route path="tiendas/usuarios" element={
            <PlaceholderPage
                title="Usuarios"
                description="Muy pronto aquí estará la gestión de titulares de las tiendas registradas en la plataforma."
            />
        } />
        <Route
            path="suscripciones/planes"
            element={
                <PlaceholderPage
                    title="Planes SaaS"
                    description="Estamos preparando el catálogo de planes y precios. Muy pronto podrás crear y versionar planes desde aquí."
                />
            }
        />
        <Route
            path="suscripciones/activas"
            element={
                <PlaceholderPage
                    title="Suscripciones activas"
                    description="Pronto verás métricas de adopción, renovaciones y cancelaciones de todas las tiendas."
                />
            }
        />
        <Route
            path="suscripciones/historial"
            element={
                <PlaceholderPage
                    title="Historial de suscripciones"
                    description="El equipo está migrando el historial desde la versión monolítica. Tenlo listo en las próximas iteraciones."
                />
            }
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
        <Route
            path="soporte"
            element={
                <PlaceholderPage
                    title="Centro de soporte"
                    description="Los tickets centralizados aún están en QA. Usa la mesa de ayuda tradicional mientras concluye la migración."
                />
            }
        />
        <Route
            path="seguridad/equipo-superadmin"
            element={
                <PlaceholderPage
                    title="Equipo Superadmin"
                    description="Estamos moviendo la gestión de accesos al nuevo layout. Vuelve pronto para asignar roles."
                />
            }
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
