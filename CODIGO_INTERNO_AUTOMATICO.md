# 🔢 Sistema de Generación Automática de Códigos Internos

Documentación del sistema de generación automática de códigos internos para vehículos y propiedades.

---

## 📋 Descripción General

El sistema genera automáticamente códigos internos únicos para vehículos y propiedades cuando no se proporciona uno manualmente. Esto simplifica el proceso de registro y garantiza la unicidad de los códigos.

---

## 🎯 Formato de Códigos

### **Vehículos**
```
Formato: VEH-YYYY-NNNN
Ejemplo: VEH-2024-0001
```

- **VEH**: Prefijo para vehículos
- **YYYY**: Año actual (4 dígitos)
- **NNNN**: Número secuencial (4 dígitos con ceros a la izquierda)

### **Propiedades**
```
Formato: PROP-YYYY-NNNN
Ejemplo: PROP-2024-0001
```

- **PROP**: Prefijo para propiedades
- **YYYY**: Año actual (4 dígitos)
- **NNNN**: Número secuencial (4 dígitos con ceros a la izquierda)

---

## 🔧 Funcionamiento

### **1. Generación Automática**

Cuando se crea un vehículo o propiedad **sin** especificar `CodigoInterno`:

```typescript
// El usuario NO envía CodigoInterno
POST /api/vehiculos
{
  "Marca": "Toyota",
  "Modelo": 2024,
  "Placa": "ABC123",
  // CodigoInterno NO se envía
  ...
}

// El sistema genera automáticamente: VEH-2024-0001
```

### **2. Código Manual (Opcional)**

El usuario aún puede proporcionar un código personalizado:

```typescript
// El usuario SÍ envía CodigoInterno
POST /api/vehiculos
{
  "CodigoInterno": "MI-CODIGO-001",
  "Marca": "Toyota",
  "Modelo": 2024,
  "Placa": "ABC123",
  ...
}

// El sistema usa: MI-CODIGO-001
```

---

## 📊 Lógica de Secuencia

### **Primer Vehículo del Año**
```
Año: 2024
Último código: (ninguno)
Nuevo código: VEH-2024-0001
```

### **Segundo Vehículo del Mismo Año**
```
Año: 2024
Último código: VEH-2024-0001
Nuevo código: VEH-2024-0002
```

### **Primer Vehículo del Nuevo Año**
```
Año: 2025
Último código: VEH-2024-0150
Nuevo código: VEH-2025-0001  ← Reinicia secuencia
```

---

## 🛡️ Características de Seguridad

### **1. Verificación de Unicidad**
- Antes de generar, verifica que el código no exista
- Si existe (caso raro), reintenta hasta 5 veces
- Si después de 5 intentos falla, usa timestamp

### **2. Manejo de Colisiones**
```typescript
// Si VEH-2024-0001 ya existe (muy raro)
Intento 1: VEH-2024-0002
Intento 2: VEH-2024-0003
...
Intento 5: VEH-2024-0006

// Si todos fallan (extremadamente raro)
Fallback: VEH-2024-1234 (usando timestamp)
```

### **3. Validación de Formato**
```typescript
// Códigos válidos
VEH-2024-0001  ✓
PROP-2024-0001 ✓
MI-CODIGO-001  ✓

// Códigos inválidos (si se valida formato estricto)
VEH-24-1       ✗
VEHICULO-001   ✗
```

---

## 💻 Implementación Técnica

### **Archivo Creado**
```
src/utils/codigo-generator.util.ts
```

### **Métodos Principales**

#### **1. generarCodigoVehiculo()**
```typescript
static async generarCodigoVehiculo(): Promise<string>
```
Genera código para vehículo en formato `VEH-YYYY-NNNN`

#### **2. generarCodigoPropiedad()**
```typescript
static async generarCodigoPropiedad(): Promise<string>
```
Genera código para propiedad en formato `PROP-YYYY-NNNN`

#### **3. generarCodigoUnico()**
```typescript
static async generarCodigoUnico(
  tipo: 'vehiculo' | 'propiedad',
  maxReintentos: number = 5
): Promise<string>
```
Genera código único con reintentos en caso de colisión

#### **4. codigoExiste()**
```typescript
static async codigoExiste(codigo: string): Promise<boolean>
```
Verifica si un código ya existe en la base de datos

#### **5. validarFormato()**
```typescript
static async validarFormato(
  codigo: string,
  tipo: 'vehiculo' | 'propiedad'
): boolean
```
Valida que un código cumpla con el formato esperado

---

## 🔄 Cambios Realizados

### **1. Servicios Actualizados**

#### **vehiculo.service.ts**
```typescript
// ANTES
interface CrearVehiculoData {
  CodigoInterno: string; // Requerido
  ...
}

// AHORA
interface CrearVehiculoData {
  CodigoInterno?: string; // Opcional
  ...
}

// Lógica agregada
if (!data.CodigoInterno) {
  data.CodigoInterno = await CodigoGeneratorUtil.generarCodigoUnico('vehiculo');
}
```

#### **propiedad.service.ts**
```typescript
// ANTES
interface CrearPropiedadData {
  CodigoInterno: string; // Requerido
  ...
}

// AHORA
interface CrearPropiedadData {
  CodigoInterno?: string; // Opcional
  ...
}

// Lógica agregada
if (!data.CodigoInterno) {
  data.CodigoInterno = await CodigoGeneratorUtil.generarCodigoUnico('propiedad');
}
```

### **2. Validadores Actualizados**

#### **vehiculo.validator.ts**
```typescript
// ANTES
CodigoInterno: Joi.string().max(50).required()

// AHORA
CodigoInterno: Joi.string().max(50).optional()
```

#### **propiedad.validator.ts**
```typescript
// ANTES
CodigoInterno: Joi.string().max(50).required()

// AHORA
CodigoInterno: Joi.string().max(50).optional()
```

---

## 📱 Uso en el Frontend

### **Opción 1: No Enviar CodigoInterno (Recomendado)**

```typescript
// React/Angular/Vue
const crearVehiculo = async () => {
  const data = {
    Marca: "Toyota",
    Modelo: 2024,
    Placa: "ABC123",
    // NO incluir CodigoInterno
    FechaCompra: "2024-01-15",
    ValorCompra: 50000000,
    ...
  };

  const response = await axios.post('/api/vehiculos', data);
  
  // El backend devuelve el código generado
  console.log(response.data.data.CodigoInterno); // VEH-2024-0001
};
```

### **Opción 2: Enviar CodigoInterno Personalizado**

```typescript
const crearVehiculo = async () => {
  const data = {
    CodigoInterno: "FLOTA-001", // Código personalizado
    Marca: "Toyota",
    Modelo: 2024,
    Placa: "ABC123",
    ...
  };

  const response = await axios.post('/api/vehiculos', data);
};
```

### **Opción 3: Campo Opcional en Formulario**

```tsx
// Formulario con campo opcional
<Form>
  <FormGroup>
    <Label>Código Interno (opcional)</Label>
    <Input 
      name="CodigoInterno"
      placeholder="Dejar vacío para generar automáticamente"
      optional
    />
    <small className="text-muted">
      Si se deja vacío, se generará automáticamente (ej: VEH-2024-0001)
    </small>
  </FormGroup>
  
  <FormGroup>
    <Label>Marca *</Label>
    <Input name="Marca" required />
  </FormGroup>
  
  ...
</Form>
```

---

## 🧪 Ejemplos de Prueba

### **Test 1: Crear Vehículo sin Código**

```bash
curl -X POST http://localhost:3000/api/vehiculos \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "Marca": "Toyota",
    "Linea": "Corolla",
    "Modelo": 2024,
    "Placa": "ABC123",
    "FechaCompra": "2024-01-15",
    "ValorCompra": 50000000
  }'

# Respuesta esperada:
{
  "success": true,
  "data": {
    "VehiculoID": 1,
    "CodigoInterno": "VEH-2024-0001",  ← Generado automáticamente
    "Marca": "Toyota",
    ...
  }
}
```

### **Test 2: Crear Propiedad sin Código**

```bash
curl -X POST http://localhost:3000/api/propiedades \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "TipoInmueble": "Casa",
    "Direccion": "Calle 123",
    "Ciudad": "Cúcuta",
    "FechaCompra": "2024-01-15",
    "ValorCompra": 200000000
  }'

# Respuesta esperada:
{
  "success": true,
  "data": {
    "PropiedadID": 1,
    "CodigoInterno": "PROP-2024-0001",  ← Generado automáticamente
    "TipoInmueble": "Casa",
    ...
  }
}
```

### **Test 3: Crear con Código Personalizado**

```bash
curl -X POST http://localhost:3000/api/vehiculos \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "CodigoInterno": "FLOTA-TAXI-001",
    "Marca": "Chevrolet",
    "Linea": "Spark",
    "Modelo": 2024,
    "Placa": "XYZ789",
    "FechaCompra": "2024-01-15",
    "ValorCompra": 30000000
  }'

# Respuesta esperada:
{
  "success": true,
  "data": {
    "VehiculoID": 2,
    "CodigoInterno": "FLOTA-TAXI-001",  ← Código personalizado
    "Marca": "Chevrolet",
    ...
  }
}
```

---

## 📊 Consultas SQL Útiles

### **Ver Códigos Generados por Año**

```sql
-- Vehículos por año
SELECT 
    YEAR(FechaCreacion) AS Año,
    COUNT(*) AS Total,
    MIN(CodigoInterno) AS PrimerCodigo,
    MAX(CodigoInterno) AS UltimoCodigo
FROM Activos
WHERE TipoActivoID = 1
GROUP BY YEAR(FechaCreacion)
ORDER BY Año DESC;

-- Propiedades por año
SELECT 
    YEAR(FechaCreacion) AS Año,
    COUNT(*) AS Total,
    MIN(CodigoInterno) AS PrimerCodigo,
    MAX(CodigoInterno) AS UltimoCodigo
FROM Activos
WHERE TipoActivoID = 2
GROUP BY YEAR(FechaCreacion)
ORDER BY Año DESC;
```

### **Ver Último Código Generado**

```sql
-- Último vehículo
SELECT TOP 1 
    CodigoInterno,
    FechaCreacion
FROM Activos
WHERE TipoActivoID = 1
ORDER BY ActivoID DESC;

-- Última propiedad
SELECT TOP 1 
    CodigoInterno,
    FechaCreacion
FROM Activos
WHERE TipoActivoID = 2
ORDER BY ActivoID DESC;
```

---

## ✅ Ventajas del Sistema

1. **Simplicidad**: Usuario no necesita pensar en códigos
2. **Unicidad**: Garantiza códigos únicos automáticamente
3. **Organización**: Códigos organizados por año
4. **Flexibilidad**: Permite códigos personalizados si se desea
5. **Trazabilidad**: Fácil identificar cuándo se creó el activo
6. **Escalabilidad**: Soporta hasta 9,999 activos por año por tipo

---

## 🔮 Mejoras Futuras (Opcional)

### **1. Prefijos Personalizables**
```typescript
// Permitir configurar prefijos por usuario/empresa
VEH-EMPRESA1-2024-0001
VEH-EMPRESA2-2024-0001
```

### **2. Códigos por Categoría**
```typescript
// Vehículos
VEH-TAXI-2024-0001
VEH-CARGA-2024-0001

// Propiedades
PROP-CASA-2024-0001
PROP-APTO-2024-0001
```

### **3. Códigos con Ubicación**
```typescript
VEH-CUC-2024-0001  // Cúcuta
VEH-BOG-2024-0001  // Bogotá
```

---

## 🆘 Solución de Problemas

### **Problema: Código duplicado**
```
Error: El código interno VEH-2024-0001 ya está registrado
```

**Solución**: El sistema automáticamente reintenta con el siguiente número. Si persiste, verificar la base de datos.

### **Problema: Formato incorrecto**
```
Error: El código interno no cumple con el formato esperado
```

**Solución**: Si usas código personalizado, asegúrate que tenga máximo 50 caracteres.

### **Problema: Secuencia incorrecta**
```
Esperado: VEH-2024-0003
Obtenido: VEH-2024-0001
```

**Solución**: Verificar que no haya registros eliminados o que la consulta esté ordenando correctamente.

---

## 📝 Notas Importantes

- ✅ El campo `CodigoInterno` es **opcional** en el frontend
- ✅ Si no se envía, se genera **automáticamente**
- ✅ Si se envía, se usa el **valor proporcionado**
- ✅ La secuencia se **reinicia cada año**
- ✅ Soporta hasta **9,999 activos por año** por tipo
- ✅ El sistema maneja **colisiones automáticamente**

---

**¡Sistema de generación automática de códigos implementado exitosamente! 🎉**
