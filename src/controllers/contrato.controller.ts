import { Request, Response } from 'express';
import Contrato from '../models/Contrato.model';
import BienContrato from '../models/BienContrato.model';
import Vehiculo from '../models/Vehiculo.model';
import Propiedad from '../models/Propiedad.model';
import PDFService from '../services/pdf.service';
import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';
import sequelize from '../config/database';

export const crear = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;
    
    // DEBUG: Verificar datos recibidos del frontend
    console.log('========================================')
    console.log('DATOS RECIBIDOS DEL FRONTEND:');
    console.log('Clausulas:', req.body.Clausulas);
    console.log('ObservacionesAdicionales:', req.body.ObservacionesAdicionales);
    console.log('Bienes:', req.body.bienes);
    console.log('========================================');
    
    // Generar folio único
    const año = new Date().getFullYear();
    const consecutivo = await Contrato.count() + 1;
    const folio = `CONT-${año}-${String(consecutivo).padStart(5, '0')}`;
    
    // Procesar cláusulas
    let clausulas: string[] = [];
    if (req.body.Clausulas) {
      if (Array.isArray(req.body.Clausulas)) {
        clausulas = req.body.Clausulas;
      } else if (typeof req.body.Clausulas === 'string') {
        try {
          clausulas = JSON.parse(req.body.Clausulas);
        } catch {
          clausulas = req.body.Clausulas.split('\n').filter((c: string) => c.trim());
        }
      }
    }

    // Procesar bienes para permuta (si existen)
    let bienes = req.body.bienes || [];
    const modalidad = req.body.ModalidadContrato || 'Compraventa';
    
    // Si no hay bienes pero hay VehiculoID o PropiedadID, buscar los datos
    if (bienes.length === 0) {
      if (req.body.VehiculoID) {
        const vehiculo: any = await Vehiculo.findByPk(req.body.VehiculoID);
        if (vehiculo) {
          bienes.push({
            TipoBien: 'Vehiculo',
            Rol: 'Entrega',
            Parte: 'Vendedor',
            VehiculoID: vehiculo.VehiculoID,
            DescripcionBien: `${vehiculo.Marca} ${vehiculo.Modelo} ${vehiculo.Anio || vehiculo.Año}`,
            ValorComercial: req.body.ValorContrato,
            Marca: vehiculo.Marca,
            Modelo: vehiculo.Modelo,
            Año: vehiculo.Anio || vehiculo.Año,
            Placa: vehiculo.Placa,
            Clase: vehiculo.Clase,
            Linea: vehiculo.Linea,
            Cilindraje: vehiculo.Cilindraje,
            Capacidad: vehiculo.Capacidad,
            Color: vehiculo.Color,
            Tipo: vehiculo.Tipo,
            Servicio: vehiculo.Servicio,
            NumeroMotor: vehiculo.NumeroMotor,
            NumeroChasis: vehiculo.NumeroChasis,
            NumeroCarroceria: vehiculo.NumeroCarroceria,
            Serie: vehiculo.Serie,
            TipoCombustible: vehiculo.TipoCombustible,
            KilometrajeCompra: vehiculo.KilometrajeCompra,
            KilometrajeActual: vehiculo.KilometrajeActual,
            NumeroSOAT: vehiculo.NumeroSOAT,
            AseguradoraSOAT: vehiculo.AseguradoraSOAT,
            FechaVencimientoSOAT: vehiculo.FechaVencimientoSOAT,
            FechaVencimientoTecnomecanica: vehiculo.FechaVencimientoTecnomecanica
          });
        }
      }
      
      if (req.body.PropiedadID) {
        const propiedad: any = await Propiedad.findByPk(req.body.PropiedadID);
        if (propiedad) {
          bienes.push({
            TipoBien: 'Propiedad',
            Rol: 'Entrega',
            Parte: 'Vendedor',
            PropiedadID: propiedad.PropiedadID,
            DescripcionBien: `${propiedad.TipoInmueble} - ${propiedad.DireccionCompleta}`,
            ValorComercial: req.body.ValorContrato,
            TipoInmueble: propiedad.TipoInmueble,
            DireccionCompleta: propiedad.DireccionCompleta,
            Municipio: propiedad.Municipio,
            MatriculaInmobiliaria: propiedad.NumeroMatriculaInmobiliaria || propiedad.MatriculaInmobiliaria,
            AreaConstruida: propiedad.AreaConstruida,
            NumeroHabitaciones: propiedad.NumeroHabitaciones,
            NumeroBanos: propiedad.NumeroBanos,
            Estrato: propiedad.Estrato
          });
        }
      }
    }
    
    // Calcular valores totales para permutas
    let valorTotalEntrega = 0;
    let valorTotalRecibe = 0;
    let diferenciaValor = 0;
    let quienPagaDiferencia = null;

    if (modalidad !== 'Compraventa' && bienes.length > 0) {
      // Sumar valores de bienes que entrega el vendedor
      valorTotalEntrega = bienes
        .filter((b: any) => b.Parte === 'Vendedor' && b.Rol === 'Entrega')
        .reduce((sum: number, b: any) => sum + parseFloat(b.ValorComercial || 0), 0);
      
      // Sumar valores de bienes que recibe el vendedor
      valorTotalRecibe = bienes
        .filter((b: any) => b.Parte === 'Vendedor' && b.Rol === 'Recibe')
        .reduce((sum: number, b: any) => sum + parseFloat(b.ValorComercial || 0), 0);
      
      diferenciaValor = Math.abs(valorTotalRecibe - valorTotalEntrega);
      
      if (valorTotalRecibe > valorTotalEntrega) {
        quienPagaDiferencia = 'Vendedor'; // Vendedor debe pagar la diferencia
      } else if (valorTotalEntrega > valorTotalRecibe) {
        quienPagaDiferencia = 'Comprador'; // Comprador debe pagar la diferencia
      }
    }

    // Preparar datos para PDF
    // DEBUG: Ver qué bienes llegan del frontend
    console.log('========================================');
    console.log('BIENES RECIBIDOS DEL FRONTEND:');
    console.log('Cantidad:', bienes.length);
    console.log('Datos completos:', JSON.stringify(bienes, null, 2));
    console.log('========================================');

    const pdfData = {
      tipo: req.body.TipoContrato,
      folio,
      modalidad,
      vendedor: {
        nombre: req.body.VendedorNombre,
        tipoDocumento: req.body.VendedorTipoDocumento || 'CC',
        documento: req.body.VendedorDocumento,
        estadoCivil: req.body.VendedorEstadoCivil,
        direccion: req.body.VendedorDireccion,
        departamento: req.body.VendedorDepartamento,
        ciudad: req.body.VendedorCiudad,
        telefono: req.body.VendedorTelefono,
        email: req.body.VendedorEmail
      },
      comprador: {
        nombre: req.body.CompradorNombre,
        tipoDocumento: req.body.CompradorTipoDocumento || 'CC',
        documento: req.body.CompradorDocumento,
        estadoCivil: req.body.CompradorEstadoCivil,
        direccion: req.body.CompradorDireccion,
        departamento: req.body.CompradorDepartamento,
        ciudad: req.body.CompradorCiudad,
        telefono: req.body.CompradorTelefono,
        email: req.body.CompradorEmail
      },
      valor: req.body.ValorContrato,
      formaPago: req.body.FormaPago,
      fecha: req.body.FechaContrato,
      clausulas,
      objeto: req.body.ObjetoContrato,
      observacionesAdicionales: req.body.ObservacionesAdicionales,
      bienes,
      valorTotalEntrega,
      valorTotalRecibe,
      diferenciaValor,
      quienPagaDiferencia
    };
    
    const { filename, hash, qr } = await PDFService.generarContrato(pdfData);
    
    // Guardar contrato en BD
    const contrato = await Contrato.create({
      TipoContrato: req.body.TipoContrato,
      Folio: folio,
      VendedorNombre: req.body.VendedorNombre,
      VendedorTipoDocumento: req.body.VendedorTipoDocumento || 'CC',
      VendedorDocumento: req.body.VendedorDocumento,
      VendedorEstadoCivil: req.body.VendedorEstadoCivil || null,
      VendedorDireccion: req.body.VendedorDireccion || null,
      VendedorDepartamento: req.body.VendedorDepartamento || null,
      VendedorCiudad: req.body.VendedorCiudad || null,
      VendedorTelefono: req.body.VendedorTelefono || null,
      VendedorEmail: req.body.VendedorEmail || null,
      CompradorNombre: req.body.CompradorNombre,
      CompradorTipoDocumento: req.body.CompradorTipoDocumento || 'CC',
      CompradorDocumento: req.body.CompradorDocumento,
      CompradorEstadoCivil: req.body.CompradorEstadoCivil || null,
      CompradorDireccion: req.body.CompradorDireccion || null,
      CompradorDepartamento: req.body.CompradorDepartamento || null,
      CompradorCiudad: req.body.CompradorCiudad || null,
      CompradorTelefono: req.body.CompradorTelefono || null,
      CompradorEmail: req.body.CompradorEmail || null,
      VehiculoID: req.body.VehiculoID || null,
      PropiedadID: req.body.PropiedadID || null,
      ValorContrato: req.body.ValorContrato,
      FormaPago: req.body.FormaPago,
      NumeroCuotas: req.body.NumeroCuotas || null,
      ValorCuota: req.body.ValorCuota || null,
      FechaContrato: req.body.FechaContrato,
      FechaInicio: req.body.FechaInicio || null,
      FechaFin: req.body.FechaFin || null,
      Clausulas: clausulas.length > 0 ? clausulas.join('\n') : null,
      ObservacionesAdicionales: req.body.ObservacionesAdicionales || null,
      HashDocumento: hash,
      CodigoVerificacion: qr,
      RutaArchivo: `/uploads/contratos/${filename}`,
      NombreArchivo: filename,
      UsuarioCreadorID: usuarioId,
      ModalidadContrato: modalidad,
      ValorTotalEntrega: valorTotalEntrega || null,
      ValorTotalRecibe: valorTotalRecibe || null,
      DiferenciaValor: diferenciaValor || null,
      QuienPagaDiferencia: quienPagaDiferencia
    });
    
    // Guardar bienes asociados al contrato
    if (bienes.length > 0) {
      for (const bien of bienes) {
        await BienContrato.create({
          ContratoID: contrato.ContratoID,
          TipoBien: bien.TipoBien,
          Rol: bien.Rol,
          Parte: bien.Parte,
          VehiculoID: bien.VehiculoID || null,
          PropiedadID: bien.PropiedadID || null,
          DescripcionBien: bien.DescripcionBien || null,
          ValorComercial: bien.ValorComercial,
          Marca: bien.Marca || null,
          Modelo: bien.Modelo || null,
          Anio: bien.Año || bien.Anio || null,
          Placa: bien.Placa || null,
          Matricula: bien.Matricula || null,
          Observaciones: bien.Observaciones || null,
          // Campos técnicos del vehículo
          Clase: bien.Clase || null,
          Linea: bien.Linea || null,
          Cilindraje: bien.Cilindraje || null,
          Capacidad: bien.Capacidad || null,
          NumeroMotor: bien.NumeroMotor || null,
          Serie: bien.Serie || null,
          Color: bien.Color || null,
          Tipo: bien.Tipo || null,
          Servicio: bien.Servicio || null,
          NumeroChasis: bien.NumeroChasis || null,
          NumeroCarroceria: bien.NumeroCarroceria || null,
          TipoCombustible: bien.TipoCombustible || null,
          KilometrajeCompra: bien.KilometrajeCompra || null,
          KilometrajeActual: bien.KilometrajeActual || null,
          // Campos de documentación vehículo
          FechaVencimientoSOAT: bien.FechaVencimientoSOAT || null,
          NumeroSOAT: bien.NumeroSOAT || null,
          AseguradoraSOAT: bien.AseguradoraSOAT || null,
          FechaVencimientoTecnomecanica: bien.FechaVencimientoTecnomecanica || null,
          // Campos de estado legal vehículo
          EstadoImpuestos: bien.EstadoImpuestos || null,
          AniosImpuestosPendientes: bien.AniosImpuestosPendientes || null,
          TieneEmbargos: bien.TieneEmbargos || false,
          // Campos de propiedades/inmuebles - Información básica
          TipoInmueble: bien.TipoInmueble || null,
          DireccionCompleta: bien.DireccionCompleta || null,
          Municipio: bien.Municipio || null,
          Departamento: bien.Departamento || null,
          Barrio: bien.Barrio || null,
          // Información catastral y registral
          MatriculaInmobiliaria: bien.MatriculaInmobiliaria || null,
          CedulaCatastral: bien.CedulaCatastral || null,
          ChipCatastral: bien.ChipCatastral || null,
          OficinaRegistro: bien.OficinaRegistro || null,
          // Áreas y medidas
          AreaConstruida: bien.AreaConstruida || null,
          AreaPrivada: bien.AreaPrivada || null,
          AreaTerreno: bien.AreaTerreno || null,
          Linderos: bien.Linderos || null,
          // Propiedad horizontal
          EsPropiedadHorizontal: bien.EsPropiedadHorizontal || false,
          CoeficienteCopropiedad: bien.CoeficienteCopropiedad || null,
          NombreConjunto: bien.NombreConjunto || null,
          NumeroApartamento: bien.NumeroApartamento || null,
          Torre: bien.Torre || null,
          Piso: bien.Piso || null,
          ParqueaderosPrivados: bien.ParqueaderosPrivados || null,
          Depositos: bien.Depositos || null,
          // Título de adquisición del vendedor
          EscrituraPublicaNumero: bien.EscrituraPublicaNumero || null,
          NotariaEscritura: bien.NotariaEscritura || null,
          CiudadEscritura: bien.CiudadEscritura || null,
          FechaEscritura: bien.FechaEscritura || null,
          ActoJuridico: bien.ActoJuridico || null,
          FechaRegistro: bien.FechaRegistro || null,
          // Impuestos y estado financiero
          ImpuestoPredialAlDia: bien.ImpuestoPredialAlDia || false,
          ValorImpuestoPredial: bien.ValorImpuestoPredial || null,
          AniosPredialPendientes: bien.AniosPredialPendientes || null,
          TieneValorizacion: bien.TieneValorizacion || false,
          ValorValorizacion: bien.ValorValorizacion || null,
          ValorizacionAlDia: bien.ValorizacionAlDia || false,
          ValorAdministracion: bien.ValorAdministracion || null,
          AdministracionAlDia: bien.AdministracionAlDia || false,
          // Gastos de compraventa
          QuienPagaEscritura: bien.QuienPagaEscritura || null,
          QuienPagaRegistro: bien.QuienPagaRegistro || null,
          QuienPagaDerechosNotariales: bien.QuienPagaDerechosNotariales || null,
          QuienPagaImpuestoRegistro: bien.QuienPagaImpuestoRegistro || null,
          QuienPagaBeneficencia: bien.QuienPagaBeneficencia || null,
          // Retención en la fuente
          AplicaRetencionFuente: bien.AplicaRetencionFuente || false,
          PorcentajeRetencion: bien.PorcentajeRetencion || null,
          BaseRetencion: bien.BaseRetencion || null,
          ValorRetencion: bien.ValorRetencion || null,
          // Características adicionales
          NumeroHabitaciones: bien.NumeroHabitaciones || null,
          NumeroBanos: bien.NumeroBanos || null,
          Estrato: bien.Estrato || null,
          AntiguedadInmueble: bien.AntiguedadInmueble || null,
          EstadoInmueble: bien.EstadoInmueble || null,
          // Restricciones y gravámenes
          TieneHipoteca: bien.TieneHipoteca || false,
          EntidadHipoteca: bien.EntidadHipoteca || null,
          SaldoHipoteca: bien.SaldoHipoteca || null,
          TieneEmbargosInmueble: bien.TieneEmbargosInmueble || false,
          TieneLimitacionesDominio: bien.TieneLimitacionesDominio || false,
          DescripcionLimitaciones: bien.DescripcionLimitaciones || null
        });
      }
    }
    
    res.json({
      success: true,
      data: contrato,
      message: 'Contrato generado exitosamente'
    });
  } catch (error: any) {
    console.error('Error al crear contrato:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const descargar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contrato = await Contrato.findByPk(id);
    
    if (!contrato) {
      return res.status(404).json({ success: false, message: 'Contrato no encontrado' });
    }
    
    const filepath = path.join(__dirname, '../../uploads/contratos', contrato.NombreArchivo);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
    }
    
    res.download(filepath, contrato.NombreArchivo);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  try {
    const contratos = await Contrato.findAll({
      order: [['FechaCreacion', 'DESC']],
    });

    res.json({
      success: true,
      data: contratos,
    });
  } catch (error: any) {
    console.error('Error al obtener contratos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contrato = await Contrato.findByPk(id, {
      include: [
        {
          model: BienContrato,
          as: 'Bienes'
        }
      ]
    });

    if (!contrato) {
      return res.status(404).json({
        success: false,
        message: 'Contrato no encontrado',
      });
    }

    res.json({
      success: true,
      data: contrato,
    });
  } catch (error: any) {
    console.error('Error al obtener contrato:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const anular = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const contrato = await Contrato.findByPk(id);

    if (!contrato) {
      return res.status(404).json({
        success: false,
        message: 'Contrato no encontrado',
      });
    }

    if (contrato.EstadoContrato === 'Anulado') {
      return res.status(400).json({
        success: false,
        message: 'El contrato ya se encuentra anulado',
      });
    }

    await contrato.update({
      EstadoContrato: 'Anulado',
      ObservacionesAdicionales: motivo || contrato.ObservacionesAdicionales,
    });

    res.json({
      success: true,
      message: 'Contrato anulado correctamente',
      data: contrato,
    });
  } catch (error: any) {
    console.error('Error al anular contrato:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verificar = async (req: Request, res: Response) => {
  try {
    const { codigo } = req.params;

    const contrato = await Contrato.findOne({
      where: {
        [Op.or]: [
          { CodigoVerificacion: codigo },
          { Folio: codigo },
        ],
      },
    });

    if (!contrato) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró un contrato con el código proporcionado',
      });
    }

    res.json({
      success: true,
      data: {
        Folio: contrato.Folio,
        TipoContrato: contrato.TipoContrato,
        EstadoContrato: contrato.EstadoContrato,
        FechaContrato: contrato.FechaContrato,
        CodigoVerificacion: contrato.CodigoVerificacion,
      },
    });
  } catch (error: any) {
    console.error('Error al verificar contrato:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cargarDocumentoFirmado = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tipo } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo',
      });
    }

    if (!tipo || !['firmado', 'autenticado'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de documento inválido. Debe ser "firmado" o "autenticado"',
      });
    }

    const contrato = await Contrato.findByPk(id);

    if (!contrato) {
      fs.unlinkSync(file.path);
      return res.status(404).json({
        success: false,
        message: 'Contrato no encontrado',
      });
    }

    if (contrato.EstadoContrato !== 'Generado') {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden cargar documentos a contratos en estado "Generado"',
      });
    }

    const rutaRelativa = `/uploads/contratos-firmados/${file.filename}`;

    const updateData: any = {
      EstadoContrato: 'Firmado',
      FechaFirma: sequelize.literal('GETDATE()'),
      TipoDocumentoFirmado: tipo,
    };

    if (tipo === 'firmado') {
      updateData.RutaDocumentoFirmado = rutaRelativa;
    } else {
      updateData.RutaDocumentoAutenticado = rutaRelativa;
    }

    await contrato.update(updateData);

    res.json({
      success: true,
      message: `Documento ${tipo} cargado exitosamente`,
      data: {
        ContratoID: contrato.ContratoID,
        Folio: contrato.Folio,
        EstadoContrato: contrato.EstadoContrato,
        FechaFirma: contrato.FechaFirma,
        TipoDocumentoFirmado: contrato.TipoDocumentoFirmado,
      },
    });
  } catch (error: any) {
    console.error('Error al cargar documento firmado:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const descargarDocumentoFirmado = async (req: Request, res: Response) => {
  try {
    const { id, tipo } = req.params;

    if (!['firmado', 'autenticado'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de documento inválido',
      });
    }

    const contrato = await Contrato.findByPk(id);

    if (!contrato) {
      return res.status(404).json({
        success: false,
        message: 'Contrato no encontrado',
      });
    }

    const rutaDocumento = tipo === 'firmado' 
      ? contrato.RutaDocumentoFirmado 
      : contrato.RutaDocumentoAutenticado;

    if (!rutaDocumento) {
      return res.status(404).json({
        success: false,
        message: `No existe documento ${tipo} para este contrato`,
      });
    }

    const filepath = path.join(__dirname, '../..', rutaDocumento);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({
        success: false,
        message: 'Archivo no encontrado en el servidor',
      });
    }

    const filename = path.basename(filepath);
    res.download(filepath, filename);
  } catch (error: any) {
    console.error('Error al descargar documento firmado:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};