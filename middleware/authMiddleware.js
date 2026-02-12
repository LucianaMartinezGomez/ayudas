const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado. Token no proporcionado.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token inválido o expirado.'
        });
    }
};

// Middleware para verificar roles específicos
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado.'
            });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para realizar esta acción.'
            });
        }

        next();
    };
};

// Middleware para verificar que el usuario es administrador
const isAdministrador = (req, res, next) => {
    authorizeRoles('administrador')(req, res, next);
};

// Middleware para verificar que el usuario es líder
const isLider = (req, res, next) => {
    authorizeRoles('lider', 'administrador')(req, res, next);
};

// Middleware para verificar que el usuario es estudiante o superior
const isEstudiante = (req, res, next) => {
    authorizeRoles('estudiante', 'lider', 'administrador')(req, res, next);
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    isAdministrador,
    isLider,
    isEstudiante
};
