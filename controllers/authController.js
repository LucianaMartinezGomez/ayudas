const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

class AuthController {
    // Registro de nuevo usuario
    static async register(req, res) {
        try {
            const { nombre, apellido, email, password, rol, codigo_celula } = req.body;

            // Verificar si el email ya existe
            const existingUser = await Usuario.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El email ya está registrado.'
                });
            }

            // Si se proporciona código de célula, buscar la célula
            let celula_id = null;
            if (codigo_celula) {
                const Celula = require('../models/Celula');
                const celula = await Celula.findByCodigoAcceso(codigo_celula);
                
                if (!celula) {
                    return res.status(400).json({
                        success: false,
                        message: 'Código de célula inválido.'
                    });
                }
                celula_id = celula.id;
            }

            // Hashear la contraseña
            const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Crear usuario
            const userId = await Usuario.create({
                nombre,
                apellido,
                email,
                password: hashedPassword,
                rol: rol || 'estudiante',
                celula_id
            });

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente.',
                data: { id: userId }
            });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                success: false,
                message: 'Error al registrar usuario.',
                error: error.message
            });
        }
    }

    // Login de usuario
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const user = await Usuario.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas.'
                });
            }

            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas.'
                });
            }

            // Verificar si el usuario está activo
            if (!user.activo) {
                return res.status(403).json({
                    success: false,
                    message: 'Usuario desactivado. Contacte al administrador.'
                });
            }

            // Generar token JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    rol: user.rol,
                    celula_id: user.celula_id
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            res.json({
                success: true,
                message: 'Login exitoso.',
                data: {
                    token,
                    user: {
                        id: user.id,
                        nombre: user.nombre,
                        apellido: user.apellido,
                        email: user.email,
                        rol: user.rol,
                        celula_id: user.celula_id
                    }
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error al iniciar sesión.',
                error: error.message
            });
        }
    }

    // Obtener perfil del usuario autenticado
    static async getProfile(req, res) {
        try {
            const user = await Usuario.findById(req.user.id);
            
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
            console.error('Error al obtener perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener perfil.',
                error: error.message
            });
        }
    }

    // Cambiar contraseña
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            // Obtener usuario con contraseña
            const user = await Usuario.findByEmail(req.user.email);

            // Verificar contraseña actual
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña actual incorrecta.'
                });
            }

            // Hashear nueva contraseña
            const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            // Actualizar contraseña
            await Usuario.updatePassword(req.user.id, hashedPassword);

            res.json({
                success: true,
                message: 'Contraseña actualizada exitosamente.'
            });
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            res.status(500).json({
                success: false,
                message: 'Error al cambiar contraseña.',
                error: error.message
            });
        }
    }
}

module.exports = AuthController;
