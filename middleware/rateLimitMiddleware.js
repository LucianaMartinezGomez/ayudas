const rateLimit = require('express-rate-limit');

// Rate limiter general para todas las rutas de API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 peticiones por ventana
    message: {
        success: false,
        message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter estricto para autenticación (login/registro)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // límite de 5 intentos por ventana
    message: {
        success: false,
        message: 'Demasiados intentos de autenticación. Por favor intenta de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter para operaciones de creación
const createLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 20, // límite de 20 creaciones por hora
    message: {
        success: false,
        message: 'Límite de creación excedido. Por favor intenta de nuevo más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter,
    createLimiter
};
