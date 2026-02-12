# Sistema de Gestión de Tareas - Aplicación de Estudio

Sistema web de gestión de tareas para grupos de estudio con arquitectura MVC, desarrollado con Node.js, Express, MySQL y Vanilla JavaScript.

## 🚀 Características

- **Autenticación segura** con bcrypt y JWT
- **Sistema de roles**: Administrador (Profesor), Líder de Célula, Estudiante
- **Gestión de Clanes**: Los profesores pueden crear clanes con 7 células automáticas
- **Códigos de acceso**: Cada célula tiene un código único para que los estudiantes se unan
- **Gestión de Tareas**: Los líderes pueden crear, actualizar y eliminar tareas (CRUD completo)
- **Notificaciones**: Sistema de notificaciones para mantener informados a los usuarios
- **Vistas por rol**: Interfaces personalizadas según el rol del usuario

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- npm o yarn

## 🛠️ Tecnologías

### Backend
- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MySQL** - Base de datos relacional
- **bcryptjs** - Hash de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **dotenv** - Variables de entorno

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos
- **JavaScript (Vanilla)** - Lógica del cliente

## 📁 Estructura del Proyecto

```
ayudas/
├── config/              # Configuración de la base de datos
├── controllers/         # Controladores (lógica de negocio)
├── models/             # Modelos (interacción con la BD)
├── routes/             # Rutas de la API
├── middleware/         # Middleware de autenticación y validación
├── utils/              # Funciones auxiliares
├── public/             # Archivos estáticos del frontend
│   ├── css/           # Estilos CSS
│   ├── js/            # JavaScript del cliente
│   ├── images/        # Imágenes
│   └── *.html         # Páginas HTML
├── database.sql        # Script de creación de la base de datos
├── server.js           # Punto de entrada de la aplicación
├── package.json        # Dependencias del proyecto
└── .env.example        # Ejemplo de variables de entorno
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd ayudas
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la base de datos

#### Crear la base de datos en MySQL

```bash
mysql -u root -p < database.sql
```

O manualmente:
```sql
CREATE DATABASE ayudas_db;
USE ayudas_db;
-- Luego ejecutar el contenido de database.sql
```

### 4. Configurar variables de entorno

Copiar el archivo de ejemplo y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=ayudas_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=tu_clave_secreta_segura
JWT_EXPIRES_IN=24h

# Application Configuration
BCRYPT_ROUNDS=10
```

### 5. Iniciar el servidor

#### Modo desarrollo (con reinicio automático)

```bash
npm run dev
```

#### Modo producción

```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📊 Estructura de la Base de Datos

### Tablas principales:

1. **usuarios** - Información de usuarios (profesores, líderes, estudiantes)
2. **clanes** - Grupos principales creados por profesores
3. **celulas** - Subgrupos dentro de cada clan (7 por clan)
4. **tareas** - Tareas creadas por líderes para sus células
5. **notificaciones** - Sistema de notificaciones

### Relaciones:

- Un **clan** pertenece a un **profesor** (usuario administrador)
- Un **clan** tiene 7 **células** (creadas automáticamente)
- Una **célula** puede tener un **líder** (opcional)
- Los **estudiantes** se unen a **células** usando códigos
- Las **tareas** pertenecen a una **célula**
- Las **notificaciones** son enviadas a **usuarios**

## 🔐 API Endpoints

### Autenticación (`/api/auth`)
- `POST /register` - Registrar nuevo usuario
- `POST /login` - Iniciar sesión
- `GET /profile` - Obtener perfil (autenticado)
- `POST /change-password` - Cambiar contraseña (autenticado)

### Usuarios (`/api/users`)
- `GET /` - Listar todos los usuarios (admin)
- `GET /:id` - Obtener usuario por ID
- `GET /rol/:rol` - Listar usuarios por rol (admin)
- `GET /celula/:celula_id` - Listar usuarios de una célula
- `PUT /:id` - Actualizar usuario (admin)
- `POST /:id/assign-celula` - Asignar célula a usuario (admin)

### Clanes (`/api/clanes`)
- `POST /` - Crear nuevo clan con 7 células (admin)
- `GET /` - Listar todos los clanes
- `GET /my-clanes` - Listar clanes del profesor (admin)
- `GET /:id` - Obtener clan con sus células
- `PUT /:id` - Actualizar clan (admin)

### Células (`/api/celulas`)
- `GET /` - Listar todas las células
- `GET /:id` - Obtener célula con miembros
- `GET /clan/:clan_id` - Listar células de un clan
- `POST /join` - Unirse a célula con código
- `POST /:id/assign-lider` - Asignar líder (admin)

### Tareas (`/api/tareas`)
- `POST /` - Crear tarea (líder)
- `GET /celula/:celula_id` - Listar tareas de una célula
- `GET /:id` - Obtener tarea por ID
- `PUT /:id` - Actualizar tarea (líder)
- `PATCH /:id/estado` - Actualizar estado de tarea (líder)
- `DELETE /:id` - Eliminar tarea (líder)

### Notificaciones (`/api/notificaciones`)
- `GET /` - Listar notificaciones del usuario
- `GET /unread` - Listar notificaciones no leídas
- `GET /count` - Contar notificaciones no leídas
- `PUT /:id/read` - Marcar como leída
- `PUT /read-all` - Marcar todas como leídas

## 👥 Roles y Permisos

### Administrador (Profesor)
- Crear y gestionar clanes
- Asignar líderes a células
- Gestionar usuarios
- Acceso completo al sistema

### Líder de Célula
- Crear, actualizar y eliminar tareas para su célula
- Ver miembros de su célula
- Gestionar estado de tareas

### Estudiante
- Unirse a células usando códigos
- Ver tareas asignadas
- Ver miembros de su célula
- Recibir notificaciones

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds por defecto)
- Autenticación basada en JWT
- Tokens con expiración configurable
- Middleware de autorización por roles
- Validación de entrada de datos
- Protección contra inyección SQL (usando prepared statements)

## 🧪 Pruebas

Para probar la aplicación, puedes usar el usuario administrador de ejemplo creado en el script SQL:

```
Email: admin@ayudas.com
Password: admin123
```

**Nota:** Cambia esta contraseña en producción.

## 📝 Uso Básico

### 1. Profesor crea un Clan
1. Registrarse como administrador
2. Iniciar sesión
3. Ir a "Mis Clanes"
4. Crear nuevo clan (se crean automáticamente 7 células)
5. Compartir códigos de células con estudiantes

### 2. Estudiantes se unen
1. Registrarse como estudiante
2. Usar código de célula proporcionado por el profesor
3. Acceder a "Mi Célula" para ver miembros

### 3. Líder gestiona tareas
1. El profesor asigna un líder a la célula
2. El líder puede crear tareas desde "Mis Tareas"
3. Los estudiantes ven las tareas en su célula

## 🚧 Funcionalidades Futuras

- [ ] Sistema de chat en tiempo real
- [ ] Calendario de tareas
- [ ] Archivos adjuntos en tareas
- [ ] Estadísticas y reportes
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Exportación de datos

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👤 Autor

Desarrollado como parte de un proyecto de gestión de tareas educativas.

## 📞 Soporte

Para problemas o preguntas, por favor abre un issue en el repositorio.

---

**¡Gracias por usar nuestro Sistema de Gestión de Tareas!** 🎓✨