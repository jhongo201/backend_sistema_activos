/**
 * Script DEFINITIVO para crear usuario administrador
 * Usa SQL directo para evitar problemas de conversión de Sequelize
 * Ejecutar con: node crear-admin-final.js
 */

const bcrypt = require('bcrypt');
const sql = require('mssql');
require('dotenv').config();

// Configuración de conexión
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'SistemaActivos',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

async function crearAdministrador() {
  let pool;
  
  try {
    console.log('🔄 Conectando a SQL Server...');
    console.log(`   Servidor: ${config.server}`);
    console.log(`   Base de datos: ${config.database}`);
    console.log('');

    // Conectar
    pool = await sql.connect(config);
    console.log('✅ Conexión establecida\n');

    // Verificar si ya existe
    console.log('🔍 Verificando si el usuario ya existe...');
    const checkResult = await pool.request()
      .input('email', sql.NVarChar, 'admin@sistema.com')
      .query('SELECT UsuarioID FROM Usuarios WHERE Email = @email');

    if (checkResult.recordset.length > 0) {
      console.log('⚠️  El usuario admin@sistema.com ya existe');
      console.log('   UsuarioID:', checkResult.recordset[0].UsuarioID);
      console.log('');
      console.log('💡 Para eliminarlo y recrearlo, ejecuta en SQL Server:');
      console.log("   DELETE FROM Usuarios WHERE Email = 'admin@sistema.com';");
      console.log('');
      return;
    }

    // Datos del administrador
    const nombre = 'Administrador del Sistema';
    const email = 'admin@sistema.com';
    const password = 'Admin123!';

    // Hashear contraseña
    console.log('🔐 Generando hash de contraseña...');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('   Hash generado:', passwordHash.substring(0, 20) + '...');
    console.log('');

    // Insertar usuario usando SQL directo
    console.log('👤 Insertando usuario en la base de datos...');
    
    const insertResult = await pool.request()
      .input('nombre', sql.NVarChar(100), nombre)
      .input('email', sql.NVarChar(100), email)
      .input('password', sql.NVarChar(255), passwordHash)
      .input('rol', sql.NVarChar(20), 'Admin')
      .input('estado', sql.Bit, true)
      .query(`
        INSERT INTO Usuarios (Nombre, Email, Password, Rol, Estado, FechaCreacion, FechaUltimoAcceso)
        OUTPUT INSERTED.UsuarioID, INSERTED.Nombre, INSERTED.Email, INSERTED.Rol
        VALUES (@nombre, @email, @password, @rol, @estado, GETDATE(), NULL)
      `);

    const usuarioCreado = insertResult.recordset[0];

    console.log('✅ ¡Usuario administrador creado exitosamente!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  CREDENCIALES DE ACCESO');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  UsuarioID: ${usuarioCreado.UsuarioID}`);
    console.log(`  Nombre:    ${usuarioCreado.Nombre}`);
    console.log(`  Email:     ${usuarioCreado.Email}`);
    console.log(`  Password:  ${password}`);
    console.log(`  Rol:       ${usuarioCreado.Rol}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia esta contraseña después del primer login');
    console.log('');
    console.log('📡 Prueba hacer login:');
    console.log('   POST http://localhost:5000/api/auth/login');
    console.log('   Body: {');
    console.log(`     "email": "${email}",`);
    console.log(`     "password": "${password}"`);
    console.log('   }');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    
    if (error.code === 'ESOCKET' || error.code === 'ELOGIN') {
      console.log('💡 Verifica:');
      console.log('   - SQL Server está corriendo');
      console.log('   - El servicio SQL Server Browser está activo');
      console.log('   - Las credenciales en .env son correctas');
      console.log('   - El firewall permite conexiones al puerto 1433');
      console.log('');
    } else if (error.number === 2627) {
      console.log('💡 El email ya existe en la base de datos');
      console.log("   Ejecuta: DELETE FROM Usuarios WHERE Email = 'admin@sistema.com';");
      console.log('');
    } else {
      console.log('Detalles del error:', error);
    }
  } finally {
    if (pool) {
      await pool.close();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar
console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('  CREAR USUARIO ADMINISTRADOR - SISTEMA DE ACTIVOS');
console.log('═══════════════════════════════════════════════════════');
console.log('');

crearAdministrador();
