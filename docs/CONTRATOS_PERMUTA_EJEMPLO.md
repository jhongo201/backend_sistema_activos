# 📋 Guía de Uso: Contratos con Permuta

## Descripción General

El sistema ahora soporta tres modalidades de contratos:

1. **Compraventa** (existente): Venta directa con pago en dinero
2. **Permuta**: Intercambio de bienes sin dinero
3. **Permuta con Saldo**: Intercambio de bienes + pago de diferencia

---

## 🔧 Estructura de Datos

### Ejemplo 1: Compraventa Simple (Sin cambios)

```json
POST /api/contratos
{
  "TipoContrato": "Compraventa Vehiculo",
  "ModalidadContrato": "Compraventa",
  "VendedorNombre": "Juan Pérez",
  "VendedorDocumento": "123456789",
  "VendedorDireccion": "Calle 10 #20-30",
  "CompradorNombre": "María López",
  "CompradorDocumento": "987654321",
  "CompradorDireccion": "Carrera 5 #15-25",
  "ValorContrato": 50000000,
  "FormaPago": "Efectivo",
  "FechaContrato": "2025-12-28",
  "Clausulas": ["PRIMERA - ...", "SEGUNDA - ..."]
}
```

---

### Ejemplo 2: Permuta Pura (Sin dinero)

**Caso:** Juan cambia su Mazda 3 ($50M) por la moto de María ($50M)

```json
POST /api/contratos
{
  "TipoContrato": "Permuta Vehicular",
  "ModalidadContrato": "Permuta",
  "VendedorNombre": "Juan Pérez",
  "VendedorDocumento": "123456789",
  "VendedorDireccion": "Calle 10 #20-30",
  "CompradorNombre": "María López",
  "CompradorDocumento": "987654321",
  "CompradorDireccion": "Carrera 5 #15-25",
  "ValorContrato": 50000000,
  "FormaPago": "Permuta",
  "FechaContrato": "2025-12-28",
  "Clausulas": ["PRIMERA - ...", "SEGUNDA - ..."],
  "bienes": [
    {
      "TipoBien": "Vehiculo",
      "Rol": "Entrega",
      "Parte": "Vendedor",
      "VehiculoID": 5,
      "DescripcionBien": "Mazda 3 2020",
      "ValorComercial": 50000000,
      "Marca": "Mazda",
      "Modelo": "3",
      "Año": 2020,
      "Placa": "ABC123"
    },
    {
      "TipoBien": "Moto",
      "Rol": "Recibe",
      "Parte": "Vendedor",
      "DescripcionBien": "Yamaha R1 2022",
      "ValorComercial": 50000000,
      "Marca": "Yamaha",
      "Modelo": "R1",
      "Año": 2022,
      "Placa": "XYZ789"
    }
  ]
}
```

**Resultado:**
- `ValorTotalEntrega`: 50,000,000
- `ValorTotalRecibe`: 50,000,000
- `DiferenciaValor`: 0
- `QuienPagaDiferencia`: null

---

### Ejemplo 3: Permuta con Saldo a Favor

**Caso:** Juan entrega su Mazda 3 ($50M) y RECIBE una Toyota Prado ($70M) + paga $20M

```json
POST /api/contratos
{
  "TipoContrato": "Permuta con Saldo",
  "ModalidadContrato": "Permuta con Saldo",
  "VendedorNombre": "Juan Pérez",
  "VendedorDocumento": "123456789",
  "CompradorNombre": "María López",
  "CompradorDocumento": "987654321",
  "ValorContrato": 70000000,
  "FormaPago": "Mixto",
  "DiferenciaValor": 20000000,
  "FechaContrato": "2025-12-28",
  "bienes": [
    {
      "TipoBien": "Vehiculo",
      "Rol": "Entrega",
      "Parte": "Vendedor",
      "VehiculoID": 5,
      "DescripcionBien": "Mazda 3 2020",
      "ValorComercial": 50000000,
      "Marca": "Mazda",
      "Modelo": "3",
      "Año": 2020,
      "Placa": "ABC123"
    },
    {
      "TipoBien": "Vehiculo",
      "Rol": "Recibe",
      "Parte": "Vendedor",
      "VehiculoID": 8,
      "DescripcionBien": "Toyota Prado 2022",
      "ValorComercial": 70000000,
      "Marca": "Toyota",
      "Modelo": "Prado",
      "Año": 2022,
      "Placa": "DEF456"
    }
  ]
}
```

**Resultado:**
- `ValorTotalEntrega`: 50,000,000
- `ValorTotalRecibe`: 70,000,000
- `DiferenciaValor`: 20,000,000
- `QuienPagaDiferencia`: "Vendedor" (Juan debe pagar $20M)

---

### Ejemplo 4: Permuta Múltiple

**Caso:** Juan entrega 2 carros + 1 moto por 1 propiedad

```json
POST /api/contratos
{
  "TipoContrato": "Permuta Mixta",
  "ModalidadContrato": "Permuta",
  "VendedorNombre": "Juan Pérez",
  "VendedorDocumento": "123456789",
  "CompradorNombre": "María López",
  "CompradorDocumento": "987654321",
  "ValorContrato": 150000000,
  "FormaPago": "Permuta",
  "FechaContrato": "2025-12-28",
  "bienes": [
    {
      "TipoBien": "Vehiculo",
      "Rol": "Entrega",
      "Parte": "Vendedor",
      "DescripcionBien": "Mazda 3 2020",
      "ValorComercial": 50000000
    },
    {
      "TipoBien": "Vehiculo",
      "Rol": "Entrega",
      "Parte": "Vendedor",
      "DescripcionBien": "Chevrolet Spark 2018",
      "ValorComercial": 30000000
    },
    {
      "TipoBien": "Moto",
      "Rol": "Entrega",
      "Parte": "Vendedor",
      "DescripcionBien": "Yamaha R1 2022",
      "ValorComercial": 70000000
    },
    {
      "TipoBien": "Propiedad",
      "Rol": "Recibe",
      "Parte": "Vendedor",
      "PropiedadID": 10,
      "DescripcionBien": "Apartamento Centro",
      "ValorComercial": 150000000,
      "Matricula": "001-12345"
    }
  ]
}
```

---

### Ejemplo 5: Permuta con Bien No Registrado

**Caso:** Cambio carro por oro/joyas

```json
POST /api/contratos
{
  "TipoContrato": "Permuta Diversa",
  "ModalidadContrato": "Permuta",
  "VendedorNombre": "Juan Pérez",
  "VendedorDocumento": "123456789",
  "CompradorNombre": "María López",
  "CompradorDocumento": "987654321",
  "ValorContrato": 50000000,
  "FormaPago": "Permuta",
  "FechaContrato": "2025-12-28",
  "bienes": [
    {
      "TipoBien": "Vehiculo",
      "Rol": "Entrega",
      "Parte": "Vendedor",
      "VehiculoID": 5,
      "DescripcionBien": "Mazda 3 2020",
      "ValorComercial": 50000000
    },
    {
      "TipoBien": "Otro",
      "Rol": "Recibe",
      "Parte": "Vendedor",
      "DescripcionBien": "Oro 24K - 500 gramos",
      "ValorComercial": 50000000,
      "Observaciones": "Certificado de autenticidad incluido"
    }
  ]
}
```

---

## 📊 Campos del Modelo BienContrato

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `TipoBien` | String | 'Vehiculo', 'Propiedad', 'Moto', 'Otro' |
| `Rol` | String | 'Entrega' o 'Recibe' |
| `Parte` | String | 'Vendedor' o 'Comprador' |
| `VehiculoID` | Int | ID del vehículo (si está registrado) |
| `PropiedadID` | Int | ID de la propiedad (si está registrada) |
| `DescripcionBien` | String | Descripción del bien |
| `ValorComercial` | Decimal | Valor comercial del bien |
| `Marca` | String | Marca (opcional) |
| `Modelo` | String | Modelo (opcional) |
| `Año` | Int | Año (opcional) |
| `Placa` | String | Placa (opcional) |
| `Matricula` | String | Matrícula (opcional) |
| `Observaciones` | Text | Observaciones adicionales |

---

## 🔍 Consultar Contrato con Bienes

```http
GET /api/contratos/:id
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "ContratoID": 1,
    "Folio": "CONT-2025-00001",
    "TipoContrato": "Permuta con Saldo",
    "ModalidadContrato": "Permuta con Saldo",
    "ValorContrato": 70000000,
    "ValorTotalEntrega": 50000000,
    "ValorTotalRecibe": 70000000,
    "DiferenciaValor": 20000000,
    "QuienPagaDiferencia": "Vendedor",
    "Bienes": [
      {
        "BienContratoID": 1,
        "TipoBien": "Vehiculo",
        "Rol": "Entrega",
        "Parte": "Vendedor",
        "DescripcionBien": "Mazda 3 2020",
        "ValorComercial": 50000000
      },
      {
        "BienContratoID": 2,
        "TipoBien": "Vehiculo",
        "Rol": "Recibe",
        "Parte": "Vendedor",
        "DescripcionBien": "Toyota Prado 2022",
        "ValorComercial": 70000000
      }
    ]
  }
}
```

---

## ⚠️ Validaciones Automáticas

El sistema calcula automáticamente:

1. **ValorTotalEntrega**: Suma de bienes que entrega el vendedor
2. **ValorTotalRecibe**: Suma de bienes que recibe el vendedor
3. **DiferenciaValor**: |ValorTotalRecibe - ValorTotalEntrega|
4. **QuienPagaDiferencia**: 
   - "Vendedor" si recibe más de lo que entrega
   - "Comprador" si entrega más de lo que recibe
   - null si los valores son iguales

---

## 🗄️ Migración de Base de Datos

Ejecutar el script SQL:

```bash
sqlcmd -S localhost\SQLEXPRESS -d SistemaActivos -i migrations/add_barter_support.sql
```

O desde SQL Server Management Studio, ejecutar:
```
backend/migrations/add_barter_support.sql
```

---

## ✅ Compatibilidad Retroactiva

Los contratos existentes de **Compraventa** siguen funcionando sin cambios. El campo `ModalidadContrato` se establece automáticamente en "Compraventa" para contratos antiguos.
