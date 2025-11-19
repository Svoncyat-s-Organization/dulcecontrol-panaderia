import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTokenStore } from '../shared/store/tokenStore.js';

const ROLE_FALLBACKS = {
  SUPERADMIN: '/super-admin',
  ADMIN: '/admin',
};

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const location = useLocation();
  const token = useTokenStore((state) => state.token);
  const expiresAt = useTokenStore((state) => state.expiresAt);
  const userType = useTokenStore((state) => state.userType);
  const logout = useTokenStore((state) => state.logout);

  const sessionActive = !!token && (!expiresAt || expiresAt > Date.now());

  useEffect(() => {
    if (token && !sessionActive) {
      logout();
    }
  }, [token, sessionActive, logout]);

  if (!sessionActive) {
    const loginPath = userType === 'SUPERADMIN' ? '/login/super-admin' : '/login/admin';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    const fallback = ROLE_FALLBACKS[userType] ?? '/login/admin';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
