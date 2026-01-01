import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ReclamacionAttributes {
  ReclamacionID: number;
  PolizaID: number;
  UsuarioID: number;
  NumeroReclamacion?: string;
  TipoSiniestro: string;
  FechaSiniestro: Date;
  LugarSiniestro?: string;
  DescripcionSiniestro: string;
  MontoReclamado: number;
  MontoAprobado?: number;
  DeducibleAplicado?: number;
  MontoIndemnizado?: number;
  Estado: string;
  FechaRadicacion: Date;
  FechaAprobacion?: Date;
  FechaIndemnizacion?: Date;
  FechaCierre?: Date;
  AjustadorAsignado?: string;
  TelefonoAjustador?: string;
  EmailAjustador?: string;
  DocumentosSoportes?: string;
  InformePericial?: string;
  Observaciones?: string;
  MotivoRechazo?: string;
  FechaCreacion: Date;
  FechaModificacion?: Date;
}

interface ReclamacionCreationAttributes extends Optional<ReclamacionAttributes, 'ReclamacionID' | 'FechaCreacion' | 'FechaRadicacion' | 'Estado'> {}

class Reclamacion extends Model<ReclamacionAttributes, ReclamacionCreationAttributes> implements ReclamacionAttributes {
  public ReclamacionID!: number;
  public PolizaID!: number;
  public UsuarioID!: number;
  public NumeroReclamacion?: string;
  public TipoSiniestro!: string;
  public FechaSiniestro!: Date;
  public LugarSiniestro?: string;
  public DescripcionSiniestro!: string;
  public MontoReclamado!: number;
  public MontoAprobado?: number;
  public DeducibleAplicado?: number;
  public MontoIndemnizado?: number;
  public Estado!: string;
  public FechaRadicacion!: Date;
  public FechaAprobacion?: Date;
  public FechaIndemnizacion?: Date;
  public FechaCierre?: Date;
  public AjustadorAsignado?: string;
  public TelefonoAjustador?: string;
  public EmailAjustador?: string;
  public DocumentosSoportes?: string;
  public InformePericial?: string;
  public Observaciones?: string;
  public MotivoRechazo?: string;
  public FechaCreacion!: Date;
  public FechaModificacion?: Date;
}

Reclamacion.init(
  {
    ReclamacionID: {
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
    NumeroReclamacion: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    TipoSiniestro: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    FechaSiniestro: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    LugarSiniestro: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    DescripcionSiniestro: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    MontoReclamado: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    MontoAprobado: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    DeducibleAplicado: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    MontoIndemnizado: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    Estado: {
      type: DataTypes.STRING(50),
      defaultValue: 'Radicada',
    },
    FechaRadicacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    FechaAprobacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    FechaIndemnizacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    FechaCierre: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    AjustadorAsignado: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    TelefonoAjustador: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    EmailAjustador: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    DocumentosSoportes: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    InformePericial: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    Observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    MotivoRechazo: {
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
    tableName: 'Reclamaciones',
    timestamps: false,
  }
);

export default Reclamacion;
