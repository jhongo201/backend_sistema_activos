import { Request, Response } from 'express';
import { PropiedadService } from '../services/propiedad.service';
import {
  crearPropiedadSchema,
  actualizarPropiedadSchema,
  filtrosPropiedadSchema,
} from '../validators/propiedad.validator';

interface AuthRequest extends Request {
  user?: {
    UsuarioID: number;
    Email: string;
    Rol: string;
  };
}

export class PropiedadController {
  /**
   * GET /api/propiedades
   * Obtener todas las propiedades con filtros y paginación
   */
  static async listarPropiedades(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { error, value } = filtrosPropiedadSchema.validate(req.query);

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Error en los parámetros de búsqueda',
          errors: error.details.map((d) => d.message),
        });
        return;
      }

      const resultado = await PropiedadService.obtenerPropiedades(value);

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en listarPropiedades:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener propiedades',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/propiedades/:id
   * Obtener una propiedad por ID
   */
  static async obtenerPropiedad(req: AuthRequest, res: Response): Promise<void> {
    try {
      const propiedadID = parseInt(req.params.id);

      if (isNaN(propiedadID)) {
        res.status(400).json({
          success: false,
          message: 'ID de propiedad inválido',
        });
        return;
      }

      const resultado = await PropiedadService.obtenerPropiedadPorId(propiedadID);

      if (!resultado.success) {
        res.status(404).json(resultado);
        return;
      }

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en obtenerPropiedad:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener propiedad',
        error: error.message,
      });
    }
  }

  /**
   * POST /api/propiedades
   * Crear una nueva propiedad
   */
  static async crearPropiedad(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { error, value } = crearPropiedadSchema.validate(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Error en los datos enviados',
          errors: error.details.map((d) => d.message),
        });
        return;
      }

      value.UsuarioRegistro = req.user!.UsuarioID;

      const resultado = await PropiedadService.crearPropiedad(value);

      if (!resultado.success) {
        res.status(400).json(resultado);
        return;
      }

      res.status(201).json(resultado);
    } catch (error: any) {
      console.error('Error en crearPropiedad:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear propiedad',
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/propiedades/:id
   * Actualizar una propiedad existente
   */
  static async actualizarPropiedad(req: AuthRequest, res: Response): Promise<void> {
    try {
      const propiedadID = parseInt(req.params.id);

      if (isNaN(propiedadID)) {
        res.status(400).json({
          success: false,
          message: 'ID de propiedad inválido',
        });
        return;
      }

      const { error, value } = actualizarPropiedadSchema.validate(req.body, {
        stripUnknown: true,
        convert: true,
        abortEarly: false,
      });

      if (error) {
        console.error('❌ Error de validación al actualizar propiedad:', error.details);
        console.error('📦 Datos recibidos:', JSON.stringify(req.body, null, 2));
        res.status(400).json({
          success: false,
          message: 'Error en los datos enviados',
          errors: error.details.map((d) => d.message),
        });
        return;
      }

      const resultado = await PropiedadService.actualizarPropiedad(propiedadID, value);

      if (!resultado.success) {
        res.status(404).json(resultado);
        return;
      }

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en actualizarPropiedad:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar propiedad',
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/propiedades/:id
   * Eliminar una propiedad (soft delete)
   */
  static async eliminarPropiedad(req: AuthRequest, res: Response): Promise<void> {
    try {
      const propiedadID = parseInt(req.params.id);

      if (isNaN(propiedadID)) {
        res.status(400).json({
          success: false,
          message: 'ID de propiedad inválido',
        });
        return;
      }

      const resultado = await PropiedadService.eliminarPropiedad(propiedadID);

      if (!resultado.success) {
        res.status(404).json(resultado);
        return;
      }

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en eliminarPropiedad:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar propiedad',
        error: error.message,
      });
    }
  }
}

export default PropiedadController;
