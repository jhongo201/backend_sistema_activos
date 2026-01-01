import { Router } from 'express';
import authRoutes from './auth.routes';
import testRoutes from './test.routes';
import vehiculoRoutes from './vehiculo.routes';
import propiedadRoutes from './propiedad.routes';
import historialRoutes from './historial.routes';  
import mantenimientoRoutes from './mantenimiento.routes';
import usuarioRoutes from './usuario.routes';
import rolRoutes from './rol.routes';
import calculadoraRoutes from './calculadora.routes';
import calendarioRoutes from './calendario.routes';
import segurosRoutes from './seguros.routes';
import contratoRoutes from './contrato.routes';
import notificacionRoutes from './notificacion.routes';
import pushRoutes from './push.routes';
import historialPropietariosRoutes from './historial-propietarios.routes';

const router = Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de prueba (temporal para debugging)
router.use('/test', testRoutes);

// Rutas de Historial de Propietarios (DEBE IR ANTES de /vehiculos)
// Para que /vehiculos/sin-traspaso no sea capturado por /vehiculos/:id
router.use('/', historialPropietariosRoutes);

// Rutas de vehículos
router.use('/vehiculos', vehiculoRoutes);

// Rutas de propiedades
router.use('/propiedades', propiedadRoutes);

// TODO: Agregar más rutas aquí en las siguientes fases
// router.use('/gastos', gastosRoutes);

// Rutas de Historial
router.use('/historial', historialRoutes);  

// Rutas de Mantenimientos
router.use('/mantenimientos', mantenimientoRoutes);

// Rutas de Usuarios
router.use('/usuarios', usuarioRoutes);

// Rutas de Roles
router.use('/roles', rolRoutes);

// Rutas de Calculadora
router.use('/calculadora', calculadoraRoutes);

// Rutas de Calendario
router.use('/calendario', calendarioRoutes);

// Rutas de Seguros
router.use('/seguros', segurosRoutes);

// Rutas de Contratos
router.use('/contratos', contratoRoutes);

// Rutas de Notificaciones
router.use('/notificaciones', notificacionRoutes);

// Rutas de Push Notifications
router.use('/push', pushRoutes);

export default router;
