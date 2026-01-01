import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PolizaAttributes {
  PolizaID: number;
  TipoPoliza: string;
  CategoriaPoliza: string;
  Aseguradora: string;
  NumeroPoliza: string;
  VehiculoID?: number;
  PropiedadID?: number;
  UsuarioID: number;
  ValorAsegurado: number;
  PrimaAnual: number;
  PrimaMensual?: number;
  Deducible?: number;
  Coberturas?: string;
  FechaInicio: Date;
  FechaVencimiento: Date;
  FechaRenovacion?: Date;
  Estado: string;
  TelefonoAseguradora?: string;
  EmailAseguradora?: string;
  AgenteAsignado?: string;
  TelefonoAgente?: string;
  RutaDocumento?: string;
  Observaciones?: string;
  FechaCreacion: Date;
  FechaModificacion?: Date;
}

interface PolizaCreationAttributes extends Optional<PolizaAttributes, 'PolizaID' | 'FechaCreacion' | 'Estado'> {}

class Poliza extends Model<PolizaAttributes, PolizaCreationAttributes> implements PolizaAttributes {
  public PolizaID!: number;
  public TipoPoliza!: string;
  public CategoriaPoliza!: string;
  public Aseguradora!: string;
  public NumeroPoliza!: string;
  public VehiculoID?: number;
  public PropiedadID?: number;
  public UsuarioID!: number;
  public ValorAsegurado!: number;
  public PrimaAnual!: number;
  public PrimaMensual?: number;
  public Deducible?: number;
  public Coberturas?: string;
  public FechaInicio!: Date;
  public FechaVencimiento!: Date;
  public FechaRenovacion?: Date;
  public Estado!: string;
  public TelefonoAseguradora?: string;
  public EmailAseguradora?: string;
  public AgenteAsignado?: string;
  public TelefonoAgente?: string;
  public RutaDocumento?: string;
  public Observaciones?: string;
  public FechaCreacion!: Date;
  public FechaModificacion?: Date;
}

Poliza.init(
  {
    PolizaID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TipoPoliza: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    CategoriaPoliza: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Aseguradora: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    NumeroPoliza: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    VehiculoID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PropiedadID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UsuarioID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ValorAsegurado: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    PrimaAnual: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    PrimaMensual: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    Deducible: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    Coberturas: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    FechaInicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    FechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    FechaRenovacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Estado: {
      type: DataTypes.STRING(50),
      defaultValue: 'Vigente',
    },
    TelefonoAseguradora: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    EmailAseguradora: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    AgenteAsignado: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    TelefonoAgente: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    RutaDocumento: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    Observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    FechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    FechaModificacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Polizas',
    timestamps: false,
  }
);

export default Poliza;
