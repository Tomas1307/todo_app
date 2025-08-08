// src/auth/auth.middleware.go
package auth

import (
	"net/http"
	"os"
	"strings"

	"todo_app/src/common/response"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, response.APIResponse{
				StatusCode: http.StatusUnauthorized,
				Error:      "Cabecera de autorización no proporcionada.",
			})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, response.APIResponse{
				StatusCode: http.StatusUnauthorized,
				Error:      "Formato de cabecera de autorización inválido. Se esperaba 'Bearer {token}'.",
			})
			return
		}

		tokenString := parts[1]
		secret := []byte(os.Getenv("JWT_SECRET"))

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return secret, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, response.APIResponse{
				StatusCode: http.StatusUnauthorized,
				Error:      "Token inválido o expirado.",
			})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, response.APIResponse{
				StatusCode: http.StatusUnauthorized,
				Error:      "No se pudieron leer los claims del token.",
			})
			return
		}

		userID := uint(claims["userID"].(float64))
		c.Set("userID", userID)

		c.Next()
	}
}
