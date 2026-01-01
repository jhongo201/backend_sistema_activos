import { Router } from 'express';
import { HistorialPropietariosController } from '../controllers/historial-propietarios.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// ============================================
// RUTAS PARA REPORTES Y CONSULTAS ESPECIALES
// ============================================
// IMPORTANTE: Estas rutas deben ir ANTES de las rutas con parámetros
// para evitar conflictos de routing

/**
 * Obtener vehículos sin traspaso realizado
 * GET /api/vehiculos/sin-traspaso
 */
router.get(
  '/vehiculos/sin-traspaso',
  HistorialPropietariosController.obtenerVehiculosSinTraspaso
);

/**
 * Obtener historial de ventas
 * GET /api/historial-ventas
 * Query params: fechaInicio, fechaFin, limite
 */
router.get(
  '/historial-ventas',
  HistorialPropietariosController.obtenerHistorialVentas
);

// ============================================
// RUTAS PARA GESTIÓN DE HISTORIAL DE PROPIETARIOS
// ============================================

/**
 * Registrar propietario anterior de un vehículo
 * POST /api/vehiculos/:id/propietarios/anterior
 */
router.post(
  '/vehiculos/:id/propietarios/anterior',
  HistorialPropietariosController.registrarPropietarioAnterior
);

/**
 * Registrar propietario actual (yo)
 * POST /api/vehiculos/:id/propietarios/actual
 */
router.post(
  '/vehiculos/:id/propietarios/actual',
  HistorialPropietariosController.registrarPropietarioActual
);

/**
 * Registrar traspaso a mi nombre
 * POST /api/vehiculos/:id/propietarios/traspaso
 */
router.post(
  '/vehiculos/:id/propietarios/traspaso',
  HistorialPropietariosController.registrarTraspaso
);

/**
 * Registrar venta del vehículo
 * POST /api/vehiculos/:id/propietarios/venta
 */
router.post(
  '/vehiculos/:id/propietarios/venta',
  HistorialPropietariosController.registrarVenta
);

/**
 * Obtener propietario actual de un vehículo
 * GET /api/vehiculos/:id/propietarios/actual
 */
router.get(
  '/vehiculos/:id/propietarios/actual',
  HistorialPropietariosController.obtenerPropietarioActual
);

/**
 * Obtener historial completo de propietarios de un vehículo
 * GET /api/vehiculos/:id/propietarios
 */
router.get(
  '/vehiculos/:id/propietarios',
  HistorialPropietariosController.obtenerHistorial
);

/**
 * Actualizar registro de historial
 * PUT /api/vehiculos/:vehiculoId/propietarios/:historialId
 */
router.put(
  '/vehiculos/:vehiculoId/propietarios/:historialId',
  HistorialPropietariosController.actualizarHistorial
);

/**
 * Eliminar registro de historial
 * DELETE /api/vehiculos/:vehiculoId/propietarios/:historialId
 */
router.delete(
  '/vehiculos/:vehiculoId/propietarios/:historialId',
  HistorialPropietariosController.eliminarHistorial
);

export default router;
