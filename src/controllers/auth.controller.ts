import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  /**
   * POST /api/auth/login
   * Login de usuario
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validación básica
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos',
        });
        return;
      }

      // Intentar login
      const result = await AuthService.login({ email, password });

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('Error en login controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }

  /**
   * GET /api/auth/me
   * Obtener información del usuario actual
   */
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      // El usuario viene del middleware de autenticación
      const usuarioID = (req as any).usuario?.UsuarioID;

      if (!usuarioID) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const usuario = await AuthService.getCurrentUser(usuarioID);

      if (!usuario) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        usuario,
      });
    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Logout (principalmente para limpiar en frontend)
   */
  static async logout(req: Request, res: Response): Promise<void> {
    // En JWT, el logout es manejado en el cliente
    // Aquí solo confirmamos
    res.status(200).json({
      success: true,
      message: 'Logout exitoso',
    });
  }
}

export default AuthController;
