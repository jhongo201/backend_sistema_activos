import { Request, Response } from 'express';
import calculadoraService from '../services/calculadora.service';

export const calcularInmueble = (req: Request, res: Response) => {
  try {
    const resultado = calculadoraService.calcularInmueble(req.body);
    res.json({ success: true, data: resultado });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const calcularVehiculo = (req: Request, res: Response) => {
  try {
    const resultado = calculadoraService.calcularVehiculo(req.body);
    res.json({ success: true, data: resultado });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const calcularHerencia = (req: Request, res: Response) => {
  try {
    const resultado = calculadoraService.calcularHerencia(req.body);
    res.json({ success: true, data: resultado });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const calcularLoteria = (req: Request, res: Response) => {
  try {
    const { valorPremio } = req.body;
    const resultado = calculadoraService.calcularLoteria(valorPremio);
    res.json({ success: true, data: resultado });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
