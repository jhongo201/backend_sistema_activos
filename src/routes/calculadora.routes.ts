import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as calculadoraController from '../controllers/calculadora.controller';

const router = Router();
router.use(authMiddleware);

router.post('/inmueble', calculadoraController.calcularInmueble);
router.post('/vehiculo', calculadoraController.calcularVehiculo);
router.post('/herencia', calculadoraController.calcularHerencia);
router.post('/loteria', calculadoraController.calcularLoteria);

export default router;
