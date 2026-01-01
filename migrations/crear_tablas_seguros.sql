-- ============================================
-- SCRIPT DE CREACIÓN DE TABLAS - MÓDULO DE SEGUROS
-- Sistema de Control de Activos
-- Fecha: 30 de Diciembre de 2025
-- ============================================

USE SistemaActivos;
GO

-- ============================================
-- TABLA: Polizas
-- ============================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Polizas')
BEGIN
    CREATE TABLE Polizas (
        PolizaID INT IDENTITY(1,1) PRIMARY KEY,
        TipoPoliza NVARCHAR(50) NOT NULL,
        CategoriaPoliza NVARCHAR(50) NOT NULL, -- 'Vehiculo' o 'Propiedad'
        Aseguradora NVARCHAR(100) NOT NULL,
        NumeroPoliza NVARCHAR(100) NOT NULL UNIQUE,
        
        -- Vinculación con activos
        VehiculoID INT NULL,
        PropiedadID INT NULL,
        UsuarioID INT NOT NULL,
        
        -- Montos
        ValorAsegurado DECIMAL(18,2) NOT NULL,
        PrimaAnual DECIMAL(18,2) NOT NULL,
        PrimaMensual DECIMAL(18,2) NULL,
        Deducible DECIMAL(18,2) NULL,
        Coberturas NVARCHAR(MAX) NULL, -- JSON con coberturas
        
        -- Fechas
        FechaInicio DATE NOT NULL,
        FechaVencimiento DATE NOT NULL,
        FechaRenovacion DATE NULL,
        
        -- Estado
        Estado NVARCHAR(50) DEFAULT 'Vigente', -- Vigente, Por Vencer, Vencida, Cancelada
        
        -- Información de contacto
        TelefonoAseguradora NVARCHAR(20) NULL,
        EmailAseguradora NVARCHAR(100) NULL,
        AgenteAsignado NVARCHAR(100) NULL,
        TelefonoAgente NVARCHAR(20) NULL,
        
        -- Documentos
        RutaDocumento NVARCHAR(500) NULL,
        
        -- Observaciones
        Observaciones NVARCHAR(MAX) NULL,
        
        -- Auditoría
        FechaCreacion DATETIME DEFAULT GETDATE(),
        FechaModificacion DATETIME NULL,
        
        -- Foreign Keys
        CONSTRAINT FK_Polizas_Vehiculos FOREIGN KEY (VehiculoID) REFERENCES Vehiculos(VehiculoID) ON DELETE SET NULL,
        CONSTRAINT FK_Polizas_Propiedades FOREIGN KEY (PropiedadID) REFERENCES Propiedades(PropiedadID) ON DELETE SET NULL,
        CONSTRAINT FK_Polizas_Usuarios FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID) ON DELETE CASCADE,
        
        -- Constraints
        CONSTRAINT CHK_Polizas_Categoria CHECK (CategoriaPoliza IN ('Vehiculo', 'Propiedad')),
        CONSTRAINT CHK_Polizas_Estado CHECK (Estado IN ('Vigente', 'Por Vencer', 'Vencida', 'Cancelada')),
        CONSTRAINT CHK_Polizas_Vinculacion CHECK (
            (CategoriaPoliza = 'Vehiculo' AND VehiculoID IS NOT NULL AND PropiedadID IS NULL) OR
            (CategoriaPoliza = 'Propiedad' AND PropiedadID IS NOT NULL AND VehiculoID IS NULL)
        )
    );
    
    PRINT '✅ Tabla Polizas creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla Polizas ya existe';
END
GO

-- ============================================
-- TABLA: Reclamaciones
-- ============================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Reclamaciones')
BEGIN
    CREATE TABLE Reclamaciones (
        ReclamacionID INT IDENTITY(1,1) PRIMARY KEY,
        PolizaID INT NOT NULL,
        UsuarioID INT NOT NULL,
        NumeroReclamacion NVARCHAR(50) NOT NULL UNIQUE,
        
        -- Información del siniestro
        TipoSiniestro NVARCHAR(100) NOT NULL,
        FechaSiniestro DATETIME NOT NULL,
        LugarSiniestro NVARCHAR(500) NOT NULL,
        DescripcionSiniestro NVARCHAR(MAX) NOT NULL,
        
        -- Montos
        MontoReclamado DECIMAL(18,2) NOT NULL,
        MontoAprobado DECIMAL(18,2) NULL,
        DeducibleAplicado DECIMAL(18,2) NULL,
        MontoIndemnizado DECIMAL(18,2) NULL,
        
        -- Estado y fechas
        Estado NVARCHAR(50) DEFAULT 'Radicada', -- Radicada, En Revision, Aprobada, Rechazada, Indemnizada, Cerrada
        FechaRadicacion DATETIME DEFAULT GETDATE(),
        FechaAprobacion DATETIME NULL,
        FechaIndemnizacion DATETIME NULL,
        FechaCierre DATETIME NULL,
        
        -- Ajustador
        AjustadorAsignado NVARCHAR(100) NULL,
        TelefonoAjustador NVARCHAR(20) NULL,
        EmailAjustador NVARCHAR(100) NULL,
        
        -- Documentos y observaciones
        DocumentosSoportes NVARCHAR(MAX) NULL, -- Lista de rutas separadas por coma
        MotivoRechazo NVARCHAR(MAX) NULL,
        Observaciones NVARCHAR(MAX) NULL,
        
        -- Auditoría
        FechaCreacion DATETIME DEFAULT GETDATE(),
        FechaModificacion DATETIME NULL,
        
        -- Foreign Keys
        CONSTRAINT FK_Reclamaciones_Polizas FOREIGN KEY (PolizaID) REFERENCES Polizas(PolizaID) ON DELETE CASCADE,
        CONSTRAINT FK_Reclamaciones_Usuarios FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID) ON DELETE NO ACTION,
        
        -- Constraints
        CONSTRAINT CHK_Reclamaciones_Estado CHECK (Estado IN ('Radicada', 'En Revision', 'Aprobada', 'Rechazada', 'Indemnizada', 'Cerrada'))
    );
    
    PRINT '✅ Tabla Reclamaciones creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla Reclamaciones ya existe';
END
GO

-- ============================================
-- TABLA: Renovaciones
-- ============================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Renovaciones')
BEGIN
    CREATE TABLE Renovaciones (
        RenovacionID INT IDENTITY(1,1) PRIMARY KEY,
        PolizaID INT NOT NULL,
        UsuarioID INT NOT NULL,
        
        -- Información de la renovación
        PolizaAnteriorNumero NVARCHAR(100) NOT NULL,
        NuevaPolizaNumero NVARCHAR(100) NOT NULL,
        
        -- Comparación de primas
        PrimaAnterior DECIMAL(18,2) NOT NULL,
        NuevaPrima DECIMAL(18,2) NOT NULL,
        DiferenciaPrima DECIMAL(18,2) NOT NULL,
        PorcentajeAumento DECIMAL(5,2) NULL,
        
        -- Fechas
        FechaRenovacion DATE NOT NULL,
        FechaVencimientoAnterior DATE NOT NULL,
        FechaVencimientoNueva DATE NOT NULL,
        
        -- Cambios
        CambiosCobertura NVARCHAR(MAX) NULL,
        MotivoRenovacion NVARCHAR(500) NULL,
        
        -- Estado
        Estado NVARCHAR(50) DEFAULT 'Procesada', -- Procesada, Cancelada
        
        -- Auditoría
        FechaCreacion DATETIME DEFAULT GETDATE(),
        FechaModificacion DATETIME NULL,
        
        -- Foreign Keys
        CONSTRAINT FK_Renovaciones_Polizas FOREIGN KEY (PolizaID) REFERENCES Polizas(PolizaID) ON DELETE CASCADE,
        CONSTRAINT FK_Renovaciones_Usuarios FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID) ON DELETE NO ACTION,
        
        -- Constraints
        CONSTRAINT CHK_Renovaciones_Estado CHECK (Estado IN ('Procesada', 'Cancelada'))
    );
    
    PRINT '✅ Tabla Renovaciones creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla Renovaciones ya existe';
END
GO

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

-- Índices para Polizas
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Polizas_UsuarioID')
    CREATE INDEX IX_Polizas_UsuarioID ON Polizas(UsuarioID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Polizas_Estado')
    CREATE INDEX IX_Polizas_Estado ON Polizas(Estado);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Polizas_FechaVencimiento')
    CREATE INDEX IX_Polizas_FechaVencimiento ON Polizas(FechaVencimiento);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Polizas_VehiculoID')
    CREATE INDEX IX_Polizas_VehiculoID ON Polizas(VehiculoID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Polizas_PropiedadID')
    CREATE INDEX IX_Polizas_PropiedadID ON Polizas(PropiedadID);

-- Índices para Reclamaciones
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Reclamaciones_PolizaID')
    CREATE INDEX IX_Reclamaciones_PolizaID ON Reclamaciones(PolizaID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Reclamaciones_UsuarioID')
    CREATE INDEX IX_Reclamaciones_UsuarioID ON Reclamaciones(UsuarioID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Reclamaciones_Estado')
    CREATE INDEX IX_Reclamaciones_Estado ON Reclamaciones(Estado);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Reclamaciones_FechaRadicacion')
    CREATE INDEX IX_Reclamaciones_FechaRadicacion ON Reclamaciones(FechaRadicacion);

-- Índices para Renovaciones
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Renovaciones_PolizaID')
    CREATE INDEX IX_Renovaciones_PolizaID ON Renovaciones(PolizaID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Renovaciones_UsuarioID')
    CREATE INDEX IX_Renovaciones_UsuarioID ON Renovaciones(UsuarioID);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Renovaciones_FechaRenovacion')
    CREATE INDEX IX_Renovaciones_FechaRenovacion ON Renovaciones(FechaRenovacion);

PRINT '✅ Índices creados exitosamente';
GO

-- ============================================
-- STORED PROCEDURE: Actualizar estado de pólizas
-- ============================================

IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_ActualizarEstadoPolizas')
    DROP PROCEDURE sp_ActualizarEstadoPolizas;
GO

CREATE PROCEDURE sp_ActualizarEstadoPolizas
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @FechaHoy DATE = CAST(GETDATE() AS DATE);
    DECLARE @Fecha30Dias DATE = DATEADD(DAY, 30, @FechaHoy);
    
    -- Actualizar pólizas vencidas
    UPDATE Polizas
    SET Estado = 'Vencida',
        FechaModificacion = GETDATE()
    WHERE FechaVencimiento < @FechaHoy
      AND Estado != 'Vencida'
      AND Estado != 'Cancelada';
    
    -- Actualizar pólizas por vencer (próximos 30 días)
    UPDATE Polizas
    SET Estado = 'Por Vencer',
        FechaModificacion = GETDATE()
    WHERE FechaVencimiento BETWEEN @FechaHoy AND @Fecha30Dias
      AND Estado = 'Vigente';
    
    -- Mantener vigentes las que aún tienen tiempo
    UPDATE Polizas
    SET Estado = 'Vigente',
        FechaModificacion = GETDATE()
    WHERE FechaVencimiento > @Fecha30Dias
      AND Estado != 'Vigente'
      AND Estado != 'Cancelada';
    
    PRINT '✅ Estados de pólizas actualizados';
END
GO

PRINT '✅ Stored Procedure sp_ActualizarEstadoPolizas creado';
GO

-- ============================================
-- TRIGGER: Calcular prima mensual automáticamente
-- ============================================

IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_Polizas_CalcularPrimaMensual')
    DROP TRIGGER trg_Polizas_CalcularPrimaMensual;
GO

CREATE TRIGGER trg_Polizas_CalcularPrimaMensual
ON Polizas
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE p
    SET PrimaMensual = CEILING(i.PrimaAnual / 12)
    FROM Polizas p
    INNER JOIN inserted i ON p.PolizaID = i.PolizaID
    WHERE i.PrimaMensual IS NULL OR i.PrimaMensual = 0;
END
GO

PRINT '✅ Trigger trg_Polizas_CalcularPrimaMensual creado';
GO

-- ============================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ============================================

-- Descomentar para insertar datos de prueba
/*
-- Póliza de vehículo
INSERT INTO Polizas (
    TipoPoliza, CategoriaPoliza, Aseguradora, NumeroPoliza,
    VehiculoID, UsuarioID, ValorAsegurado, PrimaAnual,
    Deducible, FechaInicio, FechaVencimiento, Estado
) VALUES (
    'Todo Riesgo', 'Vehiculo', 'Seguros Bolivar', 'POL-VEH-2025-00001',
    1, 7, 50000000, 2400000,
    500000, '2025-01-01', '2026-01-01', 'Vigente'
);

-- Reclamación de ejemplo
INSERT INTO Reclamaciones (
    PolizaID, UsuarioID, NumeroReclamacion, TipoSiniestro,
    FechaSiniestro, LugarSiniestro, DescripcionSiniestro,
    MontoReclamado, Estado
) VALUES (
    1, 7, 'REC-2025-00001', 'Choque',
    '2025-12-20 10:30:00', 'Calle 100 con Carrera 15',
    'Colisión en intersección. Daños en parte frontal del vehículo.',
    5000000, 'En Revision'
);

PRINT '✅ Datos de prueba insertados';
*/

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

PRINT '';
PRINT '============================================';
PRINT 'RESUMEN DE CREACIÓN DE TABLAS';
PRINT '============================================';
PRINT '';

SELECT 'Polizas' AS Tabla, COUNT(*) AS Registros FROM Polizas
UNION ALL
SELECT 'Reclamaciones', COUNT(*) FROM Reclamaciones
UNION ALL
SELECT 'Renovaciones', COUNT(*) FROM Renovaciones;

PRINT '';
PRINT '✅ Script ejecutado exitosamente';
PRINT '============================================';
GO
