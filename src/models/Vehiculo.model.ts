import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interfaz de atributos del vehículo
interface VehiculoAttributes {
  VehiculoID: number;
  ActivoID: number;
  TipoVehiculo?: string;
  Marca: string;
  Linea: string;
  Modelo: number;
  Placa: string;
  NumeroChasis?: string;
  NumeroMotor?: string;
  NumeroCarroceria?: string;
  Serie?: string;
  Color?: string;
  Cilindraje?: number;
  TipoCombustible?: string;
  TipoCaja?: string;
  Clase?: string;
  Tipo?: string;
  TipoServicio?: string;
  Capacidad?: number;
  NumeroPuertas?: number;
  KilometrajeCompra?: number;
  KilometrajeActual?: number;
  
  // Información Legal
  NumeroTarjetaPropiedad?: string;
  OrganismoTransito?: string;
  PropietarioAnterior?: string;
  CedulaAnteriorPropietario?: string;
  TelefonoAnteriorPropietario?: string;
  
  // Vencimientos
  FechaVencimientoSOAT?: Date;
  NumeroSOAT?: string;
  AseguradoraSOAT?: string;
  FechaVencimientoTecnomecanica?: Date;
  NumeroTecnomecanica?: string;
  FechaVencimientoImpuesto?: Date;
  ValorImpuestoVehicular?: number;
  
  // Gravámenes
  TieneGravamenes: boolean;
  DetalleGravamenes?: string;
  
  // Financiación
  EsFinanciado: boolean;
  EntidadFinanciera?: string;
  ValorCredito?: number;
  CuotaInicial?: number;
  NumeroCuotas?: number;
  ValorCuota?: number;
  TasaInteres?: number;
  SaldoPendiente?: number;
  
  // Avalúos
  AvaluoComercialInicial?: number;
  AvaluoComercialActual?: number;
  FechaUltimoAvaluo?: Date;
  
  // Historial de propietarios
  PropietarioActualID?: number;
}

// Atributos opcionales para creación
interface VehiculoCreationAttributes extends Optional<VehiculoAttributes, 'VehiculoID'> {}

class Vehiculo extends Model<VehiculoAttributes, VehiculoCreationAttributes> implements VehiculoAttributes {
  public VehiculoID!: number;
  public ActivoID!: number;
  public TipoVehiculo?: string;
  public Marca!: string;
  public Linea!: string;
  public Modelo!: number;
  public Placa!: string;
  public NumeroChasis?: string;
  public NumeroMotor?: string;
  public NumeroCarroceria?: string;
  public Serie?: string;
  public Color?: string;
  public Cilindraje?: number;
  public TipoCombustible?: string;
  public TipoCaja?: string;
  public Clase?: string;
  public Tipo?: string;
  public TipoServicio?: string;
  public Capacidad?: number;
  public NumeroPuertas?: number;
  public KilometrajeCompra?: number;
  public KilometrajeActual?: number;
  
  public NumeroTarjetaPropiedad?: string;
  public OrganismoTransito?: string;
  public PropietarioAnterior?: string;
  public CedulaAnteriorPropietario?: string;
  public TelefonoAnteriorPropietario?: string;
  
  public FechaVencimientoSOAT?: Date;
  public NumeroSOAT?: string;
  public AseguradoraSOAT?: string;
  public FechaVencimientoTecnomecanica?: Date;
  public NumeroTecnomecanica?: string;
  public FechaVencimientoImpuesto?: Date;
  public ValorImpuestoVehicular?: number;
  
  public TieneGravamenes!: boolean;
  public DetalleGravamenes?: string;
  
  public EsFinanciado!: boolean;
  public EntidadFinanciera?: string;
  public ValorCredito?: number;
  public CuotaInicial?: number;
  public NumeroCuotas?: number;
  public ValorCuota?: number;
  public TasaInteres?: number;
  public SaldoPendiente?: number;
  
  public AvaluoComercialInicial?: number;
  public AvaluoComercialActual?: number;
  public FechaUltimoAvaluo?: Date;
  
  public PropietarioActualID?: number;
}

Vehiculo.init(
  {
    VehiculoID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ActivoID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Activos',
        key: 'ActivoID',
      },
    },
    TipoVehiculo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Marca: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Linea: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Modelo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Placa: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    NumeroChasis: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    NumeroMotor: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    NumeroCarroceria: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Serie: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Color: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    Cilindraje: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    TipoCombustible: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    TipoCaja: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Clase: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Tipo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    TipoServicio: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Capacidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    NumeroPuertas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    KilometrajeCompra: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    KilometrajeActual: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    NumeroTarjetaPropiedad: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    OrganismoTransito: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    PropietarioAnterior: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    CedulaAnteriorPropietario: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    TelefonoAnteriorPropietario: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    FechaVencimientoSOAT: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    NumeroSOAT: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    AseguradoraSOAT: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    FechaVencimientoTecnomecanica: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    NumeroTecnomecanica: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    FechaVencimientoImpuesto: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ValorImpuestoVehicular: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    TieneGravamenes: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    DetalleGravamenes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    EsFinanciado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    EntidadFinanciera: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ValorCredito: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    CuotaInicial: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    NumeroCuotas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ValorCuota: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    TasaInteres: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    SaldoPendiente: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    AvaluoComercialInicial: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    AvaluoComercialActual: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    FechaUltimoAvaluo: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    PropietarioActualID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Referencia al propietario actual en HistorialPropietarios',
    },
  },
  {
    sequelize,
    tableName: 'Vehiculos',
    timestamps: false,
  }
);

export default Vehiculo;
