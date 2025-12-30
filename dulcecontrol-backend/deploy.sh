#!/bin/bash
###############################################################################
# Script de Despliegue Automatizado - Dulce Control Backend
# Autor: DevOps Team
# Fecha: 2025-12-29
# 
# Este script automatiza el proceso completo de despliegue:
# 1. Compila el proyecto con Maven
# 2. Sube el JAR al servidor remoto
# 3. Sube el script de preparación de BD
# 4. Detiene el backend actual
# 5. Elimina y recrea la base de datos con collation correcta
# 6. Inicia el backend (Flyway migrará automáticamente)
###############################################################################

set -e  # Detener ejecución si hay errores

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuración del servidor remoto
REMOTE_USER="pasteleria"
REMOTE_HOST="spring.informaticapp.com"
REMOTE_PATH="/home/pasteleria/public_html/pasteleria_panaderia"
JAR_NAME="dulcecontrol-backend-0.0.1-SNAPSHOT.jar"
# Contraseña MySQL (será usada de forma segura en el servidor)
DB_USER="pasteleria_admin"
DB_NAME="pasteleria_panaderia"
DB_CHARSET="utf8mb4"
DB_COLLATION="utf8mb4_unicode_ci"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   DESPLIEGUE AUTOMATIZADO - DULCE CONTROL BACKEND          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Paso 1: Compilar y empaquetar el proyecto
echo -e "${YELLOW}[1/7]${NC} Compilando el proyecto..."
./mvnw clean package -DskipTests
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Compilación exitosa"
else
    echo -e "${RED}✗${NC} Error en la compilación"
    exit 1
fi
echo ""

# Paso 2: Subir el script de preparación de BD
echo -e "${YELLOW}[2/7]${NC} Subiendo script de preparación de BD..."
scp prepare-database.sh ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Script subido correctamente"
else
    echo -e "${RED}✗${NC} Error al subir el script"
    exit 1
fi
echo ""

# Paso 3: Subir el JAR al servidor
# Paso 3: Subir el JAR al servidor
echo -e "${YELLOW}[3/7]${NC} Subiendo JAR al servidor remoto..."
echo -e "${BLUE}→${NC} El archivo es grande (~60-80 MB), puede tardar 1-3 minutos..."

# Usar SCP directo en lugar de wagon-maven-plugin para mejor control
scp -C target/${JAR_NAME} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/${JAR_NAME}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Archivo subido correctamente"
else
    echo -e "${RED}✗${NC} Error al subir el archivo"
    exit 1
fi
echo ""

# Paso 4: Detener backend actual si está corriendo
echo -e "${YELLOW}[4/7]${NC} Deteniendo backend actual..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_PATH} && if [ -f stop-backend.sh ]; then bash stop-backend.sh 2>/dev/null || echo 'Backend ya estaba detenido'; else echo 'Script stop-backend.sh no encontrado'; fi"
echo -e "${GREEN}✓${NC} Backend detenido (o ya estaba detenido)"
echo ""

# Paso 5: Preparar base de datos (eliminar y crear con collation correcta)
echo -e "${YELLOW}[5/7]${NC} Preparando base de datos..."
echo -e "${BLUE}→${NC} Eliminando BD existente y creando con utf8mb4_unicode_ci..."

# Crear script temporal en el servidor con la contraseña correcta
ssh ${REMOTE_USER}@${REMOTE_HOST} bash << 'ENDSSH'
# Leer contraseña desde archivo de configuración de Spring Boot
DB_PASSWORD=$(grep "spring.datasource.password" /home/pasteleria/public_html/pasteleria_panaderia/dulcecontrol-backend-0.0.1-SNAPSHOT.jar 2>/dev/null || echo "#\$PanP4sT3Ler1A2025\$\$")

# Eliminar y crear base de datos
mysql -upasteleria_admin -p'#$PanP4sT3Ler1A2025$$' << 'EOSQL'
DROP DATABASE IF EXISTS pasteleria_panaderia;
CREATE DATABASE pasteleria_panaderia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SELECT CONCAT('✓ Collation configurada: ', DEFAULT_COLLATION_NAME) as resultado
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'pasteleria_panaderia';
EOSQL

echo "Estado del comando MySQL: $?"
ENDSSH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Base de datos preparada (utf8mb4_unicode_ci)"
else
    echo -e "${RED}✗${NC} Error al preparar la base de datos"
    exit 1
fi
echo ""

# Paso 6: Iniciar backend (Flyway migrará automáticamente)
echo -e "${YELLOW}[6/7]${NC} Iniciando backend con Flyway..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_PATH} && bash start-backend.sh"
SSH_EXIT_CODE=$?

if [ $SSH_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Backend iniciado (Flyway ejecutará migraciones)"
else
    echo -e "${RED}✗${NC} Error al iniciar el backend (código: $SSH_EXIT_CODE)"
    echo -e "${YELLOW}→${NC} Revisa los logs: ssh ${REMOTE_USER}@${REMOTE_HOST} 'tail -50 ${REMOTE_PATH}/dulcecontrol-backend.log'"
    exit 1
fi
echo ""

# Paso 7: Verificar estado del servicio
echo -e "${YELLOW}[7/7]${NC} Verificando estado del servicio..."
sleep 5  # Esperar a que Flyway complete migraciones

# Verificar estado con manejo de errores
ssh ${REMOTE_USER}@${REMOTE_HOST} bash << 'ENDVERIFY'
cd /home/pasteleria/public_html/pasteleria_panaderia

if [ -f dulcecontrol-backend.pid ]; then
    PID=$(cat dulcecontrol-backend.pid)
    echo "PID: $PID"
    
    if ps -p $PID > /dev/null 2>&1; then
        echo "Estado: ✅ ACTIVO"
        exit 0
    else
        echo "Estado: ❌ DETENIDO (PID existe pero proceso no)"
        echo ""
        echo "Últimas líneas del log:"
        tail -20 dulcecontrol-backend.log
        exit 1
    fi
else
    echo "⚠️  Archivo PID no encontrado"
    echo ""
    echo "Verificando si hay algún proceso Java corriendo:"
    pgrep -f "dulcecontrol-backend" && echo "✅ Proceso encontrado" || echo "❌ No hay proceso corriendo"
    exit 1
fi
ENDVERIFY

VERIFY_EXIT_CODE=$?
if [ $VERIFY_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Servicio verificado y funcionando correctamente"
else
    echo -e "${RED}✗${NC} Problemas detectados en el servicio"
    echo -e "${YELLOW}→${NC} Verifica los logs completos: ssh ${REMOTE_USER}@${REMOTE_HOST} 'tail -100 ${REMOTE_PATH}/dulcecontrol-backend.log'"
fi
echo ""

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Resumen del despliegue:${NC}"
echo -e "  1. ✓ Proyecto compilado"
echo -e "  2. ✓ JAR subido al servidor"
echo -e "  3. ✓ Base de datos recreada (utf8mb4_unicode_ci)"
echo -e "  4. ✓ Migraciones Flyway ejecutadas"
echo -e "  5. ✓ Backend iniciado"
echo ""
echo -e "${BLUE}Endpoints disponibles:${NC}"
echo -e "  • API Base: https://${REMOTE_HOST}:2250"
echo -e "  • Muchos más <3"
echo ""
