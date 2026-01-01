import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

/**
 * Middleware para verificar token JWT
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
      return;
    }

    // Extraer token
    const token = authHeader.substring(7); // Remueve "Bearer "

    // Verificar token
    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
      });
      return;
    }

    // Agregar información del usuario a la request
    (req as any).user = decoded;

    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error);
    res.status(500).json({
      success: false,
      message: 'Error en autenticación',
    });
  }
};

// Alias para compatibilidad
export const authenticateToken = authMiddleware;

export default authMiddleware;
