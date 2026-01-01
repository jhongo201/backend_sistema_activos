import { Router } from 'express';
import { TestController } from '../controllers/test.controller';

const router = Router();

/**
 * GET /api/test/db
 * Probar conexión a base de datos
 */
router.get('/db', TestController.testDatabase);

/**
 * GET /api/test/usuarios
 * Listar todos los usuarios
 */
router.get('/usuarios', TestController.listarUsuarios);

/**
 * GET /api/test/usuario/:email
 * Buscar usuario por email
 */
router.get('/usuario/:email', TestController.buscarUsuario);

export default router;
