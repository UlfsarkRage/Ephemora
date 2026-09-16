import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface MenuOption {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  backgroundColor: string;
  accentColor: string;
}

export const MENU_OPTIONS: MenuOption[] = [
  {
    id: 1,
    title: 'Dashboard Zen',
    subtitle: 'Resumen general y métricas del día',
    icon: '📊',
    backgroundColor: '#0F172A',
    accentColor: '#38BDF8',
  },
  {
    id: 2,
    title: 'Calendario & Bloques',
    subtitle: 'Planificación modular de actividades',
    icon: '📅',
    backgroundColor: '#064E3B',
    accentColor: '#34D399',
  },
  {
    id: 3,
    title: 'Pausas Activas & Descanso',
    subtitle: 'Temporizadores y relajación física',
    icon: '🧘',
    backgroundColor: '#3B0764',
    accentColor: '#C084FC',
  },
  {
    id: 4,
    title: 'Estadísticas de Hábitos',
    subtitle: 'Historial de consistencia y energía',
    icon: '📈',
    backgroundColor: '#451A03',
    accentColor: '#FBBF24',
  },
  {
    id: 5,
    title: 'Ajustes & Sistema',
    subtitle: 'Preferencias, SQLite y seguridad AES',
    icon: '⚙️',
    backgroundColor: '#134E4A',
    accentColor: '#2DD4BF',
  },
];

interface HamburgerMenuProps {
  visible: boolean;
  selectedOptionId: number;
  onSelectOption: (option: MenuOption) => void;
  onClose: () => void;
}

export default function HamburgerMenu({
  visible,
  selectedOptionId,
  onSelectOption,
  onClose,
}: HamburgerMenuProps) {
  const handleOptionPress = (option: MenuOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectOption(option);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.drawerCard} onPress={(e) => e.stopPropagation()}>
          {/* Header del Menú */}
          <View style={styles.menuHeader}>
            <View>
              <Text style={styles.menuTitle}>Menú de Vistas</Text>
              <Text style={styles.menuSubtitle}>Selecciona un módulo para cambiar el fondo</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.optionsList}>
            {MENU_OPTIONS.map((option) => {
              const isSelected = option.id === selectedOptionId;
              return (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.7}
                  onPress={() => handleOptionPress(option)}
                  style={[
                    styles.optionItem,
                    isSelected && {
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      borderColor: option.accentColor,
                    },
                  ]}
                >
                  <View style={[styles.iconBox, { backgroundColor: option.backgroundColor, borderColor: option.accentColor }]}>
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                  </View>

                  <View style={styles.optionInfo}>
                    <Text style={[styles.optionTitle, isSelected && { color: option.accentColor }]}>
                      {option.title}
                    </Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>

                  <View style={styles.colorIndicator}>
                    <View
                      style={[
                        styles.colorDot,
                        { backgroundColor: option.backgroundColor, borderColor: option.accentColor },
                      ]}
                    />
                    {isSelected && <Text style={[styles.activeTag, { color: option.accentColor }]}>Activo</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer Informativo */}
          <View style={styles.footerNote}>
            <Text style={styles.footerText}>
              💡 El Header superior permanecerá fijo independientemente del módulo y del scroll.
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  drawerCard: {
    width: '100%',
    maxHeight: '82%',
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionsList: {
    paddingVertical: 4,
    gap: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  optionIcon: {
    fontSize: 20,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  optionSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  colorIndicator: {
    alignItems: 'center',
    marginLeft: 8,
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  activeTag: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  footerNote: {
    marginTop: 14,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
  },
});
