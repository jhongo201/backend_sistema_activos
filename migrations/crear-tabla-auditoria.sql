-- =====================================================
-- Script para crear tabla Auditoria
-- =====================================================

USE SistemaActivos;
GO

-- Crear tabla Auditoria si no existe
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Auditoria')
BEGIN
    PRINT 'Creando tabla Auditoria...';
    
    CREATE TABLE Auditoria (
        AuditoriaID INT IDENTITY(1,1) PRIMARY KEY,
        UsuarioID INT NOT NULL,
        Accion NVARCHAR(50) NOT NULL,
        Modulo NVARCHAR(50) NOT NULL,
        TablaAfectada NVARCHAR(50) NULL,
        RegistroID INT NULL,
        DetallesAntes NVARCHAR(MAX) NULL,
        DetallesDespues NVARCHAR(MAX) NULL,
        IP NVARCHAR(45) NULL,
        UserAgent NVARCHAR(255) NULL,
        FechaHora DATETIME NOT NULL DEFAULT GETDATE(),
        createdAt DATETIME NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Auditoria_Usuarios FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID)
    );
    
    -- Crear índices para mejorar rendimiento
    CREATE INDEX IX_Auditoria_UsuarioID ON Auditoria(UsuarioID);
    CREATE INDEX IX_Auditoria_FechaHora ON Auditoria(FechaHora);
    CREATE INDEX IX_Auditoria_Modulo ON Auditoria(Modulo);
    
    PRINT 'Tabla Auditoria creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Tabla Auditoria ya existe';
END
GO

-- Verificar estructura
PRINT '=== Estructura de tabla Auditoria ===';
SELECT 
    c.name AS ColumnName,
    t.name AS DataType,
    c.max_length AS MaxLength,
    c.is_nullable AS IsNullable
FROM sys.columns c
INNER JOIN sys.types t ON c.user_type_id = t.user_type_id
WHERE c.object_id = OBJECT_ID('Auditoria')
ORDER BY c.column_id;
GO

PRINT '=== Script completado ===';
