const { promisePool } = require('../config/database');

class Notificacion {
    // Crear nueva notificación
    static async create(notificacionData) {
        const { usuario_id, tipo, titulo, mensaje, url_referencia } = notificacionData;
        const [result] = await promisePool.execute(
            'INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, url_referencia) VALUES (?, ?, ?, ?, ?)',
            [usuario_id, tipo, titulo, mensaje, url_referencia || null]
        );
        return result.insertId;
    }

    // Buscar notificación por ID
    static async findById(id) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM notificaciones WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    // Obtener notificaciones de un usuario
    static async findByUsuario(usuario_id, limit = 50) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM notificaciones WHERE usuario_id = ? ORDER BY fecha_creacion DESC LIMIT ?',
            [usuario_id, limit]
        );
        return rows;
    }

    // Obtener notificaciones no leídas de un usuario
    static async findNoLeidas(usuario_id) {
        const [rows] = await promisePool.execute(
            'SELECT * FROM notificaciones WHERE usuario_id = ? AND leida = FALSE ORDER BY fecha_creacion DESC',
            [usuario_id]
        );
        return rows;
    }

    // Contar notificaciones no leídas
    static async countNoLeidas(usuario_id) {
        const [rows] = await promisePool.execute(
            'SELECT COUNT(*) as count FROM notificaciones WHERE usuario_id = ? AND leida = FALSE',
            [usuario_id]
        );
        return rows[0].count;
    }

    // Marcar notificación como leída
    static async markAsRead(id) {
        const [result] = await promisePool.execute(
            'UPDATE notificaciones SET leida = TRUE WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    // Marcar todas las notificaciones de un usuario como leídas
    static async markAllAsRead(usuario_id) {
        const [result] = await promisePool.execute(
            'UPDATE notificaciones SET leida = TRUE WHERE usuario_id = ? AND leida = FALSE',
            [usuario_id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar notificación
    static async delete(id) {
        const [result] = await promisePool.execute(
            'DELETE FROM notificaciones WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    // Eliminar notificaciones antiguas (más de 30 días)
    static async deleteOld(dias = 30) {
        const [result] = await promisePool.execute(
            'DELETE FROM notificaciones WHERE fecha_creacion < DATE_SUB(NOW(), INTERVAL ? DAY)',
            [dias]
        );
        return result.affectedRows;
    }

    // Crear notificación para todos los miembros de una célula
    static async createForCelula(celula_id, notificacionData) {
        const { tipo, titulo, mensaje, url_referencia } = notificacionData;
        
        // Obtener todos los usuarios de la célula
        const [usuarios] = await promisePool.execute(
            'SELECT id FROM usuarios WHERE celula_id = ? AND activo = TRUE',
            [celula_id]
        );

        // Crear notificación para cada usuario
        const promises = usuarios.map(usuario => 
            this.create({
                usuario_id: usuario.id,
                tipo,
                titulo,
                mensaje,
                url_referencia
            })
        );

        await Promise.all(promises);
        return usuarios.length;
    }
}

module.exports = Notificacion;
