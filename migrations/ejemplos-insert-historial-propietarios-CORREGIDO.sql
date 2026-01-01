-- =====================================================
-- EJEMPLOS DE INSERT - Historial de Propietarios (CORREGIDO)
-- =====================================================
-- Usando UsuarioID = 7 (Administrador del Sistema)
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
    7                                   -- UsuarioID = 7 (CORREGIDO)
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
    'Administrador del Sistema',        -- Tu nombre (del usuario 7)
    'CC',                               -- Tipo de documento
    '987654321',                        -- Tu cédula
    '3009876543',                       -- Tu teléfono
    'admin@sistema.com',                -- Tu email
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
    7                                   -- UsuarioID = 7 (CORREGIDO)
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
    [Observaciones],
    [UsuarioRegistro]
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
    'Propietaria anterior, vendió por viaje',
    7                                   -- UsuarioID = 7 (CORREGIDO)
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
    [TraspasoRealizado],
    [EsPropietarioActual],
    [Observaciones],
    [UsuarioRegistro]
) VALUES (
    2,
    'Actual',
    'Administrador del Sistema',
    '987654321',
    '3009876543',
    'Cúcuta',
    '2024-01-20',
    38000000.00,
    0,                                  -- NO he hecho el traspaso
    1,                                  -- Pero SÍ soy el propietario actual
    'Pendiente realizar traspaso en tránsito',
    7                                   -- UsuarioID = 7 (CORREGIDO)
);

UPDATE [dbo].[Vehiculos]
SET [PropietarioActualID] = SCOPE_IDENTITY()
WHERE [VehiculoID] = 2;

GO

-- =====================================================
-- ESCENARIO 3: Vendí un vehículo
-- =====================================================

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
    [ContratoID],
    [TraspasoRealizado],
    [EsPropietarioActual],
    [Observaciones],
    [UsuarioRegistro]
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
    'Venta con contrato de compraventa',
    7                                   -- UsuarioID = 7 (CORREGIDO)
);

-- Actualizar la referencia en Vehiculos
UPDATE [dbo].[Vehiculos]
SET [PropietarioActualID] = SCOPE_IDENTITY()
WHERE [VehiculoID] = 1;

GO

-- =====================================================
-- VERSIÓN SIMPLE SIN UsuarioRegistro (OPCIONAL)
-- =====================================================
-- Si prefieres no usar UsuarioRegistro, puedes usar NULL

INSERT INTO [dbo].[HistorialPropietarios] (
    [VehiculoID],
    [TipoPropietario],
    [NombrePropietario],
    [NumeroDocumento],
    [FechaAdquisicion],
    [ValorCompra],
    [EsPropietarioActual],
    [UsuarioRegistro]  -- NULL es válido
) VALUES (
    3,
    'Anterior',
    'Pedro González',
    '111222333',
    '2022-03-10',
    30000000.00,
    0,
    NULL  -- Sin usuario registrador
);

GO

-- =====================================================
-- CONSULTAS ÚTILES PARA VERIFICAR
-- =====================================================

-- Ver todos los registros insertados
SELECT 
    h.[HistorialID],
    h.[VehiculoID],
    h.[TipoPropietario],
    h.[NombrePropietario],
    h.[NumeroDocumento],
    h.[FechaAdquisicion],
    h.[ValorCompra],
    h.[TraspasoRealizado],
    h.[EsPropietarioActual],
    u.[Nombre] AS UsuarioQueRegistro
FROM [dbo].[HistorialPropietarios] h
LEFT JOIN [dbo].[Usuarios] u ON h.[UsuarioRegistro] = u.[UsuarioID]
ORDER BY h.[VehiculoID], h.[FechaAdquisicion];

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

-- Ver historial completo de un vehículo específico
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
WHERE h.[VehiculoID] = 1  -- Cambia el ID según necesites
ORDER BY h.[FechaAdquisicion];

GO
