import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTokenStore } from '../shared/store/tokenStore.js';

const ROLE_FALLBACKS = {
  SUPERADMIN: '/superadmin',
  ADMIN: '/admin',
};

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const location = useLocation();
  const userType = useTokenStore((state) => state.userType);
  const logout = useTokenStore((state) => state.logout);
  const hasValidSession = useTokenStore((state) => state.hasValidSession);
  const token = useTokenStore((state) => state.token);

  const sessionActive = hasValidSession();

  useEffect(() => {
    if (token && !sessionActive) {
      logout();
    }
  }, [token, sessionActive, logout]);

  if (!sessionActive) {
    const loginPath = userType === 'SUPERADMIN' ? '/superadmin/login' : '/admin/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    const fallback = ROLE_FALLBACKS[userType] ?? '/admin/login';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
