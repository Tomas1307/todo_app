package category

import "github.com/gin-gonic/gin"

func RegisterCategoryRoutes(router *gin.RouterGroup, ctrl *CategoryController) {
	categoryRoutes := router.Group("/categories")
	{
		categoryRoutes.POST("/", ctrl.CreateCategory)
		categoryRoutes.GET("/", ctrl.GetCategories)
		categoryRoutes.DELETE("/:id", ctrl.DeleteCategory)
	}
}
