const { promisePool } = require('../config/database');

class Tarea {
    // Crear nueva tarea
    static async create(tareaData) {
        const { titulo, descripcion, celula_id, creador_id, estado, prioridad, fecha_inicio, fecha_vencimiento } = tareaData;
        const [result] = await promisePool.execute(
            'INSERT INTO tareas (titulo, descripcion, celula_id, creador_id, estado, prioridad, fecha_inicio, fecha_vencimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [titulo, descripcion || null, celula_id, creador_id, estado || 'pendiente', prioridad || 'media', fecha_inicio || null, fecha_vencimiento || null]
        );
        return result.insertId;
    }

    // Buscar tarea por ID
    static async findById(id) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM tareas WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Obtener todas las tareas
    static async findAll() {
        const [rows] = await promisePool.execute(
            'SELECT * FROM tareas ORDER BY fecha_creacion DESC'
        );
        return rows;
    }

    // Obtener tareas de una célula
    static async findByCelula(celula_id) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM tareas WHERE celula_id = ? ORDER BY fecha_vencimiento ASC, prioridad DESC',
            [celula_id]
        );
        return rows;
    }

    // Obtener tareas por estado
    static async findByEstado(celula_id, estado) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM tareas WHERE celula_id = ? AND estado = ? ORDER BY fecha_vencimiento ASC',
            [celula_id, estado]
        );
        return rows;
    }

    // Obtener tareas pendientes
    static async findPendientes(celula_id) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM tareas WHERE celula_id = ? AND estado IN ("pendiente", "en_progreso") ORDER BY fecha_vencimiento ASC',
            [celula_id]
        );
        return rows;
    }

    // Obtener tareas vencidas
    static async findVencidas(celula_id) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM tareas WHERE celula_id = ? AND fecha_vencimiento < CURDATE() AND estado NOT IN ("completada", "cancelada") ORDER BY fecha_vencimiento ASC',
            [celula_id]
        );
        return rows;
    }

    // Actualizar tarea
    static async update(id, tareaData) {
        const { titulo, descripcion, estado, prioridad, fecha_inicio, fecha_vencimiento } = tareaData;
        const [result] = await promisePool.execute(
            'UPDATE tareas SET titulo = ?, descripcion = ?, estado = ?, prioridad = ?, fecha_inicio = ?, fecha_vencimiento = ? WHERE id = ?',
            [titulo, descripcion, estado, prioridad, fecha_inicio, fecha_vencimiento, id]
        );
        return result.affectedRows > 0;
    }

    // Actualizar estado de tarea
    static async updateEstado(id, estado) {
        const [result] = await promisePool.execute(
            'UPDATE tareas SET estado = ? WHERE id = ?',
            [estado, id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar tarea
    static async delete(id) {
        const [result] = await promisePool.execute(
            'DELETE FROM tareas WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    // Obtener estadísticas de tareas de una célula
    static async getStats(celula_id) {
        const [rows] = await promisePool.execute(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
                SUM(CASE WHEN estado = 'en_progreso' THEN 1 ELSE 0 END) as en_progreso,
                SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as completadas,
                SUM(CASE WHEN fecha_vencimiento < CURDATE() AND estado NOT IN ('completada', 'cancelada') THEN 1 ELSE 0 END) as vencidas
            FROM tareas 
            WHERE celula_id = ?`,
            [celula_id]
        );
        return rows[0];
    }
}

module.exports = Tarea;
