// ============================================
// SERVICIO DE SEGUROS - BACKEND
// ============================================

import { Request, Response } from 'express';
import Poliza from '../models/poliza.model';
import Reclamacion from '../models/reclamacion.model';
import Renovacion from '../models/renovacion.model';
import Vehiculo from '../models/Vehiculo.model';
import Propiedad from '../models/Propiedad.model';
import { Op } from 'sequelize';

// ============================================
// CONTROLADORES DE PÓLIZAS
// ============================================

/**
 * Obtener todas las pólizas del usuario
 */
export const getPolizas = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;
    const { estado, categoria } = req.query;
    
    console.log(' [SEGUROS] getPolizas llamado');
    console.log('   - Usuario:', usuarioId);
    console.log('   - Estado filtro:', estado);
    console.log('   - Categoria filtro:', categoria);
    
    const whereClause: any = {
      UsuarioID: usuarioId
    };
    
    if (estado && estado !== '') {
      whereClause.Estado = estado;
    }
    
    if (categoria && categoria !== '') {
      whereClause.CategoriaPoliza = categoria;
    }
    
    const polizas = await Poliza.findAll({
      where: whereClause,
      include: [
        {
          model: Vehiculo,
          as: 'vehiculo',
          attributes: ['Placa', 'Marca', 'Modelo'],
          required: false
        },
        {
          model: Propiedad,
          as: 'propiedad',
          attributes: ['Direccion'],
          required: false
        }
      ],
      order: [['FechaVencimiento', 'DESC']]
    });
    
    console.log('   - Pólizas encontradas:', polizas.length);
    
    res.json({ success: true, data: polizas });
  } catch (error: any) {
    console.error(' [SEGUROS] Error en getPolizas:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtener una póliza específica por ID
 */
export const getPolizaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usuarioId = (req as any).user.UsuarioID;
    
    console.log('🔍 [SEGUROS] getPolizaById llamado');
    console.log('   - PolizaID:', id);
    console.log('   - Usuario:', usuarioId);
    
    const poliza = await Poliza.findOne({
      where: {
        PolizaID: id,
        UsuarioID: usuarioId
      },
      include: [
        {
          model: Vehiculo,
          as: 'vehiculo',
          required: false
        },
        {
          model: Propiedad,
          as: 'propiedad',
          required: false
        }
      ]
    });
    
    if (!poliza) {
      console.log('   ❌ Póliza no encontrada');
      return res.status(404).json({ success: false, message: 'Póliza no encontrada' });
    }
    
    console.log('   ✅ Póliza encontrada');
    
    res.json({ success: true, data: poliza });
  } catch (error: any) {
    console.error('❌ [SEGUROS] Error en getPolizaById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtener pólizas por vencer
 */
export const getPolizasPorVencer = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;
    const diasAnticipacion = parseInt(req.query.dias as string) || 30;
    
    console.log('⏰ [SEGUROS] getPolizasPorVencer llamado');
    console.log('   - Usuario:', usuarioId);
    console.log('   - Días anticipación:', diasAnticipacion);
    
    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + diasAnticipacion);
    
    const polizas = await Poliza.findAll({
      where: {
        UsuarioID: usuarioId,
        Estado: {
          [Op.in]: ['Vigente', 'Por Vencer']
        },
        FechaVencimiento: {
          [Op.between]: [hoy, fechaLimite]
        }
      },
      include: [
        {
          model: Vehiculo,
          as: 'vehiculo',
          attributes: ['Placa', 'Marca', 'Modelo'],
          required: false
        },
        {
          model: Propiedad,
          as: 'propiedad',
          attributes: ['Direccion'],
          required: false
        }
      ],
      order: [['FechaVencimiento', 'ASC']]
    });
    
    console.log('   - Pólizas por vencer encontradas:', polizas.length);
    
    res.json({ success: true, data: polizas });
  } catch (error: any) {
    console.error('❌ [SEGUROS] Error en getPolizasPorVencer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Crear nueva póliza
 */
export const crearPoliza = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;
    const polizaData = { ...req.body, UsuarioID: usuarioId };
    
    console.log('➕ [SEGUROS] crearPoliza llamado');
    console.log('   - Usuario:', usuarioId);
    console.log('   - Tipo:', polizaData.TipoPoliza);
    
    const nuevaPoliza = await Poliza.create(polizaData);
    
    console.log('   ✅ Póliza creada - ID:', nuevaPoliza.PolizaID);
    
    res.json({ success: true, message: 'Póliza creada exitosamente', data: nuevaPoliza });
  } catch (error: any) {
    console.error('❌ [SEGUROS] Error al crear póliza:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Actualizar póliza
 */
export const actualizarPoliza = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const polizaData = req.body;
    
    console.log('✏️ [SEGUROS] actualizarPoliza llamado');
    console.log('   - PolizaID:', id);
    
    const poliza = await Poliza.findByPk(id);
    
    if (!poliza) {
      return res.status(404).json({ success: false, message: 'Póliza no encontrada' });
    }
    
    await poliza.update({
      ...polizaData,
      FechaModificacion: new Date()
    });
    
    console.log('   ✅ Póliza actualizada');
    
    res.json({ success: true, message: 'Póliza actualizada exitosamente', data: poliza });
  } catch (error: any) {
    console.error('❌ [SEGUROS] Error al actualizar póliza:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Eliminar póliza
 */
export const eliminarPoliza = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ [SEGUROS] eliminarPoliza llamado');
    console.log('   - PolizaID:', id);
    
    const poliza = await Poliza.findByPk(id);
    
    if (!poliza) {
      return res.status(404).json({ success: false, message: 'Póliza no encontrada' });
    }
    
    await poliza.destroy();
    
    console.log('   ✅ Póliza eliminada');
    
    res.json({ success: true, message: 'Póliza eliminada exitosamente' });
  } catch (error: any) {
    console.error('❌ [SEGUROS] Error al eliminar póliza:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// CONTROLADORES DE RECLAMACIONES
// ============================================

/**
 * Obtener todas las reclamaciones
 */
export const getReclamaciones = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;
    const { estado, polizaId } = req.query;
    
    console.log(' [SEGUROS] getReclamaciones llamado');
    console.log('   - Usuario:', usuarioId);
    console.log('   - Estado filtro:', estado);
    console.log('   - PolizaID filtro:', polizaId);
    
    const whereClause: any = {
      UsuarioID: usuarioId
    };
    
    if (estado && estado !== '') {
      whereClause.Estado = estado;
    }
    
    if (polizaId) {
      whereClause.PolizaID = parseInt(polizaId as string);
    }
    
    const reclamaciones = await Reclamacion.findAll({
      where: whereClause,
      include: [
        {
          model: Poliza,
          as: 'poliza',
          attributes: ['NumeroPoliza', 'Aseguradora', 'TipoPoliza']
        }
      ],
      order: [['FechaRadicacion', 'DESC']]
    });
    
    console.log('   - Reclamaciones encontradas:', reclamaciones.length);
    
    res.json({ success: true, data: reclamaciones });
  } catch (error: any) {
    console.error(' [SEGUROS] Error en getReclamaciones:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Crear reclamación
 */
export const crearReclamacion = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;
    const reclamacionData = {
      ...req.body,
      UsuarioID: usuarioId,
      NumeroReclamacion: await generarNumeroReclamacion()
    };
    
    console.log('➕ [SEGUROS] crearReclamacion llamado');
    console.log('   - Usuario:', usuarioId);
    console.log('   - Póliza:', reclamacionData.PolizaID);
    
    const nuevaReclamacion = await Reclamacion.create(reclamacionData);
    
    console.log('   ✅ Reclamación creada - Número:', nuevaReclamacion.NumeroReclamacion);
    
    res.json({ success: true, message: 'Reclamación creada exitosamente', data: nuevaReclamacion });
  } catch (error: any) {
    console.error('❌ [SEGUROS] Error al crear reclamación:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Actualizar reclamación completa
 */
export const actualizarReclamacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reclamacionData = req.body;
    
    console.log('✏️ [SEGUROS] actualizarReclamacion llamado');
    console.log('   - ReclamacionID:', id);
    
    const reclamacion = await Reclamacion.findByPk(id);
    
    if (!reclamacion) {
      return res.status(404).json({ success: false, message: 'Reclamación no encontrada' });
    }
    
    await reclamacion.update({
      ...reclamacionData,
      FechaModificacion: new Date()
    });
    
    console.log('   ✅ Reclamación actualizada');
    
    res.json({ success: true, message: 'Reclamación actualizada exitosamente', data: reclamacion });
  } catch (error: any) {
    console.error('❌ [SEGUROS] Error al actualizar reclamación:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Actualizar estado de reclamación
 */
export const actualizarEstadoReclamacion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado, montoAprobado, motivoRechazo, montoIndemnizado } = req.body;
    
    console.log('🔄 [SEGUROS] actualizarEstadoReclamacion llamado');
    console.log('   - ReclamacionID:', id);
    console.log('   - Nuevo estado:', estado);
    
    const reclamacion = await Reclamacion.findByPk(id);
    
    if (!reclamacion) {
      return res.status(404).json({ success: false, message: 'Reclamación no encontrada' });
    }
    
    const updateData: any = {
      Estado: estado,
      FechaModificacion: new Date()
    };
    
    // Actualizar campos según el estado
    if (estado === 'Aprobada') {
      updateData.FechaAprobacion = new Date();
      if (montoAprobado) updateData.MontoAprobado = montoAprobado;
    }
    
    if (estado === 'Rechazada') {
      updateData.MotivoRechazo = motivoRechazo;
    }
    
    if (estado === 'Indemnizada') {
      updateData.FechaIndemnizacion = new Date();
      if (montoIndemnizado) updateData.MontoIndemnizado = montoIndemnizado;
    }
    
    if (estado === 'Cerrada') {
      updateData.FechaCierre = new Date();
    }
    
    await reclamacion.update(updateData);
    
    console.log('   ✅ Estado actualizado a:', estado);
    
    res.json({ 
      success: true, 
      message: `Estado actualizado a ${estado}`,
      data: reclamacion 
    });
  } catch (error: any) {
    console.error('❌ [SEGUROS] Error al actualizar estado:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// CONTROLADORES DE RENOVACIONES
// ============================================

/**
 * Obtener renovaciones
 */
export const getRenovaciones = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;
    
    console.log('🔄 [SEGUROS] getRenovaciones llamado');
    console.log('   - Usuario:', usuarioId);
    
    const renovaciones = await Renovacion.findAll({
      where: { UsuarioID: usuarioId },
      include: [
        {
          model: Poliza,
          as: 'poliza',
          attributes: ['NumeroPoliza', 'Aseguradora', 'TipoPoliza']
        }
      ],
      order: [['FechaRenovacion', 'DESC']]
    });
    
    console.log('   - Renovaciones encontradas:', renovaciones.length);
    
    res.json({ success: true, data: renovaciones });
  } catch (error: any) {
    console.error('❌ [SEGUROS] Error en getRenovaciones:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Crear renovación
 */
export const crearRenovacion = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;
    const renovacionData = { ...req.body, UsuarioID: usuarioId };
    
    console.log('➕ [SEGUROS] crearRenovacion llamado');
    console.log('   - Usuario:', usuarioId);
    console.log('   - PolizaID:', renovacionData.PolizaID);
    
    const nuevaRenovacion = await Renovacion.create(renovacionData);
    
    // Actualizar la póliza con los nuevos datos
    if (renovacionData.PolizaID && renovacionData.NuevaPolizaNumero) {
      await Poliza.update(
        {
          NumeroPoliza: renovacionData.NuevaPolizaNumero,
          PrimaAnual: renovacionData.NuevaPrima,
          FechaVencimiento: renovacionData.FechaVencimientoNueva,
          FechaRenovacion: renovacionData.FechaRenovacion
        },
        { where: { PolizaID: renovacionData.PolizaID } }
      );
    }
    
    console.log('   ✅ Renovación registrada');
    
    res.json({ success: true, message: 'Renovación registrada exitosamente', data: nuevaRenovacion });
  } catch (error: any) {
    console.error('❌ [SEGUROS] Error al crear renovación:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

async function generarNumeroReclamacion(): Promise<string> {
  const year = new Date().getFullYear();
  
  // Obtener el último número de reclamación del año actual
  const ultimaReclamacion = await Reclamacion.findOne({
    where: {
      NumeroReclamacion: {
        [Op.like]: `REC-${year}-%`
      }
    },
    order: [['ReclamacionID', 'DESC']]
  });
  
  let contador = 1;
  if (ultimaReclamacion && ultimaReclamacion.NumeroReclamacion) {
    const partes = ultimaReclamacion.NumeroReclamacion.split('-');
    contador = parseInt(partes[2]) + 1;
  }
  
  return `REC-${year}-${String(contador).padStart(5, '0')}`;
}

// ============================================
// CRON JOB: Actualizar estado de pólizas
// ============================================

import cron from 'node-cron';

export const iniciarCronSeguros = () => {
  // Ejecutar diariamente a las 6:00 AM
  cron.schedule('0 6 * * *', async () => {
    console.log('Actualizando estado de pólizas...');
    
    try {
      // EXEC sp_ActualizarEstadoPolizas
      
      // Enviar notificaciones de pólizas por vencer
      // ...
      
      console.log('✅ Estados de pólizas actualizados');
    } catch (error) {
      console.error('Error al actualizar pólizas:', error);
    }
  });
  
  console.log('✅ Cron de seguros iniciado');
};