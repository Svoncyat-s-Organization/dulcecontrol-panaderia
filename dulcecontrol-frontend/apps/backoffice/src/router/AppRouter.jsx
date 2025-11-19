import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminLayout from '../layout/admin/AdminLayout.jsx';
import SuperadminLayout from '../layout/superadmin/SuperadminLayout.jsx';
import { LoginPage as AdminLoginPage } from '../features/admin/autenticacion/index.js';
import { LoginPage as SuperadminLoginPage } from '../features/superadmin/autenticacion/index.js';
import { DashboardPage as AdminDashboardPage } from '../features/admin/tablero/index.js';
import { VerTableroPage } from '../features/superadmin/tablero/index.js';
import * as SuperTiendas from '../features/superadmin/tiendas/index.js';
import { ObtenerTokenPage } from '../features/superadmin/token/index.js';

const AppRouter = () => (
    <Routes>
        <Route path="/" element={<Navigate to="/login/admin" replace />} />

        <Route path="/login">
            <Route index element={<Navigate to="/login/admin" replace />} />
            <Route path="admin" element={<AdminLoginPage defaultRedirect="/admin" />} />
            <Route path="super-admin" element={<SuperadminLoginPage defaultRedirect="/super-admin" />} />
        </Route>

        <Route path="/token" element={<ObtenerTokenPage />} />

        <Route
            path="/admin"
            element={
                <ProtectedRoute allowedRoles={[ 'ADMIN' ]}>
                    <AdminLayout />
                </ProtectedRoute>
            }
        >
            <Route index element={<AdminDashboardPage />} />
        </Route>

        <Route
            path="/super-admin"
            element={
                <ProtectedRoute allowedRoles={[ 'SUPERADMIN' ]}>
                    <SuperadminLayout />
                </ProtectedRoute>
            }
        >
            <Route index element={<VerTableroPage />} />
            <Route path="tiendas/directorio" element={<SuperTiendas.DirectorioTiendasPage />} />
            <Route path="tiendas/sedes" element={<SuperTiendas.DirectorioSedesPage />} />
            <Route path="tiendas/dominios" element={<SuperTiendas.DirectorioDominiosPage />} />
            <Route path="tiendas/usuarios" element={<SuperTiendas.DirectorioUsuariosPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login/admin" replace />} />
    </Routes>
);

export default AppRouter;