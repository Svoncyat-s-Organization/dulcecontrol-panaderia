import { Routes, Route } from 'react-router-dom';
import { ObtenerTokenPage } from '../features/token';
import { LoginPage } from '../features/autenticacion';
import SuperadminLayout from '../shared/layout/SuperadminLayout';
import VerTableroPage from '../features/tablero/pages/VerTableroPage';
import * as Tiendas from '../features/tiendas';
import RouteProtector from './RouteProtector';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/token" element={<ObtenerTokenPage />} />
            <Route path="/*" element={
                <RouteProtector>
                    <SuperadminLayout />
                </RouteProtector>
            }>
                <Route index element={<VerTableroPage />} />
                <Route path="tiendas/directorio" element={<Tiendas.DirectorioTiendasPage />} />
                <Route path="tiendas/sedes" element={<Tiendas.DirectorioSedesPage />} />
                <Route path="tiendas/dominios" element={<Tiendas.DirectorioDominiosPage />} />
                <Route path="tiendas/usuarios" element={<Tiendas.DirectorioUsuariosPage />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;