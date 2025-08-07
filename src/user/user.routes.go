package user

import "github.com/gin-gonic/gin"

func RegisterUserRoutes(router *gin.RouterGroup) {
	userRoutes := router.Group("/users")
	{
		userRoutes.POST("/", CreateUser)

		userRoutes.POST("/login", Login)
	}
}
