import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as calendarioController from '../controllers/calendario.controller';

const router = Router();
router.use(authMiddleware);

// Obtener pagos del mes
router.get('/mes/:year/:month', calendarioController.getPagosDelMes);

// Obtener pagos próximos a vencer (próximos 7 días)
router.get('/proximos', calendarioController.getPagosProximos);

// Obtener pagos vencidos
router.get('/vencidos', calendarioController.getPagosVencidos);

// Registrar pago
router.put('/:id/pagar', calendarioController.registrarPago);

export default router;
