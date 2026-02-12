const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

// Rutas públicas con rate limiting estricto
router.post('/register', authLimiter, validateRegistration, AuthController.register);
router.post('/login', authLimiter, validateLogin, AuthController.login);

// Rutas protegidas
router.get('/profile', authenticateToken, AuthController.getProfile);
router.post('/change-password', authenticateToken, AuthController.changePassword);

module.exports = router;
