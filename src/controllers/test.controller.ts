import { Request, Response } from 'express';
import Usuario from '../models/Usuario.model';
import sequelize from '../config/database';

export class TestController {
  /**
   * GET /api/test/db
   * Verificar conexión a base de datos
   */
  static async testDatabase(req: Request, res: Response): Promise<void> {
    try {
      await sequelize.authenticate();
      res.json({
        success: true,
        message: 'Conexión a BD exitosa',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error de conexión',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/test/usuarios
   * Listar todos los usuarios (solo para testing)
   */
  static async listarUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await Usuario.findAll({
        attributes: ['UsuarioID', 'Nombre', 'Email', 'Rol', 'Estado'],
      });

      res.json({
        success: true,
        total: usuarios.length,
        usuarios,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al listar usuarios',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/test/usuario/:email
   * Buscar usuario por email
   */
  static async buscarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;

      const usuario = await Usuario.findOne({
        where: { Email: email },
        attributes: ['UsuarioID', 'Nombre', 'Email', 'Rol', 'Estado', 'Password'],
      });

      if (!usuario) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
        return;
      }

      res.json({
        success: true,
        usuario: {
          UsuarioID: usuario.UsuarioID,
          Nombre: usuario.Nombre,
          Email: usuario.Email,
          Rol: usuario.Rol,
          Estado: usuario.Estado,
          PasswordHash: usuario.Password.substring(0, 20) + '...',
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error al buscar usuario',
        error: error.message,
      });
    }
  }
}

export default TestController;
