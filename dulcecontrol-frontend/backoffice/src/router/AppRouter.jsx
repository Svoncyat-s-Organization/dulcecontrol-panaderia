import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage as AdminLoginPage } from '../features/admin/autenticacion/index.js';
import { LoginPage as SuperadminLoginPage } from '../features/superadmin/autenticacion/index.js';
import { ObtenerTokenPage } from '../features/superadmin/token/index.js';
import adminRoutes from './admin/AdminRoutes.jsx';
import superadminRoutes from './superadmin/SuperadminRoutes.jsx';
import NotFoundPage from '../shared/components/NotFoundPage.jsx';

const AppRouter = () => (
    <Routes>
        <Route path="/" element={<Navigate to="/admin/login" replace />} />

        <Route path="/admin/login" element={<AdminLoginPage defaultRedirect="/admin" />} />
        <Route path="/superadmin/login" element={<SuperadminLoginPage defaultRedirect="/superadmin" />} />
        <Route path="/login/*" element={<Navigate to="/admin/login" replace />} />

        <Route path="/token" element={<ObtenerTokenPage />} />

        {adminRoutes}
        {superadminRoutes}

                <Route
                    path="*"
                    element={
                        <NotFoundPage
                            description="La ruta solicitada no existe o tu sesión no tiene acceso a ella."
                            homePath="/admin/login"
                            actionLabel="Volver al inicio de sesión"
                        />
                    }
                />
    </Routes>
);

export default AppRouter;