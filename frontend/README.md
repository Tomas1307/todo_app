# Proyecto To-Do List (Frontend)

Este es el frontend para la aplicación de gestión de tareas, desarrollado como parte del ejercicio de nivelación para la Maestría en Ingeniería de Software de la Universidad de los Andes.

La aplicación web está construida con **Angular 18**, **Angular Material** y se conecta al backend a través de una API REST. Todo el entorno está containerizado con **Docker**.

## Tecnologías Utilizadas
* **Framework:** Angular 18
* **UI Library:** Angular Material
* **Lenguaje:** TypeScript
* **Estilos:** SCSS
* **HTTP Client:** Angular HttpClient
* **Routing:** Angular Router
* **Forms:** Angular Reactive Forms
* **Containerización:** Docker & Nginx

---
## Prerrequisitos
Para ejecutar este proyecto, necesitas tener instalado:
* [Docker](https://www.docker.com/get-started)
* [Docker Compose](https://docs.docker.com/compose/install/)

Para desarrollo local (opcional):
* [Node.js](https://nodejs.org/) (versión 18 o superior)
* [Angular CLI](https://angular.dev/tools/cli)

---
## Cómo Ejecutar el Proyecto con Docker (Recomendado)

Esta es la forma más sencilla de levantar toda la aplicación (frontend + backend + base de datos).

### 1. Clonar el Repositorio
```bash
git clone <URL_de_tu_repositorio>
cd <nombre_del_repositorio>
```

### 2. Levantar los Contenedores
Desde la **raíz del proyecto** (donde está el `docker-compose.yml`), ejecuta el siguiente comando:
```bash
docker-compose up --build
```

La primera vez puede tardar unos minutos mientras se descargan y construyen las imágenes. Una vez finalizado, la aplicación estará disponible en:

* **Frontend:** http://localhost:3000
* **Backend API:** http://localhost:8080

### 3. Detener los Contenedores
Para detener los contenedores, presiona `Ctrl + C` en la misma terminal, o abre una nueva y ejecuta:
```bash
docker-compose down
```

---
## Desarrollo Local (Opcional)

Si prefieres desarrollar sin Docker:

### 1. Instalar Dependencias
```bash
cd frontend
npm install
```

### 2. Servidor de Desarrollo
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias algún archivo.

### 3. Construir para Producción
```bash
ng build
```

Los archivos construidos se almacenarán en el directorio `dist/`.

---
## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes de la aplicación
│   │   │   ├── auth/           # Componentes de autenticación
│   │   │   ├── dashboard/      # Componente principal
│   │   │   ├── tasks/          # Gestión de tareas
│   │   │   └── categories/     # Gestión de categorías
│   │   ├── services/           # Servicios para API
│   │   ├── models/             # Modelos de datos
│   │   └── guards/             # Guards de autenticación
│   ├── styles.scss             # Estilos globales
│   └── index.html              # Página principal
├── docker files
├── Dockerfile                  # Configuración Docker
└── package.json               # Dependencias del proyecto
```

---
## Funcionalidades

* **Autenticación:** Login y registro de usuarios
* **Dashboard:** Vista general de tareas y estadísticas
* **Gestión de Tareas:** Crear, editar, eliminar y marcar como completadas
* **Categorías:** Organizar tareas por categorías
* **Filtros:** Filtrar tareas por estado y categoría
* **Responsive Design:** Optimizado para dispositivos móviles y desktop

---
## API Endpoints

El frontend se comunica con el backend a través de los siguientes endpoints:

* **Autenticación:**
  - `POST /api/v1/users/` - Registro de usuario
  - `POST /api/v1/users/login` - Login de usuario

* **Tareas:**
  - `GET /api/v1/tasks/user` - Obtener tareas del usuario
  - `POST /api/v1/tasks/` - Crear nueva tarea
  - `PUT /api/v1/tasks/:id` - Actualizar tarea
  - `DELETE /api/v1/tasks/:id` - Eliminar tarea

* **Categorías:**
  - `GET /api/v1/categories/` - Obtener categorías
  - `POST /api/v1/categories/` - Crear nueva categoría
  - `DELETE /api/v1/categories/:id` - Eliminar categoría
