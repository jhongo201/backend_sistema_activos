-- =====================================================
-- Script para crear tabla Roles
-- Debe ejecutarse ANTES de actualizar tabla Usuarios
-- =====================================================

USE SistemaActivos;
GO

-- Crear tabla Roles si no existe
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Roles')
BEGIN
    PRINT 'Creando tabla Roles...';
    
    CREATE TABLE Roles (
        RolID INT IDENTITY(1,1) PRIMARY KEY,
        Nombre NVARCHAR(50) NOT NULL UNIQUE,
        Descripcion NVARCHAR(200) NULL,
        Permisos NVARCHAR(MAX) NOT NULL DEFAULT '{}',
        Activo BIT NOT NULL DEFAULT 1,
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
    
    PRINT 'Tabla Roles creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Tabla Roles ya existe';
END
GO

-- Verificar estructura
PRINT '=== Estructura de tabla Roles ===';
SELECT 
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    c.is_nullable AS IsNullable
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE c.object_id = OBJECT_ID('Roles')
ORDER BY c.column_id;
GO

PRINT '=== Script completado ===';
