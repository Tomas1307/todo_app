package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateUser maneja la petición para crear un nuevo usuario.
func CreateUser(c *gin.Context) {
	var dto CreateUserDTO

	// Vincula el JSON del cuerpo de la petición con nuestra struct DTO.
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ##########################################################################
	// ##### INICIO DE LA LÓGICA FALTANTE #####
	//
	// 1. LLAMAR AL 'SERVICIO': Aquí es donde invocarías a la capa de servicio
	//    que se encarga de la lógica de negocio.
	//
	// 2. LÓGICA DE NEGOCIO: El servicio se encargaría de:
	//    a. Hashear la contraseña (nunca se guarda texto plano).
	//    b. Crear una entidad `User` a partir del `CreateUserDTO`.
	//    c. Guardar esa entidad en la base de datos.
	//
	// 3. MANEJO DE ERRORES: El servicio podría devolver errores que debes manejar aquí.
	//    Por ejemplo, si el nombre de usuario ya existe, deberías devolver un
	//    error HTTP 409 (Conflict).
	//
	//    ej: newUser, err := userService.Create(dto)
	//    if err != nil {
	//        c.JSON(http.StatusConflict, gin.H{"error": "El usuario ya existe"})
	//        return
	//    }
	//
	// ##### FIN DE LA LÓGICA FALTANTE #####
	// ##########################################################################

	// Devuelve una respuesta exitosa con el estado 201 Created.
	// Idealmente, devolverías el usuario creado por el servicio, no el DTO original.
	c.JSON(http.StatusCreated, gin.H{
		"message": "201: User created",
		"data":    dto, // Reemplazar 'dto' con 'newUser' del servicio.
	})
}

// Login maneja la petición para el inicio de sesión.
func Login(c *gin.Context) {
	var dto LoginDTO

	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ##########################################################################
	// ##### INICIO DE LA LÓGICA FALTANTE #####
	//
	// 1. LLAMAR AL 'SERVICIO': Invocar al servicio de autenticación.
	//
	// 2. LÓGICA DE NEGOCIO: El servicio se encargaría de:
	//    a. Buscar al usuario en la base de datos por su nombre de usuario.
	//    b. Si el usuario existe, comparar la contraseña del DTO con la
	//       contraseña hasheada que está guardada.
	//    c. Si las contraseñas coinciden, generar un Token JWT (JSON Web Token).
	//
	// 3. MANEJO DE ERRORES: El servicio podría devolver errores.
	//    Por ejemplo, si el usuario no existe o la contraseña es incorrecta,
	//    deberías devolver un error HTTP 401 (Unauthorized).
	//
	//    ej: token, err := authService.Login(dto)
	//    if err != nil {
	//        c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
	//        return
	//    }
	//
	// ##### FIN DE LA LÓGICA FALTANTE #####
	// ##########################################################################

	// Si las credenciales son válidas, se genera y devuelve un token.
	c.JSON(http.StatusOK, gin.H{
		"message": "201: Login Successful",
		// Reemplazar el texto de prueba con el token real generado por el servicio.
		"token": "aqui.va.un.jwt.token.real.generado.por.el.servicio",
	})
}
