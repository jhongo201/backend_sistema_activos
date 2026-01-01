import { Request, Response } from 'express';
import HistorialCambio from '../models/HistorialCambio.model';
import Usuario from '../models/Usuario.model';

export const historialController = {
  // Obtener historial de un activo específico
  getHistorialByActivo: async (req: Request, res: Response) => {
    try {
      const { activoId, tipoActivo } = req.params;

      const historial = await HistorialCambio.findAll({
        where: {
          ActivoID: activoId,
          TipoActivo: tipoActivo,
        },
        include: [
          {
            model: Usuario,
            as: 'Usuario',
            attributes: ['UsuarioID', 'Nombre', 'Email'],
          },
        ],
        order: [['FechaCambio', 'DESC']],
      });

      res.json({
        success: true,
        data: historial,
      });
    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el historial',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Crear registro de historial
  createHistorial: async (req: Request, res: Response) => {
    try {
      const {
        ActivoID,
        TipoActivo,
        TipoCambio,
        CampoModificado,
        ValorAnterior,
        ValorNuevo,
        Descripcion,
        UsuarioID,
      } = req.body;

      const historial = await HistorialCambio.create({
        ActivoID,
        TipoActivo,
        TipoCambio,
        CampoModificado,
        ValorAnterior,
        ValorNuevo,
        Descripcion,
        UsuarioID,
        FechaCambio: new Date(),
      });

      res.status(201).json({
        success: true,
        message: 'Registro de historial creado correctamente',
        data: historial,
      });
    } catch (error) {
      console.error('Error al crear historial:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el registro de historial',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Obtener todo el historial (con filtros opcionales)
  getAllHistorial: async (req: Request, res: Response) => {
    try {
      const { tipoActivo, tipoCambio, fechaDesde, fechaHasta } = req.query;

      const where: any = {};

      if (tipoActivo) where.TipoActivo = tipoActivo;
      if (tipoCambio) where.TipoCambio = tipoCambio;
      if (fechaDesde && fechaHasta) {
        where.FechaCambio = {
          $between: [new Date(fechaDesde as string), new Date(fechaHasta as string)],
        };
      }

      const historial = await HistorialCambio.findAll({
        where,
        include: [
          {
            model: Usuario,
            as: 'Usuario',
            attributes: ['UsuarioID', 'Nombre', 'Email'],
          },
        ],
        order: [['FechaCambio', 'DESC']],
        limit: 100,
      });

      res.json({
        success: true,
        data: historial,
      });
    } catch (error) {
      console.error('Error al obtener historial:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el historial',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },
};
