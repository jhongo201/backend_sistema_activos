import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener todos los usuarios
router.get('/', usuarioController.getAll);

// Obtener usuario por ID
router.get('/:id', usuarioController.getById);

// Crear usuario
router.post('/', usuarioController.create);

// Actualizar usuario
router.put('/:id', usuarioController.update);

// Eliminar usuario (soft delete)
router.delete('/:id', usuarioController.delete);

// Cambiar contraseña
router.put('/:id/password', usuarioController.changePassword);

export default router;
