#!/bin/bash
###############################################################################
# Script de Configuración SSH - Dulce Control
# Este script configura la autenticación SSH sin contraseña
###############################################################################

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

REMOTE_USER="pasteleria"
REMOTE_HOST="spring.informaticapp.com"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          CONFIGURACIÓN SSH SIN CONTRASEÑA                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Paso 1: Generar clave SSH si no existe
if [ ! -f ~/.ssh/id_rsa ]; then
    echo -e "${YELLOW}[1/3]${NC} Generando par de claves SSH..."
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N "" -C "deploy-dulcecontrol"
    echo -e "${GREEN}✓${NC} Claves generadas"
else
    echo -e "${GREEN}✓${NC} Ya existe clave SSH"
fi
echo ""

# Paso 2: Copiar clave pública al servidor
echo -e "${YELLOW}[2/3]${NC} Copiando clave pública al servidor..."
echo -e "${BLUE}→${NC} Se te pedirá la contraseña UNA ÚLTIMA VEZ"
ssh-copy-id -i ~/.ssh/id_rsa.pub ${REMOTE_USER}@${REMOTE_HOST}
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Clave copiada al servidor"
else
    echo -e "${RED}✗${NC} Error al copiar la clave"
    exit 1
fi
echo ""

# Paso 3: Probar conexión sin contraseña
echo -e "${YELLOW}[3/3]${NC} Probando conexión sin contraseña..."
ssh -o BatchMode=yes -o ConnectTimeout=5 ${REMOTE_USER}@${REMOTE_HOST} 'echo "Conexión exitosa"'
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} SSH configurado correctamente"
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║    ¡CONFIGURACIÓN COMPLETADA! Ya no pedirá contraseña      ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
else
    echo -e "${RED}✗${NC} Error en la configuración"
    exit 1
fi
