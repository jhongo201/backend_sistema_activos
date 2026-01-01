import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as contratoController from '../controllers/contrato.controller';
import { uploadContrato } from '../middleware/upload.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', contratoController.crear);
router.get('/', contratoController.getAll);
router.get('/:id', contratoController.getOne);
router.get('/:id/descargar', contratoController.descargar);
router.put('/:id/anular', contratoController.anular);
router.get('/verificar/:codigo', contratoController.verificar);

// Nuevos endpoints para documentos firmados
router.post('/:id/cargar-firmado', uploadContrato.single('documento'), contratoController.cargarDocumentoFirmado);
router.get('/:id/descargar-firmado/:tipo', contratoController.descargarDocumentoFirmado);

export default router;