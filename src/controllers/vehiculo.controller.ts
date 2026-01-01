import { Request, Response } from 'express';
import { VehiculoService } from '../services/vehiculo.service';
import {
  crearVehiculoSchema,
  actualizarVehiculoSchema,
  filtrosVehiculoSchema,
} from '../validators/vehiculo.validator';

// Extender la interfaz Request para incluir el usuario autenticado
interface AuthRequest extends Request {
  user?: {
    UsuarioID: number;
    Email: string;
    Rol: string;
  };
}

export class VehiculoController {
  /**
   * GET /api/vehiculos
   * Obtener todos los vehículos con filtros y paginación
   */
  static async listarVehiculos(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Validar filtros
      const { error, value } = filtrosVehiculoSchema.validate(req.query);

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Error en los parámetros de búsqueda',
          errors: error.details.map((d) => d.message),
        });
        return;
      }

      const resultado = await VehiculoService.obtenerVehiculos(value);

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en listarVehiculos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener vehículos',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/vehiculos/:id
   * Obtener un vehículo por ID
   */
  static async obtenerVehiculo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehiculoID = parseInt(req.params.id);

      if (isNaN(vehiculoID)) {
        res.status(400).json({
          success: false,
          message: 'ID de vehículo inválido',
        });
        return;
      }

      const resultado = await VehiculoService.obtenerVehiculoPorId(vehiculoID);

      if (!resultado.success) {
        res.status(404).json(resultado);
        return;
      }

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en obtenerVehiculo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener vehículo',
        error: error.message,
      });
    }
  }

  /**
   * POST /api/vehiculos
   * Crear un nuevo vehículo
   */
  static async crearVehiculo(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Validar datos
      const { error, value } = crearVehiculoSchema.validate(req.body);

      if (error) {
        console.error('❌ Error de validación al crear vehículo:', error.details);
        console.error('Datos recibidos:', JSON.stringify(req.body, null, 2));
        res.status(400).json({
          success: false,
          message: 'Error en los datos enviados',
          errors: error.details.map((d) => d.message),
        });
        return;
      }

      // Agregar usuario que registra
      value.UsuarioRegistro = req.user!.UsuarioID;

      const resultado = await VehiculoService.crearVehiculo(value);

      if (!resultado.success) {
        res.status(400).json(resultado);
        return;
      }

      res.status(201).json(resultado);
    } catch (error: any) {
      console.error('Error en crearVehiculo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear vehículo',
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/vehiculos/:id
   * Actualizar un vehículo existente
   */
  static async actualizarVehiculo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehiculoID = parseInt(req.params.id);

      if (isNaN(vehiculoID)) {
        res.status(400).json({
          success: false,
          message: 'ID de vehículo inválido',
        });
        return;
      }

      // Validar datos
      const { error, value } = actualizarVehiculoSchema.validate(req.body);

      if (error) {
        console.error('❌ Error de validación al actualizar vehículo:', error.details);
        console.error('Datos recibidos:', JSON.stringify(req.body, null, 2));
        res.status(400).json({
          success: false,
          message: 'Error en los datos enviados',
          errors: error.details.map((d) => d.message),
        });
        return;
      }

      const resultado = await VehiculoService.actualizarVehiculo(vehiculoID, value);

      if (!resultado.success) {
        res.status(404).json(resultado);
        return;
      }

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en actualizarVehiculo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar vehículo',
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/vehiculos/:id
   * Eliminar un vehículo (soft delete)
   */
  static async eliminarVehiculo(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehiculoID = parseInt(req.params.id);

      if (isNaN(vehiculoID)) {
        res.status(400).json({
          success: false,
          message: 'ID de vehículo inválido',
        });
        return;
      }

      const resultado = await VehiculoService.eliminarVehiculo(vehiculoID);

      if (!resultado.success) {
        res.status(404).json(resultado);
        return;
      }

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en eliminarVehiculo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar vehículo',
        error: error.message,
      });
    }
  }
}

export default VehiculoController;
