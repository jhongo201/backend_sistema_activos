-- =====================================================
-- EJEMPLOS DE INSERT - Historial de Propietarios
-- =====================================================
-- Estos son ejemplos para probar el sistema de historial de propietarios
-- Ajusta los VehiculoID según los vehículos que tengas en tu base de datos

-- =====================================================
-- ESCENARIO 1: Compré un vehículo usado
-- =====================================================

-- Paso 1: Registrar el propietario anterior (de quien compré)
INSERT INTO [dbo].[HistorialPropietarios] (
    [VehiculoID],
    [TipoPropietario],
    [NombrePropietario],
    [TipoDocumento],
    [NumeroDocumento],
    [Telefono],
    [Email],
    [Direccion],
    [Ciudad],
    [FechaAdquisicion],
    [ValorCompra],
    [TraspasoRealizado],
    [EsPropietarioActual],
    [Observaciones],
    [UsuarioRegistro]
) VALUES (
    1,                                  -- VehiculoID (ajusta según tu BD)
    'Anterior',                         -- Era el propietario anterior
    'Juan Pérez García',                -- Nombre del vendedor
    'CC',                               -- Tipo de documento
    '123456789',                        -- Cédula
    '3001234567',                       -- Teléfono
    'juan.perez@example.com',           -- Email
    'Calle 123 #45-67',                 -- Dirección
    'Cúcuta',                           -- Ciudad
    '2023-01-15',                       -- Fecha en que él lo compró
    40000000.00,                        -- Valor al que él lo compró
    0,                                  -- No es relevante para propietario anterior
    0,                                  -- NO es el propietario actual
    'Vehículo en buen estado, mantenimiento al día',
    1                                   -- ID del usuario que registra (ajusta según tu BD)
);

-- Paso 2: Registrarme como propietario actual
INSERT INTO [dbo].[HistorialPropietarios] (
    [VehiculoID],
    [TipoPropietario],
    [NombrePropietario],
    [TipoDocumento],
    [NumeroDocumento],
    [Telefono],
    [Email],
    [Direccion],
    [Ciudad],
    [FechaAdquisicion],
    [ValorCompra],
    [TraspasoRealizado],
    [FechaTraspaso],
    [NumeroTraspaso],
    [OrganismoTransito],
    [EsPropietarioActual],
    [Observaciones],
    [UsuarioRegistro]
) VALUES (
    1,                                  -- Mismo VehiculoID
    'Actual',                           -- Soy el propietario actual
    'Mi Nombre Completo',               -- Tu nombre
    'CC',                               -- Tipo de documento
    '987654321',                        -- Tu cédula
    '3009876543',                       -- Tu teléfono
    'yo@example.com',                   -- Tu email
    'Avenida 456 #78-90',               -- Tu dirección
    'Cúcuta',                           -- Tu ciudad
    '2023-01-15',                       -- Fecha en que lo compraste
    45000000.00,                        -- Valor que pagaste
    1,                                  -- SÍ, ya hice el traspaso
    '2023-02-01',                       -- Fecha del traspaso
    'TR-2023-001234',                   -- Número de traspaso
    'Tránsito Municipal de Cúcuta',     -- Organismo de tránsito
    1,                                  -- SÍ es el propietario actual
    'Comprado directamente del propietario anterior, traspaso realizado',
    1                                   -- ID del usuario que registra
);

-- Actualizar la referencia en la tabla Vehiculos
UPDATE [dbo].[Vehiculos]
SET [PropietarioActualID] = SCOPE_IDENTITY()  -- ID del último INSERT
WHERE [VehiculoID] = 1;

GO

-- =====================================================
-- ESCENARIO 2: Compré un vehículo pero AÚN NO hice el traspaso
-- =====================================================

-- Propietario anterior
INSERT INTO [dbo].[HistorialPropietarios] (
    [VehiculoID],
    [TipoPropietario],
    [NombrePropietario],
    [NumeroDocumento],
    [Telefono],
    [Ciudad],
    [FechaAdquisicion],
    [ValorCompra],
    [EsPropietarioActual],
    [Observaciones]
) VALUES (
    2,                                  -- VehiculoID diferente
    'Anterior',
    'María López Rodríguez',
    '555666777',
    '3005556677',
    'Bogotá',
    '2022-06-10',
    35000000.00,
    0,
    'Propietaria anterior, vendió por viaje'
);

-- Yo como propietario actual (SIN traspaso aún)
INSERT INTO [dbo].[HistorialPropietarios] (
    [VehiculoID],
    [TipoPropietario],
    [NombrePropietario],
    [NumeroDocumento],
    [Telefono],
    [Ciudad],
    [FechaAdquisicion],
    [ValorCompra],
    [TraspasoRealizado],              -- IMPORTANTE: FALSE
    [EsPropietarioActual],
    [Observaciones]
) VALUES (
    2,
    'Actual',
    'Mi Nombre Completo',
    '987654321',
    '3009876543',
    'Cúcuta',
    '2024-01-20',
    38000000.00,
    0,                                  -- NO he hecho el traspaso
    1,                                  -- Pero SÍ soy el propietario actual
    'Pendiente realizar traspaso en tránsito'
);

UPDATE [dbo].[Vehiculos]
SET [PropietarioActualID] = SCOPE_IDENTITY()
WHERE [VehiculoID] = 2;

GO

-- =====================================================
-- ESCENARIO 3: Vendí un vehículo
-- =====================================================

-- Primero debe existir el registro de cuando YO era el propietario actual
-- (asumiendo que ya existe del escenario anterior)

-- Actualizar mi registro para marcar que ya NO soy el propietario actual
UPDATE [dbo].[HistorialPropietarios]
SET [EsPropietarioActual] = 0,
    [FechaVenta] = '2024-12-15',
    [ValorVenta] = 55000000.00
WHERE [VehiculoID] = 1 
  AND [TipoPropietario] = 'Actual'
  AND [NumeroDocumento] = '987654321';

-- Registrar el nuevo propietario (comprador)
INSERT INTO [dbo].[HistorialPropietarios] (
    [VehiculoID],
    [TipoPropietario],
    [NombrePropietario],
    [TipoDocumento],
    [NumeroDocumento],
    [Telefono],
    [Email],
    [Direccion],
    [Ciudad],
    [FechaAdquisicion],
    [ValorCompra],
    [ContratoID],                       -- Si hay contrato asociado
    [TraspasoRealizado],
    [EsPropietarioActual],
    [Observaciones]
) VALUES (
    1,
    'Nuevo',                            -- Es el nuevo propietario
    'Carlos Ramírez Sánchez',           -- Nombre del comprador
    'CC',
    '888999000',
    '3008889990',
    'carlos.ramirez@example.com',
    'Carrera 789 #12-34',
    'Medellín',
    '2024-12-15',                       -- Fecha de la venta
    55000000.00,                        -- Valor de venta
    NULL,                               -- ContratoID si existe
    0,                                  -- Él aún no ha hecho el traspaso
    1,                                  -- Ahora ÉL es el propietario actual
    'Venta con contrato de compraventa'
);

-- Actualizar la referencia en Vehiculos
UPDATE [dbo].[Vehiculos]
SET [PropietarioActualID] = SCOPE_IDENTITY()
WHERE [VehiculoID] = 1;

GO

-- =====================================================
-- ESCENARIO 4: Actualizar traspaso después de haberlo hecho
-- =====================================================

-- Si ya registraste el propietario actual pero sin traspaso,
-- y luego lo hiciste, actualiza así:

UPDATE [dbo].[HistorialPropietarios]
SET [TraspasoRealizado] = 1,
    [FechaTraspaso] = '2024-02-15',
    [NumeroTraspaso] = 'TR-2024-005678',
    [OrganismoTransito] = 'Tránsito Municipal de Cúcuta',
    [Observaciones] = 'Traspaso realizado exitosamente'
WHERE [VehiculoID] = 2 
  AND [EsPropietarioActual] = 1;

GO

-- =====================================================
-- CONSULTAS ÚTILES PARA VERIFICAR
-- =====================================================

-- Ver historial completo de un vehículo
SELECT 
    h.[HistorialID],
    h.[TipoPropietario],
    h.[NombrePropietario],
    h.[NumeroDocumento],
    h.[FechaAdquisicion],
    h.[ValorCompra],
    h.[FechaVenta],
    h.[ValorVenta],
    h.[TraspasoRealizado],
    h.[FechaTraspaso],
    h.[EsPropietarioActual],
    h.[Observaciones]
FROM [dbo].[HistorialPropietarios] h
WHERE h.[VehiculoID] = 1
ORDER BY h.[FechaAdquisicion];

GO

-- Ver propietario actual de cada vehículo
SELECT 
    v.[VehiculoID],
    v.[Placa],
    v.[Marca],
    v.[Modelo],
    h.[NombrePropietario] AS PropietarioActual,
    h.[NumeroDocumento],
    h.[TraspasoRealizado],
    h.[FechaTraspaso],
    h.[FechaAdquisicion]
FROM [dbo].[Vehiculos] v
LEFT JOIN [dbo].[HistorialPropietarios] h 
    ON v.[VehiculoID] = h.[VehiculoID] 
    AND h.[EsPropietarioActual] = 1
ORDER BY v.[VehiculoID];

GO

-- Ver vehículos sin traspaso realizado
SELECT 
    v.[VehiculoID],
    v.[Placa],
    v.[Marca],
    v.[Modelo],
    h.[NombrePropietario],
    h.[FechaAdquisicion],
    DATEDIFF(DAY, h.[FechaAdquisicion], GETDATE()) AS DiasSinTraspaso
FROM [dbo].[Vehiculos] v
INNER JOIN [dbo].[HistorialPropietarios] h 
    ON v.[VehiculoID] = h.[VehiculoID]
WHERE h.[EsPropietarioActual] = 1 
  AND h.[TraspasoRealizado] = 0
ORDER BY h.[FechaAdquisicion];

GO

-- Ver historial de ventas (vehículos que vendí)
SELECT 
    v.[Placa],
    v.[Marca],
    v.[Modelo],
    h.[NombrePropietario] AS Comprador,
    h.[NumeroDocumento],
    h.[FechaAdquisicion] AS FechaVenta,
    h.[ValorCompra] AS ValorVenta,
    h.[Ciudad],
    h.[Telefono]
FROM [dbo].[HistorialPropietarios] h
INNER JOIN [dbo].[Vehiculos] v ON h.[VehiculoID] = v.[VehiculoID]
WHERE h.[TipoPropietario] = 'Nuevo'
ORDER BY h.[FechaAdquisicion] DESC;

GO

-- Ver ganancia/pérdida por vehículo vendido
SELECT 
    v.[Placa],
    v.[Marca],
    v.[Modelo],
    hCompra.[ValorCompra] AS CompréEn,
    hVenta.[ValorCompra] AS VendíEn,
    (hVenta.[ValorCompra] - hCompra.[ValorCompra]) AS Ganancia,
    hCompra.[FechaAdquisicion] AS FechaCompra,
    hVenta.[FechaAdquisicion] AS FechaVenta,
    DATEDIFF(MONTH, hCompra.[FechaAdquisicion], hVenta.[FechaAdquisicion]) AS MesesPosesion
FROM [dbo].[Vehiculos] v
INNER JOIN [dbo].[HistorialPropietarios] hCompra 
    ON v.[VehiculoID] = hCompra.[VehiculoID] 
    AND hCompra.[TipoPropietario] = 'Actual'
INNER JOIN [dbo].[HistorialPropietarios] hVenta 
    ON v.[VehiculoID] = hVenta.[VehiculoID] 
    AND hVenta.[TipoPropietario] = 'Nuevo'
WHERE hCompra.[ValorCompra] IS NOT NULL 
  AND hVenta.[ValorCompra] IS NOT NULL;

GO
