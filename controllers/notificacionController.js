const Notificacion = require('../models/Notificacion');

class NotificacionController {
    // Obtener notificaciones del usuario autenticado
    static async getMyNotifications(req, res) {
        try {
            const usuario_id = req.user.id;
            const { limit } = req.query;

            const notificaciones = await Notificacion.findByUsuario(usuario_id, limit ? parseInt(limit) : 50);

            res.json({
                success: true,
                data: notificaciones
            });
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener notificaciones.',
                error: error.message
            });
        }
    }

    // Obtener notificaciones no leídas
    static async getUnread(req, res) {
        try {
            const usuario_id = req.user.id;
            const notificaciones = await Notificacion.findNoLeidas(usuario_id);

            res.json({
                success: true,
                data: notificaciones
            });
        } catch (error) {
            console.error('Error al obtener notificaciones no leídas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener notificaciones.',
                error: error.message
            });
        }
    }

    // Contar notificaciones no leídas
    static async countUnread(req, res) {
        try {
            const usuario_id = req.user.id;
            const count = await Notificacion.countNoLeidas(usuario_id);

            res.json({
                success: true,
                data: { count }
            });
        } catch (error) {
            console.error('Error al contar notificaciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error al contar notificaciones.',
                error: error.message
            });
        }
    }

    // Marcar notificación como leída
    static async markAsRead(req, res) {
        try {
            const { id } = req.params;

            const success = await Notificacion.markAsRead(id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Notificación no encontrada.'
                });
            }

            res.json({
                success: true,
                message: 'Notificación marcada como leída.'
            });
        } catch (error) {
            console.error('Error al marcar notificación:', error);
            res.status(500).json({
                success: false,
                message: 'Error al marcar notificación.',
                error: error.message
            });
        }
    }

    // Marcar todas las notificaciones como leídas
    static async markAllAsRead(req, res) {
        try {
            const usuario_id = req.user.id;

            const count = await Notificacion.markAllAsRead(usuario_id);

            res.json({
                success: true,
                message: 'Todas las notificaciones han sido marcadas como leídas.',
                data: { count }
            });
        } catch (error) {
            console.error('Error al marcar notificaciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error al marcar notificaciones.',
                error: error.message
            });
        }
    }

    // Eliminar notificación
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const success = await Notificacion.delete(id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Notificación no encontrada.'
                });
            }

            res.json({
                success: true,
                message: 'Notificación eliminada exitosamente.'
            });
        } catch (error) {
            console.error('Error al eliminar notificación:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar notificación.',
                error: error.message
            });
        }
    }
}

module.exports = NotificacionController;
