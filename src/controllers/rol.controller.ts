import { Request, Response } from 'express';
import Rol from '../models/Rol.model';
import Usuario from '../models/Usuario.model';
import Auditoria from '../models/Auditoria.model';

// Estructura de permisos por defecto
const permisosDefault = {
  dashboard: { ver: true },
  vehiculos: { ver: false, crear: false, editar: false, eliminar: false },
  propiedades: { ver: false, crear: false, editar: false, eliminar: false },
  mantenimientos: { ver: false, crear: false, editar: false, eliminar: false },
  usuarios: { ver: false, crear: false, editar: false, eliminar: false },
  roles: { ver: false, crear: false, editar: false, eliminar: false },
  reportes: { ver: false, exportar: false },
  auditoria: { ver: false },
};

export const rolController = {
  // Obtener todos los roles
  getAll: async (req: Request, res: Response) => {
    try {
      const { activo } = req.query;

      const where: any = {};
      if (activo !== undefined) where.Activo = activo === 'true';

      const roles = await Rol.findAll({
        where,
        order: [['Nombre', 'ASC']],
      });

      // Parsear permisos JSON
      const rolesConPermisos = roles.map(rol => ({
        ...rol.toJSON(),
        Permisos: JSON.parse(rol.Permisos),
      }));

      res.json({
        success: true,
        data: rolesConPermisos,
      });
    } catch (error) {
      console.error('Error al obtener roles:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los roles',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Obtener rol por ID
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const rol = await Rol.findByPk(id);

      if (!rol) {
        return res.status(404).json({
          success: false,
          message: 'Rol no encontrado',
        });
      }

      res.json({
        success: true,
        data: {
          ...rol.toJSON(),
          Permisos: JSON.parse(rol.Permisos),
        },
      });
    } catch (error) {
      console.error('Error al obtener rol:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el rol',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Crear rol
  create: async (req: Request, res: Response) => {
    try {
      const { Nombre, Descripcion, Permisos } = req.body;

      // Verificar si el rol ya existe
      const existeRol = await Rol.findOne({ where: { Nombre } });
      if (existeRol) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un rol con ese nombre',
        });
      }

      // Crear rol
      const rol = await Rol.create({
        Nombre,
        Descripcion,
        Permisos: JSON.stringify(Permisos || permisosDefault),
        Activo: true,
      });

      // Registrar en auditoría
      await Auditoria.create({
        UsuarioID: (req as any).user?.UsuarioID,
        Accion: 'Crear',
        Modulo: 'Roles',
        TablaAfectada: 'Roles',
        RegistroID: rol.RolID,
        DetallesDespues: JSON.stringify({ Nombre, Descripcion }),
        IP: req.ip,
        UserAgent: req.get('User-Agent'),
        FechaHora: new Date(),
      });

      res.status(201).json({
        success: true,
        message: 'Rol creado correctamente',
        data: {
          ...rol.toJSON(),
          Permisos: JSON.parse(rol.Permisos),
        },
      });
    } catch (error) {
      console.error('Error al crear rol:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear el rol',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Actualizar rol
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { Nombre, Descripcion, Permisos, Activo } = req.body;

      const rol = await Rol.findByPk(id);

      if (!rol) {
        return res.status(404).json({
          success: false,
          message: 'Rol no encontrado',
        });
      }

      // No permitir editar roles del sistema (1-4)
      if (Number(id) <= 4) {
        return res.status(403).json({
          success: false,
          message: 'No se pueden editar los roles del sistema',
        });
      }

      // Guardar datos anteriores
      const datosAntes = {
        Nombre: rol.Nombre,
        Descripcion: rol.Descripcion,
        Permisos: JSON.parse(rol.Permisos),
      };

      // Actualizar
      const updateData: any = {};
      if (Nombre) updateData.Nombre = Nombre;
      if (Descripcion !== undefined) updateData.Descripcion = Descripcion;
      if (Permisos) updateData.Permisos = JSON.stringify(Permisos);
      if (Activo !== undefined) updateData.Activo = Activo;

      await rol.update(updateData);

      // Registrar en auditoría
      await Auditoria.create({
        UsuarioID: (req as any).user?.UsuarioID,
        Accion: 'Editar',
        Modulo: 'Roles',
        TablaAfectada: 'Roles',
        RegistroID: Number(id),
        DetallesAntes: JSON.stringify(datosAntes),
        DetallesDespues: JSON.stringify(updateData),
        IP: req.ip,
        UserAgent: req.get('User-Agent'),
        FechaHora: new Date(),
      });

      res.json({
        success: true,
        message: 'Rol actualizado correctamente',
        data: {
          ...rol.toJSON(),
          Permisos: JSON.parse(rol.Permisos),
        },
      });
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar el rol',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Eliminar rol
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const rol = await Rol.findByPk(id);

      if (!rol) {
        return res.status(404).json({
          success: false,
          message: 'Rol no encontrado',
        });
      }

      // No permitir eliminar roles del sistema (1-4)
      if (Number(id) <= 4) {
        return res.status(403).json({
          success: false,
          message: 'No se pueden eliminar los roles del sistema',
        });
      }

      // Verificar si hay usuarios con este rol
      const usuariosConRol = await Usuario.count({ where: { RolID: id } });
      if (usuariosConRol > 0) {
        return res.status(400).json({
          success: false,
          message: `No se puede eliminar el rol porque ${usuariosConRol} usuario(s) lo tienen asignado`,
        });
      }

      // Soft delete
      await rol.update({ Activo: false });

      // Registrar en auditoría
      await Auditoria.create({
        UsuarioID: (req as any).user?.UsuarioID,
        Accion: 'Eliminar',
        Modulo: 'Roles',
        TablaAfectada: 'Roles',
        RegistroID: Number(id),
        DetallesAntes: JSON.stringify({ Nombre: rol.Nombre }),
        IP: req.ip,
        UserAgent: req.get('User-Agent'),
        FechaHora: new Date(),
      });

      res.json({
        success: true,
        message: 'Rol eliminado correctamente',
      });
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el rol',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },

  // Inicializar roles por defecto
  initializeDefaultRoles: async (req: Request, res: Response) => {
    try {
      const rolesDefault = [
        {
          RolID: 1,
          Nombre: 'Admin',
          Descripcion: 'Administrador con todos los permisos',
          Permisos: JSON.stringify({
            dashboard: { ver: true },
            vehiculos: { ver: true, crear: true, editar: true, eliminar: true },
            propiedades: { ver: true, crear: true, editar: true, eliminar: true },
            mantenimientos: { ver: true, crear: true, editar: true, eliminar: true },
            usuarios: { ver: true, crear: true, editar: true, eliminar: true },
            roles: { ver: true, crear: true, editar: true, eliminar: true },
            reportes: { ver: true, exportar: true },
            auditoria: { ver: true },
          }),
        },
        {
          RolID: 2,
          Nombre: 'Contador',
          Descripcion: 'Contador con acceso a reportes y consultas',
          Permisos: JSON.stringify({
            dashboard: { ver: true },
            vehiculos: { ver: true, crear: false, editar: false, eliminar: false },
            propiedades: { ver: true, crear: false, editar: false, eliminar: false },
            mantenimientos: { ver: true, crear: false, editar: false, eliminar: false },
            usuarios: { ver: false, crear: false, editar: false, eliminar: false },
            roles: { ver: false, crear: false, editar: false, eliminar: false },
            reportes: { ver: true, exportar: true },
            auditoria: { ver: false },
          }),
        },
        {
          RolID: 3,
          Nombre: 'Operador',
          Descripcion: 'Operador con permisos de edición',
          Permisos: JSON.stringify({
            dashboard: { ver: true },
            vehiculos: { ver: true, crear: true, editar: true, eliminar: false },
            propiedades: { ver: true, crear: true, editar: true, eliminar: false },
            mantenimientos: { ver: true, crear: true, editar: true, eliminar: false },
            usuarios: { ver: false, crear: false, editar: false, eliminar: false },
            roles: { ver: false, crear: false, editar: false, eliminar: false },
            reportes: { ver: true, exportar: false },
            auditoria: { ver: false },
          }),
        },
        {
          RolID: 4,
          Nombre: 'Consulta',
          Descripcion: 'Solo lectura',
          Permisos: JSON.stringify({
            dashboard: { ver: true },
            vehiculos: { ver: true, crear: false, editar: false, eliminar: false },
            propiedades: { ver: true, crear: false, editar: false, eliminar: false },
            mantenimientos: { ver: true, crear: false, editar: false, eliminar: false },
            usuarios: { ver: false, crear: false, editar: false, eliminar: false },
            roles: { ver: false, crear: false, editar: false, eliminar: false },
            reportes: { ver: false, exportar: false },
            auditoria: { ver: false },
          }),
        },
      ];

      for (const rolData of rolesDefault) {
        const [rol] = await Rol.findOrCreate({
          where: { RolID: rolData.RolID },
          defaults: rolData,
        });
      }

      res.json({
        success: true,
        message: 'Roles por defecto inicializados correctamente',
      });
    } catch (error) {
      console.error('Error al inicializar roles:', error);
      res.status(500).json({
        success: false,
        message: 'Error al inicializar roles',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  },
};