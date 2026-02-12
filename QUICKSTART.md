# Guía de Inicio Rápido

Esta guía te ayudará a tener el sistema funcionando en pocos minutos.

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ Node.js v14 o superior ([Descargar](https://nodejs.org/))
- ✅ MySQL v5.7 o superior ([Descargar](https://dev.mysql.com/downloads/))
- ✅ Git (opcional)

### Paso 2: Configuración

#### Opción A: Usando el script automático (Linux/Mac)

```bash
# 1. Ejecutar el script de setup
./setup.sh

# 2. Editar las variables de entorno
nano .env

# 3. Configurar la base de datos
mysql -u root -p < database.sql

# 4. Iniciar el servidor
npm start
```

#### Opción B: Configuración manual

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# 3. Crear base de datos
mysql -u root -p
# En MySQL, ejecuta:
source database.sql;

# 4. Iniciar servidor
npm start
```

### Paso 3: Acceder a la aplicación

Abre tu navegador en: **http://localhost:3000**

## 🔐 Credenciales de prueba

Usuario administrador de ejemplo:

```
Email: admin@ayudas.com
Contraseña: admin123
```

**⚠️ IMPORTANTE:** Cambia estas credenciales en producción.

## 📝 Primeros pasos en la aplicación

### Como Profesor (Administrador):

1. **Registrarse/Iniciar sesión**
   - Ve a "Registrarse" y selecciona rol "Profesor (Administrador)"
   - O usa las credenciales de prueba

2. **Crear un Clan**
   - Ve a "Mis Clanes"
   - Haz clic en "Crear Nuevo Clan"
   - Se crearán automáticamente 7 células
   - Guarda los códigos de acceso de las células

3. **Compartir códigos**
   - Comparte los códigos de células con tus estudiantes
   - Cada código tiene el formato: `CLAN-XXXXXXXX-C1` (hasta C7)

### Como Estudiante:

1. **Registrarse**
   - Ve a "Registrarse" y selecciona rol "Estudiante"
   - Ingresa el código de célula que te dio tu profesor
   - Ejemplo: `CLAN-12345678-C1`

2. **Ver tu célula**
   - Accede a "Mi Célula" para ver compañeros
   - Ve a "Mis Tareas" para ver tareas asignadas

### Como Líder de Célula:

1. **Asignación**
   - El profesor debe asignarte como líder de una célula
   - Una vez asignado, tu rol cambiará automáticamente

2. **Crear tareas**
   - Ve a "Mis Tareas"
   - Haz clic en "Nueva Tarea"
   - Completa los detalles de la tarea
   - Los miembros de tu célula recibirán notificaciones

## 🔧 Solución de problemas

### Error: "Cannot connect to database"

```bash
# Verifica que MySQL esté corriendo
sudo service mysql status

# Verifica tus credenciales en .env
cat .env

# Verifica que la base de datos existe
mysql -u root -p -e "SHOW DATABASES;"
```

### Error: "Port 3000 already in use"

```bash
# Cambia el puerto en .env
echo "PORT=3001" >> .env

# O detén el proceso que usa el puerto 3000
lsof -ti:3000 | xargs kill
```

### Error: "Module not found"

```bash
# Reinstala las dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📚 Recursos adicionales

- [README completo](./README.md) - Documentación completa del proyecto
- [API Endpoints](./README.md#-api-endpoints) - Documentación de la API
- [Estructura de la BD](./README.md#-estructura-de-la-base-de-datos) - Esquema de la base de datos

## 🆘 ¿Necesitas ayuda?

Si encuentras algún problema:

1. Revisa los logs del servidor en la consola
2. Verifica los logs de MySQL
3. Abre un issue en el repositorio
4. Consulta la documentación completa en README.md

## 🎯 Próximos pasos

Una vez que tengas el sistema funcionando:

1. **Personaliza tu configuración** - Edita .env según tus necesidades
2. **Explora la API** - Usa Postman o curl para probar los endpoints
3. **Lee la documentación completa** - Revisa README.md para más detalles
4. **Crea tu primer clan** - Empieza a usar el sistema

---

**¡Disfruta usando el Sistema de Gestión de Tareas!** 🚀
