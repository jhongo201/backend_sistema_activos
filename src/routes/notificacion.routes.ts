import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as notificacionController from '../controllers/notificacion.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @route   GET /api/notificaciones
 * @desc    Obtener todas las notificaciones del usuario
 * @access  Private
 * @query   leida (boolean), tipo (string), limit (number), offset (number)
 */
router.get('/', notificacionController.getAll);

/**
 * @route   GET /api/notificaciones/no-leidas
 * @desc    Obtener notificaciones no leídas
 * @access  Private
 */
router.get('/no-leidas', notificacionController.getUnread);

/**
 * @route   GET /api/notificaciones/contador
 * @desc    Obtener contador de notificaciones no leídas
 * @access  Private
 */
router.get('/contador', notificacionController.getUnreadCount);

/**
 * @route   PUT /api/notificaciones/:id/leer
 * @desc    Marcar notificación como leída
 * @access  Private
 */
router.put('/:id/leer', notificacionController.markAsRead);

/**
 * @route   PUT /api/notificaciones/leer-todas
 * @desc    Marcar todas las notificaciones como leídas
 * @access  Private
 */
router.put('/leer-todas', notificacionController.markAllAsRead);

/**
 * @route   DELETE /api/notificaciones/:id
 * @desc    Eliminar notificación
 * @access  Private
 */
router.delete('/:id', notificacionController.deleteNotification);

/**
 * @route   POST /api/notificaciones
 * @desc    Crear notificación (solo para testing)
 * @access  Private
 */
router.post('/', notificacionController.createNotification);

/**
 * @route   POST /api/notificaciones/verificar-vencimientos
 * @desc    Verificar vencimientos y crear alertas (cron/manual)
 * @access  Private
 */
router.post('/verificar-vencimientos', notificacionController.verificarVencimientos);

export default router;