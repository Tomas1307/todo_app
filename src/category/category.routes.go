package category

import (
	"todo_app/src/auth"

	"github.com/gin-gonic/gin"
)

func RegisterCategoryRoutes(router *gin.RouterGroup, ctrl *CategoryController) {
	categoryRoutes := router.Group("/categories", auth.AuthMiddleware())
	{
		categoryRoutes.POST("/", ctrl.CreateCategory)
		categoryRoutes.GET("/", ctrl.GetCategories)
		categoryRoutes.DELETE("/:id", ctrl.DeleteCategory)
	}
}
