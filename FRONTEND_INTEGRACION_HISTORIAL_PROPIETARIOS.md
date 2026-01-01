# 🎨 Guía de Integración Frontend - Historial de Propietarios

Documentación completa para integrar el sistema de historial de propietarios de vehículos en el frontend.

---

## 📋 Tabla de Contenidos

1. [Interfaces TypeScript](#interfaces-typescript)
2. [Servicios API](#servicios-api)
3. [Componentes Recomendados](#componentes-recomendados)
4. [Flujos de Usuario](#flujos-de-usuario)
5. [Ejemplos de Implementación](#ejemplos-de-implementación)
6. [Estados y Validaciones](#estados-y-validaciones)

---

## 🔷 Interfaces TypeScript

### **Archivo: `types/historial-propietarios.types.ts`**

```typescript
// Tipos de propietario
export type TipoPropietario = 'Anterior' | 'Actual' | 'Nuevo';

// Interfaz principal del historial
export interface HistorialPropietario {
  HistorialID: number;
  VehiculoID: number;
  TipoPropietario: TipoPropietario;
  NombrePropietario: string;
  TipoDocumento?: string;
  NumeroDocumento: string;
  Telefono?: string;
  Email?: string;
  Direccion?: string;
  Ciudad?: string;
  FechaAdquisicion?: string; // ISO date string
  FechaVenta?: string; // ISO date string
  ValorCompra?: number;
  ValorVenta?: number;
  ContratoID?: number;
  TraspasoRealizado: boolean;
  FechaTraspaso?: string; // ISO date string
  NumeroTraspaso?: string;
  OrganismoTransito?: string;
  EsPropietarioActual: boolean;
  Observaciones?: string;
  FechaRegistro?: string;
  FechaActualizacion?: string;
  UsuarioRegistro?: number;
  
  // Relaciones (si se incluyen en la respuesta)
  contrato?: {
    ContratoID: number;
    Folio: string;
    TipoContrato: string;
    FechaContrato: string;
  };
}

// DTOs para crear/actualizar
export interface CrearPropietarioAnteriorDTO {
  nombrePropietario: string;
  tipoDocumento?: string;
  numeroDocumento: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  fechaAdquisicion?: string;
  valorCompra?: number;
  observaciones?: string;
}

export interface CrearPropietarioActualDTO {
  nombrePropietario: string;
  tipoDocumento?: string;
  numeroDocumento: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  fechaAdquisicion?: string;
  valorCompra?: number;
  traspasoRealizado?: boolean;
  fechaTraspaso?: string;
  numeroTraspaso?: string;
  organismoTransito?: string;
  contratoID?: number;
  observaciones?: string;
}

export interface RegistrarTraspasoDTO {
  fechaTraspaso: string;
  numeroTraspaso?: string;
  organismoTransito?: string;
  observaciones?: string;
}

export interface RegistrarVentaDTO {
  nombrePropietario: string;
  tipoDocumento?: string;
  numeroDocumento: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  fechaVenta: string;
  valorVenta?: number;
  contratoID?: number;
  observaciones?: string;
}

export interface ActualizarHistorialDTO {
  nombrePropietario?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  fechaAdquisicion?: string;
  fechaVenta?: string;
  valorCompra?: number;
  valorVenta?: number;
  traspasoRealizado?: boolean;
  fechaTraspaso?: string;
  numeroTraspaso?: string;
  organismoTransito?: string;
  observaciones?: string;
}

// Respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  total?: number;
}
```

---

## 🌐 Servicios API

### **Archivo: `services/historial-propietarios.service.ts`**

```typescript
import axios from 'axios';
import {
  HistorialPropietario,
  CrearPropietarioAnteriorDTO,
  CrearPropietarioActualDTO,
  RegistrarTraspasoDTO,
  RegistrarVentaDTO,
  ActualizarHistorialDTO,
  ApiResponse,
} from '../types/historial-propietarios.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export class HistorialPropietariosService {
  /**
   * Registrar propietario anterior
   */
  static async registrarPropietarioAnterior(
    vehiculoId: number,
    data: CrearPropietarioAnteriorDTO
  ): Promise<ApiResponse<HistorialPropietario>> {
    const response = await axios.post(
      `${API_BASE_URL}/vehiculos/${vehiculoId}/propietarios/anterior`,
      data
    );
    return response.data;
  }

  /**
   * Registrar propietario actual (yo)
   */
  static async registrarPropietarioActual(
    vehiculoId: number,
    data: CrearPropietarioActualDTO
  ): Promise<ApiResponse<HistorialPropietario>> {
    const response = await axios.post(
      `${API_BASE_URL}/vehiculos/${vehiculoId}/propietarios/actual`,
      data
    );
    return response.data;
  }

  /**
   * Registrar traspaso
   */
  static async registrarTraspaso(
    vehiculoId: number,
    data: RegistrarTraspasoDTO
  ): Promise<ApiResponse<HistorialPropietario>> {
    const response = await axios.post(
      `${API_BASE_URL}/vehiculos/${vehiculoId}/propietarios/traspaso`,
      data
    );
    return response.data;
  }

  /**
   * Registrar venta del vehículo
   */
  static async registrarVenta(
    vehiculoId: number,
    data: RegistrarVentaDTO
  ): Promise<ApiResponse<HistorialPropietario>> {
    const response = await axios.post(
      `${API_BASE_URL}/vehiculos/${vehiculoId}/propietarios/venta`,
      data
    );
    return response.data;
  }

  /**
   * Obtener historial completo
   */
  static async obtenerHistorial(
    vehiculoId: number
  ): Promise<ApiResponse<HistorialPropietario[]>> {
    const response = await axios.get(
      `${API_BASE_URL}/vehiculos/${vehiculoId}/propietarios`
    );
    return response.data;
  }

  /**
   * Obtener propietario actual
   */
  static async obtenerPropietarioActual(
    vehiculoId: number
  ): Promise<ApiResponse<HistorialPropietario>> {
    const response = await axios.get(
      `${API_BASE_URL}/vehiculos/${vehiculoId}/propietarios/actual`
    );
    return response.data;
  }

  /**
   * Actualizar registro de historial
   */
  static async actualizarHistorial(
    vehiculoId: number,
    historialId: number,
    data: ActualizarHistorialDTO
  ): Promise<ApiResponse<HistorialPropietario>> {
    const response = await axios.put(
      `${API_BASE_URL}/vehiculos/${vehiculoId}/propietarios/${historialId}`,
      data
    );
    return response.data;
  }

  /**
   * Eliminar registro de historial
   */
  static async eliminarHistorial(
    vehiculoId: number,
    historialId: number
  ): Promise<ApiResponse<void>> {
    const response = await axios.delete(
      `${API_BASE_URL}/vehiculos/${vehiculoId}/propietarios/${historialId}`
    );
    return response.data;
  }

  /**
   * Obtener vehículos sin traspaso
   */
  static async obtenerVehiculosSinTraspaso(): Promise<ApiResponse<any[]>> {
    const response = await axios.get(`${API_BASE_URL}/vehiculos/sin-traspaso`);
    return response.data;
  }

  /**
   * Obtener historial de ventas
   */
  static async obtenerHistorialVentas(filtros?: {
    fechaInicio?: string;
    fechaFin?: string;
    limite?: number;
  }): Promise<ApiResponse<HistorialPropietario[]>> {
    const params = new URLSearchParams();
    if (filtros?.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros?.fechaFin) params.append('fechaFin', filtros.fechaFin);
    if (filtros?.limite) params.append('limite', filtros.limite.toString());

    const response = await axios.get(
      `${API_BASE_URL}/historial-ventas?${params.toString()}`
    );
    return response.data;
  }
}
```

---

## 🎨 Componentes Recomendados

### **1. Componente: Timeline de Historial**

```typescript
// components/HistorialPropietariosTimeline.tsx
import React, { useEffect, useState } from 'react';
import { HistorialPropietario } from '../types/historial-propietarios.types';
import { HistorialPropietariosService } from '../services/historial-propietarios.service';

interface Props {
  vehiculoId: number;
}

export const HistorialPropietariosTimeline: React.FC<Props> = ({ vehiculoId }) => {
  const [historial, setHistorial] = useState<HistorialPropietario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHistorial();
  }, [vehiculoId]);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const response = await HistorialPropietariosService.obtenerHistorial(vehiculoId);
      if (response.success && response.data) {
        setHistorial(response.data);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando historial...</div>;

  return (
    <div className="historial-timeline">
      <h3>Historial de Propietarios</h3>
      {historial.length === 0 ? (
        <p>No hay historial registrado para este vehículo.</p>
      ) : (
        <div className="timeline">
          {historial.map((item, index) => (
            <div key={item.HistorialID} className={`timeline-item ${item.EsPropietarioActual ? 'actual' : ''}`}>
              <div className="timeline-marker">
                {item.TipoPropietario === 'Anterior' && '📋'}
                {item.TipoPropietario === 'Actual' && '👤'}
                {item.TipoPropietario === 'Nuevo' && '🤝'}
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>{item.NombrePropietario}</h4>
                  <span className={`badge ${item.TipoPropietario.toLowerCase()}`}>
                    {item.TipoPropietario}
                  </span>
                </div>
                <div className="timeline-details">
                  <p><strong>Documento:</strong> {item.NumeroDocumento}</p>
                  {item.Telefono && <p><strong>Teléfono:</strong> {item.Telefono}</p>}
                  {item.FechaAdquisicion && (
                    <p><strong>Fecha Adquisición:</strong> {new Date(item.FechaAdquisicion).toLocaleDateString()}</p>
                  )}
                  {item.ValorCompra && (
                    <p><strong>Valor:</strong> ${item.ValorCompra.toLocaleString()}</p>
                  )}
                  {item.TraspasoRealizado ? (
                    <div className="traspaso-info">
                      <span className="badge success">✓ Traspaso Realizado</span>
                      {item.FechaTraspaso && (
                        <p><strong>Fecha:</strong> {new Date(item.FechaTraspaso).toLocaleDateString()}</p>
                      )}
                      {item.NumeroTraspaso && (
                        <p><strong>Número:</strong> {item.NumeroTraspaso}</p>
                      )}
                    </div>
                  ) : item.EsPropietarioActual ? (
                    <span className="badge warning">⚠ Traspaso Pendiente</span>
                  ) : null}
                  {item.Observaciones && (
                    <p className="observaciones"><em>{item.Observaciones}</em></p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### **2. Componente: Formulario Registrar Propietario Anterior**

```typescript
// components/FormularioPropietarioAnterior.tsx
import React, { useState } from 'react';
import { CrearPropietarioAnteriorDTO } from '../types/historial-propietarios.types';
import { HistorialPropietariosService } from '../services/historial-propietarios.service';

interface Props {
  vehiculoId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const FormularioPropietarioAnterior: React.FC<Props> = ({
  vehiculoId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CrearPropietarioAnteriorDTO>({
    nombrePropietario: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    fechaAdquisicion: '',
    valorCompra: undefined,
    observaciones: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valorCompra' ? (value ? parseFloat(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await HistorialPropietariosService.registrarPropietarioAnterior(
        vehiculoId,
        formData
      );

      if (response.success) {
        alert('Propietario anterior registrado exitosamente');
        onSuccess?.();
      } else {
        setError(response.message || 'Error al registrar propietario anterior');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar propietario anterior');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-propietario">
      <h3>Registrar Propietario Anterior</h3>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="nombrePropietario">Nombre Completo *</label>
        <input
          type="text"
          id="nombrePropietario"
          name="nombrePropietario"
          value={formData.nombrePropietario}
          onChange={handleChange}
          required
          maxLength={200}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tipoDocumento">Tipo Documento</label>
          <select
            id="tipoDocumento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
          >
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="NIT">NIT</option>
            <option value="Pasaporte">Pasaporte</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="numeroDocumento">Número Documento *</label>
          <input
            type="text"
            id="numeroDocumento"
            name="numeroDocumento"
            value={formData.numeroDocumento}
            onChange={handleChange}
            required
            maxLength={50}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            maxLength={20}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            maxLength={100}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="direccion">Dirección</label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          maxLength={200}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ciudad">Ciudad</label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fechaAdquisicion">Fecha Adquisición</label>
          <input
            type="date"
            id="fechaAdquisicion"
            name="fechaAdquisicion"
            value={formData.fechaAdquisicion}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="valorCompra">Valor de Compra</label>
        <input
          type="number"
          id="valorCompra"
          name="valorCompra"
          value={formData.valorCompra || ''}
          onChange={handleChange}
          min="0"
          step="0.01"
        />
      </div>

      <div className="form-group">
        <label htmlFor="observaciones">Observaciones</label>
        <textarea
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};
```

### **3. Componente: Formulario Registrar Traspaso**

```typescript
// components/FormularioRegistrarTraspaso.tsx
import React, { useState } from 'react';
import { RegistrarTraspasoDTO } from '../types/historial-propietarios.types';
import { HistorialPropietariosService } from '../services/historial-propietarios.service';

interface Props {
  vehiculoId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const FormularioRegistrarTraspaso: React.FC<Props> = ({
  vehiculoId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<RegistrarTraspasoDTO>({
    fechaTraspaso: new Date().toISOString().split('T')[0],
    numeroTraspaso: '',
    organismoTransito: 'Tránsito Municipal de Cúcuta',
    observaciones: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await HistorialPropietariosService.registrarTraspaso(
        vehiculoId,
        formData
      );

      if (response.success) {
        alert('Traspaso registrado exitosamente');
        onSuccess?.();
      } else {
        setError(response.message || 'Error al registrar traspaso');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar traspaso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-traspaso">
      <h3>Registrar Traspaso</h3>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="fechaTraspaso">Fecha de Traspaso *</label>
        <input
          type="date"
          id="fechaTraspaso"
          name="fechaTraspaso"
          value={formData.fechaTraspaso}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="numeroTraspaso">Número de Traspaso</label>
        <input
          type="text"
          id="numeroTraspaso"
          name="numeroTraspaso"
          value={formData.numeroTraspaso}
          onChange={handleChange}
          placeholder="Ej: TR-2024-001234"
          maxLength={50}
        />
      </div>

      <div className="form-group">
        <label htmlFor="organismoTransito">Organismo de Tránsito</label>
        <input
          type="text"
          id="organismoTransito"
          name="organismoTransito"
          value={formData.organismoTransito}
          onChange={handleChange}
          placeholder="Ej: Tránsito Municipal de Cúcuta"
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label htmlFor="observaciones">Observaciones</label>
        <textarea
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Guardando...' : 'Registrar Traspaso'}
        </button>
      </div>
    </form>
  );
};
```

---

## 🔄 Flujos de Usuario

### **Flujo 1: Compré un vehículo usado**

```
1. Usuario va a detalle del vehículo
2. Click en "Registrar Historial de Propietarios"
3. Formulario: "Registrar Propietario Anterior"
   - Llenar datos del vendedor
   - Guardar
4. Formulario: "Registrarme como Propietario Actual"
   - Llenar mis datos
   - Marcar si ya hice el traspaso
   - Si no: Mostrar alerta "Recuerda hacer el traspaso"
   - Guardar
5. Ver timeline con historial completo
```

### **Flujo 2: Hacer traspaso después**

```
1. Usuario va a "Vehículos Pendientes de Traspaso"
2. Lista muestra vehículos con alerta
3. Click en "Registrar Traspaso"
4. Formulario con fecha, número, organismo
5. Guardar
6. Badge cambia de "Pendiente" a "Completado"
```

### **Flujo 3: Vender un vehículo**

```
1. Usuario va a detalle del vehículo
2. Click en "Registrar Venta"
3. Formulario con datos del comprador
4. Opcional: Vincular contrato de compraventa
5. Guardar
6. El vehículo ahora tiene nuevo propietario actual
7. Mostrar en "Historial de Ventas"
```

---

## 📱 Ubicaciones en el Frontend

### **1. Detalle de Vehículo**

Agregar nueva pestaña o sección:

```typescript
// En VehiculoDetalle.tsx
<Tabs>
  <Tab label="Información General">...</Tab>
  <Tab label="Mantenimientos">...</Tab>
  <Tab label="Seguros">...</Tab>
  <Tab label="Historial de Propietarios">  {/* NUEVO */}
    <HistorialPropietariosTimeline vehiculoId={vehiculoId} />
    <div className="acciones">
      <button onClick={() => setMostrarFormAnterior(true)}>
        + Registrar Propietario Anterior
      </button>
      <button onClick={() => setMostrarFormActual(true)}>
        + Registrarme como Propietario Actual
      </button>
      <button onClick={() => setMostrarFormTraspaso(true)}>
        📋 Registrar Traspaso
      </button>
      <button onClick={() => setMostrarFormVenta(true)}>
        💰 Registrar Venta
      </button>
    </div>
  </Tab>
</Tabs>
```

### **2. Dashboard / Alertas**

Agregar widget de alertas:

```typescript
// En Dashboard.tsx
<div className="dashboard-widgets">
  <Widget title="Vehículos Sin Traspaso" icon="⚠️">
    <VehiculosSinTraspasoWidget />
  </Widget>
  <Widget title="Ventas Recientes" icon="💰">
    <VentasRecientesWidget />
  </Widget>
</div>
```

### **3. Menú de Navegación**

Agregar nueva opción:

```typescript
// En Sidebar.tsx o Menu.tsx
<MenuItem to="/vehiculos" icon="🚗">Vehículos</MenuItem>
<MenuItem to="/propiedades" icon="🏠">Propiedades</MenuItem>
<MenuItem to="/historial-propietarios" icon="📋">  {/* NUEVO */}
  Historial de Propietarios
</MenuItem>
```

### **4. Nueva Página: Historial de Propietarios**

```typescript
// pages/HistorialPropietarios.tsx
export const HistorialPropietariosPage: React.FC = () => {
  return (
    <div className="historial-propietarios-page">
      <h1>Historial de Propietarios</h1>
      
      <Tabs>
        <Tab label="Vehículos Sin Traspaso">
          <VehiculosSinTraspasoList />
        </Tab>
        <Tab label="Historial de Ventas">
          <HistorialVentasList />
        </Tab>
        <Tab label="Todos los Historiales">
          <TodosHistorialesList />
        </Tab>
      </Tabs>
    </div>
  );
};
```

---

## 🎨 Estilos CSS Recomendados

```css
/* styles/historial-propietarios.css */

.historial-timeline {
  padding: 20px;
}

.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
  padding-left: 20px;
}

.timeline-item.actual {
  background: #f0f8ff;
  border-left: 3px solid #2196F3;
  padding: 15px;
  border-radius: 8px;
}

.timeline-marker {
  position: absolute;
  left: -28px;
  top: 0;
  width: 30px;
  height: 30px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.timeline-header h4 {
  margin: 0;
  color: #333;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.anterior {
  background: #e3f2fd;
  color: #1976d2;
}

.badge.actual {
  background: #e8f5e9;
  color: #388e3c;
}

.badge.nuevo {
  background: #fff3e0;
  color: #f57c00;
}

.badge.success {
  background: #4caf50;
  color: white;
}

.badge.warning {
  background: #ff9800;
  color: white;
}

.timeline-details {
  color: #666;
  font-size: 14px;
}

.timeline-details p {
  margin: 5px 0;
}

.traspaso-info {
  margin-top: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.observaciones {
  margin-top: 10px;
  padding: 10px;
  background: #fffbf0;
  border-left: 3px solid #ffc107;
  font-style: italic;
}

/* Formularios */
.formulario-propietario,
.formulario-traspaso {
  max-width: 600px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #2196F3;
  color: white;
}

.btn-primary:hover {
  background: #1976D2;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.alert {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.alert-error {
  background: #ffebee;
  color: #c62828;
  border-left: 4px solid #c62828;
}

.alert-success {
  background: #e8f5e9;
  color: #2e7d32;
  border-left: 4px solid #2e7d32;
}

.alert-warning {
  background: #fff3e0;
  color: #e65100;
  border-left: 4px solid #e65100;
}
```

---

## ✅ Checklist de Implementación

### **Backend (Ya Completado)**
- [x] Tabla HistorialPropietarios creada
- [x] Modelos Sequelize
- [x] Servicios de negocio
- [x] Controladores
- [x] Validadores
- [x] Rutas registradas

### **Frontend (Por Implementar)**
- [ ] Crear interfaces TypeScript
- [ ] Crear servicio API
- [ ] Componente Timeline de historial
- [ ] Formulario propietario anterior
- [ ] Formulario propietario actual
- [ ] Formulario registrar traspaso
- [ ] Formulario registrar venta
- [ ] Widget vehículos sin traspaso
- [ ] Widget ventas recientes
- [ ] Página historial de propietarios
- [ ] Agregar tab en detalle de vehículo
- [ ] Agregar opción en menú
- [ ] Estilos CSS
- [ ] Pruebas de integración

---

## 🚀 Orden de Implementación Sugerido

1. **Crear tipos e interfaces** (`types/historial-propietarios.types.ts`)
2. **Crear servicio API** (`services/historial-propietarios.service.ts`)
3. **Componente Timeline** (para visualizar)
4. **Formulario Propietario Anterior** (primer paso del flujo)
5. **Formulario Propietario Actual** (segundo paso)
6. **Formulario Traspaso** (actualización posterior)
7. **Formulario Venta** (cuando se vende)
8. **Integrar en detalle de vehículo** (tab nuevo)
9. **Widgets de dashboard** (alertas y reportes)
10. **Página dedicada** (opcional, para gestión completa)

---

## 📞 Soporte y Próximos Pasos

Una vez implementado el frontend:
1. Probar todos los flujos de usuario
2. Validar que los datos se muestran correctamente
3. Verificar que las alertas funcionan
4. Implementar notificaciones push para traspasos pendientes
5. Generar reportes en PDF del historial

---

**¡Sistema de Historial de Propietarios listo para integración frontend! 🎉**
