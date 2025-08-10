# 📝 Todo App - Full Stack Application

Esta aplicación es un sistema completo de gestión de tareas (Todo List) con backend en Go y frontend en Angular.

## 📂 Estructura del Proyecto

```
todo_app/
├── restapi/                 # Backend API en Go
│   ├── src/                 # Código fuente del backend
│   ├── uploads/             # Archivos subidos (avatares)
│   ├── main.go             # Punto de entrada del servidor
│   ├── go.mod              # Dependencias Go
│   ├── .env                # Variables de entorno
│   └── *.json              # Colecciones Postman
│
├── frontend/               # Frontend Angular (a crear)
│   └── (se creará aquí)
│
└── README.md              # Este archivo
```

## 🚀 Tecnologías Utilizadas

### Backend (REST API)
- **Go** - Lenguaje principal
- **Gin** - Framework web
- **GORM** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Docker** - Contenedorización de PostgreSQL

### Frontend (próximamente)
- **Angular 17+** - Framework frontend
- **TypeScript** - Lenguaje tipado
- **Angular Material** - Componentes UI
- **RxJS** - Programación reactiva

## 🏃‍♂️ Cómo ejecutar el proyecto

### Pre-requisitos
- Go 1.21+
- Docker
- Node.js 18+ (para el frontend)
- Angular CLI

### 1. Backend (REST API)

#### Iniciar PostgreSQL con Docker
```bash
# Desde la raíz del proyecto
sudo docker run --name todo-postgres \
  -e POSTGRES_USER=todo_user \
  -e POSTGRES_PASSWORD=admin1234 \
  -e POSTGRES_DB=todo_db \
  -p 5433:5432 -d postgres:15
```

#### Ejecutar el servidor
```bash
# Navegar al directorio del backend
cd restapi

# Ejecutar el servidor
go run ./main.go
```

El servidor estará disponible en: `http://localhost:8080`

#### API Endpoints
- `POST /api/v1/users/` - Crear usuario (form-data)
- `POST /api/v1/users/login` - Login (JSON)
- `GET /api/v1/categories/` - Obtener categorías
- `POST /api/v1/categories/` - Crear categoría
- `DELETE /api/v1/categories/:id` - Eliminar categoría
- `GET /api/v1/tasks/user` - Obtener tareas del usuario
- `POST /api/v1/tasks/` - Crear tarea
- `PUT /api/v1/tasks/:id` - Actualizar tarea
- `DELETE /api/v1/tasks/:id` - Eliminar tarea

### 2. Frontend (Angular) - Próximamente

```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
ng serve
```

El frontend estará disponible en: `http://localhost:4200`

## 🧪 Testing con Postman

En la carpeta `restapi/` encontrarás:
- `Todo_App_API.postman_collection.json` - Colección completa
- `Todo_App_Environment.postman_environment.json` - Variables de entorno
- `POSTMAN_README.md` - Guía detallada

## 🔧 Configuración

### Variables de Entorno (`.env`)
```properties
DB_HOST=localhost
DB_PORT=5433
DB_USER=todo_user
DB_PASSWORD=admin1234
DB_NAME=todo_db
JWT_SECRET=tu_secreto_jwt_muy_seguro
```

### Base de Datos
- **PostgreSQL** ejecutándose en Docker
- **Puerto**: 5433 (para evitar conflictos)
- **Migraciones**: Se ejecutan automáticamente al iniciar

## 📱 Funcionalidades

### Actuales (Backend)
- ✅ Autenticación JWT
- ✅ Gestión de usuarios
- ✅ CRUD de categorías
- ✅ CRUD de tareas
- ✅ Subida de imágenes de perfil
- ✅ Estados de tareas (Sin Empezar, Empezada, Finalizada)

### Próximamente (Frontend)
- 🔄 Interfaz de usuario completa
- 🔄 Dashboard con estadísticas
- 🔄 Filtros y búsqueda avanzada
- 🔄 Responsive design
- 🔄 PWA (Progressive Web App)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es para fines educativos.

---

**Siguiente paso**: Crear el frontend Angular en la carpeta `frontend/`
