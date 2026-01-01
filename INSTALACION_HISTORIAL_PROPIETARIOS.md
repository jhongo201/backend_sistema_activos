# 🚀 Instalación del Sistema de Historial de Propietarios

Guía paso a paso para instalar y configurar el sistema de historial de propietarios de vehículos.

---

## 📋 Requisitos Previos

- Base de datos MySQL/MariaDB configurada
- Backend Node.js + TypeScript funcionando
- Acceso a la base de datos con permisos de CREATE TABLE

---

## 🔧 Pasos de Instalación

### **1. Ejecutar Migración SQL**

Ejecuta el script de migración en tu base de datos:

```bash
# Opción 1: Desde MySQL CLI
mysql -u usuario -p nombre_base_datos < migrations/crear-tabla-historial-propietarios.sql

# Opción 2: Desde MySQL Workbench
# Abre el archivo crear-tabla-historial-propietarios.sql y ejecuta el script
```

**Archivo:** `migrations/crear-tabla-historial-propietarios.sql`

Esto creará:
- ✅ Tabla `HistorialPropietarios`
- ✅ Campo `PropietarioActualID` en tabla `Vehiculos`
- ✅ Triggers para garantizar integridad de datos
- ✅ Índices para optimizar consultas

---

### **2. Verificar Creación de Tabla**

```sql
-- Verificar que la tabla se creó correctamente
DESCRIBE HistorialPropietarios;

-- Verificar que el campo se agregó a Vehiculos
SHOW COLUMNS FROM Vehiculos LIKE 'PropietarioActualID';

-- Verificar triggers
SHOW TRIGGERS WHERE `Table` = 'HistorialPropietarios';
```

---

### **3. Archivos Creados**

Los siguientes archivos ya están creados en el backend:

#### **Modelos**
- ✅ `src/models/HistorialPropietarios.model.ts` - Modelo Sequelize
- ✅ `src/models/Vehiculo.model.ts` - Actualizado con `PropietarioActualID`

#### **Servicios**
- ✅ `src/services/historial-propietarios.service.ts` - Lógica de negocio

#### **Controladores**
- ✅ `src/controllers/historial-propietarios.controller.ts` - Endpoints

#### **Validadores**
- ✅ `src/validators/historial-propietarios.validator.ts` - Validaciones Joi

#### **Rutas**
- ✅ `src/routes/historial-propietarios.routes.ts` - Definición de rutas
- ✅ `src/routes/index.ts` - Rutas registradas

---

### **4. Reiniciar el Backend**

```bash
# Detener el servidor si está corriendo
# Ctrl + C

# Reiniciar el servidor
npm run dev
```

---

### **5. Verificar que las Rutas Están Activas**

```bash
# Probar endpoint de salud (si existe)
curl http://localhost:3000/api/vehiculos/1/propietarios

# Debería devolver 401 (no autenticado) o 200 con datos vacíos
```

---

## 🧪 Pruebas Básicas

### **Test 1: Registrar Propietario Anterior**

```bash
curl -X POST http://localhost:3000/api/vehiculos/1/propietarios/anterior \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nombrePropietario": "Juan Pérez",
    "numeroDocumento": "123456789",
    "telefono": "3001234567",
    "fechaAdquisicion": "2023-01-15",
    "valorCompra": 45000000
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Propietario anterior registrado exitosamente",
  "data": { ... }
}
```

---

### **Test 2: Obtener Historial**

```bash
curl -X GET http://localhost:3000/api/vehiculos/1/propietarios \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🔍 Verificación de Instalación

### **Checklist de Verificación**

- [ ] Tabla `HistorialPropietarios` creada en la base de datos
- [ ] Campo `PropietarioActualID` agregado a tabla `Vehiculos`
- [ ] Triggers creados correctamente
- [ ] Backend reiniciado sin errores
- [ ] Endpoints responden correctamente
- [ ] Validaciones funcionando

### **Consultas SQL de Verificación**

```sql
-- 1. Verificar estructura de tabla
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_KEY
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'HistorialPropietarios'
ORDER BY ORDINAL_POSITION;

-- 2. Verificar foreign keys
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'HistorialPropietarios'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- 3. Verificar índices
SHOW INDEX FROM HistorialPropietarios;
```

---

## 🐛 Solución de Problemas

### **Error: Tabla ya existe**
```sql
-- Eliminar tabla si necesitas recrearla
DROP TABLE IF EXISTS HistorialPropietarios;
-- Luego ejecuta el script de migración nuevamente
```

### **Error: Campo PropietarioActualID ya existe en Vehiculos**
```sql
-- Verificar si existe
SHOW COLUMNS FROM Vehiculos LIKE 'PropietarioActualID';

-- Si existe pero no tiene la foreign key correcta, eliminar y recrear
ALTER TABLE Vehiculos DROP COLUMN PropietarioActualID;
-- Luego ejecuta la parte del script que agrega el campo
```

### **Error: Triggers no se crean**
```sql
-- Verificar triggers existentes
SHOW TRIGGERS LIKE 'HistorialPropietarios';

-- Eliminar triggers si existen
DROP TRIGGER IF EXISTS trg_before_insert_historial_propietarios;
DROP TRIGGER IF EXISTS trg_before_update_historial_propietarios;

-- Recrear triggers ejecutando esa sección del script
```

### **Error: Backend no inicia**
```bash
# Verificar errores de TypeScript
npm run build

# Ver logs detallados
npm run dev
```

---

## 📊 Datos de Prueba (Opcional)

Si quieres insertar datos de prueba:

```sql
-- Insertar propietario anterior de ejemplo
INSERT INTO HistorialPropietarios (
  VehiculoID, TipoPropietario, NombrePropietario, 
  NumeroDocumento, Telefono, Ciudad, 
  FechaAdquisicion, ValorCompra, EsPropietarioActual
) VALUES (
  1, 'Anterior', 'Juan Pérez García', 
  '123456789', '3001234567', 'Cúcuta', 
  '2023-01-15', 45000000.00, FALSE
);

-- Insertar propietario actual de ejemplo
INSERT INTO HistorialPropietarios (
  VehiculoID, TipoPropietario, NombrePropietario, 
  NumeroDocumento, Telefono, Ciudad, 
  FechaAdquisicion, ValorCompra, TraspasoRealizado,
  FechaTraspaso, NumeroTraspaso, OrganismoTransito,
  EsPropietarioActual
) VALUES (
  1, 'Actual', 'Mi Nombre Completo', 
  '987654321', '3009876543', 'Cúcuta', 
  '2023-01-15', 45000000.00, TRUE,
  '2023-02-01', 'TR-2023-001', 'Tránsito Cúcuta',
  TRUE
);

-- Actualizar referencia en Vehiculos
UPDATE Vehiculos 
SET PropietarioActualID = LAST_INSERT_ID() 
WHERE VehiculoID = 1;
```

---

## 📚 Documentación Adicional

- **API Completa:** Ver `HISTORIAL_PROPIETARIOS_API.md`
- **Ejemplos de Uso:** Ver sección de endpoints en la documentación
- **Integración con Contratos:** Pendiente de implementar

---

## ✅ Instalación Completada

Si todos los pasos anteriores se completaron exitosamente, el sistema de historial de propietarios está listo para usar.

### **Próximos Pasos:**

1. Probar todos los endpoints desde Postman o tu cliente HTTP favorito
2. Integrar con el frontend (si aplica)
3. Configurar integración automática con contratos
4. Implementar notificaciones de traspasos pendientes

---

## 🆘 Soporte

Si encuentras problemas durante la instalación:

1. Revisa los logs del backend
2. Verifica la estructura de la base de datos
3. Confirma que todas las dependencias están instaladas
4. Revisa que el token de autenticación sea válido

---

**¡Sistema de Historial de Propietarios instalado exitosamente! 🎉**
