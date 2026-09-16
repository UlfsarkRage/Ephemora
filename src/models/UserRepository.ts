import { getDatabase } from '../database/sqlite';
import { User, CreateUserDTO, UserSession } from './User';
import { encryptAES256, decryptAES256 } from '../utils/crypto';

/**
 * Repositorio / Capa ORM de Acceso a Datos para Usuarios.
 * Diseñado bajo el patrón Repository para desacoplar la persistencia en SQLite
 * y facilitar una futura migración a una API REST o base de datos externa.
 */
export class UserRepository {
  /**
   * Busca un usuario por su número de documento.
   */
  static findByDocument(documentNumber: number): User | null {
    try {
      const db = getDatabase();
      const num = Number(documentNumber);
      const result = db.getFirstSync<User>(
        'SELECT * FROM users WHERE document_number = ? LIMIT 1;',
        [num]
      );
      return result || null;
    } catch (error) {
      console.error('❌ Error en UserRepository.findByDocument:', error);
      return null;
    }
  }

  /**
   * Busca un usuario por su ID primario.
   */
  static findById(id: number): User | null {
    try {
      const db = getDatabase();
      const result = db.getFirstSync<User>(
        'SELECT * FROM users WHERE id = ? LIMIT 1;',
        [id]
      );
      return result || null;
    } catch (error) {
      console.error('❌ Error en UserRepository.findById:', error);
      return null;
    }
  }

  /**
   * Crea y persiste un nuevo usuario con su contraseña cifrada mediante AES-256.
   */
  static create(data: CreateUserDTO): User {
    const db = getDatabase();
    
    // Encriptar la contraseña con AES-256 antes de guardarla en la base de datos
    const encryptedPassword = encryptAES256(data.plainPassword);

    console.log(`🔒 Guardando usuario Doc: ${data.document_number} con contraseña AES-256 cifrada:`, encryptedPassword.substring(0, 16) + '...');

    const result = db.runSync(
      `INSERT INTO users (document_number, full_name, password_encrypted) 
       VALUES (?, ?, ?);`,
      [Number(data.document_number), data.full_name, encryptedPassword]
    );

    const createdUser = this.findById(result.lastInsertRowId);
    if (!createdUser) {
      throw new Error('No se pudo recuperar el usuario recién creado.');
    }

    return createdUser;
  }

  /**
   * Valida las credenciales de inicio de sesión:
   * 1. Obtiene el usuario por documento
   * 2. Desencripta la contraseña almacenada con AES-256 y compara con el texto plano proporcionado
   */
  static validateCredentials(documentNumber: number, plainPassword: string): UserSession | null {
    console.log('🔍 [Auth] Validando credenciales para documento:', documentNumber);
    const user = this.findByDocument(documentNumber);
    
    if (!user) {
      console.warn(`⚠️ [Auth] Usuario con documento ${documentNumber} NO encontrado en la base de datos.`);
      // Si es el usuario demo y no existe por alguna razón, sembrarlo y reintentar
      if (Number(documentNumber) === 1098765432) {
        console.log('🌱 [Auth] Auto-sembrando usuario demo 1098765432...');
        this.seedDefaultUser();
        const demoUser = this.findByDocument(documentNumber);
        if (demoUser) {
          const dec = decryptAES256(demoUser.password_encrypted);
          if (dec === plainPassword) {
            console.log('✅ [Auth] Autenticación demo exitosa tras auto-siembra.');
            return {
              id: demoUser.id,
              document_number: demoUser.document_number,
              full_name: demoUser.full_name,
              created_at: demoUser.created_at,
            };
          }
        }
      }
      return null;
    }

    // Desencriptamos la contraseña almacenada con AES-256 para verificar
    const decryptedPassword = decryptAES256(user.password_encrypted);
    const isMatch = decryptedPassword === plainPassword;

    console.log(`🔑 [Auth] Validación contraseña para Doc ${documentNumber}:`, isMatch ? '✅ Coincide' : '❌ No coincide');

    if (isMatch) {
      return {
        id: user.id,
        document_number: user.document_number,
        full_name: user.full_name,
        created_at: user.created_at,
      };
    }

    return null;
  }

  /**
   * Inicializa o repara el usuario por defecto de demostración.
   */
  static seedDefaultUser(): void {
    try {
      const db = getDatabase();
      const existing = this.findByDocument(1098765432);
      if (!existing) {
        console.log('🌱 Sembrando usuario por defecto en SQLite...');
        this.create({
          document_number: 1098765432,
          full_name: 'Nicolas Admin',
          plainPassword: 'Password#2026',
        });
        console.log('✅ Usuario por defecto creado: Doc: 1098765432 | Pass: Password#2026');
      } else {
        console.log('ℹ️ Usuario demo ya presente en SQLite (ID:', existing.id, ')');
        // Asegurar que la contraseña coincida con 'Password#2026'
        const decrypted = decryptAES256(existing.password_encrypted);
        if (decrypted !== 'Password#2026') {
          console.log('🔄 Re-encriptando contraseña del usuario demo con AES-256...');
          const newEnc = encryptAES256('Password#2026');
          db.runSync(
            'UPDATE users SET password_encrypted = ? WHERE document_number = ?;',
            [newEnc, 1098765432]
          );
          console.log('✅ Contraseña del usuario demo actualizada exitosamente.');
        }
      }
    } catch (error) {
      console.error('❌ Error al sembrar usuario demo:', error);
    }
  }
}
