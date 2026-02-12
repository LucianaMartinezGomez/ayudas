// Middleware para validar datos de entrada
const validateRegistration = (req, res, next) => {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'El nombre es requerido.'
        });
    }

    if (!apellido || apellido.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'El apellido es requerido.'
        });
    }

    if (!email || !validateEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'Email inválido.'
        });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'La contraseña debe tener al menos 6 caracteres.'
        });
    }

    next();
};

// Validar login
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email y contraseña son requeridos.'
        });
    }

    next();
};

// Validar creación de clan
const validateClan = (req, res, next) => {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'El nombre del clan es requerido.'
        });
    }

    next();
};

// Validar creación de tarea
const validateTarea = (req, res, next) => {
    const { titulo, celula_id } = req.body;

    if (!titulo || titulo.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'El título de la tarea es requerido.'
        });
    }

    if (!celula_id) {
        return res.status(400).json({
            success: false,
            message: 'La célula es requerida.'
        });
    }

    next();
};

// Función auxiliar para validar email
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateClan,
    validateTarea
};
