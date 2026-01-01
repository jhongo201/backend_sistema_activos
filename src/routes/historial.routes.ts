import { Router } from 'express';
import { historialController } from '../controllers/historial.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener historial de un activo específico
router.get('/:tipoActivo/:activoId', historialController.getHistorialByActivo);

// Obtener todo el historial con filtros
router.get('/', historialController.getAllHistorial);

// Crear registro de historial
router.post('/', historialController.createHistorial);

export default router;
