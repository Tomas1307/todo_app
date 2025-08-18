-- seed.sql - Poblar base de datos TODO App

-- Limpiar datos existentes (opcional)
TRUNCATE TABLE tasks, categories, users RESTART IDENTITY CASCADE;

-- Insertar usuarios (sin encriptar las contraseñas para pruebas)
INSERT INTO users (username, password, profile_img) VALUES 
('admin', '123456', NULL),
('juan_perez', '123456', NULL),
('maria_garcia', '123456', NULL),
('test_user', '123456', NULL);

-- Insertar categorías
INSERT INTO categories (name, description) VALUES 
('Trabajo', 'Tareas relacionadas con el trabajo'),
('Personal', 'Tareas personales y del hogar'),
('Estudio', 'Tareas de aprendizaje y formación'),
('Salud', 'Ejercicio y citas médicas'),
('Compras', 'Lista de compras y mandados'),
('Proyectos', 'Proyectos personales y desarrollo');

-- Insertar tareas de ejemplo
INSERT INTO tasks (text, created_at, due_date, status, user_id, category_id) VALUES 
-- Tareas del admin (user_id = 1)
('Configurar servidor de producción', NOW(), '2025-08-25 17:00:00', 'pending', 1, 1),
('Revisar código del equipo', NOW(), '2025-08-20 14:00:00', 'in_progress', 1, 1),
('Documentar API REST', NOW(), '2025-08-22 16:00:00', 'pending', 1, 6),

-- Tareas de Juan (user_id = 2)
('Terminar informe mensual', NOW(), '2025-08-20 17:00:00', 'pending', 2, 1),
('Reunión con cliente XYZ', NOW(), '2025-08-18 14:00:00', 'pending', 2, 1),
('Estudiar Docker y Kubernetes', NOW(), '2025-08-19 20:00:00', 'in_progress', 2, 3),
('Comprar víveres para la semana', NOW(), '2025-08-16 18:00:00', 'completed', 2, 5),

-- Tareas de María (user_id = 3)
('Cita con el dentista', NOW(), '2025-08-19 09:00:00', 'pending', 3, 4),
('Ejercicio matutino - Correr', NOW(), '2025-08-17 07:00:00', 'completed', 3, 4),
('Organizar documentos importantes', NOW(), '2025-08-21 15:00:00', 'pending', 3, 2),
('Aprender PostgreSQL avanzado', NOW(), '2025-08-24 19:00:00', 'pending', 3, 3),

-- Tareas del test_user (user_id = 4)
('Probar API de TODO', NOW(), '2025-08-18 12:00:00', 'in_progress', 4, 6),
('Crear presentación del proyecto', NOW(), '2025-08-23 16:00:00', 'pending', 4, 1);