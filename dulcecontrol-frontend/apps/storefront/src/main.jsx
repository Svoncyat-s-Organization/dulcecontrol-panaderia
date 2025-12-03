import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TiendaConfigProvider } from './context/TiendaConfigContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TiendaConfigProvider>
      <App />
    </TiendaConfigProvider>
  </StrictMode>,
)
