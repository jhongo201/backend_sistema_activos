import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcrypt';

export interface UsuarioAttributes {
  UsuarioID: number;
  Nombre: string;
  Email: string;
  Password: string;
  RolID: number;
  Telefono?: string;
  Direccion?: string;
  FechaNacimiento?: Date;
  Activo: boolean;
  UltimoAcceso?: Date;
}

export interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'UsuarioID' | 'Telefono' | 'Direccion' | 'FechaNacimiento' | 'Activo' | 'UltimoAcceso'> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  public UsuarioID!: number;
  public Nombre!: string;
  public Email!: string;
  public Password!: string;
  public RolID!: number;
  public Telefono?: string;
  public Direccion?: string;
  public FechaNacimiento?: Date;
  public Activo!: boolean;
  public UltimoAcceso?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para comparar contraseña
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.Password);
  }
}

Usuario.init(
  {
    UsuarioID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    RolID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4, // Consulta por defecto
      references: {
        model: 'Roles',
        key: 'RolID',
      },
    },
    Telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Direccion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    FechaNacimiento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    UltimoAcceso: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Usuarios',
    timestamps: true,
    hooks: {
      beforeCreate: async (usuario: Usuario) => {
        if (usuario.Password) {
          const salt = await bcrypt.genSalt(10);
          usuario.Password = await bcrypt.hash(usuario.Password, salt);
        }
      },
      beforeUpdate: async (usuario: Usuario) => {
        if (usuario.changed('Password')) {
          const salt = await bcrypt.genSalt(10);
          usuario.Password = await bcrypt.hash(usuario.Password, salt);
        }
      },
    },
  }
);

export default Usuario;