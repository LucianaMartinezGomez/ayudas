const Clan = require('../models/Clan');
const { generarCodigoAleatorio } = require('../utils/helpers');

class ClanController {
    // Crear nuevo clan con 7 células automáticas
    static async create(req, res) {
        try {
            const { nombre, descripcion } = req.body;
            const profesor_id = req.user.id;

            // Generar código de acceso único
            const codigo_acceso = generarCodigoAleatorio('CLAN');

            // Crear clan con células usando procedimiento almacenado
            const clanId = await Clan.createWithCelulas({
                nombre,
                descripcion,
                profesor_id,
                codigo_acceso
            });

            // Obtener clan completo con células
            const clan = await Clan.findWithCelulas(clanId);

            res.status(201).json({
                success: true,
                message: 'Clan creado exitosamente con 7 células.',
                data: clan
            });
        } catch (error) {
            console.error('Error al crear clan:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear clan.',
                error: error.message
            });
        }
    }

    // Obtener todos los clanes
    static async getAll(req, res) {
        try {
            const clanes = await Clan.findAll();
            res.json({
                success: true,
                data: clanes
            });
        } catch (error) {
            console.error('Error al obtener clanes:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener clanes.',
                error: error.message
            });
        }
    }

    // Obtener clan por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const clan = await Clan.findWithCelulas(id);

            if (!clan) {
                return res.status(404).json({
                    success: false,
                    message: 'Clan no encontrado.'
                });
            }

            res.json({
                success: true,
                data: clan
            });
        } catch (error) {
            console.error('Error al obtener clan:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener clan.',
                error: error.message
            });
        }
    }

    // Obtener clanes del profesor autenticado
    static async getMyClanes(req, res) {
        try {
            const profesor_id = req.user.id;
            const clanes = await Clan.findByProfesor(profesor_id);

            res.json({
                success: true,
                data: clanes
            });
        } catch (error) {
            console.error('Error al obtener clanes del profesor:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener clanes.',
                error: error.message
            });
        }
    }

    // Buscar clan por código de acceso
    static async findByCodigo(req, res) {
        try {
            const { codigo } = req.params;
            const clan = await Clan.findByCodigoAcceso(codigo);

            if (!clan) {
                return res.status(404).json({
                    success: false,
                    message: 'Clan no encontrado.'
                });
            }

            res.json({
                success: true,
                data: clan
            });
        } catch (error) {
            console.error('Error al buscar clan:', error);
            res.status(500).json({
                success: false,
                message: 'Error al buscar clan.',
                error: error.message
            });
        }
    }

    // Actualizar clan
    static async update(req, res) {
        try {
            const { id } = req.params;
            const clanData = req.body;

            const success = await Clan.update(id, clanData);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Clan no encontrado.'
                });
            }

            res.json({
                success: true,
                message: 'Clan actualizado exitosamente.'
            });
        } catch (error) {
            console.error('Error al actualizar clan:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar clan.',
                error: error.message
            });
        }
    }

    // Desactivar clan
    static async deactivate(req, res) {
        try {
            const { id } = req.params;

            const success = await Clan.deactivate(id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Clan no encontrado.'
                });
            }

            res.json({
                success: true,
                message: 'Clan desactivado exitosamente.'
            });
        } catch (error) {
            console.error('Error al desactivar clan:', error);
            res.status(500).json({
                success: false,
                message: 'Error al desactivar clan.',
                error: error.message
            });
        }
    }

    // Eliminar clan
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const success = await Clan.delete(id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Clan no encontrado.'
                });
            }

            res.json({
                success: true,
                message: 'Clan eliminado exitosamente.'
            });
        } catch (error) {
            console.error('Error al eliminar clan:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar clan.',
                error: error.message
            });
        }
    }
}

module.exports = ClanController;
