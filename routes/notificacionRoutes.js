const express = require('express');
const router = express.Router();
const NotificacionController = require('../controllers/notificacionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas de notificaciones
router.get('/', NotificacionController.getMyNotifications);
router.get('/unread', NotificacionController.getUnread);
router.get('/count', NotificacionController.countUnread);
router.put('/:id/read', NotificacionController.markAsRead);
router.put('/read-all', NotificacionController.markAllAsRead);
router.delete('/:id', NotificacionController.delete);

module.exports = router;
