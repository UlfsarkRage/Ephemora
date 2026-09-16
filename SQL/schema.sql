-- ==========================================================
-- EPHEMORA DATABASE SCHEMA (SQLite)
-- Modelo de base de datos relacional para usuarios, sesiones
-- y preferencias de la aplicación modular.
-- ==========================================================

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_number INTEGER NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password_encrypted TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Tabla de Preferencias de la Aplicación por Usuario
CREATE TABLE IF NOT EXISTS app_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    active_theme_color TEXT NOT NULL DEFAULT '#121212',
    last_selected_option INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_users_document ON users(document_number);
