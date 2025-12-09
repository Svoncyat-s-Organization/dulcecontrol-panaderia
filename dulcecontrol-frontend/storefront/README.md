# 🛍️ DulceControl Storefront - Configuración

## 🚀 Inicio Rápido (Desarrollo Local)

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y configúralo:

```bash
cd dulcecontrol-frontend/storefront
cp .env.example .env.local
```

Edita `.env.local`:

```bash
# API del backend
VITE_API_URL=http://localhost:8080

# ID de tienda para desarrollo local
# Cambia este número para probar diferentes tiendas
VITE_TIENDA_ID=1
```

### 2. Instalar Dependencias

```bash
pnpm install
# o
npm install
```

### 3. Iniciar Servidor de Desarrollo

```bash
pnpm dev
# o
npm run dev
```

Abre [http://localhost:5174](http://localhost:5174) en tu navegador.

---

## 🏪 Multitenancy: Cómo Funciona

### Desarrollo Local

En desarrollo, la tienda se identifica por la variable `VITE_TIENDA_ID`:

```bash
# Terminal 1: Tienda 1 (puerto 5174)
VITE_TIENDA_ID=1 pnpm dev

# Terminal 2: Tienda 2 (puerto 5175)
VITE_TIENDA_ID=2 pnpm dev -- --port 5175

# Terminal 3: Tienda 3 (puerto 5176)
VITE_TIENDA_ID=3 pnpm dev -- --port 5176
```

### Producción (Vercel)

En producción, la tienda se detecta **automáticamente** por el dominio:

#### Opción 1: Subdominios
```
https://panaderia-rosita.dulcecontrol.com  → Tienda "panaderia-rosita"
https://pasteleria-maria.dulcecontrol.com  → Tienda "pasteleria-maria"
```

#### Opción 2: Dominios Personalizados
```
https://www.panaderiarosita.pe  → Tienda "panaderiarosita.pe"
https://www.pasteleriamaria.com → Tienda "pasteleriamaria.com"
```

---

## 🔧 Configuración Avanzada

### Archivo `.env.local`

```bash
# ========================================
# CONFIGURACIÓN BÁSICA
# ========================================
VITE_ENV=development
VITE_API_URL=http://localhost:8080
VITE_TIENDA_ID=1

# ========================================
# OPCIONALES
# ========================================
# Stripe (para checkout)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx

# Google Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Estructura del Proyecto

```
storefront/
├── src/
│   ├── api/                    # Clientes API
│   │   ├── catalogo.api.js     # Productos y categorías
│   │   └── tienda.api.js       # Configuración de tienda
│   ├── config/
│   │   ├── tenant.config.js    # ⭐ Detección de tienda
│   │   └── categories.js       # Configuración de categorías
│   ├── context/
│   │   └── TiendaConfigContext.jsx  # Context global de tienda
│   ├── components/             # Componentes reutilizables
│   ├── pages/                  # Páginas de la aplicación
│   ├── store/
│   │   └── useCartStore.js     # Estado del carrito (Zustand)
│   └── layout/
│       └── MainLayout.jsx      # Layout principal
├── .env.example                # Plantilla de variables
├── .env.local                  # ⚠️ TU CONFIGURACIÓN (git ignored)
└── docs/
    └── ARQUITECTURA-MULTITENANCY.md  # Documentación detallada
```

---

## 🛒 Funcionalidades Implementadas

### ✅ Completo
- [x] Catálogo de productos (con API real)
- [x] Detalle de producto
- [x] Carrito de compras (persistente en localStorage)
- [x] Productos personalizables
- [x] Configuración dinámica por tienda (colores, logo, favicon)
- [x] Detección automática de tienda (dev/prod)
- [x] Estados de error (tienda no encontrada, inactiva, backend caído)
- [x] Responsive design

### ⏳ En Progreso
- [ ] Integración de checkout con pasarela (Stripe/Niubiz)
- [ ] Autenticación de clientes finales
- [ ] Historial de compras
- [ ] Formulario de pedidos personalizados conectado a backend

### 📋 Pendiente
- [ ] Página de categorías con filtros (usar API en lugar de mock)
- [ ] Sistema de reviews/calificaciones
- [ ] Wishlist/Favoritos
- [ ] Notificaciones por email

---

## 🐛 Problemas Comunes

### Error: "Tienda No Encontrada"

**Causa**: No se pudo detectar la tienda.

**Solución en desarrollo**:
```bash
# Verifica que tengas VITE_TIENDA_ID en .env.local
echo "VITE_TIENDA_ID=1" >> .env.local

# Reinicia el servidor
pnpm dev
```

**Solución en producción**:
- Verifica que el dominio esté correctamente configurado en Vercel
- Verifica que el backend tenga el slug/dominio registrado

### Error: "Backend No Disponible"

**Causa**: El backend no responde.

**Solución**:
```bash
# Verifica que el backend esté corriendo
curl http://localhost:8080/api/public/tienda/1/config

# Si no responde, inicia el backend:
cd dulcecontrol-backend
./mvnw spring-boot:run
```

### Error: Variables de Entorno No Funcionan

**Causa**: Las variables `VITE_*` solo se cargan al iniciar el servidor.

**Solución**:
```bash
# Después de modificar .env.local, reinicia el servidor:
# Ctrl+C para detener
pnpm dev
```

---

## 📦 Build y Despliegue

### Build Local

```bash
pnpm build
# Genera carpeta dist/ con archivos optimizados

# Preview del build
pnpm preview
```

### Despliegue en Vercel

#### Opción 1: Interfaz Web

1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `dulcecontrol-frontend/storefront`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. Variables de entorno:
   ```
   VITE_API_URL=https://api.informaticapp.com
   VITE_ENV=production
   ```

4. Configura dominios personalizados en Settings → Domains

#### Opción 2: CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd dulcecontrol-frontend/storefront
vercel --prod
```

---

## 🔗 Enlaces Útiles

- **Documentación Completa**: [docs/ARQUITECTURA-MULTITENANCY.md](./docs/ARQUITECTURA-MULTITENANCY.md)
- **Backend API**: [dulcecontrol-backend/README.md](../../dulcecontrol-backend/README.md)
- **Admin Panel**: [apps/backoffice/README.md](../apps/backoffice/README.md)

---

## 🧪 Testing

### Probar Diferentes Tiendas

```bash
# Tienda 1
VITE_TIENDA_ID=1 pnpm dev

# Tienda 2
VITE_TIENDA_ID=2 pnpm dev -- --port 5175
```

### Simular Errores

```bash
# Tienda no existente (debería mostrar error)
VITE_TIENDA_ID=999 pnpm dev

# Sin tienda configurada (debería mostrar error)
unset VITE_TIENDA_ID && pnpm dev
```

---

## 📞 Soporte

Si tienes problemas:

1. Revisa la [documentación de arquitectura](./docs/ARQUITECTURA-MULTITENANCY.md)
2. Verifica que el backend esté corriendo
3. Revisa la consola del navegador (F12) para errores
4. Busca mensajes con emoji 🏪 en la consola (logs de detección de tienda)

---

**Última actualización**: 8 de diciembre de 2025
