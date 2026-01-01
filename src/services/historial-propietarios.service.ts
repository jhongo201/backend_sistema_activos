import HistorialPropietarios from '../models/HistorialPropietarios.model';
import Vehiculo from '../models/Vehiculo.model';
import Contrato from '../models/Contrato.model';
import Activo from '../models/Activo.model';
import { Op } from 'sequelize';

export class HistorialPropietariosService {
  /**
   * Registrar propietario anterior al momento de comprar un vehículo
   */
  static async registrarPropietarioAnterior(data: {
    vehiculoID: number;
    nombrePropietario: string;
    tipoDocumento?: string;
    numeroDocumento: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    ciudad?: string;
    fechaAdquisicion?: Date;
    valorCompra?: number;
    observaciones?: string;
    usuarioRegistro?: number;
  }) {
    try {
      // Verificar que el vehículo existe
      const vehiculo = await Vehiculo.findByPk(data.vehiculoID);
      if (!vehiculo) {
        throw new Error('Vehículo no encontrado');
      }

      // Crear registro del propietario anterior
      const historial = await HistorialPropietarios.create({
        VehiculoID: data.vehiculoID,
        TipoPropietario: 'Anterior',
        NombrePropietario: data.nombrePropietario,
        TipoDocumento: data.tipoDocumento || 'CC',
        NumeroDocumento: data.numeroDocumento,
        Telefono: data.telefono,
        Email: data.email,
        Direccion: data.direccion,
        Ciudad: data.ciudad,
        FechaAdquisicion: data.fechaAdquisicion,
        ValorCompra: data.valorCompra,
        TraspasoRealizado: false,
        EsPropietarioActual: false,
        Observaciones: data.observaciones,
        UsuarioRegistro: data.usuarioRegistro,
      });

      return {
        success: true,
        message: 'Propietario anterior registrado exitosamente',
        data: historial,
      };
    } catch (error: any) {
      throw new Error(`Error al registrar propietario anterior: ${error.message}`);
    }
  }

  /**
   * Registrar que el vehículo se puso a mi nombre (propietario actual)
   */
  static async registrarPropietarioActual(data: {
    vehiculoID: number;
    nombrePropietario: string;
    tipoDocumento?: string;
    numeroDocumento: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    ciudad?: string;
    fechaAdquisicion?: Date;
    valorCompra?: number;
    traspasoRealizado?: boolean;
    fechaTraspaso?: Date;
    numeroTraspaso?: string;
    organismoTransito?: string;
    contratoID?: number;
    observaciones?: string;
    usuarioRegistro?: number;
  }) {
    try {
      // Verificar que el vehículo existe
      const vehiculo = await Vehiculo.findByPk(data.vehiculoID);
      if (!vehiculo) {
        throw new Error('Vehículo no encontrado');
      }

      // VALIDACIÓN: Verificar que no haya otro propietario actual
      const propietarioActualExistente = await HistorialPropietarios.findOne({
        where: {
          VehiculoID: data.vehiculoID,
          EsPropietarioActual: true,
        },
      });

      if (propietarioActualExistente) {
        throw new Error('Ya existe un propietario actual para este vehículo. Primero debe registrar la venta.');
      }

      // Desactivar cualquier propietario actual previo
      await HistorialPropietarios.update(
        { EsPropietarioActual: false },
        {
          where: {
            VehiculoID: data.vehiculoID,
            EsPropietarioActual: true,
          },
        }
      );

      // Crear registro del propietario actual
      const historial = await HistorialPropietarios.create({
        VehiculoID: data.vehiculoID,
        TipoPropietario: 'Actual',
        NombrePropietario: data.nombrePropietario,
        TipoDocumento: data.tipoDocumento || 'CC',
        NumeroDocumento: data.numeroDocumento,
        Telefono: data.telefono,
        Email: data.email,
        Direccion: data.direccion,
        Ciudad: data.ciudad,
        FechaAdquisicion: data.fechaAdquisicion,
        ValorCompra: data.valorCompra,
        TraspasoRealizado: data.traspasoRealizado || false,
        FechaTraspaso: data.fechaTraspaso,
        NumeroTraspaso: data.numeroTraspaso,
        OrganismoTransito: data.organismoTransito,
        ContratoID: data.contratoID,
        EsPropietarioActual: true,
        Observaciones: data.observaciones,
        UsuarioRegistro: data.usuarioRegistro,
      });

      // Actualizar referencia en la tabla Vehiculos
      await Vehiculo.update(
        { PropietarioActualID: historial.HistorialID },
        { where: { VehiculoID: data.vehiculoID } }
      );

      return {
        success: true,
        message: 'Propietario actual registrado exitosamente',
        data: historial,
      };
    } catch (error: any) {
      throw new Error(`Error al registrar propietario actual: ${error.message}`);
    }
  }

  /**
   * Registrar traspaso a mi nombre (actualizar propietario actual)
   */
  static async registrarTraspaso(data: {
    vehiculoID: number;
    fechaTraspaso: Date;
    numeroTraspaso?: string;
    organismoTransito?: string;
    observaciones?: string;
  }) {
    try {
      // Buscar el propietario actual
      const propietarioActual = await HistorialPropietarios.findOne({
        where: {
          VehiculoID: data.vehiculoID,
          EsPropietarioActual: true,
        },
      });

      if (!propietarioActual) {
        throw new Error('No se encontró el propietario actual del vehículo');
      }

      // Actualizar información del traspaso
      await propietarioActual.update({
        TraspasoRealizado: true,
        FechaTraspaso: data.fechaTraspaso,
        NumeroTraspaso: data.numeroTraspaso,
        OrganismoTransito: data.organismoTransito,
        Observaciones: data.observaciones || propietarioActual.Observaciones,
      });

      return {
        success: true,
        message: 'Traspaso registrado exitosamente',
        data: propietarioActual,
      };
    } catch (error: any) {
      throw new Error(`Error al registrar traspaso: ${error.message}`);
    }
  }

  /**
   * Registrar venta del vehículo (nuevo propietario)
   */
  static async registrarVenta(data: {
    vehiculoID: number;
    nombrePropietario: string;
    tipoDocumento?: string;
    numeroDocumento: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    ciudad?: string;
    fechaVenta: Date;
    valorVenta?: number;
    contratoID?: number;
    observaciones?: string;
    usuarioRegistro?: number;
  }) {
    try {
      // Verificar que el vehículo existe
      const vehiculo = await Vehiculo.findByPk(data.vehiculoID);
      if (!vehiculo) {
        throw new Error('Vehículo no encontrado');
      }

      // Actualizar el propietario actual para que ya no sea actual
      const propietarioActual = await HistorialPropietarios.findOne({
        where: {
          VehiculoID: data.vehiculoID,
          EsPropietarioActual: true,
        },
      });

      if (propietarioActual) {
        await propietarioActual.update({
          EsPropietarioActual: false,
          FechaVenta: data.fechaVenta,
          ValorVenta: data.valorVenta,
        });
      }

      // Crear registro del nuevo propietario
      const historial = await HistorialPropietarios.create({
        VehiculoID: data.vehiculoID,
        TipoPropietario: 'Nuevo',
        NombrePropietario: data.nombrePropietario,
        TipoDocumento: data.tipoDocumento || 'CC',
        NumeroDocumento: data.numeroDocumento,
        Telefono: data.telefono,
        Email: data.email,
        Direccion: data.direccion,
        Ciudad: data.ciudad,
        FechaAdquisicion: data.fechaVenta,
        ValorCompra: data.valorVenta,
        ContratoID: data.contratoID,
        TraspasoRealizado: false,
        EsPropietarioActual: true,
        Observaciones: data.observaciones,
        UsuarioRegistro: data.usuarioRegistro,
      });

      // Actualizar referencia en la tabla Vehiculos
      await Vehiculo.update(
        { PropietarioActualID: historial.HistorialID },
        { where: { VehiculoID: data.vehiculoID } }
      );

      return {
        success: true,
        message: 'Venta registrada exitosamente',
        data: historial,
      };
    } catch (error: any) {
      throw new Error(`Error al registrar venta: ${error.message}`);
    }
  }

  /**
   * Obtener historial completo de propietarios de un vehículo
   */
  static async obtenerHistorial(vehiculoID: number) {
    try {
      const historial = await HistorialPropietarios.findAll({
        where: { VehiculoID: vehiculoID },
        include: [
          {
            model: Contrato,
            as: 'contrato',
            attributes: ['ContratoID', 'Folio', 'TipoContrato', 'FechaContrato'],
            required: false,
          },
        ],
        order: [['FechaAdquisicion', 'ASC']],
      });

      return {
        success: true,
        data: historial,
        total: historial.length,
      };
    } catch (error: any) {
      throw new Error(`Error al obtener historial: ${error.message}`);
    }
  }

  /**
   * Obtener propietario actual de un vehículo
   */
  static async obtenerPropietarioActual(vehiculoID: number) {
    try {
      const propietario = await HistorialPropietarios.findOne({
        where: {
          VehiculoID: vehiculoID,
          EsPropietarioActual: true,
        },
        include: [
          {
            model: Contrato,
            as: 'contrato',
            attributes: ['ContratoID', 'Folio', 'TipoContrato', 'FechaContrato'],
            required: false,
          },
        ],
      });

      if (!propietario) {
        return {
          success: false,
          message: 'No se encontró propietario actual para este vehículo',
          data: null,
        };
      }

      return {
        success: true,
        data: propietario,
      };
    } catch (error: any) {
      throw new Error(`Error al obtener propietario actual: ${error.message}`);
    }
  }

  /**
   * Actualizar registro de historial
   */
  static async actualizarHistorial(historialID: number, data: any) {
    try {
      const historial = await HistorialPropietarios.findByPk(historialID);
      
      if (!historial) {
        throw new Error('Registro de historial no encontrado');
      }

      await historial.update(data);

      return {
        success: true,
        message: 'Historial actualizado exitosamente',
        data: historial,
      };
    } catch (error: any) {
      throw new Error(`Error al actualizar historial: ${error.message}`);
    }
  }

  /**
   * Obtener vehículos sin traspaso realizado
   */
  static async obtenerVehiculosSinTraspaso() {
    try {
      const vehiculos = await Vehiculo.findAll({
        include: [
          {
            model: HistorialPropietarios,
            as: 'historialPropietarios',
            where: {
              EsPropietarioActual: true,
              TraspasoRealizado: false,
            },
            required: true,
          },
          {
            model: Activo,
            as: 'Activo',
            attributes: ['CodigoInterno', 'FechaCompra', 'ValorCompra'],
          },
        ],
      });

      return {
        success: true,
        data: vehiculos,
        total: vehiculos.length,
      };
    } catch (error: any) {
      throw new Error(`Error al obtener vehículos sin traspaso: ${error.message}`);
    }
  }

  /**
   * Obtener historial de ventas
   */
  static async obtenerHistorialVentas(filtros?: {
    fechaInicio?: Date;
    fechaFin?: Date;
    limite?: number;
  }) {
    try {
      const where: any = {
        TipoPropietario: 'Nuevo',
        FechaAdquisicion: { [Op.ne]: null },
      };

      if (filtros?.fechaInicio && filtros?.fechaFin) {
        where.FechaAdquisicion = {
          [Op.between]: [filtros.fechaInicio, filtros.fechaFin],
        };
      }

      const ventas = await HistorialPropietarios.findAll({
        where,
        include: [
          {
            model: Vehiculo,
            as: 'vehiculo',
            attributes: ['VehiculoID', 'Placa', 'Marca', 'Modelo', 'Linea'],
          },
          {
            model: Contrato,
            as: 'contrato',
            attributes: ['ContratoID', 'Folio', 'TipoContrato'],
            required: false,
          },
        ],
        order: [['FechaAdquisicion', 'DESC']],
        limit: filtros?.limite || 50,
      });

      return {
        success: true,
        data: ventas,
        total: ventas.length,
      };
    } catch (error: any) {
      throw new Error(`Error al obtener historial de ventas: ${error.message}`);
    }
  }

  /**
   * Eliminar registro de historial
   */
  static async eliminarHistorial(historialID: number) {
    try {
      const historial = await HistorialPropietarios.findByPk(historialID);
      
      if (!historial) {
        throw new Error('Registro de historial no encontrado');
      }

      // Si es el propietario actual, limpiar la referencia en Vehiculos
      if (historial.EsPropietarioActual) {
        await Vehiculo.update(
          { PropietarioActualID: undefined },
          { where: { VehiculoID: historial.VehiculoID } }
        );
      }

      await historial.destroy();

      return {
        success: true,
        message: 'Registro de historial eliminado exitosamente',
      };
    } catch (error: any) {
      throw new Error(`Error al eliminar historial: ${error.message}`);
    }
  }
}
