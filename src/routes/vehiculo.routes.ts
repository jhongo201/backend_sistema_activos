import { Router } from 'express';
import { VehiculoController } from '../controllers/vehiculo.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole, requireAdminOrContador } from '../middlewares/roles.middleware';

const router = Router();

/**
 * Todas las rutas requieren autenticación
 */
router.use(authenticateToken);

/**
 * GET /api/vehiculos
 * Listar todos los vehículos
 * Acceso: Todos los roles
 */
router.get('/', VehiculoController.listarVehiculos);

/**
 * GET /api/vehiculos/:id
 * Obtener un vehículo específico
 * Acceso: Todos los roles
 */
router.get('/:id', VehiculoController.obtenerVehiculo);

/**
 * POST /api/vehiculos
 * Crear un nuevo vehículo
 * Acceso: Admin, Contador, Operador
 */
router.post(
  '/',
  requireRole('Administrador' as any, 'Editor' as any),
  VehiculoController.crearVehiculo
);

/**
 * PUT /api/vehiculos/:id
 * Actualizar un vehículo existente
 * Acceso: Admin, Contador, Operador
 */
router.put(
  '/:id',
  requireRole('Administrador' as any, 'Editor' as any),
  VehiculoController.actualizarVehiculo
);

/**
 * DELETE /api/vehiculos/:id
 * Eliminar un vehículo (soft delete)
 * Acceso: Solo Admin
 */
router.delete('/:id', requireRole('Administrador' as any), VehiculoController.eliminarVehiculo);

export default router;
