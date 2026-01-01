import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface BienData {
  TipoBien: string;
  Rol: string;
  Parte: string;
  DescripcionBien?: string;
  ValorComercial: number;
  // Vehículo
  Marca?: string;
  Modelo?: string;
  Año?: number;
  Placa?: string;
  Clase?: string;
  Linea?: string;
  Tipo?: string;
  Color?: string;
  Cilindraje?: number;
  TipoCombustible?: string;
  Capacidad?: number;
  NumeroMotor?: string;
  NumeroChasis?: string;
  NumeroCarroceria?: string;
  Serie?: string;
  Servicio?: string;
  KilometrajeCompra?: number;
  KilometrajeActual?: number;
  NumeroSOAT?: string;
  AseguradoraSOAT?: string;
  FechaVencimientoSOAT?: string;
  FechaVencimientoTecnomecanica?: string;
  EstadoImpuestos?: string;
  AniosImpuestosPendientes?: string;
  TieneEmbargos?: boolean;
  // Propiedad
  TipoInmueble?: string;
  DireccionCompleta?: string;
  Municipio?: string;
  MatriculaInmobiliaria?: string;
  AreaConstruida?: number;
  NumeroHabitaciones?: number;
  NumeroBanos?: number;
  Estrato?: number;
  Matricula?: string;
}

interface ContratoData {
  tipo: string;
  folio: string;
  modalidad?: string;
  vendedor: {
    nombre: string;
    tipoDocumento?: string;
    documento: string;
    estadoCivil?: string;
    direccion?: string;
    departamento?: string;
    ciudad?: string;
    telefono?: string;
    email?: string;
  };
  comprador: {
    nombre: string;
    tipoDocumento?: string;
    documento: string;
    estadoCivil?: string;
    direccion?: string;
    departamento?: string;
    ciudad?: string;
    telefono?: string;
    email?: string;
  };
  valor: number;
  formaPago: string;
  fecha: string;
  clausulas?: string[];
  objeto?: string;
  observacionesAdicionales?: string;
  bienes?: BienData[];
  valorTotalEntrega?: number;
  valorTotalRecibe?: number;
  diferenciaValor?: number;
  quienPagaDiferencia?: string | null;
}

class PDFService {
  private uploadsDir = path.join(__dirname, '../../uploads/contratos');

  constructor() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async generarContrato(data: ContratoData): Promise<{ filename: string; hash: string; qr: string }> {
    const filename = `${data.folio}.pdf`;
    const filepath = path.join(this.uploadsDir, filename);

    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          size: 'LETTER', 
          margins: { top: 40, bottom: 50, left: 40, right: 40 } 
        });
        const writeStream = fs.createWriteStream(filepath);
        doc.pipe(writeStream);

        // ============================================
        // ENCABEZADO CON DISEÑO PROFESIONAL
        // ============================================
        this.dibujarEncabezado(doc, data);
        
        // ============================================
        // OBJETO DEL CONTRATO
        // ============================================
        if (data.objeto) {
          this.dibujarObjetoContrato(doc, data);
          doc.moveDown(1);
        }
        
        // ============================================
        // PARTES DEL CONTRATO EN TABLA
        // ============================================
        this.dibujarPartesContrato(doc, data);
        
        doc.moveDown(1.5);

        // ============================================
        // BIENES OBJETO DEL CONTRATO
        // ============================================
        if (data.bienes && data.bienes.length > 0) {
          this.dibujarBienesContrato(doc, data);
          doc.moveDown(1.5);
        }

        // Valor
        this.dibujarValorFormaPago(doc, data);
        doc.moveDown(1.5);

        // Cláusulas
        if (data.clausulas && data.clausulas.length > 0) {
          this.dibujarClausulas(doc, data);
        }

        // Observaciones Adicionales
        if (data.observacionesAdicionales) {
          this.dibujarObservacionesAdicionales(doc, data);
        }

        doc.moveDown(2);

        // Fecha y ciudad de firma
        const fechaFormateada = this.formatearFechaTexto(data.fecha);
        const ciudad = data.vendedor.ciudad || data.comprador.ciudad || 'Cúcuta';
        doc.fontSize(10)
           .font('Helvetica')
           .text(
             `Este documento se firma el día ${fechaFormateada.dia} del mes de ${fechaFormateada.mes} del año ${fechaFormateada.anio} en la Ciudad de ${ciudad}.`,
             40,
             doc.y,
             { align: 'center', width: doc.page.width - 80 }
           );

        doc.moveDown(2);

        // Firmas
        doc.fontSize(12).font('Helvetica-Bold').text('FIRMAS', { align: 'center' });
        doc.moveDown(2);
        
        doc.fontSize(10).font('Helvetica');
        const pageWidth = doc.page.width - 100;
        const signatureWidth = pageWidth / 2;
        
        doc.text('_____________________', 50, doc.y, { width: signatureWidth, align: 'center' });
        doc.text('_____________________', 50 + signatureWidth, doc.y - 12, { width: signatureWidth, align: 'center' });
        doc.moveDown();
        doc.text('Vendedor', 50, doc.y, { width: signatureWidth, align: 'center' });
        doc.text('Comprador', 50 + signatureWidth, doc.y - 12, { width: signatureWidth, align: 'center' });

        doc.moveDown(3);

        // QR y Hash
        const contenido = `${data.folio}-${data.fecha}-${data.vendedor.documento}-${data.comprador.documento}-${data.valor}`;
        const hash = crypto.createHash('sha256').update(contenido).digest('hex');
        const qrData = `${data.folio}|${hash.substring(0, 16)}`;
        const qrBuffer = await QRCode.toBuffer(qrData, { width: 100 });

        doc.image(qrBuffer, 50, doc.y, { width: 80 });
        doc.fontSize(8).text(`Hash: ${hash.substring(0, 32)}...`, 140, doc.y - 60);
        doc.text(`Código verificación: ${qrData}`, 140);

        doc.end();

        writeStream.on('finish', () => {
          resolve({ filename, hash, qr: qrData });
        });

        writeStream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  private formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO').format(valor);
  }

  private numeroRomano(num: number): string {
    const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return romanos[num - 1] || num.toString();
  }

  private formatearFechaTexto(fecha: string): { dia: string; mes: string; anio: string } {
    // Asume formato YYYY-MM-DD o DD/MM/YYYY
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    let dia, mes, anio;
    
    if (fecha.includes('-')) {
      // Formato YYYY-MM-DD
      const partes = fecha.split('-');
      anio = partes[0];
      mes = meses[parseInt(partes[1]) - 1];
      dia = partes[2].padStart(2, '0');
    } else if (fecha.includes('/')) {
      // Formato DD/MM/YYYY
      const partes = fecha.split('/');
      dia = partes[0].padStart(2, '0');
      mes = meses[parseInt(partes[1]) - 1];
      anio = partes[2];
    } else {
      // Fallback
      const date = new Date(fecha);
      dia = date.getDate().toString().padStart(2, '0');
      mes = meses[date.getMonth()];
      anio = date.getFullYear().toString();
    }
    
    return { dia, mes, anio };
  }

  private dibujarEncabezado(doc: any, data: ContratoData): void {
    const pageWidth = doc.page.width - 80;
    
    // Rectángulo de fondo para el título
    doc.rect(40, 40, pageWidth, 60).fillAndStroke('#2c3e50', '#34495e');
    
    // Título principal
    doc.fillColor('#ffffff')
       .fontSize(22)
       .font('Helvetica-Bold')
       .text(`CONTRATO DE ${data.tipo.toUpperCase()}`, 40, 55, {
         width: pageWidth,
         align: 'center'
       });
    
    // Modalidad
    if (data.modalidad) {
      doc.fontSize(12)
         .font('Helvetica')
         .text(`Modalidad: ${data.modalidad}`, 40, 80, {
           width: pageWidth,
           align: 'center'
         });
    }
    
    doc.fillColor('#000000');
    
    // Información del folio y fecha en recuadro
    const infoY = 110;
   // doc.rect(40, infoY, pageWidth, 30).stroke('#2c3e50');
    
    doc.fontSize(9)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text('FOLIO:', 50, infoY + 8)
       .font('Helvetica')
       .fillColor('#000000')
       .text(data.folio, 90, infoY + 8);
    
    doc.font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text('FECHA:', pageWidth - 100, infoY + 8)
       .font('Helvetica')
       .fillColor('#000000')
       .text(data.fecha, pageWidth - 50, infoY + 8);
    
    doc.y = infoY + 45;
  }

  private dibujarPartesContrato(doc: any, data: ContratoData): void {
    const pageWidth = doc.page.width - 80;
    const startY = doc.y;
    
    // Título de sección
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text('PARTES DEL CONTRATO', 40, startY);
    
    doc.fillColor('#000000');
    doc.y = startY + 25;
    
    const tableTop = doc.y;
    const col1X = 40;
    const col2X = 40 + (pageWidth / 2);
    const colWidth = (pageWidth / 2) - 10;
    
    // Encabezados de columnas con fondo
    doc.rect(col1X, tableTop, colWidth, 25).fillAndStroke('#34495e', '#2c3e50');
    doc.rect(col2X, tableTop, colWidth, 25).fillAndStroke('#34495e', '#2c3e50');
    
    doc.fillColor('#ffffff')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('VENDEDOR / ARRENDADOR', col1X + 5, tableTop + 8, { width: colWidth - 10 })
       .text('COMPRADOR / ARRENDATARIO', col2X + 5, tableTop + 8, { width: colWidth - 10 });
    
    doc.fillColor('#000000');
    
    // Contenido de las columnas
    let currentY = tableTop + 30;
    const lineHeight = 14;
    const fontSize = 9;
    
    // Vendedor
    doc.fontSize(fontSize).font('Helvetica-Bold');
    doc.text('Nombre:', col1X + 5, currentY, { continued: true, width: colWidth - 10 })
       .font('Helvetica')
       .text(` ${data.vendedor.nombre}`);
    
    currentY += lineHeight;
    doc.font('Helvetica-Bold')
       .text('Documento:', col1X + 5, currentY, { continued: true, width: colWidth - 10 })
       .font('Helvetica')
       .text(` ${data.vendedor.tipoDocumento || 'CC'} ${data.vendedor.documento}`);
    
    if (data.vendedor.estadoCivil) {
      currentY += lineHeight;
      doc.font('Helvetica-Bold')
         .text('Estado Civil:', col1X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${data.vendedor.estadoCivil}`);
    }
    
    if (data.vendedor.direccion) {
      currentY += lineHeight;
      doc.font('Helvetica-Bold')
         .text('Dirección:', col1X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${data.vendedor.direccion}`);
    }
    
    if (data.vendedor.ciudad) {
      currentY += lineHeight;
      doc.font('Helvetica-Bold')
         .text('Ciudad:', col1X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${data.vendedor.ciudad}`);
    }
    
    if (data.vendedor.telefono) {
      currentY += lineHeight;
      doc.font('Helvetica-Bold')
         .text('Teléfono:', col1X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${data.vendedor.telefono}`);
    }
    
    if (data.vendedor.email) {
      currentY += lineHeight;
      doc.font('Helvetica-Bold')
         .text('Email:', col1X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${data.vendedor.email}`);
    }
    
    // Comprador (misma altura que vendedor)
    currentY = tableTop + 30;
    
    doc.fontSize(fontSize).font('Helvetica-Bold');
    doc.text('Nombre:', col2X + 5, currentY, { continued: true, width: colWidth - 10 })
       .font('Helvetica')
       .text(` ${data.comprador.nombre}`);
    
    currentY += lineHeight;
    doc.font('Helvetica-Bold')
       .text('Documento:', col2X + 5, currentY, { continued: true, width: colWidth - 10 })
       .font('Helvetica')
       .text(` ${data.comprador.tipoDocumento || 'CC'} ${data.comprador.documento}`);
    
    if (data.comprador.estadoCivil) {
      currentY += lineHeight;
      doc.font('Helvetica-Bold')
         .text('Estado Civil:', col2X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${data.comprador.estadoCivil}`);
    }
    
    if (data.comprador.direccion) {
      currentY += lineHeight;
      doc.font('Helvetica-Bold')
         .text('Dirección:', col2X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${data.comprador.direccion}`);
    }
    
    if (data.comprador.ciudad) {
      currentY += lineHeight;
      doc.font('Helvetica-Bold')
         .text('Ciudad:', col2X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${data.comprador.ciudad}`);
    }
    
    if (data.comprador.telefono) {
      currentY += lineHeight;
      doc.font('Helvetica-Bold')
         .text('Teléfono:', col2X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${data.comprador.telefono}`);
    }
    
    if (data.comprador.email) {
      currentY += lineHeight;
      doc.font('Helvetica-Bold')
         .text('Email:', col2X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${data.comprador.email}`);
    }
    
    // Calcular altura máxima y dibujar bordes
    const maxHeight = Math.max(
      this.calcularAlturaParteContrato(data.vendedor),
      this.calcularAlturaParteContrato(data.comprador)
    );
    
    doc.rect(col1X, tableTop + 25, colWidth, maxHeight).stroke('#2c3e50');
    doc.rect(col2X, tableTop + 25, colWidth, maxHeight).stroke('#2c3e50');
    
    doc.y = tableTop + 25 + maxHeight + 10;
  }

  private calcularAlturaParteContrato(parte: any): number {
    let lineas = 2; // Nombre y documento siempre
    if (parte.estadoCivil) lineas++;
    if (parte.direccion) lineas++; // Dirección ocupa 1 línea
    if (parte.ciudad) lineas++;
    if (parte.telefono) lineas++;
    if (parte.email) lineas++;
    return lineas * 14 + 10;
  }

  private dibujarObjetoContrato(doc: any, data: ContratoData): void {
    const pageWidth = doc.page.width - 80;
    const startY = doc.y;
    
    // Título de sección
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text('OBJETO DEL CONTRATO', 40, startY);
    
    doc.fillColor('#000000');
    doc.y = startY + 18;
    
    const boxY = doc.y;
    
    // Primero dibujar el texto para calcular la altura real
    const textStartY = boxY + 8;
    doc.fontSize(10)
       .font('Helvetica')
       .text(data.objeto || '', 50, textStartY, {
         width: pageWidth - 20,
         align: 'justify'
       });
    
    // Calcular altura basada en la posición final del texto
    const textEndY = doc.y;
    const boxHeight = textEndY - boxY + 5;
    
    // Ahora dibujar el recuadro con la altura correcta
    //doc.rect(40, boxY, pageWidth, boxHeight).stroke('#2c3e50');
    
    doc.y = boxY + boxHeight + 5;
  }

  private dibujarValorFormaPago(doc: any, data: ContratoData): void {
    const pageWidth = doc.page.width - 80;
    const startY = doc.y;
    
    // Título de sección
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text('VALOR Y FORMA DE PAGO', 40, startY);
    
    doc.fillColor('#000000');
    doc.y = startY + 25;
    
    const boxY = doc.y;
    const boxHeight = 50;
    
    // Recuadro con fondo suave
    doc.rect(40, boxY, pageWidth, boxHeight).fillAndStroke('#f8f9fa', '#2c3e50');
    
    // Contenido
    doc.fillColor('#000000')
       .fontSize(10)
       .font('Helvetica-Bold')
       .text('Valor del contrato:', 50, boxY + 12, { continued: true })
       .font('Helvetica')
       .text(` $${this.formatearMoneda(data.valor)}`, { continued: false });
    
    doc.font('Helvetica-Bold')
       .text('Forma de pago:', 50, boxY + 30, { continued: true })
       .font('Helvetica')
       .text(` ${data.formaPago}`, { continued: false });
    
    doc.y = boxY + boxHeight + 10;
  }

  private dibujarClausulas(doc: any, data: ContratoData): void {
    const pageWidth = doc.page.width - 80;
    
    // Verificar si hay espacio suficiente para el título y al menos una cláusula
    if (doc.y > doc.page.height - 150) {
      doc.addPage();
    }
    
    const startY = doc.y;
    
    // Título de sección
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text('CLÁUSULAS', 40, startY);
    
    doc.fillColor('#000000');
    doc.y = startY + 25;
    
    // Dibujar cada cláusula con numeración romana
    doc.fontSize(10).font('Helvetica');
    
    data.clausulas?.forEach((clausula, i) => {
      const numeroRomano = this.numeroRomano(i + 1);
      
      // Verificar si hay espacio suficiente para la cláusula
      if (doc.y > doc.page.height - 100) {
        doc.addPage();
      }
      
      const currentY = doc.y;
      
      // Dibujar número romano en negrita
      doc.font('Helvetica-Bold')
         .text(`${numeroRomano}. `, 50, currentY, { 
           continued: true,
           width: pageWidth - 60
         });
      
      // Dibujar texto de la cláusula
      doc.font('Helvetica')
         .text(clausula, { 
           width: pageWidth - 60,
           align: 'justify',
           continued: false
         });
      
      doc.moveDown(0.8);
    });
    
    // Línea separadora al final
    const finalY = doc.y;
    doc.moveTo(40, finalY)
       .lineTo(40 + pageWidth, finalY)
       .stroke('#e0e0e0');
    
    doc.moveDown(0.5);
  }

  private dibujarObservacionesAdicionales(doc: any, data: ContratoData): void {
    const pageWidth = doc.page.width - 80;
    
    // Verificar si hay espacio suficiente
    if (doc.y > doc.page.height - 150) {
      doc.addPage();
    }
    
    const startY = doc.y;
    
    // Título de sección
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text('OBSERVACIONES ADICIONALES', 40, startY);
    
    doc.fillColor('#000000');
    doc.y = startY + 25;
    
    // Dibujar el texto de observaciones
    doc.fontSize(10)
       .font('Helvetica')
       .text(data.observacionesAdicionales || '', 50, doc.y, {
         width: pageWidth - 20,
         align: 'justify'
       });
    
    doc.moveDown(1);
    
    // Línea separadora al final
    const finalY = doc.y;
    doc.moveTo(40, finalY)
       .lineTo(40 + pageWidth, finalY)
       .stroke('#e0e0e0');
    
    doc.moveDown(0.5);
  }

  private dibujarBienesContrato(doc: any, data: ContratoData): void {
    const pageWidth = doc.page.width - 80;
    const startY = doc.y;
    
    // Debug: Log para ver qué datos llegan
    console.log('=== BIENES RECIBIDOS ===');
    console.log('Cantidad de bienes:', data.bienes?.length);
    console.log('Bienes:', JSON.stringify(data.bienes, null, 2));
    
    // Determinar el título según el tipo de bien
    const primerBien = data.bienes?.[0];
    let titulo = 'INFORMACIÓN DEL BIEN';
    if (primerBien?.TipoBien === 'Vehiculo' || primerBien?.TipoBien === 'Moto') {
      titulo = 'INFORMACIÓN DEL VEHÍCULO';
    } else if (primerBien?.TipoBien === 'Propiedad') {
      titulo = 'INFORMACIÓN DE LA PROPIEDAD';
    }
    
    // Título de sección
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text(titulo, 40, startY);
    
    doc.fillColor('#000000');
    doc.y = startY + 25;
    
    // Dibujar cada bien (vehículo o propiedad)
    data.bienes?.forEach((bien, index) => {
      console.log(`Procesando bien ${index + 1}:`, bien.TipoBien);
      
      if (bien.TipoBien === 'Vehiculo' || bien.TipoBien === 'Moto') {
        this.dibujarVehiculo(doc, bien, pageWidth);
      } else if (bien.TipoBien === 'Propiedad') {
        this.dibujarPropiedad(doc, bien, pageWidth);
      }
      
      if (index < (data.bienes?.length || 0) - 1) {
        doc.moveDown(1);
      }
    });
    
    // Resumen de valores en permuta
    if (data.modalidad !== 'Compraventa' && data.modalidad !== 'Arrendamiento') {
      doc.moveDown(1.5);
      
      const boxY = doc.y;
      const boxHeight = 80;
      
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#2c3e50')
         .text('RESUMEN DE VALORES', 40, boxY);
      
      doc.fillColor('#000000');
      doc.y = boxY + 25;
      
      const summaryY = doc.y;
      doc.rect(40, summaryY, pageWidth, boxHeight).fillAndStroke('#f8f9fa', '#2c3e50');
      
      doc.fontSize(10).font('Helvetica-Bold');
      
      if (data.valorTotalEntrega) {
        doc.text('Valor total entregado:', 50, summaryY + 12, { continued: true })
           .font('Helvetica')
           .text(` $${this.formatearMoneda(data.valorTotalEntrega)}`);
      }
      
      if (data.valorTotalRecibe) {
        doc.font('Helvetica-Bold')
           .text('Valor total recibido:', 50, summaryY + 30, { continued: true })
           .font('Helvetica')
           .text(` $${this.formatearMoneda(data.valorTotalRecibe)}`);
      }
      
      if (data.diferenciaValor && data.diferenciaValor > 0) {
        doc.font('Helvetica-Bold')
           .text('Diferencia de valor:', 50, summaryY + 48, { continued: true })
           .font('Helvetica')
           .text(` $${this.formatearMoneda(data.diferenciaValor)}`);
        
        if (data.quienPagaDiferencia) {
          doc.font('Helvetica-Bold')
             .text('Quien paga la diferencia:', 50, summaryY + 66, { continued: true })
             .font('Helvetica')
             .text(` ${data.quienPagaDiferencia}`);
        }
      }
    }
  }

  private dibujarVehiculo(doc: any, bien: BienData, pageWidth: number): void {
    const startY = doc.y;
    const col1X = 40;
    const col2X = 40 + (pageWidth / 2);
    const colWidth = (pageWidth / 2) - 10;
    
    // Encabezado
    doc.rect(col1X, startY, pageWidth, 25).fillAndStroke('#34495e', '#2c3e50');
    doc.fillColor('#ffffff')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('🚗 INFORMACIÓN DEL VEHÍCULO', col1X + 5, startY + 8, { width: pageWidth - 10 });
    
    doc.fillColor('#000000');
    
    let col1Y = startY + 30;
    let col2Y = startY + 30;
    const lineHeight = 14;
    const fontSize = 9;
    
    doc.fontSize(fontSize);
    
    // COLUMNA 1 - Información básica
    if (bien.Marca || bien.Modelo || bien.Año) {
      doc.font('Helvetica-Bold')
         .text('Marca/Modelo/Año:', col1X + 5, col1Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.Marca || ''} ${bien.Modelo || ''} ${bien.Año || ''}`);
      col1Y += lineHeight;
    }
    
    if (bien.Placa) {
      doc.font('Helvetica-Bold')
         .text('Placa:', col1X + 5, col1Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.Placa}`);
      col1Y += lineHeight;
    }
    
    if (bien.Clase) {
      doc.font('Helvetica-Bold')
         .text('Clase:', col1X + 5, col1Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.Clase}`);
      col1Y += lineHeight;
    }
    
    if (bien.Linea) {
      doc.font('Helvetica-Bold')
         .text('Línea:', col1X + 5, col1Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.Linea}`);
      col1Y += lineHeight;
    }
    
    if (bien.Tipo) {
      doc.font('Helvetica-Bold')
         .text('Tipo:', col1X + 5, col1Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.Tipo}`);
      col1Y += lineHeight;
    }
    
    if (bien.Color) {
      doc.font('Helvetica-Bold')
         .text('Color:', col1X + 5, col1Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.Color}`);
      col1Y += lineHeight;
    }
    
    if (bien.Servicio) {
      doc.font('Helvetica-Bold')
         .text('Servicio:', col1X + 5, col1Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.Servicio}`);
      col1Y += lineHeight;
    }
    
    if (bien.Cilindraje) {
      doc.font('Helvetica-Bold')
         .text('Cilindraje:', col1X + 5, col1Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.Cilindraje} cc`);
      col1Y += lineHeight;
    }
    
    if (bien.TipoCombustible) {
      doc.font('Helvetica-Bold')
         .text('Combustible:', col1X + 5, col1Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.TipoCombustible}`);
      col1Y += lineHeight;
    }
    
    if (bien.Capacidad) {
      doc.font('Helvetica-Bold')
         .text('Capacidad:', col1X + 5, col1Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.Capacidad} pasajeros`);
      col1Y += lineHeight;
    }
    
    if (bien.KilometrajeCompra) {
      doc.font('Helvetica-Bold')
         .text('Km Compra:', col1X + 5, col1Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${this.formatearMoneda(bien.KilometrajeCompra)} km`);
      col1Y += lineHeight;
    }
    
    if (bien.KilometrajeActual) {
      doc.font('Helvetica-Bold')
         .text('Km Actual:', col1X + 5, col1Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${this.formatearMoneda(bien.KilometrajeActual)} km`);
      col1Y += lineHeight;
    }
    
    // COLUMNA 2 - Información técnica y legal
    if (bien.NumeroMotor) {
      doc.font('Helvetica-Bold')
         .text('Número de Motor:', col2X + 5, col2Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.NumeroMotor}`);
      col2Y += lineHeight;
    }
    
    if (bien.NumeroChasis) {
      doc.font('Helvetica-Bold')
         .text('Número de Chasis:', col2X + 5, col2Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.NumeroChasis}`);
      col2Y += lineHeight;
    }
    
    if (bien.NumeroCarroceria) {
      doc.font('Helvetica-Bold')
         .text('Número de Carrocería:', col2X + 5, col2Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.NumeroCarroceria}`);
      col2Y += lineHeight;
    }
    
    if (bien.Serie) {
      doc.font('Helvetica-Bold')
         .text('Serie:', col2X + 5, col2Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.Serie}`);
      col2Y += lineHeight;
    }
    
    if (bien.EstadoImpuestos) {
      doc.font('Helvetica-Bold')
         .text('Estado Impuestos:', col2X + 5, col2Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.EstadoImpuestos}`);
      col2Y += lineHeight;
      
      // Mostrar años pendientes si el estado es "Debe"
      if (bien.EstadoImpuestos === 'Debe' && bien.AniosImpuestosPendientes) {
        doc.font('Helvetica-Bold')
           .text('Años Pendientes:', col2X + 5, col2Y, { continued: true, width: colWidth - 10 })
           .font('Helvetica')
           .text(` ${bien.AniosImpuestosPendientes}`);
        col2Y += lineHeight;
      }
    }
    
    if (bien.TieneEmbargos !== undefined) {
      doc.font('Helvetica-Bold')
         .text('Embargos:', col2X + 5, col2Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.TieneEmbargos ? 'Sí' : 'No'}`);
      col2Y += lineHeight;
    }
    
    if (bien.NumeroSOAT) {
      doc.font('Helvetica-Bold')
         .text('Número SOAT:', col2X + 5, col2Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.NumeroSOAT}`);
      col2Y += lineHeight;
    }
    
    if (bien.AseguradoraSOAT) {
      doc.font('Helvetica-Bold')
         .text('Aseguradora SOAT:', col2X + 5, col2Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.AseguradoraSOAT}`);
      col2Y += lineHeight;
    }
    
    if (bien.FechaVencimientoSOAT) {
      doc.font('Helvetica-Bold')
         .text('Vence SOAT:', col2X + 5, col2Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.FechaVencimientoSOAT}`);
      col2Y += lineHeight;
    }
    
    if (bien.FechaVencimientoTecnomecanica) {
      doc.font('Helvetica-Bold')
         .text('Vence Tecnomecánica:', col2X + 5, col2Y, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.FechaVencimientoTecnomecanica}`);
      col2Y += lineHeight;
    }
    
    // Valor comercial (destacado)
    /*doc.font('Helvetica-Bold')
       .fillColor('#2c3e50')
       .text('Valor Comercial:', col2X + 5, col2Y, { width: colWidth - 10 })
       .fontSize(10)
       .text(`$${this.formatearMoneda(bien.ValorComercial)}`, col2X + 5, col2Y + 12, { width: colWidth - 10 });
    col2Y += lineHeight * 2;
    doc.fillColor('#000000').fontSize(fontSize);*/
    
    // Calcular altura total
    const maxHeight = Math.max(col1Y, col2Y) - (startY + 25) + 10;
    
    // Dibujar bordes
    doc.rect(col1X, startY + 25, colWidth, maxHeight).stroke('#2c3e50');
    doc.rect(col2X, startY + 25, colWidth, maxHeight).stroke('#2c3e50');
    
    doc.y = startY + 25 + maxHeight + 10;
  }

  private dibujarPropiedad(doc: any, bien: BienData, pageWidth: number): void {
    const startY = doc.y;
    const col1X = 40;
    const col2X = 40 + (pageWidth / 2);
    const colWidth = (pageWidth / 2) - 10;
    
    // Encabezado
    doc.rect(col1X, startY, pageWidth, 25).fillAndStroke('#34495e', '#2c3e50');
    doc.fillColor('#ffffff')
       .fontSize(11)
       .font('Helvetica-Bold')
       .text('🏠 PROPIEDAD', col1X + 5, startY + 8, { width: pageWidth - 10 });
    
    doc.fillColor('#000000');
    
    let currentY = startY + 30;
    const lineHeight = 14;
    const fontSize = 9;
    
    doc.fontSize(fontSize);
    
    // Columna 1
    if (bien.TipoInmueble) {
      doc.font('Helvetica-Bold')
         .text('Tipo:', col1X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.TipoInmueble}`);
      currentY += lineHeight;
    }
    
    if (bien.DireccionCompleta) {
      doc.font('Helvetica-Bold')
         .text('Dirección:', col1X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(bien.DireccionCompleta, col1X + 5, currentY + 12, { width: colWidth - 10 });
      currentY += lineHeight * 2;
    }
    
    if (bien.MatriculaInmobiliaria) {
      doc.font('Helvetica-Bold')
         .text('Matrícula:', col1X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.MatriculaInmobiliaria}`);
      currentY += lineHeight;
    }
    
    // Columna 2
    currentY = startY + 30;
    
    if (bien.AreaConstruida) {
      doc.font('Helvetica-Bold')
         .text('Área construida:', col2X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.AreaConstruida} m²`);
      currentY += lineHeight;
    }
    
    if (bien.NumeroHabitaciones || bien.NumeroBanos) {
      doc.font('Helvetica-Bold')
         .text('Habitaciones/Baños:', col2X + 5, currentY, { continued: true, width: colWidth - 10 })
         .font('Helvetica')
         .text(` ${bien.NumeroHabitaciones || 0}/${bien.NumeroBanos || 0}`);
      currentY += lineHeight;
    }
    
    doc.font('Helvetica-Bold')
       .text('Valor comercial:', col2X + 5, currentY, { continued: true, width: colWidth - 10 })
       .font('Helvetica')
       .text(` $${this.formatearMoneda(bien.ValorComercial)}`);
    currentY += lineHeight;
    
    // Calcular altura total
    const maxHeight = Math.max(
      (startY + 30) + (lineHeight * 5),
      currentY
    ) - (startY + 25);
    
    // Dibujar bordes
    doc.rect(col1X, startY + 25, colWidth, maxHeight).stroke('#2c3e50');
    doc.rect(col2X, startY + 25, colWidth, maxHeight).stroke('#2c3e50');
    
    doc.y = startY + 25 + maxHeight + 10;
  }
}

export default new PDFService();