import * as SQLite from 'expo-sqlite';

const DB_NAME = 'ephemora.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Obtiene o inicializa la conexión sincrónica con la base de datos local SQLite.
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync(DB_NAME);
    initDatabaseSchema(dbInstance);
  }
  return dbInstance;
}

/**
 * Inicializa las tablas y esquemas necesarios si no existen.
 */
export function initDatabaseSchema(db: SQLite.SQLiteDatabase): void {
  try {
    // Activa soporte de llaves foráneas y WAL mode para rendimiento
    db.execSync('PRAGMA foreign_keys = ON;');
    db.execSync('PRAGMA journal_mode = WAL;');

    // Creación de tabla de usuarios
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_number INTEGER NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        password_encrypted TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      );
    `);

    // Creación de tabla de preferencias
    db.execSync(`
      CREATE TABLE IF NOT EXISTS app_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        active_theme_color TEXT NOT NULL DEFAULT '#121212',
        last_selected_option INTEGER NOT NULL DEFAULT 1,
        updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Índice de búsqueda por documento
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_users_document ON users(document_number);
    `);

    console.log('✅ Base de datos SQLite inicializada correctamente en', DB_NAME);
  } catch (error) {
    console.error('❌ Error al inicializar el esquema de SQLite:', error);
    throw error;
  }
}
