package task

import (
	"errors"
	"time"
)

// ITaskService define la interfaz para el servicio de tareas.
type ITaskService interface {
	CreateTask(userID uint, dto CreateTaskDTO) (Task, error)
	GetTasksByUserID(userID uint) ([]Task, error)
	GetTaskByID(userID, taskID uint) (Task, error)
	UpdateTask(userID, taskID uint, dto UpdateTaskDTO) (Task, error)
	DeleteTask(userID, taskID uint) error
}

// taskService es la implementación de ITaskService.
type taskService struct {
	// Aquí irá el repositorio cuando lo creemos.
	// repository ITaskRepository
}

// NewTaskService es el constructor para nuestro servicio.
func NewTaskService() ITaskService {
	return &taskService{}
}

func (s *taskService) CreateTask(userID uint, dto CreateTaskDTO) (Task, error) {
	// Lógica de negocio real:
	// 1. Validar que la CategoryID que viene en el DTO exista.
	// 2. Crear la entidad Task con el UserID y los datos del DTO.
	// 3. Guardar en la base de datos a través del repositorio.
	// Simulación:
	newTask := Task{
		ID:         101, // ID sería generado por la BD.
		Text:       dto.Text,
		CreatedAt:  time.Now(),
		DueDate:    dto.DueDate,
		Status:     StatusTodo, // Estado por defecto
		UserID:     userID,
		CategoryID: dto.CategoryID,
	}
	return newTask, nil
}

func (s *taskService) GetTasksByUserID(userID uint) ([]Task, error) {
	// Lógica de negocio real: Llamar al repositorio para buscar tareas por UserID.
	// Simulación:
	return []Task{
		{ID: 101, Text: "Tarea de prueba 1 del usuario", UserID: userID, CategoryID: 1, Status: StatusTodo},
		{ID: 102, Text: "Tarea de prueba 2 del usuario", UserID: userID, CategoryID: 2, Status: StatusInProgress},
	}, nil
}

func (s *taskService) GetTaskByID(userID, taskID uint) (Task, error) {
	// Lógica de negocio real:
	// 1. Buscar la tarea por su ID en el repositorio.
	// 2. MUY IMPORTANTE: Verificar que la tarea encontrada pertenezca al userID.
	// Simulación:
	if taskID == 0 {
		return Task{}, errors.New("tarea no encontrada")
	}
	// Simulamos que la tarea pertenece al usuario
	return Task{ID: taskID, Text: "Detalle de tarea de prueba", UserID: userID, CategoryID: 1}, nil
}

func (s *taskService) UpdateTask(userID, taskID uint, dto UpdateTaskDTO) (Task, error) {
	// Lógica de negocio real: Buscar, verificar pertenencia, aplicar cambios y guardar.
	// Simulación:
	updatedTask := Task{
		ID:     taskID,
		Text:   "Texto original",
		Status: StatusTodo,
		UserID: userID,
	}
	if dto.Text != nil {
		updatedTask.Text = *dto.Text
	}
	if dto.Status != nil {
		updatedTask.Status = *dto.Status
	}
	return updatedTask, nil
}

func (s *taskService) DeleteTask(userID, taskID uint) error {
	// Lógica de negocio real: Buscar, verificar pertenencia y eliminar.
	// Simulación:
	if taskID == 0 {
		return errors.New("tarea no encontrada")
	}
	return nil
}
