const Celula = require('../models/Celula');
const Usuario = require('../models/Usuario');

class CelulaController {
    // Obtener todas las células
    static async getAll(req, res) {
        try {
            const celulas = await Celula.findAll();
            res.json({
                success: true,
                data: celulas
            });
        } catch (error) {
            console.error('Error al obtener células:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener células.',
                error: error.message
            });
        }
    }

    // Obtener célula por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const celula = await Celula.findWithMiembros(id);

            if (!celula) {
                return res.status(404).json({
                    success: false,
                    message: 'Célula no encontrada.'
                });
            }

            res.json({
                success: true,
                data: celula
            });
        } catch (error) {
            console.error('Error al obtener célula:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener célula.',
                error: error.message
            });
        }
    }

    // Obtener células de un clan
    static async getByClan(req, res) {
        try {
            const { clan_id } = req.params;
            const celulas = await Celula.findByClan(clan_id);

            res.json({
                success: true,
                data: celulas
            });
        } catch (error) {
            console.error('Error al obtener células del clan:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener células.',
                error: error.message
            });
        }
    }

    // Obtener información completa de célula
    static async getInfo(req, res) {
        try {
            const { id } = req.params;
            const celula = await Celula.findInfoById(id);

            if (!celula) {
                return res.status(404).json({
                    success: false,
                    message: 'Célula no encontrada.'
                });
            }

            res.json({
                success: true,
                data: celula
            });
        } catch (error) {
            console.error('Error al obtener información de célula:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener información.',
                error: error.message
            });
        }
    }

    // Unirse a una célula usando código
    static async joinWithCode(req, res) {
        try {
            const { codigo_acceso } = req.body;
            const usuario_id = req.user.id;

            // Buscar célula por código
            const celula = await Celula.findByCodigoAcceso(codigo_acceso);

            if (!celula) {
                return res.status(404).json({
                    success: false,
                    message: 'Código de célula inválido.'
                });
            }

            if (!celula.activo) {
                return res.status(400).json({
                    success: false,
                    message: 'Esta célula no está activa.'
                });
            }

            // Asignar usuario a la célula
            await Usuario.assignCelula(usuario_id, celula.id);

            res.json({
                success: true,
                message: 'Te has unido a la célula exitosamente.',
                data: celula
            });
        } catch (error) {
            console.error('Error al unirse a célula:', error);
            res.status(500).json({
                success: false,
                message: 'Error al unirse a la célula.',
                error: error.message
            });
        }
    }

    // Asignar líder a célula
    static async assignLider(req, res) {
        try {
            const { id } = req.params;
            const { lider_id } = req.body;

            // Verificar que el usuario exista
            const usuario = await Usuario.findById(lider_id);
            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado.'
                });
            }

            // Actualizar rol del usuario a líder
            await Usuario.update(lider_id, { ...usuario, rol: 'lider' });

            // Asignar líder a la célula
            const success = await Celula.assignLider(id, lider_id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Célula no encontrada.'
                });
            }

            res.json({
                success: true,
                message: 'Líder asignado exitosamente.'
            });
        } catch (error) {
            console.error('Error al asignar líder:', error);
            res.status(500).json({
                success: false,
                message: 'Error al asignar líder.',
                error: error.message
            });
        }
    }

    // Actualizar célula
    static async update(req, res) {
        try {
            const { id } = req.params;
            const celulaData = req.body;

            const success = await Celula.update(id, celulaData);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Célula no encontrada.'
                });
            }

            res.json({
                success: true,
                message: 'Célula actualizada exitosamente.'
            });
        } catch (error) {
            console.error('Error al actualizar célula:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar célula.',
                error: error.message
            });
        }
    }

    // Obtener estadísticas de tareas de la célula
    static async getTaskStats(req, res) {
        try {
            const { id } = req.params;
            const stats = await Celula.getTaskStats(id);

            res.json({
                success: true,
                data: stats || {
                    celula_id: id,
                    total_tareas: 0,
                    tareas_pendientes: 0,
                    tareas_en_progreso: 0,
                    tareas_completadas: 0
                }
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

module.exports = CelulaController;
