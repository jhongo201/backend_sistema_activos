import { Request, Response } from 'express';
import Mantenimiento from '../models/Mantenimiento.model';
import Vehiculo from '../models/Vehiculo.model';

export const mantenimientoController = {
  // Obtener todos los mantenimientos (con filtros)
  getAll: async (req: Request, res: Response) => {
    try {
      const { vehiculoId, tipo, estado, page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (vehiculoId) where.VehiculoID = vehiculoId;
      if (tipo) where.TipoMantenimiento = tipo;
      if (estado) where.Estado = estado;

      const { count, rows } = await Mantenimiento.findAndCountAll({
        where,
        include: [
          {
            model: Vehiculo,
            as: 'Vehiculo',
            attributes: ['VehiculoID', 'Placa', 'Marca', 'Linea', 'Modelo'],
          },
        ],
        order: [['FechaMantenimiento', 'DESC']],
        limit: Number(limit),
        offset,
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Error al obtener mantenimientos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los mantenimientos',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Obtener mantenimientos de un vehículo
  getByVehiculo: async (req: Request, res: Response) => {
    try {
      const { vehiculoId } = req.params;

      const mantenimientos = await Mantenimiento.findAll({
        where: { VehiculoID: vehiculoId },
        order: [['FechaMantenimiento', 'DESC']],
      });

      res.json({
        success: true,
        data: mantenimientos,
      });
    } catch (error) {
      console.error('Error al obtener mantenimientos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los mantenimientos',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Obtener un mantenimiento por ID
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const mantenimiento = await Mantenimiento.findByPk(id, {
        include: [
          {
            model: Vehiculo,
            as: 'Vehiculo',
          },
        ],
      });

      if (!mantenimiento) {
        return res.status(404).json({
          success: false,
          message: 'Mantenimiento no encontrado',
        });
      }

      res.json({
        success: true,
        data: mantenimiento,
      });
    } catch (error) {
      console.error('Error al obtener mantenimiento:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el mantenimiento',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Crear mantenimiento
  create: async (req: Request, res: Response) => {
    try {
      const data = { ...req.body };

      // Sanitizar fechas: convertir strings vacíos a null
      if (data.FechaMantenimiento === '' || data.FechaMantenimiento === undefined) {
        data.FechaMantenimiento = new Date();
      }
      if (data.ProximoMantenimientoFecha === '' || data.ProximoMantenimientoFecha === undefined) {
        data.ProximoMantenimientoFecha = null;
      }

      // Convertir strings vacíos a null para campos numéricos opcionales
      if (data.KilometrajeMantenimiento === '' || data.KilometrajeMantenimiento === undefined) {
        data.KilometrajeMantenimiento = null;
      }
      if (data.ProximoMantenimientoKm === '' || data.ProximoMantenimientoKm === undefined) {
        data.ProximoMantenimientoKm = null;
      }
      if (data.CostoMantenimiento === '' || data.CostoMantenimiento === undefined) {
        data.CostoMantenimiento = null;
      }

      const mantenimiento = await Mantenimiento.create(data);

      res.status(201).json({
        success: true,
        message: 'Mantenimiento creado correctamente',
        data: mantenimiento,
      });
    } catch (error) {
      console.error('Error al crear mantenimiento:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el mantenimiento',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Actualizar mantenimiento
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const mantenimiento = await Mantenimiento.findByPk(id);

      if (!mantenimiento) {
        return res.status(404).json({
          success: false,
          message: 'Mantenimiento no encontrado',
        });
      }

      const data = { ...req.body };

      // Sanitizar fechas: convertir strings vacíos a null
      if (data.FechaMantenimiento === '') {
        data.FechaMantenimiento = null;
      }
      if (data.ProximoMantenimientoFecha === '' || data.ProximoMantenimientoFecha === undefined) {
        data.ProximoMantenimientoFecha = null;
      }

      // Convertir strings vacíos a null para campos numéricos opcionales
      if (data.KilometrajeMantenimiento === '' || data.KilometrajeMantenimiento === undefined) {
        data.KilometrajeMantenimiento = null;
      }
      if (data.ProximoMantenimientoKm === '' || data.ProximoMantenimientoKm === undefined) {
        data.ProximoMantenimientoKm = null;
      }
      if (data.CostoMantenimiento === '' || data.CostoMantenimiento === undefined) {
        data.CostoMantenimiento = null;
      }

      await mantenimiento.update(data);

      res.json({
        success: true,
        message: 'Mantenimiento actualizado correctamente',
        data: mantenimiento,
      });
    } catch (error) {
      console.error('Error al actualizar mantenimiento:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el mantenimiento',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Eliminar mantenimiento
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const mantenimiento = await Mantenimiento.findByPk(id);

      if (!mantenimiento) {
        return res.status(404).json({
          success: false,
          message: 'Mantenimiento no encontrado',
        });
      }

      await mantenimiento.destroy();

      res.json({
        success: true,
        message: 'Mantenimiento eliminado correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar mantenimiento:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el mantenimiento',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Obtener próximos mantenimientos
  getProximos: async (req: Request, res: Response) => {
    try {
      const hoy = new Date();
      const treintaDias = new Date();
      treintaDias.setDate(hoy.getDate() + 30);

      const mantenimientos = await Mantenimiento.findAll({
        where: {
          Estado: 'Programado',
          ProximoMantenimientoFecha: {
            $between: [hoy, treintaDias],
          },
        },
        include: [
          {
            model: Vehiculo,
            as: 'Vehiculo',
            attributes: ['VehiculoID', 'Placa', 'Marca', 'Linea'],
          },
        ],
        order: [['ProximoMantenimientoFecha', 'ASC']],
      });

      res.json({
        success: true,
        data: mantenimientos,
      });
    } catch (error) {
      console.error('Error al obtener próximos mantenimientos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los próximos mantenimientos',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },
};
