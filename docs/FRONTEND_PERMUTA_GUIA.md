# 🎨 Guía de Implementación Frontend: Soporte para Permutas

## 📋 Resumen de Cambios

El backend ahora soporta contratos de **Permuta** y **Permuta con Saldo**. Esta guía te ayudará a actualizar el frontend Angular para aprovechar estas nuevas funcionalidades.

---

## 🔧 Cambios Necesarios en el Frontend

### 1. **Actualizar Interfaces TypeScript**

#### `src/app/models/contrato.model.ts`

```typescript
export interface Bien {
  BienContratoID?: number;
  ContratoID?: number;
  TipoBien: 'Vehiculo' | 'Propiedad' | 'Moto' | 'Otro';
  Rol: 'Entrega' | 'Recibe';
  Parte: 'Vendedor' | 'Comprador';
  VehiculoID?: number | null;
  PropiedadID?: number | null;
  DescripcionBien?: string;
  ValorComercial: number;
  Marca?: string;
  Modelo?: string;
  Año?: number;
  Placa?: string;
  Matricula?: string;
  Observaciones?: string;
}

export interface Contrato {
  ContratoID?: number;
  TipoContrato: string;
  Folio?: string;
  VendedorNombre: string;
  VendedorDocumento: string;
  VendedorDireccion?: string;
  VendedorTelefono?: string;
  CompradorNombre: string;
  CompradorDocumento: string;
  CompradorDireccion?: string;
  CompradorTelefono?: string;
  VehiculoID?: number | null;
  PropiedadID?: number | null;
  ValorContrato: number;
  FormaPago: string;
  NumeroCuotas?: number;
  ValorCuota?: number;
  FechaContrato: string;
  FechaInicio?: string;
  FechaFin?: string;
  Clausulas?: string[];
  ObservacionesAdicionales?: string;
  
  // Nuevos campos para permutas
  ModalidadContrato?: 'Compraventa' | 'Permuta' | 'Permuta con Saldo';
  ValorTotalEntrega?: number;
  ValorTotalRecibe?: number;
  DiferenciaValor?: number;
  QuienPagaDiferencia?: 'Vendedor' | 'Comprador' | null;
  bienes?: Bien[];
  
  // Campos del sistema
  HashDocumento?: string;
  CodigoVerificacion?: string;
  RutaArchivo?: string;
  NombreArchivo?: string;
  UsuarioCreadorID?: number;
  FechaCreacion?: Date;
  EstadoContrato?: string;
}
```

---

### 2. **Actualizar Servicio de Contratos**

#### `src/app/services/contrato.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Contrato } from '../models/contrato.model';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private apiUrl = `${environment.apiUrl}/contratos`;

  constructor(private http: HttpClient) {}

  // Crear contrato (soporta compraventa y permuta)
  crear(contrato: Contrato): Observable<any> {
    return this.http.post(`${this.apiUrl}`, contrato);
  }

  // Obtener todos los contratos
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Obtener un contrato por ID (incluye bienes)
  getOne(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Descargar PDF del contrato
  descargar(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/descargar`, {
      responseType: 'blob'
    });
  }

  // Anular contrato
  anular(id: number, motivo: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/anular`, { motivo });
  }

  // Verificar contrato por código
  verificar(codigo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verificar/${codigo}`);
  }
}
```

---

### 3. **Crear Componente de Formulario de Contrato**

#### `src/app/components/contrato-form/contrato-form.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ContratoService } from '../../services/contrato.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contrato-form',
  templateUrl: './contrato-form.component.html',
  styleUrls: ['./contrato-form.component.css']
})
export class ContratoFormComponent implements OnInit {
  contratoForm!: FormGroup;
  loading = false;
  
  modalidades = [
    { value: 'Compraventa', label: 'Compraventa (Pago en dinero)' },
    { value: 'Permuta', label: 'Permuta (Intercambio sin dinero)' },
    { value: 'Permuta con Saldo', label: 'Permuta con Saldo (Intercambio + dinero)' }
  ];

  tiposBien = [
    { value: 'Vehiculo', label: 'Vehículo' },
    { value: 'Propiedad', label: 'Propiedad' },
    { value: 'Moto', label: 'Moto' },
    { value: 'Otro', label: 'Otro' }
  ];

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.contratoForm = this.fb.group({
      TipoContrato: ['', Validators.required],
      ModalidadContrato: ['Compraventa', Validators.required],
      VendedorNombre: ['', Validators.required],
      VendedorDocumento: ['', Validators.required],
      VendedorDireccion: [''],
      VendedorTelefono: [''],
      CompradorNombre: ['', Validators.required],
      CompradorDocumento: ['', Validators.required],
      CompradorDireccion: [''],
      CompradorTelefono: [''],
      ValorContrato: [0, [Validators.required, Validators.min(0)]],
      FormaPago: ['', Validators.required],
      FechaContrato: ['', Validators.required],
      Clausulas: this.fb.array([]),
      ObservacionesAdicionales: [''],
      bienes: this.fb.array([])
    });

    // Observar cambios en modalidad
    this.contratoForm.get('ModalidadContrato')?.valueChanges.subscribe(modalidad => {
      this.onModalidadChange(modalidad);
    });
  }

  get bienes(): FormArray {
    return this.contratoForm.get('bienes') as FormArray;
  }

  get clausulas(): FormArray {
    return this.contratoForm.get('Clausulas') as FormArray;
  }

  onModalidadChange(modalidad: string): void {
    if (modalidad === 'Compraventa') {
      // Limpiar bienes si cambia a compraventa
      this.bienes.clear();
    } else {
      // Asegurar al menos un bien para permuta
      if (this.bienes.length === 0) {
        this.agregarBien();
      }
    }
  }

  agregarBien(): void {
    const bienGroup = this.fb.group({
      TipoBien: ['Vehiculo', Validators.required],
      Rol: ['Entrega', Validators.required],
      Parte: ['Vendedor', Validators.required],
      DescripcionBien: ['', Validators.required],
      ValorComercial: [0, [Validators.required, Validators.min(0)]],
      Marca: [''],
      Modelo: [''],
      Año: [null],
      Placa: [''],
      Matricula: [''],
      Observaciones: ['']
    });

    this.bienes.push(bienGroup);
  }

  eliminarBien(index: number): void {
    this.bienes.removeAt(index);
  }

  agregarClausula(): void {
    this.clausulas.push(this.fb.control('', Validators.required));
  }

  eliminarClausula(index: number): void {
    this.clausulas.removeAt(index);
  }

  calcularResumen(): any {
    const modalidad = this.contratoForm.get('ModalidadContrato')?.value;
    
    if (modalidad === 'Compraventa') {
      return null;
    }

    const bienes = this.bienes.value;
    
    const valorEntrega = bienes
      .filter((b: any) => b.Parte === 'Vendedor' && b.Rol === 'Entrega')
      .reduce((sum: number, b: any) => sum + parseFloat(b.ValorComercial || 0), 0);
    
    const valorRecibe = bienes
      .filter((b: any) => b.Parte === 'Vendedor' && b.Rol === 'Recibe')
      .reduce((sum: number, b: any) => sum + parseFloat(b.ValorComercial || 0), 0);
    
    const diferencia = Math.abs(valorRecibe - valorEntrega);
    
    let quienPaga = null;
    if (valorRecibe > valorEntrega) {
      quienPaga = 'Vendedor';
    } else if (valorEntrega > valorRecibe) {
      quienPaga = 'Comprador';
    }

    return {
      valorEntrega,
      valorRecibe,
      diferencia,
      quienPaga
    };
  }

  onSubmit(): void {
    if (this.contratoForm.invalid) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.loading = true;
    const formData = this.contratoForm.value;

    // Convertir clausulas array a formato esperado
    if (formData.Clausulas && formData.Clausulas.length > 0) {
      formData.Clausulas = formData.Clausulas.filter((c: string) => c.trim());
    }

    this.contratoService.crear(formData).subscribe({
      next: (response) => {
        alert('Contrato creado exitosamente');
        this.router.navigate(['/contratos']);
      },
      error: (error) => {
        console.error('Error al crear contrato:', error);
        alert('Error al crear contrato: ' + (error.error?.message || 'Error desconocido'));
        this.loading = false;
      }
    });
  }
}
```

---

### 4. **Template HTML del Formulario**

#### `src/app/components/contrato-form/contrato-form.component.html`

```html
<div class="container mt-4">
  <h2>Crear Nuevo Contrato</h2>

  <form [formGroup]="contratoForm" (ngSubmit)="onSubmit()">
    
    <!-- Tipo y Modalidad -->
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label>Tipo de Contrato *</label>
          <input type="text" class="form-control" formControlName="TipoContrato" 
                 placeholder="Ej: Compraventa Vehicular">
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label>Modalidad *</label>
          <select class="form-control" formControlName="ModalidadContrato">
            <option *ngFor="let mod of modalidades" [value]="mod.value">
              {{ mod.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Datos del Vendedor -->
    <h4 class="mt-4">Datos del Vendedor</h4>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label>Nombre Completo *</label>
          <input type="text" class="form-control" formControlName="VendedorNombre">
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label>Documento *</label>
          <input type="text" class="form-control" formControlName="VendedorDocumento">
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label>Dirección</label>
          <input type="text" class="form-control" formControlName="VendedorDireccion">
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label>Teléfono</label>
          <input type="text" class="form-control" formControlName="VendedorTelefono">
        </div>
      </div>
    </div>

    <!-- Datos del Comprador -->
    <h4 class="mt-4">Datos del Comprador</h4>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label>Nombre Completo *</label>
          <input type="text" class="form-control" formControlName="CompradorNombre">
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label>Documento *</label>
          <input type="text" class="form-control" formControlName="CompradorDocumento">
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label>Dirección</label>
          <input type="text" class="form-control" formControlName="CompradorDireccion">
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label>Teléfono</label>
          <input type="text" class="form-control" formControlName="CompradorTelefono">
        </div>
      </div>
    </div>

    <!-- Bienes (solo para Permuta) -->
    <div *ngIf="contratoForm.get('ModalidadContrato')?.value !== 'Compraventa'" class="mt-4">
      <h4>Bienes a Intercambiar</h4>
      <button type="button" class="btn btn-primary mb-3" (click)="agregarBien()">
        + Agregar Bien
      </button>

      <div formArrayName="bienes">
        <div *ngFor="let bien of bienes.controls; let i = index" [formGroupName]="i" 
             class="card mb-3">
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <label>Tipo de Bien *</label>
                <select class="form-control" formControlName="TipoBien">
                  <option *ngFor="let tipo of tiposBien" [value]="tipo.value">
                    {{ tipo.label }}
                  </option>
                </select>
              </div>
              <div class="col-md-3">
                <label>Rol *</label>
                <select class="form-control" formControlName="Rol">
                  <option value="Entrega">Entrega</option>
                  <option value="Recibe">Recibe</option>
                </select>
              </div>
              <div class="col-md-3">
                <label>Parte *</label>
                <select class="form-control" formControlName="Parte">
                  <option value="Vendedor">Vendedor</option>
                  <option value="Comprador">Comprador</option>
                </select>
              </div>
              <div class="col-md-3">
                <label>Valor Comercial *</label>
                <input type="number" class="form-control" formControlName="ValorComercial">
              </div>
            </div>

            <div class="row mt-2">
              <div class="col-md-12">
                <label>Descripción *</label>
                <input type="text" class="form-control" formControlName="DescripcionBien"
                       placeholder="Ej: Mazda 3 2020 Blanco">
              </div>
            </div>

            <div class="row mt-2">
              <div class="col-md-3">
                <label>Marca</label>
                <input type="text" class="form-control" formControlName="Marca">
              </div>
              <div class="col-md-3">
                <label>Modelo</label>
                <input type="text" class="form-control" formControlName="Modelo">
              </div>
              <div class="col-md-2">
                <label>Año</label>
                <input type="number" class="form-control" formControlName="Año">
              </div>
              <div class="col-md-2">
                <label>Placa</label>
                <input type="text" class="form-control" formControlName="Placa">
              </div>
              <div class="col-md-2">
                <label>Matrícula</label>
                <input type="text" class="form-control" formControlName="Matricula">
              </div>
            </div>

            <button type="button" class="btn btn-danger btn-sm mt-2" (click)="eliminarBien(i)">
              Eliminar Bien
            </button>
          </div>
        </div>
      </div>

      <!-- Resumen de Valores -->
      <div *ngIf="bienes.length > 0" class="alert alert-info">
        <h5>Resumen de Valores</h5>
        <ng-container *ngIf="calcularResumen() as resumen">
          <p><strong>Valor total entregado por Vendedor:</strong> ${{ resumen.valorEntrega | number }}</p>
          <p><strong>Valor total recibido por Vendedor:</strong> ${{ resumen.valorRecibe | number }}</p>
          <p *ngIf="resumen.diferencia > 0">
            <strong>Diferencia:</strong> ${{ resumen.diferencia | number }}
            <br>
            <strong>Quien paga la diferencia:</strong> {{ resumen.quienPaga }}
          </p>
        </ng-container>
      </div>
    </div>

    <!-- Valor y Forma de Pago -->
    <h4 class="mt-4">Valor y Forma de Pago</h4>
    <div class="row">
      <div class="col-md-4">
        <div class="form-group">
          <label>Valor del Contrato *</label>
          <input type="number" class="form-control" formControlName="ValorContrato">
        </div>
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <label>Forma de Pago *</label>
          <select class="form-control" formControlName="FormaPago">
            <option value="Efectivo">Efectivo</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Mixto">Mixto</option>
            <option value="Permuta">Permuta</option>
          </select>
        </div>
      </div>
      <div class="col-md-4">
        <div class="form-group">
          <label>Fecha del Contrato *</label>
          <input type="date" class="form-control" formControlName="FechaContrato">
        </div>
      </div>
    </div>

    <!-- Cláusulas -->
    <h4 class="mt-4">Cláusulas</h4>
    <button type="button" class="btn btn-secondary mb-2" (click)="agregarClausula()">
      + Agregar Cláusula
    </button>
    <div formArrayName="Clausulas">
      <div *ngFor="let clausula of clausulas.controls; let i = index" class="input-group mb-2">
        <input type="text" class="form-control" [formControlName]="i" 
               placeholder="Cláusula {{ i + 1 }}">
        <button type="button" class="btn btn-danger" (click)="eliminarClausula(i)">
          Eliminar
        </button>
      </div>
    </div>

    <!-- Observaciones -->
    <div class="form-group mt-3">
      <label>Observaciones Adicionales</label>
      <textarea class="form-control" formControlName="ObservacionesAdicionales" rows="3"></textarea>
    </div>

    <!-- Botones -->
    <div class="mt-4">
      <button type="submit" class="btn btn-success" [disabled]="loading || contratoForm.invalid">
        {{ loading ? 'Generando...' : 'Generar Contrato' }}
      </button>
      <button type="button" class="btn btn-secondary ml-2" routerLink="/contratos">
        Cancelar
      </button>
    </div>
  </form>
</div>
```

---

### 5. **Componente de Visualización de Contrato**

#### `src/app/components/contrato-detalle/contrato-detalle.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContratoService } from '../../services/contrato.service';
import { Contrato } from '../../models/contrato.model';

@Component({
  selector: 'app-contrato-detalle',
  templateUrl: './contrato-detalle.component.html'
})
export class ContratoDetalleComponent implements OnInit {
  contrato?: Contrato;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private contratoService: ContratoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.cargarContrato(id);
  }

  cargarContrato(id: number): void {
    this.contratoService.getOne(id).subscribe({
      next: (response) => {
        this.contrato = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar contrato:', error);
        this.loading = false;
      }
    });
  }

  descargarPDF(): void {
    if (!this.contrato?.ContratoID) return;

    this.contratoService.descargar(this.contrato.ContratoID).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.contrato?.Folio}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al descargar PDF:', error);
        alert('Error al descargar el PDF');
      }
    });
  }

  getBienesVendedor(rol: string) {
    return this.contrato?.bienes?.filter(b => b.Parte === 'Vendedor' && b.Rol === rol) || [];
  }

  getBienesComprador(rol: string) {
    return this.contrato?.bienes?.filter(b => b.Parte === 'Comprador' && b.Rol === rol) || [];
  }
}
```

---

### 6. **Template de Visualización**

#### `src/app/components/contrato-detalle/contrato-detalle.component.html`

```html
<div class="container mt-4" *ngIf="!loading && contrato">
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h3>Contrato {{ contrato.Folio }}</h3>
      <button class="btn btn-primary" (click)="descargarPDF()">
        Descargar PDF
      </button>
    </div>
    <div class="card-body">
      
      <!-- Información General -->
      <div class="row">
        <div class="col-md-6">
          <p><strong>Tipo:</strong> {{ contrato.TipoContrato }}</p>
          <p><strong>Modalidad:</strong> {{ contrato.ModalidadContrato }}</p>
          <p><strong>Fecha:</strong> {{ contrato.FechaContrato | date }}</p>
          <p><strong>Estado:</strong> <span class="badge badge-success">{{ contrato.EstadoContrato }}</span></p>
        </div>
        <div class="col-md-6">
          <p><strong>Valor:</strong> ${{ contrato.ValorContrato | number }}</p>
          <p><strong>Forma de Pago:</strong> {{ contrato.FormaPago }}</p>
        </div>
      </div>

      <hr>

      <!-- Partes -->
      <div class="row">
        <div class="col-md-6">
          <h5>Vendedor</h5>
          <p>{{ contrato.VendedorNombre }}</p>
          <p>{{ contrato.VendedorDocumento }}</p>
        </div>
        <div class="col-md-6">
          <h5>Comprador</h5>
          <p>{{ contrato.CompradorNombre }}</p>
          <p>{{ contrato.CompradorDocumento }}</p>
        </div>
      </div>

      <!-- Bienes (solo si es permuta) -->
      <div *ngIf="contrato.ModalidadContrato !== 'Compraventa' && contrato.bienes && contrato.bienes.length > 0">
        <hr>
        <h4>Bienes Intercambiados</h4>

        <div class="row mt-3">
          <div class="col-md-6">
            <h5>Bienes que entrega el Vendedor</h5>
            <ul class="list-group">
              <li *ngFor="let bien of getBienesVendedor('Entrega')" class="list-group-item">
                <strong>{{ bien.DescripcionBien }}</strong><br>
                <small>{{ bien.Marca }} {{ bien.Modelo }} {{ bien.Año }}</small><br>
                <span class="text-success">${{ bien.ValorComercial | number }}</span>
              </li>
            </ul>
          </div>

          <div class="col-md-6">
            <h5>Bienes que recibe el Vendedor</h5>
            <ul class="list-group">
              <li *ngFor="let bien of getBienesVendedor('Recibe')" class="list-group-item">
                <strong>{{ bien.DescripcionBien }}</strong><br>
                <small>{{ bien.Marca }} {{ bien.Modelo }} {{ bien.Año }}</small><br>
                <span class="text-success">${{ bien.ValorComercial | number }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Resumen de Valores -->
        <div class="alert alert-info mt-3" *ngIf="contrato.DiferenciaValor">
          <h5>Resumen Financiero</h5>
          <p><strong>Valor total entregado:</strong> ${{ contrato.ValorTotalEntrega | number }}</p>
          <p><strong>Valor total recibido:</strong> ${{ contrato.ValorTotalRecibe | number }}</p>
          <p *ngIf="contrato.DiferenciaValor > 0">
            <strong>Diferencia:</strong> ${{ contrato.DiferenciaValor | number }}<br>
            <strong>Quien paga:</strong> {{ contrato.QuienPagaDiferencia }}
          </p>
        </div>
      </div>

    </div>
  </div>
</div>

<div *ngIf="loading" class="text-center mt-5">
  <div class="spinner-border" role="status">
    <span class="sr-only">Cargando...</span>
  </div>
</div>
```

---

## 🚀 Pasos de Implementación

### 1. **Ejecutar Migración SQL** (Backend)
```bash
sqlcmd -S localhost\SQLEXPRESS -d SistemaActivos -i backend/migrations/add_barter_support.sql
```

### 2. **Actualizar Modelos TypeScript** (Frontend)
- Copiar la interfaz `Bien` y actualizar `Contrato` en `src/app/models/contrato.model.ts`

### 3. **Actualizar Servicio**
- Verificar que `ContratoService` tenga todos los métodos necesarios

### 4. **Crear/Actualizar Componentes**
- Implementar `ContratoFormComponent` con soporte para bienes
- Implementar `ContratoDetalleComponent` para visualizar permutas

### 5. **Actualizar Rutas**
```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: 'contratos/nuevo', component: ContratoFormComponent },
  { path: 'contratos/:id', component: ContratoDetalleComponent },
  { path: 'contratos', component: ContratoListComponent }
];
```

### 6. **Probar Funcionalidad**
- Crear contrato de compraventa (sin cambios)
- Crear contrato de permuta pura
- Crear contrato de permuta con saldo
- Verificar PDF generado
- Verificar visualización de contratos

---

## 📝 Ejemplo de Payload para Testing

### Permuta con Saldo (Postman/Frontend)

```json
{
  "TipoContrato": "Permuta Vehicular",
  "ModalidadContrato": "Permuta con Saldo",
  "VendedorNombre": "Juan Pérez",
  "VendedorDocumento": "123456789",
  "VendedorDireccion": "Calle 10 #20-30",
  "CompradorNombre": "María López",
  "CompradorDocumento": "987654321",
  "CompradorDireccion": "Carrera 5 #15-25",
  "ValorContrato": 70000000,
  "FormaPago": "Mixto",
  "FechaContrato": "2025-12-28",
  "Clausulas": [
    "PRIMERA - El vendedor entrega el vehículo descrito",
    "SEGUNDA - El comprador entrega el vehículo descrito",
    "TERCERA - El vendedor paga la diferencia en efectivo"
  ],
  "bienes": [
    {
      "TipoBien": "Vehiculo",
      "Rol": "Entrega",
      "Parte": "Vendedor",
      "DescripcionBien": "Mazda 3 2020 Blanco",
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
      "DescripcionBien": "Toyota Prado 2022 Negra",
      "ValorComercial": 70000000,
      "Marca": "Toyota",
      "Modelo": "Prado",
      "Año": 2022,
      "Placa": "XYZ789"
    }
  ]
}
```

---

## ✅ Checklist de Implementación

- [ ] Ejecutar migración SQL en base de datos
- [ ] Actualizar interfaces TypeScript
- [ ] Actualizar servicio de contratos
- [ ] Crear formulario con soporte para bienes
- [ ] Implementar cálculo automático de diferencias
- [ ] Crear vista de detalle con bienes
- [ ] Probar creación de compraventa (compatibilidad)
- [ ] Probar creación de permuta pura
- [ ] Probar creación de permuta con saldo
- [ ] Verificar generación de PDF
- [ ] Verificar descarga de PDF
- [ ] Probar visualización de contratos existentes

---

## 🎯 Características Implementadas

✅ **Backend:**
- Modelo `BienContrato` para rastrear bienes
- Campos de permuta en modelo `Contrato`
- Cálculo automático de diferencias
- Generación de PDF con bienes
- API endpoints actualizados

✅ **Frontend (Por Implementar):**
- Formulario dinámico según modalidad
- Gestión de múltiples bienes
- Cálculo en tiempo real de diferencias
- Visualización de permutas
- Descarga de PDF

---

## 📞 Soporte

Si encuentras algún problema durante la implementación, revisa:
1. Logs del backend en consola
2. Network tab en DevTools del navegador
3. Respuestas de la API
4. Validaciones del formulario

**Documentación adicional:**
- `backend/docs/CONTRATOS_PERMUTA_EJEMPLO.md` - Ejemplos de uso del backend
- `backend/migrations/add_barter_support.sql` - Script de migración SQL
