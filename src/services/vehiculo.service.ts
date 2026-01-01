import sequelize from '../config/database';
import Activo from '../models/Activo.model';
import Vehiculo from '../models/Vehiculo.model';
import { Transaction } from 'sequelize';
import { CodigoGeneratorUtil } from '../utils/codigo-generator.util';

interface CrearVehiculoData {
  // Datos del Activo
  CodigoInterno?: string; // Opcional, se genera automáticamente si no se proporciona
  FechaCompra: Date;
  ValorCompra: number;
  FormaPago?: string;
  OrigenFondos?: string;
  DetalleOrigenFondos?: string;
  Observaciones?: string;
  UsuarioRegistro: number;

  // Datos del Vehículo
  [key: string]: any; // Para permitir todos los campos de Vehículo
}

interface ActualizarVehiculoData {
  [key: string]: any;
}

export class VehiculoService {
  /**
   * Obtener todos los vehículos con paginación y filtros
   */
  static async obtenerVehiculos(filtros: any = {}) {
    try {
      const {
        marca,
        modelo,
        placa,
        estado = 'Activo',
        page = 1,
        limit = 10,
        sortBy = 'FechaCompra',
        sortOrder = 'DESC',
      } = filtros;

      const pageNum = Number(page);
      const limitNum = Number(limit);
      const offset = (pageNum - 1) * limitNum;

      // Construir condiciones WHERE
      const whereActivo: any = {};
      const whereVehiculo: any = {};

      if (estado) {
        whereActivo.EstadoActual = estado;
      }

      if (marca) {
        whereVehiculo.Marca = marca;
      }

      if (modelo) {
        whereVehiculo.Modelo = modelo;
      }

      if (placa) {
        whereVehiculo.Placa = placa;
      }

      // Determinar el campo y modelo para ordenar
      const camposActivo = ['FechaCompra', 'ValorCompra', 'CodigoInterno'];
      const camposVehiculo = ['Marca', 'Linea', 'Modelo', 'Placa'];

      let orderClause: any;
      
      if (camposActivo.includes(sortBy)) {
        // Ordenar por campo del Activo
        orderClause = [[{ model: Activo, as: 'Activo' }, sortBy, sortOrder]];
      } else if (camposVehiculo.includes(sortBy)) {
        // Ordenar por campo del Vehículo
        orderClause = [[sortBy, sortOrder]];
      } else {
        // Default: ordenar por fecha de compra
        orderClause = [[{ model: Activo, as: 'Activo' }, 'FechaCompra', sortOrder]];
      }

      // Obtener vehículos con su activo asociado
      const { count, rows } = await Vehiculo.findAndCountAll({
        include: [
          {
            model: Activo,
            as: 'Activo',
            where: whereActivo,
            required: true,
          },
        ],
        where: whereVehiculo,
        limit: limitNum,
        offset: offset,
        order: orderClause,
      });

      return {
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(count / limitNum),
        },
      };
    } catch (error: any) {
      console.error('Error al obtener vehículos:', error);
      throw new Error('Error al obtener vehículos: ' + error.message);
    }
  }

  /**
   * Obtener un vehículo por ID
   */
  static async obtenerVehiculoPorId(vehiculoID: number) {
    try {
      const vehiculo = await Vehiculo.findByPk(vehiculoID, {
        include: [
          {
            model: Activo,
            as: 'Activo',
          },
        ],
      });

      if (!vehiculo) {
        return {
          success: false,
          message: 'Vehículo no encontrado',
        };
      }

      return {
        success: true,
        data: vehiculo,
      };
    } catch (error: any) {
      console.error('Error al obtener vehículo:', error);
      throw new Error('Error al obtener vehículo: ' + error.message);
    }
  }

  /**
   * Crear un nuevo vehículo
   * Crea el Activo padre y luego el Vehículo
   */
  static async crearVehiculo(data: CrearVehiculoData) {
    const t: Transaction = await sequelize.transaction();

    try {
      // Mapear Servicio a TipoServicio si viene como Servicio
      if (data.Servicio && !data.TipoServicio) {
        data.TipoServicio = data.Servicio;
        delete data.Servicio;
      }

      // 0. Generar código interno si no se proporciona
      if (!data.CodigoInterno) {
        data.CodigoInterno = await CodigoGeneratorUtil.generarCodigoUnico('vehiculo');
      }

      // 1. Verificar que la placa no exista
      const placaExistente = await Vehiculo.findOne({
        where: { Placa: data.Placa },
      });

      if (placaExistente) {
        await t.rollback();
        return {
          success: false,
          message: `La placa ${data.Placa} ya está registrada`,
        };
      }

      // 2. Verificar que el código interno no exista
      const codigoExistente = await Activo.findOne({
        where: { CodigoInterno: data.CodigoInterno },
      });

      if (codigoExistente) {
        await t.rollback();
        return {
          success: false,
          message: `El código interno ${data.CodigoInterno} ya está registrado`,
        };
      }

      // 3. Crear el Activo padre usando SQL directo
      const [result] = await sequelize.query(
        `INSERT INTO Activos (
          TipoActivoID, CodigoInterno, FechaCompra, ValorCompra, 
          FormaPago, OrigenFondos, DetalleOrigenFondos, EstadoActual, 
          Observaciones, UsuarioRegistro, FechaCreacion, FechaModificacion
        ) OUTPUT INSERTED.ActivoID
        VALUES (
          1, :CodigoInterno, :FechaCompra, :ValorCompra,
          :FormaPago, :OrigenFondos, :DetalleOrigenFondos, 'Activo',
          :Observaciones, :UsuarioRegistro, GETDATE(), GETDATE()
        )`,
        {
          replacements: {
            CodigoInterno: data.CodigoInterno,
            FechaCompra: data.FechaCompra,
            ValorCompra: data.ValorCompra,
            FormaPago: data.FormaPago || null,
            OrigenFondos: data.OrigenFondos || null,
            DetalleOrigenFondos: data.DetalleOrigenFondos || null,
            Observaciones: data.Observaciones || null,
            UsuarioRegistro: data.UsuarioRegistro,
          },
          transaction: t,
        }
      );

      const activoID = (result[0] as any).ActivoID;
      
      console.log('✅ Activo creado con ID:', activoID);

      // 4. Crear el Vehículo
      const vehiculo = await Vehiculo.create(
        {
          ActivoID: activoID,
          TipoVehiculo: data.TipoVehiculo,
          Marca: data.Marca,
          Linea: data.Linea,
          Modelo: data.Modelo,
          Placa: data.Placa,
          NumeroChasis: data.NumeroChasis,
          NumeroMotor: data.NumeroMotor,
          NumeroCarroceria: data.NumeroCarroceria,
          Serie: data.Serie,
          Color: data.Color,
          Cilindraje: data.Cilindraje,
          TipoCombustible: data.TipoCombustible,
          TipoCaja: data.TipoCaja,
          Clase: data.Clase,
          Tipo: data.Tipo,
          TipoServicio: data.TipoServicio,
          Capacidad: data.Capacidad,
          NumeroPuertas: data.NumeroPuertas,
          KilometrajeCompra: data.KilometrajeCompra,
          KilometrajeActual: data.KilometrajeActual,
          NumeroTarjetaPropiedad: data.NumeroTarjetaPropiedad,
          OrganismoTransito: data.OrganismoTransito,
          PropietarioAnterior: data.PropietarioAnterior,
          CedulaAnteriorPropietario: data.CedulaAnteriorPropietario,
          TelefonoAnteriorPropietario: data.TelefonoAnteriorPropietario,
          FechaVencimientoSOAT: data.FechaVencimientoSOAT,
          NumeroSOAT: data.NumeroSOAT,
          AseguradoraSOAT: data.AseguradoraSOAT,
          FechaVencimientoTecnomecanica: data.FechaVencimientoTecnomecanica,
          NumeroTecnomecanica: data.NumeroTecnomecanica,
          FechaVencimientoImpuesto: data.FechaVencimientoImpuesto,
          ValorImpuestoVehicular: data.ValorImpuestoVehicular,
          TieneGravamenes: data.TieneGravamenes || false,
          DetalleGravamenes: data.DetalleGravamenes,
          EsFinanciado: data.EsFinanciado || false,
          EntidadFinanciera: data.EntidadFinanciera,
          ValorCredito: data.ValorCredito,
          CuotaInicial: data.CuotaInicial,
          NumeroCuotas: data.NumeroCuotas,
          ValorCuota: data.ValorCuota,
          TasaInteres: data.TasaInteres,
          SaldoPendiente: data.SaldoPendiente,
          AvaluoComercialInicial: data.AvaluoComercialInicial,
          AvaluoComercialActual: data.AvaluoComercialActual,
          FechaUltimoAvaluo: data.FechaUltimoAvaluo,
        },
        { transaction: t }
      );

      await t.commit();

      console.log('✅ Vehículo creado:', vehiculo.VehiculoID);

      // Retornar el vehículo con su activo
      const vehiculoCompleto = await Vehiculo.findByPk(vehiculo.VehiculoID, {
        include: [{ model: Activo, as: 'Activo' }],
      });

      return {
        success: true,
        message: 'Vehículo creado exitosamente',
        data: vehiculoCompleto,
      };
    } catch (error: any) {
      await t.rollback();
      console.error('Error al crear vehículo:', error);
      throw new Error('Error al crear vehículo: ' + error.message);
    }
  }

  /**
   * Actualizar un vehículo existente
   */
  static async actualizarVehiculo(vehiculoID: number, data: ActualizarVehiculoData) {
    const t: Transaction = await sequelize.transaction();

    try {
      // Mapear Servicio a TipoServicio si viene como Servicio
      if (data.Servicio && !data.TipoServicio) {
        data.TipoServicio = data.Servicio;
        delete data.Servicio;
      }

      // 1. Buscar el vehículo
      const vehiculo = await Vehiculo.findByPk(vehiculoID, {
        include: [{ model: Activo, as: 'Activo' }],
        transaction: t,
      });

      if (!vehiculo) {
        await t.rollback();
        return {
          success: false,
          message: 'Vehículo no encontrado',
        };
      }

      // 2. Verificar placa única si se está actualizando
      if (data.Placa && data.Placa !== vehiculo.Placa) {
        const placaExistente = await Vehiculo.findOne({
          where: { Placa: data.Placa },
        });

        if (placaExistente) {
          await t.rollback();
          return {
            success: false,
            message: `La placa ${data.Placa} ya está registrada`,
          };
        }
      }

      // 3. Separar datos del Activo y del Vehículo
      const datosActivo: any = {};
      const datosVehiculo: any = {};

      const camposActivo = [
        'CodigoInterno',
        'FechaCompra',
        'ValorCompra',
        'FormaPago',
        'OrigenFondos',
        'DetalleOrigenFondos',
        'EstadoActual',
        'FechaVenta',
        'ValorVenta',
        'Observaciones',
      ];

      Object.keys(data).forEach((key) => {
        if (camposActivo.includes(key)) {
          datosActivo[key] = data[key];
        } else {
          datosVehiculo[key] = data[key];
        }
      });

      // 4. Actualizar el Activo si hay cambios
      if (Object.keys(datosActivo).length > 0) {
        // Construir el UPDATE dinámicamente
        const setClauses: string[] = [];
        const replacements: any = { ActivoID: vehiculo.ActivoID };

        Object.keys(datosActivo).forEach((key) => {
          setClauses.push(`${key} = :${key}`);
          replacements[key] = datosActivo[key];
        });

        // Agregar FechaModificacion
        setClauses.push('FechaModificacion = GETDATE()');

        const updateQuery = `
          UPDATE Activos 
          SET ${setClauses.join(', ')}
          WHERE ActivoID = :ActivoID
        `;

        await sequelize.query(updateQuery, {
          replacements,
          transaction: t,
        });
      }

      // 5. Actualizar el Vehículo si hay cambios
      if (Object.keys(datosVehiculo).length > 0) {
        // Construir el UPDATE dinámicamente para vehículo
        const setClauses: string[] = [];
        const replacements: any = { VehiculoID: vehiculoID };

        Object.keys(datosVehiculo).forEach((key) => {
          setClauses.push(`${key} = :${key}`);
          replacements[key] = datosVehiculo[key];
        });

        const updateQuery = `
          UPDATE Vehiculos 
          SET ${setClauses.join(', ')}
          WHERE VehiculoID = :VehiculoID
        `;

        await sequelize.query(updateQuery, {
          replacements,
          transaction: t,
        });
      }

      await t.commit();

      console.log('✅ Vehículo actualizado:', vehiculoID);

      // Retornar el vehículo actualizado
      const vehiculoActualizado = await Vehiculo.findByPk(vehiculoID, {
        include: [{ model: Activo, as: 'Activo' }],
      });

      return {
        success: true,
        message: 'Vehículo actualizado exitosamente',
        data: vehiculoActualizado,
      };
    } catch (error: any) {
      await t.rollback();
      console.error('Error al actualizar vehículo:', error);
      throw new Error('Error al actualizar vehículo: ' + error.message);
    }
  }

  /**
   * Eliminar un vehículo (soft delete - cambiar estado a Inactivo)
   */
  static async eliminarVehiculo(vehiculoID: number) {
    try {
      const vehiculo = await Vehiculo.findByPk(vehiculoID);

      if (!vehiculo) {
        return {
          success: false,
          message: 'Vehículo no encontrado',
        };
      }

      // Cambiar estado del activo a Inactivo
      await Activo.update(
        { EstadoActual: 'Inactivo' },
        { where: { ActivoID: vehiculo.ActivoID } }
      );

      console.log('✅ Vehículo marcado como inactivo:', vehiculoID);

      return {
        success: true,
        message: 'Vehículo eliminado exitosamente',
      };
    } catch (error: any) {
      console.error('Error al eliminar vehículo:', error);
      throw new Error('Error al eliminar vehículo: ' + error.message);
    }
  }
}

export default VehiculoService;
