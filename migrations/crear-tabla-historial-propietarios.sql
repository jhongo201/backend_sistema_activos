-- =====================================================
-- Migración: Crear tabla HistorialPropietarios
-- Descripción: Sistema completo de historial de propietarios de vehículos
-- Fecha: 2024-12-31
-- =====================================================

-- Crear tabla HistorialPropietarios
CREATE TABLE IF NOT EXISTS HistorialPropietarios (
  HistorialID INT PRIMARY KEY AUTO_INCREMENT,
  VehiculoID INT NOT NULL,
  
  -- Información del propietario
  TipoPropietario ENUM('Anterior', 'Actual', 'Nuevo') NOT NULL COMMENT 'Anterior: propietario previo, Actual: propietario actual (yo), Nuevo: comprador',
  NombrePropietario VARCHAR(200) NOT NULL,
  TipoDocumento VARCHAR(20) DEFAULT 'CC',
  NumeroDocumento VARCHAR(50) NOT NULL,
  Telefono VARCHAR(20),
  Email VARCHAR(100),
  Direccion VARCHAR(200),
  Ciudad VARCHAR(100),
  
  -- Fechas de transacción
  FechaAdquisicion DATE COMMENT 'Fecha en que este propietario adquirió el vehículo',
  FechaVenta DATE COMMENT 'Fecha en que este propietario vendió el vehículo',
  
  -- Información de la transacción
  ValorCompra DECIMAL(18,2) COMMENT 'Valor al que se compró',
  ValorVenta DECIMAL(18,2) COMMENT 'Valor al que se vendió',
  ContratoID INT NULL COMMENT 'Referencia al contrato de compraventa si existe',
  
  -- Información legal del traspaso
  TraspasoRealizado BOOLEAN DEFAULT FALSE COMMENT 'Si el traspaso legal ya se realizó',
  FechaTraspaso DATE COMMENT 'Fecha en que se hizo el traspaso',
  NumeroTraspaso VARCHAR(50) COMMENT 'Número de traspaso del organismo de tránsito',
  OrganismoTransito VARCHAR(100) COMMENT 'Organismo de tránsito donde se hizo el traspaso',
  
  -- Estado
  EsPropietarioActual BOOLEAN DEFAULT FALSE COMMENT 'TRUE si es el propietario actual del vehículo',
  
  -- Observaciones
  Observaciones TEXT,
  
  -- Auditoría
  FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UsuarioRegistro INT,
  
  -- Claves foráneas
  FOREIGN KEY (VehiculoID) REFERENCES Vehiculos(VehiculoID) ON DELETE CASCADE,
  FOREIGN KEY (ContratoID) REFERENCES Contratos(ContratoID) ON DELETE SET NULL,
  FOREIGN KEY (UsuarioRegistro) REFERENCES Usuarios(UsuarioID) ON DELETE SET NULL,
  
  -- Índices para optimizar consultas
  INDEX idx_vehiculo (VehiculoID),
  INDEX idx_propietario_actual (VehiculoID, EsPropietarioActual),
  INDEX idx_documento (NumeroDocumento),
  INDEX idx_tipo_propietario (TipoPropietario),
  INDEX idx_fecha_adquisicion (FechaAdquisicion),
  INDEX idx_fecha_venta (FechaVenta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar campo PropietarioActualID a la tabla Vehiculos para referencia rápida
ALTER TABLE Vehiculos 
ADD COLUMN PropietarioActualID INT NULL COMMENT 'Referencia al propietario actual en HistorialPropietarios',
ADD CONSTRAINT fk_vehiculo_propietario_actual 
  FOREIGN KEY (PropietarioActualID) REFERENCES HistorialPropietarios(HistorialID) ON DELETE SET NULL;

-- Crear índice para PropietarioActualID
CREATE INDEX idx_propietario_actual_id ON Vehiculos(PropietarioActualID);

-- =====================================================
-- Trigger para asegurar que solo haya un propietario actual por vehículo
-- =====================================================
DELIMITER //

CREATE TRIGGER trg_before_insert_historial_propietarios
BEFORE INSERT ON HistorialPropietarios
FOR EACH ROW
BEGIN
  -- Si el nuevo registro es propietario actual, desactivar los demás
  IF NEW.EsPropietarioActual = TRUE THEN
    UPDATE HistorialPropietarios 
    SET EsPropietarioActual = FALSE 
    WHERE VehiculoID = NEW.VehiculoID 
      AND EsPropietarioActual = TRUE;
  END IF;
END//

CREATE TRIGGER trg_before_update_historial_propietarios
BEFORE UPDATE ON HistorialPropietarios
FOR EACH ROW
BEGIN
  -- Si se actualiza a propietario actual, desactivar los demás
  IF NEW.EsPropietarioActual = TRUE AND OLD.EsPropietarioActual = FALSE THEN
    UPDATE HistorialPropietarios 
    SET EsPropietarioActual = FALSE 
    WHERE VehiculoID = NEW.VehiculoID 
      AND HistorialID != NEW.HistorialID
      AND EsPropietarioActual = TRUE;
  END IF;
END//

DELIMITER ;

-- =====================================================
-- Datos de ejemplo (comentados - descomentar si se desea)
-- =====================================================
/*
-- Ejemplo: Registrar propietario anterior de un vehículo
INSERT INTO HistorialPropietarios (
  VehiculoID, TipoPropietario, NombrePropietario, TipoDocumento, 
  NumeroDocumento, Telefono, Ciudad, FechaAdquisicion, ValorCompra,
  EsPropietarioActual, UsuarioRegistro
) VALUES (
  1, 'Anterior', 'Juan Pérez García', 'CC', 
  '123456789', '3001234567', 'Cúcuta', '2023-01-15', 45000000.00,
  FALSE, 1
);

-- Ejemplo: Registrar propietario actual (yo)
INSERT INTO HistorialPropietarios (
  VehiculoID, TipoPropietario, NombrePropietario, TipoDocumento, 
  NumeroDocumento, Telefono, Ciudad, FechaAdquisicion, ValorCompra,
  TraspasoRealizado, FechaTraspaso, NumeroTraspaso, OrganismoTransito,
  EsPropietarioActual, UsuarioRegistro
) VALUES (
  1, 'Actual', 'Mi Nombre', 'CC', 
  '987654321', '3009876543', 'Cúcuta', '2023-01-15', 45000000.00,
  TRUE, '2023-02-01', 'TR-2023-001', 'Tránsito Cúcuta',
  TRUE, 1
);
*/

-- =====================================================
-- Consultas útiles
-- =====================================================

-- Ver historial completo de un vehículo
-- SELECT * FROM HistorialPropietarios WHERE VehiculoID = 1 ORDER BY FechaAdquisicion;

-- Ver propietario actual de un vehículo
-- SELECT * FROM HistorialPropietarios WHERE VehiculoID = 1 AND EsPropietarioActual = TRUE;

-- Ver vehículos sin traspaso realizado
-- SELECT v.*, h.NombrePropietario, h.FechaAdquisicion
-- FROM Vehiculos v
-- JOIN HistorialPropietarios h ON v.VehiculoID = h.VehiculoID
-- WHERE h.EsPropietarioActual = TRUE AND h.TraspasoRealizado = FALSE;

-- Ver historial de ventas
-- SELECT v.Placa, v.Marca, v.Modelo, h.NombrePropietario, h.FechaVenta, h.ValorVenta
-- FROM HistorialPropietarios h
-- JOIN Vehiculos v ON h.VehiculoID = v.VehiculoID
-- WHERE h.TipoPropietario = 'Nuevo'
-- ORDER BY h.FechaVenta DESC;
