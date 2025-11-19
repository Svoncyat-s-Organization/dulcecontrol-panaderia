import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTokenStore } from '../../../shared/store/tokenStore.js';

export const useAdminSession = () => {
  const location = useLocation();
  const token = useTokenStore((state) => state.token);
  const hasValidSession = useTokenStore((state) => state.hasValidSession);
  const logout = useTokenStore((state) => state.logout);

  const sessionActive = hasValidSession();
  const redirectPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (token && !sessionActive) {
      logout();
    }
  }, [token, sessionActive, logout]);

  return { sessionActive, redirectPath };
};
