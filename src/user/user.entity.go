package user

type User struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	Username   string `gorm:"unique;not null" json:"username"`
	Password   string `gorm:"not null" json:"-"`     // El tag json:"-" evita que este campo se exponga en las respuestas API.
	ProfileImg string `json:"profile_img,omitempty"` // omitempty hace que no aparezca en el JSON si está vacío.
}
