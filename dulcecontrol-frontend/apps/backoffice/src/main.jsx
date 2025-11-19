import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import dayjs from 'dayjs';
import 'dayjs/locale/es.js';
import App from './App.jsx';
import './reset.css'

dayjs.locale('es');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
