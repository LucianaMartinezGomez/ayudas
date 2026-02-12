const Usuario = require('../models/Usuario');

class UserController {
    // Obtener todos los usuarios
    static async getAll(req, res) {
        try {
            const users = await Usuario.findAll();
            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuarios.',
                error: error.message
            });
        }
    }

    // Obtener usuario por ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await Usuario.findById(id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado.'
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuario.',
                error: error.message
            });
        }
    }

    // Obtener usuarios por rol
    static async getByRole(req, res) {
        try {
            const { rol } = req.params;
            const users = await Usuario.findByRole(rol);

            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            console.error('Error al obtener usuarios por rol:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuarios.',
                error: error.message
            });
        }
    }

    // Obtener usuarios de una célula
    static async getByCelula(req, res) {
        try {
            const { celula_id } = req.params;
            const users = await Usuario.findByCelula(celula_id);

            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            console.error('Error al obtener usuarios de célula:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuarios.',
                error: error.message
            });
        }
    }

    // Actualizar usuario
    static async update(req, res) {
        try {
            const { id } = req.params;
            const userData = req.body;

            const success = await Usuario.update(id, userData);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado.'
                });
            }

            res.json({
                success: true,
                message: 'Usuario actualizado exitosamente.'
            });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar usuario.',
                error: error.message
            });
        }
    }

    // Asignar célula a usuario
    static async assignCelula(req, res) {
        try {
            const { id } = req.params;
            const { celula_id } = req.body;

            const success = await Usuario.assignCelula(id, celula_id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado.'
                });
            }

            res.json({
                success: true,
                message: 'Célula asignada exitosamente.'
            });
        } catch (error) {
            console.error('Error al asignar célula:', error);
            res.status(500).json({
                success: false,
                message: 'Error al asignar célula.',
                error: error.message
            });
        }
    }

    // Desactivar usuario
    static async deactivate(req, res) {
        try {
            const { id } = req.params;

            const success = await Usuario.deactivate(id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado.'
                });
            }

            res.json({
                success: true,
                message: 'Usuario desactivado exitosamente.'
            });
        } catch (error) {
            console.error('Error al desactivar usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al desactivar usuario.',
                error: error.message
            });
        }
    }

    // Eliminar usuario
    static async delete(req, res) {
        try {
            const { id } = req.params;

            const success = await Usuario.delete(id);

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado.'
                });
            }

            res.json({
                success: true,
                message: 'Usuario eliminado exitosamente.'
            });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar usuario.',
                error: error.message
            });
        }
    }
}

module.exports = UserController;
