const express = require('express');
const router = express.Router();
const TareaController = require('../controllers/tareaController');
const { authenticateToken, isLider } = require('../middleware/authMiddleware');
const { validateTarea } = require('../middleware/validationMiddleware');
const { createLimiter } = require('../middleware/rateLimitMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de tareas
router.post('/', isLider, createLimiter, validateTarea, TareaController.create);
router.get('/', TareaController.getAll);
router.get('/:id', TareaController.getById);
router.get('/celula/:celula_id', TareaController.getByCelula);
router.get('/celula/:celula_id/pendientes', TareaController.getPendientes);
router.get('/celula/:celula_id/vencidas', TareaController.getVencidas);
router.get('/celula/:celula_id/stats', TareaController.getStats);
router.put('/:id', isLider, TareaController.update);
router.patch('/:id/estado', isLider, TareaController.updateEstado);
router.delete('/:id', isLider, TareaController.delete);

module.exports = router;
