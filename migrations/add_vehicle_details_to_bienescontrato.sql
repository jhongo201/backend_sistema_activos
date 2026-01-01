-- =============================================
-- Migración: Agregar campos detallados de vehículos a BienesContrato
-- Descripción: Agrega campos técnicos, documentación y estado legal de vehículos
-- Fecha: 29 de Diciembre de 2025
-- =============================================

USE SistemaActivos;
GO

-- Agregar campos técnicos del vehículo (solo si no existen)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Clase')
    ALTER TABLE BienesContrato ADD Clase VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Linea')
    ALTER TABLE BienesContrato ADD Linea VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Cilindraje')
    ALTER TABLE BienesContrato ADD Cilindraje VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Capacidad')
    ALTER TABLE BienesContrato ADD Capacidad INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'NumeroMotor')
    ALTER TABLE BienesContrato ADD NumeroMotor VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Serie')
    ALTER TABLE BienesContrato ADD Serie VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Color')
    ALTER TABLE BienesContrato ADD Color VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Tipo')
    ALTER TABLE BienesContrato ADD Tipo VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Servicio')
    ALTER TABLE BienesContrato ADD Servicio VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'NumeroChasis')
    ALTER TABLE BienesContrato ADD NumeroChasis VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'NumeroCarroceria')
    ALTER TABLE BienesContrato ADD NumeroCarroceria VARCHAR(100) NULL;
GO

-- Agregar campos de documentación del vehículo (solo si no existen)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'FechaVencimientoSOAT')
    ALTER TABLE BienesContrato ADD FechaVencimientoSOAT DATE NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'FechaVencimientoTecnomecanica')
    ALTER TABLE BienesContrato ADD FechaVencimientoTecnomecanica DATE NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'EstadoImpuestos')
    ALTER TABLE BienesContrato ADD EstadoImpuestos VARCHAR(20) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'AniosImpuestosPendientes')
    ALTER TABLE BienesContrato ADD AniosImpuestosPendientes VARCHAR(200) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'TieneEmbargos')
    ALTER TABLE BienesContrato ADD TieneEmbargos BIT NULL DEFAULT 0;
GO

-- Agregar restricción CHECK para EstadoImpuestos (solo si no existe)
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_BienesContrato_EstadoImpuestos')
BEGIN
    ALTER TABLE BienesContrato ADD CONSTRAINT CK_BienesContrato_EstadoImpuestos 
        CHECK (EstadoImpuestos IN ('Al Dia', 'Debe', NULL));
END
GO

-- Crear índices para mejorar consultas (solo si no existen)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_BienesContrato_Placa' AND object_id = OBJECT_ID('BienesContrato'))
    CREATE INDEX IX_BienesContrato_Placa ON BienesContrato(Placa);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_BienesContrato_NumeroChasis' AND object_id = OBJECT_ID('BienesContrato'))
    CREATE INDEX IX_BienesContrato_NumeroChasis ON BienesContrato(NumeroChasis);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_BienesContrato_NumeroMotor' AND object_id = OBJECT_ID('BienesContrato'))
    CREATE INDEX IX_BienesContrato_NumeroMotor ON BienesContrato(NumeroMotor);
GO

PRINT '✅ Migración completada: Campos detallados de vehículos verificados/agregados a BienesContrato';
GO
