package user

type CreateUserDTO struct {
	Username   string `json:"username" binding:"required"`
	Password   string `json:"password" binding:"required"`
	ProfileImg string `json:"profile_img,omitempty"`
}

type LoginDTO struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}
