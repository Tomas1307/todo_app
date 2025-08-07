// src/user/controller.go

package user

import (
	"net/http"
	"todo_app/src/common/response"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	service IUserService
}

func NewUserController(service IUserService) *UserController {
	return &UserController{
		service: service,
	}
}

func (ctrl *UserController) CreateUser(c *gin.Context) {
	var dto CreateUserDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, response.APIResponse{StatusCode: http.StatusBadRequest, Error: err.Error()})
		return
	}

	newUser, err := ctrl.service.CreateUser(dto)
	if err != nil {
		c.JSON(http.StatusConflict, response.APIResponse{StatusCode: http.StatusConflict, Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, response.APIResponse{StatusCode: http.StatusCreated, Message: "Usuario creado.", Data: newUser})
}

func (ctrl *UserController) Login(c *gin.Context) {
	var dto LoginDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, response.APIResponse{StatusCode: http.StatusBadRequest, Error: err.Error()})
		return
	}

	token, err := ctrl.service.Login(dto)
	if err != nil {
		c.JSON(http.StatusUnauthorized, response.APIResponse{StatusCode: http.StatusUnauthorized, Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, response.APIResponse{StatusCode: http.StatusOK, Message: "Inicio de sesión exitoso.", Data: gin.H{"token": token}})
}
