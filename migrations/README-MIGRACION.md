# Migración de Base de Datos - Sistema de Usuarios y Roles

## 🎯 Objetivo
Actualizar la estructura de la base de datos para soportar el nuevo sistema de usuarios, roles y auditoría.

## 📋 Scripts de Migración

Ejecutar en el siguiente orden:

### 1. Crear Tabla Roles
```sql
-- Archivo: crear-tabla-roles.sql
```
Crea la tabla `Roles` con los campos necesarios para el sistema de permisos.

### 2. Actualizar Tabla Usuarios
```sql
-- Archivo: actualizar-tabla-usuarios.sql
```
Agrega las nuevas columnas a la tabla `Usuarios` existente:
- `RolID` - Foreign key a Roles
- `Telefono` - Teléfono del usuario
- `Direccion` - Dirección del usuario
- `FechaNacimiento` - Fecha de nacimiento
- `Activo` - Reemplaza la columna `Estado`
- `UltimoAcceso` - Fecha del último login
- `createdAt` - Timestamp de creación
- `updatedAt` - Timestamp de actualización

### 3. Crear Tabla Auditoria
```sql
-- Archivo: crear-tabla-auditoria.sql
```
Crea la tabla `Auditoria` para registrar todas las acciones de los usuarios.

### 4. Agregar Foreign Key
```sql
-- Después de crear Roles y actualizar Usuarios
ALTER TABLE Usuarios 
ADD CONSTRAINT FK_Usuarios_Roles 
FOREIGN KEY (RolID) REFERENCES Roles(RolID);
```

## 🚀 Pasos para Ejecutar

### Opción A: SQL Server Management Studio (SSMS)

1. Abrir SSMS y conectarse a tu servidor
2. Abrir cada archivo .sql en orden
3. Ejecutar cada script (F5)
4. Verificar que no haya errores

### Opción B: Línea de Comandos

```bash
# Desde el directorio migrations/
sqlcmd -S DESKTOP-444DVUN\SQLEXPRESS -d SistemaActivos -i crear-tabla-roles.sql
sqlcmd -S DESKTOP-444DVUN\SQLEXPRESS -d SistemaActivos -i actualizar-tabla-usuarios.sql
sqlcmd -S DESKTOP-444DVUN\SQLEXPRESS -d SistemaActivos -i crear-tabla-auditoria.sql
```

## ✅ Verificación

Después de ejecutar los scripts, verificar:

```sql
-- Ver estructura de Usuarios
EXEC sp_help 'Usuarios';

-- Ver estructura de Roles
EXEC sp_help 'Roles';

-- Ver estructura de Auditoria
EXEC sp_help 'Auditoria';

-- Verificar foreign keys
SELECT 
    fk.name AS ForeignKeyName,
    tp.name AS ParentTable,
    cp.name AS ParentColumn,
    tr.name AS ReferencedTable,
    cr.name AS ReferencedColumn
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
INNER JOIN sys.tables tp ON fkc.parent_object_id = tp.object_id
INNER JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
INNER JOIN sys.tables tr ON fkc.referenced_object_id = tr.object_id
INNER JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
WHERE tp.name IN ('Usuarios', 'Auditoria');
```

## 📝 Notas Importantes

1. **Backup**: Hacer backup de la base de datos antes de ejecutar los scripts
2. **Columna Estado**: La columna antigua `Estado` no se elimina automáticamente por seguridad. Eliminarla manualmente después de verificar que todo funciona:
   ```sql
   ALTER TABLE Usuarios DROP COLUMN Estado;
   ```
3. **Datos Existentes**: Los usuarios existentes se migran automáticamente con `RolID = 4` (Consulta) por defecto
4. **Timestamps**: Los registros existentes tendrán `createdAt` y `updatedAt` con la fecha de ejecución del script

## 🔄 Siguiente Paso

Después de ejecutar los scripts:

1. Inicializar los roles por defecto:
   ```
   POST http://localhost:5000/api/roles/initialize
   ```

2. Actualizar el usuario de prueba con el RolID correcto:
   ```sql
   UPDATE Usuarios SET RolID = 1 WHERE Email = 'admin@sistema.com';
   ```

3. Probar el login desde el frontend

## ⚠️ Rollback (si es necesario)

Si algo sale mal, puedes revertir los cambios:

```sql
-- Eliminar foreign keys
ALTER TABLE Usuarios DROP CONSTRAINT FK_Usuarios_Roles;
ALTER TABLE Auditoria DROP CONSTRAINT FK_Auditoria_Usuarios;

-- Eliminar nuevas columnas de Usuarios
ALTER TABLE Usuarios DROP COLUMN RolID;
ALTER TABLE Usuarios DROP COLUMN Telefono;
ALTER TABLE Usuarios DROP COLUMN Direccion;
ALTER TABLE Usuarios DROP COLUMN FechaNacimiento;
ALTER TABLE Usuarios DROP COLUMN Activo;
ALTER TABLE Usuarios DROP COLUMN UltimoAcceso;
ALTER TABLE Usuarios DROP COLUMN createdAt;
ALTER TABLE Usuarios DROP COLUMN updatedAt;

-- Eliminar tablas nuevas
DROP TABLE Auditoria;
DROP TABLE Roles;
```
