package task

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type ITaskService interface {
	CreateTask(userID uint, dto CreateTaskDTO) (Task, error)
	GetTasksByUserID(userID uint) ([]Task, error)
	GetTaskByID(userID, taskID uint) (Task, error)
	UpdateTask(userID, taskID uint, dto UpdateTaskDTO) (Task, error)
	DeleteTask(userID, taskID uint) error
}

type taskService struct {
	repository ITaskRepository
}

func NewTaskService(repo ITaskRepository) ITaskService {
	return &taskService{
		repository: repo,
	}
}

func (s *taskService) CreateTask(userID uint, dto CreateTaskDTO) (Task, error) {
	newTask := Task{
		Text:       dto.Text,
		CreatedAt:  time.Now(),
		DueDate:    dto.DueDate,
		Status:     StatusTodo,
		UserID:     userID,
		CategoryID: dto.CategoryID,
	}
	return s.repository.Create(newTask)
}

func (s *taskService) GetTasksByUserID(userID uint) ([]Task, error) {
	return s.repository.FindAllByUserID(userID)
}

func (s *taskService) GetTaskByID(userID, taskID uint) (Task, error) {
	task, err := s.repository.FindByID(taskID)
	if err != nil {
		return Task{}, errors.New("tarea no encontrada")
	}
	if task.UserID != userID {
		return Task{}, errors.New("acceso denegado: la tarea no pertenece al usuario")
	}
	return task, nil
}

func (s *taskService) UpdateTask(userID, taskID uint, dto UpdateTaskDTO) (Task, error) {
	taskToUpdate, err := s.repository.FindByID(taskID)
	if err != nil {
		return Task{}, errors.New("tarea no encontrada")
	}
	if taskToUpdate.UserID != userID {
		return Task{}, errors.New("acceso denegado: la tarea no pertenece al usuario")
	}

	if dto.Text != nil {
		taskToUpdate.Text = *dto.Text
	}
	if dto.Status != nil {
		taskToUpdate.Status = *dto.Status
	}
	if dto.DueDate != nil {
		taskToUpdate.DueDate = dto.DueDate
	}

	return s.repository.Update(taskToUpdate)
}

func (s *taskService) DeleteTask(userID, taskID uint) error {
	taskToDelete, err := s.repository.FindByID(taskID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("tarea no encontrada")
		}
		return err
	}
	if taskToDelete.UserID != userID {
		return errors.New("acceso denegado: la tarea no pertenece al usuario")
	}
	return s.repository.Delete(taskID)
}
