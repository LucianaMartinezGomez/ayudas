#!/bin/bash

# Script de configuración inicial para el Sistema de Gestión de Tareas

echo "=================================="
echo "  Setup - Sistema de Gestión de Tareas"
echo "=================================="
echo ""

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Node.js
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js no está instalado${NC}"
    echo "  Por favor, instala Node.js desde https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js está instalado ($(node --version))${NC}"

# Verificar npm
echo "Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm está instalado ($(npm --version))${NC}"

# Verificar MySQL
echo "Verificando MySQL..."
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}⚠ MySQL no está disponible en el PATH${NC}"
    echo "  Asegúrate de tener MySQL instalado y configurado"
else
    echo -e "${GREEN}✓ MySQL está instalado${NC}"
fi

echo ""
echo "=================================="
echo "  Instalando dependencias..."
echo "=================================="
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencias instaladas correctamente${NC}"
else
    echo -e "${RED}✗ Error al instalar dependencias${NC}"
    exit 1
fi

echo ""
echo "=================================="
echo "  Configurando variables de entorno..."
echo "=================================="

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Archivo .env creado${NC}"
    echo -e "${YELLOW}⚠ Por favor, edita el archivo .env con tus credenciales de base de datos${NC}"
else
    echo -e "${YELLOW}⚠ El archivo .env ya existe${NC}"
fi

echo ""
echo "=================================="
echo "  Configuración de la base de datos"
echo "=================================="
echo ""
echo "Para configurar la base de datos, ejecuta los siguientes comandos:"
echo ""
echo "1. Conéctate a MySQL:"
echo "   ${YELLOW}mysql -u root -p${NC}"
echo ""
echo "2. Ejecuta el script de base de datos:"
echo "   ${YELLOW}source database.sql${NC}"
echo ""
echo "   O desde el terminal:"
echo "   ${YELLOW}mysql -u root -p < database.sql${NC}"
echo ""

echo "=================================="
echo "  Siguiente paso"
echo "=================================="
echo ""
echo "1. Edita el archivo .env con tus credenciales:"
echo "   ${YELLOW}nano .env${NC} o usa tu editor favorito"
echo ""
echo "2. Configura la base de datos (ver instrucciones arriba)"
echo ""
echo "3. Inicia el servidor:"
echo "   ${YELLOW}npm start${NC}     (modo producción)"
echo "   ${YELLOW}npm run dev${NC}   (modo desarrollo con auto-reload)"
echo ""
echo "4. Abre tu navegador en:"
echo "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo -e "${GREEN}✓ Setup completado!${NC}"
