#!/bin/bash
###############################################################################
# Script de Verificación MySQL - Dulce Control
# Prueba la conexión MySQL antes del despliegue
###############################################################################

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

REMOTE_USER="pasteleria"
REMOTE_HOST="spring.informaticapp.com"

echo -e "${YELLOW}Probando conexión MySQL en servidor remoto...${NC}"
echo ""

ssh ${REMOTE_USER}@${REMOTE_HOST} bash << 'ENDSSH'
# Probar conexión con la contraseña
if mysql -upasteleria_admin -p'#$PanP4sT3Ler1A2025$$' -e 'SELECT "✓ Conexión MySQL exitosa" as Estado' 2>/dev/null; then
    echo ""
    echo "✅ MySQL está accesible y la contraseña es correcta"
    echo ""
    # Mostrar bases de datos existentes
    echo "📋 Bases de datos actuales:"
    mysql -upasteleria_admin -p'#$PanP4sT3Ler1A2025$$' -e 'SHOW DATABASES;' 2>/dev/null | grep -E '(pasteleria|Database)'
    echo ""
else
    echo "❌ Error al conectar a MySQL"
    echo "Verifica que la contraseña sea correcta en el servidor"
    exit 1
fi
ENDSSH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Todo listo para el despliegue${NC}"
else
    echo -e "${RED}Hay problemas con la conexión MySQL${NC}"
    exit 1
fi
