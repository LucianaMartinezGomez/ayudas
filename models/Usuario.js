const { promisePool } = require('../config/database');

class Usuario {
    // Crear nuevo usuario
    static async create(userData) {
        const { nombre, apellido, email, password, rol, celula_id } = userData;
        const [result] = await promisePool.execute(
            'INSERT INTO usuarios (nombre, apellido, email, password, rol, celula_id) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, apellido, email, password, rol || 'estudiante', celula_id || null]
        );
        return result.insertId;
    }

    // Buscar usuario por email
    static async findByEmail(email) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    // Buscar usuario por ID
    static async findById(id) {
        const [rows] = await promisePool.execute(
            'SELECT id, nombre, apellido, email, rol, celula_id, activo, fecha_creacion FROM usuarios WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Obtener todos los usuarios
    static async findAll() {
        const [rows] = await promisePool.execute(
            'SELECT id, nombre, apellido, email, rol, celula_id, activo, fecha_creacion FROM usuarios WHERE activo = TRUE'
        );
        return rows;
    }

    // Obtener usuarios por rol
    static async findByRole(rol) {
        const [rows] = await promisePool.execute(
            'SELECT id, nombre, apellido, email, rol, celula_id, activo, fecha_creacion FROM usuarios WHERE rol = ? AND activo = TRUE',
            [rol]
        );
        return rows;
    }

    // Obtener usuarios de una célula
    static async findByCelula(celula_id) {
        const [rows] = await promisePool.execute(
            'SELECT id, nombre, apellido, email, rol, celula_id, activo FROM usuarios WHERE celula_id = ? AND activo = TRUE',
            [celula_id]
        );
        return rows;
    }

    // Actualizar usuario
    static async update(id, userData) {
        const { nombre, apellido, email, rol, celula_id, activo } = userData;
        const [result] = await promisePool.execute(
            'UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, rol = ?, celula_id = ?, activo = ? WHERE id = ?',
            [nombre, apellido, email, rol, celula_id, activo, id]
        );
        return result.affectedRows > 0;
    }

    // Actualizar contraseña
    static async updatePassword(id, newPassword) {
        const [result] = await promisePool.execute(
            'UPDATE usuarios SET password = ? WHERE id = ?',
            [newPassword, id]
        );
        return result.affectedRows > 0;
    }

    // Asignar célula a usuario
    static async assignCelula(id, celula_id) {
        const [result] = await promisePool.execute(
            'UPDATE usuarios SET celula_id = ? WHERE id = ?',
            [celula_id, id]
        );
        return result.affectedRows > 0;
    }

    // Desactivar usuario
    static async deactivate(id) {
        const [result] = await promisePool.execute(
            'UPDATE usuarios SET activo = FALSE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar usuario
    static async delete(id) {
        const [result] = await promisePool.execute(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Usuario;
