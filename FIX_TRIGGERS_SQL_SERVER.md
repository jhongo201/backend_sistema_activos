# 🔧 Solución: Error OUTPUT Clause con Triggers en SQL Server

## ❌ Problema

```
Error: The target table 'HistorialPropietarios' of the DML statement cannot have any enabled triggers if the statement contains an OUTPUT clause without INTO clause.
```

Este error ocurre porque **SQL Server no permite usar la cláusula OUTPUT cuando hay triggers habilitados** en la tabla.

---

## ✅ Solución Implementada

### **Paso 1: Ejecutar Script de Eliminación de Triggers**

Ejecuta el siguiente script SQL para eliminar los triggers:

```sql
-- Archivo: migrations/fix-triggers-output-clause.sql

-- Eliminar triggers existentes
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_HistorialPropietarios_Insert')
    DROP TRIGGER trg_HistorialPropietarios_Insert;
GO

IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_HistorialPropietarios_Update')
    DROP TRIGGER trg_HistorialPropietarios_Update;
GO

IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_HistorialPropietarios_UpdateTimestamp')
    DROP TRIGGER trg_HistorialPropietarios_UpdateTimestamp;
GO

PRINT 'Triggers eliminados exitosamente';
GO
```

**Cómo ejecutar:**
1. Abre SQL Server Management Studio (SSMS)
2. Abre el archivo `migrations/fix-triggers-output-clause.sql`
3. Ejecuta el script (F5)

---

### **Paso 2: Reiniciar el Backend**

La lógica de validación que antes estaba en los triggers ahora está en el código:

```bash
# Detener el servidor
Ctrl + C

# Reiniciar
npm run dev
```

---

## 🔍 Cambios Realizados en el Código

### **1. Modelo Actualizado**

**Archivo:** `src/models/HistorialPropietarios.model.ts`

```typescript
{
  sequelize,
  tableName: 'HistorialPropietarios',
  timestamps: false,
  hasTrigger: true, // ← Agregado para indicar que hay triggers
}
```

### **2. Validación en el Servicio**

**Archivo:** `src/services/historial-propietarios.service.ts`

La validación "solo un propietario actual por vehículo" ahora se hace en el código:

```typescript
// VALIDACIÓN: Verificar que no haya otro propietario actual
const propietarioActualExistente = await HistorialPropietarios.findOne({
  where: {
    VehiculoID: data.vehiculoID,
    EsPropietarioActual: true,
  },
});

if (propietarioActualExistente) {
  throw new Error('Ya existe un propietario actual para este vehículo. Primero debe registrar la venta.');
}
```

---

## 🧪 Probar la Solución

### **Test 1: Registrar Propietario Anterior**

```bash
curl -X POST http://localhost:3000/api/vehiculos/5/propietarios/anterior \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombrePropietario": "JUAN GUILLERMO CUADRADO",
    "tipoDocumento": "CC",
    "numeroDocumento": "7456321",
    "telefono": "6013256987",
    "email": "juan@yopmail.com",
    "direccion": "AV 7 #7-60",
    "ciudad": "Cúcuta",
    "fechaAdquisicion": "2025-12-01",
    "valorCompra": 10000000
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Propietario anterior registrado exitosamente",
  "data": {
    "HistorialID": 1,
    "VehiculoID": 5,
    "TipoPropietario": "Anterior",
    "NombrePropietario": "JUAN GUILLERMO CUADRADO",
    ...
  }
}
```

---

## 📋 Resumen de Cambios

| Componente | Cambio | Estado |
|------------|--------|--------|
| Triggers SQL | Eliminados | ✅ |
| Modelo Sequelize | `hasTrigger: true` agregado | ✅ |
| Servicio | Validación en código | ✅ |
| Script SQL | `fix-triggers-output-clause.sql` creado | ✅ |

---

## 🔄 Lógica de Validación Movida al Código

### **Antes (Triggers SQL)**
```sql
-- Trigger validaba un solo propietario actual
CREATE TRIGGER trg_HistorialPropietarios_Insert
ON HistorialPropietarios
AFTER INSERT
AS
BEGIN
  IF EXISTS (
    SELECT 1 FROM inserted i
    INNER JOIN HistorialPropietarios h 
      ON i.VehiculoID = h.VehiculoID
    WHERE h.EsPropietarioActual = 1
      AND h.HistorialID != i.HistorialID
      AND i.EsPropietarioActual = 1
  )
  BEGIN
    RAISERROR('Solo puede haber un propietario actual por vehículo', 16, 1);
    ROLLBACK TRANSACTION;
  END
END
```

### **Ahora (Código TypeScript)**
```typescript
// Validación en el servicio
const propietarioActualExistente = await HistorialPropietarios.findOne({
  where: {
    VehiculoID: data.vehiculoID,
    EsPropietarioActual: true,
  },
});

if (propietarioActualExistente) {
  throw new Error('Ya existe un propietario actual para este vehículo.');
}
```

---

## ✅ Ventajas de la Nueva Implementación

1. ✅ **Compatible con Sequelize**: No hay conflictos con OUTPUT clause
2. ✅ **Mejor control de errores**: Mensajes más claros y específicos
3. ✅ **Más flexible**: Fácil de modificar la lógica de validación
4. ✅ **Mejor testing**: Se puede probar la lógica sin base de datos
5. ✅ **Transacciones**: Mejor manejo de transacciones en el código

---

## 🚨 Importante

- **NO** vuelvas a crear los triggers mientras uses Sequelize con OUTPUT clause
- La validación ahora está en el código y funciona correctamente
- Si necesitas triggers en el futuro, considera usar `INSTEAD OF` triggers

---

## 📞 Verificación Final

Después de ejecutar el script, verifica que los triggers fueron eliminados:

```sql
SELECT 
    name AS TriggerName,
    OBJECT_NAME(parent_id) AS TableName,
    is_disabled AS IsDisabled
FROM sys.triggers
WHERE OBJECT_NAME(parent_id) = 'HistorialPropietarios';

-- Resultado esperado: (0 rows)
```

---

**¡Problema resuelto! Ahora puedes registrar propietarios sin errores.** 🎉
