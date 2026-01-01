import { Router } from 'express';
import { rolController } from '../controllers/rol.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Inicializar roles por defecto (ejecutar solo una vez)
router.post('/initialize', rolController.initializeDefaultRoles);

// Obtener todos los roles
router.get('/', rolController.getAll);

// Obtener rol por ID
router.get('/:id', rolController.getById);

// Crear rol
router.post('/', rolController.create);

// Actualizar rol
router.put('/:id', rolController.update);

// Eliminar rol (soft delete)
router.delete('/:id', rolController.delete);

export default router;
