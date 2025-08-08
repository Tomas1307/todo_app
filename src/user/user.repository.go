package user

import (
	"gorm.io/gorm"
)

type IUserRepository interface {
	Create(user User) (User, error)
	FindByUsername(username string) (User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) IUserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user User) (User, error) {
	result := r.db.Create(&user)
	return user, result.Error
}

func (r *userRepository) FindByUsername(username string) (User, error) {
	var user User
	result := r.db.Where("username = ?", username).First(&user)
	return user, result.Error
}
