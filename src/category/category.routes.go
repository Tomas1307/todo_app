package category

import "github.com/gin-gonic/gin"

func RegisterCategoryRoutes(router *gin.RouterGroup) {
	categoryRoutes := router.Group("/categorias")
	{
		categoryRoutes.POST("/", CreateCategory)
		categoryRoutes.GET("/", GetCategories)
		categoryRoutes.DELETE("/:id", DeleteCategory)
	}
}
