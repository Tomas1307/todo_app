package user

import "github.com/gin-gonic/gin"

func RegisterUserRoutes(router *gin.RouterGroup, ctrl *UserController) {
	userRoutes := router.Group("/users")
	{
		userRoutes.POST("/", ctrl.CreateUser)

		userRoutes.POST("/login", ctrl.Login)
	}
}
