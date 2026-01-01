# 📄 Implementación Completa: Carga de Documentos Firmados/Autenticados

## ✅ Resumen de Implementación

Se ha implementado exitosamente la funcionalidad para cargar y descargar documentos firmados o autenticados en contratos. Esta funcionalidad permite a los usuarios subir la versión física firmada del contrato después de que las partes lo hayan firmado.

---

## 🗄️ Cambios en Base de Datos

### Campos Agregados a Tabla `Contratos`

```sql
ALTER TABLE Contratos ADD 
  RutaDocumentoFirmado VARCHAR(500) NULL,
  RutaDocumentoAutenticado VARCHAR(500) NULL,
  FechaFirma DATETIME NULL,
  TipoDocumentoFirmado VARCHAR(20) NULL
```

**Descripción de campos:**
- `RutaDocumentoFirmado`: Ruta del documento firmado por las partes
- `RutaDocumentoAutenticado`: Ruta del documento autenticado en notaría
- `FechaFirma`: Fecha en que se cargó el documento firmado
- `TipoDocumentoFirmado`: Tipo del último documento cargado ('firmado' o 'autenticado')

---

## 📦 Archivos Creados/Modificados

### 1. **Middleware de Upload** (`src/middleware/upload.middleware.ts`)
- Configuración de Multer para subida de archivos
- Validación de tipo de archivo (solo PDF)
- Límite de tamaño: 10 MB
- Almacenamiento en `/uploads/contratos-firmados/`

### 2. **Modelo Contrato** (`src/models/Contrato.model.ts`)
- Agregados campos para documentos firmados
- Validación de tipo de documento

### 3. **Controlador** (`src/controllers/contrato.controller.ts`)
- `cargarDocumentoFirmado()`: Endpoint para subir documento
- `descargarDocumentoFirmado()`: Endpoint para descargar documento

### 4. **Rutas** (`src/routes/contrato.routes.ts`)
- `POST /api/contratos/:id/cargar-firmado`
- `GET /api/contratos/:id/descargar-firmado/:tipo`

---

## 🔌 Endpoints Implementados

### **POST /api/contratos/:id/cargar-firmado**

Carga un documento firmado o autenticado para un contrato.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (FormData):**
```
archivo: <PDF file>
tipo: "firmado" | "autenticado"
```

**Validaciones:**
- ✅ Archivo debe ser PDF
- ✅ Tamaño máximo: 10 MB
- ✅ Contrato debe existir
- ✅ Contrato debe estar en estado "Generado"
- ✅ Tipo debe ser "firmado" o "autenticado"

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Documento firmado cargado exitosamente",
  "data": {
    "ContratoID": 1,
    "Folio": "CONT-2025-00001",
    "EstadoContrato": "Firmado",
    "FechaFirma": "2025-12-29T14:30:00.000Z",
    "TipoDocumentoFirmado": "firmado"
  }
}
```

**Comportamiento:**
1. Valida archivo y tipo
2. Verifica que el contrato exista y esté en estado "Generado"
3. Guarda el archivo en `/uploads/contratos-firmados/`
4. Actualiza el contrato:
   - Cambia estado a "Firmado"
   - Registra fecha de firma
   - Guarda ruta del documento
5. Retorna confirmación

---

### **GET /api/contratos/:id/descargar-firmado/:tipo**

Descarga el documento firmado o autenticado de un contrato.

**Headers:**
```
Authorization: Bearer <token>
```

**Parámetros:**
- `id`: ID del contrato
- `tipo`: "firmado" o "autenticado"

**Respuesta Exitosa:**
- Descarga directa del archivo PDF

**Errores:**
- `404`: Contrato no encontrado
- `404`: No existe documento del tipo especificado
- `404`: Archivo no encontrado en servidor
- `400`: Tipo de documento inválido

---

## 🔄 Flujo de Trabajo Completo

### **1. Generación del Contrato**
```
Usuario → Genera contrato → Estado: "Generado"
```

### **2. Firma Física**
```
Partes → Firman documento físico → Escanean/Digitalizan
```

### **3. Carga del Documento**
```
Usuario → Carga PDF firmado → Estado: "Firmado"
```

### **4. Descarga del Documento**
```
Usuario → Descarga documento firmado
```

---

## 💻 Ejemplo de Uso desde Frontend

### **Cargar Documento Firmado**

```typescript
// En el servicio Angular
cargarDocumentoFirmado(id: number, archivo: File, tipo: string): Observable<any> {
  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('tipo', tipo);
  
  return this.http.post(`${this.apiUrl}/contratos/${id}/cargar-firmado`, formData);
}

// En el componente
onCargarDocumento() {
  const archivo = this.archivoSeleccionado; // File object
  const tipo = this.tipoDocumento; // 'firmado' o 'autenticado'
  
  this.contratoService.cargarDocumentoFirmado(this.contratoId, archivo, tipo)
    .subscribe({
      next: (response) => {
        console.log('Documento cargado:', response);
        this.mostrarMensaje('Documento cargado exitosamente');
        this.actualizarListaContratos();
      },
      error: (error) => {
        console.error('Error:', error);
        this.mostrarError(error.error.message);
      }
    });
}
```

### **Descargar Documento Firmado**

```typescript
// En el servicio Angular
descargarDocumentoFirmado(id: number, tipo: string): Observable<Blob> {
  return this.http.get(
    `${this.apiUrl}/contratos/${id}/descargar-firmado/${tipo}`,
    { responseType: 'blob' }
  );
}

// En el componente
onDescargarDocumento(tipo: string) {
  this.contratoService.descargarDocumentoFirmado(this.contratoId, tipo)
    .subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `contrato-${this.contratoId}-${tipo}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error al descargar:', error);
      }
    });
}
```

---

## 🔒 Seguridad

### **Validaciones Implementadas:**
1. ✅ Autenticación JWT requerida
2. ✅ Solo archivos PDF permitidos
3. ✅ Límite de tamaño de archivo (10 MB)
4. ✅ Solo contratos en estado "Generado" pueden recibir documentos
5. ✅ Validación de tipo de documento
6. ✅ Limpieza automática de archivos en caso de error

### **Protección de Archivos:**
- Archivos almacenados fuera del directorio público
- Descarga controlada por endpoint autenticado
- Nombres de archivo únicos con timestamp

---

## 📂 Estructura de Archivos

```
backend/
├── uploads/
│   └── contratos-firmados/
│       ├── contrato-1-firmado-1735487234567.pdf
│       ├── contrato-1-autenticado-1735487345678.pdf
│       └── ...
├── src/
│   ├── middleware/
│   │   └── upload.middleware.ts (NUEVO)
│   ├── controllers/
│   │   └── contrato.controller.ts (ACTUALIZADO)
│   ├── models/
│   │   └── Contrato.model.ts (ACTUALIZADO)
│   └── routes/
│       └── contrato.routes.ts (ACTUALIZADO)
```

---

## 🧪 Testing

### **Prueba de Carga de Documento**

```bash
# Con curl
curl -X POST http://localhost:5000/api/contratos/1/cargar-firmado \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "archivo=@/path/to/documento-firmado.pdf" \
  -F "tipo=firmado"
```

### **Prueba de Descarga de Documento**

```bash
# Con curl
curl -X GET http://localhost:5000/api/contratos/1/descargar-firmado/firmado \
  -H "Authorization: Bearer YOUR_TOKEN" \
  --output documento-descargado.pdf
```

---

## ✨ Características Adicionales

### **Cambio Automático de Estado**
Cuando se carga un documento firmado, el contrato cambia automáticamente de estado "Generado" a "Firmado".

### **Registro de Fecha**
Se registra automáticamente la fecha y hora en que se cargó el documento firmado.

### **Soporte para Dos Tipos**
- **Firmado**: Documento firmado por las partes
- **Autenticado**: Documento autenticado en notaría

### **Gestión de Errores**
- Si la carga falla, el archivo temporal se elimina automáticamente
- Mensajes de error descriptivos para el usuario

---

## 🎯 Estados del Contrato

| Estado | Descripción | Puede Cargar Documento |
|--------|-------------|------------------------|
| **Generado** | Contrato recién creado | ✅ Sí |
| **Firmado** | Documento firmado cargado | ❌ No |
| **Anulado** | Contrato anulado | ❌ No |

---

## 📊 Campos del Modelo Contrato (Actualizados)

```typescript
interface Contrato {
  // ... campos existentes ...
  
  // Nuevos campos para documentos firmados
  RutaDocumentoFirmado?: string | null;
  RutaDocumentoAutenticado?: string | null;
  FechaFirma?: Date | null;
  TipoDocumentoFirmado?: 'firmado' | 'autenticado' | null;
}
```

---

## ✅ Checklist de Implementación

- [x] Agregar campos a base de datos
- [x] Actualizar modelo Sequelize
- [x] Crear middleware de Multer
- [x] Implementar endpoint de carga
- [x] Implementar endpoint de descarga
- [x] Agregar rutas
- [x] Validaciones de seguridad
- [x] Manejo de errores
- [x] Documentación completa
- [ ] Testing en frontend
- [ ] Testing de integración

---

## 🚀 Próximos Pasos

1. **Frontend**: Implementar la UI según la guía proporcionada
2. **Testing**: Probar flujo completo de carga y descarga
3. **Opcional**: Agregar notificaciones cuando se carga un documento
4. **Opcional**: Historial de versiones de documentos firmados

---

## 📞 Soporte

Si encuentras algún problema:
1. Verifica que los campos estén agregados en la base de datos
2. Confirma que la carpeta `/uploads/contratos-firmados/` existe y tiene permisos de escritura
3. Revisa los logs del servidor para errores específicos
4. Verifica que el archivo sea PDF y menor a 10 MB

---

**Implementación completada el: 29 de Diciembre de 2025**
**Backend 100% funcional y listo para integración con frontend**
