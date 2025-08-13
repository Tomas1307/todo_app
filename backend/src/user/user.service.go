package user

import (
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type IUserService interface {
	CreateUser(dto CreateUserDTO) (User, error)
	Login(dto LoginDTO) (string, error)
}

type userService struct {
	repository IUserRepository
}

func NewUserService(repo IUserRepository) IUserService {
	return &userService{
		repository: repo,
	}
}

func (s *userService) CreateUser(dto CreateUserDTO) (User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return User{}, errors.New("error al hashear la contraseña")
	}

	newUser := User{
		Username:   dto.Username,
		Password:   string(hashedPassword),
		ProfileImg: dto.ProfileImg,
	}

	if newUser.ProfileImg == "" {
		newUser.ProfileImg = "/static/avatars/default.png"
	}

	return s.repository.Create(newUser)
}

func (s *userService) Login(dto LoginDTO) (string, error) {
	foundUser, err := s.repository.FindByUsername(dto.Username)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return "", errors.New("credenciales o usuario invalido")
		}
		return "", errors.New("error interno al verificar el usuario")
	}

	err = bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(dto.Password))
	if err != nil {
		return "", errors.New("credenciales inválidas")
	}

	claims := jwt.MapClaims{
		"userID":   foundUser.ID,
		"username": foundUser.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", errors.New("no se pudo firmar el token")
	}

	return tokenString, nil
}
