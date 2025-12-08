import { useEffect, useMemo, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ConfigProvider, App as AntdApp } from 'antd';
import esES from 'antd/locale/es_ES';
import AppRouter from './router/AppRouter.jsx';
import { useTokenStore } from './shared/store/tokenStore.js';
import { ROLE_THEMES } from './themeConfig.js';
import { useSedeStore } from './shared/store/sedeStore.js';

const ROLE_THEME_MAP = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
};
const ROLE_THEME_FALLBACK = 'ADMIN';

const baseTheme = {
  token: {
    fontFamily: 'Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },
};

const queryClient = new QueryClient();

const SedeAwareQueryInvalidator = () => {
  const queryClient = useQueryClient();
  const selectedSedeId = useSedeStore((state) => state.selectedSedeId);
  const selectedTiendaId = useSedeStore((state) => state.selectedTiendaId);
  const previousRef = useRef({ sedeId: null, tiendaId: null });

  useEffect(() => {
    const prev = previousRef.current;
    if (prev.sedeId === selectedSedeId && prev.tiendaId === selectedTiendaId) {
      return;
    }
    previousRef.current = { sedeId: selectedSedeId, tiendaId: selectedTiendaId };
    queryClient.invalidateQueries();
  }, [queryClient, selectedSedeId, selectedTiendaId]);

  return null;
};

const AntThemeProvider = ({ children }) => {
  const userType = useTokenStore((state) => state.userType);
  const panelRoleHint = useTokenStore((state) => state.panelRoleHint);
  const memoizedTheme = useMemo(() => {
    const normalizedRole = userType?.toUpperCase?.();
    const mappedRoleFromUser = ROLE_THEME_MAP[normalizedRole];
    const normalizedHint = panelRoleHint?.toUpperCase?.();
    const mappedRoleFromHint = ROLE_THEME_MAP[normalizedHint];
    const mappedRole = mappedRoleFromUser ?? mappedRoleFromHint ?? ROLE_THEME_FALLBACK;
    const roleTheme = ROLE_THEMES[mappedRole];
    return {
      ...baseTheme,
      token: {
        ...baseTheme.token,
        ...roleTheme.token,
      },
      components: {
        ...(baseTheme.components ?? {}),
        ...(roleTheme.components ?? {}),
      },
    };
  }, [panelRoleHint, userType]);

  return (
    <ConfigProvider locale={esES} theme={memoizedTheme}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AntThemeProvider>
          <SedeAwareQueryInvalidator />
          <AppRouter />
        </AntThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
