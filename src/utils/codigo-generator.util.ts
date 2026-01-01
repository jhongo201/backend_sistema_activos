import sequelize from '../config/database';
import Activo from '../models/Activo.model';

/**
 * Utilidad para generar códigos internos automáticamente
 */
export class CodigoGeneratorUtil {
  /**
   * Generar código interno para vehículo
   * Formato: VEH-YYYY-NNNN
   * Ejemplo: VEH-2024-0001
   */
  static async generarCodigoVehiculo(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `VEH-${year}`;

    // Buscar el último código del año actual
    const ultimoCodigo = await Activo.findOne({
      where: {
        TipoActivoID: 1, // 1 = Vehículo
      },
      attributes: ['CodigoInterno'],
      order: [['ActivoID', 'DESC']],
      raw: true,
    });

    let numeroSecuencial = 1;

    if (ultimoCodigo && ultimoCodigo.CodigoInterno) {
      // Extraer el número secuencial del último código
      const match = ultimoCodigo.CodigoInterno.match(/VEH-(\d{4})-(\d{4})/);
      
      if (match) {
        const yearCodigo = parseInt(match[1]);
        const numero = parseInt(match[2]);
        
        // Si es del mismo año, incrementar el número
        if (yearCodigo === year) {
          numeroSecuencial = numero + 1;
        }
      }
    }

    // Formatear con ceros a la izquierda (4 dígitos)
    const numeroFormateado = numeroSecuencial.toString().padStart(4, '0');
    
    return `${prefix}-${numeroFormateado}`;
  }

  /**
   * Generar código interno para propiedad
   * Formato: PROP-YYYY-NNNN
   * Ejemplo: PROP-2024-0001
   */
  static async generarCodigoPropiedad(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PROP-${year}`;

    // Buscar el último código del año actual
    const ultimoCodigo = await Activo.findOne({
      where: {
        TipoActivoID: 2, // 2 = Propiedad
      },
      attributes: ['CodigoInterno'],
      order: [['ActivoID', 'DESC']],
      raw: true,
    });

    let numeroSecuencial = 1;

    if (ultimoCodigo && ultimoCodigo.CodigoInterno) {
      // Extraer el número secuencial del último código
      const match = ultimoCodigo.CodigoInterno.match(/PROP-(\d{4})-(\d{4})/);
      
      if (match) {
        const yearCodigo = parseInt(match[1]);
        const numero = parseInt(match[2]);
        
        // Si es del mismo año, incrementar el número
        if (yearCodigo === year) {
          numeroSecuencial = numero + 1;
        }
      }
    }

    // Formatear con ceros a la izquierda (4 dígitos)
    const numeroFormateado = numeroSecuencial.toString().padStart(4, '0');
    
    return `${prefix}-${numeroFormateado}`;
  }

  /**
   * Verificar si un código interno ya existe
   */
  static async codigoExiste(codigo: string): Promise<boolean> {
    const existente = await Activo.findOne({
      where: { CodigoInterno: codigo },
    });
    return !!existente;
  }

  /**
   * Generar código único con reintentos en caso de colisión
   */
  static async generarCodigoUnico(
    tipo: 'vehiculo' | 'propiedad',
    maxReintentos: number = 5
  ): Promise<string> {
    for (let i = 0; i < maxReintentos; i++) {
      const codigo = tipo === 'vehiculo' 
        ? await this.generarCodigoVehiculo()
        : await this.generarCodigoPropiedad();

      const existe = await this.codigoExiste(codigo);
      
      if (!existe) {
        return codigo;
      }

      // Si existe, esperar un momento y reintentar
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Si después de varios reintentos no se pudo generar, agregar timestamp
    const timestamp = Date.now().toString().slice(-4);
    const prefix = tipo === 'vehiculo' ? 'VEH' : 'PROP';
    const year = new Date().getFullYear();
    
    return `${prefix}-${year}-${timestamp}`;
  }

  /**
   * Validar formato de código interno
   */
  static validarFormato(codigo: string, tipo: 'vehiculo' | 'propiedad'): boolean {
    const prefix = tipo === 'vehiculo' ? 'VEH' : 'PROP';
    const regex = new RegExp(`^${prefix}-\\d{4}-\\d{4}$`);
    return regex.test(codigo);
  }
}
