import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntdApp } from 'antd';
import esES from 'antd/locale/es_ES';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import App from './App.jsx';
import './index.css';

dayjs.locale('es');
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ConfigProvider locale={esES}>
                    <AntdApp>
                        <App />
                    </AntdApp>
                </ConfigProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);