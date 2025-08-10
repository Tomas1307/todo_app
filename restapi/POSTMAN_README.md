# 🚀 Colección Postman - Todo App API

Esta colección contiene todos los endpoints de la API Todo App listos para usar en Postman.

## 📁 Archivos incluidos

- `Todo_App_API.postman_collection.json` - Colección principal con todos los endpoints
- `Todo_App_Environment.postman_environment.json` - Entorno con variables predefinidas

## 🔧 Cómo importar en Postman

### 1. Importar la Colección
1. Abre Postman
2. Click en "Import" (botón en la esquina superior izquierda)
3. Arrastra el archivo `Todo_App_API.postman_collection.json` o usa "Choose file"
4. Click "Import"

### 2. Importar el Entorno
1. Click en "Import" nuevamente
2. Arrastra el archivo `Todo_App_Environment.postman_environment.json`
3. Click "Import"

### 3. Activar el Entorno
1. En la esquina superior derecha, selecciona "Todo App Environment" del dropdown
2. Asegúrate de que esté activo (debe aparecer resaltado)

## 🔑 Variables de Entorno

La colección usa estas variables automáticamente:

- `base_url`: `http://localhost:8080/api/v1`
- `jwt_token`: Se guarda automáticamente al hacer login
- `category_id`: Se guarda automáticamente al crear una categoría
- `task_id`: Se guarda automáticamente al crear una tarea

## 📋 Orden recomendado de pruebas

### ✅ Secuencia Básica
1. **Crear Usuario** - Crea un nuevo usuario
2. **Login Usuario** - Autentica y obtiene el token JWT
3. **Crear Categoría** - Crea una categoría para las tareas
4. **Crear Tarea** - Crea una nueva tarea
5. **Obtener Tareas por Usuario** - Lista todas las tareas

### 🔄 Operaciones CRUD Completas
- **Categorías**: Crear → Listar → Eliminar
- **Tareas**: Crear → Obtener por ID → Actualizar → Listar → Eliminar

## 🎯 Características incluidas

### 🧪 Tests Automáticos
Cada request incluye tests que verifican:
- Códigos de respuesta correctos
- Presencia de campos requeridos
- Tipos de datos esperados

### 🔄 Gestión Automática de Variables
- El token JWT se guarda automáticamente al hacer login
- Los IDs se guardan automáticamente al crear recursos
- Se usan variables para referencias entre requests

### 📊 Estados de Tarea Válidos
- `"Sin Empezar"` - Estado inicial
- `"Empezada"` - En progreso
- `"Finalizada"` - Completada

## ⚠️ Notas importantes sobre formatos

### 👤 Crear Usuario
- **Formato**: Form-data (no JSON)
- **Campos obligatorios**: `username`, `password`
- **Campo opcional**: `profile_img` (archivo de imagen)
- **Razón**: El endpoint maneja subida de archivos de imagen de perfil

### 🔐 Login
- **Formato**: JSON
- **Campos**: `username`, `password`

### Resto de endpoints
- **Formato**: JSON con autenticación Bearer token

## 💡 Tips de uso

### 🔑 Autenticación
La mayoría de endpoints requieren autenticación. El token se obtiene del endpoint de login y se usa automáticamente.

### 📝 Personalización
Puedes modificar los ejemplos de datos en cada request:
- Cambiar usernames y passwords
- Modificar textos de tareas
- Ajustar fechas de vencimiento
- Personalizar nombres de categorías

### 🐛 Depuración
Si algo no funciona:
1. Verifica que el servidor esté ejecutándose en `http://localhost:8080`
2. Asegúrate de que el entorno esté activo
3. Revisa la consola de Postman para errores
4. Verifica que tengas un token válido (haz login nuevamente si es necesario)

## 🔍 Endpoints incluidos

### 👤 Usuarios
- `POST /users/` - Crear usuario
- `POST /users/login` - Login

### 📁 Categorías
- `POST /categories/` - Crear categoría
- `GET /categories/` - Listar categorías
- `DELETE /categories/{id}` - Eliminar categoría

### ✅ Tareas
- `POST /tasks/` - Crear tarea
- `GET /tasks/user` - Obtener tareas por usuario
- `GET /tasks/{id}` - Obtener tarea por ID
- `PUT /tasks/{id}` - Actualizar tarea
- `DELETE /tasks/{id}` - Eliminar tarea

## 🚀 Comenzar rápidamente

1. Importa ambos archivos JSON
2. Activa el entorno "Todo App Environment"
3. Ejecuta "Crear Usuario" para crear tu primer usuario
4. Ejecuta "Login Usuario" para obtener el token
5. ¡Ya puedes probar todos los endpoints!

¡Disfruta probando tu API! 🎉
