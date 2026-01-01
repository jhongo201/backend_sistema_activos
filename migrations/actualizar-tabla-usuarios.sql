-- =====================================================
-- Script para actualizar tabla Usuarios
-- Agregar nuevas columnas para el sistema de roles
-- =====================================================

USE SistemaActivos;
GO

-- 1. Verificar estructura actual
PRINT '=== Estructura actual de Usuarios ===';
EXEC sp_help 'Usuarios';
GO

-- 2. Agregar columna RolID (si no existe)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'RolID')
BEGIN
    PRINT 'Agregando columna RolID...';
    ALTER TABLE Usuarios ADD RolID INT NOT NULL DEFAULT 4;
    
    -- Agregar foreign key después de crear la tabla Roles
    -- ALTER TABLE Usuarios ADD CONSTRAINT FK_Usuarios_Roles FOREIGN KEY (RolID) REFERENCES Roles(RolID);
END
ELSE
    PRINT 'Columna RolID ya existe';
GO

-- 3. Agregar columna Telefono (si no existe)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'Telefono')
BEGIN
    PRINT 'Agregando columna Telefono...';
    ALTER TABLE Usuarios ADD Telefono NVARCHAR(20) NULL;
END
ELSE
    PRINT 'Columna Telefono ya existe';
GO

-- 4. Agregar columna Direccion (si no existe)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'Direccion')
BEGIN
    PRINT 'Agregando columna Direccion...';
    ALTER TABLE Usuarios ADD Direccion NVARCHAR(200) NULL;
END
ELSE
    PRINT 'Columna Direccion ya existe';
GO

-- 5. Agregar columna FechaNacimiento (si no existe)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'FechaNacimiento')
BEGIN
    PRINT 'Agregando columna FechaNacimiento...';
    ALTER TABLE Usuarios ADD FechaNacimiento DATE NULL;
END
ELSE
    PRINT 'Columna FechaNacimiento ya existe';
GO

-- 6. Agregar columna Activo (reemplaza Estado)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'Activo')
BEGIN
    PRINT 'Agregando columna Activo...';
    ALTER TABLE Usuarios ADD Activo BIT NOT NULL DEFAULT 1;
    
    -- Si existe columna Estado, migrar datos
    IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'Estado')
    BEGIN
        PRINT 'Migrando datos de Estado a Activo...';
        UPDATE Usuarios SET Activo = CASE WHEN Estado = 'Activo' THEN 1 ELSE 0 END;
        -- No eliminar Estado aún por si hay dependencias
    END
END
ELSE
    PRINT 'Columna Activo ya existe';
GO

-- 7. Agregar columna UltimoAcceso (si no existe)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'UltimoAcceso')
BEGIN
    PRINT 'Agregando columna UltimoAcceso...';
    ALTER TABLE Usuarios ADD UltimoAcceso DATETIME NULL;
END
ELSE
    PRINT 'Columna UltimoAcceso ya existe';
GO

-- 8. Agregar columnas de timestamps (si no existen)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'createdAt')
BEGIN
    PRINT 'Agregando columna createdAt...';
    ALTER TABLE Usuarios ADD createdAt DATETIME NOT NULL DEFAULT GETDATE();
END
ELSE
    PRINT 'Columna createdAt ya existe';
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Usuarios') AND name = 'updatedAt')
BEGIN
    PRINT 'Agregando columna updatedAt...';
    ALTER TABLE Usuarios ADD updatedAt DATETIME NOT NULL DEFAULT GETDATE();
END
ELSE
    PRINT 'Columna updatedAt ya existe';
GO

-- 9. Verificar estructura actualizada
PRINT '=== Estructura actualizada de Usuarios ===';
SELECT 
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    c.is_nullable AS IsNullable,
    ISNULL(d.definition, '') AS DefaultValue
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
LEFT JOIN sys.default_constraints d ON c.default_object_id = d.object_id
WHERE c.object_id = OBJECT_ID('Usuarios')
ORDER BY c.column_id;
GO

PRINT '=== Script completado exitosamente ===';
