// src/user/service.go

package user

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
)

// IUserService define la interfaz para el servicio de usuarios.
type IUserService interface {
	CreateUser(dto CreateUserDTO) (User, error)
	Login(dto LoginDTO) (string, error) // Devuelve un token (string) o un error
}

// userService es la implementación de IUserService.
type userService struct {
	// repository IUserRepository
}

// NewUserService es el constructor.
func NewUserService() IUserService {
	return &userService{}
}

func (s *userService) CreateUser(dto CreateUserDTO) (User, error) {
	// Lógica de negocio real:
	// 1. Hashear la contraseña antes de guardarla.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return User{}, errors.New("error al hashear la contraseña")
	}

	// 2. Crear la entidad User.
	newUser := User{
		ID:         1, // ID sería generado por la BD.
		Username:   dto.Username,
		Password:   string(hashedPassword),
		ProfileImg: dto.ProfileImg,
	}

	// 3. Guardar en la BD a través del repositorio.
	// Simulación:
	if dto.Username == "error" {
		return User{}, errors.New("el nombre de usuario ya existe")
	}

	return newUser, nil
}

func (s *userService) Login(dto LoginDTO) (string, error) {
	// Simulación: En un caso real, buscaríamos el usuario en la BD.
	// Aquí, solo verificamos si las credenciales coinciden con un usuario de prueba.
	if dto.Username == "testuser" && dto.Password == "password123" {
		// Si coinciden, generar un token falso.
		token := "este.es.un.token.jwt.de.simulacion.para.testuser"
		return token, nil
	}

	// Si no coinciden, devolver un error.
	return "", errors.New("credenciales inválidas")
}
