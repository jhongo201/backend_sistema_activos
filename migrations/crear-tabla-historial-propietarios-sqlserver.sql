-- =====================================================
-- Migración: Crear tabla HistorialPropietarios (SQL SERVER)
-- Descripción: Sistema completo de historial de propietarios de vehículos
-- Fecha: 2024-12-31
-- Base de datos: SQL Server
-- =====================================================

-- Crear tabla HistorialPropietarios
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[HistorialPropietarios]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[HistorialPropietarios] (
        [HistorialID] INT IDENTITY(1,1) PRIMARY KEY,
        [VehiculoID] INT NOT NULL,
        
        -- Información del propietario
        [TipoPropietario] VARCHAR(20) NOT NULL CHECK ([TipoPropietario] IN ('Anterior', 'Actual', 'Nuevo')),
        [NombrePropietario] NVARCHAR(200) NOT NULL,
        [TipoDocumento] VARCHAR(20) DEFAULT 'CC',
        [NumeroDocumento] VARCHAR(50) NOT NULL,
        [Telefono] VARCHAR(20) NULL,
        [Email] VARCHAR(100) NULL,
        [Direccion] NVARCHAR(200) NULL,
        [Ciudad] NVARCHAR(100) NULL,
        
        -- Fechas de transacción
        [FechaAdquisicion] DATE NULL,
        [FechaVenta] DATE NULL,
        
        -- Información de la transacción
        [ValorCompra] DECIMAL(18,2) NULL,
        [ValorVenta] DECIMAL(18,2) NULL,
        [ContratoID] INT NULL,
        
        -- Información legal del traspaso
        [TraspasoRealizado] BIT NOT NULL DEFAULT 0,
        [FechaTraspaso] DATE NULL,
        [NumeroTraspaso] VARCHAR(50) NULL,
        [OrganismoTransito] NVARCHAR(100) NULL,
        
        -- Estado
        [EsPropietarioActual] BIT NOT NULL DEFAULT 0,
        
        -- Observaciones
        [Observaciones] NVARCHAR(MAX) NULL,
        
        -- Auditoría
        [FechaRegistro] DATETIME2 DEFAULT GETDATE(),
        [FechaActualizacion] DATETIME2 DEFAULT GETDATE(),
        [UsuarioRegistro] INT NULL,
        
        -- Claves foráneas
        CONSTRAINT [FK_HistorialPropietarios_Vehiculos] 
            FOREIGN KEY ([VehiculoID]) REFERENCES [dbo].[Vehiculos]([VehiculoID]) ON DELETE CASCADE,
        CONSTRAINT [FK_HistorialPropietarios_Contratos] 
            FOREIGN KEY ([ContratoID]) REFERENCES [dbo].[Contratos]([ContratoID]) ON DELETE SET NULL,
        CONSTRAINT [FK_HistorialPropietarios_Usuarios] 
            FOREIGN KEY ([UsuarioRegistro]) REFERENCES [dbo].[Usuarios]([UsuarioID]) ON DELETE SET NULL
    );
    
    PRINT 'Tabla HistorialPropietarios creada exitosamente';
END
ELSE
BEGIN
    PRINT 'La tabla HistorialPropietarios ya existe';
END
GO

-- Crear índices para optimizar consultas
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HistorialPropietarios_VehiculoID' AND object_id = OBJECT_ID('HistorialPropietarios'))
BEGIN
    CREATE INDEX [IX_HistorialPropietarios_VehiculoID] ON [dbo].[HistorialPropietarios]([VehiculoID]);
    PRINT 'Índice IX_HistorialPropietarios_VehiculoID creado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HistorialPropietarios_PropietarioActual' AND object_id = OBJECT_ID('HistorialPropietarios'))
BEGIN
    CREATE INDEX [IX_HistorialPropietarios_PropietarioActual] ON [dbo].[HistorialPropietarios]([VehiculoID], [EsPropietarioActual]);
    PRINT 'Índice IX_HistorialPropietarios_PropietarioActual creado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HistorialPropietarios_NumeroDocumento' AND object_id = OBJECT_ID('HistorialPropietarios'))
BEGIN
    CREATE INDEX [IX_HistorialPropietarios_NumeroDocumento] ON [dbo].[HistorialPropietarios]([NumeroDocumento]);
    PRINT 'Índice IX_HistorialPropietarios_NumeroDocumento creado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HistorialPropietarios_TipoPropietario' AND object_id = OBJECT_ID('HistorialPropietarios'))
BEGIN
    CREATE INDEX [IX_HistorialPropietarios_TipoPropietario] ON [dbo].[HistorialPropietarios]([TipoPropietario]);
    PRINT 'Índice IX_HistorialPropietarios_TipoPropietario creado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HistorialPropietarios_FechaAdquisicion' AND object_id = OBJECT_ID('HistorialPropietarios'))
BEGIN
    CREATE INDEX [IX_HistorialPropietarios_FechaAdquisicion] ON [dbo].[HistorialPropietarios]([FechaAdquisicion]);
    PRINT 'Índice IX_HistorialPropietarios_FechaAdquisicion creado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_HistorialPropietarios_FechaVenta' AND object_id = OBJECT_ID('HistorialPropietarios'))
BEGIN
    CREATE INDEX [IX_HistorialPropietarios_FechaVenta] ON [dbo].[HistorialPropietarios]([FechaVenta]);
    PRINT 'Índice IX_HistorialPropietarios_FechaVenta creado';
END
GO

-- Agregar campo PropietarioActualID a la tabla Vehiculos
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Vehiculos]') AND name = 'PropietarioActualID')
BEGIN
    ALTER TABLE [dbo].[Vehiculos] 
    ADD [PropietarioActualID] INT NULL;
    
    PRINT 'Campo PropietarioActualID agregado a tabla Vehiculos';
END
ELSE
BEGIN
    PRINT 'El campo PropietarioActualID ya existe en tabla Vehiculos';
END
GO

-- Agregar foreign key para PropietarioActualID
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Vehiculos_PropietarioActual')
BEGIN
    ALTER TABLE [dbo].[Vehiculos]
    ADD CONSTRAINT [FK_Vehiculos_PropietarioActual] 
        FOREIGN KEY ([PropietarioActualID]) REFERENCES [dbo].[HistorialPropietarios]([HistorialID]) ON DELETE NO ACTION;
    
    PRINT 'Foreign key FK_Vehiculos_PropietarioActual creada';
END
GO

-- Crear índice para PropietarioActualID
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Vehiculos_PropietarioActualID' AND object_id = OBJECT_ID('Vehiculos'))
BEGIN
    CREATE INDEX [IX_Vehiculos_PropietarioActualID] ON [dbo].[Vehiculos]([PropietarioActualID]);
    PRINT 'Índice IX_Vehiculos_PropietarioActualID creado';
END
GO

-- =====================================================
-- Trigger para asegurar que solo haya un propietario actual por vehículo (INSERT)
-- =====================================================
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_HistorialPropietarios_Insert')
BEGIN
    DROP TRIGGER [dbo].[trg_HistorialPropietarios_Insert];
    PRINT 'Trigger trg_HistorialPropietarios_Insert eliminado para recrear';
END
GO

CREATE TRIGGER [dbo].[trg_HistorialPropietarios_Insert]
ON [dbo].[HistorialPropietarios]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Si el nuevo registro es propietario actual, desactivar los demás
    IF EXISTS (SELECT 1 FROM inserted WHERE [EsPropietarioActual] = 1)
    BEGIN
        UPDATE [dbo].[HistorialPropietarios]
        SET [EsPropietarioActual] = 0
        WHERE [VehiculoID] IN (SELECT [VehiculoID] FROM inserted WHERE [EsPropietarioActual] = 1)
            AND [HistorialID] NOT IN (SELECT [HistorialID] FROM inserted)
            AND [EsPropietarioActual] = 1;
    END
END
GO

PRINT 'Trigger trg_HistorialPropietarios_Insert creado';
GO

-- =====================================================
-- Trigger para asegurar que solo haya un propietario actual por vehículo (UPDATE)
-- =====================================================
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_HistorialPropietarios_Update')
BEGIN
    DROP TRIGGER [dbo].[trg_HistorialPropietarios_Update];
    PRINT 'Trigger trg_HistorialPropietarios_Update eliminado para recrear';
END
GO

CREATE TRIGGER [dbo].[trg_HistorialPropietarios_Update]
ON [dbo].[HistorialPropietarios]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Si se actualiza a propietario actual, desactivar los demás
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        INNER JOIN deleted d ON i.[HistorialID] = d.[HistorialID]
        WHERE i.[EsPropietarioActual] = 1 AND d.[EsPropietarioActual] = 0
    )
    BEGIN
        UPDATE [dbo].[HistorialPropietarios]
        SET [EsPropietarioActual] = 0
        WHERE [VehiculoID] IN (
            SELECT i.[VehiculoID] 
            FROM inserted i
            INNER JOIN deleted d ON i.[HistorialID] = d.[HistorialID]
            WHERE i.[EsPropietarioActual] = 1 AND d.[EsPropietarioActual] = 0
        )
        AND [HistorialID] NOT IN (SELECT [HistorialID] FROM inserted)
        AND [EsPropietarioActual] = 1;
    END
END
GO

PRINT 'Trigger trg_HistorialPropietarios_Update creado';
GO

-- =====================================================
-- Trigger para actualizar FechaActualizacion automáticamente
-- =====================================================
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_HistorialPropietarios_UpdateTimestamp')
BEGIN
    DROP TRIGGER [dbo].[trg_HistorialPropietarios_UpdateTimestamp];
    PRINT 'Trigger trg_HistorialPropietarios_UpdateTimestamp eliminado para recrear';
END
GO

CREATE TRIGGER [dbo].[trg_HistorialPropietarios_UpdateTimestamp]
ON [dbo].[HistorialPropietarios]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE [dbo].[HistorialPropietarios]
    SET [FechaActualizacion] = GETDATE()
    WHERE [HistorialID] IN (SELECT [HistorialID] FROM inserted);
END
GO

PRINT 'Trigger trg_HistorialPropietarios_UpdateTimestamp creado';
GO

-- =====================================================
-- Verificación de instalación
-- =====================================================
PRINT '';
PRINT '========================================';
PRINT 'VERIFICACIÓN DE INSTALACIÓN';
PRINT '========================================';

-- Verificar tabla
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[HistorialPropietarios]') AND type in (N'U'))
    PRINT '✓ Tabla HistorialPropietarios: OK';
ELSE
    PRINT '✗ Tabla HistorialPropietarios: ERROR';

-- Verificar campo en Vehiculos
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Vehiculos]') AND name = 'PropietarioActualID')
    PRINT '✓ Campo PropietarioActualID en Vehiculos: OK';
ELSE
    PRINT '✗ Campo PropietarioActualID en Vehiculos: ERROR';

-- Verificar triggers
DECLARE @TriggerCount INT;
SELECT @TriggerCount = COUNT(*) 
FROM sys.triggers 
WHERE name IN ('trg_HistorialPropietarios_Insert', 'trg_HistorialPropietarios_Update', 'trg_HistorialPropietarios_UpdateTimestamp');

PRINT '✓ Triggers creados: ' + CAST(@TriggerCount AS VARCHAR) + '/3';

-- Verificar índices
DECLARE @IndexCount INT;
SELECT @IndexCount = COUNT(*) 
FROM sys.indexes 
WHERE object_id = OBJECT_ID('HistorialPropietarios')
AND name LIKE 'IX_HistorialPropietarios_%';

PRINT '✓ Índices creados en HistorialPropietarios: ' + CAST(@IndexCount AS VARCHAR) + '/5';

PRINT '========================================';
PRINT 'INSTALACIÓN COMPLETADA';
PRINT '========================================';
GO

-- =====================================================
-- Consultas útiles para verificación
-- =====================================================
/*
-- Ver estructura de la tabla
EXEC sp_help 'HistorialPropietarios';

-- Ver historial completo de un vehículo
SELECT * FROM HistorialPropietarios WHERE VehiculoID = 1 ORDER BY FechaAdquisicion;

-- Ver propietario actual de un vehículo
SELECT * FROM HistorialPropietarios WHERE VehiculoID = 1 AND EsPropietarioActual = 1;

-- Ver vehículos sin traspaso realizado
SELECT v.*, h.NombrePropietario, h.FechaAdquisicion
FROM Vehiculos v
INNER JOIN HistorialPropietarios h ON v.VehiculoID = h.VehiculoID
WHERE h.EsPropietarioActual = 1 AND h.TraspasoRealizado = 0;

-- Ver historial de ventas
SELECT v.Placa, v.Marca, v.Modelo, h.NombrePropietario, h.FechaVenta, h.ValorVenta
FROM HistorialPropietarios h
INNER JOIN Vehiculos v ON h.VehiculoID = v.VehiculoID
WHERE h.TipoPropietario = 'Nuevo'
ORDER BY h.FechaVenta DESC;
*/
