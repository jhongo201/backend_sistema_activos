# 🚗 Guía: Formulario Completo de Vehículo para Todos los Contratos

## 📌 Alcance

Esta guía aplica para **TODOS los tipos de contratos** que involucren vehículos:
- ✅ **Compraventa de Vehículo**
- ✅ **Permuta con Vehículos**
- ✅ **Cualquier otro contrato que incluya un vehículo**

---

## 🎯 Cuándo Solicitar Estos Campos

### **Regla General**
Siempre que el usuario seleccione o agregue un **vehículo** en cualquier tipo de contrato, el sistema debe solicitar **TODOS** los campos detallados del vehículo.

### **Flujos de Captura**

#### **1. Compraventa Simple de Vehículo**
```
Usuario selecciona: "Tipo de Contrato: Compraventa"
Usuario selecciona: "Vehículo" (del inventario o nuevo)
↓
Sistema muestra: FORMULARIO COMPLETO DE VEHÍCULO
```

#### **2. Permuta con Vehículos**
```
Usuario selecciona: "Tipo de Contrato: Permuta"
Usuario agrega: "Bien que entrega: Vehículo"
↓
Sistema muestra: FORMULARIO COMPLETO DE VEHÍCULO

Usuario agrega: "Bien que recibe: Vehículo"
↓
Sistema muestra: FORMULARIO COMPLETO DE VEHÍCULO
```

#### **3. Cualquier Otro Contrato**
```
Si TipoBien === 'Vehiculo' || TipoBien === 'Moto'
↓
Sistema muestra: FORMULARIO COMPLETO DE VEHÍCULO
```

---

## 📋 Campos del Formulario Completo

### **Sección 1: Información Básica (Obligatoria)**
```typescript
{
  Marca: string;          // Obligatorio
  Modelo: string;         // Obligatorio
  Anio: number;          // Obligatorio
  Placa: string;         // Obligatorio
  ValorComercial: number; // Obligatorio
}
```

### **Sección 2: Información Técnica (Recomendada)**
```typescript
{
  Clase: string;          // CAMIONETA, AUTOMOVIL, etc.
  Linea: string;          // COROLLA GLI 1.8
  Cilindraje: string;     // 1800cc
  Capacidad: number;      // 5 pasajeros
  NumeroMotor: string;    // 3SZ4 CILINDROS
  Serie: string;          // Número de serie
  Color: string;          // NEGRO
  Tipo: string;           // SPORT WAGON
  Servicio: string;       // PRIVADO, PUBLICO
  NumeroChasis: string;   // 8XAJ210G099511477
  NumeroCarroceria: string; // 8XAJ210G099511477
}
```

### **Sección 3: Documentación (Muy Importante)**
```typescript
{
  FechaVencimientoSOAT: Date;           // Fecha vencimiento SOAT
  FechaVencimientoTecnomecanica: Date;  // Fecha vencimiento tecnomecánica
}
```

### **Sección 4: Estado Legal (Crítico)**
```typescript
{
  EstadoImpuestos: 'Al Dia' | 'Debe';   // Estado de impuestos
  AniosImpuestosPendientes?: string;     // "2020,2021,2022" (si debe)
  TieneEmbargos: boolean;                // true/false
}
```

---

## 🎨 Implementación en Angular

### **Componente: VehiculoFormComponent**

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehiculo-form',
  templateUrl: './vehiculo-form.component.html',
  styleUrls: ['./vehiculo-form.component.scss']
})
export class VehiculoFormComponent implements OnInit {
  @Input() tipoContrato: string = ''; // 'Compraventa', 'Permuta', etc.
  @Input() rol?: string; // Solo para permutas: 'Entrega' o 'Recibe'
  @Input() parte?: string; // Solo para permutas: 'Vendedor' o 'Comprador'
  @Output() vehiculoGuardado = new EventEmitter<any>();

  vehiculoForm!: FormGroup;
  mostrarAniosPendientes = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.vehiculoForm = this.fb.group({
      // Campos básicos (OBLIGATORIOS)
      TipoBien: ['Vehiculo'],
      Marca: ['', Validators.required],
      Modelo: ['', Validators.required],
      Anio: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      Placa: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9]{3}$/)]],
      ValorComercial: ['', [Validators.required, Validators.min(0)]],
      
      // Campos técnicos (RECOMENDADOS)
      Clase: ['', Validators.required],
      Linea: [''],
      Cilindraje: [''],
      Capacidad: ['', Validators.min(1)],
      NumeroMotor: [''],
      Serie: [''],
      Color: ['', Validators.required],
      Tipo: [''],
      Servicio: ['PRIVADO', Validators.required],
      NumeroChasis: [''],
      NumeroCarroceria: [''],
      
      // Documentación (MUY IMPORTANTE)
      FechaVencimientoSOAT: ['', Validators.required],
      FechaVencimientoTecnomecanica: ['', Validators.required],
      
      // Estado legal (CRÍTICO)
      EstadoImpuestos: ['Al Dia', Validators.required],
      AniosImpuestosPendientes: [''],
      TieneEmbargos: [false],
      
      // Campos adicionales
      Matricula: [''],
      Observaciones: [''],
      DescripcionBien: ['']
    });

    // Para permutas, agregar campos de rol y parte
    if (this.tipoContrato === 'Permuta') {
      this.vehiculoForm.addControl('Rol', this.fb.control(this.rol || 'Entrega', Validators.required));
      this.vehiculoForm.addControl('Parte', this.fb.control(this.parte || 'Vendedor', Validators.required));
    }

    // Listener para estado de impuestos
    this.vehiculoForm.get('EstadoImpuestos')?.valueChanges.subscribe(estado => {
      this.onEstadoImpuestosChange(estado);
    });
  }

  onEstadoImpuestosChange(estado: string): void {
    const aniosControl = this.vehiculoForm.get('AniosImpuestosPendientes');
    
    if (estado === 'Debe') {
      this.mostrarAniosPendientes = true;
      aniosControl?.setValidators([Validators.required]);
    } else {
      this.mostrarAniosPendientes = false;
      aniosControl?.clearValidators();
      aniosControl?.setValue('');
    }
    aniosControl?.updateValueAndValidity();
  }

  verificarDocumentosVencidos(): { soatVencido: boolean, tecnoVencida: boolean } {
    const hoy = new Date();
    const soat = this.vehiculoForm.get('FechaVencimientoSOAT')?.value;
    const tecno = this.vehiculoForm.get('FechaVencimientoTecnomecanica')?.value;

    return {
      soatVencido: soat ? new Date(soat) < hoy : false,
      tecnoVencida: tecno ? new Date(tecno) < hoy : false
    };
  }

  onSubmit(): void {
    if (this.vehiculoForm.invalid) {
      this.vehiculoForm.markAllAsTouched();
      return;
    }

    // Verificar documentos vencidos
    const { soatVencido, tecnoVencida } = this.verificarDocumentosVencidos();
    const tieneEmbargos = this.vehiculoForm.get('TieneEmbargos')?.value;

    // Mostrar advertencias
    const advertencias: string[] = [];
    if (soatVencido) advertencias.push('⚠️ SOAT vencido');
    if (tecnoVencida) advertencias.push('⚠️ Tecnomecánica vencida');
    if (tieneEmbargos) advertencias.push('🚫 Vehículo con embargos - No se puede transferir');

    if (advertencias.length > 0) {
      const continuar = confirm(
        `ADVERTENCIAS:\n${advertencias.join('\n')}\n\n¿Desea continuar de todas formas?`
      );
      if (!continuar) return;
    }

    // Formatear fechas
    const vehiculoData = { ...this.vehiculoForm.value };
    if (vehiculoData.FechaVencimientoSOAT) {
      vehiculoData.FechaVencimientoSOAT = this.formatDate(vehiculoData.FechaVencimientoSOAT);
    }
    if (vehiculoData.FechaVencimientoTecnomecanica) {
      vehiculoData.FechaVencimientoTecnomecanica = this.formatDate(vehiculoData.FechaVencimientoTecnomecanica);
    }

    this.vehiculoGuardado.emit(vehiculoData);
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

### **Template HTML**

```html
<form [formGroup]="vehiculoForm" (ngSubmit)="onSubmit()">
  
  <!-- SECCIÓN 1: INFORMACIÓN BÁSICA -->
  <mat-card class="section-card">
    <mat-card-header>
      <mat-card-title>📋 Información Básica del Vehículo</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      
      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Marca *</mat-label>
          <input matInput formControlName="Marca" placeholder="Ej: CHEVROLET">
          <mat-error *ngIf="vehiculoForm.get('Marca')?.hasError('required')">
            La marca es obligatoria
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Modelo *</mat-label>
          <input matInput formControlName="Modelo" placeholder="Ej: SPARK GT">
          <mat-error *ngIf="vehiculoForm.get('Modelo')?.hasError('required')">
            El modelo es obligatorio
          </mat-error>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Año *</mat-label>
          <input matInput type="number" formControlName="Anio" placeholder="2020">
          <mat-error *ngIf="vehiculoForm.get('Anio')?.hasError('required')">
            El año es obligatorio
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Placa *</mat-label>
          <input matInput formControlName="Placa" placeholder="ABC123" maxlength="6" 
                 style="text-transform: uppercase;">
          <mat-hint>Formato: ABC123</mat-hint>
          <mat-error *ngIf="vehiculoForm.get('Placa')?.hasError('pattern')">
            Formato inválido (debe ser 3 letras y 3 números)
          </mat-error>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Valor Comercial *</mat-label>
          <input matInput type="number" formControlName="ValorComercial" placeholder="25000000">
          <span matPrefix>$ &nbsp;</span>
          <mat-error *ngIf="vehiculoForm.get('ValorComercial')?.hasError('required')">
            El valor comercial es obligatorio
          </mat-error>
        </mat-form-field>
      </div>

    </mat-card-content>
  </mat-card>

  <!-- SECCIÓN 2: INFORMACIÓN TÉCNICA -->
  <mat-card class="section-card">
    <mat-card-header>
      <mat-card-title>🔧 Información Técnica</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      
      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Clase *</mat-label>
          <mat-select formControlName="Clase">
            <mat-option value="AUTOMOVIL">Automóvil</mat-option>
            <mat-option value="CAMIONETA">Camioneta</mat-option>
            <mat-option value="CAMPERO">Campero</mat-option>
            <mat-option value="BUS">Bus</mat-option>
            <mat-option value="CAMION">Camión</mat-option>
            <mat-option value="MOTOCICLETA">Motocicleta</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Color *</mat-label>
          <input matInput formControlName="Color" placeholder="Ej: NEGRO">
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Línea</mat-label>
          <input matInput formControlName="Linea" placeholder="Ej: COROLLA GLI 1.8">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Cilindraje</mat-label>
          <input matInput formControlName="Cilindraje" placeholder="Ej: 1800cc">
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Capacidad (Pasajeros)</mat-label>
          <input matInput type="number" formControlName="Capacidad" placeholder="5">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <input matInput formControlName="Tipo" placeholder="Ej: SPORT WAGON">
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Servicio *</mat-label>
          <mat-select formControlName="Servicio">
            <mat-option value="PRIVADO">Privado</mat-option>
            <mat-option value="PUBLICO">Público</mat-option>
            <mat-option value="OFICIAL">Oficial</mat-option>
            <mat-option value="DIPLOMATICO">Diplomático</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Número de Motor</mat-label>
          <input matInput formControlName="NumeroMotor" placeholder="Ej: 3SZ4 CILINDROS">
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Número de Chasis</mat-label>
          <input matInput formControlName="NumeroChasis" placeholder="Ej: 8XAJ210G099511477">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Número de Carrocería</mat-label>
          <input matInput formControlName="NumeroCarroceria" placeholder="Ej: 8XAJ210G099511477">
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Serie</mat-label>
          <input matInput formControlName="Serie">
        </mat-form-field>
      </div>

    </mat-card-content>
  </mat-card>

  <!-- SECCIÓN 3: DOCUMENTACIÓN -->
  <mat-card class="section-card">
    <mat-card-header>
      <mat-card-title>📄 Documentación del Vehículo</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      
      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Vencimiento SOAT *</mat-label>
          <input matInput [matDatepicker]="pickerSOAT" formControlName="FechaVencimientoSOAT">
          <mat-datepicker-toggle matSuffix [for]="pickerSOAT"></mat-datepicker-toggle>
          <mat-datepicker #pickerSOAT></mat-datepicker>
          <mat-error *ngIf="vehiculoForm.get('FechaVencimientoSOAT')?.hasError('required')">
            La fecha de vencimiento del SOAT es obligatoria
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Vencimiento Tecnomecánica *</mat-label>
          <input matInput [matDatepicker]="pickerTecno" formControlName="FechaVencimientoTecnomecanica">
          <mat-datepicker-toggle matSuffix [for]="pickerTecno"></mat-datepicker-toggle>
          <mat-datepicker #pickerTecno></mat-datepicker>
          <mat-error *ngIf="vehiculoForm.get('FechaVencimientoTecnomecanica')?.hasError('required')">
            La fecha de vencimiento de la tecnomecánica es obligatoria
          </mat-error>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Matrícula</mat-label>
          <input matInput formControlName="Matricula">
        </mat-form-field>
      </div>

    </mat-card-content>
  </mat-card>

  <!-- SECCIÓN 4: ESTADO LEGAL -->
  <mat-card class="section-card alert-section">
    <mat-card-header>
      <mat-card-title>⚖️ Estado Legal del Vehículo</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      
      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Estado de Impuestos *</mat-label>
          <mat-select formControlName="EstadoImpuestos">
            <mat-option value="Al Dia">Al Día</mat-option>
            <mat-option value="Debe">Debe Impuestos</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" *ngIf="mostrarAniosPendientes">
          <mat-label>Años Pendientes *</mat-label>
          <input matInput formControlName="AniosImpuestosPendientes" 
                 placeholder="Ej: 2020,2021,2022">
          <mat-hint>Separe los años con comas</mat-hint>
          <mat-error *ngIf="vehiculoForm.get('AniosImpuestosPendientes')?.hasError('required')">
            Debe especificar los años pendientes
          </mat-error>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-checkbox formControlName="TieneEmbargos" color="warn">
          <strong>¿El vehículo tiene embargos?</strong>
        </mat-checkbox>
      </div>

      <mat-hint class="warning-hint" *ngIf="vehiculoForm.get('TieneEmbargos')?.value">
        ⚠️ ADVERTENCIA: Los vehículos con embargos no pueden ser transferidos legalmente
      </mat-hint>

    </mat-card-content>
  </mat-card>

  <!-- SECCIÓN 5: OBSERVACIONES -->
  <mat-card class="section-card">
    <mat-card-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Observaciones Adicionales</mat-label>
        <textarea matInput formControlName="Observaciones" rows="3"
                  placeholder="Cualquier información adicional relevante..."></textarea>
      </mat-form-field>
    </mat-card-content>
  </mat-card>

  <!-- BOTONES -->
  <div class="form-actions">
    <button mat-raised-button type="button" (click)="vehiculoForm.reset()">
      Limpiar
    </button>
    <button mat-raised-button color="primary" type="submit" 
            [disabled]="vehiculoForm.invalid">
      Guardar Vehículo
    </button>
  </div>

</form>
```

### **Estilos CSS**

```scss
.section-card {
  margin-bottom: 20px;
  
  mat-card-header {
    background-color: #f5f5f5;
    padding: 15px;
    margin: -16px -16px 16px -16px;
  }
}

.alert-section {
  border-left: 4px solid #ff9800;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  
  mat-form-field {
    flex: 1;
  }
  
  mat-form-field.full-width {
    flex: 1 1 100%;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 20px;
}

.warning-hint {
  color: #ff9800;
  font-weight: 500;
  display: block;
  margin-top: 10px;
}
```

---

## 🔄 Integración en Diferentes Tipos de Contratos

### **1. Compraventa Simple**

```typescript
// En el componente de crear contrato
onAgregarVehiculo(): void {
  const dialogRef = this.dialog.open(VehiculoFormComponent, {
    width: '800px',
    data: {
      tipoContrato: 'Compraventa'
    }
  });

  dialogRef.componentInstance.vehiculoGuardado.subscribe((vehiculo: any) => {
    this.contratoForm.patchValue({
      VehiculoID: vehiculo.VehiculoID,
      // ... otros campos del contrato
    });
    
    // Guardar datos del vehículo para enviar al backend
    this.datosVehiculo = vehiculo;
    dialogRef.close();
  });
}
```

### **2. Permuta**

```typescript
// En el componente de permuta
onAgregarBien(rol: 'Entrega' | 'Recibe', parte: 'Vendedor' | 'Comprador'): void {
  const dialogRef = this.dialog.open(VehiculoFormComponent, {
    width: '800px',
    data: {
      tipoContrato: 'Permuta',
      rol: rol,
      parte: parte
    }
  });

  dialogRef.componentInstance.vehiculoGuardado.subscribe((vehiculo: any) => {
    this.bienes.push(vehiculo);
    dialogRef.close();
  });
}
```

---

## ✅ Checklist de Implementación

- [ ] Crear componente `VehiculoFormComponent`
- [ ] Agregar validaciones de placa colombiana
- [ ] Implementar alertas para documentos vencidos
- [ ] Implementar advertencia para vehículos con embargos
- [ ] Integrar en formulario de Compraventa
- [ ] Integrar en formulario de Permuta
- [ ] Probar flujo completo de captura de datos
- [ ] Verificar que datos se envían correctamente al backend

---

## 🎯 Resumen

**Estos campos deben capturarse SIEMPRE que haya un vehículo en el contrato, sin importar el tipo de contrato.**

El backend ya está 100% preparado para recibir estos datos en cualquier tipo de contrato. Solo necesitas implementar el formulario en el frontend siguiendo esta guía.
