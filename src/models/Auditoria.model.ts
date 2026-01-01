import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface AuditoriaAttributes {
  AuditoriaID: number;
  UsuarioID: number;
  Accion: 'Crear' | 'Editar' | 'Eliminar' | 'Login' | 'Logout' | 'Ver';
  Modulo: string;
  TablaAfectada?: string;
  RegistroID?: number;
  DetallesAntes?: string;
  DetallesDespues?: string;
  IP?: string;
  UserAgent?: string;
  FechaHora: Date;
}

export interface AuditoriaCreationAttributes extends Optional<AuditoriaAttributes, 'AuditoriaID' | 'TablaAfectada' | 'RegistroID' | 'DetallesAntes' | 'DetallesDespues' | 'IP' | 'UserAgent' | 'FechaHora'> {}

class Auditoria extends Model<AuditoriaAttributes, AuditoriaCreationAttributes> implements AuditoriaAttributes {
  public AuditoriaID!: number;
  public UsuarioID!: number;
  public Accion!: 'Crear' | 'Editar' | 'Eliminar' | 'Login' | 'Logout' | 'Ver';
  public Modulo!: string;
  public TablaAfectada?: string;
  public RegistroID?: number;
  public DetallesAntes?: string;
  public DetallesDespues?: string;
  public IP?: string;
  public UserAgent?: string;
  public FechaHora!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Auditoria.init(
  {
    AuditoriaID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    UsuarioID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'UsuarioID',
      },
    },
    Accion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['Crear', 'Editar', 'Eliminar', 'Login', 'Logout', 'Ver']],
      },
    },
    Modulo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Ejemplo: Usuarios, Vehículos, Propiedades, etc.',
    },
    TablaAfectada: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    RegistroID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'ID del registro afectado',
    },
    DetallesAntes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON con datos antes del cambio',
    },
    DetallesDespues: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON con datos después del cambio',
    },
    IP: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    UserAgent: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    FechaHora: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'Auditoria',
    timestamps: true,
  }
);

export default Auditoria;