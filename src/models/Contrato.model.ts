import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Contrato extends Model {
  public ContratoID!: number;
  public TipoContrato!: string;
  public Folio!: string;
  public VendedorNombre!: string;
  public VendedorTipoDocumento?: string;
  public VendedorDocumento!: string;
  public VendedorEstadoCivil?: string;
  public VendedorDireccion?: string;
  public VendedorDepartamento?: string;
  public VendedorCiudad?: string;
  public VendedorTelefono?: string;
  public VendedorEmail?: string;
  public CompradorNombre!: string;
  public CompradorTipoDocumento?: string;
  public CompradorDocumento!: string;
  public CompradorEstadoCivil?: string;
  public CompradorDireccion?: string;
  public CompradorDepartamento?: string;
  public CompradorCiudad?: string;
  public CompradorTelefono?: string;
  public CompradorEmail?: string;
  public VehiculoID?: number | null;
  public PropiedadID?: number | null;
  public ValorContrato!: number;
  public FormaPago!: string;
  public NumeroCuotas?: number | null;
  public ValorCuota?: number | null;
  public FechaContrato!: Date;
  public FechaInicio?: Date | null;
  public FechaFin?: Date | null;
  public Clausulas?: string | null;
  public ObservacionesAdicionales?: string | null;
  public HashDocumento!: string;
  public CodigoVerificacion!: string;
  public RutaArchivo!: string;
  public NombreArchivo!: string;
  public UsuarioCreadorID!: number;
  public FechaCreacion!: Date;
  public EstadoContrato!: string;
  public ModalidadContrato?: string;
  public ValorTotalEntrega?: number | null;
  public ValorTotalRecibe?: number | null;
  public DiferenciaValor?: number | null;
  public QuienPagaDiferencia?: string | null;
  public RutaDocumentoFirmado?: string | null;
  public RutaDocumentoAutenticado?: string | null;
  public FechaFirma?: Date | null;
  public TipoDocumentoFirmado?: string | null;
}

Contrato.init({
  ContratoID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  TipoContrato: { type: DataTypes.STRING(50), allowNull: false },
  Folio: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  VendedorNombre: DataTypes.STRING(200),
  VendedorTipoDocumento: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isIn: [['CC', 'CE', 'NIT', 'Pasaporte', 'TI']]
    }
  },
  VendedorDocumento: DataTypes.STRING(50),
  VendedorEstadoCivil: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['Soltero(a)', 'Casado(a)', 'Unión Libre', 'Divorciado(a)', 'Viudo(a)']]
    }
  },
  VendedorDireccion: DataTypes.STRING(300),
  VendedorDepartamento: DataTypes.STRING(10),
  VendedorCiudad: DataTypes.STRING(100),
  VendedorTelefono: DataTypes.STRING(50),
  VendedorEmail: DataTypes.STRING(255),
  CompradorNombre: DataTypes.STRING(200),
  CompradorTipoDocumento: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isIn: [['CC', 'CE', 'NIT', 'Pasaporte', 'TI']]
    }
  },
  CompradorDocumento: DataTypes.STRING(50),
  CompradorEstadoCivil: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['Soltero(a)', 'Casado(a)', 'Unión Libre', 'Divorciado(a)', 'Viudo(a)']]
    }
  },
  CompradorDireccion: DataTypes.STRING(300),
  CompradorDepartamento: DataTypes.STRING(10),
  CompradorCiudad: DataTypes.STRING(100),
  CompradorTelefono: DataTypes.STRING(50),
  CompradorEmail: DataTypes.STRING(255),
  VehiculoID: { type: DataTypes.INTEGER, allowNull: true },
  PropiedadID: { type: DataTypes.INTEGER, allowNull: true },
  ValorContrato: DataTypes.DECIMAL(18, 2),
  FormaPago: DataTypes.STRING(100),
  NumeroCuotas: DataTypes.INTEGER,
  ValorCuota: DataTypes.DECIMAL(18, 2),
  FechaContrato: DataTypes.DATEONLY,
  FechaInicio: DataTypes.DATEONLY,
  FechaFin: DataTypes.DATEONLY,
  Clausulas: DataTypes.TEXT,
  ObservacionesAdicionales: DataTypes.TEXT,
  HashDocumento: DataTypes.STRING(500),
  CodigoVerificacion: { type: DataTypes.STRING(100), unique: true },
  RutaArchivo: DataTypes.STRING(500),
  NombreArchivo: DataTypes.STRING(200),
  UsuarioCreadorID: { type: DataTypes.INTEGER, allowNull: false },
  FechaCreacion: { 
    type: DataTypes.DATE, 
    allowNull: false,
    defaultValue: sequelize.literal('GETDATE()')
  },
  EstadoContrato: { type: DataTypes.STRING(50), defaultValue: 'Generado' },
  ModalidadContrato: { 
    type: DataTypes.STRING(50), 
    defaultValue: 'Compraventa',
    validate: {
      isIn: [[
        'Compraventa', 
        'Permuta', 
        'Permuta con Saldo', 
        'Arrendamiento', 
        'Comodato', 
        'Cesión de Derechos', 
        'Dación en Pago', 
        'Promesa', 
        'Transacción', 
        'Contrato Mixto', 
        'Personalizado', 
        'Otro'
      ]]
    }
  },
  ValorTotalEntrega: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
  ValorTotalRecibe: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
  DiferenciaValor: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
  QuienPagaDiferencia: { 
    type: DataTypes.STRING(20), 
    allowNull: true,
    validate: {
      isIn: [['Vendedor', 'Comprador', null]]
    }
  },
  RutaDocumentoFirmado: { type: DataTypes.STRING(500), allowNull: true },
  RutaDocumentoAutenticado: { type: DataTypes.STRING(500), allowNull: true },
  FechaFirma: { type: DataTypes.DATE, allowNull: true },
  TipoDocumentoFirmado: { 
    type: DataTypes.STRING(20), 
    allowNull: true,
    validate: {
      isIn: [['firmado', 'autenticado', null]]
    }
  }
}, {
  sequelize,
  tableName: 'Contratos',
  timestamps: false
});

export default Contrato;