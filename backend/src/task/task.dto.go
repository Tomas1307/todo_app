package task

import (
	"time"
)

type CreateTaskDTO struct {
	Text       string     `json:"text" binding:"required"`
	DueDate    *time.Time `json:"due_date,omitempty"`
	CategoryID uint       `json:"category_id" binding:"required"`
}

type UpdateTaskDTO struct {
	Text    *string     `json:"text"`
	DueDate *time.Time  `json:"due_date"`
	Status  *TaskStatus `json:"status"`
}
