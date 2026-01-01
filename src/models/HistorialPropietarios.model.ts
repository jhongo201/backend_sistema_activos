import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interfaz de atributos del historial de propietarios
interface HistorialPropietariosAttributes {
  HistorialID: number;
  VehiculoID: number;
  
  // Información del propietario
  TipoPropietario: 'Anterior' | 'Actual' | 'Nuevo';
  NombrePropietario: string;
  TipoDocumento?: string;
  NumeroDocumento: string;
  Telefono?: string;
  Email?: string;
  Direccion?: string;
  Ciudad?: string;
  
  // Fechas de transacción
  FechaAdquisicion?: Date;
  FechaVenta?: Date;
  
  // Información de la transacción
  ValorCompra?: number;
  ValorVenta?: number;
  ContratoID?: number;
  
  // Información legal del traspaso
  TraspasoRealizado: boolean;
  FechaTraspaso?: Date;
  NumeroTraspaso?: string;
  OrganismoTransito?: string;
  
  // Estado
  EsPropietarioActual: boolean;
  
  // Observaciones
  Observaciones?: string;
  
  // Auditoría
  FechaRegistro?: Date;
  FechaActualizacion?: Date;
  UsuarioRegistro?: number;
}

// Atributos opcionales para creación
interface HistorialPropietariosCreationAttributes 
  extends Optional<HistorialPropietariosAttributes, 'HistorialID' | 'TraspasoRealizado' | 'EsPropietarioActual'> {}

class HistorialPropietarios 
  extends Model<HistorialPropietariosAttributes, HistorialPropietariosCreationAttributes> 
  implements HistorialPropietariosAttributes {
  
  public HistorialID!: number;
  public VehiculoID!: number;
  
  public TipoPropietario!: 'Anterior' | 'Actual' | 'Nuevo';
  public NombrePropietario!: string;
  public TipoDocumento?: string;
  public NumeroDocumento!: string;
  public Telefono?: string;
  public Email?: string;
  public Direccion?: string;
  public Ciudad?: string;
  
  public FechaAdquisicion?: Date;
  public FechaVenta?: Date;
  
  public ValorCompra?: number;
  public ValorVenta?: number;
  public ContratoID?: number;
  
  public TraspasoRealizado!: boolean;
  public FechaTraspaso?: Date;
  public NumeroTraspaso?: string;
  public OrganismoTransito?: string;
  
  public EsPropietarioActual!: boolean;
  
  public Observaciones?: string;
  
  public FechaRegistro?: Date;
  public FechaActualizacion?: Date;
  public UsuarioRegistro?: number;
}

HistorialPropietarios.init(
  {
    HistorialID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    VehiculoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Vehiculos',
        key: 'VehiculoID',
      },
    },
    TipoPropietario: {
      type: DataTypes.ENUM('Anterior', 'Actual', 'Nuevo'),
      allowNull: false,
      comment: 'Anterior: propietario previo, Actual: propietario actual (yo), Nuevo: comprador',
    },
    NombrePropietario: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    TipoDocumento: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: 'CC',
    },
    NumeroDocumento: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Direccion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Ciudad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    FechaAdquisicion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Fecha en que este propietario adquirió el vehículo',
    },
    FechaVenta: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Fecha en que este propietario vendió el vehículo',
    },
    ValorCompra: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      comment: 'Valor al que se compró',
    },
    ValorVenta: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      comment: 'Valor al que se vendió',
    },
    ContratoID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Contratos',
        key: 'ContratoID',
      },
      comment: 'Referencia al contrato de compraventa si existe',
    },
    TraspasoRealizado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Si el traspaso legal ya se realizó',
    },
    FechaTraspaso: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Fecha en que se hizo el traspaso',
    },
    NumeroTraspaso: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Número de traspaso del organismo de tránsito',
    },
    OrganismoTransito: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Organismo de tránsito donde se hizo el traspaso',
    },
    EsPropietarioActual: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'TRUE si es el propietario actual del vehículo',
    },
    Observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    FechaRegistro: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    FechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    UsuarioRegistro: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Usuarios',
        key: 'UsuarioID',
      },
    },
  },
  {
    sequelize,
    tableName: 'HistorialPropietarios',
    timestamps: false,
    hasTrigger: true, // Indica que la tabla tiene triggers
  }
);

export default HistorialPropietarios;
