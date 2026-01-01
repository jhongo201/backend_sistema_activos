import { Request, Response, NextFunction } from 'express';
import Usuario from '../models/Usuario.model';
import Rol from '../models/Rol.model';

/**
 * Middleware para verificar permisos específicos
 * @param modulo - Nombre del módulo (ej: 'vehiculos', 'usuarios')
 * @param accion - Acción a verificar (ej: 'ver', 'crear', 'editar', 'eliminar')
 */
export const checkPermission = (modulo: string, accion: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;

      if (!user || !user.UsuarioID) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      // Obtener usuario con su rol y permisos
      const usuario = await Usuario.findByPk(user.UsuarioID, {
        include: [
          {
            model: Rol,
            as: 'Rol',
            attributes: ['RolID', 'Nombre', 'Permisos'],
          },
        ],
      });

      if (!usuario) {
        res.status(401).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      if (!usuario.Activo) {
        res.status(403).json({
          success: false,
          message: 'Usuario inactivo',
        });
        return;
      }

      const rol = (usuario as any).Rol;
      if (!rol) {
        res.status(403).json({
          success: false,
          message: 'Usuario sin rol asignado',
        });
        return;
      }

      // Parsear permisos
      let permisos: any = {};
      try {
        permisos = JSON.parse(rol.Permisos);
      } catch (error) {
        console.error('Error al parsear permisos:', error);
        res.status(500).json({
          success: false,
          message: 'Error al verificar permisos',
        });
        return;
      }

      // Verificar si el módulo existe en los permisos
      if (!permisos[modulo]) {
        res.status(403).json({
          success: false,
          message: `No tiene acceso al módulo ${modulo}`,
        });
        return;
      }

      // Verificar si tiene el permiso específico
      if (!permisos[modulo][accion]) {
        res.status(403).json({
          success: false,
          message: `No tiene permiso para ${accion} en ${modulo}`,
        });
        return;
      }

      // Usuario tiene el permiso, continuar
      next();
    } catch (error) {
      console.error('Error en checkPermission:', error);
      res.status(500).json({
        success: false,
        message: 'Error al verificar permisos',
      });
    }
  };
};

/**
 * Middleware para verificar si el usuario tiene uno de los roles especificados
 * @param roles - Array de nombres de roles permitidos
 */
export const checkRole = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;

      if (!user || !user.UsuarioID) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      // Obtener usuario con su rol
      const usuario = await Usuario.findByPk(user.UsuarioID, {
        include: [
          {
            model: Rol,
            as: 'Rol',
            attributes: ['RolID', 'Nombre'],
          },
        ],
      });

      if (!usuario) {
        res.status(401).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      const rol = (usuario as any).Rol;
      if (!rol || !roles.includes(rol.Nombre)) {
        res.status(403).json({
          success: false,
          message: 'No tiene permisos suficientes',
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Error en checkRole:', error);
      res.status(500).json({
        success: false,
        message: 'Error al verificar rol',
      });
    }
  };
};

export default { checkPermission, checkRole };
