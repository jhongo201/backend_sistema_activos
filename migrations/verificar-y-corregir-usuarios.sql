-- =====================================================
-- Script para verificar y corregir tabla Usuarios
-- =====================================================

USE SistemaActivos;
GO

PRINT '=== 1. Verificando estructura actual de Usuarios ===';
SELECT 
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    c.is_nullable AS IsNullable,
    ISNULL(dc.definition, '') AS DefaultValue
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
LEFT JOIN sys.default_constraints dc ON c.default_object_id = dc.object_id
WHERE c.object_id = OBJECT_ID('Usuarios')
ORDER BY c.column_id;
GO

PRINT '';
PRINT '=== 2. Verificando si existe columna Activo ===';
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'Activo')
    PRINT '✅ Columna Activo EXISTE'
ELSE
    PRINT '❌ Columna Activo NO EXISTE';
GO

PRINT '';
PRINT '=== 3. Agregando columna Activo si no existe ===';
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'Activo')
BEGIN
    PRINT 'Agregando columna Activo...';
    ALTER TABLE Usuarios ADD Activo BIT NOT NULL DEFAULT 1;
    PRINT '✅ Columna Activo agregada exitosamente';
END
ELSE
    PRINT 'Columna Activo ya existe, no se requiere acción';
GO

PRINT '';
PRINT '=== 4. Verificando todas las columnas requeridas ===';

-- RolID
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'RolID')
    PRINT '✅ RolID existe'
ELSE
BEGIN
    PRINT '❌ RolID NO existe - Agregando...';
    ALTER TABLE Usuarios ADD RolID INT NOT NULL DEFAULT 4;
    PRINT '✅ RolID agregado';
END
GO

-- Telefono
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'Telefono')
    PRINT '✅ Telefono existe'
ELSE
BEGIN
    PRINT '❌ Telefono NO existe - Agregando...';
    ALTER TABLE Usuarios ADD Telefono NVARCHAR(20) NULL;
    PRINT '✅ Telefono agregado';
END
GO

-- Direccion
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'Direccion')
    PRINT '✅ Direccion existe'
ELSE
BEGIN
    PRINT '❌ Direccion NO existe - Agregando...';
    ALTER TABLE Usuarios ADD Direccion NVARCHAR(200) NULL;
    PRINT '✅ Direccion agregado';
END
GO

-- FechaNacimiento
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'FechaNacimiento')
    PRINT '✅ FechaNacimiento existe'
ELSE
BEGIN
    PRINT '❌ FechaNacimiento NO existe - Agregando...';
    ALTER TABLE Usuarios ADD FechaNacimiento DATE NULL;
    PRINT '✅ FechaNacimiento agregado';
END
GO

-- UltimoAcceso
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'UltimoAcceso')
    PRINT '✅ UltimoAcceso existe'
ELSE
BEGIN
    PRINT '❌ UltimoAcceso NO existe - Agregando...';
    ALTER TABLE Usuarios ADD UltimoAcceso DATETIME NULL;
    PRINT '✅ UltimoAcceso agregado';
END
GO

-- createdAt
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'createdAt')
    PRINT '✅ createdAt existe'
ELSE
BEGIN
    PRINT '❌ createdAt NO existe - Agregando...';
    ALTER TABLE Usuarios ADD createdAt DATETIME NOT NULL DEFAULT GETDATE();
    PRINT '✅ createdAt agregado';
END
GO

-- updatedAt
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'updatedAt')
    PRINT '✅ updatedAt existe'
ELSE
BEGIN
    PRINT '❌ updatedAt NO existe - Agregando...';
    ALTER TABLE Usuarios ADD updatedAt DATETIME NOT NULL DEFAULT GETDATE();
    PRINT '✅ updatedAt agregado';
END
GO

PRINT '';
PRINT '=== 5. Estructura final de Usuarios ===';
SELECT 
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    c.is_nullable AS IsNullable
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE c.object_id = OBJECT_ID('Usuarios')
ORDER BY c.column_id;
GO

PRINT '';
PRINT '=== Script completado ===';
PRINT 'Si todas las columnas existen, reinicia el servidor backend y prueba el login';
