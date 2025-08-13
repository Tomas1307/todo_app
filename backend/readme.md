# Proyecto To-Do List (Backend)

Este es el backend para la aplicación de gestión de tareas, desarrollado como parte del ejercicio de nivelación para la Maestría en Ingeniería de Software de la Universidad de los Andes.

La API está construida con **Go (Golang)**, el framework **Gin** y se conecta a una base de datos **PostgreSQL**. Todo el entorno está containerizado con **Docker**.

## Tecnologías Utilizadas
* **Lenguaje:** Go (Golang)
* **Framework Web:** Gin
* **Base de Datos:** PostgreSQL
* **ORM:** GORM
* **Autenticación:** JWT (JSON Web Tokens)
* **Containerización:** Docker & Docker Compose

---
## Prerrequisitos
Para ejecutar este proyecto, necesitas tener instalado:
* [Docker](https://www.docker.com/get-started)
* [Docker Compose](https://docs.docker.com/compose/install/)

---
## Cómo Ejecutar el Proyecto con Docker (Recomendado)

Esta es la forma más sencilla de levantar todo el entorno (backend + base de datos).

### 1. Clonar el Repositorio
```bash
git clone <URL_de_tu_repositorio>
cd <nombre_del_repositorio>
```

### 2. Configurar las Variables de Entorno
El backend necesita un archivo de configuración para conectarse a la base de datos.
* Navega a la carpeta `backend`.
* Crea una copia del archivo `.env.example` y renómbrala a `.env`.
* Revisa las variables dentro del archivo `.env`. Para Docker, los valores por defecto deberían funcionar sin cambios.

*(Nota: Si no tienes un `.env.example`, crea el archivo `backend/.env` manualmente con el siguiente contenido):*
```env
# Variables de la Base de Datos para Docker
DB_HOST=db
DB_PORT=5432
DB_USER=todo_user
DB_PASSWORD=admin1234
DB_NAME=todo_db

# Secreto para firmar los Tokens JWT
JWT_SECRET=este_es_un_secreto_muy_seguro_y_largo_321
```

### 3. Levantar los Contenedores
Desde la **raíz del proyecto** (donde está el `docker-compose.yml`), ejecuta el siguiente comando:
```bash
docker-compose up --build
```
La primera vez puede tardar unos minutos mientras se descargan y construyen las imágenes. Una vez finalizado, la API estará disponible en `http://localhost:8080`. Además es posible que falle la primera vez la base de datos, pero esta se reinicia para seguir funcionando.

Para detener los contenedores, presiona `Ctrl + C` en la misma terminal, o abre una nueva y ejecuta:
```bash
docker-compose down
```
