import jwt from 'jsonwebtoken';
import { QueryTypes } from 'sequelize';
import Usuario from '../models/Usuario.model';
import Rol from '../models/Rol.model';
import { jwtConfig } from '../config/jwt';
import sequelize from '../config/database';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  usuario?: {
    UsuarioID: number;
    Nombre: string;
    Email: string;
    RolID: number;
    Rol: {
      RolID: number;
      Nombre: string;
      Permisos: any;
    };
  };
  message?: string;
}

export class AuthService {
  /**
   * Autenticar usuario
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      console.log('🔍 Intentando login para:', email);

      // Primero intentar buscar solo el usuario sin el join
      let usuario;
      try {
        usuario = await Usuario.findOne({
          where: { Email: email, Activo: true },
        });

        console.log('👤 Usuario encontrado (sin rol):', usuario ? 'Sí' : 'No');

        // Si se encontró el usuario, cargar el rol por separado
        if (usuario) {
          const rol = await Rol.findByPk(usuario.RolID);
          (usuario as any).Rol = rol;
          console.log('🎭 Rol cargado:', rol ? rol.Nombre : 'No encontrado');
        }
      } catch (error: any) {
        console.error('❌ Error en query findOne:', error.message);
        console.error('❌ Error original:', error.original);
        console.error('❌ Error completo:', JSON.stringify(error, null, 2));
        console.error('❌ Error name:', error.name);
        throw error;
      }

      console.log('👤 Usuario encontrado:', usuario ? 'Sí' : 'No');

      if (!usuario) {
        console.log('❌ Usuario no encontrado o inactivo');
        return {
          success: false,
          message: 'Credenciales inválidas',
        };
      }

      console.log('🔐 Verificando contraseña...');
      
      // Verificar contraseña
      const passwordMatch = await usuario.comparePassword(password);

      console.log('🔑 Contraseña válida:', passwordMatch ? 'Sí' : 'No');

      if (!passwordMatch) {
        console.log('❌ Contraseña incorrecta');
        return {
          success: false,
          message: 'Credenciales inválidas',
        };
      }

      console.log('📅 Actualizando último acceso...');
      
      // Actualizar último acceso
      await sequelize.query(
        'UPDATE Usuarios SET UltimoAcceso = GETDATE() WHERE UsuarioID = :usuarioID',
        {
          replacements: { usuarioID: usuario.UsuarioID },
          type: QueryTypes.UPDATE,
        }
      );

      console.log('🎫 Generando token JWT...');

      const rol = (usuario as any).Rol;
      
      // Generar token JWT
      const token = jwt.sign(
        {
          UsuarioID: usuario.UsuarioID,
          Email: usuario.Email,
          RolID: usuario.RolID,
          RolNombre: rol?.Nombre,
        },
        jwtConfig.secret,
        {
          expiresIn: jwtConfig.expiresIn,
        }
      );

      console.log('✅ Login exitoso para:', email);

      return {
        success: true,
        token,
        usuario: {
          UsuarioID: usuario.UsuarioID,
          Nombre: usuario.Nombre,
          Email: usuario.Email,
          RolID: usuario.RolID,
          Rol: {
            RolID: rol?.RolID || 0,
            Nombre: rol?.Nombre || 'Sin rol',
            Permisos: rol?.Permisos ? JSON.parse(rol.Permisos) : {},
          },
        },
      };
    } catch (error: any) {
      console.error('❌ Error en login:', error.message);
      console.error('Stack:', error.stack);
      return {
        success: false,
        message: 'Error en el servidor',
      };
    }
  }

  /**
   * Verificar token JWT
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, jwtConfig.secret);
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtener información del usuario actual
   */
  static async getCurrentUser(usuarioID: number): Promise<any> {
    try {
      const usuario = await Usuario.findByPk(usuarioID, {
        attributes: ['UsuarioID', 'Nombre', 'Email', 'RolID', 'Activo'],
        include: [
          {
            model: Rol,
            as: 'Rol',
            attributes: ['RolID', 'Nombre', 'Permisos'],
          },
        ],
      });

      if (!usuario || !usuario.Activo) {
        return null;
      }

      return usuario;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }
}

export default AuthService;
