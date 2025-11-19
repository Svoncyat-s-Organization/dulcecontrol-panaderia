import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/autenticacion/index.js';
import RouteProtector from './RouteProtector.jsx';
import AdminLayout from '../shared/layout/AdminLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RouteProtector>
            <AdminLayout />
          </RouteProtector>
        }
      >
        <Route index element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
