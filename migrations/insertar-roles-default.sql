-- =====================================================
-- Script para insertar roles por defecto
-- Ejecutar ANTES de crear foreign key
-- =====================================================

USE SistemaActivos;
GO

-- Insertar roles por defecto si no existen
PRINT 'Insertando roles por defecto...';

-- Rol 1: Administrador
IF NOT EXISTS (SELECT * FROM Roles WHERE RolID = 1)
BEGIN
    SET IDENTITY_INSERT Roles ON;
    
    INSERT INTO Roles (RolID, Nombre, Descripcion, Permisos, Activo, createdAt, updatedAt)
    VALUES (
        1,
        'Administrador',
        'Acceso total al sistema',
        '{"usuarios":{"ver":true,"crear":true,"editar":true,"eliminar":true},"roles":{"ver":true,"crear":true,"editar":true,"eliminar":true},"vehiculos":{"ver":true,"crear":true,"editar":true,"eliminar":true},"propiedades":{"ver":true,"crear":true,"editar":true,"eliminar":true},"reportes":{"ver":true,"generar":true},"auditoria":{"ver":true}}',
        1,
        GETDATE(),
        GETDATE()
    );
    
    PRINT 'Rol Administrador creado';
    SET IDENTITY_INSERT Roles OFF;
END
ELSE
    PRINT 'Rol Administrador ya existe';
GO

-- Rol 2: Editor
IF NOT EXISTS (SELECT * FROM Roles WHERE RolID = 2)
BEGIN
    SET IDENTITY_INSERT Roles ON;
    
    INSERT INTO Roles (RolID, Nombre, Descripcion, Permisos, Activo, createdAt, updatedAt)
    VALUES (
        2,
        'Editor',
        'Puede crear y editar registros',
        '{"usuarios":{"ver":true,"crear":false,"editar":false,"eliminar":false},"roles":{"ver":false,"crear":false,"editar":false,"eliminar":false},"vehiculos":{"ver":true,"crear":true,"editar":true,"eliminar":false},"propiedades":{"ver":true,"crear":true,"editar":true,"eliminar":false},"reportes":{"ver":true,"generar":true},"auditoria":{"ver":false}}',
        1,
        GETDATE(),
        GETDATE()
    );
    
    PRINT 'Rol Editor creado';
    SET IDENTITY_INSERT Roles OFF;
END
ELSE
    PRINT 'Rol Editor ya existe';
GO

-- Rol 3: Visor
IF NOT EXISTS (SELECT * FROM Roles WHERE RolID = 3)
BEGIN
    SET IDENTITY_INSERT Roles ON;
    
    INSERT INTO Roles (RolID, Nombre, Descripcion, Permisos, Activo, createdAt, updatedAt)
    VALUES (
        3,
        'Visor',
        'Solo puede ver información',
        '{"usuarios":{"ver":false,"crear":false,"editar":false,"eliminar":false},"roles":{"ver":false,"crear":false,"editar":false,"eliminar":false},"vehiculos":{"ver":true,"crear":false,"editar":false,"eliminar":false},"propiedades":{"ver":true,"crear":false,"editar":false,"eliminar":false},"reportes":{"ver":true,"generar":false},"auditoria":{"ver":false}}',
        1,
        GETDATE(),
        GETDATE()
    );
    
    PRINT 'Rol Visor creado';
    SET IDENTITY_INSERT Roles OFF;
END
ELSE
    PRINT 'Rol Visor ya existe';
GO

-- Rol 4: Consulta
IF NOT EXISTS (SELECT * FROM Roles WHERE RolID = 4)
BEGIN
    SET IDENTITY_INSERT Roles ON;
    
    INSERT INTO Roles (RolID, Nombre, Descripcion, Permisos, Activo, createdAt, updatedAt)
    VALUES (
        4,
        'Consulta',
        'Acceso limitado de solo lectura',
        '{"usuarios":{"ver":false,"crear":false,"editar":false,"eliminar":false},"roles":{"ver":false,"crear":false,"editar":false,"eliminar":false},"vehiculos":{"ver":true,"crear":false,"editar":false,"eliminar":false},"propiedades":{"ver":true,"crear":false,"editar":false,"eliminar":false},"reportes":{"ver":false,"generar":false},"auditoria":{"ver":false}}',
        1,
        GETDATE(),
        GETDATE()
    );
    
    PRINT 'Rol Consulta creado';
    SET IDENTITY_INSERT Roles OFF;
END
ELSE
    PRINT 'Rol Consulta ya existe';
GO

-- Verificar roles creados
PRINT '=== Roles en la base de datos ===';
SELECT RolID, Nombre, Descripcion, Activo 
FROM Roles 
ORDER BY RolID;
GO

PRINT '=== Script completado exitosamente ===';
PRINT 'Ahora puedes ejecutar el ALTER TABLE para crear la foreign key';
