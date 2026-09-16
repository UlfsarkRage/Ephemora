import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';

interface PersistentHeaderProps {
  title?: string;
  subtitle?: string;
  onOpenProfile: () => void;
  onOpenMenu: () => void;
  accentColor?: string;
}

/**
 * Header persistente y responsivo.
 * Se mantiene fijo en la parte superior independientemente del scroll del contenido.
 */
export default function PersistentHeader({
  title = 'Ephemora',
  subtitle,
  onOpenProfile,
  onOpenMenu,
  accentColor = '#38BDF8',
}: PersistentHeaderProps) {
  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOpenProfile();
  };

  const handleMenuPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOpenMenu();
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerContainer}>
        {/* Lado Izquierdo: Botón de Perfil */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleProfilePress}
          style={styles.iconButton}
          accessibilityLabel="Abrir perfil de usuario"
        >
          <View style={[styles.avatarCircle, { borderColor: accentColor }]}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
        </TouchableOpacity>

        {/* Centro: Título de la Aplicación y Subtítulo */}
        <View style={styles.titleContainer}>
          <Text style={styles.appName}>
            {title} <Text style={{ color: accentColor }}>✦</Text>
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Lado Derecho: Menú Hamburguesa */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleMenuPress}
          style={styles.iconButton}
          accessibilityLabel="Abrir menú de opciones"
        >
          <View style={styles.hamburgerIconContainer}>
            <View style={[styles.hamburgerLine, { backgroundColor: '#FFFFFF' }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: accentColor, width: 18 }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: '#FFFFFF' }]} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.bottomBorder, { backgroundColor: `${accentColor}33` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    backgroundColor: '#0F172A',
    zIndex: 1000,
    elevation: 8,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 6 : 48,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  avatarIcon: {
    fontSize: 18,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  appName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 1,
  },
  hamburgerIconContainer: {
    width: 24,
    height: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  hamburgerLine: {
    height: 2.5,
    width: 22,
    borderRadius: 2,
  },
  bottomBorder: {
    height: 2,
    width: '100%',
  },
});
