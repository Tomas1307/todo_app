// src/task/controller.go

package task

import (
	"net/http"
	"strconv"
	"todo_app/src/common/response"

	"github.com/gin-gonic/gin"
)

// TaskController contiene la dependencia del servicio.
type TaskController struct {
	service ITaskService
}

// NewTaskController es el constructor para inyectar el servicio.
func NewTaskController(service ITaskService) *TaskController {
	return &TaskController{
		service: service,
	}
}

func (ctrl *TaskController) CreateTask(c *gin.Context) {
	var dto CreateTaskDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, response.APIResponse{StatusCode: http.StatusBadRequest, Error: err.Error()})
		return
	}

	// NOTA: Usamos un userID hardcodeado (1). En el futuro, vendrá de un token JWT.
	newTask, err := ctrl.service.CreateTask(1, dto)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.APIResponse{StatusCode: http.StatusInternalServerError, Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, response.APIResponse{StatusCode: http.StatusCreated, Message: "Tarea creada.", Data: newTask})
}

func (ctrl *TaskController) GetTasksByUser(c *gin.Context) {
	// NOTA: Usamos un userID hardcodeado (1). En el futuro, vendrá de un token JWT.
	tasks, err := ctrl.service.GetTasksByUserID(1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.APIResponse{StatusCode: http.StatusInternalServerError, Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, response.APIResponse{StatusCode: http.StatusOK, Message: "Tareas del usuario.", Data: tasks})
}

func (ctrl *TaskController) GetTaskByID(c *gin.Context) {
	idParam := c.Param("id")
	taskID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.APIResponse{StatusCode: http.StatusBadRequest, Error: "ID inválido."})
		return
	}

	// NOTA: Usamos un userID hardcodeado (1).
	task, err := ctrl.service.GetTaskByID(1, uint(taskID))
	if err != nil {
		c.JSON(http.StatusNotFound, response.APIResponse{StatusCode: http.StatusNotFound, Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, response.APIResponse{StatusCode: http.StatusOK, Message: "Detalle de la tarea.", Data: task})
}

func (ctrl *TaskController) UpdateTask(c *gin.Context) {
	idParam := c.Param("id")
	taskID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.APIResponse{StatusCode: http.StatusBadRequest, Error: "ID inválido."})
		return
	}

	var dto UpdateTaskDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, response.APIResponse{StatusCode: http.StatusBadRequest, Error: err.Error()})
		return
	}

	// NOTA: Usamos un userID hardcodeado (1).
	updatedTask, err := ctrl.service.UpdateTask(1, uint(taskID), dto)
	if err != nil {
		c.JSON(http.StatusNotFound, response.APIResponse{StatusCode: http.StatusNotFound, Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, response.APIResponse{StatusCode: http.StatusOK, Message: "Tarea actualizada.", Data: updatedTask})
}

func (ctrl *TaskController) DeleteTask(c *gin.Context) {
	idParam := c.Param("id")
	taskID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.APIResponse{StatusCode: http.StatusBadRequest, Error: "ID inválido."})
		return
	}

	// NOTA: Usamos un userID hardcodeado (1).
	err = ctrl.service.DeleteTask(1, uint(taskID))
	if err != nil {
		c.JSON(http.StatusNotFound, response.APIResponse{StatusCode: http.StatusNotFound, Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, response.APIResponse{StatusCode: http.StatusOK, Message: "Tarea eliminada."})
}
