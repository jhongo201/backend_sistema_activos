import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Interfaz de atributos de la propiedad
interface PropiedadAttributes {
  PropiedadID: number;
  ActivoID: number;
  TipoPropiedad?: string;
  Direccion: string;
  Ciudad: string;
  Departamento: string;
  Barrio?: string;
  Latitud?: number;
  Longitud?: number;
  Estrato?: number;
  AreaConstruida?: number;
  AreaPrivada?: number;
  AreaLote?: number;
  AreaTerreno?: number;
  NumeroHabitaciones?: number;
  NumeroBanos?: number;
  NumeroBanosServicio?: number;
  NumeroPisos?: number;
  TieneParqueadero?: boolean;
  NumeroParqueaderos?: number;
  TieneCuartoUtil?: boolean;
  AnoContruccion?: number;
  NumeroDepositos?: number;
  Piso?: number;
  NumeroUnidad?: string;
  Antiguedad?: number;
  EstadoConservacion?: string;
  EstadoConstruccion?: string;
  
  // Amenidades
  TienePiscina?: boolean;
  TieneJardin?: boolean;
  TieneZonasSociales?: boolean;
  TieneAscensor?: boolean;
  TienePorteria?: boolean;
  TienePlantaElectrica?: boolean;
  
  // Información Legal
  MatriculaInmobiliaria?: string;
  NumeroMatriculaInmobiliaria?: string;
  CedulaCatastral?: string;
  ChipCatastral?: string;
  CatastroReferencia?: string;
  NumeroEscritura?: string;
  Notaria?: string;
  NotariaEscritura?: string;
  FechaEscritura?: Date;
  CiudadEscritura?: string;
  PropietarioAnterior?: string;
  CedulaAnteriorPropietario?: string;
  TelefonoAnteriorPropietario?: string;
  
  // Linderos
  LinderoNorte?: string;
  LinderoSur?: string;
  LinderoOriente?: string;
  LinderoOccidente?: string;
  
  // Servicios Públicos
  TieneAguaPotable?: boolean;
  TieneAlcantarillado?: boolean;
  TieneEnergia?: boolean;
  TieneGasNatural?: boolean;
  TieneInternet?: boolean;
  
  // Gravámenes
  TieneGravamenes: boolean;
  DetalleGravamenes?: string;
  
  // Hipoteca
  TieneHipoteca?: boolean;
  EntidadHipotecaria?: string;
  ValorHipoteca?: number;
  SaldoHipoteca?: number;
  
  // Embargos
  TieneEmbargos?: boolean;
  DetalleEmbargos?: string;
  
  // Avalúos
  AvaluoCatastral?: number;
  AvaluoComercial?: number;
  FechaUltimoAvaluoCatastral?: Date;
  FechaUltimoAvaluoComercial?: Date;
  
  // Impuestos y Administración
  ImpuestoPredialAnual?: number;
  ValorPredial?: number;
  FechaVencimientoPredial?: Date;
  TieneAdministracion?: boolean;
  ValorAdministracionMensual?: number;
  ValorAdministracion?: number;
  TieneValorizacion?: boolean;
  ValorValorizacionAnual?: number;
  ValorValorizacion?: number;
  FechaVencimientoValorizacion?: Date;
  
  // Propiedad Horizontal
  EsPropiedadHorizontal?: boolean;
  CoeficientePropiedad?: number;
  
  // Crédito Hipotecario
  EsCreditoHipotecario?: boolean;
  EsFinanciado?: boolean;
  EntidadFinanciera?: string;
  ValorCredito?: number;
  CuotaInicial?: number;
  NumeroCuotas?: number;
  ValorCuotaMensual?: number;
  ValorCuota?: number;
  TasaInteres?: number;
  SaldoPendiente?: number;
  FechaDesembolso?: Date;
  FechaVencimientoCredito?: Date;
  
  // Gastos de Compra
  GastosNotariales?: number;
  GastosRegistro?: number;
  GastosAvaluo?: number;
  GastosEstudioTitulos?: number;
  OtrosGastosCompra?: number;
  TotalGastosCompra?: number;
  
  // Arrendamiento
  EstaArrendada?: boolean;
  NombreArrendatario?: string;
  CedulaArrendatario?: string;
  TelefonoArrendatario?: string;
  ValorArriendo?: number;
  FechaInicioContrato?: Date;
  FechaFinContrato?: Date;
  
  // Avalúos Adicionales
  AvaluoComercialInicial?: number;
  AvaluoComercialActual?: number;
  FechaUltimoAvaluo?: Date;
}

// Atributos opcionales para creación
interface PropiedadCreationAttributes extends Optional<PropiedadAttributes, 'PropiedadID'> {}

class Propiedad extends Model<PropiedadAttributes, PropiedadCreationAttributes> implements PropiedadAttributes {
  public PropiedadID!: number;
  public ActivoID!: number;
  public TipoPropiedad?: string;
  public Direccion!: string;
  public Ciudad!: string;
  public Departamento!: string;
  public Barrio?: string;
  public Latitud?: number;
  public Longitud?: number;
  public Estrato?: number;
  public AreaTerreno?: number;
  public AreaConstruida?: number;
  public NumeroHabitaciones?: number;
  public NumeroBanos?: number;
  public NumeroPisos?: number;
  public TieneParqueadero?: boolean;
  public NumeroParqueaderos?: number;
  public TieneCuartoUtil?: boolean;
  public AnoContruccion?: number;
  public EstadoConstruccion?: string;
  
  public NumeroMatriculaInmobiliaria?: string;
  public CedulaCatastral?: string;
  public CatastroReferencia?: string;
  public NumeroEscritura?: string;
  public FechaEscritura?: Date;
  public NotariaEscritura?: string;
  public PropietarioAnterior?: string;
  public CedulaAnteriorPropietario?: string;
  public TelefonoAnteriorPropietario?: string;
  
  public TieneAguaPotable?: boolean;
  public TieneAlcantarillado?: boolean;
  public TieneEnergia?: boolean;
  public TieneGasNatural?: boolean;
  public TieneInternet?: boolean;
  
  public ValorPredial?: number;
  public FechaVencimientoPredial?: Date;
  public ValorValorizacion?: number;
  public FechaVencimientoValorizacion?: Date;
  
  public TieneAdministracion?: boolean;
  public ValorAdministracion?: number;
  
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
  
  public EstaArrendada?: boolean;
  public NombreArrendatario?: string;
  public CedulaArrendatario?: string;
  public TelefonoArrendatario?: string;
  public ValorArriendo?: number;
  public FechaInicioContrato?: Date;
  public FechaFinContrato?: Date;
  
  public AvaluoCatastral?: number;
  public AvaluoComercialInicial?: number;
  public AvaluoComercialActual?: number;
  public FechaUltimoAvaluo?: Date;
}

Propiedad.init(
  {
    PropiedadID: {
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
    TipoPropiedad: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Direccion: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Departamento: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Barrio: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Latitud: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    Longitud: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    Estrato: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    AreaTerreno: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    AreaConstruida: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    NumeroHabitaciones: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    NumeroBanos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    NumeroPisos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    TieneParqueadero: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NumeroParqueaderos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    TieneCuartoUtil: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AnoContruccion: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    EstadoConstruccion: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    NumeroMatriculaInmobiliaria: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    CedulaCatastral: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    CatastroReferencia: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    NumeroEscritura: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    FechaEscritura: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    NotariaEscritura: {
      type: DataTypes.STRING(200),
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
    TieneAguaPotable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    TieneAlcantarillado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    TieneEnergia: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    TieneGasNatural: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    TieneInternet: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ValorPredial: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    FechaVencimientoPredial: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ValorValorizacion: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    FechaVencimientoValorizacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    TieneAdministracion: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ValorAdministracion: {
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
    EstaArrendada: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NombreArrendatario: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    CedulaArrendatario: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    TelefonoArrendatario: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ValorArriendo: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    FechaInicioContrato: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    FechaFinContrato: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    AvaluoCatastral: {
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
  },
  {
    sequelize,
    tableName: 'Propiedades',
    timestamps: false,
  }
);

export default Propiedad;
