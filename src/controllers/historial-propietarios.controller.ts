import { Request, Response } from 'express';
import { HistorialPropietariosService } from '../services/historial-propietarios.service';
import {
  registrarPropietarioAnteriorSchema,
  registrarPropietarioActualSchema,
  registrarTraspasoSchema,
  registrarVentaSchema,
  actualizarHistorialSchema,
} from '../validators/historial-propietarios.validator';

interface AuthRequest extends Request {
  user?: {
    UsuarioID: number;
    Email: string;
    Rol: string;
  };
}

export class HistorialPropietariosController {
  /**
   * POST /api/vehiculos/:id/propietarios/anterior
   * Registrar propietario anterior
   */
  static async registrarPropietarioAnterior(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehiculoID = parseInt(req.params.id);
      const { error, value } = registrarPropietarioAnteriorSchema.validate({
        ...req.body,
        vehiculoID,
      });

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Error en los datos proporcionados',
          errors: error.details.map((d) => d.message),
        });
        return;
      }

      const resultado = await HistorialPropietariosService.registrarPropietarioAnterior({
        ...value,
        usuarioRegistro: req.user?.UsuarioID,
      });

      res.status(201).json(resultado);
    } catch (error: any) {
      console.error('Error en registrarPropietarioAnterior:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar propietario anterior',
        error: error.message,
      });
    }
  }

  /**
   * POST /api/vehiculos/:id/propietarios/actual
   * Registrar propietario actual (yo)
   */
  static async registrarPropietarioActual(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehiculoID = parseInt(req.params.id);
      const { error, value } = registrarPropietarioActualSchema.validate({
        ...req.body,
        vehiculoID,
      });

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Error en los datos proporcionados',
          errors: error.details.map((d) => d.message),
        });
        return;
      }

      const resultado = await HistorialPropietariosService.registrarPropietarioActual({
        ...value,
        usuarioRegistro: req.user?.UsuarioID,
      });

      res.status(201).json(resultado);
    } catch (error: any) {
      console.error('Error en registrarPropietarioActual:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar propietario actual',
        error: error.message,
      });
    }
  }

  /**
   * POST /api/vehiculos/:id/propietarios/traspaso
   * Registrar traspaso a mi nombre
   */
  static async registrarTraspaso(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehiculoID = parseInt(req.params.id);
      const { error, value } = registrarTraspasoSchema.validate({
        ...req.body,
        vehiculoID,
      });

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Error en los datos proporcionados',
          errors: error.details.map((d) => d.message),
        });
        return;
      }

      const resultado = await HistorialPropietariosService.registrarTraspaso(value);

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en registrarTraspaso:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar traspaso',
        error: error.message,
      });
    }
  }

  /**
   * POST /api/vehiculos/:id/propietarios/venta
   * Registrar venta del vehículo
   */
  static async registrarVenta(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehiculoID = parseInt(req.params.id);
      const { error, value } = registrarVentaSchema.validate({
        ...req.body,
        vehiculoID,
      });

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Error en los datos proporcionados',
          errors: error.details.map((d) => d.message),
        });
        return;
      }

      const resultado = await HistorialPropietariosService.registrarVenta({
        ...value,
        usuarioRegistro: req.user?.UsuarioID,
      });

      res.status(201).json(resultado);
    } catch (error: any) {
      console.error('Error en registrarVenta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar venta',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/vehiculos/:id/propietarios
   * Obtener historial completo de propietarios
   */
  static async obtenerHistorial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehiculoID = parseInt(req.params.id);

      if (isNaN(vehiculoID)) {
        res.status(400).json({
          success: false,
          message: 'ID de vehículo inválido',
        });
        return;
      }

      const resultado = await HistorialPropietariosService.obtenerHistorial(vehiculoID);

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en obtenerHistorial:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener historial',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/vehiculos/:id/propietarios/actual
   * Obtener propietario actual
   */
  static async obtenerPropietarioActual(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vehiculoID = parseInt(req.params.id);

      if (isNaN(vehiculoID)) {
        res.status(400).json({
          success: false,
          message: 'ID de vehículo inválido',
        });
        return;
      }

      const resultado = await HistorialPropietariosService.obtenerPropietarioActual(vehiculoID);

      if (!resultado.success) {
        res.status(404).json(resultado);
        return;
      }

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en obtenerPropietarioActual:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener propietario actual',
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/vehiculos/:vehiculoId/propietarios/:historialId
   * Actualizar registro de historial
   */
  static async actualizarHistorial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const historialID = parseInt(req.params.historialId);

      if (isNaN(historialID)) {
        res.status(400).json({
          success: false,
          message: 'ID de historial inválido',
        });
        return;
      }

      const { error, value } = actualizarHistorialSchema.validate(req.body);

      if (error) {
        res.status(400).json({
          success: false,
          message: 'Error en los datos proporcionados',
          errors: error.details.map((d) => d.message),
        });
        return;
      }

      const resultado = await HistorialPropietariosService.actualizarHistorial(historialID, value);

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en actualizarHistorial:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar historial',
        error: error.message,
      });
    }
  }

  /**
   * DELETE /api/vehiculos/:vehiculoId/propietarios/:historialId
   * Eliminar registro de historial
   */
  static async eliminarHistorial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const historialID = parseInt(req.params.historialId);

      if (isNaN(historialID)) {
        res.status(400).json({
          success: false,
          message: 'ID de historial inválido',
        });
        return;
      }

      const resultado = await HistorialPropietariosService.eliminarHistorial(historialID);

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en eliminarHistorial:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar historial',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/vehiculos/sin-traspaso
   * Obtener vehículos sin traspaso realizado
   */
  static async obtenerVehiculosSinTraspaso(req: AuthRequest, res: Response): Promise<void> {
    try {
      const resultado = await HistorialPropietariosService.obtenerVehiculosSinTraspaso();

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en obtenerVehiculosSinTraspaso:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener vehículos sin traspaso',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/historial-ventas
   * Obtener historial de ventas
   */
  static async obtenerHistorialVentas(req: AuthRequest, res: Response): Promise<void> {
    try {
      const filtros = {
        fechaInicio: req.query.fechaInicio ? new Date(req.query.fechaInicio as string) : undefined,
        fechaFin: req.query.fechaFin ? new Date(req.query.fechaFin as string) : undefined,
        limite: req.query.limite ? parseInt(req.query.limite as string) : undefined,
      };

      const resultado = await HistorialPropietariosService.obtenerHistorialVentas(filtros);

      res.json(resultado);
    } catch (error: any) {
      console.error('Error en obtenerHistorialVentas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener historial de ventas',
        error: error.message,
      });
    }
  }
}
