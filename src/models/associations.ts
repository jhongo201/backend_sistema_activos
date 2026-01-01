/**
 * Configuración de relaciones entre modelos Sequelize
 * Importar este archivo en app.ts para inicializar las relaciones
 */
import Activo from './Activo.model';
import Vehiculo from './Vehiculo.model';
import Propiedad from './Propiedad.model';
import Usuario from './Usuario.model';
import Mantenimiento from './Mantenimiento.model';
import HistorialCambio from './HistorialCambio.model';
import Rol from './Rol.model';
import Auditoria from './Auditoria.model';
import Notificacion from './Notificacion.model';
import Contrato from './Contrato.model';
import BienContrato from './BienContrato.model';
import Poliza from './poliza.model';
import Reclamacion from './reclamacion.model';
import Renovacion from './renovacion.model';
import Pago from './pago.model';
import HistorialPropietarios from './HistorialPropietarios.model';

/**
 * Configurar relaciones entre modelos
 */
export const setupAssociations = () => {
  // Activo tiene un Vehículo
  Activo.hasOne(Vehiculo, {
    foreignKey: 'ActivoID',
    as: 'Vehiculo',
  });

  // Vehículo pertenece a un Activo
  Vehiculo.belongsTo(Activo, {
    foreignKey: 'ActivoID',
    as: 'Activo',
  });

  // Activo tiene una Propiedad
  Activo.hasOne(Propiedad, {
    foreignKey: 'ActivoID',
    as: 'Propiedad',
  });

  // Propiedad pertenece a un Activo
  Propiedad.belongsTo(Activo, {
    foreignKey: 'ActivoID',
    as: 'Activo',
  });

  // Activo pertenece a un Usuario
  Activo.belongsTo(Usuario, {
    foreignKey: 'UsuarioRegistro',
    as: 'Usuario',
  });

  // ========================================
  // NUEVAS RELACIONES - HISTORIAL Y MANTENIMIENTOS
  // ========================================

  // Vehículo tiene muchos Mantenimientos
  Vehiculo.hasMany(Mantenimiento, {
    foreignKey: 'VehiculoID',
    as: 'Mantenimientos',
  });

  // Mantenimiento pertenece a un Vehículo
  Mantenimiento.belongsTo(Vehiculo, {
    foreignKey: 'VehiculoID',
    as: 'Vehiculo',
  });

  // Usuario tiene muchos registros de Historial
  Usuario.hasMany(HistorialCambio, {
    foreignKey: 'UsuarioID',
    as: 'HistorialCambios',
  });

  // HistorialCambio pertenece a un Usuario
  HistorialCambio.belongsTo(Usuario, {
    foreignKey: 'UsuarioID',
    as: 'Usuario',
  });

  // ========================================
  // RELACIONES - ROLES Y AUDITORÍA
  // ========================================

  // Rol tiene muchos Usuarios
  Rol.hasMany(Usuario, {
    foreignKey: 'RolID',
    as: 'Usuarios',
  });

  // Usuario pertenece a un Rol
  Usuario.belongsTo(Rol, {
    foreignKey: 'RolID',
    as: 'Rol',
  });

  // Usuario tiene muchos registros de Auditoría
  Usuario.hasMany(Auditoria, {
    foreignKey: 'UsuarioID',
    as: 'Auditorias',
  });

  // Auditoría pertenece a un Usuario
  Auditoria.belongsTo(Usuario, {
    foreignKey: 'UsuarioID',
    as: 'Usuario',
  });

  // ========================================
  // RELACIONES - NOTIFICACIONES
  // ========================================

  // Usuario tiene muchas Notificaciones
  Usuario.hasMany(Notificacion, {
    foreignKey: 'UsuarioID',
    as: 'Notificaciones',
  });

  // Notificación pertenece a un Usuario
  Notificacion.belongsTo(Usuario, {
    foreignKey: 'UsuarioID',
    as: 'Usuario',
  });

  // ========================================
  // RELACIONES - CONTRATOS Y BIENES
  // ========================================

  // Contrato tiene muchos BienesContrato
  Contrato.hasMany(BienContrato, {
    foreignKey: 'ContratoID',
    as: 'Bienes',
    onDelete: 'CASCADE',
  });

  // BienContrato pertenece a un Contrato
  BienContrato.belongsTo(Contrato, {
    foreignKey: 'ContratoID',
    as: 'Contrato',
  });

  // BienContrato puede referenciar un Vehículo
  BienContrato.belongsTo(Vehiculo, {
    foreignKey: 'VehiculoID',
    as: 'Vehiculo',
  });

  // BienContrato puede referenciar una Propiedad
  BienContrato.belongsTo(Propiedad, {
    foreignKey: 'PropiedadID',
    as: 'Propiedad',
  });

  // Usuario crea muchos Contratos
  Usuario.hasMany(Contrato, {
    foreignKey: 'UsuarioCreadorID',
    as: 'Contratos',
  });

  // Contrato pertenece a un Usuario creador
  Contrato.belongsTo(Usuario, {
    foreignKey: 'UsuarioCreadorID',
    as: 'UsuarioCreador',
  });

  // ========================================
  // RELACIONES - SEGUROS (PÓLIZAS Y RECLAMACIONES)
  // ========================================

  // Póliza pertenece a un Usuario
  Poliza.belongsTo(Usuario, {
    foreignKey: 'UsuarioID',
    as: 'usuario',
  });

  // Póliza puede referenciar un Vehículo
  Poliza.belongsTo(Vehiculo, {
    foreignKey: 'VehiculoID',
    as: 'vehiculo',
  });

  // Póliza puede referenciar una Propiedad
  Poliza.belongsTo(Propiedad, {
    foreignKey: 'PropiedadID',
    as: 'propiedad',
  });

  // Reclamación pertenece a una Póliza
  Reclamacion.belongsTo(Poliza, {
    foreignKey: 'PolizaID',
    as: 'poliza',
  });

  // Póliza tiene muchas Reclamaciones
  Poliza.hasMany(Reclamacion, {
    foreignKey: 'PolizaID',
    as: 'reclamaciones',
  });

  // Reclamación pertenece a un Usuario
  Reclamacion.belongsTo(Usuario, {
    foreignKey: 'UsuarioID',
    as: 'usuario',
  });

  // Renovación pertenece a una Póliza
  Renovacion.belongsTo(Poliza, {
    foreignKey: 'PolizaID',
    as: 'poliza',
  });

  // Póliza tiene muchas Renovaciones
  Poliza.hasMany(Renovacion, {
    foreignKey: 'PolizaID',
    as: 'renovaciones',
  });

  // Renovación pertenece a un Usuario
  Renovacion.belongsTo(Usuario, {
    foreignKey: 'UsuarioID',
    as: 'usuario',
  });

  // ========================================
  // RELACIONES - PAGOS (CALENDARIO)
  // ========================================

  // Pago pertenece a un Usuario
  Pago.belongsTo(Usuario, {
    foreignKey: 'UsuarioID',
    as: 'usuario',
  });

  // Pago puede referenciar un Vehículo
  Pago.belongsTo(Vehiculo, {
    foreignKey: 'VehiculoID',
    as: 'vehiculo',
  });

  // Pago puede referenciar una Propiedad
  Pago.belongsTo(Propiedad, {
    foreignKey: 'PropiedadID',
    as: 'propiedad',
  });

  // Pago puede referenciar un Contrato
  Pago.belongsTo(Contrato, {
    foreignKey: 'ContratoID',
    as: 'contrato',
  });

  // ========================================
  // RELACIONES - HISTORIAL DE PROPIETARIOS
  // ========================================

  // HistorialPropietarios pertenece a un Vehículo
  HistorialPropietarios.belongsTo(Vehiculo, {
    foreignKey: 'VehiculoID',
    as: 'vehiculo',
  });

  // Vehículo tiene muchos HistorialPropietarios
  Vehiculo.hasMany(HistorialPropietarios, {
    foreignKey: 'VehiculoID',
    as: 'historialPropietarios',
  });

  // HistorialPropietarios puede referenciar un Contrato
  HistorialPropietarios.belongsTo(Contrato, {
    foreignKey: 'ContratoID',
    as: 'contrato',
  });

  // Contrato puede tener muchos HistorialPropietarios
  Contrato.hasMany(HistorialPropietarios, {
    foreignKey: 'ContratoID',
    as: 'historialPropietarios',
  });

  // HistorialPropietarios pertenece a un Usuario (quien registra)
  HistorialPropietarios.belongsTo(Usuario, {
    foreignKey: 'UsuarioRegistro',
    as: 'usuarioRegistro',
  });

  // Usuario tiene muchos HistorialPropietarios registrados
  Usuario.hasMany(HistorialPropietarios, {
    foreignKey: 'UsuarioRegistro',
    as: 'historialPropietariosRegistrados',
  });

  console.log('✅ Relaciones entre modelos configuradas');
};

export default setupAssociations;