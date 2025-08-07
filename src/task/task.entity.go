package task

import "time"

type TaskStatus string

const (
	StatusTodo       TaskStatus = "Sin Empezar"
	StatusInProgress TaskStatus = "Empezada"
	StatusDone       TaskStatus = "Finalizada"
)

type Task struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	Text      string     `gorm:"not null" json:"text"`
	CreatedAt time.Time  `gorm:"autoCreateTime" json:"created_at"`
	DueDate   *time.Time `json:"due_date,omitempty"`
	Status    TaskStatus `gorm:"type:varchar(20);not null" json:"status"`

	// --- Relaciones / Claves Foráneas ---
	UserID     uint `gorm:"not null" json:"user_id"`
	CategoryID uint `gorm:"not null" json:"category_id"`
}
