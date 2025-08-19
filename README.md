# Proyecto To-Do List - Stack Completo

Este es un proyecto completo de gestión de tareas desarrollado como parte del ejercicio de nivelación para la materia Desarollo de soluciones cloud de la Universidad de los Andes.

## Descripción General

La aplicación permite a los usuarios gestionar sus tareas diarias de manera eficiente a través de una interfaz web moderna y una API REST robusta.

### Arquitectura del Sistema

El proyecto está compuesto por tres componentes principales:

* **Frontend:** Aplicación web construida con Angular 18 y Angular Material
* **Backend:** API REST desarrollada en Go con el framework Gin
* **Base de Datos:** PostgreSQL para almacenamiento persistente

## Tecnologías Utilizadas

### Frontend
* Angular 18
* Angular Material
* TypeScript
* SCSS

### Backend
* Go (Golang)
* Framework Gin
* GORM (ORM)
* JWT para autenticación

### Base de Datos
* PostgreSQL 16

### Infraestructura
* Docker
* Docker Compose
* Nginx (para servir el frontend)

## Funcionalidades

* **Autenticación de usuarios:** Registro y login seguro
* **Gestión de tareas:** Crear, editar, eliminar y marcar tareas como completadas
* **Categorización:** Organizar tareas por categorías personalizadas
* **Dashboard:** Vista general con estadísticas y resumen de tareas
* **Filtros avanzados:** Filtrar por estado, categoría y fecha
* **Interfaz responsive:** Optimizada para dispositivos móviles y desktop

## Prerrequisitos

Para ejecutar este proyecto necesitas tener instalado:

* [Docker](https://www.docker.com/get-started)
* [Docker Compose](https://docs.docker.com/compose/install/)

## Instalación y Ejecución

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Tomas1307/todo_app.git
cd todo_app
```

### 2. Ejecutar la Aplicación
Desde la raíz del proyecto, ejecuta el siguiente comando:

```bash
docker-compose up --build
```

Este comando:
- Construye las imágenes de Docker para el frontend y backend
- Descarga e inicializa la base de datos PostgreSQL
- Configura la red interna entre los servicios
- Inicia todos los contenedores

### 3. Acceder a la Aplicación

Una vez que todos los contenedores estén ejecutándose (puede tardar unos minutos la primera vez), puedes acceder a:

* **Aplicación Web:** http://localhost:3000
* **API Backend:** http://localhost:8080

### 4. Detener la Aplicación

Para detener todos los servicios:

```bash
docker-compose down
```

Para eliminar también los volúmenes de datos (reinicio completo):

```bash
docker-compose down -v
```

## Estructura del Proyecto

```
todo_app/
├── frontend/                   # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Componentes UI
│   │   │   ├── services/       # Servicios para API
│   │   │   ├── models/         # Modelos de datos
│   │   │   └── guards/         # Guards de autenticación
│   │   └── styles.scss
│   ├── Dockerfile
│   ├── default.conf           # Configuración Nginx
│   └── package.json
├── backend/                    # API REST en Go
│   ├── src/
│   │   ├── auth/              # Autenticación
│   │   ├── user/              # Gestión de usuarios
│   │   ├── task/              # Gestión de tareas
│   │   ├── category/          # Gestión de categorías
│   │   └── config/            # Configuración BD
│   ├── Dockerfile
│   ├── main.go
│   └── go.mod
├── docker-compose.yml          # Orquestación de servicios
└── README.md                  # Este archivo
```

## Variables de Entorno

El backend utiliza las siguientes variables de entorno (configuradas automáticamente en Docker):

```env
DB_HOST=db
DB_PORT=5432
DB_USER=todo_user
DB_PASSWORD=admin1234
DB_NAME=todo_db
JWT_SECRET=este_es_un_secreto_muy_seguro_y_largo_321
```

## Puertos Utilizados

* **3000:** Frontend (Angular + Nginx)
* **8080:** Backend (API Go)
* **5432:** Base de datos PostgreSQL (solo interno)

## Primeros Pasos

1. Accede a http://localhost:3000
2. Registra una nueva cuenta de usuario
3. Inicia sesión con tus credenciales
4. Comienza a crear tus tareas y categorías

## Desarrollo

Para desarrollo local de cada componente, consulta los README específicos:

* [Frontend README](./frontend/README.md)
* [Backend README](./backend/readme.md)

## Solución de Problemas

### Error de puerto ocupado
Si algún puerto está ocupado, puedes modificar los puertos en el archivo `docker-compose.yml`.

### Limpieza completa
Para un reinicio completo del proyecto:

```bash
docker-compose down -v
docker rmi todo_app-frontend todo_app-backend
docker-compose up --build
```

### Logs de contenedores
Para ver los logs de un servicio específico:

```bash
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db
```

## Contribución

Este proyecto fue desarrollado como ejercicio académico. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request


