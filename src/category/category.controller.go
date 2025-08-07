package category

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CreateCategory(c *gin.Context) {
	var dto CreateCategoryDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ##########################################################################
	// ##### INICIO DE LA LÓGICA FALTANTE (SERVICIO) #####
	//
	// 1. Llamar al servicio: categoryService.Create(dto)
	// 2. El servicio debe:
	//    a. Validar que no exista otra categoría con el mismo nombre.
	//    b. Guardar la nueva categoría en la base de datos.
	// 3. Devolver la nueva categoría creada.
	//
	// ##### FIN DE LA LÓGICA FALTANTE #####
	// ##########################################################################

	c.JSON(http.StatusCreated, gin.H{"message": "Categoría creada exitosamente", "data": dto})
}

func GetCategories(c *gin.Context) {
	// ##########################################################################
	// ##### INICIO DE LA LÓGICA FALTANTE (SERVICIO) #####
	//
	// 1. Llamar al servicio: categoryService.GetAll()
	// 2. El servicio debe consultar la base de datos y traer todas las categorías.
	// 3. Devolver la lista de categorías encontradas.
	//
	// ##### FIN DE LA LÓGICA FALTANTE #####
	// ##########################################################################

	c.JSON(http.StatusOK, gin.H{"message": "Lista de categorías", "data": []string{"Ejemplo: Hogar", "Ejemplo: Trabajo"}})
}

func DeleteCategory(c *gin.Context) {
	idParam := c.Param("id")
	categoryID, err := strconv.Atoi(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// ##########################################################################
	// ##### INICIO DE LA LÓGICA FALTANTE (SERVICIO) #####
	//
	// 1. Llamar al servicio: categoryService.Delete(uint(categoryID))
	// 2. El servicio debe:
	//    a. Verificar si la categoría existe.
	//    b. Opcional: Decidir qué hacer con las tareas asociadas (moverlas, etc.).
	//    c. Eliminar la categoría de la base de datos.
	// 3. Devolver una confirmación.
	//
	// ##### FIN DE LA LÓGICA FALTANTE #####
	// ##########################################################################

	c.JSON(http.StatusOK, gin.H{"message": "Categoría " + strconv.Itoa(categoryID) + " eliminada"})
}
