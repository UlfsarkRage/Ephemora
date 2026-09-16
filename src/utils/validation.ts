/**
 * Utilidades de validación para documentos y contraseñas según las reglas del negocio.
 */

export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  errorMessage?: string;
}

/**
 * Valida que el documento ingresado sea estrictamente numérico (entero positivo).
 * @param document Número de documento en formato string.
 */
export function isDocumentValid(document: string): boolean {
  if (!document || document.trim() === '') return false;
  // Solo dígitos numéricos del 0 al 9, mínimo 5 dígitos y máximo 12
  const documentRegex = /^\d{5,12}$/;
  return documentRegex.test(document.trim());
}

/**
 * Convierte el documento a entero numérico limpio.
 */
export function parseDocumentNumber(document: string): number {
  const cleaned = document.replace(/\D/g, '');
  return parseInt(cleaned, 10) || 0;
}

/**
 * Valida la complejidad de la contraseña:
 * - Mínimo 6 caracteres
 * - Al menos una letra mayúscula [A-Z]
 * - Al menos una letra minúscula [a-z]
 * - Al menos un número [0-9]
 * - Al menos un carácter especial [!@#$%^&*(),.?":{}|<>\-_+=]
 */
export function validatePassword(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\-_+=~`[\]/\\]/.test(password);

  const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

  let errorMessage: string | undefined;
  if (!isValid) {
    if (!hasMinLength) errorMessage = 'Debe tener al menos 6 caracteres';
    else if (!hasUpperCase) errorMessage = 'Debe incluir al menos una letra mayúscula';
    else if (!hasLowerCase) errorMessage = 'Debe incluir al menos una letra minúscula';
    else if (!hasNumber) errorMessage = 'Debe incluir al menos un número';
    else if (!hasSpecialChar) errorMessage = 'Debe incluir al menos un carácter especial (!@#$%*...)';
  }

  return {
    isValid,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    errorMessage,
  };
}
