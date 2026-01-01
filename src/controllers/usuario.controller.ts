import { Request, Response } from 'express';
import Usuario from '../models/Usuario.model';
import Rol from '../models/Rol.model';
import Auditoria from '../models/Auditoria.model';

export const usuarioController = {
  // Obtener todos los usuarios
  getAll: async (req: Request, res: Response) => {
    try {
      const { activo, rolId, page = 1, limit = 10 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (activo !== undefined) where.Activo = activo === 'true';
      if (rolId) where.RolID = rolId;

      const { count, rows } = await Usuario.findAndCountAll({
        where,
        include: [
          {
            model: Rol,
            as: 'Rol',
            attributes: ['RolID', 'Nombre', 'Descripcion'],
          },
        ],
        attributes: { exclude: ['Password'] },
        order: [['Nombre', 'ASC']],
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
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los usuarios',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Obtener usuario por ID
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id, {
        include: [
          {
            model: Rol,
            as: 'Rol',
            attributes: ['RolID', 'Nombre', 'Descripcion', 'Permisos'],
          },
        ],
        attributes: { exclude: ['Password'] },
      });

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      res.json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Crear usuario
  create: async (req: Request, res: Response) => {
    try {
      const { Nombre, Email, Password, RolID, Telefono, Direccion, FechaNacimiento } = req.body;

      // Verificar si el email ya existe
      const existeEmail = await Usuario.findOne({ where: { Email } });
      if (existeEmail) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado',
        });
      }

      // Crear usuario
      const usuario = await Usuario.create({
        Nombre,
        Email,
        Password,
        RolID: RolID || 4, // Consulta por defecto
        Telefono,
        Direccion,
        FechaNacimiento,
        Activo: true,
      });

      // Registrar en auditoría
      await Auditoria.create({
        UsuarioID: (req as any).user?.UsuarioID || usuario.UsuarioID,
        Accion: 'Crear',
        Modulo: 'Usuarios',
        TablaAfectada: 'Usuarios',
        RegistroID: usuario.UsuarioID,
        DetallesDespues: JSON.stringify({ Nombre, Email, RolID }),
        IP: req.ip,
        UserAgent: req.get('User-Agent'),
        FechaHora: new Date(),
      });

      // Obtener usuario con rol
      const usuarioCreado = await Usuario.findByPk(usuario.UsuarioID, {
        include: [{ model: Rol, as: 'Rol' }],
        attributes: { exclude: ['Password'] },
      });

      res.status(201).json({
        success: true,
        message: 'Usuario creado correctamente',
        data: usuarioCreado,
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Actualizar usuario
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { Nombre, Email, RolID, Telefono, Direccion, FechaNacimiento, Activo, Password } = req.body;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      // Guardar datos anteriores para auditoría
      const datosAntes = {
        Nombre: usuario.Nombre,
        Email: usuario.Email,
        RolID: usuario.RolID,
        Activo: usuario.Activo,
      };

      // Si se cambia el email, verificar que no exista
      if (Email && Email !== usuario.Email) {
        const existeEmail = await Usuario.findOne({ where: { Email } });
        if (existeEmail) {
          return res.status(400).json({
            success: false,
            message: 'El email ya está registrado',
          });
        }
      }

      // Actualizar usuario
      const updateData: any = {};
      if (Nombre) updateData.Nombre = Nombre;
      if (Email) updateData.Email = Email;
      if (RolID) updateData.RolID = RolID;
      if (Telefono !== undefined) updateData.Telefono = Telefono;
      if (Direccion !== undefined) updateData.Direccion = Direccion;
      if (FechaNacimiento) updateData.FechaNacimiento = FechaNacimiento;
      if (Activo !== undefined) updateData.Activo = Activo;
      if (Password) updateData.Password = Password;

      await usuario.update(updateData);

      // Registrar en auditoría
      await Auditoria.create({
        UsuarioID: (req as any).user?.UsuarioID || Number(id),
        Accion: 'Editar',
        Modulo: 'Usuarios',
        TablaAfectada: 'Usuarios',
        RegistroID: Number(id),
        DetallesAntes: JSON.stringify(datosAntes),
        DetallesDespues: JSON.stringify(updateData),
        IP: req.ip,
        UserAgent: req.get('User-Agent'),
        FechaHora: new Date(),
      });

      // Obtener usuario actualizado
      const usuarioActualizado = await Usuario.findByPk(id, {
        include: [{ model: Rol, as: 'Rol' }],
        attributes: { exclude: ['Password'] },
      });

      res.json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: usuarioActualizado,
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Eliminar usuario (soft delete)
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      // Soft delete
      await usuario.update({ Activo: false });

      // Registrar en auditoría
      await Auditoria.create({
        UsuarioID: (req as any).user?.UsuarioID || Number(id),
        Accion: 'Eliminar',
        Modulo: 'Usuarios',
        TablaAfectada: 'Usuarios',
        RegistroID: Number(id),
        DetallesAntes: JSON.stringify({ Nombre: usuario.Nombre, Email: usuario.Email }),
        IP: req.ip,
        UserAgent: req.get('User-Agent'),
        FechaHora: new Date(),
      });

      res.json({
        success: true,
        message: 'Usuario eliminado correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el usuario',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Cambiar contraseña
  changePassword: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { passwordActual, passwordNuevo } = req.body;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado',
        });
      }

      // Verificar contraseña actual
      const passwordValido = await usuario.comparePassword(passwordActual);
      if (!passwordValido) {
        return res.status(400).json({
          success: false,
          message: 'Contraseña actual incorrecta',
        });
      }

      // Actualizar contraseña
      await usuario.update({ Password: passwordNuevo });

      // Registrar en auditoría
      await Auditoria.create({
        UsuarioID: Number(id),
        Accion: 'Editar',
        Modulo: 'Usuarios',
        TablaAfectada: 'Usuarios',
        RegistroID: Number(id),
        DetallesDespues: JSON.stringify({ accion: 'Cambio de contraseña' }),
        IP: req.ip,
        UserAgent: req.get('User-Agent'),
        FechaHora: new Date(),
      });

      res.json({
        success: true,
        message: 'Contraseña actualizada correctamente',
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cambiar la contraseña',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },
};