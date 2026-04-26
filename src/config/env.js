/**
 * Configuración centralizada de variables de entorno.
 * Expo carga automáticamente .env.development o .env.production
 * basándose en el modo de ejecución.
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('Advertencia: EXPO_PUBLIC_API_URL no está definida en el archivo .env');
}
