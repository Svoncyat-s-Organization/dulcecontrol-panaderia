import { useEffect, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTokenStore } from '../shared/store/tokenStore.js';

const RouteProtector = ({ children }) => {
    const location = useLocation();
        const token = useTokenStore((state) => state.token);
        const expiresAt = useTokenStore((state) => state.expiresAt);
        const logout = useTokenStore((state) => state.logout);

    const isAuthenticated = useMemo(() => {
        if (!token) return false;
        if (expiresAt && expiresAt <= Date.now()) {
            return false;
        }
        return true;
    }, [token, expiresAt]);

    useEffect(() => {
        if (!isAuthenticated && token) {
            logout();
        }
    }, [isAuthenticated, token, logout]);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RouteProtector;