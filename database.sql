-- ================================================
-- Base de Datos: Sistema de Gestión de Tareas
-- Aplicación de Estudio con Clanes y Células
-- ================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS ayudas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ayudas_db;

-- ================================================
-- Tabla: usuarios
-- Descripción: Almacena información de todos los usuarios del sistema
-- ================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'lider', 'estudiante') NOT NULL DEFAULT 'estudiante',
    celula_id INT DEFAULT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_celula_id (celula_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: clanes
-- Descripción: Representa grupos principales creados por profesores
-- ================================================
CREATE TABLE IF NOT EXISTS clanes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    profesor_id INT NOT NULL,
    codigo_acceso VARCHAR(50) UNIQUE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (profesor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_profesor_id (profesor_id),
    INDEX idx_codigo_acceso (codigo_acceso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: celulas
-- Descripción: Subgrupos dentro de cada clan (7 células por clan)
-- ================================================
CREATE TABLE IF NOT EXISTS celulas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    clan_id INT NOT NULL,
    lider_id INT DEFAULT NULL,
    codigo_acceso VARCHAR(50) UNIQUE NOT NULL,
    numero_celula INT NOT NULL CHECK (numero_celula BETWEEN 1 AND 7),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (clan_id) REFERENCES clanes(id) ON DELETE CASCADE,
    FOREIGN KEY (lider_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    UNIQUE KEY unique_clan_numero (clan_id, numero_celula),
    INDEX idx_clan_id (clan_id),
    INDEX idx_lider_id (lider_id),
    INDEX idx_codigo_acceso (codigo_acceso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar clave foránea a usuarios después de crear células
ALTER TABLE usuarios
ADD CONSTRAINT fk_usuarios_celula
FOREIGN KEY (celula_id) REFERENCES celulas(id) ON DELETE SET NULL;

-- ================================================
-- Tabla: tareas
-- Descripción: Tareas creadas por líderes para sus células
-- ================================================
CREATE TABLE IF NOT EXISTS tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    celula_id INT NOT NULL,
    creador_id INT NOT NULL,
    estado ENUM('pendiente', 'en_progreso', 'completada', 'cancelada') DEFAULT 'pendiente',
    prioridad ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media',
    fecha_inicio DATE,
    fecha_vencimiento DATE,
    fecha_completada TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (celula_id) REFERENCES celulas(id) ON DELETE CASCADE,
    FOREIGN KEY (creador_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_celula_id (celula_id),
    INDEX idx_creador_id (creador_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha_vencimiento (fecha_vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Tabla: notificaciones
-- Descripción: Sistema de notificaciones para usuarios
-- ================================================
CREATE TABLE IF NOT EXISTS notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('tarea_nueva', 'tarea_actualizada', 'tarea_vencida', 'nuevo_miembro', 'sistema') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    url_referencia VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_leida (leida),
    INDEX idx_fecha_creacion (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Datos de Ejemplo (Opcional)
-- ================================================

-- Insertar usuario administrador de ejemplo (password: admin123)
-- Nota: El password debe ser hasheado con bcrypt en la aplicación
INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES
('Admin', 'Sistema', 'admin@ayudas.com', '$2a$10$XQX9qN8hGWOJQVYjhYqL5.rKZJXYW8p5KJvZqVFqCx9qVZ8qVQXYW', 'administrador');

-- ================================================
-- Vistas Útiles
-- ================================================

-- Vista: Información completa de células con sus líderes
CREATE OR REPLACE VIEW vista_celulas_info AS
SELECT 
    c.id,
    c.nombre AS celula_nombre,
    c.numero_celula,
    c.codigo_acceso,
    cl.nombre AS clan_nombre,
    CONCAT(u.nombre, ' ', u.apellido) AS lider_nombre,
    u.email AS lider_email,
    COUNT(DISTINCT us.id) AS total_estudiantes,
    c.activo
FROM celulas c
LEFT JOIN clanes cl ON c.clan_id = cl.id
LEFT JOIN usuarios u ON c.lider_id = u.id
LEFT JOIN usuarios us ON us.celula_id = c.id AND us.rol = 'estudiante'
GROUP BY c.id;

-- Vista: Resumen de tareas por célula
CREATE OR REPLACE VIEW vista_tareas_celula AS
SELECT 
    c.id AS celula_id,
    c.nombre AS celula_nombre,
    COUNT(t.id) AS total_tareas,
    SUM(CASE WHEN t.estado = 'pendiente' THEN 1 ELSE 0 END) AS tareas_pendientes,
    SUM(CASE WHEN t.estado = 'en_progreso' THEN 1 ELSE 0 END) AS tareas_en_progreso,
    SUM(CASE WHEN t.estado = 'completada' THEN 1 ELSE 0 END) AS tareas_completadas
FROM celulas c
LEFT JOIN tareas t ON c.id = t.celula_id
GROUP BY c.id;

-- ================================================
-- Triggers
-- ================================================

-- Trigger: Actualizar fecha de completada cuando estado cambia
DELIMITER //
CREATE TRIGGER actualizar_fecha_completada
BEFORE UPDATE ON tareas
FOR EACH ROW
BEGIN
    IF NEW.estado = 'completada' AND OLD.estado != 'completada' THEN
        SET NEW.fecha_completada = CURRENT_TIMESTAMP;
    END IF;
    IF NEW.estado != 'completada' THEN
        SET NEW.fecha_completada = NULL;
    END IF;
END;//
DELIMITER ;

-- ================================================
-- Procedimientos Almacenados
-- ================================================

-- Procedimiento: Crear clan con 7 células automáticas
DELIMITER //
CREATE PROCEDURE crear_clan_con_celulas(
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_profesor_id INT,
    IN p_codigo_acceso VARCHAR(50)
)
BEGIN
    DECLARE v_clan_id INT;
    DECLARE v_contador INT DEFAULT 1;
    DECLARE v_nombre_celula VARCHAR(100);
    DECLARE v_codigo_celula VARCHAR(50);
    
    -- Insertar el clan
    INSERT INTO clanes (nombre, descripcion, profesor_id, codigo_acceso)
    VALUES (p_nombre, p_descripcion, p_profesor_id, p_codigo_acceso);
    
    SET v_clan_id = LAST_INSERT_ID();
    
    -- Crear 7 células automáticamente
    WHILE v_contador <= 7 DO
        SET v_nombre_celula = CONCAT('Célula ', v_contador);
        SET v_codigo_celula = CONCAT(p_codigo_acceso, '-C', v_contador);
        
        INSERT INTO celulas (nombre, clan_id, codigo_acceso, numero_celula)
        VALUES (v_nombre_celula, v_clan_id, v_codigo_celula, v_contador);
        
        SET v_contador = v_contador + 1;
    END WHILE;
    
    SELECT v_clan_id AS clan_id;
END;//
DELIMITER ;

-- ================================================
-- Índices adicionales para optimización
-- ================================================

-- Índice compuesto para búsquedas frecuentes
CREATE INDEX idx_usuarios_rol_activo ON usuarios(rol, activo);
CREATE INDEX idx_tareas_estado_fecha ON tareas(estado, fecha_vencimiento);

-- ================================================
-- Fin del Script
-- ================================================
