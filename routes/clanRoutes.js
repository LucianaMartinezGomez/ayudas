const express = require('express');
const router = express.Router();
const ClanController = require('../controllers/clanController');
const { authenticateToken, isAdministrador } = require('../middleware/authMiddleware');
const { validateClan } = require('../middleware/validationMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de clanes
router.post('/', isAdministrador, validateClan, ClanController.create);
router.get('/', ClanController.getAll);
router.get('/my-clanes', isAdministrador, ClanController.getMyClanes);
router.get('/codigo/:codigo', ClanController.findByCodigo);
router.get('/:id', ClanController.getById);
router.put('/:id', isAdministrador, ClanController.update);
router.put('/:id/deactivate', isAdministrador, ClanController.deactivate);
router.delete('/:id', isAdministrador, ClanController.delete);

module.exports = router;
