const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateToken, isAdministrador } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de usuarios
router.get('/', isAdministrador, UserController.getAll);
router.get('/:id', UserController.getById);
router.get('/rol/:rol', isAdministrador, UserController.getByRole);
router.get('/celula/:celula_id', UserController.getByCelula);
router.put('/:id', isAdministrador, UserController.update);
router.post('/:id/assign-celula', isAdministrador, UserController.assignCelula);
router.put('/:id/deactivate', isAdministrador, UserController.deactivate);
router.delete('/:id', isAdministrador, UserController.delete);

module.exports = router;
