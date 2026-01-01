import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface NotificacionAttributes {
  NotificacionID: number;
  UsuarioID: number;
  Tipo: 'alerta' | 'mantenimiento' | 'cambio' | 'accion' | 'financiero';
  Titulo: string;
  Mensaje: string;
  Icono?: string;
  Color?: string;
  Leida: boolean;
  Url?: string;
  MetaData?: string;
  FechaCreacion: Date;
  FechaLeida?: Date;
}

interface NotificacionCreationAttributes extends Optional<NotificacionAttributes, 'NotificacionID' | 'Leida' | 'FechaCreacion'> {}

class Notificacion extends Model<NotificacionAttributes, NotificacionCreationAttributes> implements NotificacionAttributes {
  public NotificacionID!: number;
  public UsuarioID!: number;
  public Tipo!: 'alerta' | 'mantenimiento' | 'cambio' | 'accion' | 'financiero';
  public Titulo!: string;
  public Mensaje!: string;
  public Icono?: string;
  public Color?: string;
  public Leida!: boolean;
  public Url?: string;
  public MetaData?: string;
  public FechaCreacion!: Date;
  public FechaLeida?: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notificacion.init(
  {
    NotificacionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UsuarioID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'UsuarioID'
      }
    },
    Tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['alerta', 'mantenimiento', 'cambio', 'accion', 'financiero']]
      }
    },
    Titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    Mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Icono: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Color: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Leida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    MetaData: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    FechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    FechaLeida: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'Notificaciones',
    timestamps: false
  }
);

export default Notificacion;