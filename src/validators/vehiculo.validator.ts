import Joi from 'joi';

/**
 * Schema de validación para crear un vehículo
 */
export const crearVehiculoSchema = Joi.object({
  // Datos del Activo (padre)
  CodigoInterno: Joi.string().max(50).optional()
    .messages({
      'string.max': 'El código interno no puede exceder 50 caracteres',
    }),
  FechaCompra: Joi.date().required()
    .messages({
      'date.base': 'La fecha de compra debe ser una fecha válida',
      'any.required': 'La fecha de compra es requerida',
    }),
  ValorCompra: Joi.number().positive().required()
    .messages({
      'number.positive': 'El valor de compra debe ser mayor a cero',
      'any.required': 'El valor de compra es requerido',
    }),
  FormaPago: Joi.string().max(50).allow('', null),
  OrigenFondos: Joi.string().max(100).allow('', null),
  DetalleOrigenFondos: Joi.string().max(500).allow('', null),
  Observaciones: Joi.string().allow('', null),

  // Datos específicos del Vehículo
  TipoVehiculo: Joi.string().max(50).allow('', null),
  Marca: Joi.string().max(50).required()
    .messages({
      'string.empty': 'La marca es requerida',
      'any.required': 'La marca es requerida',
    }),
  Linea: Joi.string().max(50).required()
    .messages({
      'string.empty': 'La línea es requerida',
      'any.required': 'La línea es requerida',
    }),
  Modelo: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required()
    .messages({
      'number.base': 'El modelo debe ser un año válido',
      'number.min': 'El modelo debe ser mayor a 1900',
      'number.max': 'El modelo no puede ser mayor al año siguiente',
      'any.required': 'El modelo es requerido',
    }),
  Placa: Joi.string().max(10).required()
    .messages({
      'string.empty': 'La placa es requerida',
      'any.required': 'La placa es requerida',
    }),
  NumeroChasis: Joi.string().max(50).allow('', null),
  NumeroMotor: Joi.string().max(50).allow('', null),
  NumeroCarroceria: Joi.string().max(50).allow('', null),
  Serie: Joi.string().max(50).allow('', null),
  Color: Joi.string().max(30).allow('', null),
  Cilindraje: Joi.number().integer().positive().allow(null),
  TipoCombustible: Joi.string().max(30).allow('', null),
  TipoCaja: Joi.string().max(20).allow('', null),
  Clase: Joi.string().max(50).allow('', null),
  Tipo: Joi.string().max(50).allow('', null),
  TipoServicio: Joi.string().max(20).allow('', null),
  Servicio: Joi.string().max(20).allow('', null), // Alias para TipoServicio
  Capacidad: Joi.number().integer().min(1).allow(null),
  NumeroPuertas: Joi.number().integer().min(1).max(10).allow(null),
  KilometrajeCompra: Joi.number().integer().min(0).allow(null),
  KilometrajeActual: Joi.number().integer().min(0).allow(null),

  // Información Legal
  NumeroTarjetaPropiedad: Joi.string().max(50).allow('', null),
  OrganismoTransito: Joi.string().max(100).allow('', null),
  PropietarioAnterior: Joi.string().max(100).allow('', null),
  CedulaAnteriorPropietario: Joi.string().max(20).allow('', null),
  TelefonoAnteriorPropietario: Joi.string().max(20).allow('', null),

  // Vencimientos
  FechaVencimientoSOAT: Joi.date().allow(null),
  NumeroSOAT: Joi.string().max(50).allow('', null),
  AseguradoraSOAT: Joi.string().max(100).allow('', null),
  FechaVencimientoTecnomecanica: Joi.date().allow(null),
  NumeroTecnomecanica: Joi.string().max(50).allow('', null),
  FechaVencimientoImpuesto: Joi.date().allow(null),
  ValorImpuestoVehicular: Joi.number().positive().allow(null),

  // Gravámenes
  TieneGravamenes: Joi.boolean().default(false),
  DetalleGravamenes: Joi.string().allow('', null),

  // Financiación
  EsFinanciado: Joi.boolean().default(false),
  EntidadFinanciera: Joi.string().max(100).allow('', null),
  ValorCredito: Joi.number().positive().allow(null),
  CuotaInicial: Joi.number().positive().allow(null),
  NumeroCuotas: Joi.number().integer().positive().allow(null),
  ValorCuota: Joi.number().positive().allow(null),
  TasaInteres: Joi.number().positive().max(100).allow(null),
  SaldoPendiente: Joi.number().min(0).allow(null),

  // Avalúos
  AvaluoComercialInicial: Joi.number().positive().allow(null),
  AvaluoComercialActual: Joi.number().positive().allow(null),
  FechaUltimoAvaluo: Joi.date().allow(null),
});

/**
 * Schema de validación para actualizar un vehículo
 * Todos los campos son opcionales excepto que se especifique lo contrario
 */
export const actualizarVehiculoSchema = Joi.object({
  // Datos del Activo
  CodigoInterno: Joi.string().max(50),
  FechaCompra: Joi.date(),
  ValorCompra: Joi.number().positive(),
  FormaPago: Joi.string().max(50).allow('', null),
  OrigenFondos: Joi.string().max(100).allow('', null),
  DetalleOrigenFondos: Joi.string().max(500).allow('', null),
  EstadoActual: Joi.string().valid('Activo', 'En Venta', 'Vendido', 'Inactivo'),
  FechaVenta: Joi.date().allow(null),
  ValorVenta: Joi.number().positive().allow(null),
  Observaciones: Joi.string().allow('', null),

  // Datos del Vehículo
  TipoVehiculo: Joi.string().max(50).allow('', null),
  Marca: Joi.string().max(50),
  Linea: Joi.string().max(50),
  Modelo: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
  Placa: Joi.string().max(10),
  NumeroChasis: Joi.string().max(50).allow('', null),
  NumeroMotor: Joi.string().max(50).allow('', null),
  NumeroCarroceria: Joi.string().max(50).allow('', null),
  Serie: Joi.string().max(50).allow('', null),
  Color: Joi.string().max(30).allow('', null),
  Cilindraje: Joi.number().integer().positive().allow(null),
  TipoCombustible: Joi.string().max(30).allow('', null),
  TipoCaja: Joi.string().max(20).allow('', null),
  Clase: Joi.string().max(50).allow('', null),
  Tipo: Joi.string().max(50).allow('', null),
  TipoServicio: Joi.string().max(20).allow('', null),
  Servicio: Joi.string().max(20).allow('', null), // Alias para TipoServicio
  Capacidad: Joi.number().integer().min(1).allow(null),
  NumeroPuertas: Joi.number().integer().min(1).max(10).allow(null),
  KilometrajeCompra: Joi.number().integer().min(0).allow(null),
  KilometrajeActual: Joi.number().integer().min(0).allow(null),

  NumeroTarjetaPropiedad: Joi.string().max(50).allow('', null),
  OrganismoTransito: Joi.string().max(100).allow('', null),
  PropietarioAnterior: Joi.string().max(100).allow('', null),
  CedulaAnteriorPropietario: Joi.string().max(20).allow('', null),
  TelefonoAnteriorPropietario: Joi.string().max(20).allow('', null),

  FechaVencimientoSOAT: Joi.date().allow(null),
  NumeroSOAT: Joi.string().max(50).allow('', null),
  AseguradoraSOAT: Joi.string().max(100).allow('', null),
  FechaVencimientoTecnomecanica: Joi.date().allow(null),
  NumeroTecnomecanica: Joi.string().max(50).allow('', null),
  FechaVencimientoImpuesto: Joi.date().allow(null),
  ValorImpuestoVehicular: Joi.number().positive().allow(null),

  TieneGravamenes: Joi.boolean(),
  DetalleGravamenes: Joi.string().allow('', null),

  EsFinanciado: Joi.boolean(),
  EntidadFinanciera: Joi.string().max(100).allow('', null),
  ValorCredito: Joi.number().positive().allow(null),
  CuotaInicial: Joi.number().positive().allow(null),
  NumeroCuotas: Joi.number().integer().positive().allow(null),
  ValorCuota: Joi.number().positive().allow(null),
  TasaInteres: Joi.number().positive().max(100).allow(null),
  SaldoPendiente: Joi.number().min(0).allow(null),

  AvaluoComercialInicial: Joi.number().positive().allow(null),
  AvaluoComercialActual: Joi.number().positive().allow(null),
  FechaUltimoAvaluo: Joi.date().allow(null),
}).min(1); // Al menos un campo debe ser enviado

/**
 * Schema para filtros de búsqueda
 */
export const filtrosVehiculoSchema = Joi.object({
  marca: Joi.string().max(50),
  modelo: Joi.number().integer(),
  placa: Joi.string().max(10),
  estado: Joi.string().valid('Activo', 'En Venta', 'Vendido', 'Inactivo'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('FechaCompra', 'Marca', 'Modelo', 'ValorCompra').default('FechaCompra'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
});
