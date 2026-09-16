import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSession } from '../models/User';
import { UserRepository } from '../models/UserRepository';
import { isDocumentValid, validatePassword } from '../utils/validation';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (documentInput: string, passwordInput: string) => { success: boolean; message?: string };
  register: (documentInput: string, fullName: string, passwordInput: string) => { success: boolean; message?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      // Inicializar base de datos y sembrar usuario de prueba si es necesario
      UserRepository.seedDefaultUser();
    } catch (error) {
      console.error('Error al inicializar la base de datos o usuario por defecto:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (documentInput: string, passwordInput: string): { success: boolean; message?: string } => {
    if (!isDocumentValid(documentInput)) {
      return { success: false, message: 'El documento debe contener únicamente números (entre 5 y 12 dígitos).' };
    }

    const passwordValidation = validatePassword(passwordInput);
    if (!passwordValidation.isValid) {
      return { success: false, message: passwordValidation.errorMessage || 'Contraseña no válida.' };
    }

    const docNumber = parseInt(documentInput.trim(), 10);

    try {
      const authenticatedUser = UserRepository.validateCredentials(docNumber, passwordInput);
      if (!authenticatedUser) {
        return { success: false, message: 'Documento o contraseña incorrectos.' };
      }

      setUser(authenticatedUser);
      return { success: true };
    } catch (error) {
      console.error('Error durante el login:', error);
      return { success: false, message: 'Ocurrió un error inesperado al iniciar sesión.' };
    }
  };

  const register = (documentInput: string, fullName: string, passwordInput: string): { success: boolean; message?: string } => {
    if (!fullName || fullName.trim().length < 3) {
      return { success: false, message: 'Ingresa un nombre completo válido (mínimo 3 caracteres).' };
    }

    if (!isDocumentValid(documentInput)) {
      return { success: false, message: 'El documento debe contener únicamente números (entre 5 y 12 dígitos).' };
    }

    const passwordValidation = validatePassword(passwordInput);
    if (!passwordValidation.isValid) {
      return { success: false, message: passwordValidation.errorMessage || 'Contraseña no cumple con los requisitos de seguridad.' };
    }

    const docNumber = parseInt(documentInput.trim(), 10);

    try {
      const existingUser = UserRepository.findByDocument(docNumber);
      if (existingUser) {
        return { success: false, message: 'Ya existe un usuario registrado con este número de documento.' };
      }

      const newUser = UserRepository.create({
        document_number: docNumber,
        full_name: fullName.trim(),
        plainPassword: passwordInput,
      });

      setUser({
        id: newUser.id,
        document_number: newUser.document_number,
        full_name: newUser.full_name,
        created_at: newUser.created_at,
      });

      return { success: true };
    } catch (error) {
      console.error('Error durante el registro:', error);
      return { success: false, message: 'Error al registrar el usuario en la base de datos.' };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
