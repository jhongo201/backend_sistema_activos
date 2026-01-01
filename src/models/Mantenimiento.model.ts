import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface MantenimientoAttributes {
  MantenimientoID: number;
  VehiculoID: number;
  TipoMantenimiento: 'Preventivo' | 'Correctivo' | 'Revisión' | 'Reparación' | 'Cambio de Aceite' | 'Llantas' | 'Frenos' | 'Otro';
  FechaMantenimiento: Date;
  KilometrajeMantenimiento?: number;
  Descripcion?: string;
  LugarMantenimiento?: string;
  CostoMantenimiento?: number;
  ProximoMantenimientoKm?: number;
  ProximoMantenimientoFecha?: Date;
  Observaciones?: string;
  DocumentoAdjunto?: string;
  Estado: 'Programado' | 'En Proceso' | 'Completado' | 'Cancelado';
}

class Mantenimiento extends Model<MantenimientoAttributes> implements MantenimientoAttributes {
  public MantenimientoID!: number;
  public VehiculoID!: number;
  public TipoMantenimiento!: 'Preventivo' | 'Correctivo' | 'Revisión' | 'Reparación' | 'Cambio de Aceite' | 'Llantas' | 'Frenos' | 'Otro';
  public FechaMantenimiento!: Date;
  public KilometrajeMantenimiento?: number;
  public Descripcion?: string;
  public LugarMantenimiento?: string;
  public CostoMantenimiento?: number;
  public ProximoMantenimientoKm?: number;
  public ProximoMantenimientoFecha?: Date;
  public Observaciones?: string;
  public DocumentoAdjunto?: string;
  public Estado!: 'Programado' | 'En Proceso' | 'Completado' | 'Cancelado';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Mantenimiento.init(
  {
    MantenimientoID: {
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
    TipoMantenimiento: {
      type: DataTypes.ENUM('Preventivo', 'Correctivo', 'Revisión', 'Reparación', 'Cambio de Aceite', 'Llantas', 'Frenos', 'Otro'),
      allowNull: false,
    },
    FechaMantenimiento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    KilometrajeMantenimiento: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    LugarMantenimiento: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    CostoMantenimiento: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    ProximoMantenimientoKm: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ProximoMantenimientoFecha: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    DocumentoAdjunto: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    Estado: {
      type: DataTypes.ENUM('Programado', 'En Proceso', 'Completado', 'Cancelado'),
      allowNull: false,
      defaultValue: 'Programado',
    },
  },
  {
    sequelize,
    tableName: 'Mantenimientos',
    timestamps: true,
  }
);

export default Mantenimiento;
