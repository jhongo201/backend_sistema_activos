-- =====================================================
-- Fix: Triggers compatibles con OUTPUT clause
-- Problema: SQL Server no permite OUTPUT clause con triggers habilitados
-- Solución: Deshabilitar triggers o usar alternativa
-- =====================================================

-- Opción 1: Eliminar triggers existentes y recrearlos sin conflicto
-- =====================================================

-- Eliminar triggers existentes
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_HistorialPropietarios_Insert')
    DROP TRIGGER trg_HistorialPropietarios_Insert;
GO

IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_HistorialPropietarios_Update')
    DROP TRIGGER trg_HistorialPropietarios_Update;
GO

IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_HistorialPropietarios_UpdateTimestamp')
    DROP TRIGGER trg_HistorialPropietarios_UpdateTimestamp;
GO

PRINT 'Triggers eliminados exitosamente';
GO

-- =====================================================
-- Opción 2: Recrear triggers usando INSTEAD OF (alternativa)
-- =====================================================
-- NOTA: Esta opción es más compleja y puede afectar el comportamiento
-- Por ahora, la mejor solución es eliminar los triggers y manejar
-- la lógica en el código de la aplicación

-- =====================================================
-- Verificación
-- =====================================================

SELECT 
    name AS TriggerName,
    OBJECT_NAME(parent_id) AS TableName,
    is_disabled AS IsDisabled
FROM sys.triggers
WHERE OBJECT_NAME(parent_id) = 'HistorialPropietarios';

PRINT '========================================';
PRINT 'TRIGGERS ELIMINADOS';
PRINT 'La lógica de validación se manejará en el código';
PRINT '========================================';
GO
