/**
 * Script para crear el usuario administrador inicial
 * Ejecutar con: node crear-admin.js
 */

const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Configurar conexión a base de datos
const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'SistemaActivos',
  username: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '152020',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
  logging: false,
});

// Definir modelo de Usuario (simplificado)
const Usuario = sequelize.define('Usuario', {
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
  },
  Password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Rol: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  Estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  FechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  FechaUltimoAcceso: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'Usuarios',
  timestamps: false,
});

async function crearAdministrador() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida\n');

    // Verificar si ya existe un usuario admin
    const usuarioExistente = await Usuario.findOne({
      where: { Email: 'jhon@sistema.com' }
    });

    if (usuarioExistente) {
      console.log('⚠️  El usuario admin@sistema.com ya existe');
      console.log('   Si olvidaste la contraseña, elimínalo desde SQL Server y vuelve a ejecutar este script.\n');
      process.exit(0);
    }

    // Datos del administrador
    const nombre = 'Administrador del Sistema';
    const email = 'jhon@sistema.com';
    const password = 'Admin123!';

    // Hashear contraseña
    console.log('🔐 Hasheando contraseña...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    console.log('👤 Creando usuario administrador...');
    const usuario = await Usuario.create({
      Nombre: nombre,
      Email: email,
      Password: passwordHash,
      Rol: 'Admin',
      Estado: true,
    });

    console.log('\n✅ ¡Usuario administrador creado exitosamente!\n');
    console.log('═══════════════════════════════════════════');
    console.log('  CREDENCIALES DE ACCESO');
    console.log('═══════════════════════════════════════════');
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log('═══════════════════════════════════════════');
    console.log('\n⚠️  IMPORTANTE: Cambia esta contraseña después del primer login\n');
    console.log('Prueba hacer login en: POST http://localhost:5000/api/auth/login');
    console.log('Con body JSON:');
    console.log(JSON.stringify({ email, password }, null, 2));
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.name === 'SequelizeConnectionError') {
      console.log('\n💡 Verifica:');
      console.log('   - SQL Server está corriendo');
      console.log('   - Las credenciales en el archivo .env son correctas');
      console.log('   - La base de datos SistemaActivos existe');
    }
  } finally {
    await sequelize.close();
  }
}

// Ejecutar
crearAdministrador();
