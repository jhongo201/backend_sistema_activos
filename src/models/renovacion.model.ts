import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface RenovacionAttributes {
  RenovacionID: number;
  PolizaID: number;
  UsuarioID: number;
  PolizaAnteriorNumero?: string;
  NuevaPolizaNumero?: string;
  PrimaAnterior?: number;
  NuevaPrima?: number;
  DiferenciaPrima?: number;
  PorcentajeAumento?: number;
  FechaRenovacion: Date;
  FechaVencimientoAnterior?: Date;
  FechaVencimientoNueva?: Date;
  CambiosCobertura?: string;
  MotivoRenovacion?: string;
  Estado: string;
  FechaCreacion: Date;
}

interface RenovacionCreationAttributes extends Optional<RenovacionAttributes, 'RenovacionID' | 'FechaCreacion' | 'Estado'> {}

class Renovacion extends Model<RenovacionAttributes, RenovacionCreationAttributes> implements RenovacionAttributes {
  public RenovacionID!: number;
  public PolizaID!: number;
  public UsuarioID!: number;
  public PolizaAnteriorNumero?: string;
  public NuevaPolizaNumero?: string;
  public PrimaAnterior?: number;
  public NuevaPrima?: number;
  public DiferenciaPrima?: number;
  public PorcentajeAumento?: number;
  public FechaRenovacion!: Date;
  public FechaVencimientoAnterior?: Date;
  public FechaVencimientoNueva?: Date;
  public CambiosCobertura?: string;
  public MotivoRenovacion?: string;
  public Estado!: string;
  public FechaCreacion!: Date;
}

Renovacion.init(
  {
    RenovacionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    PolizaID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UsuarioID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PolizaAnteriorNumero: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    NuevaPolizaNumero: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    PrimaAnterior: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    NuevaPrima: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    DiferenciaPrima: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    PorcentajeAumento: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    FechaRenovacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    FechaVencimientoAnterior: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    FechaVencimientoNueva: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    CambiosCobertura: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    MotivoRenovacion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Estado: {
      type: DataTypes.STRING(50),
      defaultValue: 'Pendiente',
    },
    FechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Renovaciones',
    timestamps: false,
  }
);

export default Renovacion;
