package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
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

	// Configuración CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:4200"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	router.Static("/uploads", "./uploads")

	// Rutas principales (sin /api/v1)
	router.POST("/login", userController.Login)
	router.POST("/users", userController.CreateUser)

	// Grupo de rutas protegidas
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
