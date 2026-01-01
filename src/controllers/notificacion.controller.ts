import { Request, Response } from 'express';
import Notificacion from '../models/Notificacion.model';
import NotificacionService from '../services/notificacion.service';
import { Op } from 'sequelize';

/**
 * Obtener todas las notificaciones del usuario
 */
export const getAll = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;
    const { leida, tipo, limit = 50, offset = 0 } = req.query;

    const whereClause: any = { UsuarioID: usuarioId };

    if (leida !== undefined) {
      whereClause.Leida = leida === 'true';
    }

    if (tipo) {
      whereClause.Tipo = tipo;
    }

    const notificaciones = await Notificacion.findAndCountAll({
      where: whereClause,
      order: [['FechaCreacion', 'DESC']],
      limit: Number(limit),
      offset: Number(offset)
    });

    // Parsear MetaData de JSON string a objeto
    const notificacionesConMetaData = notificaciones.rows.map(n => ({
      ...n.toJSON(),
      MetaData: n.MetaData ? JSON.parse(n.MetaData) : null
    }));

    res.json({
      success: true,
      data: notificacionesConMetaData,
      total: notificaciones.count,
      limit: Number(limit),
      offset: Number(offset)
    });
  } catch (error: any) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener notificaciones',
      error: error.message
    });
  }
};

/**
 * Obtener notificaciones no leídas
 */
export const getUnread = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;

    const notificaciones = await Notificacion.findAll({
      where: {
        UsuarioID: usuarioId,
        Leida: false
      },
      order: [['FechaCreacion', 'DESC']]
    });

    const notificacionesConMetaData = notificaciones.map(n => ({
      ...n.toJSON(),
      MetaData: n.MetaData ? JSON.parse(n.MetaData) : null
    }));

    res.json({
      success: true,
      data: notificacionesConMetaData,
      count: notificaciones.length
    });
  } catch (error: any) {
    console.error('Error al obtener notificaciones no leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener notificaciones no leídas',
      error: error.message
    });
  }
};

/**
 * Obtener contador de no leídas
 */
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;

    const count = await Notificacion.count({
      where: {
        UsuarioID: usuarioId,
        Leida: false
      }
    });

    res.json({
      success: true,
      count
    });
  } catch (error: any) {
    console.error('Error al obtener contador:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener contador',
      error: error.message
    });
  }
};

/**
 * Marcar notificación como leída
 */
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuarioId = (req as any).user.UsuarioID;

    const notificacion = await Notificacion.findOne({
      where: {
        NotificacionID: id,
        UsuarioID: usuarioId
      }
    });

    if (!notificacion) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    await notificacion.update({
      Leida: true,
      FechaLeida: new Date()
    });

    res.json({
      success: true,
      message: 'Notificación marcada como leída',
      data: notificacion
    });
  } catch (error: any) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar notificación',
      error: error.message
    });
  }
};

/**
 * Marcar todas como leídas
 */
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;

    await Notificacion.update(
      {
        Leida: true,
        FechaLeida: new Date()
      },
      {
        where: {
          UsuarioID: usuarioId,
          Leida: false
        }
      }
    );

    res.json({
      success: true,
      message: 'Todas las notificaciones marcadas como leídas'
    });
  } catch (error: any) {
    console.error('Error al marcar todas como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar todas como leídas',
      error: error.message
    });
  }
};

/**
 * Eliminar notificación
 */
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuarioId = (req as any).user.UsuarioID;

    const eliminada = await Notificacion.destroy({
      where: {
        NotificacionID: id,
        UsuarioID: usuarioId
      }
    });

    if (!eliminada) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Notificación eliminada'
    });
  } catch (error: any) {
    console.error('Error al eliminar notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar notificación',
      error: error.message
    });
  }
};

/**
 * Crear notificación (solo para testing)
 */
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { UsuarioID, Tipo, Titulo, Mensaje, Icono, Color, Url, MetaData } = req.body;

    const notificacion = await NotificacionService.crearNotificacion({
      UsuarioID,
      Tipo,
      Titulo,
      Mensaje,
      Icono,
      Color,
      Url,
      MetaData
    });

    res.json({
      success: true,
      message: 'Notificación creada',
      data: notificacion
    });
  } catch (error: any) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear notificación',
      error: error.message
    });
  }
};

/**
 * Verificar vencimientos manualmente (endpoint de prueba/cron)
 */
export const verificarVencimientos = async (req: Request, res: Response) => {
  try {
    await NotificacionService.verificarVencimientosVehiculos();
    await NotificacionService.verificarVencimientosPropiedades();
    await NotificacionService.verificarMantenimientosProximos();

    res.json({
      success: true,
      message: 'Verificación de vencimientos completada'
    });
  } catch (error: any) {
    console.error('Error al verificar vencimientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar vencimientos',
      error: error.message
    });
  }
};