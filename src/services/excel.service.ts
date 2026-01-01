// ============================================
// SERVICIO DE EXPORTACIÓN EXCEL AVANZADA
// ============================================

import ExcelJS from 'exceljs';
import { Request, Response } from 'express';

interface ExportOptions {
  includeCharts?: boolean;
  includeImages?: boolean;
  orientation?: 'portrait' | 'landscape';
  fitToPage?: boolean;
}

// ============================================
// REPORTE COMPLETO DEL SISTEMA
// ============================================

export const exportarReporteCompleto = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;
    const workbook = new ExcelJS.Workbook();
    
    // Metadata del archivo
    workbook.creator = 'Sistema de Gestión de Activos';
    workbook.lastModifiedBy = 'Sistema';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // Crear hojas
    await crearHojaResumen(workbook, usuarioId);
    await crearHojaVehiculos(workbook, usuarioId);
    await crearHojaPropiedades(workbook, usuarioId);
    await crearHojaMantenimientos(workbook, usuarioId);
    await crearHojaPagos(workbook, usuarioId);
    await crearHojaPolizas(workbook, usuarioId);
    await crearHojaEstadisticas(workbook, usuarioId);
    
    // Configurar respuesta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Reporte_Completo_${new Date().toISOString().split('T')[0]}.xlsx`
    );
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// HOJA 1: RESUMEN EJECUTIVO
// ============================================

async function crearHojaResumen(workbook: ExcelJS.Workbook, usuarioId: number) {
  const sheet = workbook.addWorksheet('Resumen Ejecutivo', {
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'portrait',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0
    }
  });
  
  // Obtener datos de resumen
  const stats = await obtenerEstadisticas(usuarioId);
  
  // HEADER CON LOGO Y TÍTULO
  sheet.mergeCells('A1:H1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'REPORTE EJECUTIVO DE ACTIVOS';
  titleCell.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' }
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(1).height = 35;
  
  // Información general
  sheet.mergeCells('A3:B3');
  sheet.getCell('A3').value = 'Fecha de generación:';
  sheet.getCell('A3').font = { bold: true };
  sheet.getCell('C3').value = new Date().toLocaleDateString('es-CO');
  
  sheet.mergeCells('A4:B4');
  sheet.getCell('A4').value = 'Usuario:';
  sheet.getCell('A4').font = { bold: true };
  sheet.getCell('C4').value = stats.usuario;
  
  // SECCIÓN: RESUMEN DE ACTIVOS
  sheet.mergeCells('A6:H6');
  const seccionCell = sheet.getCell('A6');
  seccionCell.value = 'RESUMEN DE ACTIVOS';
  seccionCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF2563EB' } };
  seccionCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE3F2FD' }
  };
  seccionCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(6).height = 25;
  
  // Tabla de resumen
  const resumenData = [
    ['Categoría', 'Cantidad', 'Valor Total', 'Valor Promedio'],
    ['Vehículos', stats.totalVehiculos, formatCurrency(stats.valorVehiculos), formatCurrency(stats.promedioVehiculos)],
    ['Propiedades', stats.totalPropiedades, formatCurrency(stats.valorPropiedades), formatCurrency(stats.promedioPropiedades)],
    ['Pólizas Activas', stats.polizasActivas, formatCurrency(stats.valorAsegurado), '-'],
    ['Pagos Pendientes', stats.pagosPendientes, formatCurrency(stats.montoPendiente), '-']
  ];
  
  let currentRow = 8;
  resumenData.forEach((row: (string | number)[], index: number) => {
    const excelRow = sheet.getRow(currentRow + index);
    row.forEach((value: string | number, colIndex: number) => {
      const cell = excelRow.getCell(colIndex + 1);
      cell.value = value;
      
      if (index === 0) {
        // Header de tabla
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1E40AF' }
        };
      } else {
        // Datos
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Alternar colores de fila
        if (index % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF3F4F6' }
          };
        }
      }
      
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    excelRow.height = 20;
  });
  
  // SECCIÓN: ALERTAS Y VENCIMIENTOS
  currentRow += resumenData.length + 2;
  sheet.mergeCells(`A${currentRow}:H${currentRow}`);
  const alertasCell = sheet.getCell(`A${currentRow}`);
  alertasCell.value = 'ALERTAS Y VENCIMIENTOS PRÓXIMOS';
  alertasCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFDC2626' } };
  alertasCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFEF2F2' }
  };
  alertasCell.alignment = { vertical: 'middle', horizontal: 'center' };
  
  currentRow += 2;
  const alertasData = [
    ['Tipo', 'Descripción', 'Días Restantes', 'Prioridad'],
    ...stats.alertas.map((a: any) => [
      a.tipo,
      a.descripcion,
      a.diasRestantes,
      a.prioridad
    ])
  ];
  
  alertasData.forEach((row: (string | number)[], index: number) => {
    const excelRow = sheet.getRow(currentRow + index);
    row.forEach((value: string | number, colIndex: number) => {
      const cell = excelRow.getCell(colIndex + 1);
      cell.value = value;
      
      if (index === 0) {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFDC2626' }
        };
      } else {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Color según prioridad
        const prioridad = row[3];
        if (prioridad === 'Alta') {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFEE2E2' }
          };
        }
      }
      
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  });
  
  // Ajustar anchos de columna
  sheet.getColumn(1).width = 20;
  sheet.getColumn(2).width = 15;
  sheet.getColumn(3).width = 20;
  sheet.getColumn(4).width = 20;
}

// ============================================
// HOJA 2: VEHÍCULOS
// ============================================

async function crearHojaVehiculos(workbook: ExcelJS.Workbook, usuarioId: number) {
  const sheet = workbook.addWorksheet('Vehículos', {
    pageSetup: {
      paperSize: 9,
      orientation: 'landscape',
      fitToPage: true
    }
  });
  
  // Título
  sheet.mergeCells('A1:J1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'INVENTARIO DE VEHÍCULOS';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' }
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(1).height = 30;
  
  // Obtener datos
  const vehiculos = await obtenerVehiculos(usuarioId);
  
  // Headers
  const headers = [
    'Placa',
    'Marca',
    'Modelo',
    'Año',
    'Tipo',
    'Valor',
    'SOAT',
    'Tecnomecánica',
    'Estado',
    'Observaciones'
  ];
  
  const headerRow = sheet.getRow(3);
  headers.forEach((header: string, index: number) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E40AF' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  headerRow.height = 25;
  
  // Datos
  vehiculos.forEach((vehiculo: any, index: number) => {
    const row = sheet.getRow(4 + index);
    const rowData = [
      vehiculo.Placa,
      vehiculo.Marca,
      vehiculo.Modelo,
      vehiculo.Anio,
      vehiculo.TipoVehiculo,
      formatCurrency(vehiculo.ValorComercial),
      vehiculo.FechaVencimientoSOAT ? new Date(vehiculo.FechaVencimientoSOAT).toLocaleDateString('es-CO') : '-',
      vehiculo.FechaVencimientoTecnomecanica ? new Date(vehiculo.FechaVencimientoTecnomecanica).toLocaleDateString('es-CO') : '-',
      vehiculo.Estado,
      vehiculo.Observaciones || '-'
    ];
    
    rowData.forEach((value: string | number, colIndex: number) => {
      const cell = row.getCell(colIndex + 1);
      cell.value = value;
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      
      // Alternar colores
      if (index % 2 === 0) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF9FAFB' }
        };
      }
    });
    row.height = 20;
  });
  
  // Resumen al final
  const resumenRow = sheet.getRow(4 + vehiculos.length + 2);
  resumenRow.getCell(1).value = 'TOTALES:';
  resumenRow.getCell(1).font = { bold: true };
  resumenRow.getCell(2).value = `${vehiculos.length} vehículos`;
  resumenRow.getCell(6).value = formatCurrency(vehiculos.reduce((sum: number, v: any) => sum + (v.ValorComercial || 0), 0));
  resumenRow.getCell(6).font = { bold: true };
  
  // Ajustar columnas
  sheet.columns = [
    { width: 12 }, // Placa
    { width: 15 }, // Marca
    { width: 15 }, // Modelo
    { width: 8 },  // Año
    { width: 15 }, // Tipo
    { width: 18 }, // Valor
    { width: 15 }, // SOAT
    { width: 18 }, // Tecnomecánica
    { width: 12 }, // Estado
    { width: 30 }  // Observaciones
  ];
  
  // Filtros
  sheet.autoFilter = {
    from: 'A3',
    to: `J${3 + vehiculos.length}`
  };
}

// ============================================
// HOJA 3: PROPIEDADES
// ============================================

async function crearHojaPropiedades(workbook: ExcelJS.Workbook, usuarioId: number) {
  const sheet = workbook.addWorksheet('Propiedades', {
    pageSetup: {
      paperSize: 9,
      orientation: 'landscape'
    }
  });
  
  // Similar a vehículos pero con campos de propiedades
  // ... implementación similar
}

// ============================================
// HOJA 7: ESTADÍSTICAS CON GRÁFICOS
// ============================================

async function crearHojaEstadisticas(workbook: ExcelJS.Workbook, usuarioId: number) {
  const sheet = workbook.addWorksheet('Estadísticas', {
    pageSetup: {
      paperSize: 9,
      orientation: 'landscape'
    }
  });
  
  // Título
  sheet.mergeCells('A1:H1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'ESTADÍSTICAS Y GRÁFICOS';
  titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' }
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  
  // Datos para gráfico
  const stats = await obtenerEstadisticas(usuarioId);
  
  // Tabla de datos
  sheet.getCell('A3').value = 'Distribución de Activos';
  sheet.getCell('A3').font = { bold: true, size: 12 };
  
  const chartData = [
    ['Categoría', 'Cantidad', 'Valor Total'],
    ['Vehículos', stats.totalVehiculos, stats.valorVehiculos],
    ['Propiedades', stats.totalPropiedades, stats.valorPropiedades]
  ];
  
  chartData.forEach((row: (string | number)[], index: number) => {
    row.forEach((value: string | number, colIndex: number) => {
      const cell = sheet.getCell(5 + index, 1 + colIndex);
      cell.value = value;
      if (index === 0) {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE3F2FD' }
        };
      }
    });
  });
  
  // NOTA: ExcelJS no soporta gráficos nativos aún
  // Alternativa: Usar fórmulas SPARKLINE o agregar imágenes de gráficos
}

// ============================================
// EXPORTACIÓN PERSONALIZADA
// ============================================

export const exportarPersonalizado = async (req: Request, res: Response) => {
  try {
    const { hojas, filtros, formato } = req.body;
    const usuarioId = (req as any).user.UsuarioID;
    
    const workbook = new ExcelJS.Workbook();
    
    // Crear solo las hojas solicitadas
    if (hojas.includes('vehiculos')) {
      await crearHojaVehiculos(workbook, usuarioId);
    }
    if (hojas.includes('propiedades')) {
      await crearHojaPropiedades(workbook, usuarioId);
    }
    // ... más hojas
    
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Reporte_Personalizado_${Date.now()}.xlsx`
    );
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

async function obtenerEstadisticas(usuarioId: number): Promise<any> {
  // TODO: Implementar queries a la base de datos
  return {
    usuario: 'Usuario Demo',
    totalVehiculos: 10,
    valorVehiculos: 500000000,
    promedioVehiculos: 50000000,
    totalPropiedades: 5,
    valorPropiedades: 1500000000,
    promedioPropiedades: 300000000,
    polizasActivas: 8,
    valorAsegurado: 2000000000,
    pagosPendientes: 3,
    montoPendiente: 5000000,
    alertas: [
      { tipo: 'SOAT', descripcion: 'SOAT ABC-123', diasRestantes: 5, prioridad: 'Alta' },
      { tipo: 'Predial', descripcion: 'Predial Cra 15', diasRestantes: 15, prioridad: 'Media' }
    ]
  };
}

async function obtenerVehiculos(usuarioId: number): Promise<any[]> {
  // TODO: Query real
  return [];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
}

// Exports adicionales para otras funciones
async function crearHojaMantenimientos(workbook: ExcelJS.Workbook, usuarioId: number) {}
async function crearHojaPagos(workbook: ExcelJS.Workbook, usuarioId: number) {}
async function crearHojaPolizas(workbook: ExcelJS.Workbook, usuarioId: number) {}