import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface HistorialCambioAttributes {
  HistorialID: number;
  ActivoID: number;
  TipoActivo: 'Vehiculo' | 'Propiedad';
  TipoCambio: 'Creacion' | 'Actualizacion' | 'Venta' | 'Estado' | 'Valor' | 'Otro';
  CampoModificado?: string;
  ValorAnterior?: string;
  ValorNuevo?: string;
  Descripcion?: string;
  UsuarioID?: number;
  FechaCambio: Date;
}

class HistorialCambio extends Model<HistorialCambioAttributes> implements HistorialCambioAttributes {
  public HistorialID!: number;
  public ActivoID!: number;
  public TipoActivo!: 'Vehiculo' | 'Propiedad';
  public TipoCambio!: 'Creacion' | 'Actualizacion' | 'Venta' | 'Estado' | 'Valor' | 'Otro';
  public CampoModificado?: string;
  public ValorAnterior?: string;
  public ValorNuevo?: string;
  public Descripcion?: string;
  public UsuarioID?: number;
  public FechaCambio!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HistorialCambio.init(
  {
    HistorialID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ActivoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TipoActivo: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isIn: [['Vehiculo', 'Propiedad']],
      },
    },
    TipoCambio: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isIn: [['Creacion', 'Actualizacion', 'Venta', 'Estado', 'Valor', 'Otro']],
      },
    },
    CampoModificado: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ValorAnterior: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ValorNuevo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    UsuarioID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    FechaCambio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'HistorialCambios',
    timestamps: true,
  }
);

export default HistorialCambio;
