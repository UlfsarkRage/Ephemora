/**
 * Definición de entidades y tipos para el modelo de Usuario.
 */

export interface User {
  id: number;
  document_number: number;
  full_name: string;
  password_encrypted: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: number;
  document_number: number;
  full_name: string;
  created_at: string;
}

export interface CreateUserDTO {
  document_number: number;
  full_name: string;
  plainPassword: string;
}
