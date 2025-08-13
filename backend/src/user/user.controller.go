package user

import (
	"fmt"
	"net/http"
	"path/filepath"
	"time"
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
	username := c.PostForm("username")
	password := c.PostForm("password")

	if username == "" || password == "" {
		c.JSON(http.StatusBadRequest, response.APIResponse{StatusCode: http.StatusBadRequest, Error: "El usuario y la contraseña son requeridos."})
		return
	}

	var profileImgPath string
	file, err := c.FormFile("profile_img")

	if err == nil {
		extension := filepath.Ext(file.Filename)
		newFileName := fmt.Sprintf("%d%s", time.Now().UnixNano(), extension)
		filePath := "uploads/avatars/" + newFileName

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, response.APIResponse{StatusCode: http.StatusInternalServerError, Error: "No se pudo guardar la imagen."})
			return
		}
		profileImgPath = "/" + filePath
	}

	dto := CreateUserDTO{
		Username:   username,
		Password:   password,
		ProfileImg: profileImgPath,
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
