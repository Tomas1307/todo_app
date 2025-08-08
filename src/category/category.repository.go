// src/category/repository.go

package category

import (
	"errors"

	"gorm.io/gorm"
)

// ICategoryRepository define la interfaz para la persistencia de datos de categorías.
type ICategoryRepository interface {
	Create(category Category) (Category, error)
	FindAll() ([]Category, error)
	Delete(id uint) error
}

// categoryRepository es la implementación de la interfaz.
type categoryRepository struct {
	db *gorm.DB
}

// NewCategoryRepository es el constructor del repositorio.
func NewCategoryRepository(db *gorm.DB) ICategoryRepository {
	return &categoryRepository{db: db}
}

// Create guarda una nueva categoría en la base de datos.
func (r *categoryRepository) Create(category Category) (Category, error) {
	// GORM se encarga de la consulta "INSERT INTO categories..."
	// y automáticamente rellena el campo ID en la struct 'category'
	// con el ID generado por la base de datos.
	result := r.db.Create(&category)
	return category, result.Error
}

// FindAll devuelve todas las categorías de la base de datos.
func (r *categoryRepository) FindAll() ([]Category, error) {
	var categories []Category
	// GORM se encarga de la consulta "SELECT * FROM categories;"
	err := r.db.Find(&categories).Error
	return categories, err
}

// Delete elimina una categoría por su ID.
func (r *categoryRepository) Delete(id uint) error {
	// GORM busca un registro con ese ID y lo elimina.
	result := r.db.Delete(&Category{}, id)

	// Verificamos si se eliminó alguna fila. Si no, significa que no se encontró.
	if result.RowsAffected == 0 {
		return errors.New("categoría no encontrada")
	}

	return result.Error
}
