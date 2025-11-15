# Configuración SSL para Spring Boot en cPanel

## Opción 1: Usar certificado de cPanel (Recomendado)

### 1. Exportar certificado de cPanel

En tu servidor cPanel, ejecuta:

```bash
# Ubicación común de certificados Let's Encrypt en cPanel
cd /etc/letsencrypt/live/pasteleria.spring.informaticapp.com/

# Convertir certificado a formato PKCS12 para Spring Boot
openssl pkcs12 -export \
  -in fullchain.pem \
  -inkey privkey.pem \
  -out /home/tu-usuario/dulcecontrol-backend/keystore.p12 \
  -name tomcat \
  -password pass:dulcecontrol2025
```

### 2. Copiar keystore.p12 a tu proyecto

```bash
# Descargar desde cPanel a tu máquina local
scp usuario@pasteleria.spring.informaticapp.com:/home/tu-usuario/dulcecontrol-backend/keystore.p12 \
  ./dulcecontrol-backend/src/main/resources/
```

### 3. Actualizar application.properties

Agregar al final del archivo:

```properties
# ==============================================================
# SSL/HTTPS Configuration
# ==============================================================
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=dulcecontrol2025
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat
```

### 4. Recompilar y redesplegar

```bash
./mvnw clean package
# Subir el nuevo JAR a cPanel
# Reiniciar la aplicación
```

## Opción 2: Certificado autofirmado (Solo para pruebas)

### 1. Generar certificado en tu máquina local

```bash
cd dulcecontrol-backend/src/main/resources/

keytool -genkeypair \
  -alias tomcat \
  -keyalg RSA \
  -keysize 2048 \
  -storetype PKCS12 \
  -keystore keystore.p12 \
  -validity 365 \
  -dname "CN=pasteleria.spring.informaticapp.com, OU=DulceControl, O=Panaderia, L=Lima, ST=Lima, C=PE"

# Cuando pida password, usa: dulcecontrol2025
```

### 2. Agregar a application.properties

```properties
# SSL Configuration
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.p12
server.ssl.key-store-password=dulcecontrol2025
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat
```

### 3. Compilar y desplegar

```bash
./mvnw clean package
# Subir JAR a cPanel
```

⚠️ **IMPORTANTE**: Los certificados autofirmados mostrarán advertencia en el navegador.

## Opción 3: Usar proxy Apache/Nginx en cPanel (RECOMENDADO)

⚠️ **IMPORTANTE**: El SSL de cPanel solo funciona en puerto 443 (HTTPS estándar). 
El puerto 2250 seguirá siendo HTTP. Necesitas un proxy para exponer tu app con HTTPS.

### Solución A: Proxy con .htaccess (Más fácil en cPanel compartido)

**1. Crear archivo `.htaccess` en la raíz de tu dominio**

En cPanel File Manager, edita/crea `public_html/.htaccess`:

```apache
RewriteEngine On

# Proxy todas las peticiones /api/* al backend en puerto 2250
RewriteCond %{HTTPS} on
RewriteCond %{REQUEST_URI} ^/api/
RewriteRule ^(.*)$ http://localhost:2250/$1 [P,L]

# Proxy Swagger UI
RewriteCond %{HTTPS} on
RewriteCond %{REQUEST_URI} ^/swagger-ui/
RewriteRule ^(.*)$ http://localhost:2250/$1 [P,L]

# Proxy para actuator
RewriteCond %{HTTPS} on
RewriteCond %{REQUEST_URI} ^/actuator/
RewriteRule ^(.*)$ http://localhost:2250/$1 [P,L]
```

**2. Verificar que mod_proxy esté habilitado**

Si `.htaccess` no funciona, contacta a tu hosting para habilitar `mod_proxy`.

**3. Actualizar frontend para usar:**
```javascript
export const API_BASE_URL = 'https://pasteleria.spring.informaticapp.com';
```

Ahora puedes acceder a: 
- `https://pasteleria.spring.informaticapp.com/api/v1/auth/login`
- `https://pasteleria.spring.informaticapp.com/swagger-ui/index.html`

### Solución B: Crear subdominio con proxy (Más limpio)

**1. En cPanel → Subdominios**
- Crear: `api.pasteleria.spring.informaticapp.com`
- Asegurar que tenga SSL (AutoSSL)

**2. Editar `.htaccess` del subdominio**

En `public_html/api/.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} on
RewriteRule ^(.*)$ http://localhost:2250/$1 [P,L]
```

**3. Actualizar frontend:**
```javascript
export const API_BASE_URL = 'https://api.pasteleria.spring.informaticapp.com';
```

### Solución C: VirtualHost personalizado (Solo si tienes acceso root)

Si tienes VPS/Dedicado con acceso root:

**1. Habilitar módulos necesarios**

```bash
sudo a2enmod proxy proxy_http ssl
sudo systemctl restart apache2
```

**2. Crear VirtualHost con SSL**

Archivo: `/etc/apache2/sites-available/dulcecontrol-ssl.conf`

```apache
<VirtualHost *:443>
    ServerName pasteleria.spring.informaticapp.com
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/pasteleria.spring.informaticapp.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/pasteleria.spring.informaticapp.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/pasteleria.spring.informaticapp.com/chain.pem
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:2250/
    ProxyPassReverse / http://localhost:2250/
</VirtualHost>
```

**3. Habilitar el sitio**

```bash
sudo a2ensite dulcecontrol-ssl.conf
sudo systemctl reload apache2
```

Ahora puedes acceder a: `https://pasteleria.spring.informaticapp.com` (sin especificar puerto)

## Verificación

Después de cualquier opción, verifica:

```bash
# Test desde servidor
curl -v https://pasteleria.spring.informaticapp.com:2250/actuator/health

# Test desde tu máquina
curl -v https://pasteleria.spring.informaticapp.com:2250/api/v1/auth/login
```

## Troubleshooting

### Error: "certificate verify failed"
- Verifica que el certificado esté bien instalado
- Usa certificado de Let's Encrypt válido, no autofirmado

### Error: "Connection refused"
- Verifica que el puerto 2250 esté abierto en el firewall
- Verifica que Spring Boot esté corriendo con SSL habilitado

### Error: "Mixed Content" en Vercel
- Asegúrate de usar `https://` en la URL del frontend
- Verifica que el certificado SSL sea válido (no autofirmado)
