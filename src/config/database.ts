import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'SistemaActivos',
  username: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: process.env.NODE_ENV === 'production',
      trustServerCertificate: process.env.NODE_ENV !== 'production',
      // Configuración para fechas en SQL Server
      useUTC: false,
    },
  },
  // Importante: timezone para evitar problemas de conversión
  timezone: '-05:00', // Timezone de Colombia
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // Definir tipo de datos por defecto para fechas
  define: {
    timestamps: false, // No usar createdAt/updatedAt automático
  },
});

export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a base de datos establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    throw error;
  }
};

export default sequelize;
