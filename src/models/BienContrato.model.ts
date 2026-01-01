import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class BienContrato extends Model {
  public BienContratoID!: number;
  public ContratoID!: number;
  public TipoBien!: string;
  public Rol!: string;
  public Parte!: string;
  public VehiculoID?: number | null;
  public PropiedadID?: number | null;
  public DescripcionBien?: string | null;
  public ValorComercial!: number;
  public Marca?: string | null;
  public Modelo?: string | null;
  public Anio?: number | null;
  public Placa?: string | null;
  public Matricula?: string | null;
  public Observaciones?: string | null;
  
  // Campos técnicos del vehículo
  public Clase?: string | null;
  public Linea?: string | null;
  public Cilindraje?: string | null;
  public Capacidad?: number | null;
  public NumeroMotor?: string | null;
  public Serie?: string | null;
  public Color?: string | null;
  public Tipo?: string | null;
  public Servicio?: string | null;
  public NumeroChasis?: string | null;
  public NumeroCarroceria?: string | null;
  public TipoCombustible?: string | null;
  public KilometrajeCompra?: number | null;
  public KilometrajeActual?: number | null;
  
  // Campos de documentación
  public FechaVencimientoSOAT?: Date | null;
  public NumeroSOAT?: string | null;
  public AseguradoraSOAT?: string | null;
  public FechaVencimientoTecnomecanica?: Date | null;
  
  // Campos de estado legal
  public EstadoImpuestos?: string | null;
  public AniosImpuestosPendientes?: string | null;
  public TieneEmbargos?: boolean | null;
  
  // ========================================
  // CAMPOS DE PROPIEDADES/INMUEBLES
  // ========================================
  
  // Información básica del inmueble
  public TipoInmueble?: string | null;
  public DireccionCompleta?: string | null;
  public Municipio?: string | null;
  public Departamento?: string | null;
  public Barrio?: string | null;
  
  // Información catastral y registral
  public MatriculaInmobiliaria?: string | null;
  public CedulaCatastral?: string | null;
  public ChipCatastral?: string | null;
  public OficinaRegistro?: string | null;
  
  // Áreas y medidas
  public AreaConstruida?: number | null;
  public AreaPrivada?: number | null;
  public AreaTerreno?: number | null;
  public Linderos?: string | null;
  
  // Propiedad horizontal
  public EsPropiedadHorizontal?: boolean | null;
  public CoeficienteCopropiedad?: number | null;
  public NombreConjunto?: string | null;
  public NumeroApartamento?: string | null;
  public Torre?: string | null;
  public Piso?: string | null;
  public ParqueaderosPrivados?: number | null;
  public Depositos?: number | null;
  
  // Título de adquisición del vendedor
  public EscrituraPublicaNumero?: string | null;
  public NotariaEscritura?: string | null;
  public CiudadEscritura?: string | null;
  public FechaEscritura?: Date | null;
  public ActoJuridico?: string | null;
  public FechaRegistro?: Date | null;
  
  // Impuestos y estado financiero
  public ImpuestoPredialAlDia?: boolean | null;
  public ValorImpuestoPredial?: number | null;
  public AniosPredialPendientes?: string | null;
  public TieneValorizacion?: boolean | null;
  public ValorValorizacion?: number | null;
  public ValorizacionAlDia?: boolean | null;
  public ValorAdministracion?: number | null;
  public AdministracionAlDia?: boolean | null;
  
  // Gastos de compraventa
  public QuienPagaEscritura?: string | null;
  public QuienPagaRegistro?: string | null;
  public QuienPagaDerechosNotariales?: string | null;
  public QuienPagaImpuestoRegistro?: string | null;
  public QuienPagaBeneficencia?: string | null;
  
  // Retención en la fuente
  public AplicaRetencionFuente?: boolean | null;
  public PorcentajeRetencion?: number | null;
  public BaseRetencion?: number | null;
  public ValorRetencion?: number | null;
  
  // Características adicionales
  public NumeroHabitaciones?: number | null;
  public NumeroBanos?: number | null;
  public Estrato?: number | null;
  public AntiguedadInmueble?: number | null;
  public EstadoInmueble?: string | null;
  
  // Restricciones y gravámenes
  public TieneHipoteca?: boolean | null;
  public EntidadHipoteca?: string | null;
  public SaldoHipoteca?: number | null;
  public TieneEmbargosInmueble?: boolean | null;
  public TieneLimitacionesDominio?: boolean | null;
  public DescripcionLimitaciones?: string | null;
}

BienContrato.init({
  BienContratoID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ContratoID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Contratos',
      key: 'ContratoID'
    }
  },
  TipoBien: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: [['Vehiculo', 'Propiedad', 'Moto', 'Otro']]
    }
  },
  Rol: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['Entrega', 'Recibe']]
    }
  },
  Parte: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['Vendedor', 'Comprador']]
    }
  },
  VehiculoID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Vehiculos',
      key: 'VehiculoID'
    }
  },
  PropiedadID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Propiedades',
      key: 'PropiedadID'
    }
  },
  DescripcionBien: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  ValorComercial: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  Marca: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Modelo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Anio: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Placa: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  Matricula: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Campos técnicos del vehículo
  Clase: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Linea: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Cilindraje: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Capacidad: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  NumeroMotor: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Serie: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Color: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Tipo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Servicio: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  NumeroChasis: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  NumeroCarroceria: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  TipoCombustible: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  KilometrajeCompra: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  KilometrajeActual: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  // Campos de documentación
  FechaVencimientoSOAT: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  NumeroSOAT: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  AseguradoraSOAT: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  FechaVencimientoTecnomecanica: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  // Campos de estado legal
  EstadoImpuestos: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isIn: [['Al Dia', 'Debe']]
    }
  },
  AniosImpuestosPendientes: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  TieneEmbargos: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  
  // ========================================
  // CAMPOS DE PROPIEDADES/INMUEBLES
  // ========================================
  
  // Información básica del inmueble
  TipoInmueble: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['Casa', 'Apartamento', 'Lote', 'Local Comercial', 'Oficina', 'Bodega', 'Finca', 'Parqueadero', 'Otro']]
    }
  },
  DireccionCompleta: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  Municipio: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Departamento: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  Barrio: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  
  // Información catastral y registral
  MatriculaInmobiliaria: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  CedulaCatastral: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  ChipCatastral: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  OficinaRegistro: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  
  // Áreas y medidas
  AreaConstruida: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  AreaPrivada: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  AreaTerreno: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  Linderos: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Propiedad horizontal
  EsPropiedadHorizontal: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  CoeficienteCopropiedad: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  },
  NombreConjunto: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  NumeroApartamento: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Torre: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Piso: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  ParqueaderosPrivados: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Depositos: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  // Título de adquisición del vendedor
  EscrituraPublicaNumero: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  NotariaEscritura: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  CiudadEscritura: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  FechaEscritura: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  ActoJuridico: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isIn: [['Compraventa', 'Sucesion', 'Donacion', 'Adjudicacion', 'Permuta', 'Dacion en Pago', 'Otro']]
    }
  },
  FechaRegistro: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  
  // Impuestos y estado financiero
  ImpuestoPredialAlDia: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  ValorImpuestoPredial: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  AniosPredialPendientes: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  TieneValorizacion: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  ValorValorizacion: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  ValorizacionAlDia: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  ValorAdministracion: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  AdministracionAlDia: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  
  // Gastos de compraventa
  QuienPagaEscritura: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['Vendedor', 'Comprador', 'Mitad']]
    }
  },
  QuienPagaRegistro: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['Vendedor', 'Comprador', 'Mitad']]
    }
  },
  QuienPagaDerechosNotariales: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['Vendedor', 'Comprador', 'Mitad']]
    }
  },
  QuienPagaImpuestoRegistro: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['Vendedor', 'Comprador', 'Mitad']]
    }
  },
  QuienPagaBeneficencia: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['Vendedor', 'Comprador', 'Mitad']]
    }
  },
  
  // Retención en la fuente
  AplicaRetencionFuente: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  PorcentajeRetencion: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  BaseRetencion: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  ValorRetencion: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  
  // Características adicionales
  NumeroHabitaciones: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  NumeroBanos: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Estrato: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 6
    }
  },
  AntiguedadInmueble: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  EstadoInmueble: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['Nuevo', 'Usado', 'Remodelado', 'En Construccion', 'A Remodelar']]
    }
  },
  
  // Restricciones y gravámenes
  TieneHipoteca: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  EntidadHipoteca: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  SaldoHipoteca: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true
  },
  TieneEmbargosInmueble: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  TieneLimitacionesDominio: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  DescripcionLimitaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'BienesContrato',
  timestamps: false
});

export default BienContrato;
