import { Request, Response, NextFunction } from 'express';

type UserRole = 'Admin' | 'Contador' | 'Operador' | 'Consulta';

/**
 * Middleware para verificar que el usuario tenga uno de los roles permitidos
 * @param roles - Array de roles permitidos
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      // Verificar si el rol del usuario está en la lista de roles permitidos
      const userRole = user.Rol || user.RolNombre;
      
      if (!roles.includes(userRole)) {
        console.log(`❌ Acceso denegado. Rol del usuario: "${userRole}", Roles permitidos:`, roles);
        res.status(403).json({
          success: false,
          message: 'No tiene permisos para realizar esta acción',
        });
        return;
      }
      
      console.log(`✅ Acceso permitido. Rol del usuario: "${userRole}"`);

      next();
    } catch (error) {
      console.error('Error en requireRole middleware:', error);
      res.status(500).json({
        success: false,
        message: 'Error en verificación de permisos',
      });
    }
  };
};

/**
 * Middleware para verificar que el usuario sea Admin
 */
export const requireAdmin = requireRole('Admin');

/**
 * Middleware para verificar que el usuario sea Admin o Contador
 */
export const requireAdminOrContador = requireRole('Admin', 'Contador');

export default requireRole;
