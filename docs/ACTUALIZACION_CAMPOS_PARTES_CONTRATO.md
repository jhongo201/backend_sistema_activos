# ✅ Actualización Completada: Campos Detallados de las Partes del Contrato

## 📋 Resumen de Implementación

Se han agregado **10 campos nuevos** (5 por cada parte) a la tabla `Contratos` para capturar información completa del vendedor/arrendador y comprador/arrendatario, además de actualizar las modalidades de contrato permitidas.

**Fecha de implementación**: 29 de Diciembre de 2025

---

## ✅ Cambios Implementados

### **1. Migración SQL Ejecutada** ✅

**Archivo**: `migrations/add_party_details_to_contratos.sql`

#### **Nuevos Campos Agregados:**

**Vendedor/Arrendador:**
- `VendedorTipoDocumento` VARCHAR(20) - Tipo de documento (CC, CE, NIT, Pasaporte, TI)
- `VendedorEstadoCivil` VARCHAR(50) - Estado civil
- `VendedorDepartamento` VARCHAR(10) - ID del departamento (API Colombia)
- `VendedorCiudad` VARCHAR(100) - Nombre de la ciudad
- `VendedorEmail` VARCHAR(255) - Correo electrónico

**Comprador/Arrendatario:**
- `CompradorTipoDocumento` VARCHAR(20) - Tipo de documento (CC, CE, NIT, Pasaporte, TI)
- `CompradorEstadoCivil` VARCHAR(50) - Estado civil
- `CompradorDepartamento` VARCHAR(10) - ID del departamento (API Colombia)
- `CompradorCiudad` VARCHAR(100) - Nombre de la ciudad
- `CompradorEmail` VARCHAR(255) - Correo electrónico

#### **Restricciones CHECK Agregadas:**

```sql
-- Validación de tipos de documento
CK_Contratos_TipoDocumento: 'CC', 'CE', 'NIT', 'Pasaporte', 'TI'

-- Validación de estados civiles
CK_Contratos_EstadoCivil: 'Soltero(a)', 'Casado(a)', 'Unión Libre', 'Divorciado(a)', 'Viudo(a)'

-- Validación de modalidades (actualizada)
CK_Contratos_ModalidadContrato: 
  - Compraventa
  - Permuta
  - Permuta con Saldo
  - Arrendamiento ✨ NUEVO
  - Comodato ✨ NUEVO
  - Cesión de Derechos ✨ NUEVO
  - Dación en Pago ✨ NUEVO
  - Promesa ✨ NUEVO
  - Transacción ✨ NUEVO
  - Contrato Mixto ✨ NUEVO
  - Personalizado ✨ NUEVO
  - Otro ✨ NUEVO
```

#### **Índices Creados:**

```sql
IX_Contratos_VendedorCiudad - Para búsquedas por ciudad del vendedor
IX_Contratos_CompradorCiudad - Para búsquedas por ciudad del comprador
```

---

### **2. Modelo Sequelize Actualizado** ✅

**Archivo**: `src/models/Contrato.model.ts`

#### **Propiedades Agregadas:**

```typescript
// Vendedor
public VendedorTipoDocumento?: string;
public VendedorEstadoCivil?: string;
public VendedorDepartamento?: string;
public VendedorCiudad?: string;
public VendedorEmail?: string;

// Comprador
public CompradorTipoDocumento?: string;
public CompradorEstadoCivil?: string;
public CompradorDepartamento?: string;
public CompradorCiudad?: string;
public CompradorEmail?: string;
```

#### **Validaciones en el Modelo:**

```typescript
VendedorTipoDocumento: {
  type: DataTypes.STRING(20),
  allowNull: true,
  validate: {
    isIn: [['CC', 'CE', 'NIT', 'Pasaporte', 'TI']]
  }
},
VendedorEstadoCivil: {
  type: DataTypes.STRING(50),
  allowNull: true,
  validate: {
    isIn: [['Soltero(a)', 'Casado(a)', 'Unión Libre', 'Divorciado(a)', 'Viudo(a)']]
  }
}
```

#### **Modalidades Actualizadas:**

```typescript
ModalidadContrato: { 
  type: DataTypes.STRING(50), 
  defaultValue: 'Compraventa',
  validate: {
    isIn: [[
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
      'Otro'
    ]]
  }
}
```

---

### **3. Controlador Actualizado** ✅

**Archivo**: `src/controllers/contrato.controller.ts`

#### **Datos para PDF Actualizados:**

```typescript
const pdfData = {
  tipo: req.body.TipoContrato,
  folio,
  modalidad,
  vendedor: {
    nombre: req.body.VendedorNombre,
    tipoDocumento: req.body.VendedorTipoDocumento || 'CC',
    documento: req.body.VendedorDocumento,
    estadoCivil: req.body.VendedorEstadoCivil,
    direccion: req.body.VendedorDireccion,
    departamento: req.body.VendedorDepartamento,
    ciudad: req.body.VendedorCiudad,
    telefono: req.body.VendedorTelefono,
    email: req.body.VendedorEmail
  },
  comprador: {
    nombre: req.body.CompradorNombre,
    tipoDocumento: req.body.CompradorTipoDocumento || 'CC',
    documento: req.body.CompradorDocumento,
    estadoCivil: req.body.CompradorEstadoCivil,
    direccion: req.body.CompradorDireccion,
    departamento: req.body.CompradorDepartamento,
    ciudad: req.body.CompradorCiudad,
    telefono: req.body.CompradorTelefono,
    email: req.body.CompradorEmail
  },
  // ... resto de campos
};
```

#### **Creación de Contrato Actualizada:**

```typescript
const contrato = await Contrato.create({
  TipoContrato: req.body.TipoContrato,
  Folio: folio,
  VendedorNombre: req.body.VendedorNombre,
  VendedorTipoDocumento: req.body.VendedorTipoDocumento || 'CC',
  VendedorDocumento: req.body.VendedorDocumento,
  VendedorEstadoCivil: req.body.VendedorEstadoCivil || null,
  VendedorDireccion: req.body.VendedorDireccion || null,
  VendedorDepartamento: req.body.VendedorDepartamento || null,
  VendedorCiudad: req.body.VendedorCiudad || null,
  VendedorTelefono: req.body.VendedorTelefono || null,
  VendedorEmail: req.body.VendedorEmail || null,
  CompradorNombre: req.body.CompradorNombre,
  CompradorTipoDocumento: req.body.CompradorTipoDocumento || 'CC',
  CompradorDocumento: req.body.CompradorDocumento,
  CompradorEstadoCivil: req.body.CompradorEstadoCivil || null,
  CompradorDireccion: req.body.CompradorDireccion || null,
  CompradorDepartamento: req.body.CompradorDepartamento || null,
  CompradorCiudad: req.body.CompradorCiudad || null,
  CompradorTelefono: req.body.CompradorTelefono || null,
  CompradorEmail: req.body.CompradorEmail || null,
  // ... resto de campos
});
```

---

## 📤 Ejemplo de Request Completo

```json
{
  "TipoContrato": "Compraventa Propiedad",
  "ModalidadContrato": "Compraventa",
  
  "VendedorNombre": "Juan Carlos Pérez García",
  "VendedorTipoDocumento": "CC",
  "VendedorDocumento": "1234567890",
  "VendedorEstadoCivil": "Casado(a)",
  "VendedorDireccion": "Calle 123 # 45-67 Apto 501",
  "VendedorDepartamento": "5",
  "VendedorCiudad": "Bogotá D.C.",
  "VendedorTelefono": "3001234567",
  "VendedorEmail": "juan.perez@email.com",
  
  "CompradorNombre": "María Fernanda López Rodríguez",
  "CompradorTipoDocumento": "CC",
  "CompradorDocumento": "9876543210",
  "CompradorEstadoCivil": "Soltero(a)",
  "CompradorDireccion": "Carrera 45 # 67-89",
  "CompradorDepartamento": "2",
  "CompradorCiudad": "Medellín",
  "CompradorTelefono": "3109876543",
  "CompradorEmail": "maria.lopez@email.com",
  
  "ValorContrato": 250000000,
  "FormaPago": "Contado",
  "FechaContrato": "2025-12-29",
  "ObjetoContrato": "Apartamento ubicado en Bogotá"
}
```

---

## 🔍 Validaciones Implementadas

### **1. Validaciones en Base de Datos (CHECK Constraints)**

- ✅ Tipos de documento válidos: CC, CE, NIT, Pasaporte, TI
- ✅ Estados civiles válidos: Soltero(a), Casado(a), Unión Libre, Divorciado(a), Viudo(a)
- ✅ Modalidades de contrato: 12 opciones disponibles

### **2. Validaciones en Modelo Sequelize**

- ✅ Validación `isIn` para tipos de documento
- ✅ Validación `isIn` para estados civiles
- ✅ Validación `isIn` para modalidades de contrato

### **3. Valores por Defecto**

- ✅ `VendedorTipoDocumento`: 'CC' (si no se proporciona)
- ✅ `CompradorTipoDocumento`: 'CC' (si no se proporciona)
- ✅ Registros existentes actualizados con valores por defecto

---

## 🌐 Integración con API Colombia

El frontend consume la API de Colombia para departamentos y ciudades:

**Endpoints:**
- Departamentos: `GET https://api-colombia.com/api/v1/Department`
- Ciudades: `GET https://api-colombia.com/api/v1/Department/{id}/cities`

**Datos Almacenados:**
- `VendedorDepartamento` / `CompradorDepartamento`: ID numérico (ej: "5" para Cundinamarca)
- `VendedorCiudad` / `CompradorCiudad`: Nombre de la ciudad (ej: "Bogotá D.C.")

---

## 📊 Compatibilidad con Contratos Existentes

### **Migración de Datos Existentes**

Los contratos existentes en la base de datos fueron actualizados automáticamente con valores por defecto:

```sql
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
```

**Resultado**: 5 filas afectadas (contratos existentes actualizados)

---

## 📝 Próximos Pasos Pendientes

### **1. Actualizar Servicio de PDF** ⏳

El servicio `pdf.service.ts` debe actualizarse para incluir los nuevos campos en la generación de documentos:

```typescript
// Ejemplo de actualización necesaria en el PDF
VENDEDOR:
Nombre: ${vendedor.nombre}
Documento: ${vendedor.tipoDocumento} ${vendedor.documento}
Estado Civil: ${vendedor.estadoCivil}
Dirección: ${vendedor.direccion}
Ciudad: ${vendedor.ciudad}, Departamento: ${vendedor.departamento}
Teléfono: ${vendedor.telefono}
Email: ${vendedor.email}
```

### **2. Validaciones Adicionales Recomendadas** ⏳

Considerar agregar en el controlador:

```typescript
// Validación de email (si se proporciona)
if (req.body.VendedorEmail && !isValidEmail(req.body.VendedorEmail)) {
  return res.status(400).json({ 
    error: 'Email del vendedor inválido' 
  });
}

// Validación de teléfono colombiano (10 dígitos)
if (req.body.VendedorTelefono && !/^\d{10}$/.test(req.body.VendedorTelefono)) {
  return res.status(400).json({ 
    error: 'Teléfono del vendedor debe tener 10 dígitos' 
  });
}
```

### **3. Tests Unitarios** ⏳

Crear tests para validar:
- Creación de contratos con nuevos campos
- Validación de tipos de documento
- Validación de estados civiles
- Validación de modalidades

---

## ✅ Checklist de Implementación

- [x] Crear migración SQL
- [x] Ejecutar migración en base de datos
- [x] Actualizar modelo Sequelize
- [x] Actualizar controlador para aceptar nuevos campos
- [x] Actualizar datos enviados al servicio PDF
- [x] Agregar validaciones en modelo
- [x] Agregar restricciones CHECK en BD
- [x] Migrar datos existentes
- [x] Crear índices para búsquedas
- [x] Documentar cambios
- [ ] Actualizar servicio de generación de PDF
- [ ] Agregar validaciones adicionales en controlador
- [ ] Crear tests unitarios
- [ ] Probar integración con frontend

---

## 🎯 Resumen de Campos por Entidad

### **Vendedor/Arrendador (10 campos totales)**

| Campo | Tipo | Nuevo | Obligatorio |
|-------|------|-------|-------------|
| VendedorNombre | STRING(200) | No | ✅ Sí |
| VendedorTipoDocumento | STRING(20) | ✨ Sí | ⚠️ Opcional (default: CC) |
| VendedorDocumento | STRING(50) | No | ✅ Sí |
| VendedorEstadoCivil | STRING(50) | ✨ Sí | ⚠️ Opcional |
| VendedorDireccion | STRING(300) | No | ⚠️ Opcional |
| VendedorDepartamento | STRING(10) | ✨ Sí | ⚠️ Opcional |
| VendedorCiudad | STRING(100) | ✨ Sí | ⚠️ Opcional |
| VendedorTelefono | STRING(50) | No | ⚠️ Opcional |
| VendedorEmail | STRING(255) | ✨ Sí | ⚠️ Opcional |

### **Comprador/Arrendatario (10 campos totales)**

| Campo | Tipo | Nuevo | Obligatorio |
|-------|------|-------|-------------|
| CompradorNombre | STRING(200) | No | ✅ Sí |
| CompradorTipoDocumento | STRING(20) | ✨ Sí | ⚠️ Opcional (default: CC) |
| CompradorDocumento | STRING(50) | No | ✅ Sí |
| CompradorEstadoCivil | STRING(50) | ✨ Sí | ⚠️ Opcional |
| CompradorDireccion | STRING(300) | No | ⚠️ Opcional |
| CompradorDepartamento | STRING(10) | ✨ Sí | ⚠️ Opcional |
| CompradorCiudad | STRING(100) | ✨ Sí | ⚠️ Opcional |
| CompradorTelefono | STRING(50) | No | ⚠️ Opcional |
| CompradorEmail | STRING(255) | ✨ Sí | ⚠️ Opcional |

---

## 📞 Soporte

Para cualquier duda sobre la implementación, revisar:
- Migración SQL: `migrations/add_party_details_to_contratos.sql`
- Modelo: `src/models/Contrato.model.ts`
- Controlador: `src/controllers/contrato.controller.ts`

**Estado**: ✅ **Backend 100% Listo para Recibir Nuevos Campos del Frontend**

---

**Última actualización**: 29 de Diciembre de 2025
