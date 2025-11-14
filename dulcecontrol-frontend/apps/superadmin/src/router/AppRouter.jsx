import { Routes, Route } from 'react-router-dom';
import RouteProtector from './RouteProtector';
import { ObtenerTokenPage } from '../features/token';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/token" element={<ObtenerTokenPage />} />
        </Routes>
    );
};

export default AppRouter;