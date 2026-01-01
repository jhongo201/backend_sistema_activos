import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as exportController from '../services/excel.service';

const router = Router();
router.use(authMiddleware);

// Exportar reporte completo
router.get('/completo', exportController.exportarReporteCompleto);

// Exportar personalizado
router.post('/personalizado', exportController.exportarPersonalizado);

export default router;