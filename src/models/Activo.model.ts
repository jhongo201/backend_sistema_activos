import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ActivoAttributes {
  ActivoID: number;
  TipoActivoID: number;
  CodigoInterno: string;
  FechaCompra: Date;
  ValorCompra: number;
  FormaPago?: string;
  OrigenFondos?: string;
  DetalleOrigenFondos?: string;
  EstadoActual: 'Activo' | 'En Venta' | 'Vendido' | 'Inactivo';
  FechaVenta?: Date;
  ValorVenta?: number;
  Observaciones?: string;
  UsuarioRegistro: number;
  FechaCreacion: Date;
  FechaModificacion: Date;
}

interface ActivoCreationAttributes extends Optional<ActivoAttributes, 'ActivoID' | 'FechaCreacion' | 'FechaModificacion'> {}

class Activo extends Model<ActivoAttributes, ActivoCreationAttributes> implements ActivoAttributes {
  public ActivoID!: number;
  public TipoActivoID!: number;
  public CodigoInterno!: string;
  public FechaCompra!: Date;
  public ValorCompra!: number;
  public FormaPago?: string;
  public OrigenFondos?: string;
  public DetalleOrigenFondos?: string;
  public EstadoActual!: 'Activo' | 'En Venta' | 'Vendido' | 'Inactivo';
  public FechaVenta?: Date;
  public ValorVenta?: number;
  public Observaciones?: string;
  public UsuarioRegistro!: number;
  public FechaCreacion!: Date;
  public FechaModificacion!: Date;
}

Activo.init(
  {
    ActivoID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    TipoActivoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TiposActivo',
        key: 'TipoActivoID',
      },
    },
    CodigoInterno: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    FechaCompra: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    ValorCompra: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    FormaPago: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    OrigenFondos: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    DetalleOrigenFondos: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    EstadoActual: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Activo',
      validate: {
        isIn: [['Activo', 'En Venta', 'Vendido', 'Inactivo']],
      },
    },
    FechaVenta: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ValorVenta: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    Observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    UsuarioRegistro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'UsuarioID',
      },
    },
    FechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    FechaModificacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Activos',
    timestamps: false,
  }
);

export default Activo;
