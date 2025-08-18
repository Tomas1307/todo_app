package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"todo_app/src/category"
	"todo_app/src/config/database"
	"todo_app/src/task"
	"todo_app/src/user"
)

func main() {
	db := database.ConnectDB()
	database.MigrateTables(db)

	categoryRepo := category.NewCategoryRepository(db)
	categoryService := category.NewCategoryService(categoryRepo)
	categoryController := category.NewCategoryController(categoryService)

	taskRepo := task.NewTaskRepository(db)
	taskService := task.NewTaskService(taskRepo)
	taskController := task.NewTaskController(taskService)

	userRepo := user.NewUserRepository(db)
	userService := user.NewUserService(userRepo)
	userController := user.NewUserController(userService)

	router := gin.Default()

	// Configurar CORS middleware
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		c.Header("Access-Control-Expose-Headers", "Content-Length")
		c.Header("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	router.Static("/uploads", "./uploads")

	apiV1 := router.Group("/api/v1")
	{
		log.Println("Registrando rutas de categoría...")
		category.RegisterCategoryRoutes(apiV1, categoryController)

		log.Println("Registrando rutas de tarea...")
		task.RegisterTaskRoutes(apiV1, taskController)

		log.Println("Registrando rutas de usuario...")
		user.RegisterUserRoutes(apiV1, userController)
	}

	log.Println("Servidor iniciado en http://localhost:8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}
}
