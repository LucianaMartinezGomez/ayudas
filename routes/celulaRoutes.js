const express = require('express');
const router = express.Router();
const CelulaController = require('../controllers/celulaController');
const { authenticateToken, isAdministrador } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de células
router.get('/', CelulaController.getAll);
router.get('/:id', CelulaController.getById);
router.get('/:id/info', CelulaController.getInfo);
router.get('/:id/stats', CelulaController.getTaskStats);
router.get('/clan/:clan_id', CelulaController.getByClan);
router.post('/join', CelulaController.joinWithCode);
router.post('/:id/assign-lider', isAdministrador, CelulaController.assignLider);
router.put('/:id', isAdministrador, CelulaController.update);

module.exports = router;
