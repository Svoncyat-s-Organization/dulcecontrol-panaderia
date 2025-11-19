import { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntdApp } from 'antd';
import esES from 'antd/locale/es_ES';
import AppRouter from './router/AppRouter.jsx';
import { useTokenStore } from './shared/store/tokenStore.js';
import { ROLE_THEMES } from './themeConfig.js';

const baseTheme = {
  token: {
    fontFamily: 'Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },
};

const queryClient = new QueryClient();

const AntThemeProvider = ({ children }) => {
  const userType = useTokenStore((state) => state.userType);
  const memoizedTheme = useMemo(() => {
    const roleTheme = ROLE_THEMES[userType] ?? ROLE_THEMES.DEFAULT;
    return {
      ...baseTheme,
      token: {
        ...baseTheme.token,
        ...roleTheme.token,
      },
    };
  }, [userType]);

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
          <AppRouter />
        </AntThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
