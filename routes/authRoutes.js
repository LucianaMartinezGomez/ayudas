const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');

// Rutas públicas
router.post('/register', validateRegistration, AuthController.register);
router.post('/login', validateLogin, AuthController.login);

// Rutas protegidas
router.get('/profile', authenticateToken, AuthController.getProfile);
router.post('/change-password', authenticateToken, AuthController.changePassword);

module.exports = router;
