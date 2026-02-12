const { promisePool } = require('../config/database');

class Celula {
    // Crear nueva célula
    static async create(celulaData) {
        const { nombre, descripcion, clan_id, lider_id, codigo_acceso, numero_celula } = celulaData;
        const [result] = await promisePool.execute(
            'INSERT INTO celulas (nombre, descripcion, clan_id, lider_id, codigo_acceso, numero_celula) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, descripcion || null, clan_id, lider_id || null, codigo_acceso, numero_celula]
        );
        return result.insertId;
    }

    // Buscar célula por ID
    static async findById(id) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM celulas WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Buscar célula por código de acceso
    static async findByCodigoAcceso(codigo_acceso) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM celulas WHERE codigo_acceso = ?',
            [codigo_acceso]
        );
        return rows[0];
    }

    // Obtener todas las células
    static async findAll() {
        const [rows] = await promisePool.execute(
            'SELECT * FROM celulas WHERE activo = TRUE'
        );
        return rows;
    }

    // Obtener células de un clan
    static async findByClan(clan_id) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM celulas WHERE clan_id = ? AND activo = TRUE ORDER BY numero_celula',
            [clan_id]
        );
        return rows;
    }

    // Obtener célula con sus miembros
    static async findWithMiembros(id) {
        const [celulaRows] = await promisePool.execute(
            'SELECT * FROM celulas WHERE id = ?',
            [id]
        );
        
        if (celulaRows.length === 0) return null;

        const [miembroRows] = await promisePool.execute(
            'SELECT id, nombre, apellido, email, rol FROM usuarios WHERE celula_id = ? AND activo = TRUE',
            [id]
        );

        return {
            ...celulaRows[0],
            miembros: miembroRows
        };
    }

    // Obtener información completa de célula (usando vista)
    static async findInfoById(id) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM vista_celulas_info WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Asignar líder a célula
    static async assignLider(id, lider_id) {
        const [result] = await promisePool.execute(
            'UPDATE celulas SET lider_id = ? WHERE id = ?',
            [lider_id, id]
        );
        return result.affectedRows > 0;
    }

    // Actualizar célula
    static async update(id, celulaData) {
        const { nombre, descripcion, lider_id, activo } = celulaData;
        const [result] = await promisePool.execute(
            'UPDATE celulas SET nombre = ?, descripcion = ?, lider_id = ?, activo = ? WHERE id = ?',
            [nombre, descripcion, lider_id, activo, id]
        );
        return result.affectedRows > 0;
    }

    // Obtener estadísticas de tareas de la célula
    static async getTaskStats(id) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM vista_tareas_celula WHERE celula_id = ?',
            [id]
        );
        return rows[0];
    }

    // Desactivar célula
    static async deactivate(id) {
        const [result] = await promisePool.execute(
            'UPDATE celulas SET activo = FALSE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar célula
    static async delete(id) {
        const [result] = await promisePool.execute(
            'DELETE FROM celulas WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Celula;
