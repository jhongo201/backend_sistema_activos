import { Router } from 'express';
import { PropiedadController } from '../controllers/propiedad.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/roles.middleware';
import Propiedad from '../models/Propiedad.model';
import { GeocodingService } from '../services/geocoding.service';
import { Op } from 'sequelize';

const router = Router();

/**
 * Todas las rutas requieren autenticación
 */
router.use(authenticateToken);

/**
 * GET /api/propiedades
 * Listar todas las propiedades
 * Acceso: Todos los roles
 */
router.get('/', PropiedadController.listarPropiedades);

/**
 * GET /api/propiedades/:id
 * Obtener una propiedad específica
 * Acceso: Todos los roles
 */
router.get('/:id', PropiedadController.obtenerPropiedad);

/**
 * POST /api/propiedades
 * Crear una nueva propiedad
 * Acceso: Admin, Contador, Operador
 */
router.post(
  '/',
  requireRole('Administrador' as any, 'Editor' as any),
  PropiedadController.crearPropiedad
);

/**
 * PUT /api/propiedades/:id
 * Actualizar una propiedad existente
 * Acceso: Admin, Contador, Operador
 */
router.put(
  '/:id',
  requireRole('Administrador' as any, 'Editor' as any),
  PropiedadController.actualizarPropiedad
);

/**
 * DELETE /api/propiedades/:id
 * Eliminar una propiedad (soft delete)
 * Acceso: Solo Admin
 */
router.delete('/:id', requireRole('Administrador' as any), PropiedadController.eliminarPropiedad);

/**
 * POST /api/propiedades/geocodificar-todas
 * Geocodificar todas las propiedades sin coordenadas (TEMPORAL)
 * Acceso: Solo Administrador
 * NOTA: Este endpoint es temporal para migración de datos
 */
router.post('/geocodificar-todas', requireRole('Administrador' as any), async (req, res) => {
  try {
    // Buscar propiedades sin coordenadas
    const propiedades = await Propiedad.findAll({
      where: {
        Latitud: null,
        Direccion: { [Op.ne]: null },
      } as any,
    });

    if (propiedades.length === 0) {
      res.json({
        success: true,
        message: 'No hay propiedades pendientes de geocodificar',
        total: 0,
      });
      return;
    }

    console.log(`🌍 Iniciando geocodificación de ${propiedades.length} propiedades...`);

    let exitosas = 0;
    let fallidas = 0;

    for (const propiedad of propiedades) {
      try {
        // Geocodificar usando Nominatim
        const coords = await GeocodingService.geocodificarDireccion(
          propiedad.Direccion,
          propiedad.Ciudad,
          propiedad.Departamento
        );

        if (coords) {
          await propiedad.update({
            Latitud: coords.lat,
            Longitud: coords.lng,
          });
          exitosas++;
          console.log(`✅ Geocodificada: ${propiedad.Direccion}, ${propiedad.Ciudad} (${coords.lat}, ${coords.lng})`);
        } else {
          fallidas++;
          console.log(`❌ No se pudo geocodificar: ${propiedad.Direccion}, ${propiedad.Ciudad}`);
        }

        // Delay de 1.1 segundos para respetar límite de Nominatim (1 req/seg)
        await GeocodingService.delay(1100);
      } catch (error: any) {
        fallidas++;
        console.error(`❌ Error geocodificando propiedad ${propiedad.PropiedadID}:`, error.message);
      }
    }

    res.json({
      success: true,
      message: 'Geocodificación completada',
      total: propiedades.length,
      exitosas,
      fallidas,
    });
  } catch (error: any) {
    console.error('Error en geocodificación masiva:', error);
    res.status(500).json({
      success: false,
      message: 'Error al geocodificar propiedades',
      error: error.message,
    });
  }
});

export default router;
