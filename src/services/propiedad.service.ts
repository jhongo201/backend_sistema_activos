import sequelize from '../config/database';
import Activo from '../models/Activo.model';
import Propiedad from '../models/Propiedad.model';
import { Transaction } from 'sequelize';
import { CodigoGeneratorUtil } from '../utils/codigo-generator.util';

interface CrearPropiedadData {
  // Datos del Activo
  CodigoInterno?: string; // Opcional, se genera automáticamente si no se proporciona
  FechaCompra: Date;
  ValorCompra: number;
  FormaPago?: string;
  OrigenFondos?: string;
  DetalleOrigenFondos?: string;
  Observaciones?: string;
  UsuarioRegistro: number;

  // Datos de la Propiedad
  [key: string]: any;
}

interface ActualizarPropiedadData {
  [key: string]: any;
}

export class PropiedadService {
  /**
   * Obtener todas las propiedades con paginación y filtros
   */
  static async obtenerPropiedades(filtros: any = {}) {
    try {
      const {
        ciudad,
        departamento,
        tipoPropiedad,
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
      const wherePropiedad: any = {};

      if (estado) {
        whereActivo.EstadoActual = estado;
      }

      if (ciudad) {
        wherePropiedad.Ciudad = ciudad;
      }

      if (departamento) {
        wherePropiedad.Departamento = departamento;
      }

      if (tipoPropiedad) {
        wherePropiedad.TipoPropiedad = tipoPropiedad;
      }

      // Determinar ordenamiento
      const camposActivo = ['FechaCompra', 'ValorCompra', 'CodigoInterno'];
      const camposPropiedad = ['Ciudad', 'Direccion', 'Departamento'];

      let orderClause: any;
      
      if (camposActivo.includes(sortBy)) {
        orderClause = [[{ model: Activo, as: 'Activo' }, sortBy, sortOrder]];
      } else if (camposPropiedad.includes(sortBy)) {
        orderClause = [[sortBy, sortOrder]];
      } else {
        orderClause = [[{ model: Activo, as: 'Activo' }, 'FechaCompra', sortOrder]];
      }

      // Obtener propiedades con su activo asociado
      const { count, rows } = await Propiedad.findAndCountAll({
        include: [
          {
            model: Activo,
            as: 'Activo',
            where: whereActivo,
            required: true,
          },
        ],
        where: wherePropiedad,
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
      console.error('Error al obtener propiedades:', error);
      throw new Error('Error al obtener propiedades: ' + error.message);
    }
  }

  /**
   * Obtener una propiedad por ID
   */
  static async obtenerPropiedadPorId(propiedadID: number) {
    try {
      const propiedad = await Propiedad.findByPk(propiedadID, {
        include: [
          {
            model: Activo,
            as: 'Activo',
          },
        ],
      });

      if (!propiedad) {
        return {
          success: false,
          message: 'Propiedad no encontrada',
        };
      }

      return {
        success: true,
        data: propiedad,
      };
    } catch (error: any) {
      console.error('Error al obtener propiedad:', error);
      throw new Error('Error al obtener propiedad: ' + error.message);
    }
  }

  /**
   * Crear una nueva propiedad
   */
  static async crearPropiedad(data: CrearPropiedadData) {
    const t: Transaction = await sequelize.transaction();

    try {
      // 0. Generar código interno si no se proporciona
      if (!data.CodigoInterno) {
        data.CodigoInterno = await CodigoGeneratorUtil.generarCodigoUnico('propiedad');
      }

      // 1. Verificar que el código interno no exista
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

      // 2. Crear el Activo padre usando SQL directo
      const [result] = await sequelize.query(
        `INSERT INTO Activos (
          TipoActivoID, CodigoInterno, FechaCompra, ValorCompra, 
          FormaPago, OrigenFondos, DetalleOrigenFondos, EstadoActual, 
          Observaciones, UsuarioRegistro, FechaCreacion, FechaModificacion
        ) OUTPUT INSERTED.ActivoID
        VALUES (
          2, :CodigoInterno, :FechaCompra, :ValorCompra,
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

      // 3. Crear la Propiedad - Solo enviar campos con valores
      const datosPropied: any = {
        ActivoID: activoID,
        TieneGravamenes: data.TieneGravamenes || false,
        EsFinanciado: data.EsFinanciado || false,
      };

      // Agregar solo campos que tienen valores
      const camposOpcionales = [
        'TipoPropiedad', 'Direccion', 'Ciudad', 'Departamento', 'Barrio',
        'Latitud', 'Longitud',
        'Estrato', 'AreaTerreno', 'AreaConstruida', 'NumeroHabitaciones',
        'NumeroBanos', 'NumeroPisos', 'TieneParqueadero', 'NumeroParqueaderos',
        'TieneCuartoUtil', 'AnoContruccion', 'EstadoConstruccion',
        'NumeroMatriculaInmobiliaria', 'CedulaCatastral', 'CatastroReferencia',
        'NumeroEscritura', 'FechaEscritura', 'NotariaEscritura',
        'PropietarioAnterior', 'CedulaAnteriorPropietario', 'TelefonoAnteriorPropietario',
        'TieneAguaPotable', 'TieneAlcantarillado', 'TieneEnergia',
        'TieneGasNatural', 'TieneInternet', 'ValorPredial',
        'FechaVencimientoPredial', 'ValorValorizacion', 'FechaVencimientoValorizacion',
        'TieneAdministracion', 'ValorAdministracion', 'DetalleGravamenes',
        'EntidadFinanciera', 'ValorCredito', 'CuotaInicial', 'NumeroCuotas',
        'ValorCuota', 'TasaInteres', 'SaldoPendiente', 'EstaArrendada',
        'NombreArrendatario', 'CedulaArrendatario', 'TelefonoArrendatario',
        'ValorArriendo', 'FechaInicioContrato', 'FechaFinContrato',
        'AvaluoCatastral', 'AvaluoComercialInicial', 'AvaluoComercialActual',
        'FechaUltimoAvaluo'
      ];

      camposOpcionales.forEach((campo) => {
        if (data[campo] !== undefined && data[campo] !== null && data[campo] !== '') {
          datosPropied[campo] = data[campo];
        }
      });

      const propiedad = await Propiedad.create(datosPropied, { transaction: t });

      await t.commit();

      console.log('✅ Propiedad creada:', propiedad.PropiedadID);

      // Retornar la propiedad con su activo
      const propiedadCompleta = await Propiedad.findByPk(propiedad.PropiedadID, {
        include: [{ model: Activo, as: 'Activo' }],
      });

      return {
        success: true,
        message: 'Propiedad creada exitosamente',
        data: propiedadCompleta,
      };
    } catch (error: any) {
      await t.rollback();
      console.error('Error al crear propiedad:', error);
      throw new Error('Error al crear propiedad: ' + error.message);
    }
  }

  /**
   * Actualizar una propiedad existente
   */
  static async actualizarPropiedad(propiedadID: number, data: ActualizarPropiedadData) {
    const t: Transaction = await sequelize.transaction();

    try {
      // 1. Buscar la propiedad
      const propiedad = await Propiedad.findByPk(propiedadID, {
        include: [{ model: Activo, as: 'Activo' }],
        transaction: t,
      });

      if (!propiedad) {
        await t.rollback();
        return {
          success: false,
          message: 'Propiedad no encontrada',
        };
      }

      // 2. Separar datos del Activo y de la Propiedad
      const datosActivo: any = {};
      const datosPropiedad: any = {};

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
          datosPropiedad[key] = data[key];
        }
      });

      // 3. Actualizar el Activo si hay cambios
      if (Object.keys(datosActivo).length > 0) {
        const setClauses: string[] = [];
        const replacements: any = { ActivoID: propiedad.ActivoID };

        Object.keys(datosActivo).forEach((key) => {
          setClauses.push(`${key} = :${key}`);
          replacements[key] = datosActivo[key];
        });

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

      // 4. Actualizar la Propiedad si hay cambios
      if (Object.keys(datosPropiedad).length > 0) {
        const setClauses: string[] = [];
        const replacements: any = { PropiedadID: propiedadID };

        Object.keys(datosPropiedad).forEach((key) => {
          setClauses.push(`${key} = :${key}`);
          replacements[key] = datosPropiedad[key];
        });

        const updateQuery = `
          UPDATE Propiedades 
          SET ${setClauses.join(', ')}
          WHERE PropiedadID = :PropiedadID
        `;

        await sequelize.query(updateQuery, {
          replacements,
          transaction: t,
        });
      }

      await t.commit();

      console.log('✅ Propiedad actualizada:', propiedadID);

      // Retornar la propiedad actualizada
      const propiedadActualizada = await Propiedad.findByPk(propiedadID, {
        include: [{ model: Activo, as: 'Activo' }],
      });

      return {
        success: true,
        message: 'Propiedad actualizada exitosamente',
        data: propiedadActualizada,
      };
    } catch (error: any) {
      await t.rollback();
      console.error('Error al actualizar propiedad:', error);
      throw new Error('Error al actualizar propiedad: ' + error.message);
    }
  }

  /**
   * Eliminar una propiedad (soft delete)
   */
  static async eliminarPropiedad(propiedadID: number) {
    try {
      const propiedad = await Propiedad.findByPk(propiedadID);

      if (!propiedad) {
        return {
          success: false,
          message: 'Propiedad no encontrada',
        };
      }

      // Cambiar estado del activo a Inactivo usando SQL directo
      await sequelize.query(
        `UPDATE Activos SET EstadoActual = 'Inactivo' WHERE ActivoID = :ActivoID`,
        {
          replacements: { ActivoID: propiedad.ActivoID },
        }
      );

      console.log('✅ Propiedad marcada como inactiva:', propiedadID);

      return {
        success: true,
        message: 'Propiedad eliminada exitosamente',
      };
    } catch (error: any) {
      console.error('Error al eliminar propiedad:', error);
      throw new Error('Error al eliminar propiedad: ' + error.message);
    }
  }
}

export default PropiedadService;
