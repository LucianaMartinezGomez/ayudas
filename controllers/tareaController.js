const Tarea = require('../models/Tarea');
const Notificacion = require('../models/Notificacion');

class TareaController {
    // Crear nueva tarea
    static async create(req, res) {
        try {
            const tareaData = req.body;
            const creador_id = req.user.id;

            const tareaId = await Tarea.create({
                ...tareaData,
                creador_id
            });

            // Crear notificación para los miembros de la célula
            await Notificacion.createForCelula(tareaData.celula_id, {
                tipo: 'tarea_nueva',
                titulo: 'Nueva tarea asignada',
                mensaje: `Se ha creado la tarea: ${tareaData.titulo}`,
                url_referencia: `/tareas/${tareaId}`
            });

            res.status(201).json({
                success: true,
                message: 'Tarea creada exitosamente.',
                data: { id: tareaId }
            });
        } catch (error) {
            console.error('Error al crear tarea:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear tarea.',
                error: error.message
            });
        }
    }

    // Obtener todas las tareas
    static async getAll(req, res) {
        try {
            const tareas = await Tarea.findAll();
            res.json({
                success: true,
                data: tareas
            });
        } catch (error) {
            console.error('Error al obtener tareas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener tareas.',
                error: error.message
            });
        }
    }

    // Obtener tarea por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const tarea = await Tarea.findById(id);

            if (!tarea) {
                return res.status(404).json({
                    success: false,
                    message: 'Tarea no encontrada.'
                });
            }

            res.json({
                success: true,
                data: tarea
            });
        } catch (error) {
            console.error('Error al obtener tarea:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener tarea.',
                error: error.message
            });
        }
    }

    // Obtener tareas de una célula
    static async getByCelula(req, res) {
        try {
            const { celula_id } = req.params;
            const { estado } = req.query;

            let tareas;
            if (estado) {
                tareas = await Tarea.findByEstado(celula_id, estado);
            } else {
                tareas = await Tarea.findByCelula(celula_id);
            }

            res.json({
                success: true,
                data: tareas
            });
        } catch (error) {
            console.error('Error al obtener tareas de célula:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener tareas.',
                error: error.message
            });
        }
    }

    // Obtener tareas pendientes de una célula
    static async getPendientes(req, res) {
        try {
            const { celula_id } = req.params;
            const tareas = await Tarea.findPendientes(celula_id);

            res.json({
                success: true,
                data: tareas
            });
        } catch (error) {
            console.error('Error al obtener tareas pendientes:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener tareas.',
                error: error.message
            });
        }
    }

    // Obtener tareas vencidas de una célula
    static async getVencidas(req, res) {
        try {
            const { celula_id } = req.params;
            const tareas = await Tarea.findVencidas(celula_id);

            res.json({
                success: true,
                data: tareas
            });
        } catch (error) {
            console.error('Error al obtener tareas vencidas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener tareas.',
                error: error.message
            });
        }
    }

    // Actualizar tarea
    static async update(req, res) {
        try {
            const { id } = req.params;
            const tareaData = req.body;

            const tarea = await Tarea.findById(id);
            if (!tarea) {
                return res.status(404).json({
                    success: false,
                    message: 'Tarea no encontrada.'
                });
            }

            const success = await Tarea.update(id, tareaData);

            // Si se actualizó el estado, crear notificación
            if (tareaData.estado && tareaData.estado !== tarea.estado) {
                await Notificacion.createForCelula(tarea.celula_id, {
                    tipo: 'tarea_actualizada',
                    titulo: 'Tarea actualizada',
                    mensaje: `La tarea "${tarea.titulo}" ha sido actualizada.`,
                    url_referencia: `/tareas/${id}`
                });
            }

            res.json({
                success: true,
                message: 'Tarea actualizada exitosamente.'
            });
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar tarea.',
                error: error.message
            });
        }
    }

    // Actualizar estado de tarea
    static async updateEstado(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            const success = await Tarea.updateEstado(id, estado);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Tarea no encontrada.'
                });
            }

            res.json({
                success: true,
                message: 'Estado de tarea actualizado exitosamente.'
            });
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar estado.',
                error: error.message
            });
        }
    }

    // Eliminar tarea
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const success = await Tarea.delete(id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Tarea no encontrada.'
                });
            }

            res.json({
                success: true,
                message: 'Tarea eliminada exitosamente.'
            });
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar tarea.',
                error: error.message
            });
        }
    }

    // Obtener estadísticas de tareas de una célula
    static async getStats(req, res) {
        try {
            const { celula_id } = req.params;
            const stats = await Tarea.getStats(celula_id);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener estadísticas.',
                error: error.message
            });
        }
    }
}

module.exports = TareaController;
