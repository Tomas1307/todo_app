package category

type Category struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `gorm:"not null;unique" json:"name"`
	Description string `json:"description,omitempty"`
}
