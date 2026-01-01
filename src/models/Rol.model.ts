import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface RolAttributes {
  RolID: number;
  Nombre: string;
  Descripcion?: string;
  Permisos: string; // JSON string con permisos
  Activo: boolean;
}

export interface RolCreationAttributes extends Optional<RolAttributes, 'RolID' | 'Descripcion' | 'Activo'> {}

class Rol extends Model<RolAttributes, RolCreationAttributes> implements RolAttributes {
  public RolID!: number;
  public Nombre!: string;
  public Descripcion?: string;
  public Permisos!: string;
  public Activo!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Rol.init(
  {
    RolID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    Descripcion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Permisos: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '{}',
      comment: 'JSON con permisos del rol',
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'Roles',
    timestamps: true,
  }
);

export default Rol;