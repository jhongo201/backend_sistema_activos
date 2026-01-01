-- =============================================
-- Migración: Soporte para Permutas y Cambios
-- Fecha: 2025-12-28
-- Descripción: Agrega soporte para contratos de permuta
--              donde se pueden intercambiar múltiples bienes
-- =============================================

-- 1. Crear tabla BienesContrato
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BienesContrato]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[BienesContrato] (
        [BienContratoID] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [ContratoID] INT NOT NULL,
        [TipoBien] VARCHAR(50) NOT NULL CHECK ([TipoBien] IN ('Vehiculo', 'Propiedad', 'Moto', 'Otro')),
        [Rol] VARCHAR(20) NOT NULL CHECK ([Rol] IN ('Entrega', 'Recibe')),
        [Parte] VARCHAR(20) NOT NULL CHECK ([Parte] IN ('Vendedor', 'Comprador')),
        
        -- Referencias opcionales
        [VehiculoID] INT NULL,
        [PropiedadID] INT NULL,
        
        -- Para bienes no registrados
        [DescripcionBien] VARCHAR(500) NULL,
        [ValorComercial] DECIMAL(18,2) NOT NULL,
        
        -- Detalles adicionales
        [Marca] VARCHAR(100) NULL,
        [Modelo] VARCHAR(100) NULL,
        [Año] INT NULL,
        [Placa] VARCHAR(20) NULL,
        [Matricula] VARCHAR(50) NULL,
        [Observaciones] TEXT NULL,
        
        -- Foreign Keys
        CONSTRAINT [FK_BienesContrato_Contratos] FOREIGN KEY ([ContratoID]) 
            REFERENCES [dbo].[Contratos]([ContratoID]) ON DELETE CASCADE,
        CONSTRAINT [FK_BienesContrato_Vehiculos] FOREIGN KEY ([VehiculoID]) 
            REFERENCES [dbo].[Vehiculos]([VehiculoID]) ON DELETE NO ACTION,
        CONSTRAINT [FK_BienesContrato_Propiedades] FOREIGN KEY ([PropiedadID]) 
            REFERENCES [dbo].[Propiedades]([PropiedadID]) ON DELETE NO ACTION
    );
    
    PRINT 'Tabla BienesContrato creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Tabla BienesContrato ya existe';
END
GO

-- 2. Agregar campos de permuta a tabla Contratos
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Contratos]') AND name = 'ModalidadContrato')
BEGIN
    ALTER TABLE [dbo].[Contratos] 
    ADD [ModalidadContrato] VARCHAR(50) NULL 
        CONSTRAINT [DF_Contratos_ModalidadContrato] DEFAULT 'Compraventa'
        CHECK ([ModalidadContrato] IN ('Compraventa', 'Permuta', 'Permuta con Saldo'));
    
    PRINT 'Campo ModalidadContrato agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Contratos]') AND name = 'ValorTotalEntrega')
BEGIN
    ALTER TABLE [dbo].[Contratos] ADD [ValorTotalEntrega] DECIMAL(18,2) NULL;
    PRINT 'Campo ValorTotalEntrega agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Contratos]') AND name = 'ValorTotalRecibe')
BEGIN
    ALTER TABLE [dbo].[Contratos] ADD [ValorTotalRecibe] DECIMAL(18,2) NULL;
    PRINT 'Campo ValorTotalRecibe agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Contratos]') AND name = 'DiferenciaValor')
BEGIN
    ALTER TABLE [dbo].[Contratos] ADD [DiferenciaValor] DECIMAL(18,2) NULL;
    PRINT 'Campo DiferenciaValor agregado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[Contratos]') AND name = 'QuienPagaDiferencia')
BEGIN
    ALTER TABLE [dbo].[Contratos] 
    ADD [QuienPagaDiferencia] VARCHAR(20) NULL
        CHECK ([QuienPagaDiferencia] IN ('Vendedor', 'Comprador') OR [QuienPagaDiferencia] IS NULL);
    
    PRINT 'Campo QuienPagaDiferencia agregado';
END
GO

-- 3. Actualizar contratos existentes con modalidad por defecto
UPDATE [dbo].[Contratos] 
SET [ModalidadContrato] = 'Compraventa'
WHERE [ModalidadContrato] IS NULL;
GO

-- 4. Crear índices para mejorar rendimiento
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_BienesContrato_ContratoID' AND object_id = OBJECT_ID(N'[dbo].[BienesContrato]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_BienesContrato_ContratoID] 
    ON [dbo].[BienesContrato] ([ContratoID]);
    PRINT 'Índice IX_BienesContrato_ContratoID creado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_BienesContrato_VehiculoID' AND object_id = OBJECT_ID(N'[dbo].[BienesContrato]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_BienesContrato_VehiculoID] 
    ON [dbo].[BienesContrato] ([VehiculoID]);
    PRINT 'Índice IX_BienesContrato_VehiculoID creado';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_BienesContrato_PropiedadID' AND object_id = OBJECT_ID(N'[dbo].[BienesContrato]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_BienesContrato_PropiedadID] 
    ON [dbo].[BienesContrato] ([PropiedadID]);
    PRINT 'Índice IX_BienesContrato_PropiedadID creado';
END
GO

PRINT '===========================================';
PRINT 'Migración completada exitosamente';
PRINT 'El sistema ahora soporta:';
PRINT '- Contratos de Compraventa (existente)';
PRINT '- Contratos de Permuta';
PRINT '- Contratos de Permuta con Saldo';
PRINT '===========================================';
