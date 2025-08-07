// main.go

package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"todo_app/src/category"
	"todo_app/src/task"
	"todo_app/src/user"
)

func main() {
	router := gin.Default()
	apiV1 := router.Group("/api/v1")
	{
		// --- Conexión del Módulo de Categorías ---

		// 1. Creas la instancia del servicio
		categoryService := category.NewCategoryService()

		// 2. Creas la instancia del controlador, "inyectándole" el servicio
		categoryController := category.NewCategoryController(categoryService)

		// 3. Registras las rutas, pasándole el controlador
		category.RegisterCategoryRoutes(apiV1, categoryController)

		// (Aquí harías lo mismo para user y task)

		// 1. Creas la instancia del servicio
		taskService := task.NewTaskService()

		// 2. Creas la instancia del controlador, "inyectándole" el servicio
		taskController := task.NewTaskController(taskService)

		// 3. Registras las rutas, pasándole el controlador
		task.RegisterTaskRoutes(apiV1, taskController)

		// 1. Creas la instancia del servicio
		userService := user.NewUserService()

		// 2. Creas la instancia del controlador, "inyectándole" el servicio
		userController := user.NewUserController(userService)

		// 3. Registras las rutas, pasándole el controlador
		user.RegisterUserRoutes(apiV1, userController)
	}

	log.Println("Servidor iniciado en http://localhost:8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}
}
