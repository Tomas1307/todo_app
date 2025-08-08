package user

type User struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	Username   string `gorm:"unique;not null" json:"username"`
	Password   string `gorm:"not null" json:"-"`
	ProfileImg string `json:"profile_img,omitempty"`
}
