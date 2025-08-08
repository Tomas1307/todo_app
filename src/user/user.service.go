// src/user/service.go

package user

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	// Asumimos que aquí iría una librería para JWT
)

// IUserService no cambia.
type IUserService interface {
	CreateUser(dto CreateUserDTO) (User, error)
	Login(dto LoginDTO) (string, error)
}

// La struct ahora depende del repositorio.
type userService struct {
	repository IUserRepository
}

// El constructor ahora recibe el repositorio.
func NewUserService(repo IUserRepository) IUserService {
	return &userService{
		repository: repo,
	}
}

func (s *userService) CreateUser(dto CreateUserDTO) (User, error) {
	// 1. Hashear la contraseña.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return User{}, errors.New("error al hashear la contraseña")
	}

	// 2. Crear la entidad.
	newUser := User{
		Username:   dto.Username,
		Password:   string(hashedPassword),
		ProfileImg: dto.ProfileImg,
	}

	// 3. Llamar al repositorio para guardar en la BD.
	return s.repository.Create(newUser)
}

func (s *userService) Login(dto LoginDTO) (string, error) {
	// 1. Buscar al usuario por 'username' usando el repositorio.
	foundUser, err := s.repository.FindByUsername(dto.Username)
	if err != nil {
		// Verificamos si el error es específicamente "registro no encontrado".
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// El usuario no existe.
			return "", errors.New("credenciales o usuario invalido") // Mantenemos el mensaje genérico por seguridad
		}
		// Si es otro tipo de error de la base de datos.
		return "", errors.New("error interno al verificar el usuario")
	}

	// 2. Comparar la contraseña del DTO con la hasheada de la BD.
	err = bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(dto.Password))
	if err != nil {
		// Si las contraseñas no coinciden, bcrypt devuelve un error.
		return "", errors.New("credenciales inválidas")
	}

	// 3. Si todo es correcto, generar un token JWT.
	token := "este.es.un.token.jwt.real.para." + foundUser.Username

	return token, nil
}
