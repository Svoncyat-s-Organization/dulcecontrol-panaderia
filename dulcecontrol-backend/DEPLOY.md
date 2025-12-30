# 🚀 Guía de Despliegue Automatizado

## 📋 Análisis de tu Infraestructura Actual

En tu servidor remoto (`spring.informaticapp.com:/home/pasteleria/public_html/pasteleria_panaderia/`) tienes:

```
dulcecontrol-backend-0.0.1-SNAPSHOT.jar  ← Tu aplicación Spring Boot
dulcecontrol-backend.log                 ← Logs de la aplicación
dulcecontrol-backend.pid                 ← Process ID del servicio activo
keystore.p12                             ← Certificado SSL
restart-backend.sh                       ← Script para reiniciar
start-backend.sh                         ← Script para iniciar
stop-backend.sh                          ← Script para detener
prepare-database.sh                      ← Script para preparar BD (autogenerado)
```

## 🔄 Flujo de Despliegue Automatizado

### Opción 1: Despliegue Completo con BD (RECOMENDADO)

Usa el script `deploy.sh` que automatiza TODO el flujo manual que seguías:

```bash
./deploy.sh
```

Este script ejecuta:
1. ✅ Compila el proyecto (`mvnw clean package`)
2. ✅ Sube el JAR al servidor vía SCP
3. ✅ Sube el script de preparación de BD
4. ✅ Detiene el backend actual (`stop-backend.sh`)
5. ✅ **Elimina la BD existente** (`DROP DATABASE`)
6. ✅ **Crea la BD con collation utf8mb4_unicode_ci** (no más latin1_swedish_ci ❌)
7. ✅ Inicia el backend (`start-backend.sh`)
8. ✅ **Flyway ejecuta todas las migraciones automáticamente**
9. ✅ Verifica que el servicio esté corriendo

**Ya no necesitas:**
- ❌ Subir archivos manualmente por cPanel
- ❌ Ejecutar `mysqladmin drop/create` en terminal
- ❌ Cambiar collation en phpMyAdmin
- ❌ Navegar a carpetas y ejecutar scripts manualmente

**Todo se hace con un solo comando.**

### Opción 2: Solo compilar y subir

```bash
./mvnw clean install -s .m2/settings.xml
```

Esto compila y sube el JAR, pero **NO reinicia** el servicio automáticamente.
Luego debes conectarte por SSH y ejecutar:

```bash
ssh pasteleria@spring.informaticapp.com
cd /home/pasteleria/public_html/pasteleria_panaderia
./restart-backend.sh
```

### Opción 3: Desarrollo Local

Si solo quieres compilar sin desplegar:

```bash
./mvnw clean package -DskipTests
```

El JAR quedará en `target/dulcecontrol-backend-0.0.1-SNAPSHOT.jar`

## 🎯 ¿Cuál flujo usar?

| Escenario | Comando | Recrea BD | Flyway | Reinicia |
|-----------|---------|-----------|--------|----------|
| Despliegue completo a producción | `./deploy.sh` | ✅ Sí | ✅ Sí | ✅ Sí |
| Solo actualizar JAR (sin tocar BD) | `./mvnw clean install -s .m2/settings.xml` + restart manual | ❌ No | ❌ No | Manual |
| Testing local | `./mvnw clean package` | ❌ No | ❌ No | ❌ No |

## 🔐 Configuración SSH (Primera vez)

### Credenciales Maven
Las credenciales SSH están en `.m2/settings.xml` (no versionado en Git).
Para editarlas:
```bash
nano .m2/settings.xml
```

### Primera conexión SSH
Si es tu primera conexión SSH al servidor, deberás aceptar la huella digital:

```
The authenticity of host 'spring.informaticapp.com' can't be established.
Are you sure you want to continue connecting (yes/no)? yes
```

## 📝 Notas Importantes

1. **La BD se recrea completamente**: El script ejecuta `DROP DATABASE` y luego `CREATE DATABASE` con la collation correcta. **Todos los datos se pierden** y Flyway los vuelve a crear desde cero con los scripts de migración.

2. **Flyway se ejecuta automáticamente**: Cuando el backend inicia, Spring Boot ejecuta Flyway que aplica todas las migraciones en `src/main/resources/db/migration/`.

3. **No más phpMyAdmin**: Ya no necesitas cambiar la collation manualmente. El script crea la BD directamente con `utf8mb4_unicode_ci`.

4. **El keystore.p12 no se toca**: Maven solo sube el JAR, tus certificados SSL y scripts de inicio permanecen intactos.

5. **Logs en tiempo real**: Si algo falla durante el inicio, el script te indica cómo ver los logs:
   ```bash
   ssh pasteleria@spring.informaticapp.com 'tail -50 /home/pasteleria/public_html/pasteleria_panaderia/dulcecontrol-backend.log'
   ```

## 🔄 Comparación: Antes vs Ahora

### ❌ Flujo Manual Anterior (7 pasos manuales)
1. Abrir cPanel → Administrador de archivos
2. Subir JAR manualmente
3. Abrir Terminal de cPanel
4. Detener backend si está corriendo
5. Ejecutar `mysqladmin drop pasteleria_panaderia`
6. Ejecutar `mysqladmin create pasteleria_panaderia`
7. Abrir phpMyAdmin
8. Cambiar collation a `utf8mb4_unicode_ci`
9. Dar clic en "Go"
10. Volver al Terminal
11. Navegar a `/public_html/pasteleria_panaderia`
12. Ejecutar script de inicio

**⏱️ Tiempo: ~10-15 minutos**

### ✅ Flujo Automatizado Actual (1 comando)
```bash
./deploy.sh
```

**⏱️ Tiempo: ~2-3 minutos** (dependiendo de la conexión)

## 🛠️ Troubleshooting

### Error: "Permission denied (publickey,password)"
Tu clave SSH no está configurada. El script pedirá la contraseña automáticamente.
Solución permanente: Configura SSH keys (ver `docs/extras/configurar-ssh.md`)

### Error: "Access denied for user 'pasteleria_admin'"
La contraseña de MySQL en el script no es correcta. Edita [deploy.sh](deploy.sh) línea 18:
```bash
DB_PASSWORD="TU_CONTRASEÑA_AQUI"
```

### Error: "Address already in use"
El puerto 2250 está ocupado. Ejecuta en el servidor:
```bash
ssh pasteleria@spring.informaticapp.com
cd pasteleria_panaderia
./stop-backend.sh
./start-backend.sh
```

### Error de Flyway: "Validate failed"
Las migraciones tienen conflictos. Revisa los logs:
### Error de Flyway: "Validate failed"
Las migraciones tienen conflictos. Revisa los logs:
```bash
ssh pasteleria@spring.informaticapp.com 'tail -100 /home/pasteleria/public_html/pasteleria_panaderia/dulcecontrol-backend.log | grep -i flyway'
```

### El backend no inicia después del despliegue
1. Verifica que el JAR se haya subido correctamente
2. Revisa los últimos 50 logs:
   ```bash
   ssh pasteleria@spring.informaticapp.com 'tail -50 /home/pasteleria/public_html/pasteleria_panaderia/dulcecontrol-backend.log'
   ```
3. Verifica que el puerto 2250 esté libre

## 🎉 Verificación Post-Despliegue

### Health Check
```bash
curl https://spring.informaticapp.com:2250/actuator/health
```

Respuesta esperada:
```json
{"status":"UP"}
```

### Verificar Flyway
```bash
curl https://spring.informaticapp.com:2250/actuator/flyway
```

### Endpoints disponibles:
- 🔹 Health: `https://spring.informaticapp.com:2250/actuator/health`
- 🔹 Swagger UI: `https://spring.informaticapp.com:2250/swagger-ui.html`
- 🔹 API Docs: `https://spring.informaticapp.com:2250/v3/api-docs`
- 🔹 Info: `https://spring.informaticapp.com:2250/actuator/info`

## 📊 Estructura del Proyecto

```
dulcecontrol-backend/
├── .m2/
│   ├── settings.xml          # Credenciales SSH (gitignored)
│   └── README.md             # Documentación de credenciales
├── deploy.sh                 # Script de despliegue automatizado ⭐
├── prepare-database.sh       # Script para preparar BD (se sube al servidor)
├── DEPLOY.md                 # Esta guía
├── pom.xml                   # Configurado con wagon-ssh
└── src/
    └── main/
        └── resources/
            └── db/
                └── migration/  # Scripts Flyway (V1__, V2__, R__...)
```

## 🚦 Próximos Pasos

1. **Primera vez**: Configura las credenciales en `.m2/settings.xml`
2. **Ejecuta**: `./deploy.sh`
3. **Verifica**: Abre Swagger en tu navegador
4. **¡Listo!**: Tu backend está desplegado con BD limpia y migrada
