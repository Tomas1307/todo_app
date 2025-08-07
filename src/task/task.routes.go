// src/task/routes.go

package task

import "github.com/gin-gonic/gin"

func RegisterTaskRoutes(router *gin.RouterGroup) {
	taskRoutes := router.Group("/tasks")
	{
		taskRoutes.POST("/", CreateTask)
		taskRoutes.GET("/user", GetTasksByUser)
		taskRoutes.GET("/:id", GetTaskByID)
		taskRoutes.PUT("/:id", UpdateTask)
		taskRoutes.DELETE("/:id", DeleteTask)
	}
}
