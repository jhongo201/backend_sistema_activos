-- =============================================
-- Migración: Agregar campos detallados de propiedades/inmuebles a BienesContrato
-- Descripción: Agrega campos jurídicos, catastrales, impuestos y gastos de inmuebles
-- Fecha: 29 de Diciembre de 2025
-- =============================================

USE SistemaActivos;
GO

-- ========================================
-- SECCIÓN 1: INFORMACIÓN BÁSICA DEL INMUEBLE
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'TipoInmueble')
    ALTER TABLE BienesContrato ADD TipoInmueble VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'DireccionCompleta')
    ALTER TABLE BienesContrato ADD DireccionCompleta VARCHAR(500) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Municipio')
    ALTER TABLE BienesContrato ADD Municipio VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Departamento')
    ALTER TABLE BienesContrato ADD Departamento VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Barrio')
    ALTER TABLE BienesContrato ADD Barrio VARCHAR(100) NULL;
GO

-- ========================================
-- SECCIÓN 2: INFORMACIÓN CATASTRAL Y REGISTRAL
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'MatriculaInmobiliaria')
    ALTER TABLE BienesContrato ADD MatriculaInmobiliaria VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'CedulaCatastral')
    ALTER TABLE BienesContrato ADD CedulaCatastral VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'ChipCatastral')
    ALTER TABLE BienesContrato ADD ChipCatastral VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'OficinaRegistro')
    ALTER TABLE BienesContrato ADD OficinaRegistro VARCHAR(200) NULL;
GO

-- ========================================
-- SECCIÓN 3: ÁREAS Y MEDIDAS
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'AreaConstruida')
    ALTER TABLE BienesContrato ADD AreaConstruida DECIMAL(18, 2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'AreaPrivada')
    ALTER TABLE BienesContrato ADD AreaPrivada DECIMAL(18, 2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'AreaTerreno')
    ALTER TABLE BienesContrato ADD AreaTerreno DECIMAL(18, 2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Linderos')
    ALTER TABLE BienesContrato ADD Linderos TEXT NULL;
GO

-- ========================================
-- SECCIÓN 4: PROPIEDAD HORIZONTAL
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'EsPropiedadHorizontal')
    ALTER TABLE BienesContrato ADD EsPropiedadHorizontal BIT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'CoeficienteCopropiedad')
    ALTER TABLE BienesContrato ADD CoeficienteCopropiedad DECIMAL(10, 6) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'NombreConjunto')
    ALTER TABLE BienesContrato ADD NombreConjunto VARCHAR(200) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'NumeroApartamento')
    ALTER TABLE BienesContrato ADD NumeroApartamento VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Torre')
    ALTER TABLE BienesContrato ADD Torre VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Piso')
    ALTER TABLE BienesContrato ADD Piso VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'ParqueaderosPrivados')
    ALTER TABLE BienesContrato ADD ParqueaderosPrivados INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Depositos')
    ALTER TABLE BienesContrato ADD Depositos INT NULL;
GO

-- ========================================
-- SECCIÓN 5: TÍTULO DE ADQUISICIÓN DEL VENDEDOR
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'EscrituraPublicaNumero')
    ALTER TABLE BienesContrato ADD EscrituraPublicaNumero VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'NotariaEscritura')
    ALTER TABLE BienesContrato ADD NotariaEscritura VARCHAR(200) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'CiudadEscritura')
    ALTER TABLE BienesContrato ADD CiudadEscritura VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'FechaEscritura')
    ALTER TABLE BienesContrato ADD FechaEscritura DATE NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'ActoJuridico')
    ALTER TABLE BienesContrato ADD ActoJuridico VARCHAR(100) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'FechaRegistro')
    ALTER TABLE BienesContrato ADD FechaRegistro DATE NULL;
GO

-- ========================================
-- SECCIÓN 6: IMPUESTOS Y ESTADO FINANCIERO
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'ImpuestoPredialAlDia')
    ALTER TABLE BienesContrato ADD ImpuestoPredialAlDia BIT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'ValorImpuestoPredial')
    ALTER TABLE BienesContrato ADD ValorImpuestoPredial DECIMAL(18, 2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'AniosPredialPendientes')
    ALTER TABLE BienesContrato ADD AniosPredialPendientes VARCHAR(200) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'TieneValorizacion')
    ALTER TABLE BienesContrato ADD TieneValorizacion BIT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'ValorValorizacion')
    ALTER TABLE BienesContrato ADD ValorValorizacion DECIMAL(18, 2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'ValorizacionAlDia')
    ALTER TABLE BienesContrato ADD ValorizacionAlDia BIT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'ValorAdministracion')
    ALTER TABLE BienesContrato ADD ValorAdministracion DECIMAL(18, 2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'AdministracionAlDia')
    ALTER TABLE BienesContrato ADD AdministracionAlDia BIT NULL DEFAULT 0;
GO

-- ========================================
-- SECCIÓN 7: GASTOS DE COMPRAVENTA
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'QuienPagaEscritura')
    ALTER TABLE BienesContrato ADD QuienPagaEscritura VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'QuienPagaRegistro')
    ALTER TABLE BienesContrato ADD QuienPagaRegistro VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'QuienPagaDerechosNotariales')
    ALTER TABLE BienesContrato ADD QuienPagaDerechosNotariales VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'QuienPagaImpuestoRegistro')
    ALTER TABLE BienesContrato ADD QuienPagaImpuestoRegistro VARCHAR(50) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'QuienPagaBeneficencia')
    ALTER TABLE BienesContrato ADD QuienPagaBeneficencia VARCHAR(50) NULL;
GO

-- ========================================
-- SECCIÓN 8: RETENCIÓN EN LA FUENTE
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'AplicaRetencionFuente')
    ALTER TABLE BienesContrato ADD AplicaRetencionFuente BIT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'PorcentajeRetencion')
    ALTER TABLE BienesContrato ADD PorcentajeRetencion DECIMAL(5, 2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'BaseRetencion')
    ALTER TABLE BienesContrato ADD BaseRetencion DECIMAL(18, 2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'ValorRetencion')
    ALTER TABLE BienesContrato ADD ValorRetencion DECIMAL(18, 2) NULL;
GO

-- ========================================
-- SECCIÓN 9: CARACTERÍSTICAS ADICIONALES
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'NumeroHabitaciones')
    ALTER TABLE BienesContrato ADD NumeroHabitaciones INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'NumeroBanos')
    ALTER TABLE BienesContrato ADD NumeroBanos INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'Estrato')
    ALTER TABLE BienesContrato ADD Estrato INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'AntiguedadInmueble')
    ALTER TABLE BienesContrato ADD AntiguedadInmueble INT NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'EstadoInmueble')
    ALTER TABLE BienesContrato ADD EstadoInmueble VARCHAR(50) NULL;
GO

-- ========================================
-- SECCIÓN 10: RESTRICCIONES Y GRAVÁMENES
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'TieneHipoteca')
    ALTER TABLE BienesContrato ADD TieneHipoteca BIT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'EntidadHipoteca')
    ALTER TABLE BienesContrato ADD EntidadHipoteca VARCHAR(200) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'SaldoHipoteca')
    ALTER TABLE BienesContrato ADD SaldoHipoteca DECIMAL(18, 2) NULL;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'TieneEmbargosInmueble')
    ALTER TABLE BienesContrato ADD TieneEmbargosInmueble BIT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'TieneLimitacionesDominio')
    ALTER TABLE BienesContrato ADD TieneLimitacionesDominio BIT NULL DEFAULT 0;

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('BienesContrato') AND name = 'DescripcionLimitaciones')
    ALTER TABLE BienesContrato ADD DescripcionLimitaciones TEXT NULL;
GO

-- ========================================
-- RESTRICCIONES CHECK
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_BienesContrato_TipoInmueble')
BEGIN
    ALTER TABLE BienesContrato ADD CONSTRAINT CK_BienesContrato_TipoInmueble 
        CHECK (TipoInmueble IN ('Casa', 'Apartamento', 'Lote', 'Local Comercial', 'Oficina', 'Bodega', 'Finca', 'Parqueadero', 'Otro', NULL));
END
GO

IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_BienesContrato_ActoJuridico')
BEGIN
    ALTER TABLE BienesContrato ADD CONSTRAINT CK_BienesContrato_ActoJuridico 
        CHECK (ActoJuridico IN ('Compraventa', 'Sucesion', 'Donacion', 'Adjudicacion', 'Permuta', 'Dacion en Pago', 'Otro', NULL));
END
GO

IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_BienesContrato_QuienPaga')
BEGIN
    ALTER TABLE BienesContrato ADD CONSTRAINT CK_BienesContrato_QuienPaga 
        CHECK (
            (QuienPagaEscritura IN ('Vendedor', 'Comprador', 'Mitad', NULL)) AND
            (QuienPagaRegistro IN ('Vendedor', 'Comprador', 'Mitad', NULL)) AND
            (QuienPagaDerechosNotariales IN ('Vendedor', 'Comprador', 'Mitad', NULL)) AND
            (QuienPagaImpuestoRegistro IN ('Vendedor', 'Comprador', 'Mitad', NULL)) AND
            (QuienPagaBeneficencia IN ('Vendedor', 'Comprador', 'Mitad', NULL))
        );
END
GO

IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_BienesContrato_EstadoInmueble')
BEGIN
    ALTER TABLE BienesContrato ADD CONSTRAINT CK_BienesContrato_EstadoInmueble 
        CHECK (EstadoInmueble IN ('Nuevo', 'Usado', 'Remodelado', 'En Construccion', 'A Remodelar', NULL));
END
GO

-- ========================================
-- ÍNDICES PARA BÚSQUEDAS
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_BienesContrato_MatriculaInmobiliaria' AND object_id = OBJECT_ID('BienesContrato'))
    CREATE INDEX IX_BienesContrato_MatriculaInmobiliaria ON BienesContrato(MatriculaInmobiliaria);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_BienesContrato_CedulaCatastral' AND object_id = OBJECT_ID('BienesContrato'))
    CREATE INDEX IX_BienesContrato_CedulaCatastral ON BienesContrato(CedulaCatastral);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_BienesContrato_Municipio' AND object_id = OBJECT_ID('BienesContrato'))
    CREATE INDEX IX_BienesContrato_Municipio ON BienesContrato(Municipio);
GO

PRINT '✅ Migración completada: Campos detallados de propiedades/inmuebles agregados a BienesContrato';
GO
