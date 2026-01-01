import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PagoAttributes {
  PagoID: number;
  TipoPago: string;
  Categoria: string;
  VehiculoID?: number;
  PropiedadID?: number;
  ContratoID?: number;
  UsuarioID: number;
  Concepto: string;
  Descripcion?: string;
  Monto: number;
  FechaVencimiento: Date;
  FechaPago?: Date;
  Estado: string;
  FormaPago?: string;
  ReferenciaPago?: string;
  ComprobantePago?: string;
  RecordatorioEnviado: boolean;
  FechaCreacion: Date;
}

interface PagoCreationAttributes extends Optional<PagoAttributes, 'PagoID' | 'FechaCreacion' | 'RecordatorioEnviado' | 'Estado'> {}

class Pago extends Model<PagoAttributes, PagoCreationAttributes> implements PagoAttributes {
  public PagoID!: number;
  public TipoPago!: string;
  public Categoria!: string;
  public VehiculoID?: number;
  public PropiedadID?: number;
  public ContratoID?: number;
  public UsuarioID!: number;
  public Concepto!: string;
  public Descripcion?: string;
  public Monto!: number;
  public FechaVencimiento!: Date;
  public FechaPago?: Date;
  public Estado!: string;
  public FormaPago?: string;
  public ReferenciaPago?: string;
  public ComprobantePago?: string;
  public RecordatorioEnviado!: boolean;
  public FechaCreacion!: Date;
}

Pago.init(
  {
    PagoID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TipoPago: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Categoria: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    VehiculoID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PropiedadID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ContratoID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UsuarioID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Concepto: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Monto: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    FechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    FechaPago: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Estado: {
      type: DataTypes.STRING(50),
      defaultValue: 'Pendiente',
    },
    FormaPago: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ReferenciaPago: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ComprobantePago: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    RecordatorioEnviado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    FechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Pagos',
    timestamps: false,
  }
);

export default Pago;
