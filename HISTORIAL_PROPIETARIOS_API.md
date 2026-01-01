# 📚 API de Historial de Propietarios - Documentación

Sistema completo para gestionar el historial de propietarios de vehículos, permitiendo registrar propietarios anteriores, traspasos, y ventas.

---

## 🎯 Casos de Uso

### **Caso 1: Compré un vehículo usado**
1. Registrar propietario anterior
2. Registrar que soy el propietario actual
3. Registrar cuando se haga el traspaso legal

### **Caso 2: Vendí un vehículo**
1. Registrar la venta y el nuevo propietario
2. El sistema automáticamente actualiza el propietario actual

### **Caso 3: Consultar historial**
1. Ver todos los propietarios que ha tenido un vehículo
2. Ver el propietario actual
3. Ver vehículos pendientes de traspaso

---

## 📋 Endpoints Disponibles

### **1. Registrar Propietario Anterior**
```http
POST /api/vehiculos/:id/propietarios/anterior
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombrePropietario": "Juan Pérez García",
  "tipoDocumento": "CC",
  "numeroDocumento": "123456789",
  "telefono": "3001234567",
  "email": "juan@example.com",
  "direccion": "Calle 123 #45-67",
  "ciudad": "Cúcuta",
  "fechaAdquisicion": "2023-01-15",
  "valorCompra": 45000000,
  "observaciones": "Vehículo en buen estado, mantenimiento al día"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Propietario anterior registrado exitosamente",
  "data": {
    "HistorialID": 1,
    "VehiculoID": 5,
    "TipoPropietario": "Anterior",
    "NombrePropietario": "Juan Pérez García",
    "NumeroDocumento": "123456789",
    "EsPropietarioActual": false,
    "FechaRegistro": "2024-12-31T13:00:00.000Z"
  }
}
```

---

### **2. Registrar Propietario Actual (Yo)**
```http
POST /api/vehiculos/:id/propietarios/actual
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombrePropietario": "Mi Nombre Completo",
  "tipoDocumento": "CC",
  "numeroDocumento": "987654321",
  "telefono": "3009876543",
  "email": "yo@example.com",
  "direccion": "Avenida 456 #78-90",
  "ciudad": "Cúcuta",
  "fechaAdquisicion": "2023-01-15",
  "valorCompra": 45000000,
  "traspasoRealizado": false,
  "observaciones": "Comprado directamente del propietario anterior"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Propietario actual registrado exitosamente",
  "data": {
    "HistorialID": 2,
    "VehiculoID": 5,
    "TipoPropietario": "Actual",
    "NombrePropietario": "Mi Nombre Completo",
    "EsPropietarioActual": true,
    "TraspasoRealizado": false
  }
}
```

---

### **3. Registrar Traspaso a Mi Nombre**
```http
POST /api/vehiculos/:id/propietarios/traspaso
Authorization: Bearer {token}
Content-Type: application/json

{
  "fechaTraspaso": "2023-02-01",
  "numeroTraspaso": "TR-2023-001234",
  "organismoTransito": "Tránsito Municipal de Cúcuta",
  "observaciones": "Traspaso realizado sin problemas"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Traspaso registrado exitosamente",
  "data": {
    "HistorialID": 2,
    "TraspasoRealizado": true,
    "FechaTraspaso": "2023-02-01",
    "NumeroTraspaso": "TR-2023-001234",
    "OrganismoTransito": "Tránsito Municipal de Cúcuta"
  }
}
```

---

### **4. Registrar Venta del Vehículo**
```http
POST /api/vehiculos/:id/propietarios/venta
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombrePropietario": "María García López",
  "tipoDocumento": "CC",
  "numeroDocumento": "555666777",
  "telefono": "3005556677",
  "email": "maria@example.com",
  "direccion": "Carrera 789 #12-34",
  "ciudad": "Bogotá",
  "fechaVenta": "2024-12-15",
  "valorVenta": 55000000,
  "contratoID": 123,
  "observaciones": "Venta con contrato de compraventa"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Venta registrada exitosamente",
  "data": {
    "HistorialID": 3,
    "VehiculoID": 5,
    "TipoPropietario": "Nuevo",
    "NombrePropietario": "María García López",
    "FechaAdquisicion": "2024-12-15",
    "ValorCompra": 55000000,
    "EsPropietarioActual": true
  }
}
```

---

### **5. Obtener Historial Completo**
```http
GET /api/vehiculos/:id/propietarios
Authorization: Bearer {token}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "HistorialID": 1,
      "TipoPropietario": "Anterior",
      "NombrePropietario": "Juan Pérez García",
      "NumeroDocumento": "123456789",
      "FechaAdquisicion": "2023-01-15",
      "ValorCompra": 45000000,
      "EsPropietarioActual": false
    },
    {
      "HistorialID": 2,
      "TipoPropietario": "Actual",
      "NombrePropietario": "Mi Nombre Completo",
      "NumeroDocumento": "987654321",
      "FechaAdquisicion": "2023-01-15",
      "TraspasoRealizado": true,
      "FechaTraspaso": "2023-02-01",
      "EsPropietarioActual": false,
      "FechaVenta": "2024-12-15",
      "ValorVenta": 55000000
    },
    {
      "HistorialID": 3,
      "TipoPropietario": "Nuevo",
      "NombrePropietario": "María García López",
      "NumeroDocumento": "555666777",
      "FechaAdquisicion": "2024-12-15",
      "ValorCompra": 55000000,
      "EsPropietarioActual": true,
      "contrato": {
        "ContratoID": 123,
        "Folio": "CTR-2024-123",
        "TipoContrato": "Compraventa"
      }
    }
  ],
  "total": 3
}
```

---

### **6. Obtener Propietario Actual**
```http
GET /api/vehiculos/:id/propietarios/actual
Authorization: Bearer {token}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "HistorialID": 3,
    "VehiculoID": 5,
    "TipoPropietario": "Nuevo",
    "NombrePropietario": "María García López",
    "NumeroDocumento": "555666777",
    "Telefono": "3005556677",
    "Email": "maria@example.com",
    "Ciudad": "Bogotá",
    "FechaAdquisicion": "2024-12-15",
    "ValorCompra": 55000000,
    "TraspasoRealizado": false,
    "EsPropietarioActual": true
  }
}
```

---

### **7. Actualizar Registro de Historial**
```http
PUT /api/vehiculos/:vehiculoId/propietarios/:historialId
Authorization: Bearer {token}
Content-Type: application/json

{
  "telefono": "3001112233",
  "email": "nuevo@example.com",
  "observaciones": "Información actualizada"
}
```

---

### **8. Eliminar Registro de Historial**
```http
DELETE /api/vehiculos/:vehiculoId/propietarios/:historialId
Authorization: Bearer {token}
```

---

### **9. Obtener Vehículos Sin Traspaso**
```http
GET /api/vehiculos/sin-traspaso
Authorization: Bearer {token}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "VehiculoID": 5,
      "Placa": "ABC123",
      "Marca": "Toyota",
      "Modelo": 2020,
      "propietarioActual": {
        "HistorialID": 2,
        "NombrePropietario": "Mi Nombre Completo",
        "FechaAdquisicion": "2023-01-15",
        "TraspasoRealizado": false
      }
    }
  ],
  "total": 1
}
```

---

### **10. Obtener Historial de Ventas**
```http
GET /api/historial-ventas?fechaInicio=2024-01-01&fechaFin=2024-12-31&limite=50
Authorization: Bearer {token}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "HistorialID": 3,
      "TipoPropietario": "Nuevo",
      "NombrePropietario": "María García López",
      "FechaAdquisicion": "2024-12-15",
      "ValorCompra": 55000000,
      "vehiculo": {
        "VehiculoID": 5,
        "Placa": "ABC123",
        "Marca": "Toyota",
        "Modelo": 2020
      },
      "contrato": {
        "ContratoID": 123,
        "Folio": "CTR-2024-123"
      }
    }
  ],
  "total": 1
}
```

---

## 🔄 Flujo Completo de Uso

### **Escenario: Compré un vehículo usado**

#### **Paso 1: Registrar propietario anterior**
```bash
curl -X POST http://localhost:3000/api/vehiculos/5/propietarios/anterior \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombrePropietario": "Juan Pérez",
    "numeroDocumento": "123456789",
    "telefono": "3001234567",
    "fechaAdquisicion": "2023-01-15",
    "valorCompra": 45000000
  }'
```

#### **Paso 2: Registrarme como propietario actual**
```bash
curl -X POST http://localhost:3000/api/vehiculos/5/propietarios/actual \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombrePropietario": "Mi Nombre",
    "numeroDocumento": "987654321",
    "telefono": "3009876543",
    "fechaAdquisicion": "2023-01-15",
    "valorCompra": 45000000,
    "traspasoRealizado": false
  }'
```

#### **Paso 3: Cuando haga el traspaso**
```bash
curl -X POST http://localhost:3000/api/vehiculos/5/propietarios/traspaso \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fechaTraspaso": "2023-02-01",
    "numeroTraspaso": "TR-2023-001",
    "organismoTransito": "Tránsito Cúcuta"
  }'
```

---

## 🗄️ Estructura de Base de Datos

### **Tabla: HistorialPropietarios**
```sql
CREATE TABLE HistorialPropietarios (
  HistorialID INT PRIMARY KEY AUTO_INCREMENT,
  VehiculoID INT NOT NULL,
  TipoPropietario ENUM('Anterior', 'Actual', 'Nuevo'),
  NombrePropietario VARCHAR(200),
  NumeroDocumento VARCHAR(50),
  Telefono VARCHAR(20),
  Email VARCHAR(100),
  FechaAdquisicion DATE,
  FechaVenta DATE,
  ValorCompra DECIMAL(18,2),
  ValorVenta DECIMAL(18,2),
  TraspasoRealizado BOOLEAN,
  FechaTraspaso DATE,
  EsPropietarioActual BOOLEAN,
  ContratoID INT,
  FOREIGN KEY (VehiculoID) REFERENCES Vehiculos(VehiculoID),
  FOREIGN KEY (ContratoID) REFERENCES Contratos(ContratoID)
);
```

---

## ✅ Validaciones

### **Campos Requeridos**
- `nombrePropietario`: Máximo 200 caracteres
- `numeroDocumento`: Máximo 50 caracteres
- `fechaVenta`: Requerido al registrar venta
- `fechaTraspaso`: Requerido al registrar traspaso

### **Campos Opcionales**
- `tipoDocumento`: Por defecto "CC"
- `telefono`, `email`, `direccion`, `ciudad`
- `valorCompra`, `valorVenta`
- `observaciones`

---

## 🚨 Códigos de Error

- `400`: Datos inválidos o faltantes
- `404`: Vehículo o historial no encontrado
- `500`: Error interno del servidor

---

## 📊 Reportes Disponibles

1. **Vehículos sin traspaso**: Lista de vehículos que aún no tienen traspaso legal
2. **Historial de ventas**: Todas las ventas realizadas con filtros por fecha
3. **Historial completo por vehículo**: Timeline completo de propietarios

---

## 🔐 Seguridad

- Todas las rutas requieren autenticación con JWT
- El `UsuarioRegistro` se captura automáticamente del token
- Solo usuarios autenticados pueden acceder a los endpoints

---

## 📝 Notas Importantes

1. Solo puede haber **un propietario actual** por vehículo
2. Al registrar una venta, el propietario actual anterior se marca como `EsPropietarioActual: false`
3. El sistema mantiene triggers en la base de datos para garantizar la integridad
4. Los contratos se vinculan automáticamente si se proporciona el `ContratoID`

---

## 🎯 Próximas Mejoras

- [ ] Integración automática con contratos de compraventa
- [ ] Notificaciones de traspasos pendientes
- [ ] Reportes en PDF del historial de propietarios
- [ ] Dashboard con estadísticas de compras/ventas
