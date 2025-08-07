package task

import "github.com/gin-gonic/gin"

func RegisterTaskRoutes(router *gin.RouterGroup, ctrl *TaskController) {
	taskRoutes := router.Group("/tasks")
	{
		taskRoutes.POST("/", ctrl.CreateTask)
		taskRoutes.GET("/user", ctrl.GetTasksByUser)
		taskRoutes.GET("/:id", ctrl.GetTaskByID)
		taskRoutes.PUT("/:id", ctrl.UpdateTask)
		taskRoutes.DELETE("/:id", ctrl.DeleteTask)
	}
}
