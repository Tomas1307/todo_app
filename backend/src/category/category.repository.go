package category

import (
	"errors"

	"gorm.io/gorm"
)

type ICategoryRepository interface {
	Create(category Category) (Category, error)
	FindAll() ([]Category, error)
	Delete(id uint) error
}

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) ICategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) Create(category Category) (Category, error) {

	result := r.db.Create(&category)
	return category, result.Error
}

func (r *categoryRepository) FindAll() ([]Category, error) {
	var categories []Category
	err := r.db.Find(&categories).Error
	return categories, err
}

func (r *categoryRepository) Delete(id uint) error {
	result := r.db.Delete(&Category{}, id)

	if result.RowsAffected == 0 {
		return errors.New("categoría no encontrada")
	}

	return result.Error
}
