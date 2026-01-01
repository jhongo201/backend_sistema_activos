import Notificacion from '../models/Notificacion.model';
import { Server as SocketIOServer } from 'socket.io';
import Vehiculo from '../models/Vehiculo.model';
import Propiedad from '../models/Propiedad.model';
import Mantenimiento from '../models/Mantenimiento.model';
import { Op } from 'sequelize';

interface NotificacionData {
  UsuarioID: number;
  Tipo: 'alerta' | 'mantenimiento' | 'cambio' | 'accion' | 'financiero';
  Titulo: string;
  Mensaje: string;
  Icono?: string;
  Color?: string;
  Url?: string;
  MetaData?: any;
}

class NotificationService {
  private io: SocketIOServer | null = null;

  /**
   * Configurar Socket.IO
   */
  setIO(io: SocketIOServer): void {
    this.io = io;
  }

  /**
   * Crear y emitir notificación
   */
  async crearNotificacion(data: NotificacionData): Promise<Notificacion> {
    try {
      // Crear notificación en BD
      const notificacion = await Notificacion.create({
        ...data,
        MetaData: data.MetaData ? JSON.stringify(data.MetaData) : undefined
      });

      // Emitir evento por WebSocket
      if (this.io) {
        this.io.to(`user_${data.UsuarioID}`).emit('notification:new', {
          ...notificacion.toJSON(),
          MetaData: data.MetaData
        });
      }

      return notificacion;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      throw error;
    }
  }

  /**
   * Verificar y crear alertas de vencimientos de vehículos
   */
  async verificarVencimientosVehiculos(): Promise<void> {
    try {
      const hoy = new Date();
      const en15Dias = new Date();
      en15Dias.setDate(hoy.getDate() + 15);

      // Buscar vehículos con vencimientos próximos
      const vehiculos = await Vehiculo.findAll({
        where: {
          [Op.or]: [
            {
              FechaVencimientoSOAT: {
                [Op.between]: [hoy, en15Dias]
              }
            },
            {
              FechaVencimientoTecnomecanica: {
                [Op.between]: [hoy, en15Dias]
              }
            }
          ]
        }
      });

      for (const vehiculo of vehiculos) {
        const usuarioID = 1; // TODO: Obtener del propietario del vehículo

        // Verificar SOAT
        if (vehiculo.FechaVencimientoSOAT) {
          const diasSOAT = this.calcularDiasRestantes(vehiculo.FechaVencimientoSOAT);
          if (diasSOAT <= 15 && diasSOAT >= 0) {
            await this.crearNotificacion({
              UsuarioID: usuarioID,
              Tipo: 'alerta',
              Titulo: 'SOAT Próximo a Vencer',
              Mensaje: `El SOAT del vehículo ${vehiculo.Placa} vence en ${diasSOAT} días`,
              Icono: 'alert',
              Color: diasSOAT <= 5 ? 'red' : 'yellow',
              Url: `/vehiculos/${vehiculo.VehiculoID}`,
              MetaData: {
                vehiculoId: vehiculo.VehiculoID,
                placa: vehiculo.Placa,
                diasRestantes: diasSOAT,
                tipoAlerta: 'SOAT'
              }
            });
          }
        }

        // Verificar Tecnomecánica
        if (vehiculo.FechaVencimientoTecnomecanica) {
          const diasTecno = this.calcularDiasRestantes(vehiculo.FechaVencimientoTecnomecanica);
          if (diasTecno <= 15 && diasTecno >= 0) {
            await this.crearNotificacion({
              UsuarioID: usuarioID,
              Tipo: 'alerta',
              Titulo: 'Tecnomecánica Próxima a Vencer',
              Mensaje: `La tecnomecánica del vehículo ${vehiculo.Placa} vence en ${diasTecno} días`,
              Icono: 'alert',
              Color: diasTecno <= 5 ? 'red' : 'yellow',
              Url: `/vehiculos/${vehiculo.VehiculoID}`,
              MetaData: {
                vehiculoId: vehiculo.VehiculoID,
                placa: vehiculo.Placa,
                diasRestantes: diasTecno,
                tipoAlerta: 'Tecnomecánica'
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error al verificar vencimientos de vehículos:', error);
    }
  }

  /**
   * Verificar y crear alertas de vencimientos de propiedades
   */
  async verificarVencimientosPropiedades(): Promise<void> {
    try {
      const hoy = new Date();
      const en30Dias = new Date();
      en30Dias.setDate(hoy.getDate() + 30);

      const propiedades = await Propiedad.findAll({
        where: {
          FechaVencimientoPredial: {
            [Op.between]: [hoy, en30Dias]
          }
        }
      });

      for (const propiedad of propiedades) {
        const usuarioID = 1; // TODO: Obtener del propietario

        const diasRestantes = this.calcularDiasRestantes(propiedad.FechaVencimientoPredial!);
        
        await this.crearNotificacion({
          UsuarioID: usuarioID,
          Tipo: 'alerta',
          Titulo: 'Predial Próximo a Vencer',
          Mensaje: `El impuesto predial de ${propiedad.Direccion} vence en ${diasRestantes} días`,
          Icono: 'alert',
          Color: diasRestantes <= 10 ? 'red' : 'yellow',
          Url: `/propiedades/${propiedad.PropiedadID}`,
          MetaData: {
            propiedadId: propiedad.PropiedadID,
            direccion: propiedad.Direccion,
            diasRestantes: diasRestantes,
            tipoAlerta: 'Predial'
          }
        });
      }
    } catch (error) {
      console.error('Error al verificar vencimientos de propiedades:', error);
    }
  }

  /**
   * Verificar y crear alertas de mantenimientos próximos
   */
  async verificarMantenimientosProximos(): Promise<void> {
    try {
      const hoy = new Date();
      const en7Dias = new Date();
      en7Dias.setDate(hoy.getDate() + 7);

      const mantenimientos = await Mantenimiento.findAll({
        where: {
          FechaMantenimiento: {
            [Op.between]: [hoy, en7Dias]
          },
          Estado: 'Programado'
        },
        include: [{ model: Vehiculo, as: 'Vehiculo' }]
      });

      for (const mantenimiento of mantenimientos) {
        const usuarioID = 1; // TODO: Obtener del propietario

        const diasRestantes = this.calcularDiasRestantes(mantenimiento.FechaMantenimiento!);
        const vehiculo = (mantenimiento as any).Vehiculo;

        await this.crearNotificacion({
          UsuarioID: usuarioID,
          Tipo: 'mantenimiento',
          Titulo: 'Mantenimiento Próximo',
          Mensaje: `Mantenimiento de ${mantenimiento.TipoMantenimiento} programado para ${vehiculo?.Placa || 'vehículo'} en ${diasRestantes} días`,
          Icono: 'wrench',
          Color: 'yellow',
          Url: `/mantenimientos`,
          MetaData: {
            mantenimientoId: mantenimiento.MantenimientoID,
            vehiculoId: mantenimiento.VehiculoID,
            placa: vehiculo?.Placa,
            tipo: mantenimiento.TipoMantenimiento,
            diasRestantes: diasRestantes
          }
        });
      }
    } catch (error) {
      console.error('Error al verificar mantenimientos próximos:', error);
    }
  }

  /**
   * Notificación de cambio en activo
   */
  async notificarCambio(tipo: 'vehiculo' | 'propiedad', activoId: number, accion: 'crear' | 'editar' | 'eliminar', usuarioID: number): Promise<void> {
    const iconos = { crear: 'plus', editar: 'edit', eliminar: 'trash' };
    const colores = { crear: 'green', editar: 'blue', eliminar: 'red' };
    const acciones = { crear: 'creado', editar: 'actualizado', eliminar: 'eliminado' };

    await this.crearNotificacion({
      UsuarioID: usuarioID,
      Tipo: 'cambio',
      Titulo: `${tipo === 'vehiculo' ? 'Vehículo' : 'Propiedad'} ${acciones[accion]}`,
      Mensaje: `Un ${tipo} ha sido ${acciones[accion]} en el sistema`,
      Icono: iconos[accion],
      Color: colores[accion],
      Url: `/${tipo}s/${activoId}`,
      MetaData: { tipo, activoId, accion }
    });
  }

  /**
   * Limpiar notificaciones antiguas
   */
  async limpiarNotificacionesAntiguas(diasRetencion: number = 30): Promise<number> {
    try {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - diasRetencion);

      const eliminadas = await Notificacion.destroy({
        where: {
          FechaCreacion: {
            [Op.lt]: fechaLimite
          },
          Leida: true
        }
      });

      console.log(`${eliminadas} notificaciones antiguas eliminadas`);
      return eliminadas;
    } catch (error) {
      console.error('Error al limpiar notificaciones:', error);
      throw error;
    }
  }

  /**
   * Calcular días restantes
   */
  private calcularDiasRestantes(fecha: Date): number {
    const hoy = new Date();
    const diferencia = new Date(fecha).getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }
}

export default new NotificationService();