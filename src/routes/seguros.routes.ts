import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as segurosController from '../controllers/seguros.controller';

const router = Router();
router.use(authMiddleware);

// Pólizas
router.get('/polizas', segurosController.getPolizas);
router.get('/polizas/por-vencer', segurosController.getPolizasPorVencer);
router.get('/polizas/:id', segurosController.getPolizaById);
router.post('/polizas', segurosController.crearPoliza);
router.put('/polizas/:id', segurosController.actualizarPoliza);
router.delete('/polizas/:id', segurosController.eliminarPoliza);

// Reclamaciones
router.get('/reclamaciones', segurosController.getReclamaciones);
router.post('/reclamaciones', segurosController.crearReclamacion);
router.put('/reclamaciones/:id', segurosController.actualizarReclamacion);
router.put('/reclamaciones/:id/estado', segurosController.actualizarEstadoReclamacion);

// Renovaciones
router.get('/renovaciones', segurosController.getRenovaciones);
router.post('/renovaciones', segurosController.crearRenovacion);

export default router;