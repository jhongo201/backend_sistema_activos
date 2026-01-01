import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * POST /api/auth/login
 * Login de usuario
 */
router.post('/login', AuthController.login);

/**
 * GET /api/auth/me
 * Obtener información del usuario actual (requiere autenticación)
 */
router.get('/me', authMiddleware, AuthController.getCurrentUser);

/**
 * POST /api/auth/logout
 * Logout (principalmente para frontend)
 */
router.post('/logout', authMiddleware, AuthController.logout);

export default router;
