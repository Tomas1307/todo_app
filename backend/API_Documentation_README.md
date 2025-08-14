# Todo App API - Documentación de Postman

## Descripción

Esta documentación contiene todos los endpoints de la API REST para la aplicación Todo App, incluyendo pruebas automatizadas y casos de uso completos.

## Archivos Generados

1. **Todo_App_API.postman_collection.json** - Colección principal con todos los endpoints
2. **Todo_App_Local_Environment.postman_environment.json** - Entorno de desarrollo local

## Estructura de la API

### Base URL
```
http://localhost:8080/api/v1
```

### Endpoints Disponibles

#### Autenticación
- `POST /users/` - Registro de nuevo usuario (**multipart/form-data**)
- `POST /users/login` - Inicio de sesión y obtención de token JWT (**application/json**)

#### Categorías (Requiere autenticación)
- `POST /categories/` - Crear nueva categoría
- `GET /categories/` - Obtener todas las categorías del usuario
- `DELETE /categories/:id` - Eliminar categoría

#### Tareas (Requiere autenticación)
- `POST /tasks/` - Crear nueva tarea
- `GET /tasks/user` - Obtener todas las tareas del usuario
- `GET /tasks/:id` - Obtener tarea específica
- `PUT /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea

## Importación en Postman

### 1. Importar la Colección
1. Abrir Postman
2. Clic en "Import"
3. Seleccionar el archivo `Todo_App_API.postman_collection.json`
4. Confirmar importación

### 2. Importar el Entorno
1. En Postman, ir a "Environments"
2. Clic en "Import"
3. Seleccionar el archivo `Todo_App_Local_Environment.postman_environment.json`
4. Activar el entorno "Todo App Local Environment"

## Flujo de Pruebas Recomendado

### 1. Configuración Inicial
1. Asegurarse que el servidor esté ejecutándose en `localhost:8080`
2. Activar el entorno "Todo App Local Environment"

### 2. Autenticación
1. **Registro**: Ejecutar "Register User" para crear una cuenta
2. **Login**: Ejecutar "Login User" para obtener el token JWT
   - El token se guardará automáticamente en las variables de entorno

### 3. Gestión de Categorías
1. **Crear Categoría**: Ejecutar "Create Category"
   - El ID se guardará automáticamente para pruebas posteriores
2. **Listar Categorías**: Ejecutar "Get Categories"
3. **Eliminar Categoría**: Ejecutar "Delete Category" (opcional)

### 4. Gestión de Tareas
1. **Crear Tarea**: Ejecutar "Create Task"
   - Requiere un `category_id` válido
   - El ID se guardará automáticamente
2. **Listar Tareas**: Ejecutar "Get User Tasks"
3. **Obtener Tarea**: Ejecutar "Get Task by ID"
4. **Actualizar Tarea**: Ejecutar "Update Task"
5. **Eliminar Tarea**: Ejecutar "Delete Task" (opcional)

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `base_url` | URL base de la API | `http://localhost:8080/api/v1` |
| `auth_token` | Token JWT para autenticación | `eyJhbGciOiJIUzI1NiIs...` |
| `user_id` | ID del usuario logueado | `1` |
| `category_id` | ID de categoría para pruebas | `1` |
| `task_id` | ID de tarea para pruebas | `1` |

## Pruebas Automatizadas

Cada endpoint incluye pruebas automatizadas que verifican:

- **Códigos de estado HTTP** correctos
- **Estructura de respuesta** válida
- **Validación de datos** enviados vs recibidos
- **Almacenamiento automático** de IDs para pruebas en cadena

### Pruebas Globales
- Tiempo de respuesta menor a 5 segundos
- Content-Type correcto en respuestas JSON

## Estados de Tareas

| Estado | Descripción |
|--------|-------------|
| `Sin Empezar` | Estado inicial de toda tarea nueva |
| `Empezada` | Tarea en progreso |
| `Finalizada` | Tarea completada |

## Códigos de Respuesta

| Código | Significado | Uso |
|--------|-------------|-----|
| `200` | OK | Operación exitosa (GET, PUT, DELETE) |
| `201` | Created | Recurso creado exitosamente (POST) |
| `400` | Bad Request | Error en validación de datos |
| `401` | Unauthorized | Token inválido o faltante |
| `404` | Not Found | Recurso no encontrado |
| `500` | Internal Server Error | Error interno del servidor |

## Ejemplos de Uso

### Registro y Login
```bash
# POST /users/ (multipart/form-data)
# En Postman:
# - Selecciona "Body" → "form-data"
# - Agrega key "username" con value "john_doe" (Text)
# - Agrega key "password" con value "securePassword123" (Text)  
# - Opcionalmente agrega key "profile_img" como File

# POST /users/login (application/json)
{
  "username": "john_doe", 
  "password": "securePassword123"
}
```

### Crear Categoría
```json
// POST /categories/
{
  "name": "Trabajo",
  "description": "Tareas relacionadas con el trabajo"
}
```

### Crear Tarea
```json
// POST /tasks/
{
  "text": "Completar documentación de la API",
  "due_date": "2025-01-20T15:30:00Z",
  "category_id": 1
}
```

### Actualizar Tarea
```json
// PUT /tasks/:id
{
  "text": "Documentación completada",
  "status": "Finalizada"
}
```

## Notas Importantes

1. **Formatos de Datos**:
   - **Registro de usuario**: Usa `multipart/form-data` (permite subir imagen)
   - **Login y otros endpoints**: Usan `application/json`

2. **Autenticación**: Todos los endpoints excepto registro y login requieren el header:
   ```
   Authorization: Bearer {token}
   ```

3. **Fechas**: Usar formato ISO 8601 para las fechas:
   ```
   "due_date": "2025-01-20T15:30:00Z"
   ```

3. **Asociaciones**: Las tareas deben estar asociadas a categorías válidas que pertenezcan al usuario autenticado.

4. **Seguridad**: Los usuarios solo pueden acceder y modificar sus propios recursos (categorías y tareas).

## Troubleshooting

### Error 401 (Unauthorized)
- Verificar que el token JWT esté presente en el header
- El token puede haber expirado, realizar login nuevamente

### Error 404 (Not Found)
- Verificar que el ID del recurso exista
- Verificar que el recurso pertenezca al usuario autenticado

### Error 400 (Bad Request)
- Revisar que todos los campos requeridos estén presentes
- Verificar formato de datos (fechas, tipos de dato)
- Comprobar que los valores de enum sean válidos (estados de tarea)

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades, contactar al equipo de desarrollo.
