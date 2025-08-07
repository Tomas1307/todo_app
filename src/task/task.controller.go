// src/task/controller.go

package task

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// CreateTask maneja la creación de una nueva tarea.
func CreateTask(c *gin.Context) {
	var dto CreateTaskDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ##########################################################################
	// ##### INICIO DE LA LÓGICA FALTANTE (SERVICIO) #####
	//
	// 1. Obtener el ID del usuario autenticado (del token JWT).
	// 2. Llamar al servicio: taskService.Create(userID, dto)
	// 3. El servicio debe:
	//    a. Validar que la CategoryID exista.
	//    b. Crear la entidad Task y guardarla en la base de datos.
	// 4. Manejar posibles errores y devolver la nueva tarea creada.
	//
	// ##### FIN DE LA LÓGICA FALTANTE #####
	// ##########################################################################

	c.JSON(http.StatusCreated, gin.H{"message": "201: Task created", "data": dto})
}

// GetTasksByUser obtiene todas las tareas de un usuario específico.
func GetTasksByUser(c *gin.Context) {
	// ##########################################################################
	// ##### INICIO DE LA LÓGICA FALTANTE (SERVICIO) #####
	//
	// 1. Obtener el ID del usuario autenticado (del token JWT).
	// 2. Llamar al servicio: taskService.GetByUserID(userID)
	// 3. El servicio debe:
	//    a. Consultar la base de datos por todas las tareas asociadas al userID.
	//    b. Manejar filtros opcionales (ej: por categoría o estado).
	// 4. Devolver la lista de tareas encontradas.
	//
	// ##### FIN DE LA LÓGICA FALTANTE #####
	// ##########################################################################

	c.JSON(http.StatusOK, gin.H{"message": "Lista de tareas del usuario"})
}

// GetTaskByID obtiene una tarea por su ID.
func GetTaskByID(c *gin.Context) {
	idParam := c.Param("id")
	taskID, err := strconv.Atoi(idParam) // 1. Aquí declaras taskID
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// ##### LÓGICA FALTANTE #####
	// (Aquí es donde se USARÁ taskID en el futuro)

	// 2. Aquí usas idParam (el texto), pero no taskID (el número)
	c.JSON(http.StatusOK, gin.H{"message": "Detalles de la tarea " + strconv.Itoa(taskID)})
}

// UpdateTask actualiza una tarea existente.
func UpdateTask(c *gin.Context) {
	idParam := c.Param("id")
	taskID, err := strconv.Atoi(idParam) // Se declara taskID
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var dto UpdateTaskDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ##########################################################################
	// ##### INICIO DE LA LÓGICA FALTANTE (SERVICIO) #####
	//
	// 1. Obtener el ID del usuario autenticado (del token JWT).
	// 2. Llamar al servicio: taskService.Update(userID, uint(taskID), dto)
	// 3. El servicio debe:
	//    a. Verificar que la tarea exista y pertenezca al usuario.
	//    b. Aplicar las actualizaciones del DTO a la entidad.
	//    c. Guardar los cambios en la base de datos.
	// 4. Devolver la tarea actualizada.
	//
	// ##### FIN DE LA LÓGICA FALTANTE #####
	// ##########################################################################

	c.JSON(http.StatusOK, gin.H{"message": "Tarea " + strconv.Itoa(taskID) + " actualizada", "data": dto})
}

// DeleteTask elimina una tarea.
func DeleteTask(c *gin.Context) {
	idParam := c.Param("id")
	taskID, err := strconv.Atoi(idParam) // Se declara taskID
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// ##########################################################################
	// ##### INICIO DE LA LÓGICA FALTANTE (SERVICIO) #####
	//
	// 1. Obtener el ID del usuario autenticado (del token JWT).
	// 2. Llamar al servicio: taskService.Delete(userID, uint(taskID))
	// 3. El servicio debe:
	//    a. Verificar que la tarea exista y pertenezca al usuario.
	//    b. Eliminar la tarea de la base de datos.
	// 4. Devolver una confirmación.
	//
	// ##### FIN DE LA LÓGICA FALTANTE #####
	// ##########################################################################

	c.JSON(http.StatusOK, gin.H{"message": "201: Tarea " + strconv.Itoa(taskID) + " eliminada"})
}
