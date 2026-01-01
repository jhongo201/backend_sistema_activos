// Valores DIAN 2025
const VALORES_DIAN = {
  UVT: 47065,
  EXENCIONES: {
    INMUEBLES: 7300, // UVT
    HERENCIAS: 3490  // UVT
  },
  TARIFAS: {
    GANANCIA_OCASIONAL: 10, // %
    LOTERIAS: 20 // %
  }
};

interface CalculoBase {
  precioVenta: number;
  costoAdquisicion: number;
  mejoras?: number;
  costosVenta?: number;
}

interface CalculoHerencia {
  valorHerencia: number;
  deudasCausante?: number;
  gastosFunerarios?: number;
}

interface ResultadoCalculo {
  gananciaBruta: number;
  exencion: number;
  gananciaGravable: number;
  tarifaImpuesto: number;
  impuestoAPagar: number;
  detalle: any;
}

class CalculadoraService {
  /**
   * Calcular venta de inmueble
   */
  calcularInmueble(datos: CalculoBase): ResultadoCalculo {
    const { precioVenta, costoAdquisicion, mejoras = 0, costosVenta = 0 } = datos;
    
    // Ganancia bruta
    const gananciaBruta = precioVenta - costoAdquisicion - mejoras - costosVenta;
    
    // Exención (7,300 UVT)
    const exencion = VALORES_DIAN.EXENCIONES.INMUEBLES * VALORES_DIAN.UVT;
    
    // Ganancia gravable
    let gananciaGravable = gananciaBruta - exencion;
    if (gananciaGravable < 0) gananciaGravable = 0;
    
    // Impuesto (10%)
    const tarifaImpuesto = VALORES_DIAN.TARIFAS.GANANCIA_OCASIONAL;
    const impuestoAPagar = gananciaGravable * (tarifaImpuesto / 100);
    
    return {
      gananciaBruta,
      exencion,
      gananciaGravable,
      tarifaImpuesto,
      impuestoAPagar,
      detalle: {
        precioVenta,
        costoAdquisicion,
        mejoras,
        costosVenta,
        uvt: VALORES_DIAN.UVT,
        uvtExencion: VALORES_DIAN.EXENCIONES.INMUEBLES
      }
    };
  }

  /**
   * Calcular venta de vehículo
   */
  calcularVehiculo(datos: CalculoBase): ResultadoCalculo {
    const { precioVenta, costoAdquisicion, mejoras = 0, costosVenta = 0 } = datos;
    
    const gananciaBruta = precioVenta - costoAdquisicion - mejoras - costosVenta;
    const exencion = 0; // No hay exención para vehículos
    let gananciaGravable = gananciaBruta;
    if (gananciaGravable < 0) gananciaGravable = 0;
    
    const tarifaImpuesto = VALORES_DIAN.TARIFAS.GANANCIA_OCASIONAL;
    const impuestoAPagar = gananciaGravable * (tarifaImpuesto / 100);
    
    return {
      gananciaBruta,
      exencion,
      gananciaGravable,
      tarifaImpuesto,
      impuestoAPagar,
      detalle: { precioVenta, costoAdquisicion, mejoras, costosVenta }
    };
  }

  /**
   * Calcular herencia
   */
  calcularHerencia(datos: CalculoHerencia): ResultadoCalculo {
    const { valorHerencia, deudasCausante = 0, gastosFunerarios = 0 } = datos;
    
    const gananciaBruta = valorHerencia - deudasCausante - gastosFunerarios;
    const exencion = VALORES_DIAN.EXENCIONES.HERENCIAS * VALORES_DIAN.UVT;
    
    let gananciaGravable = gananciaBruta - exencion;
    if (gananciaGravable < 0) gananciaGravable = 0;
    
    const tarifaImpuesto = VALORES_DIAN.TARIFAS.GANANCIA_OCASIONAL;
    const impuestoAPagar = gananciaGravable * (tarifaImpuesto / 100);
    
    return {
      gananciaBruta,
      exencion,
      gananciaGravable,
      tarifaImpuesto,
      impuestoAPagar,
      detalle: { valorHerencia, deudasCausante, gastosFunerarios, uvt: VALORES_DIAN.UVT }
    };
  }

  /**
   * Calcular lotería/premio
   */
  calcularLoteria(valorPremio: number): ResultadoCalculo {
    const gananciaBruta = valorPremio;
    const exencion = 0; // No hay exención
    const gananciaGravable = gananciaBruta;
    const tarifaImpuesto = VALORES_DIAN.TARIFAS.LOTERIAS; // 20%
    const impuestoAPagar = gananciaGravable * (tarifaImpuesto / 100);
    
    return {
      gananciaBruta,
      exencion,
      gananciaGravable,
      tarifaImpuesto,
      impuestoAPagar,
      detalle: { valorPremio }
    };
  }

  /**
   * Formatear moneda
   */
  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  }
}

export default new CalculadoraService();