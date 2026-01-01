-- =============================================
-- Migración: Agregar campos detallados de las partes del contrato
-- Descripción: Agrega tipo documento, estado civil, departamento y ciudad para vendedor y comprador
-- Fecha: 29 de Diciembre de 2025
-- =============================================

USE SistemaActivos;
GO

-- ========================================
-- SECCIÓN 1: CAMPOS DEL VENDEDOR/ARRENDADOR
-- ========================================

-- Tipo de documento del vendedor
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Contratos') AND name = 'VendedorTipoDocumento')
    ALTER TABLE Contratos ADD VendedorTipoDocumento VARCHAR(20) NULL;
GO

-- Estado civil del vendedor
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Contratos') AND name = 'VendedorEstadoCivil')
    ALTER TABLE Contratos ADD VendedorEstadoCivil VARCHAR(50) NULL;
GO

-- Departamento del vendedor (ID de API Colombia)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Contratos') AND name = 'VendedorDepartamento')
    ALTER TABLE Contratos ADD VendedorDepartamento VARCHAR(10) NULL;
GO

-- Ciudad del vendedor
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Contratos') AND name = 'VendedorCiudad')
    ALTER TABLE Contratos ADD VendedorCiudad VARCHAR(100) NULL;
GO

-- Email del vendedor (ya existe pero verificamos)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Contratos') AND name = 'VendedorEmail')
    ALTER TABLE Contratos ADD VendedorEmail VARCHAR(255) NULL;
GO

-- ========================================
-- SECCIÓN 2: CAMPOS DEL COMPRADOR/ARRENDATARIO
-- ========================================

-- Tipo de documento del comprador
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Contratos') AND name = 'CompradorTipoDocumento')
    ALTER TABLE Contratos ADD CompradorTipoDocumento VARCHAR(20) NULL;
GO

-- Estado civil del comprador
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Contratos') AND name = 'CompradorEstadoCivil')
    ALTER TABLE Contratos ADD CompradorEstadoCivil VARCHAR(50) NULL;
GO

-- Departamento del comprador (ID de API Colombia)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Contratos') AND name = 'CompradorDepartamento')
    ALTER TABLE Contratos ADD CompradorDepartamento VARCHAR(10) NULL;
GO

-- Ciudad del comprador
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Contratos') AND name = 'CompradorCiudad')
    ALTER TABLE Contratos ADD CompradorCiudad VARCHAR(100) NULL;
GO

-- Email del comprador (ya existe pero verificamos)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Contratos') AND name = 'CompradorEmail')
    ALTER TABLE Contratos ADD CompradorEmail VARCHAR(255) NULL;
GO

-- ========================================
-- SECCIÓN 3: RESTRICCIONES CHECK
-- ========================================

-- Restricción para tipos de documento válidos
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_Contratos_TipoDocumento')
BEGIN
    ALTER TABLE Contratos ADD CONSTRAINT CK_Contratos_TipoDocumento 
        CHECK (
            (VendedorTipoDocumento IN ('CC', 'CE', 'NIT', 'Pasaporte', 'TI', NULL)) AND
            (CompradorTipoDocumento IN ('CC', 'CE', 'NIT', 'Pasaporte', 'TI', NULL))
        );
END
GO

-- Restricción para estados civiles válidos
IF NOT EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_Contratos_EstadoCivil')
BEGIN
    ALTER TABLE Contratos ADD CONSTRAINT CK_Contratos_EstadoCivil 
        CHECK (
            (VendedorEstadoCivil IN ('Soltero(a)', 'Casado(a)', 'Unión Libre', 'Divorciado(a)', 'Viudo(a)', NULL)) AND
            (CompradorEstadoCivil IN ('Soltero(a)', 'Casado(a)', 'Unión Libre', 'Divorciado(a)', 'Viudo(a)', NULL))
        );
END
GO

-- ========================================
-- SECCIÓN 4: ACTUALIZAR MODALIDADES PERMITIDAS
-- ========================================

-- Eliminar restricción antigua de ModalidadContrato si existe
IF EXISTS (SELECT * FROM sys.check_constraints WHERE name = 'CK_Contratos_ModalidadContrato')
BEGIN
    ALTER TABLE Contratos DROP CONSTRAINT CK_Contratos_ModalidadContrato;
END
GO

-- Agregar nueva restricción con todas las modalidades
ALTER TABLE Contratos ADD CONSTRAINT CK_Contratos_ModalidadContrato 
    CHECK (ModalidadContrato IN (
        'Compraventa',
        'Permuta',
        'Permuta con Saldo',
        'Arrendamiento',
        'Comodato',
        'Cesión de Derechos',
        'Dación en Pago',
        'Promesa',
        'Transacción',
        'Contrato Mixto',
        'Personalizado',
        'Otro',
        NULL
    ));
GO

-- ========================================
-- SECCIÓN 5: VALORES POR DEFECTO PARA REGISTROS EXISTENTES
-- ========================================

-- Actualizar registros existentes con valores por defecto
UPDATE Contratos 
SET 
    VendedorTipoDocumento = 'CC',
    VendedorEstadoCivil = 'Soltero(a)',
    VendedorDepartamento = '0',
    VendedorCiudad = 'No especificado',
    CompradorTipoDocumento = 'CC',
    CompradorEstadoCivil = 'Soltero(a)',
    CompradorDepartamento = '0',
    CompradorCiudad = 'No especificado'
WHERE 
    VendedorTipoDocumento IS NULL 
    OR CompradorTipoDocumento IS NULL;
GO

-- ========================================
-- SECCIÓN 6: ÍNDICES PARA BÚSQUEDAS
-- ========================================

-- Índice para búsqueda por ciudad del vendedor
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Contratos_VendedorCiudad' AND object_id = OBJECT_ID('Contratos'))
    CREATE INDEX IX_Contratos_VendedorCiudad ON Contratos(VendedorCiudad);
GO

-- Índice para búsqueda por ciudad del comprador
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Contratos_CompradorCiudad' AND object_id = OBJECT_ID('Contratos'))
    CREATE INDEX IX_Contratos_CompradorCiudad ON Contratos(CompradorCiudad);
GO

PRINT '✅ Migración completada: Campos detallados de las partes agregados a Contratos';
GO
