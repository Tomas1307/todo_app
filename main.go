// main.go

package main

import (
	"log"

	"github.com/gin-gonic/gin"

	// Importa tus módulos

	"todo_app/src/task"
	"todo_app/src/user"
)

func main() {
	// 1. Crear el enrutador de Gin
	router := gin.Default()

	// 2. Crear un grupo de rutas para la API (buena práctica para versionado)
	apiV1 := router.Group("/api/v1")
	{
		// 3. Registrar las rutas de cada módulo
		log.Println("Registrando rutas de usuario...")
		user.RegisterUserRoutes(apiV1)

		//log.Println("Registrando rutas de categoría...")
		//category.RegisterCategoryRoutes(apiV1)

		//log.Println("Registrando rutas de tarea...")
		task.RegisterTaskRoutes(apiV1)
	}

	// 4. Iniciar el servidor en el puerto 8080
	log.Println("Servidor iniciado en http://localhost:8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}
}
