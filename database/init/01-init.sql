-- 01-init.sql - Script de inicialización que crea tablas y población

-- Crear tablas primero (similar a lo que hace GORM)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_img TEXT
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    user_id BIGINT NOT NULL REFERENCES users(id),
    category_id BIGINT NOT NULL REFERENCES categories(id)
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);

-- Insertar datos solo si las tablas están vacías
DO $$
BEGIN



    -- Insertar usuarios solo si no existen
    IF (SELECT COUNT(*) FROM users) = 0 THEN
        INSERT INTO users (username, password, profile_img) VALUES 
        ('admin', '$2b$12$jRgEaZUowIGexBwD0.Jtb.T.anP7HM/mfgOygFT2yYIUlDrtKjxmS', NULL),
        ('juan_perez', '$2b$12$jRgEaZUowIGexBwD0.Jtb.T.anP7HM/mfgOygFT2yYIUlDrtKjxmS', NULL),
        ('maria_garcia', '$2b$12$jRgEaZUowIGexBwD0.Jtb.T.anP7HM/mfgOygFT2yYIUlDrtKjxmS', NULL),
        ('test_user', '$2b$12$jRgEaZUowIGexBwD0.Jtb.T.anP7HM/mfgOygFT2yYIUlDrtKjxmS', NULL);

        RAISE NOTICE 'Usuarios insertados correctamente';
    END IF;
    
    -- Insertar categorías solo si no existen
    IF (SELECT COUNT(*) FROM categories) = 0 THEN
        INSERT INTO categories (name, description) VALUES 
        ('Trabajo', 'Tareas relacionadas con el trabajo'),
        ('Personal', 'Tareas personales y del hogar'),
        ('Estudio', 'Tareas de aprendizaje y formación'),
        ('Salud', 'Ejercicio y citas médicas'),
        ('Compras', 'Lista de compras y mandados'),
        ('Proyectos', 'Proyectos personales y desarrollo');
        
        RAISE NOTICE 'Categorías insertadas correctamente';
    END IF;
    
    -- Insertar tareas solo si no existen
    IF (SELECT COUNT(*) FROM tasks) = 0 THEN
        INSERT INTO tasks (text, created_at, due_date, status, user_id, category_id) VALUES 
        ('Configurar servidor de producción', NOW(), '2025-08-25 17:00:00', 'pending', 1, 1),
        ('Revisar código del equipo', NOW(), '2025-08-20 14:00:00', 'in_progress', 1, 1),
        ('Documentar API REST', NOW(), '2025-08-22 16:00:00', 'pending', 1, 6),
        ('Terminar informe mensual', NOW(), '2025-08-20 17:00:00', 'pending', 2, 1),
        ('Reunión con cliente XYZ', NOW(), '2025-08-18 14:00:00', 'pending', 2, 1),
        ('Estudiar Docker y Kubernetes', NOW(), '2025-08-19 20:00:00', 'in_progress', 2, 3),
        ('Comprar víveres para la semana', NOW(), '2025-08-16 18:00:00', 'completed', 2, 5),
        ('Cita con el dentista', NOW(), '2025-08-19 09:00:00', 'pending', 3, 4),
        ('Ejercicio matutino - Correr', NOW(), '2025-08-17 07:00:00', 'completed', 3, 4),
        ('Organizar documentos importantes', NOW(), '2025-08-21 15:00:00', 'pending', 3, 2),
        ('Aprender PostgreSQL avanzado', NOW(), '2025-08-24 19:00:00', 'pending', 3, 3),
        ('Probar API de TODO', NOW(), '2025-08-18 12:00:00', 'in_progress', 4, 6),
        ('Crear presentación del proyecto', NOW(), '2025-08-23 16:00:00', 'pending', 4, 1);
        
        RAISE NOTICE 'Tareas insertadas correctamente';
    END IF;
    
END $$;