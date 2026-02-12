const { promisePool } = require('../config/database');

class Clan {
    // Crear nuevo clan con 7 células automáticas (usando procedimiento almacenado)
    static async createWithCelulas(clanData) {
        const { nombre, descripcion, profesor_id, codigo_acceso } = clanData;
        const [result] = await promisePool.execute(
            'CALL crear_clan_con_celulas(?, ?, ?, ?)',
            [nombre, descripcion || null, profesor_id, codigo_acceso]
        );
        return result[0][0].clan_id;
    }

    // Crear clan simple (sin procedimiento)
    static async create(clanData) {
        const { nombre, descripcion, profesor_id, codigo_acceso } = clanData;
        const [result] = await promisePool.execute(
            'INSERT INTO clanes (nombre, descripcion, profesor_id, codigo_acceso) VALUES (?, ?, ?, ?)',
            [nombre, descripcion || null, profesor_id, codigo_acceso]
        );
        return result.insertId;
    }

    // Buscar clan por ID
    static async findById(id) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM clanes WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Buscar clan por código de acceso
    static async findByCodigoAcceso(codigo_acceso) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM clanes WHERE codigo_acceso = ?',
            [codigo_acceso]
        );
        return rows[0];
    }

    // Obtener todos los clanes
    static async findAll() {
        const [rows] = await promisePool.execute(
            'SELECT * FROM clanes WHERE activo = TRUE'
        );
        return rows;
    }

    // Obtener clanes de un profesor
    static async findByProfesor(profesor_id) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM clanes WHERE profesor_id = ? AND activo = TRUE',
            [profesor_id]
        );
        return rows;
    }

    // Obtener clan con sus células
    static async findWithCelulas(id) {
        const [clanRows] = await promisePool.execute(
            'SELECT * FROM clanes WHERE id = ?',
            [id]
        );
        
        if (clanRows.length === 0) return null;

        const [celulaRows] = await promisePool.execute(
            'SELECT * FROM celulas WHERE clan_id = ? ORDER BY numero_celula',
            [id]
        );

        return {
            ...clanRows[0],
            celulas: celulaRows
        };
    }

    // Actualizar clan
    static async update(id, clanData) {
        const { nombre, descripcion, activo } = clanData;
        const [result] = await promisePool.execute(
            'UPDATE clanes SET nombre = ?, descripcion = ?, activo = ? WHERE id = ?',
            [nombre, descripcion, activo, id]
        );
        return result.affectedRows > 0;
    }

    // Desactivar clan
    static async deactivate(id) {
        const [result] = await promisePool.execute(
            'UPDATE clanes SET activo = FALSE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar clan (y sus células en cascada)
    static async delete(id) {
        const [result] = await promisePool.execute(
            'DELETE FROM clanes WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Clan;
