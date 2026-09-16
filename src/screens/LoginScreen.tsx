import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthContext';
import { validatePassword, isDocumentValid } from '../utils/validation';

export default function LoginScreen() {
  const { login, register } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [documentInput, setDocumentInput] = useState<string>('');
  const [fullNameInput, setFullNameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const passwordRules = validatePassword(passwordInput);
  const isDocValid = isDocumentValid(documentInput);

  // Manejo de cambio de modo (Login <-> Registro)
  const toggleMode = () => {
    Haptics.selectionAsync();
    setIsRegisterMode(!isRegisterMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // Carga automática de credenciales de prueba pre-sembradas
  const fillDemoCredentials = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDocumentInput('1098765432');
    setPasswordInput('Password#2026');
    setErrorMsg(null);
  };

  const handleSubmit = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isDocValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMsg('El documento debe ser un número entero (5 a 12 dígitos sin puntos ni letras).');
      return;
    }

    if (!passwordRules.isValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMsg(passwordRules.errorMessage || 'La contraseña no cumple los requisitos.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (isRegisterMode) {
        const res = register(documentInput, fullNameInput, passwordInput);
        setIsSubmitting(false);
        if (!res.success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setErrorMsg(res.message || 'Error al registrar.');
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        const res = login(documentInput, passwordInput);
        setIsSubmitting(false);
        if (!res.success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setErrorMsg(res.message || 'Error al iniciar sesión.');
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    }, 250);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo y Encabezado */}
        <View style={styles.headerArea}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>✦</Text>
          </View>
          <Text style={styles.title}>Ephemora</Text>
          <Text style={styles.subtitle}>
            {isRegisterMode ? 'Crea tu cuenta segura' : 'Ingresa a tu espacio de productividad'}
          </Text>
          <View style={styles.securityTag}>
            <Text style={styles.securityTagText}>🔒 Seguridad SQLite & AES-256</Text>
          </View>
        </View>

        {/* Mensajes de Alerta */}
        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>⚠️ {errorMsg}</Text>
          </View>
        ) : null}

        {successMsg ? (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>✅ {successMsg}</Text>
          </View>
        ) : null}

        {/* Formulario */}
        <View style={styles.formCard}>
          {/* Campo Nombre Completo (Solo en Registro) */}
          {isRegisterMode && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Nicolas Admin"
                placeholderTextColor="#64748B"
                value={fullNameInput}
                onChangeText={setFullNameInput}
                autoCapitalize="words"
              />
            </View>
          )}

          {/* Campo Documento */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>Número de Documento (ID)</Text>
              {documentInput.length > 0 && (
                <Text style={[styles.validationHint, isDocValid ? styles.textSuccess : styles.textError]}>
                  {isDocValid ? '✓ Válido' : '✕ Solo números (5-12 dig)'}
                </Text>
              )}
            </View>
            <TextInput
              style={[styles.input, documentInput.length > 0 && (isDocValid ? styles.inputValid : styles.inputInvalid)]}
              placeholder="Ej. 1098765432"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              value={documentInput}
              onChangeText={(val) => setDocumentInput(val.replace(/\D/g, ''))}
              maxLength={12}
            />
          </View>

          {/* Campo Contraseña */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.togglePasswordText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                passwordInput.length > 0 && (passwordRules.isValid ? styles.inputValid : styles.inputInvalid),
              ]}
              placeholder="Ej. Password#2026"
              placeholderTextColor="#64748B"
              secureTextEntry={!showPassword}
              value={passwordInput}
              onChangeText={setPasswordInput}
              autoCapitalize="none"
            />
          </View>

          {/* Requisitos visuales de la Contraseña en tiempo real */}
          {passwordInput.length > 0 && (
            <View style={styles.rulesContainer}>
              <Text style={styles.rulesTitle}>Requisitos de Seguridad (AES-256):</Text>
              <View style={styles.ruleItem}>
                <Text style={passwordRules.hasMinLength ? styles.ruleSuccess : styles.rulePending}>
                  {passwordRules.hasMinLength ? '✓' : '○'} Mínimo 6 caracteres
                </Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={passwordRules.hasUpperCase ? styles.ruleSuccess : styles.rulePending}>
                  {passwordRules.hasUpperCase ? '✓' : '○'} Al menos una mayúscula (A-Z)
                </Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={passwordRules.hasLowerCase ? styles.ruleSuccess : styles.rulePending}>
                  {passwordRules.hasLowerCase ? '✓' : '○'} Al menos una minúscula (a-z)
                </Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={passwordRules.hasNumber ? styles.ruleSuccess : styles.rulePending}>
                  {passwordRules.hasNumber ? '✓' : '○'} Al menos un número (0-9)
                </Text>
              </View>
              <View style={styles.ruleItem}>
                <Text style={passwordRules.hasSpecialChar ? styles.ruleSuccess : styles.rulePending}>
                  {passwordRules.hasSpecialChar ? '✓' : '○'} Al menos un carácter especial (!@#$%*...)
                </Text>
              </View>
            </View>
          )}

          {/* Botón Principal */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isRegisterMode ? 'Registrar Usuario' : 'Iniciar Sesión'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Botón de Relleno Rápido de Datos Demo */}
          {!isRegisterMode && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={fillDemoCredentials}
              style={styles.demoButton}
            >
              <Text style={styles.demoButtonText}>⚡ Autocompletar Usuario Demo</Text>
            </TouchableOpacity>
          )}

          {/* Alternar entre Login y Registro */}
          <View style={styles.switchModeArea}>
            <Text style={styles.switchModeLabel}>
              {isRegisterMode ? '¿Ya tienes una cuenta registrada?' : '¿No tienes cuenta aún?'}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.switchModeLink}>
                {isRegisterMode ? 'Inicia sesión aquí' : 'Crea una cuenta aquí'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  logoText: {
    fontSize: 28,
    color: '#0F172A',
    fontWeight: '900',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  securityTag: {
    marginTop: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  securityTagText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  successBanner: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#22C55E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  successBannerText: {
    color: '#86EFAC',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#131C2E',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  validationHint: {
    fontSize: 11,
    fontWeight: '600',
  },
  textSuccess: {
    color: '#4ADE80',
  },
  textError: {
    color: '#F87171',
  },
  togglePasswordText: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0B111E',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  inputValid: {
    borderColor: '#22C55E',
  },
  inputInvalid: {
    borderColor: '#EF4444',
  },
  rulesContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  rulesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  ruleItem: {
    marginVertical: 2,
  },
  ruleSuccess: {
    fontSize: 11,
    color: '#4ADE80',
    fontWeight: '600',
  },
  rulePending: {
    fontSize: 11,
    color: '#64748B',
  },
  submitButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 16,
  },
  demoButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  switchModeArea: {
    marginTop: 18,
    alignItems: 'center',
    gap: 4,
  },
  switchModeLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  switchModeLink: {
    fontSize: 13,
    color: '#38BDF8',
    fontWeight: '700',
  },
});
