# 🏠 Campos Detallados de Propiedades/Inmuebles en Contratos

## 📋 Resumen de Implementación

Se han agregado **52 campos adicionales** a la tabla `BienesContrato` para capturar información jurídica, catastral, impuestos y gastos de propiedades/inmuebles en **TODOS los tipos de contratos** (Compraventa, Permuta, etc.).

> **⚠️ IMPORTANTE**: Estos campos deben solicitarse para **cualquier propiedad/inmueble en cualquier tipo de contrato**, no solo en permutas. Son datos esenciales para la documentación legal del inmueble.

---

## 🗄️ Campos Agregados a Base de Datos

### **1. Información Básica del Inmueble**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `TipoInmueble` | VARCHAR(50) | "Apartamento" | Tipo de inmueble |
| `DireccionCompleta` | VARCHAR(500) | "Calle 123 #45-67 Apto 501" | Dirección completa |
| `Municipio` | VARCHAR(100) | "Bogotá" | Municipio |
| `Departamento` | VARCHAR(100) | "Cundinamarca" | Departamento |
| `Barrio` | VARCHAR(100) | "Chapinero" | Barrio o sector |

**Opciones para TipoInmueble:**
- Casa
- Apartamento
- Lote
- Local Comercial
- Oficina
- Bodega
- Finca
- Parqueadero
- Otro

---

### **2. Información Catastral y Registral**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `MatriculaInmobiliaria` | VARCHAR(100) | "50C-123456" | Matrícula inmobiliaria |
| `CedulaCatastral` | VARCHAR(100) | "AAA0101AAAA0001000000001" | Cédula catastral |
| `ChipCatastral` | VARCHAR(100) | "AAA0101AAAA0001" | Chip catastral |
| `OficinaRegistro` | VARCHAR(200) | "Oficina de Registro de Bogotá Zona Norte" | Oficina de registro |

---

### **3. Áreas y Medidas**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `AreaConstruida` | DECIMAL(18,2) | 85.50 | Área construida en m² |
| `AreaPrivada` | DECIMAL(18,2) | 75.00 | Área privada en m² |
| `AreaTerreno` | DECIMAL(18,2) | 120.00 | Área del terreno en m² |
| `Linderos` | TEXT | "Norte: Calle 123..." | Descripción de linderos |

---

### **4. Propiedad Horizontal**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `EsPropiedadHorizontal` | BIT | 1 | ¿Es propiedad horizontal? |
| `CoeficienteCopropiedad` | DECIMAL(10,6) | 0.012345 | Coeficiente de copropiedad |
| `NombreConjunto` | VARCHAR(200) | "Conjunto Residencial Los Pinos" | Nombre del conjunto/edificio |
| `NumeroApartamento` | VARCHAR(50) | "501" | Número de apartamento |
| `Torre` | VARCHAR(50) | "Torre A" | Torre (si aplica) |
| `Piso` | VARCHAR(50) | "5" | Piso |
| `ParqueaderosPrivados` | INT | 2 | Número de parqueaderos |
| `Depositos` | INT | 1 | Número de depósitos |

---

### **5. Título de Adquisición del Vendedor**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `EscrituraPublicaNumero` | VARCHAR(100) | "1234" | Número de escritura pública |
| `NotariaEscritura` | VARCHAR(200) | "Notaría 25 de Bogotá" | Notaría donde se otorgó |
| `CiudadEscritura` | VARCHAR(100) | "Bogotá" | Ciudad de la notaría |
| `FechaEscritura` | DATE | "2020-05-15" | Fecha de la escritura |
| `ActoJuridico` | VARCHAR(100) | "Compraventa" | Acto jurídico |
| `FechaRegistro` | DATE | "2020-06-01" | Fecha de registro |

**Opciones para ActoJuridico:**
- Compraventa
- Sucesión
- Donación
- Adjudicación
- Permuta
- Dación en Pago
- Otro

---

### **6. Impuestos y Estado Financiero**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `ImpuestoPredialAlDia` | BIT | 1 | ¿Impuesto predial al día? |
| `ValorImpuestoPredial` | DECIMAL(18,2) | 850000 | Valor anual del predial |
| `AniosPredialPendientes` | VARCHAR(200) | "2022,2023" | Años con predial pendiente |
| `TieneValorizacion` | BIT | 1 | ¿Tiene valorización? |
| `ValorValorizacion` | DECIMAL(18,2) | 2500000 | Valor de la valorización |
| `ValorizacionAlDia` | BIT | 0 | ¿Valorización al día? |
| `ValorAdministracion` | DECIMAL(18,2) | 350000 | Valor mensual de administración |
| `AdministracionAlDia` | BIT | 1 | ¿Administración al día? |

---

### **7. Gastos de Compraventa**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `QuienPagaEscritura` | VARCHAR(50) | "Comprador" | Quién paga la escritura |
| `QuienPagaRegistro` | VARCHAR(50) | "Comprador" | Quién paga el registro |
| `QuienPagaDerechosNotariales` | VARCHAR(50) | "Mitad" | Quién paga derechos notariales |
| `QuienPagaImpuestoRegistro` | VARCHAR(50) | "Comprador" | Quién paga impuesto de registro |
| `QuienPagaBeneficencia` | VARCHAR(50) | "Comprador" | Quién paga beneficencia |

**Opciones para todos los campos de gastos:**
- Vendedor
- Comprador
- Mitad (50% cada uno)

---

### **8. Retención en la Fuente**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `AplicaRetencionFuente` | BIT | 1 | ¿Aplica retención? |
| `PorcentajeRetencion` | DECIMAL(5,2) | 1.00 | Porcentaje de retención |
| `BaseRetencion` | DECIMAL(18,2) | 150000000 | Base para calcular retención |
| `ValorRetencion` | DECIMAL(18,2) | 1500000 | Valor de la retención |

---

### **9. Características Adicionales**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `NumeroHabitaciones` | INT | 3 | Número de habitaciones |
| `NumeroBanos` | INT | 2 | Número de baños |
| `Estrato` | INT | 4 | Estrato socioeconómico (1-6) |
| `AntiguedadInmueble` | INT | 15 | Antigüedad en años |
| `EstadoInmueble` | VARCHAR(50) | "Usado" | Estado del inmueble |

**Opciones para EstadoInmueble:**
- Nuevo
- Usado
- Remodelado
- En Construcción
- A Remodelar

---

### **10. Restricciones y Gravámenes**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `TieneHipoteca` | BIT | 1 | ¿Tiene hipoteca? |
| `EntidadHipoteca` | VARCHAR(200) | "Banco de Bogotá" | Entidad que otorgó la hipoteca |
| `SaldoHipoteca` | DECIMAL(18,2) | 80000000 | Saldo pendiente de la hipoteca |
| `TieneEmbargosInmueble` | BIT | 0 | ¿Tiene embargos? |
| `TieneLimitacionesDominio` | BIT | 0 | ¿Tiene limitaciones al dominio? |
| `DescripcionLimitaciones` | TEXT | "Servidumbre de paso..." | Descripción de limitaciones |

---

## 💻 Estructura del Objeto Propiedad para Frontend

### **Ejemplo Completo de Propiedad en Contrato**

```typescript
interface BienPropiedad {
  // Campos básicos
  TipoBien: 'Propiedad';
  Rol?: 'Entrega' | 'Recibe'; // Solo para permutas
  Parte?: 'Vendedor' | 'Comprador'; // Solo para permutas
  PropiedadID?: number;
  DescripcionBien?: string;
  ValorComercial: number;
  
  // Información básica del inmueble
  TipoInmueble: string; // "Casa", "Apartamento", etc.
  DireccionCompleta: string;
  Municipio: string;
  Departamento: string;
  Barrio?: string;
  
  // Información catastral y registral
  MatriculaInmobiliaria: string;
  CedulaCatastral?: string;
  ChipCatastral?: string;
  OficinaRegistro?: string;
  
  // Áreas y medidas
  AreaConstruida?: number;
  AreaPrivada?: number;
  AreaTerreno?: number;
  Linderos?: string;
  
  // Propiedad horizontal
  EsPropiedadHorizontal?: boolean;
  CoeficienteCopropiedad?: number;
  NombreConjunto?: string;
  NumeroApartamento?: string;
  Torre?: string;
  Piso?: string;
  ParqueaderosPrivados?: number;
  Depositos?: number;
  
  // Título de adquisición del vendedor
  EscrituraPublicaNumero: string;
  NotariaEscritura: string;
  CiudadEscritura: string;
  FechaEscritura: string; // "2020-05-15"
  ActoJuridico: string; // "Compraventa", "Sucesion", etc.
  FechaRegistro: string; // "2020-06-01"
  
  // Impuestos y estado financiero
  ImpuestoPredialAlDia: boolean;
  ValorImpuestoPredial?: number;
  AniosPredialPendientes?: string; // "2022,2023"
  TieneValorizacion?: boolean;
  ValorValorizacion?: number;
  ValorizacionAlDia?: boolean;
  ValorAdministracion?: number;
  AdministracionAlDia?: boolean;
  
  // Gastos de compraventa
  QuienPagaEscritura?: 'Vendedor' | 'Comprador' | 'Mitad';
  QuienPagaRegistro?: 'Vendedor' | 'Comprador' | 'Mitad';
  QuienPagaDerechosNotariales?: 'Vendedor' | 'Comprador' | 'Mitad';
  QuienPagaImpuestoRegistro?: 'Vendedor' | 'Comprador' | 'Mitad';
  QuienPagaBeneficencia?: 'Vendedor' | 'Comprador' | 'Mitad';
  
  // Retención en la fuente
  AplicaRetencionFuente?: boolean;
  PorcentajeRetencion?: number;
  BaseRetencion?: number;
  ValorRetencion?: number;
  
  // Características adicionales
  NumeroHabitaciones?: number;
  NumeroBanos?: number;
  Estrato?: number; // 1-6
  AntiguedadInmueble?: number;
  EstadoInmueble?: string;
  
  // Restricciones y gravámenes
  TieneHipoteca?: boolean;
  EntidadHipoteca?: string;
  SaldoHipoteca?: number;
  TieneEmbargosInmueble?: boolean;
  TieneLimitacionesDominio?: boolean;
  DescripcionLimitaciones?: string;
  
  // Observaciones
  Observaciones?: string;
}
```

---

## 📤 Ejemplo de Payload al Backend

### **Compraventa de Apartamento**

```json
{
  "TipoContrato": "Compraventa",
  "VendedorNombre": "María García",
  "VendedorDocumento": "52123456",
  "CompradorNombre": "Juan Pérez",
  "CompradorDocumento": "80654321",
  "ValorContrato": 150000000,
  "FechaContrato": "2025-12-29",
  "FormaPago": "Contado",
  "bienes": [
    {
      "TipoBien": "Propiedad",
      "ValorComercial": 150000000,
      "TipoInmueble": "Apartamento",
      "DireccionCompleta": "Calle 123 #45-67 Apto 501 Torre A",
      "Municipio": "Bogotá",
      "Departamento": "Cundinamarca",
      "Barrio": "Chapinero",
      "MatriculaInmobiliaria": "50C-123456",
      "CedulaCatastral": "AAA0101AAAA0001000000001",
      "OficinaRegistro": "Oficina de Registro de Bogotá Zona Norte",
      "AreaConstruida": 85.50,
      "AreaPrivada": 75.00,
      "EsPropiedadHorizontal": true,
      "CoeficienteCopropiedad": 0.012345,
      "NombreConjunto": "Conjunto Residencial Los Pinos",
      "NumeroApartamento": "501",
      "Torre": "Torre A",
      "Piso": "5",
      "ParqueaderosPrivados": 2,
      "Depositos": 1,
      "EscrituraPublicaNumero": "1234",
      "NotariaEscritura": "Notaría 25 de Bogotá",
      "CiudadEscritura": "Bogotá",
      "FechaEscritura": "2020-05-15",
      "ActoJuridico": "Compraventa",
      "FechaRegistro": "2020-06-01",
      "ImpuestoPredialAlDia": true,
      "ValorImpuestoPredial": 850000,
      "ValorAdministracion": 350000,
      "AdministracionAlDia": true,
      "QuienPagaEscritura": "Comprador",
      "QuienPagaRegistro": "Comprador",
      "QuienPagaDerechosNotariales": "Mitad",
      "QuienPagaImpuestoRegistro": "Comprador",
      "QuienPagaBeneficencia": "Comprador",
      "AplicaRetencionFuente": true,
      "PorcentajeRetencion": 1.00,
      "BaseRetencion": 150000000,
      "ValorRetencion": 1500000,
      "NumeroHabitaciones": 3,
      "NumeroBanos": 2,
      "Estrato": 4,
      "AntiguedadInmueble": 5,
      "EstadoInmueble": "Usado",
      "TieneHipoteca": false,
      "TieneEmbargosInmueble": false,
      "TieneLimitacionesDominio": false
    }
  ]
}
```

---

## ✅ Campos Obligatorios vs Opcionales

### **Obligatorios para Propiedades**
- ✅ TipoInmueble
- ✅ DireccionCompleta
- ✅ Municipio
- ✅ Departamento
- ✅ MatriculaInmobiliaria
- ✅ ValorComercial
- ✅ EscrituraPublicaNumero (título de adquisición)
- ✅ NotariaEscritura
- ✅ CiudadEscritura
- ✅ FechaEscritura
- ✅ ActoJuridico
- ✅ FechaRegistro
- ✅ ImpuestoPredialAlDia

### **Recomendados (Opcionales pero importantes)**
- 🔶 CedulaCatastral
- 🔶 AreaConstruida
- 🔶 QuienPagaEscritura
- 🔶 QuienPagaRegistro
- 🔶 QuienPagaImpuestoRegistro
- 🔶 AplicaRetencionFuente

### **Condicionales**
- ⚪ Campos de Propiedad Horizontal (solo si `EsPropiedadHorizontal = true`)
- ⚪ AniosPredialPendientes (solo si `ImpuestoPredialAlDia = false`)
- ⚪ Campos de Hipoteca (solo si `TieneHipoteca = true`)
- ⚪ Campos de Valorización (solo si `TieneValorizacion = true`)

---

## 🚨 Validaciones y Alertas

### **Alertas Críticas**

```typescript
verificarEstadoPropiedad(propiedad: any): void {
  const alertas: string[] = [];
  const errores: string[] = [];
  
  // ERRORES CRÍTICOS (No se puede continuar)
  if (propiedad.TieneEmbargosInmueble) {
    errores.push('🚫 INMUEBLE CON EMBARGOS - No se puede transferir');
  }
  
  if (propiedad.TieneHipoteca && !propiedad.SaldoHipoteca) {
    errores.push('⚠️ Debe especificar el saldo de la hipoteca');
  }
  
  // ADVERTENCIAS (Se puede continuar con confirmación)
  if (!propiedad.ImpuestoPredialAlDia) {
    alertas.push(`⚠️ Impuesto predial NO está al día. Años pendientes: ${propiedad.AniosPredialPendientes}`);
  }
  
  if (propiedad.TieneValorizacion && !propiedad.ValorizacionAlDia) {
    alertas.push('⚠️ Valorización pendiente de pago');
  }
  
  if (propiedad.EsPropiedadHorizontal && !propiedad.AdministracionAlDia) {
    alertas.push('⚠️ Cuotas de administración pendientes');
  }
  
  if (propiedad.TieneLimitacionesDominio) {
    alertas.push(`⚠️ El inmueble tiene limitaciones al dominio: ${propiedad.DescripcionLimitaciones}`);
  }
  
  // Mostrar errores críticos
  if (errores.length > 0) {
    this.mostrarError(errores.join('\n'));
    return; // No permitir continuar
  }
  
  // Mostrar advertencias
  if (alertas.length > 0) {
    const continuar = confirm(
      `ADVERTENCIAS:\n${alertas.join('\n')}\n\n¿Desea continuar de todas formas?`
    );
    if (!continuar) return;
  }
}
```

---

## 💰 Cálculo Automático de Retención

```typescript
calcularRetencion(valorVenta: number, vendedorPersonaNatural: boolean): any {
  if (!vendedorPersonaNatural) {
    return {
      AplicaRetencionFuente: false,
      PorcentajeRetencion: 0,
      BaseRetencion: 0,
      ValorRetencion: 0
    };
  }
  
  // Retención del 1% para personas naturales
  const porcentaje = 1.00;
  const baseRetencion = valorVenta;
  const valorRetencion = (baseRetencion * porcentaje) / 100;
  
  return {
    AplicaRetencionFuente: true,
    PorcentajeRetencion: porcentaje,
    BaseRetencion: baseRetencion,
    ValorRetencion: valorRetencion
  };
}
```

---

## 📊 Resumen de Gastos de Compraventa

```typescript
calcularGastosCompraventa(valorInmueble: number, gastos: any): any {
  // Porcentajes aproximados en Colombia
  const porcentajes = {
    escritura: 0.27, // 0.27% del valor
    registro: 0.5,   // 0.5% del valor
    derechosNotariales: 0.3, // 0.3% del valor
    impuestoRegistro: 1.0, // 1% del valor
    beneficencia: 0.5 // 0.5% del valor
  };
  
  const calcularGasto = (porcentaje: number, quienPaga: string) => {
    const valor = (valorInmueble * porcentaje) / 100;
    if (quienPaga === 'Mitad') {
      return { vendedor: valor / 2, comprador: valor / 2, total: valor };
    } else if (quienPaga === 'Vendedor') {
      return { vendedor: valor, comprador: 0, total: valor };
    } else {
      return { vendedor: 0, comprador: valor, total: valor };
    }
  };
  
  const escritura = calcularGasto(porcentajes.escritura, gastos.QuienPagaEscritura);
  const registro = calcularGasto(porcentajes.registro, gastos.QuienPagaRegistro);
  const derechosNotariales = calcularGasto(porcentajes.derechosNotariales, gastos.QuienPagaDerechosNotariales);
  const impuestoRegistro = calcularGasto(porcentajes.impuestoRegistro, gastos.QuienPagaImpuestoRegistro);
  const beneficencia = calcularGasto(porcentajes.beneficencia, gastos.QuienPagaBeneficencia);
  
  return {
    escritura,
    registro,
    derechosNotariales,
    impuestoRegistro,
    beneficencia,
    totalVendedor: escritura.vendedor + registro.vendedor + derechosNotariales.vendedor + impuestoRegistro.vendedor + beneficencia.vendedor,
    totalComprador: escritura.comprador + registro.comprador + derechosNotariales.comprador + impuestoRegistro.comprador + beneficencia.comprador,
    totalGastos: escritura.total + registro.total + derechosNotariales.total + impuestoRegistro.total + beneficencia.total
  };
}
```

---

## ✨ Resumen de Implementación

1. ✅ **52 campos nuevos** agregados a `BienesContrato`
2. ✅ **Migración SQL** ejecutada correctamente
3. ✅ **Modelo Sequelize** actualizado
4. ✅ **Controlador** actualizado para aceptar nuevos campos
5. ✅ **Validaciones** en base de datos
6. ✅ **Índices** creados para búsquedas eficientes

---

**Backend 100% Listo para Capturar Información Completa de Propiedades/Inmuebles** 🏠

Ahora puedes implementar el formulario en el frontend siguiendo esta guía.
