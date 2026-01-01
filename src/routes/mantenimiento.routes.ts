import { Router } from 'express';
import { mantenimientoController } from '../controllers/mantenimiento.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener próximos mantenimientos
router.get('/proximos', mantenimientoController.getProximos);

// Obtener mantenimientos de un vehículo
router.get('/vehiculo/:vehiculoId', mantenimientoController.getByVehiculo);

// CRUD de mantenimientos
router.get('/', mantenimientoController.getAll);
router.get('/:id', mantenimientoController.getById);
router.post('/', mantenimientoController.create);
router.put('/:id', mantenimientoController.update);
router.delete('/:id', mantenimientoController.delete);

export default router;
