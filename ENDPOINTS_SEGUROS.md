# 📋 API ENDPOINTS - MÓDULO DE SEGUROS

**Base URL:** `http://localhost:5000/api/seguros`

**Autenticación:** Todos los endpoints requieren token JWT en el header `Authorization: Bearer <token>`

---

## 🔒 PÓLIZAS

### 1. Obtener todas las pólizas
```http
GET /api/seguros/polizas
```

**Query Parameters:**
- `estado` (opcional): `Vigente`, `Por Vencer`, `Vencida`, `Cancelada`
- `categoria` (opcional): `Vehiculo`, `Propiedad`

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "PolizaID": 1,
      "TipoPoliza": "Todo Riesgo",
      "CategoriaPoliza": "Vehiculo",
      "Aseguradora": "Seguros Bolivar",
      "NumeroPoliza": "POL-VEH-2025-00001",
      "VehiculoID": 1,
      "PropiedadID": null,
      "UsuarioID": 7,
      "ValorAsegurado": 50000000,
      "PrimaAnual": 2400000,
      "PrimaMensual": 200000,
      "Deducible": 500000,
      "FechaInicio": "2025-01-01",
      "FechaVencimiento": "2026-01-01",
      "Estado": "Vigente",
      "TelefonoAseguradora": "018000123456",
      "EmailAseguradora": "contacto@segurosbolivar.com",
      "vehiculo": {
        "Placa": "ABC123",
        "Marca": "Toyota",
        "Modelo": "Corolla"
      },
      "propiedad": null
    }
  ]
}
```

---

### 2. Obtener una póliza específica por ID
```http
GET /api/seguros/polizas/:id
```

**Parámetros de ruta:**
- `id`: ID de la póliza

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "PolizaID": 2,
    "TipoPoliza": "Todo Riesgo",
    "CategoriaPoliza": "Vehiculo",
    "Aseguradora": "Seguros Bolivar",
    "NumeroPoliza": "POL-VEH-2025-00001",
    "VehiculoID": 1,
    "PropiedadID": null,
    "UsuarioID": 7,
    "ValorAsegurado": 50000000,
    "PrimaAnual": 2400000,
    "PrimaMensual": 200000,
    "Deducible": 500000,
    "Coberturas": "{\"danios\": true, \"robo\": true}",
    "FechaInicio": "2025-01-01",
    "FechaVencimiento": "2026-01-01",
    "Estado": "Vigente",
    "vehiculo": {
      "VehiculoID": 1,
      "Placa": "ABC123",
      "Marca": "Toyota",
      "Modelo": "Corolla",
      "Anio": 2020,
      "Color": "Blanco"
    },
    "propiedad": null
  }
}
```

**Error 404:**
```json
{
  "success": false,
  "message": "Póliza no encontrada"
}
```

---

### 3. Obtener pólizas por vencer
```http
GET /api/seguros/polizas/por-vencer?dias=30
```

**Query Parameters:**
- `dias` (opcional, default: 30): Días de anticipación

**Respuesta:** Igual que endpoint anterior, solo pólizas que vencen en los próximos X días

---

### 4. Crear nueva póliza
```http
POST /api/seguros/polizas
```

**Body:**
```json
{
  "TipoPoliza": "Todo Riesgo",
  "CategoriaPoliza": "Vehiculo",
  "Aseguradora": "Seguros Bolivar",
  "NumeroPoliza": "POL-VEH-2025-00002",
  "VehiculoID": 1,
  "PropiedadID": null,
  "ValorAsegurado": 50000000,
  "PrimaAnual": 2400000,
  "PrimaMensual": 200000,
  "Deducible": 500000,
  "Coberturas": "{\"danios\": true, \"robo\": true, \"responsabilidadCivil\": true}",
  "FechaInicio": "2025-01-01",
  "FechaVencimiento": "2026-01-01",
  "TelefonoAseguradora": "018000123456",
  "EmailAseguradora": "contacto@segurosbolivar.com",
  "AgenteAsignado": "Juan Pérez",
  "TelefonoAgente": "3001234567",
  "Observaciones": "Póliza con cobertura completa"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Póliza creada exitosamente",
  "data": { /* póliza creada */ }
}
```

---

### 5. Actualizar póliza
```http
PUT /api/seguros/polizas/:id
```

**Body:** Mismos campos que crear (enviar solo los que se quieren actualizar)

**Respuesta:**
```json
{
  "success": true,
  "message": "Póliza actualizada exitosamente",
  "data": { /* póliza actualizada */ }
}
```

---

### 6. Eliminar póliza
```http
DELETE /api/seguros/polizas/:id
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Póliza eliminada exitosamente"
}
```

---

## 📋 RECLAMACIONES

### 7. Obtener todas las reclamaciones
```http
GET /api/seguros/reclamaciones
```

**Query Parameters:**
- `estado` (opcional): `Radicada`, `En Revision`, `Aprobada`, `Rechazada`, `Indemnizada`, `Cerrada`
- `polizaId` (opcional): ID de la póliza

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "ReclamacionID": 1,
      "PolizaID": 1,
      "UsuarioID": 7,
      "NumeroReclamacion": "REC-2025-00001",
      "TipoSiniestro": "Choque",
      "FechaSiniestro": "2025-12-20T10:30:00.000Z",
      "LugarSiniestro": "Calle 100 con Carrera 15",
      "DescripcionSiniestro": "Colisión en intersección. Daños en parte frontal del vehículo.",
      "MontoReclamado": 5000000,
      "MontoAprobado": null,
      "DeducibleAplicado": null,
      "MontoIndemnizado": null,
      "Estado": "En Revision",
      "FechaRadicacion": "2025-12-20T14:00:00.000Z",
      "FechaAprobacion": null,
      "FechaIndemnizacion": null,
      "FechaCierre": null,
      "AjustadorAsignado": "Carlos Rodríguez",
      "TelefonoAjustador": "3009876543",
      "poliza": {
        "NumeroPoliza": "POL-VEH-2025-00001",
        "Aseguradora": "Seguros Bolivar",
        "TipoPoliza": "Todo Riesgo"
      }
    }
  ]
}
```

---

### 8. Crear reclamación
```http
POST /api/seguros/reclamaciones
```

**Body:**
```json
{
  "PolizaID": 1,
  "TipoSiniestro": "Choque",
  "FechaSiniestro": "2025-12-20T10:30:00",
  "LugarSiniestro": "Calle 100 con Carrera 15",
  "DescripcionSiniestro": "Colisión en intersección. Daños en parte frontal del vehículo.",
  "MontoReclamado": 5000000,
  "DocumentosSoportes": "fotos_accidente.pdf,informe_policia.pdf",
  "Observaciones": "Testigos presentes en el lugar"
}
```

**Nota:** El campo `NumeroReclamacion` se genera automáticamente (formato: REC-YYYY-00001)

**Respuesta:**
```json
{
  "success": true,
  "message": "Reclamación creada exitosamente",
  "data": { /* reclamación creada con NumeroReclamacion */ }
}
```

---

### 9. Actualizar reclamación completa
```http
PUT /api/seguros/reclamaciones/:id
```

**Body:** Cualquier campo de la reclamación que se quiera actualizar

**Respuesta:**
```json
{
  "success": true,
  "message": "Reclamación actualizada exitosamente",
  "data": { /* reclamación actualizada */ }
}
```

---

### 10. Actualizar estado de reclamación
```http
PUT /api/seguros/reclamaciones/:id/estado
```

**Body para aprobar:**
```json
{
  "estado": "Aprobada",
  "montoAprobado": 4500000
}
```

**Body para rechazar:**
```json
{
  "estado": "Rechazada",
  "motivoRechazo": "No cubre daños por negligencia del conductor"
}
```

**Body para indemnizar:**
```json
{
  "estado": "Indemnizada",
  "montoIndemnizado": 4500000
}
```

**Body para cerrar:**
```json
{
  "estado": "Cerrada"
}
```

**Lógica automática:**
- `Aprobada`: Establece `FechaAprobacion` y `MontoAprobado`
- `Rechazada`: Establece `MotivoRechazo`
- `Indemnizada`: Establece `FechaIndemnizacion` y `MontoIndemnizado`
- `Cerrada`: Establece `FechaCierre`

**Respuesta:**
```json
{
  "success": true,
  "message": "Estado actualizado a Aprobada",
  "data": { /* reclamación actualizada */ }
}
```

---

## 🔄 RENOVACIONES

### 11. Obtener renovaciones
```http
GET /api/seguros/renovaciones
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "RenovacionID": 1,
      "PolizaID": 1,
      "UsuarioID": 7,
      "PolizaAnteriorNumero": "POL-VEH-2024-00001",
      "NuevaPolizaNumero": "POL-VEH-2025-00001",
      "PrimaAnterior": 2200000,
      "NuevaPrima": 2400000,
      "DiferenciaPrima": 200000,
      "PorcentajeAumento": 9.09,
      "FechaRenovacion": "2025-01-01",
      "FechaVencimientoAnterior": "2025-01-01",
      "FechaVencimientoNueva": "2026-01-01",
      "CambiosCobertura": "Se agregó cobertura de terremoto",
      "MotivoRenovacion": "Renovación automática",
      "Estado": "Procesada",
      "poliza": {
        "NumeroPoliza": "POL-VEH-2025-00001",
        "Aseguradora": "Seguros Bolivar",
        "TipoPoliza": "Todo Riesgo"
      }
    }
  ]
}
```

---

### 12. Crear renovación
```http
POST /api/seguros/renovaciones
```

**Body:**
```json
{
  "PolizaID": 1,
  "PolizaAnteriorNumero": "POL-VEH-2024-00001",
  "NuevaPolizaNumero": "POL-VEH-2025-00001",
  "PrimaAnterior": 2200000,
  "NuevaPrima": 2400000,
  "DiferenciaPrima": 200000,
  "PorcentajeAumento": 9.09,
  "FechaRenovacion": "2025-01-01",
  "FechaVencimientoAnterior": "2025-01-01",
  "FechaVencimientoNueva": "2026-01-01",
  "CambiosCobertura": "Se agregó cobertura de terremoto",
  "MotivoRenovacion": "Renovación automática",
  "Estado": "Procesada"
}
```

**Nota:** Este endpoint también actualiza automáticamente la póliza con:
- `NumeroPoliza` → `NuevaPolizaNumero`
- `PrimaAnual` → `NuevaPrima`
- `FechaVencimiento` → `FechaVencimientoNueva`
- `FechaRenovacion` → `FechaRenovacion`

**Respuesta:**
```json
{
  "success": true,
  "message": "Renovación registrada exitosamente",
  "data": { /* renovación creada */ }
}
```

---

## 📊 RESUMEN DE ENDPOINTS

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/polizas` | Listar pólizas (con filtros opcionales) |
| GET | `/polizas/:id` | Obtener póliza específica por ID |
| GET | `/polizas/por-vencer` | Pólizas que vencen pronto |
| POST | `/polizas` | Crear nueva póliza |
| PUT | `/polizas/:id` | Actualizar póliza |
| DELETE | `/polizas/:id` | Eliminar póliza |
| GET | `/reclamaciones` | Listar reclamaciones (con filtros) |
| POST | `/reclamaciones` | Crear reclamación |
| PUT | `/reclamaciones/:id` | Actualizar reclamación completa |
| PUT | `/reclamaciones/:id/estado` | Cambiar estado de reclamación |
| GET | `/renovaciones` | Listar renovaciones |
| POST | `/renovaciones` | Crear renovación |

---

## 🔐 AUTENTICACIÓN

Todos los endpoints requieren autenticación JWT. El token debe incluirse en el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

El `UsuarioID` se extrae automáticamente del token, por lo que no es necesario enviarlo en el body.

---

## ❌ MANEJO DE ERRORES

**Error 401 - No autenticado:**
```json
{
  "success": false,
  "message": "Token no válido"
}
```

**Error 404 - No encontrado:**
```json
{
  "success": false,
  "message": "Póliza no encontrada"
}
```

**Error 500 - Error del servidor:**
```json
{
  "success": false,
  "message": "Error al crear póliza: [detalle del error]"
}
```

---

## 🎯 EJEMPLOS DE USO EN ANGULAR

### Servicio de Seguros (seguros.service.ts)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SegurosService {
  private apiUrl = 'http://localhost:5000/api/seguros';

  constructor(private http: HttpClient) {}

  // PÓLIZAS
  getPolizas(filtros?: { estado?: string; categoria?: string }): Observable<any> {
    let params = new HttpParams();
    if (filtros?.estado) params = params.set('estado', filtros.estado);
    if (filtros?.categoria) params = params.set('categoria', filtros.categoria);
    return this.http.get(`${this.apiUrl}/polizas`, { params });
  }

  getPolizaById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/polizas/${id}`);
  }

  getPolizasPorVencer(dias: number = 30): Observable<any> {
    return this.http.get(`${this.apiUrl}/polizas/por-vencer`, {
      params: { dias: dias.toString() }
    });
  }

  crearPoliza(poliza: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/polizas`, poliza);
  }

  actualizarPoliza(id: number, poliza: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/polizas/${id}`, poliza);
  }

  eliminarPoliza(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/polizas/${id}`);
  }

  // RECLAMACIONES
  getReclamaciones(filtros?: { estado?: string; polizaId?: number }): Observable<any> {
    let params = new HttpParams();
    if (filtros?.estado) params = params.set('estado', filtros.estado);
    if (filtros?.polizaId) params = params.set('polizaId', filtros.polizaId.toString());
    return this.http.get(`${this.apiUrl}/reclamaciones`, { params });
  }

  crearReclamacion(reclamacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reclamaciones`, reclamacion);
  }

  actualizarReclamacion(id: number, reclamacion: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/reclamaciones/${id}`, reclamacion);
  }

  actualizarEstadoReclamacion(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/reclamaciones/${id}/estado`, datos);
  }

  // RENOVACIONES
  getRenovaciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/renovaciones`);
  }

  crearRenovacion(renovacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/renovaciones`, renovacion);
  }
}
```

### Ejemplo de uso en componente

```typescript
// Listar pólizas vigentes de vehículos
this.segurosService.getPolizas({ estado: 'Vigente', categoria: 'Vehiculo' })
  .subscribe(response => {
    if (response.success) {
      this.polizas = response.data;
    }
  });

// Crear reclamación
const nuevaReclamacion = {
  PolizaID: 1,
  TipoSiniestro: 'Choque',
  FechaSiniestro: new Date(),
  LugarSiniestro: 'Calle 80 con Carrera 50',
  DescripcionSiniestro: 'Colisión trasera en semáforo',
  MontoReclamado: 3000000
};

this.segurosService.crearReclamacion(nuevaReclamacion)
  .subscribe(response => {
    if (response.success) {
      console.log('Reclamación creada:', response.data.NumeroReclamacion);
    }
  });

// Aprobar reclamación
this.segurosService.actualizarEstadoReclamacion(1, {
  estado: 'Aprobada',
  montoAprobado: 2800000
}).subscribe(response => {
  if (response.success) {
    console.log('Reclamación aprobada');
  }
});
```

---

## 📝 NOTAS IMPORTANTES

1. **Generación automática de números:** El `NumeroReclamacion` se genera automáticamente con formato `REC-YYYY-00001`

2. **Actualización automática de fechas:** Al cambiar el estado de una reclamación, las fechas correspondientes se actualizan automáticamente

3. **Renovaciones actualizan pólizas:** Al crear una renovación, la póliza original se actualiza con los nuevos datos

4. **Filtros opcionales:** Los filtros en GET son opcionales, si no se envían devuelve todos los registros del usuario

5. **Soft delete:** Actualmente `DELETE` elimina permanentemente. Considerar implementar soft delete en el futuro

6. **Validaciones:** El backend valida que el registro exista antes de actualizar o eliminar

---

**Fecha de creación:** 30 de Diciembre de 2025  
**Versión:** 1.0  
**Autor:** Sistema de Control de Activos
