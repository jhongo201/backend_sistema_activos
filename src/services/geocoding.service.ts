import axios from 'axios';

export interface Coordenadas {
  lat: number;
  lng: number;
}

/**
 * Servicio de geocodificación usando Nominatim (OpenStreetMap)
 * API gratuita con límite de 1 request por segundo
 */
export class GeocodingService {
  private static readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
  private static readonly USER_AGENT = 'SistemaActivosApp/1.0';

  /**
   * Geocodificar una dirección usando Nominatim
   * Intenta con diferentes niveles de detalle si falla
   */
  static async geocodificarDireccion(
    direccion: string,
    ciudad: string,
    departamento: string
  ): Promise<Coordenadas | null> {
    try {
      // Limpiar dirección (remover detalles como Torre, Apto, etc.)
      const direccionLimpia = direccion
        .replace(/Torre\s+[A-Z0-9]+/gi, '')
        .replace(/Apto\.?\s+[A-Z0-9]+/gi, '')
        .replace(/Apartamento\s+[A-Z0-9]+/gi, '')
        .replace(/Interior\s+[A-Z0-9]+/gi, '')
        .replace(/Casa\s+[A-Z0-9]+/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Intentar con diferentes combinaciones
      const intentos = [
        `${direccionLimpia}, ${ciudad}, ${departamento}, Colombia`,
        `${direccionLimpia}, ${ciudad}, Colombia`,
        `${ciudad}, ${departamento}, Colombia`,
      ];

      for (const direccionCompleta of intentos) {
        console.log(`🔍 Intentando geocodificar: ${direccionCompleta}`);

        const response = await axios.get(this.NOMINATIM_URL, {
          params: {
            q: direccionCompleta,
            format: 'json',
            limit: 1,
            countrycodes: 'co',
          },
          headers: {
            'User-Agent': this.USER_AGENT,
          },
          timeout: 10000,
        });

        if (response.data && response.data.length > 0) {
          const result = response.data[0];
          console.log(`✅ Coordenadas encontradas: ${result.lat}, ${result.lon}`);
          return {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
          };
        }

        // Pequeño delay entre intentos
        await this.delay(200);
      }

      console.warn(`❌ No se encontraron coordenadas después de ${intentos.length} intentos`);
      return null;
    } catch (error: any) {
      console.error('Error en geocodificación:', error.message);
      return null;
    }
  }

  /**
   * Delay helper para respetar rate limits
   */
  static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default GeocodingService;
