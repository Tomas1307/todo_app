package task

import (
	"errors"

	"gorm.io/gorm"
)

type ITaskRepository interface {
	Create(task Task) (Task, error)
	FindAllByUserID(userID uint) ([]Task, error)
	FindByID(taskID uint) (Task, error)
	Update(task Task) (Task, error)
	Delete(taskID uint) error
}

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) ITaskRepository {
	return &taskRepository{db: db}
}

func (r *taskRepository) Create(task Task) (Task, error) {
	result := r.db.Create(&task)
	return task, result.Error
}

func (r *taskRepository) FindAllByUserID(userID uint) ([]Task, error) {
	var tasks []Task
	err := r.db.Where("user_id = ?", userID).Find(&tasks).Error
	return tasks, err
}

func (r *taskRepository) FindByID(taskID uint) (Task, error) {
	var task Task
	err := r.db.First(&task, taskID).Error
	return task, err
}

func (r *taskRepository) Update(task Task) (Task, error) {
	result := r.db.Save(&task)
	return task, result.Error
}

func (r *taskRepository) Delete(taskID uint) error {
	result := r.db.Delete(&Task{}, taskID)
	if result.RowsAffected == 0 {
		return errors.New("tarea no encontrada para eliminar")
	}
	return result.Error
}
