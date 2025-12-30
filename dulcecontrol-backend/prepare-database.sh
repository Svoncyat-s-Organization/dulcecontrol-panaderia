#!/bin/bash
###############################################################################
# Script de Preparación de Base de Datos - Dulce Control Backend
# Este script se ejecuta en el servidor remoto para:
# 1. Eliminar la base de datos existente
# 2. Crear una nueva base de datos con collation UTF8MB4_UNICODE_CI
###############################################################################

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuración de la base de datos
DB_NAME="pasteleria_panaderia"
DB_USER="pasteleria_admin"
DB_CHARSET="utf8mb4"
DB_COLLATION="utf8mb4_unicode_ci"

echo -e "${YELLOW}[DB]${NC} Preparando base de datos..."

# Solicitar contraseña una sola vez si no se proporciona como variable de entorno
if [ -z "$DB_PASSWORD" ]; then
    read -sp "Ingrese la contraseña de MySQL para ${DB_USER}: " DB_PASSWORD
    echo ""
fi

# Eliminar base de datos existente
echo -e "${YELLOW}[DB]${NC} Eliminando base de datos existente (si existe)..."
mysql -u"${DB_USER}" -p"${DB_PASSWORD}" -e "DROP DATABASE IF EXISTS ${DB_NAME};" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Base de datos eliminada (o no existía)"
else
    echo -e "${RED}✗${NC} Error al eliminar la base de datos"
    exit 1
fi

# Crear base de datos con collation correcta
echo -e "${YELLOW}[DB]${NC} Creando base de datos con collation ${DB_COLLATION}..."
mysql -u"${DB_USER}" -p"${DB_PASSWORD}" -e "CREATE DATABASE ${DB_NAME} CHARACTER SET ${DB_CHARSET} COLLATE ${DB_COLLATION};" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Base de datos creada correctamente"
else
    echo -e "${RED}✗${NC} Error al crear la base de datos"
    exit 1
fi

# Verificar collation
echo -e "${YELLOW}[DB]${NC} Verificando configuración..."
COLLATION=$(mysql -u"${DB_USER}" -p"${DB_PASSWORD}" -e "SELECT DEFAULT_COLLATION_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = '${DB_NAME}';" -s -N 2>/dev/null)

if [ "${COLLATION}" = "${DB_COLLATION}" ]; then
    echo -e "${GREEN}✓${NC} Collation verificada: ${COLLATION}"
    echo -e "${GREEN}✓${NC} Base de datos lista para Flyway"
else
    echo -e "${RED}✗${NC} Advertencia: Collation inesperada: ${COLLATION}"
fi

echo ""
echo -e "${GREEN}Base de datos preparada exitosamente${NC}"
