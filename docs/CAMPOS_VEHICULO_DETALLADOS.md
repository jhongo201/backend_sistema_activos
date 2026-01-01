# 🚗 Campos Detallados de Vehículos en Contratos

## 📋 Resumen de Implementación

Se han agregado **16 campos adicionales** a la tabla `BienesContrato` para capturar información técnica, legal y de documentación de vehículos en **TODOS los tipos de contratos** (Compraventa, Permuta, etc.).

> **⚠️ IMPORTANTE**: Estos campos deben solicitarse para **cualquier vehículo en cualquier tipo de contrato**, no solo en permutas. Son datos esenciales para la documentación legal del vehículo.

---

## 🗄️ Campos Agregados a Base de Datos

### **1. Campos Técnicos del Vehículo**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `Clase` | VARCHAR(50) | "CAMIONETA" | Clase del vehículo (AUTOMOVIL, CAMIONETA, etc.) |
| `Linea` | VARCHAR(100) | "COROLLA GLI 1.8" | Línea específica del vehículo |
| `Cilindraje` | VARCHAR(50) | "1800cc" | Cilindraje del motor |
| `Capacidad` | INT | 5 | Número de pasajeros |
| `NumeroMotor` | VARCHAR(100) | "3SZ4 CILINDROS" | Número de serie del motor |
| `Serie` | VARCHAR(100) | "ABC123456" | Número de serie del vehículo |
| `Color` | VARCHAR(50) | "NEGRO" | Color del vehículo |
| `Tipo` | VARCHAR(50) | "SPORT WAGON" | Tipo de carrocería |
| `Servicio` | VARCHAR(50) | "PRIVADO" | Tipo de servicio (PRIVADO, PUBLICO) |
| `NumeroChasis` | VARCHAR(100) | "8XAJ210G099511477" | Número de chasis |
| `NumeroCarroceria` | VARCHAR(100) | "8XAJ210G099511477" | Número de carrocería |

### **2. Campos de Documentación**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `FechaVencimientoSOAT` | DATE | "2025-12-31" | Fecha de vencimiento del SOAT |
| `FechaVencimientoTecnomecanica` | DATE | "2025-06-30" | Fecha de vencimiento de tecnomecánica |

### **3. Campos de Estado Legal**

| Campo | Tipo | Ejemplo | Descripción |
|-------|------|---------|-------------|
| `EstadoImpuestos` | VARCHAR(20) | "Al Dia" o "Debe" | Estado de pago de impuestos |
| `AniosImpuestosPendientes` | VARCHAR(200) | "2020,2021,2022" | Años con impuestos pendientes (separados por comas) |
| `TieneEmbargos` | BIT | 0 o 1 | Indica si el vehículo tiene embargos |

---

## 💻 Estructura del Objeto Bien para Frontend

### **Ejemplo Completo de Vehículo en Permuta**

```typescript
interface BienVehiculo {
  // Campos básicos (ya existentes)
  TipoBien: 'Vehiculo';
  Rol: 'Entrega' | 'Recibe';
  Parte: 'Vendedor' | 'Comprador';
  VehiculoID?: number;
  DescripcionBien?: string;
  ValorComercial: number;
  Marca: string;
  Modelo: string;
  Anio: number;
  Placa: string;
  Matricula?: string;
  Observaciones?: string;
  
  // NUEVOS: Campos técnicos del vehículo
  Clase?: string;                    // "CAMIONETA", "AUTOMOVIL"
  Linea?: string;                    // "COROLLA GLI 1.8"
  Cilindraje?: string;               // "1800cc"
  Capacidad?: number;                // 5
  NumeroMotor?: string;              // "3SZ4 CILINDROS"
  Serie?: string;                    // Número de serie
  Color?: string;                    // "NEGRO"
  Tipo?: string;                     // "SPORT WAGON"
  Servicio?: string;                 // "PRIVADO", "PUBLICO"
  NumeroChasis?: string;             // "8XAJ210G099511477"
  NumeroCarroceria?: string;         // "8XAJ210G099511477"
  
  // NUEVOS: Campos de documentación
  FechaVencimientoSOAT?: string;     // "2025-12-31" (formato ISO)
  FechaVencimientoTecnomecanica?: string; // "2025-06-30" (formato ISO)
  
  // NUEVOS: Campos de estado legal
  EstadoImpuestos?: 'Al Dia' | 'Debe';
  AniosImpuestosPendientes?: string; // "2020,2021,2022"
  TieneEmbargos?: boolean;           // true o false
}
```

---

## 🎨 Ejemplo de Formulario Angular

### **HTML Template**

```html
<!-- Sección: Información Técnica del Vehículo -->
<div class="section-title">Información Técnica</div>

<div class="form-row">
  <mat-form-field>
    <mat-label>Clase</mat-label>
    <mat-select formControlName="Clase">
      <mat-option value="AUTOMOVIL">Automóvil</mat-option>
      <mat-option value="CAMIONETA">Camioneta</mat-option>
      <mat-option value="CAMPERO">Campero</mat-option>
      <mat-option value="BUS">Bus</mat-option>
      <mat-option value="CAMION">Camión</mat-option>
    </mat-select>
  </mat-form-field>

  <mat-form-field>
    <mat-label>Línea</mat-label>
    <input matInput formControlName="Linea" placeholder="Ej: COROLLA GLI 1.8">
  </mat-form-field>
</div>

<div class="form-row">
  <mat-form-field>
    <mat-label>Cilindraje</mat-label>
    <input matInput formControlName="Cilindraje" placeholder="Ej: 1800cc">
  </mat-form-field>

  <mat-form-field>
    <mat-label>Capacidad (Pasajeros)</mat-label>
    <input matInput type="number" formControlName="Capacidad" placeholder="5">
  </mat-form-field>
</div>

<div class="form-row">
  <mat-form-field>
    <mat-label>Número de Motor</mat-label>
    <input matInput formControlName="NumeroMotor" placeholder="Ej: 3SZ4 CILINDROS">
  </mat-form-field>

  <mat-form-field>
    <mat-label>Serie</mat-label>
    <input matInput formControlName="Serie">
  </mat-form-field>
</div>

<div class="form-row">
  <mat-form-field>
    <mat-label>Color</mat-label>
    <input matInput formControlName="Color" placeholder="Ej: NEGRO">
  </mat-form-field>

  <mat-form-field>
    <mat-label>Tipo</mat-label>
    <input matInput formControlName="Tipo" placeholder="Ej: SPORT WAGON">
  </mat-form-field>
</div>

<div class="form-row">
  <mat-form-field>
    <mat-label>Servicio</mat-label>
    <mat-select formControlName="Servicio">
      <mat-option value="PRIVADO">Privado</mat-option>
      <mat-option value="PUBLICO">Público</mat-option>
      <mat-option value="OFICIAL">Oficial</mat-option>
      <mat-option value="DIPLOMATICO">Diplomático</mat-option>
    </mat-select>
  </mat-form-field>

  <mat-form-field>
    <mat-label>Número de Chasis</mat-label>
    <input matInput formControlName="NumeroChasis" placeholder="Ej: 8XAJ210G099511477">
  </mat-form-field>
</div>

<div class="form-row">
  <mat-form-field>
    <mat-label>Número de Carrocería</mat-label>
    <input matInput formControlName="NumeroCarroceria" placeholder="Ej: 8XAJ210G099511477">
  </mat-form-field>
</div>

<!-- Sección: Documentación del Vehículo -->
<div class="section-title">Documentación</div>

<div class="form-row">
  <mat-form-field>
    <mat-label>Vencimiento SOAT</mat-label>
    <input matInput [matDatepicker]="pickerSOAT" formControlName="FechaVencimientoSOAT">
    <mat-datepicker-toggle matSuffix [for]="pickerSOAT"></mat-datepicker-toggle>
    <mat-datepicker #pickerSOAT></mat-datepicker>
  </mat-form-field>

  <mat-form-field>
    <mat-label>Vencimiento Tecnomecánica</mat-label>
    <input matInput [matDatepicker]="pickerTecno" formControlName="FechaVencimientoTecnomecanica">
    <mat-datepicker-toggle matSuffix [for]="pickerTecno"></mat-datepicker-toggle>
    <mat-datepicker #pickerTecno></mat-datepicker>
  </mat-form-field>
</div>

<!-- Sección: Estado Legal -->
<div class="section-title">Estado Legal</div>

<div class="form-row">
  <mat-form-field>
    <mat-label>Estado de Impuestos</mat-label>
    <mat-select formControlName="EstadoImpuestos" (selectionChange)="onEstadoImpuestosChange($event)">
      <mat-option value="Al Dia">Al Día</mat-option>
      <mat-option value="Debe">Debe Impuestos</mat-option>
    </mat-select>
  </mat-form-field>

  <mat-form-field *ngIf="vehiculoForm.get('EstadoImpuestos')?.value === 'Debe'">
    <mat-label>Años Pendientes (separados por comas)</mat-label>
    <input matInput formControlName="AniosImpuestosPendientes" placeholder="Ej: 2020,2021,2022">
    <mat-hint>Ingrese los años separados por comas</mat-hint>
  </mat-form-field>
</div>

<div class="form-row">
  <mat-checkbox formControlName="TieneEmbargos">
    ¿El vehículo tiene embargos?
  </mat-checkbox>
</div>
```

### **TypeScript Component**

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehiculo-permuta-form',
  templateUrl: './vehiculo-permuta-form.component.html',
  styleUrls: ['./vehiculo-permuta-form.component.scss']
})
export class VehiculoPermutaFormComponent implements OnInit {
  vehiculoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.vehiculoForm = this.fb.group({
      // Campos básicos
      TipoBien: ['Vehiculo'],
      Rol: ['Entrega', Validators.required],
      Parte: ['Vendedor', Validators.required],
      Marca: ['', Validators.required],
      Modelo: ['', Validators.required],
      Anio: ['', Validators.required],
      Placa: ['', Validators.required],
      ValorComercial: ['', Validators.required],
      
      // Campos técnicos
      Clase: [''],
      Linea: [''],
      Cilindraje: [''],
      Capacidad: [''],
      NumeroMotor: [''],
      Serie: [''],
      Color: [''],
      Tipo: [''],
      Servicio: ['PRIVADO'],
      NumeroChasis: [''],
      NumeroCarroceria: [''],
      
      // Documentación
      FechaVencimientoSOAT: [''],
      FechaVencimientoTecnomecanica: [''],
      
      // Estado legal
      EstadoImpuestos: ['Al Dia'],
      AniosImpuestosPendientes: [''],
      TieneEmbargos: [false]
    });
  }

  onEstadoImpuestosChange(event: any): void {
    const estadoImpuestos = event.value;
    const aniosControl = this.vehiculoForm.get('AniosImpuestosPendientes');
    
    if (estadoImpuestos === 'Debe') {
      aniosControl?.setValidators([Validators.required]);
    } else {
      aniosControl?.clearValidators();
      aniosControl?.setValue('');
    }
    aniosControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.vehiculoForm.valid) {
      const vehiculoData = this.vehiculoForm.value;
      
      // Formatear fechas si existen
      if (vehiculoData.FechaVencimientoSOAT) {
        vehiculoData.FechaVencimientoSOAT = this.formatDate(vehiculoData.FechaVencimientoSOAT);
      }
      if (vehiculoData.FechaVencimientoTecnomecanica) {
        vehiculoData.FechaVencimientoTecnomecanica = this.formatDate(vehiculoData.FechaVencimientoTecnomecanica);
      }
      
      console.log('Datos del vehículo:', vehiculoData);
      // Aquí envías los datos al backend
    }
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
```

---

## 📤 Ejemplo de Payload al Backend

```json
{
  "TipoContrato": "Permuta",
  "ModalidadContrato": "Permuta",
  "VendedorNombre": "Juan Pérez",
  "VendedorDocumento": "12345678",
  "CompradorNombre": "María García",
  "CompradorDocumento": "87654321",
  "ValorContrato": 50000000,
  "FechaContrato": "2025-12-29",
  "bienes": [
    {
      "TipoBien": "Vehiculo",
      "Rol": "Entrega",
      "Parte": "Vendedor",
      "Marca": "DAIHATSU",
      "Modelo": "COROLLA GLI 1.8",
      "Anio": 2009,
      "Placa": "AB741NG",
      "ValorComercial": 25000000,
      "Clase": "CAMIONETA",
      "Linea": "COROLLA GLI 1.8",
      "Cilindraje": "1800cc",
      "Capacidad": 5,
      "NumeroMotor": "3SZ4 CILINDROS",
      "Serie": "",
      "Color": "NEGRO",
      "Tipo": "SPORT WAGON",
      "Servicio": "PRIVADO",
      "NumeroChasis": "8XAJ210G099511477",
      "NumeroCarroceria": "8XAJ210G099511477",
      "FechaVencimientoSOAT": "2025-12-31",
      "FechaVencimientoTecnomecanica": "2025-06-30",
      "EstadoImpuestos": "Debe",
      "AniosImpuestosPendientes": "2022,2023",
      "TieneEmbargos": false
    },
    {
      "TipoBien": "Vehiculo",
      "Rol": "Recibe",
      "Parte": "Vendedor",
      "Marca": "CHEVROLET",
      "Modelo": "SPARK GT",
      "Anio": 2015,
      "Placa": "XYZ123",
      "ValorComercial": 20000000,
      "Clase": "AUTOMOVIL",
      "Color": "BLANCO",
      "Servicio": "PRIVADO",
      "FechaVencimientoSOAT": "2026-03-15",
      "FechaVencimientoTecnomecanica": "2025-09-20",
      "EstadoImpuestos": "Al Dia",
      "TieneEmbargos": false
    }
  ]
}
```

---

## ✅ Validaciones Recomendadas

### **Frontend (Angular)**

```typescript
// Validación de placa colombiana
placaValidator(control: AbstractControl): ValidationErrors | null {
  const placa = control.value;
  const placaRegex = /^[A-Z]{3}[0-9]{3}$/;
  return placaRegex.test(placa) ? null : { placaInvalida: true };
}

// Validación de años pendientes
aniosPendientesValidator(control: AbstractControl): ValidationErrors | null {
  const anios = control.value;
  if (!anios) return null;
  
  const aniosArray = anios.split(',').map((a: string) => a.trim());
  const currentYear = new Date().getFullYear();
  
  for (const anio of aniosArray) {
    const year = parseInt(anio);
    if (isNaN(year) || year < 1900 || year > currentYear) {
      return { aniosInvalidos: true };
    }
  }
  
  return null;
}

// Validación de fecha de vencimiento
fechaVencimientoValidator(control: AbstractControl): ValidationErrors | null {
  const fecha = new Date(control.value);
  const hoy = new Date();
  
  if (fecha < hoy) {
    return { documentoVencido: true };
  }
  
  return null;
}
```

---

## 🎯 Campos Obligatorios vs Opcionales

### **Obligatorios para Vehículos**
- ✅ Marca
- ✅ Modelo
- ✅ Año
- ✅ Placa
- ✅ ValorComercial

### **Recomendados (Opcionales pero importantes)**
- 🔶 Clase
- 🔶 Color
- 🔶 NumeroChasis
- 🔶 NumeroMotor
- 🔶 FechaVencimientoSOAT
- 🔶 FechaVencimientoTecnomecanica
- 🔶 EstadoImpuestos

### **Opcionales**
- ⚪ Linea
- ⚪ Cilindraje
- ⚪ Capacidad
- ⚪ Serie
- ⚪ Tipo
- ⚪ Servicio
- ⚪ NumeroCarroceria
- ⚪ AniosImpuestosPendientes (solo si debe impuestos)
- ⚪ TieneEmbargos

---

## 🚨 Alertas y Advertencias

### **Mostrar Alertas en el Frontend**

```typescript
verificarEstadoVehiculo(vehiculo: any): void {
  const alertas: string[] = [];
  
  // Verificar SOAT vencido
  if (vehiculo.FechaVencimientoSOAT) {
    const soat = new Date(vehiculo.FechaVencimientoSOAT);
    const hoy = new Date();
    if (soat < hoy) {
      alertas.push('⚠️ SOAT vencido');
    }
  }
  
  // Verificar tecnomecánica vencida
  if (vehiculo.FechaVencimientoTecnomecanica) {
    const tecno = new Date(vehiculo.FechaVencimientoTecnomecanica);
    const hoy = new Date();
    if (tecno < hoy) {
      alertas.push('⚠️ Tecnomecánica vencida');
    }
  }
  
  // Verificar impuestos pendientes
  if (vehiculo.EstadoImpuestos === 'Debe') {
    alertas.push(`⚠️ Debe impuestos de los años: ${vehiculo.AniosImpuestosPendientes}`);
  }
  
  // Verificar embargos
  if (vehiculo.TieneEmbargos) {
    alertas.push('🚫 VEHÍCULO CON EMBARGOS - No se puede transferir');
  }
  
  if (alertas.length > 0) {
    this.mostrarAlerta(alertas.join('\n'));
  }
}
```

---

## 📊 Visualización en Listado de Contratos

```html
<!-- Badge para estado del vehículo -->
<div class="vehicle-status">
  <span class="badge badge-success" *ngIf="bien.EstadoImpuestos === 'Al Dia'">
    ✓ Al Día
  </span>
  <span class="badge badge-warning" *ngIf="bien.EstadoImpuestos === 'Debe'">
    ⚠ Debe Impuestos
  </span>
  <span class="badge badge-danger" *ngIf="bien.TieneEmbargos">
    🚫 Con Embargos
  </span>
</div>
```

---

## 🔍 Consulta de Vehículo Completo

```typescript
// Servicio para obtener detalles completos del vehículo
getVehiculoCompleto(bienContratoId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/bienes-contrato/${bienContratoId}`);
}
```

---

## ✨ Resumen de Cambios

1. ✅ **16 campos nuevos** agregados a `BienesContrato`
2. ✅ **Migración SQL** ejecutada correctamente
3. ✅ **Modelo Sequelize** actualizado
4. ✅ **Controlador** actualizado para aceptar nuevos campos
5. ✅ **Índices** creados para búsquedas eficientes
6. ✅ **Validaciones** en base de datos

---

**Backend 100% Listo para Capturar Información Detallada de Vehículos** 🚀

Ahora puedes implementar el formulario en el frontend siguiendo esta guía.
