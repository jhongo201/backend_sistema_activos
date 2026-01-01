import Joi from 'joi';

/**
 * Schema de validación para crear una propiedad
 */
export const crearPropiedadSchema = Joi.object({
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

  // Datos específicos de la Propiedad
  TipoPropiedad: Joi.string().max(50).allow('', null),
  Direccion: Joi.string().max(200).required()
    .messages({
      'string.empty': 'La dirección es requerida',
      'any.required': 'La dirección es requerida',
    }),
  Ciudad: Joi.string().max(100).required()
    .messages({
      'string.empty': 'La ciudad es requerida',
      'any.required': 'La ciudad es requerida',
    }),
  Departamento: Joi.string().max(100).required()
    .messages({
      'string.empty': 'El departamento es requerido',
      'any.required': 'El departamento es requerido',
    }),
  Barrio: Joi.string().max(100).allow('', null),
  Latitud: Joi.number().min(-90).max(90).allow(null),
  Longitud: Joi.number().min(-180).max(180).allow(null),
  Estrato: Joi.number().integer().min(1).max(6).allow(null),
  AreaTerreno: Joi.number().positive().allow(null),
  AreaConstruida: Joi.number().positive().allow(null),
  NumeroHabitaciones: Joi.number().integer().min(0).allow(null),
  NumeroBanos: Joi.number().integer().min(0).allow(null),
  NumeroPisos: Joi.number().integer().min(1).allow(null),
  TieneParqueadero: Joi.boolean().allow(null),
  NumeroParqueaderos: Joi.number().integer().min(0).allow(null),
  TieneCuartoUtil: Joi.boolean().allow(null),
  AnoContruccion: Joi.number().integer().min(1900).max(new Date().getFullYear()).allow(null),
  EstadoConstruccion: Joi.string().max(50).allow('', null),

  // Información Legal
  NumeroMatriculaInmobiliaria: Joi.string().max(50).allow('', null),
  CedulaCatastral: Joi.string().max(50).allow('', null),
  CatastroReferencia: Joi.string().max(100).allow('', null),
  NumeroEscritura: Joi.string().max(50).allow('', null),
  FechaEscritura: Joi.date().allow(null),
  NotariaEscritura: Joi.string().max(200).allow('', null),
  PropietarioAnterior: Joi.string().max(100).allow('', null),
  CedulaAnteriorPropietario: Joi.string().max(20).allow('', null),
  TelefonoAnteriorPropietario: Joi.string().max(20).allow('', null),

  // Servicios Públicos
  TieneAguaPotable: Joi.boolean().allow(null),
  TieneAlcantarillado: Joi.boolean().allow(null),
  TieneEnergia: Joi.boolean().allow(null),
  TieneGasNatural: Joi.boolean().allow(null),
  TieneInternet: Joi.boolean().allow(null),

  // Impuestos
  ValorPredial: Joi.number().positive().allow(null),
  FechaVencimientoPredial: Joi.date().allow(null),
  ValorValorizacion: Joi.number().positive().allow(null),
  FechaVencimientoValorizacion: Joi.date().allow(null),

  // Administración
  TieneAdministracion: Joi.boolean().allow(null),
  ValorAdministracion: Joi.number().positive().allow(null),

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

  // Arrendamiento
  EstaArrendada: Joi.boolean().allow(null),
  NombreArrendatario: Joi.string().max(100).allow('', null),
  CedulaArrendatario: Joi.string().max(20).allow('', null),
  TelefonoArrendatario: Joi.string().max(20).allow('', null),
  ValorArriendo: Joi.number().positive().allow(null),
  FechaInicioContrato: Joi.date().allow(null),
  FechaFinContrato: Joi.date().allow(null),

  // Avalúos
  AvaluoCatastral: Joi.number().positive().allow(null),
  AvaluoComercialInicial: Joi.number().positive().allow(null),
  AvaluoComercialActual: Joi.number().positive().allow(null),
  FechaUltimoAvaluo: Joi.date().allow(null),
});

/**
 * Schema de validación para actualizar una propiedad
 */
export const actualizarPropiedadSchema = Joi.object({
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

  // Datos de la Propiedad
  TipoPropiedad: Joi.string().max(50).allow('', null),
  Direccion: Joi.string().max(200),
  Ciudad: Joi.string().max(100),
  Departamento: Joi.string().max(100),
  Barrio: Joi.string().max(100).allow('', null),
  Latitud: Joi.number().min(-90).max(90).allow(null, ''),
  Longitud: Joi.number().min(-180).max(180).allow(null, ''),
  Estrato: Joi.number().integer().min(1).max(6).allow(null, ''),
  AreaTerreno: Joi.number().positive().allow(null, ''),
  AreaConstruida: Joi.number().positive().allow(null, ''),
  NumeroHabitaciones: Joi.number().integer().min(0).allow(null, ''),
  NumeroBanos: Joi.number().integer().min(0).allow(null, ''),
  NumeroPisos: Joi.number().integer().min(1).allow(null, ''),
  TieneParqueadero: Joi.boolean().allow(null),
  NumeroParqueaderos: Joi.number().integer().min(0).allow(null, ''),
  TieneCuartoUtil: Joi.boolean().allow(null),
  AnoContruccion: Joi.number().integer().min(1900).max(new Date().getFullYear()).allow(null),
  EstadoConstruccion: Joi.string().max(50).allow('', null),

  NumeroMatriculaInmobiliaria: Joi.string().max(50).allow('', null),
  CedulaCatastral: Joi.string().max(50).allow('', null),
  CatastroReferencia: Joi.string().max(100).allow('', null),
  NumeroEscritura: Joi.string().max(50).allow('', null),
  FechaEscritura: Joi.date().allow(null),
  NotariaEscritura: Joi.string().max(200).allow('', null),
  PropietarioAnterior: Joi.string().max(100).allow('', null),
  CedulaAnteriorPropietario: Joi.string().max(20).allow('', null),
  TelefonoAnteriorPropietario: Joi.string().max(20).allow('', null),

  TieneAguaPotable: Joi.boolean().allow(null),
  TieneAlcantarillado: Joi.boolean().allow(null),
  TieneEnergia: Joi.boolean().allow(null),
  TieneGasNatural: Joi.boolean().allow(null),
  TieneInternet: Joi.boolean().allow(null),

  ValorPredial: Joi.number().positive().allow(null, ''),
  FechaVencimientoPredial: Joi.date().allow(null, ''),
  ValorValorizacion: Joi.number().positive().allow(null, ''),
  FechaVencimientoValorizacion: Joi.date().allow(null, ''),

  TieneAdministracion: Joi.boolean().allow(null),
  ValorAdministracion: Joi.number().positive().allow(null, ''),

  TieneGravamenes: Joi.boolean(),
  DetalleGravamenes: Joi.string().allow('', null),

  EsFinanciado: Joi.boolean(),
  EntidadFinanciera: Joi.string().max(100).allow('', null),
  ValorCredito: Joi.number().positive().allow(null, ''),
  CuotaInicial: Joi.number().positive().allow(null, ''),
  NumeroCuotas: Joi.number().integer().positive().allow(null, ''),
  ValorCuota: Joi.number().positive().allow(null, ''),
  TasaInteres: Joi.number().positive().max(100).allow(null, ''),
  SaldoPendiente: Joi.number().min(0).allow(null, ''),

  EstaArrendada: Joi.boolean().allow(null),
  NombreArrendatario: Joi.string().max(100).allow('', null),
  CedulaArrendatario: Joi.string().max(20).allow('', null),
  TelefonoArrendatario: Joi.string().max(20).allow('', null),
  ValorArriendo: Joi.number().positive().allow(null, ''),
  FechaInicioContrato: Joi.date().allow(null, ''),
  FechaFinContrato: Joi.date().allow(null, ''),

  AvaluoCatastral: Joi.number().positive().allow(null, ''),
  AvaluoComercialInicial: Joi.number().positive().allow(null, ''),
  AvaluoComercialActual: Joi.number().positive().allow(null, ''),
  FechaUltimoAvaluo: Joi.date().allow(null, ''),
}).min(1);

/**
 * Schema para filtros de búsqueda
 */
export const filtrosPropiedadSchema = Joi.object({
  ciudad: Joi.string().max(100),
  departamento: Joi.string().max(100),
  tipoPropiedad: Joi.string().max(50),
  estado: Joi.string().valid('Activo', 'En Venta', 'Vendido', 'Inactivo'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('FechaCompra', 'Ciudad', 'ValorCompra', 'Direccion').default('FechaCompra'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
});
