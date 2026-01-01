import { Request, Response } from 'express';
import cron from 'node-cron';
import Pago from '../models/pago.model';
import { Op } from 'sequelize';

// Controladores básicos
export const getPagosDelMes = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.params;
    const usuarioId = (req as any).user.UsuarioID;
    
    console.log(' [CALENDARIO] getPagosDelMes llamado');
    console.log('   - Usuario:', usuarioId);
    console.log('   - Año:', year);
    console.log('   - Mes:', month);
    
    // Calcular primer y último día del mes
    const primerDia = new Date(parseInt(year), parseInt(month) - 1, 1);
    const ultimoDia = new Date(parseInt(year), parseInt(month), 0);
    
    const pagos = await Pago.findAll({
      where: {
        UsuarioID: usuarioId,
        FechaVencimiento: {
          [Op.between]: [primerDia, ultimoDia]
        }
      },
      order: [['FechaVencimiento', 'ASC']]
    });
    
    console.log('   - Pagos encontrados:', pagos.length);
    
    res.json({ success: true, data: pagos });
  } catch (error: any) {
    console.error('[CALENDARIO] Error en getPagosDelMes:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPagosProximos = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;
    
    console.log(' [CALENDARIO] getPagosProximos llamado');
    console.log('   - Usuario:', usuarioId);
    
    const hoy = new Date();
    const en7Dias = new Date();
    en7Dias.setDate(hoy.getDate() + 7);
    
    const pagos = await Pago.findAll({
      where: {
        UsuarioID: usuarioId,
        Estado: 'Pendiente',
        FechaVencimiento: {
          [Op.between]: [hoy, en7Dias]
        }
      },
      order: [['FechaVencimiento', 'ASC']]
    });
    
    console.log('   - Pagos próximos encontrados:', pagos.length);
    
    res.json({ success: true, data: pagos });
  } catch (error: any) {
    console.error('[CALENDARIO] Error en getPagosProximos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPagosVencidos = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).user.UsuarioID;
    
    console.log(' [CALENDARIO] getPagosVencidos llamado');
    console.log('   - Usuario:', usuarioId);
    
    const hoy = new Date();
    
    const pagos = await Pago.findAll({
      where: {
        UsuarioID: usuarioId,
        Estado: 'Pendiente',
        FechaVencimiento: {
          [Op.lt]: hoy
        }
      },
      order: [['FechaVencimiento', 'ASC']]
    });
    
    console.log('   - Pagos vencidos encontrados:', pagos.length);
    
    res.json({ success: true, data: pagos });
  } catch (error: any) {
    console.error('[CALENDARIO] Error en getPagosVencidos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const registrarPago = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fechaPago, formaPago, referencia } = req.body;
    
    const pago = await Pago.findByPk(id);
    
    if (!pago) {
      return res.status(404).json({ success: false, message: 'Pago no encontrado' });
    }
    
    await pago.update({
      Estado: 'Pagado',
      FechaPago: fechaPago || new Date(),
      FormaPago: formaPago,
      ReferenciaPago: referencia
    });
    
    console.log(' Pago registrado:', id);
    
    res.json({ success: true, message: 'Pago registrado exitosamente', data: pago });
  } catch (error: any) {
    console.error(' Error al registrar pago:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cron Job para recordatorios
export const iniciarRecordatorios = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Verificando pagos próximos a vencer...');
    // Lógica de recordatorios
  });
};