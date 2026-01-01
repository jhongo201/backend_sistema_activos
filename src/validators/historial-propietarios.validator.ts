import Joi from 'joi';

/**
 * Schema para registrar propietario anterior
 */
export const registrarPropietarioAnteriorSchema = Joi.object({
  vehiculoID: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El ID del vehículo debe ser un número',
      'number.positive': 'El ID del vehículo debe ser positivo',
      'any.required': 'El ID del vehículo es requerido',
    }),
  nombrePropietario: Joi.string().max(200).required()
    .messages({
      'string.max': 'El nombre no puede exceder 200 caracteres',
      'any.required': 'El nombre del propietario es requerido',
    }),
  tipoDocumento: Joi.string().max(20).optional().default('CC')
    .messages({
      'string.max': 'El tipo de documento no puede exceder 20 caracteres',
    }),
  numeroDocumento: Joi.string().max(50).required()
    .messages({
      'string.max': 'El número de documento no puede exceder 50 caracteres',
      'any.required': 'El número de documento es requerido',
    }),
  telefono: Joi.string().max(20).optional()
    .messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres',
    }),
  email: Joi.string().email().max(100).optional()
    .messages({
      'string.email': 'El email debe ser válido',
      'string.max': 'El email no puede exceder 100 caracteres',
    }),
  direccion: Joi.string().max(200).optional()
    .messages({
      'string.max': 'La dirección no puede exceder 200 caracteres',
    }),
  ciudad: Joi.string().max(100).optional()
    .messages({
      'string.max': 'La ciudad no puede exceder 100 caracteres',
    }),
  fechaAdquisicion: Joi.date().optional()
    .messages({
      'date.base': 'La fecha de adquisición debe ser una fecha válida',
    }),
  valorCompra: Joi.number().positive().optional()
    .messages({
      'number.base': 'El valor de compra debe ser un número',
      'number.positive': 'El valor de compra debe ser positivo',
    }),
  observaciones: Joi.string().optional()
    .messages({
      'string.base': 'Las observaciones deben ser texto',
    }),
});

/**
 * Schema para registrar propietario actual
 */
export const registrarPropietarioActualSchema = Joi.object({
  vehiculoID: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El ID del vehículo debe ser un número',
      'number.positive': 'El ID del vehículo debe ser positivo',
      'any.required': 'El ID del vehículo es requerido',
    }),
  nombrePropietario: Joi.string().max(200).required()
    .messages({
      'string.max': 'El nombre no puede exceder 200 caracteres',
      'any.required': 'El nombre del propietario es requerido',
    }),
  tipoDocumento: Joi.string().max(20).optional().default('CC')
    .messages({
      'string.max': 'El tipo de documento no puede exceder 20 caracteres',
    }),
  numeroDocumento: Joi.string().max(50).required()
    .messages({
      'string.max': 'El número de documento no puede exceder 50 caracteres',
      'any.required': 'El número de documento es requerido',
    }),
  telefono: Joi.string().max(20).optional()
    .messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres',
    }),
  email: Joi.string().email().max(100).optional()
    .messages({
      'string.email': 'El email debe ser válido',
      'string.max': 'El email no puede exceder 100 caracteres',
    }),
  direccion: Joi.string().max(200).optional()
    .messages({
      'string.max': 'La dirección no puede exceder 200 caracteres',
    }),
  ciudad: Joi.string().max(100).optional()
    .messages({
      'string.max': 'La ciudad no puede exceder 100 caracteres',
    }),
  fechaAdquisicion: Joi.date().optional()
    .messages({
      'date.base': 'La fecha de adquisición debe ser una fecha válida',
    }),
  valorCompra: Joi.number().positive().optional()
    .messages({
      'number.base': 'El valor de compra debe ser un número',
      'number.positive': 'El valor de compra debe ser positivo',
    }),
  traspasoRealizado: Joi.boolean().optional().default(false)
    .messages({
      'boolean.base': 'El traspaso realizado debe ser verdadero o falso',
    }),
  fechaTraspaso: Joi.date().optional()
    .messages({
      'date.base': 'La fecha de traspaso debe ser una fecha válida',
    }),
  numeroTraspaso: Joi.string().max(50).optional()
    .messages({
      'string.max': 'El número de traspaso no puede exceder 50 caracteres',
    }),
  organismoTransito: Joi.string().max(100).optional()
    .messages({
      'string.max': 'El organismo de tránsito no puede exceder 100 caracteres',
    }),
  contratoID: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'El ID del contrato debe ser un número',
      'number.positive': 'El ID del contrato debe ser positivo',
    }),
  observaciones: Joi.string().optional()
    .messages({
      'string.base': 'Las observaciones deben ser texto',
    }),
});

/**
 * Schema para registrar traspaso
 */
export const registrarTraspasoSchema = Joi.object({
  vehiculoID: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El ID del vehículo debe ser un número',
      'number.positive': 'El ID del vehículo debe ser positivo',
      'any.required': 'El ID del vehículo es requerido',
    }),
  fechaTraspaso: Joi.date().required()
    .messages({
      'date.base': 'La fecha de traspaso debe ser una fecha válida',
      'any.required': 'La fecha de traspaso es requerida',
    }),
  numeroTraspaso: Joi.string().max(50).optional()
    .messages({
      'string.max': 'El número de traspaso no puede exceder 50 caracteres',
    }),
  organismoTransito: Joi.string().max(100).optional()
    .messages({
      'string.max': 'El organismo de tránsito no puede exceder 100 caracteres',
    }),
  observaciones: Joi.string().optional()
    .messages({
      'string.base': 'Las observaciones deben ser texto',
    }),
});

/**
 * Schema para registrar venta
 */
export const registrarVentaSchema = Joi.object({
  vehiculoID: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El ID del vehículo debe ser un número',
      'number.positive': 'El ID del vehículo debe ser positivo',
      'any.required': 'El ID del vehículo es requerido',
    }),
  nombrePropietario: Joi.string().max(200).required()
    .messages({
      'string.max': 'El nombre no puede exceder 200 caracteres',
      'any.required': 'El nombre del comprador es requerido',
    }),
  tipoDocumento: Joi.string().max(20).optional().default('CC')
    .messages({
      'string.max': 'El tipo de documento no puede exceder 20 caracteres',
    }),
  numeroDocumento: Joi.string().max(50).required()
    .messages({
      'string.max': 'El número de documento no puede exceder 50 caracteres',
      'any.required': 'El número de documento es requerido',
    }),
  telefono: Joi.string().max(20).optional()
    .messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres',
    }),
  email: Joi.string().email().max(100).optional()
    .messages({
      'string.email': 'El email debe ser válido',
      'string.max': 'El email no puede exceder 100 caracteres',
    }),
  direccion: Joi.string().max(200).optional()
    .messages({
      'string.max': 'La dirección no puede exceder 200 caracteres',
    }),
  ciudad: Joi.string().max(100).optional()
    .messages({
      'string.max': 'La ciudad no puede exceder 100 caracteres',
    }),
  fechaVenta: Joi.date().required()
    .messages({
      'date.base': 'La fecha de venta debe ser una fecha válida',
      'any.required': 'La fecha de venta es requerida',
    }),
  valorVenta: Joi.number().positive().optional()
    .messages({
      'number.base': 'El valor de venta debe ser un número',
      'number.positive': 'El valor de venta debe ser positivo',
    }),
  contratoID: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'El ID del contrato debe ser un número',
      'number.positive': 'El ID del contrato debe ser positivo',
    }),
  observaciones: Joi.string().optional()
    .messages({
      'string.base': 'Las observaciones deben ser texto',
    }),
});

/**
 * Schema para actualizar historial
 */
export const actualizarHistorialSchema = Joi.object({
  nombrePropietario: Joi.string().max(200).optional()
    .messages({
      'string.max': 'El nombre no puede exceder 200 caracteres',
    }),
  tipoDocumento: Joi.string().max(20).optional()
    .messages({
      'string.max': 'El tipo de documento no puede exceder 20 caracteres',
    }),
  numeroDocumento: Joi.string().max(50).optional()
    .messages({
      'string.max': 'El número de documento no puede exceder 50 caracteres',
    }),
  telefono: Joi.string().max(20).optional()
    .messages({
      'string.max': 'El teléfono no puede exceder 20 caracteres',
    }),
  email: Joi.string().email().max(100).optional()
    .messages({
      'string.email': 'El email debe ser válido',
      'string.max': 'El email no puede exceder 100 caracteres',
    }),
  direccion: Joi.string().max(200).optional()
    .messages({
      'string.max': 'La dirección no puede exceder 200 caracteres',
    }),
  ciudad: Joi.string().max(100).optional()
    .messages({
      'string.max': 'La ciudad no puede exceder 100 caracteres',
    }),
  fechaAdquisicion: Joi.date().optional()
    .messages({
      'date.base': 'La fecha de adquisición debe ser una fecha válida',
    }),
  fechaVenta: Joi.date().optional()
    .messages({
      'date.base': 'La fecha de venta debe ser una fecha válida',
    }),
  valorCompra: Joi.number().positive().optional()
    .messages({
      'number.base': 'El valor de compra debe ser un número',
      'number.positive': 'El valor de compra debe ser positivo',
    }),
  valorVenta: Joi.number().positive().optional()
    .messages({
      'number.base': 'El valor de venta debe ser un número',
      'number.positive': 'El valor de venta debe ser positivo',
    }),
  traspasoRealizado: Joi.boolean().optional()
    .messages({
      'boolean.base': 'El traspaso realizado debe ser verdadero o falso',
    }),
  fechaTraspaso: Joi.date().optional()
    .messages({
      'date.base': 'La fecha de traspaso debe ser una fecha válida',
    }),
  numeroTraspaso: Joi.string().max(50).optional()
    .messages({
      'string.max': 'El número de traspaso no puede exceder 50 caracteres',
    }),
  organismoTransito: Joi.string().max(100).optional()
    .messages({
      'string.max': 'El organismo de tránsito no puede exceder 100 caracteres',
    }),
  observaciones: Joi.string().optional()
    .messages({
      'string.base': 'Las observaciones deben ser texto',
    }),
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar',
});
