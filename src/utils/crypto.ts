import CryptoJS from 'crypto-js';

// Polyfill seguro para React Native / Hermes (evita fallos de generador aleatorio)
if (typeof (CryptoJS.lib.WordArray as any).random === 'function') {
  const originalRandom = (CryptoJS.lib.WordArray as any).random;
  (CryptoJS.lib.WordArray as any).random = function (nBytes: number) {
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
        return originalRandom.call(CryptoJS.lib.WordArray, nBytes);
      }
    } catch {
      // Fallback a PRNG seguro en JS
    }
    const words: number[] = [];
    for (let i = 0; i < nBytes; i += 4) {
      words.push((Math.random() * 0x100000000) | 0);
    }
    return CryptoJS.lib.WordArray.create(words, nBytes);
  };
}

/**
 * Obtiene la clave de encriptación fija desde las variables de entorno (.env).
 * Blindaje de seguridad: Si no existe el archivo .env o la variable ENCRYP_KEY está vacía,
 * la aplicación bloquea cualquier operación de cifrado y descifrado.
 */
export function getEncryptionKey(): string {
  const envKey = process.env.EXPO_PUBLIC_ENCRYP_KEY || process.env.ENCRYP_KEY;
  if (!envKey || envKey.trim() === '') {
    const errorMsg = '⛔ [SEGURIDAD] Clave ENCRYP_KEY no configurada en el archivo .env. Acceso y operaciones bloqueadas.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  return envKey.trim();
}

/**
 * Deriva una clave de 256 bits (SHA-256) y un vector de inicialización de 128 bits (MD5)
 * a partir de la clave secreta del .env, asegurando cifrado determinístico AES-256.
 */
function deriveKeyAndIV(secret: string) {
  const key256 = CryptoJS.SHA256(secret);
  const iv128 = CryptoJS.MD5(secret);
  return { key: key256, iv: iv128 };
}

/**
 * Encripta un texto plano utilizando el algoritmo AES-256 (Modo CBC con padding PKCS7)
 * usando la clave fija configurada en el .env.
 * @param plainText Texto que se desea encriptar (ej. contraseña).
 * @param customKey Clave opcional (por defecto obtiene la clave del .env).
 * @returns Cadena en formato Base64 con el contenido encriptado.
 */
export function encryptAES256(plainText: string, customKey?: string): string {
  if (!plainText) return '';
  try {
    const secretKey = customKey || getEncryptionKey();
    const { key, iv } = deriveKeyAndIV(secretKey);
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  } catch (error) {
    console.error('❌ Error al encriptar con AES-256:', error);
    throw error;
  }
}

/**
 * Desencripta un texto cifrado en formato AES-256 (Modo CBC con padding PKCS7)
 * usando la clave fija configurada en el .env.
 * @param cipherText Texto encriptado previamente en Base64.
 * @param customKey Clave opcional (por defecto obtiene la clave del .env).
 * @returns Texto plano original.
 */
export function decryptAES256(cipherText: string, customKey?: string): string {
  if (!cipherText) return '';
  try {
    const secretKey = customKey || getEncryptionKey();
    const { key, iv } = deriveKeyAndIV(secretKey);
    const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const originalText = decrypted.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    console.error('❌ Error al desencriptar con AES-256:', error);
    throw error;
  }
}
