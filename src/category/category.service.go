package category

import "errors"

// ICategoryService define la interfaz para el servicio de categorías.
type ICategoryService interface {
	CreateCategory(dto CreateCategoryDTO) (Category, error)
	GetAllCategories() ([]Category, error)
	DeleteCategory(id uint) error
}

// categoryService es la implementación de ICategoryService.
type categoryService struct {
	// Aquí iría el repositorio cuando lo creemos.
	// repository ICategoryRepository
}

// NewCategoryService es el constructor para categoryService.
func NewCategoryService() ICategoryService {
	return &categoryService{}
}

func (s *categoryService) CreateCategory(dto CreateCategoryDTO) (Category, error) {
	// Lógica de negocio:
	// 1. Validar que no exista una categoría con el mismo nombre (usando el repositorio).
	// 2. Crear la entidad a partir del DTO.
	// 3. Guardar en la base de datos (usando el repositorio).

	// Simulación:
	if dto.Name == "error" {
		return Category{}, errors.New("nombre de categoría ya existe")
	}

	newCategory := Category{
		ID:          1, // El ID sería generado por la BD.
		Name:        dto.Name,
		Description: dto.Description,
	}

	return newCategory, nil
}

func (s *categoryService) GetAllCategories() ([]Category, error) {
	// Lógica de negocio:
	// 1. Llamar al repositorio para obtener todas las categorías.

	// Simulación:
	return []Category{
		{ID: 1, Name: "Hogar"},
		{ID: 2, Name: "Trabajo"},
	}, nil
}

func (s *categoryService) DeleteCategory(id uint) error {
	// Lógica de negocio:
	// 1. Llamar al repositorio para eliminar la categoría por ID.
	// 2. Manejar el caso en que el ID no exista.

	// Simulación:
	if id == 0 {
		return errors.New("categoría no encontrada")
	}
	return nil // Retorna nil si la eliminación fue exitosa.
}
