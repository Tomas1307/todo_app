// src/category/controller.go

package category

import (
	"net/http"
	"strconv"
	"todo_app/src/common/response"

	"github.com/gin-gonic/gin"
)

type CategoryController struct {
	service ICategoryService
}

func NewCategoryController(service ICategoryService) *CategoryController {
	return &CategoryController{
		service: service,
	}
}

func (ctrl *CategoryController) CreateCategory(c *gin.Context) {
	var dto CreateCategoryDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, response.APIResponse{
			StatusCode: http.StatusBadRequest,
			Message:    "Cuerpo de la petición inválido.",
			Error:      err.Error(),
		})
		return
	}

	newCategory, err := ctrl.service.CreateCategory(dto)
	if err != nil {
		c.JSON(http.StatusConflict, response.APIResponse{
			StatusCode: http.StatusConflict,
			Message:    "Error al crear la categoría.",
			Error:      err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, response.APIResponse{
		StatusCode: http.StatusCreated,
		Message:    "Categoría creada exitosamente.",
		Data:       newCategory,
	})
}

func (ctrl *CategoryController) GetCategories(c *gin.Context) {
	categories, err := ctrl.service.GetAllCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, response.APIResponse{
			StatusCode: http.StatusInternalServerError,
			Message:    "Error al obtener las categorías.",
			Error:      err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response.APIResponse{
		StatusCode: http.StatusOK,
		Message:    "Categorías obtenidas exitosamente.",
		Data:       categories,
	})
}

func (ctrl *CategoryController) DeleteCategory(c *gin.Context) {
	idParam := c.Param("id")
	categoryID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.APIResponse{
			StatusCode: http.StatusBadRequest,
			Message:    "El ID proporcionado no es válido.",
			Error:      "El ID debe ser un número entero.",
		})
		return
	}

	err = ctrl.service.DeleteCategory(uint(categoryID))
	if err != nil {
		c.JSON(http.StatusNotFound, response.APIResponse{
			StatusCode: http.StatusNotFound,
			Message:    "Error al eliminar la categoría.",
			Error:      err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, response.APIResponse{
		StatusCode: http.StatusOK,
		Message:    "Categoría eliminada exitosamente.",
	})
}
