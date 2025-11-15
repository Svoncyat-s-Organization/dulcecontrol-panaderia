# 🚀 Deployment Guide - Railway

## Pasos para desplegar en Railway

### 1. Preparar el repositorio
```bash
cd /home/svonccy/workspaces/dulcecontrol-panaderia
git add dulcecontrol-backend/railway.json dulcecontrol-backend/nixpacks.toml dulcecontrol-backend/src/main/resources/application-railway.properties
git commit -m "Add Railway configuration"
git push origin develop
```

### 2. Crear cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub

### 3. Crear nuevo proyecto
1. Click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Autoriza Railway a acceder a tus repositorios
4. Selecciona `Svoncyat-s-Organization/dulcecontrol-panaderia`
5. Railway detectará automáticamente que es un proyecto Maven

### 4. Configurar el servicio
1. En el dashboard, click en tu servicio
2. Ve a **"Settings"**
3. En **"Root Directory"** pon: `dulcecontrol-backend`
4. En **"Start Command"** ya está configurado en `nixpacks.toml`

### 5. Agregar MySQL
1. En tu proyecto, click **"New"** → **"Database"** → **"MySQL"**
2. Railway creará automáticamente la base de datos
3. Las variables de conexión se inyectan automáticamente:
   - `MYSQL_URL`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

### 6. Configurar variables de entorno (opcional)
1. En tu servicio backend, ve a **"Variables"**
2. Agrega (si quieres sobrescribir defaults):
   ```
   SPRING_PROFILES_ACTIVE=railway
   JWT_SECRET_KEY=tu-secret-key-segura
   JWT_EXPIRATION=86400000
   ```

### 7. Deploy
1. Railway detectará el push y desplegará automáticamente
2. Espera 3-5 minutos mientras construye y despliega
3. Click en **"Settings"** → **"Generate Domain"** para obtener tu URL pública

### 8. Verificar deployment
Tu backend estará disponible en:
- `https://tu-app.up.railway.app/swagger-ui.html`
- `https://tu-app.up.railway.app/actuator/health`

### 9. Actualizar frontend
Una vez tengas la URL de Railway, actualiza en tu frontend:

`dulcecontrol-frontend/apps/superadmin/src/config/api.config.js`:
```javascript
export const API_BASE_URL = 'https://tu-app.up.railway.app';
```

### 10. Logs y monitoreo
- En Railway dashboard → tu servicio → **"Logs"** para ver logs en tiempo real
- **"Metrics"** para ver uso de CPU/RAM
- **"Deployments"** para ver historial

## 💰 Límites del plan gratuito
- **$5 USD de crédito mensual** (gratis)
- ~500 horas de ejecución
- 512MB RAM, 1GB disco
- Perfecto para desarrollo y demos

## 🔄 Redespliegue automático
Cada push a `develop` (o la rama que configures) redesplegará automáticamente.

## ⚠️ Troubleshooting

**Error: Build failed**
- Verifica que `mvnw` tenga permisos de ejecución:
  ```bash
  git update-index --chmod=+x dulcecontrol-backend/mvnw
  ```

**Error: Port already in use**
- Railway asigna `$PORT` dinámicamente, ya está configurado en `application-railway.properties`

**Error: Database connection**
- Verifica que el servicio MySQL esté corriendo
- Las variables de entorno se inyectan automáticamente, no necesitas configurarlas manualmente

## 📝 Notas
- Railway usa el profile `railway` automáticamente (configurado en `nixpacks.toml`)
- La base de datos se crea vacía, Flyway ejecutará las migraciones al iniciar
- El healthcheck está en `/actuator/health` (configurado en `railway.json`)
