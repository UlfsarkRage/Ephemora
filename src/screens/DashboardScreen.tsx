import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import PersistentHeader from '../components/PersistentHeader';
import HamburgerMenu, { MENU_OPTIONS, MenuOption } from '../components/HamburgerMenu';
import ProfileModal from '../components/ProfileModal';
import TouchCounter from '../components/TouchCounter';

export default function DashboardScreen() {
  const [selectedOption, setSelectedOption] = useState<MenuOption>(MENU_OPTIONS[0]);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [isProfileVisible, setIsProfileVisible] = useState<boolean>(false);

  // Renderiza el contenido correspondiente según la opción seleccionada
  const renderOptionContent = () => {
    switch (selectedOption.id) {
      case 1:
        return (
          <View style={styles.contentSection}>
            <View style={[styles.badge, { borderColor: selectedOption.accentColor }]}>
              <Text style={[styles.badgeText, { color: selectedOption.accentColor }]}>
                Módulo 01: Productividad
              </Text>
            </View>
            <Text style={styles.sectionTitle}>Dashboard Zen</Text>
            <Text style={styles.sectionDescription}>
              Bienvenido a tu panel central. Desde aquí supervisarás tus bloques diarios y niveles de concentración.
            </Text>

            {/* Tarjetas de Métricas de ejemplo */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricNumber}>4 / 6</Text>
                <Text style={styles.metricLabel}>Bloques Completados</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={[styles.metricNumber, { color: selectedOption.accentColor }]}>25 min</Text>
                <Text style={styles.metricLabel}>Próxima Pausa Activa</Text>
              </View>
            </View>

            {/* Componente interactivo TouchCounter embebido */}
            <View style={styles.touchCounterWrapper}>
              <Text style={styles.subCardTitle}>⚡ Test de Interacción Táctil y Háptica</Text>
              <View style={styles.touchContainerBox}>
                <TouchCounter />
              </View>
            </View>

            {/* Contenido extenso para demostrar el Scroll con Header Fijo */}
            <View style={styles.extraScrollCards}>
              <Text style={styles.subCardTitle}>📜 Lista de Tareas y Enfoque Diario</Text>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <View key={item} style={styles.taskCard}>
                  <Text style={styles.taskTitle}>Bloque de Enfoque #{item}</Text>
                  <Text style={styles.taskDetails}>
                    Estado: Pendiente • Duración: 45 min • Descanso: 10 min
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.contentSection}>
            <View style={[styles.badge, { borderColor: selectedOption.accentColor }]}>
              <Text style={[styles.badgeText, { color: selectedOption.accentColor }]}>
                Módulo 02: Planificación
              </Text>
            </View>
            <Text style={styles.sectionTitle}>Calendario & Bloques</Text>
            <Text style={styles.sectionDescription}>
              Organización cronológica por bloques de tiempo. Scroll hacia abajo para ver todo tu cronograma.
            </Text>

            <View style={styles.extraScrollCards}>
              {['08:00 AM - Planificación Matutina', '09:30 AM - Sesión Profunda de Código', '11:00 AM - Pausa Activa & Estiramiento', '02:00 PM - Revisión de Arquitectura', '04:30 PM - Cierre de Tareas & Balance'].map((item, idx) => (
                <View key={idx} style={[styles.scheduleCard, { borderLeftColor: selectedOption.accentColor }]}>
                  <Text style={styles.scheduleTime}>{item.split(' - ')[0]}</Text>
                  <Text style={styles.scheduleActivity}>{item.split(' - ')[1]}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.contentSection}>
            <View style={[styles.badge, { borderColor: selectedOption.accentColor }]}>
              <Text style={[styles.badgeText, { color: selectedOption.accentColor }]}>
                Módulo 03: Bienestar
              </Text>
            </View>
            <Text style={styles.sectionTitle}>Pausas Activas & Descanso</Text>
            <Text style={styles.sectionDescription}>
              Espacios de relajación guiada, respiración consciente y desconexión periódica.
            </Text>

            <View style={styles.extraScrollCards}>
              {['Respiración 4-7-8', 'Estiramiento Cervical & Muñecas', 'Descanso Visual 20-20-20', 'Hidratación & Movilidad', 'Caminata Ligera'].map((item, idx) => (
                <View key={idx} style={styles.wellnessCard}>
                  <Text style={styles.wellnessIcon}>🧘</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.wellnessTitle}>{item}</Text>
                    <Text style={styles.wellnessSubtitle}>Recomendado cada 60 minutos de trabajo continuo</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.contentSection}>
            <View style={[styles.badge, { borderColor: selectedOption.accentColor }]}>
              <Text style={[styles.badgeText, { color: selectedOption.accentColor }]}>
                Módulo 04: Rendimiento
              </Text>
            </View>
            <Text style={styles.sectionTitle}>Estadísticas de Hábitos</Text>
            <Text style={styles.sectionDescription}>
              Métricas acumuladas de concentración, cumplimiento de descansos y constancia semanal.
            </Text>

            <View style={styles.extraScrollCards}>
              {['Racha de Enfoque: 7 días consecutivos', 'Pausas Activas Cumplidas: 92%', 'Tiempo Promedio de Bloque: 50 min', 'Eficiencia Energética: Óptima'].map((item, idx) => (
                <View key={idx} style={styles.statCard}>
                  <Text style={styles.statText}>📊 {item}</Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.contentSection}>
            <View style={[styles.badge, { borderColor: selectedOption.accentColor }]}>
              <Text style={[styles.badgeText, { color: selectedOption.accentColor }]}>
                Módulo 05: Sistema
              </Text>
            </View>
            <Text style={styles.sectionTitle}>Ajustes & Sistema</Text>
            <Text style={styles.sectionDescription}>
              Configuraciones generales de la app, persistencia local con SQLite y estado de seguridad AES-256.
            </Text>

            <View style={styles.extraScrollCards}>
              <View style={styles.settingCard}>
                <Text style={styles.settingTitle}>🔐 Encriptación AES-256</Text>
                <Text style={styles.settingStatus}>Estado: Habilitado & Operativo</Text>
              </View>
              <View style={styles.settingCard}>
                <Text style={styles.settingTitle}>💾 Base de Datos SQLite (ephemora.db)</Text>
                <Text style={styles.settingStatus}>Esquema: users, app_settings</Text>
              </View>
              <View style={styles.settingCard}>
                <Text style={styles.settingTitle}>📱 Dispositivo Sincronizado</Text>
                <Text style={styles.settingStatus}>Redmi Note 8 Pro (USB Debugging)</Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor: selectedOption.backgroundColor }]}>
      {/* 1. Header Persistente y Fijo: No se desplaza al scrollear */}
      <PersistentHeader
        title="Ephemora"
        subtitle={selectedOption.title}
        accentColor={selectedOption.accentColor}
        onOpenProfile={() => setIsProfileVisible(true)}
        onOpenMenu={() => setIsMenuVisible(true)}
      />

      {/* 2. Área de Contenido con Scroll */}
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        {renderOptionContent()}
      </ScrollView>

      {/* 3. Menú Hamburguesa con 5 Opciones */}
      <HamburgerMenu
        visible={isMenuVisible}
        selectedOptionId={selectedOption.id}
        onSelectOption={(opt) => setSelectedOption(opt)}
        onClose={() => setIsMenuVisible(false)}
      />

      {/* 4. Modal de Perfil de Usuario */}
      <ProfileModal
        visible={isProfileVisible}
        onClose={() => setIsProfileVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollBody: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  contentSection: {
    gap: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 4,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  touchCounterWrapper: {
    marginVertical: 8,
  },
  subCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  touchContainerBox: {
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  extraScrollCards: {
    gap: 10,
    marginTop: 10,
  },
  taskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  taskDetails: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
  scheduleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 4,
  },
  scheduleTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  scheduleActivity: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
  wellnessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
  wellnessIcon: {
    fontSize: 26,
  },
  wellnessTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  wellnessSubtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 2,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 14,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  settingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 14,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingStatus: {
    fontSize: 12,
    color: '#34D399',
    marginTop: 2,
  },
});
